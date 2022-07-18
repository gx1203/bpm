<template>
  <div class="w100">
    <el-row class="text-right">
        <el-button  @click="queryContent">{{$t('refresh')}}</el-button>
        <el-button :disabled="!editContent.content && !editContent.childrens" @click="officeClick('edit')">{{$t('edit')}}</el-button>
        <el-button  @click="isSelectVisible = true">{{$t('quote')}}</el-button>
        <el-upload
          :action="action"
          accept=".doc,.docx"
          :on-success="handlerFileUploadSuccess"
          :show-file-list="false"
          class="inline-block margin-r10 margin-l10"
        >
          <el-button size="mini" >{{$t('UploadTheWord')}}</el-button>
        </el-upload>
        <el-button type="primary" @click="officeClick('new')">{{$t('newAdd')}}</el-button>
    </el-row>
    <div class="iframeWord">
      <iframe :src="wordIframe" frameborder="0"></iframe>
      <div class="viewDoc">
        <h1 class="docTitle">
          {{editContent.content}}
        </h1>
        <manage-father :data="editContent.childrens" />
      </div>
    </div>
    <!-- 选择流程 -->
    <select-process
      v-model="isSelectVisible"
      :processlists="processlists"
      :modelId="treeId"
      :selectType="true"
      @confirm="confirmprocess"
    ></select-process>
  </div>
</template>
<script>
import {
  getGroupTreeList
} from '@/bpa/api/componentsApi'
import { queryContent } from '@/bpa/api/processDesignCenter'
import selectProcess from './selectProcess.vue'

import manageFather from './manage_father.vue'

export default {
  name: 'manage',
  components: {
    selectProcess,
    manageFather
  },
  data () {
    return {
      isSelectVisible: false,
      processlists: [],
      wordIframe: '',
      editContent: {}
    }
  },
  props: {
    treeId: {
      type: String,
      default: ''
    },
    listid: {
      type: String,
      default: ''
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    base_url () {
      return process.env.VUE_APP_BASE_URL
    },
    action() {
      return `${this.host}/attach/upload?username=${this.userid}`
      // return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
    }
  },
  mounted() {
    this.queryContent()
  },
  watch: {},
  methods: {
    confirmprocess(arr) {
      console.log(arr)
      if (arr[0].rules == 'N') {
        this.$message({
          message: '该流程目前暂时没有制度文件',
          type: 'error'
        })
        return false
      }
      this.wordIframe = ''
      this.processlists = JSON.parse(JSON.stringify(arr))
      console.log(this.processlists)
      let iframe = `${this.host}/pageOffice/index?type=cite&ids=${this.listid},${this.processlists[0].id}&username=${this.userid}&serverContextPath=${this.base_url}`
      // if (!this.wordIframe) {
      //   this.wordIframe = iframe
      //   return false
      // }
      this.$confirm('确认替换已有的编辑内容吗?', this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.wordIframe = iframe
      })
    },
    handlerFileUploadSuccess(res) {
      console.log(res)
      let iframe = `${this.host}/pageOffice/index?type=upload&ids=${this.listid},${res.id}&username=${this.userid}&serverContextPath=${this.base_url}`
      // if (!this.wordIframe) {
      //   this.wordIframe = iframe
      //   return false
      // }
      this.$confirm('确认替换已有的编辑内容吗?', this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.wordIframe = iframe
      })
    },
    officeClick (type) {
      console.log(type)
      console.log(this.wordIframe)
      this.wordIframe = ''
      switch (true) {
        case type === 'new' :
          let iframe = `${this.host}/pageOffice/index?type=new&ids=${this.listid}&username=${this.userid}&serverContextPath=${this.base_url}`
          // if (!this.wordIframe) {
          //   this.wordIframe = iframe
          //   return false
          // }
          this.$confirm('确认替换已有的编辑内容吗?', this.$t('hintText.hint'), {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }).then(() => {
            this.wordIframe = iframe
          })
          break
        case type === 'edit' :
          this.wordIframe = `${this.host}/pageOffice/index?type=edit&ids=${this.listid}&username=${this.userid}&serverContextPath=${this.base_url}`
          break
      }
    },
    // 获取在线编辑的数据
    queryContent () {
      queryContent(this.listid).then(res => {
        console.log(this.listid)
        console.log(res)
        if (!res) return false
        this.editContent = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.iframeWord {
  width: 100%;
  height: 500px;
  padding-top: 15px;
  iframe{
    width: 100%;
    height: inherit;
    display: none;
  }
  .viewDoc {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .docTitle {
    font-size: 20px;
    text-align: center;
    line-height: 32px;
  }
}
</style>
