<template>
  <div>
    <el-form ref="form" label-width="120px">
      <el-row>
        <el-form-item :label="labelName">
          <span slot-label=""></span>
          <el-upload
            :action="action"
            :on-success="handlerFileUploadSuccess"
            :on-remove="handleRemove"
            :on-error="handlerFileUploadError"
            :before-upload="handlerFileUploadBefore"
            :show-file-list="false"
          >
            <el-button :disabled="!isexct" size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-row>
      <el-table class="main_tab" :data="fileList">
        <el-table-column prop="filename" label="文件名"></el-table-column>
        <el-table-column prop="filesize" label="文件大小"></el-table-column>
        <el-table-column prop="status" label="上传状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :open-delay="1000" class="item" effect="dark" content="删除" placement="top">
              <el-button :disabled="!isexct" @click="deleteFile(scope.$index)" class="no-border" icon="el-icon-delete" circle></el-button>
            </el-tooltip>
            <el-tooltip :open-delay="1000" class="item" effect="dark" content="下载" placement="top">
              <a :href="txdownloadFile(scope.row.fileId)" download>
                <el-button class="no-border" icon="el-icon-download" circle></el-button>
              </a>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import fileOperation from '@/bpa/mixins/fileDownView'
import { createNamespacedHelpers } from 'vuex'
import {
  downloadFile
} from '@/bpa/utils/common'
import { txdownloadFile } from "@/bpa/utils/common";
const userInfo = createNamespacedHelpers('userInfo')
export default {
  name: 'uploadFiles',
  data() {
    return {
      loading: false
    }
  },
  mixins: [fileOperation],
  props: {
    labelName: {
      type: String,
      default: ''
    },
    limitNum: {
      type: Number,
      default: 1
    },
    fileList: {
      type: Array,
      default: () => []
    },
    isexct: {
      type: Boolean
    }
  },
  watch: {
    labelName(val) {
      console.log(val)
    },
    limitNum(val) {
      console.log(val)
    },
    fileList: {
      handler: function(newVal, oldVal) {
        console.log(newVal, oldVal)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    action() {
      return `${this.host}/attach/upload2?username=${this.userid}`
    },
    ...userInfo.mapGetters(['getUserAuthor']),
    download() {
      return this.host + '/sbyt/attach/download/'
    }
  },
  mounted() {
    // 获取当前登录人权限
    this.requireAuthoriy()
  },
  methods: {
    txdownloadFile(fileId) {
      return txdownloadFile(fileId);
    },
    ...userInfo.mapActions(['requireAuthoriy']),
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    deleteFile(index) {
      this.fileList.splice(index, 1)
      this.$emit('confirmUploadFilesList', {
        fileList: this.fileList
      })
    },
    // 上传失败
    handlerFileUploadError(err, file, fileList) {
      this.loading = false
      this.$message({
        type: 'warning',
        message: '主文档上传失败'
      })
    },
    // 上传前
    handlerFileUploadBefore(res) {
      console.log(res)
      this.loading = true
    },
    handlerFileUploadSuccess(res) {
      console.log(res)
      this.loading = false
      if (this.fileList.length === 1) {
        this.$message({
          type: 'warning',
          message: this.labelName + '只能上传一份，请删除后再重新上传'
        })
      } else {
        console.log(res)
        this.fileList.push({
          filename: res.newName,
          filesize: res.size + 'B',
          downloadUrl: this.host + '/attach/download/' + res.id,
          status: '已上传',
          fileId: res.id
        })
        this.$emit('confirmUploadFilesList', {
          fileList: this.fileList
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
