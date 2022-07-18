<template>
  <div class="w100">
    <el-row v-if="existTabField('selectFile', 'refer') && isEdit" class="margin-b15">
      <el-col :span="4" :offset="20" class="clear-fix">
        <el-button class="float-r" type="primary" @click="resetsupport();isFileVisible = true">
          {{ existTabField('selectFile','', true) }}
        </el-button>
      </el-col>
    </el-row>
    <el-table :data="supfilelist" class="main_tab" stripe>
      <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number','', true)" type="index" width="50" />
      <el-table-column v-if="existTabField('fileName', 'refer')" :label="existTabField('fileName','', true)">
        <template slot-scope="scope">
          <p v-for="(item, index) in scope.row.docArr" :key="index">
            <a :href="viewFile(item.docid)" target="_blank">{{ item.name }}</a>
            <a class="margin-l5" :href="downloadFile(item.docid)" target="_blank">
              <i class="el-icon-download" />
            </a>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="existTabField('uploader', 'refer')"
        prop="byName"
        width="100"
        :label="existTabField('uploader','', true)"
      />
      <el-table-column
        v-if="existTabField('uploadTime', 'refer')"
        prop="time"
        width="200"
        :label="existTabField('uploadTime','', true)"
      />
      <el-table-column
        v-if="existTabField('fileType', 'refer')"
        prop="foldername"
        width="120"
        :label="existTabField('fileType','', true)"
      />
      <el-table-column
        v-if="existTabField('remarksDialog', 'refer')"
        prop="description"
        width="200"
        :label="existTabField('remarksDialog','', true)"
      />
      <el-table-column
        v-if="existTabField('operation', 'refer') && isEdit"
        width="80"
        :label="existTabField('operation','', true)"
      >
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="existTabField('delete','', true)"
            placement="top"
          >
            <el-button class="no-border" icon="el-icon-delete" type="text" @click="delFile(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="supportspages.pageNum"
      background
      layout="prev, pager, next, jumper, total"
      :total="supportspages.total"
      @current-change="handleSupportsChange"
    />

    <!-- 制度支持文件 -->
    <el-dialog
      :title="existTabField('addSupportFile', '', true)"
      class="supportDialog"
      :visible.sync="isFileVisible"
      :before-close="handlesupportClose"
      :append-to-body="true"
    >
      <!-- <template slot="title">
        <div class="clear-fix">
          <span class="font14"
            v-if="existTabField('addSupportFile', 'refer')">{{existTabField('addSupportFile', '', true)}}</span>
        </div>
      </template> -->
      <el-form ref="supportRef" label-width="110px" label-position="right" :model="supportform">
        <el-form-item
          v-if="existTabField('fileType', 'refer')"
          :label="existTabField('fileType')"
          prop="foldername"
          :rules="[
            { required: existTabField('fileType', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="supportform.foldername" type="text" disabled />
        </el-form-item>
        <el-form-item
          v-if="existTabField('comments', 'refer')"
          :label="existTabField('comments')"
          prop="description"
          :rules="[
            { required: existTabField('comments', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input v-model="supportform.description" type="textarea" rows="5" resize="none" />
        </el-form-item>
        <el-form-item
          v-if="existTabField('attachmentDialog', 'refer')"
          :label="existTabField('attachmentDialog')"
          prop="supportFile"
          :rules="[
            { required: existTabField('attachmentDialog', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span v-for="(item, index) in supportform.supportFile" :key="item.docid" class="margin-b5 margin-r5">
                  {{ item.name }}
                  <i class="el-icon-close cursor-pointer" @click="delsupportFile(item, index)" />
                </span>
              </p>
            </el-col>
            <el-col :span="4">
              <el-button class="float-r" @click="isGroupVisible = true">
                {{ $t('placeholderText.select') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isFileVisible = false">{{ existTabField('cancel', '', true) }}</el-button>
        <el-button v-if="existTabField('save', 'refer')" type="primary" @click="savesupport">{{ existTabField('save', '', true) }}</el-button>
      </span>
    </el-dialog>
    <!-- 添加附件 -->
    <select-file v-model="isGroupVisible" :page-id="forlderId" @confirm="handlerSelect" />
  </div>
</template>
<script>

import {
  saveDmDoc,
  getDmDoc,
  deleteDmDoc,
  queryDmDocList
} from '@/bpa/api/rulesCenter/handbookFiles'

import { deluploadFile } from '@/bpa/api/common'

import fileOperation from '@/bpa/mixins/fileDownView'

export default {
  name: 'ProcessInsit',
  mixins: [fileOperation],
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    modelid: {
      type: String,
      default: ''
    },
    modeltype: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 制度支持文件
      isFileVisible: false,
      supfilelist: [],
      supportspages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      supportDelFile: [],
      supportform: {
        foldername: '制度相关文档',
        description: '',
        supportFile: []
      },
      supportsrules: {
        foldername: [{ required: true, message: ' ', trigger: 'blur' }],
        description: [{ required: true, message: ' ', trigger: 'blur' }],
        supportFile: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      isGroupVisible: false,
      forlderId: '7A88EC3856C446EBE053BF1A13ACC390'
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .name
    },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    }
  },
  watch: {
    showtabfiled(val) {
      if (this.modeltype === '1') {
        console.log(val)
        this.queryDmDocList(1)
      }
    }
  },
  methods: {
    // 判断条件
    existTabField(pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      const lang = localStorage.getItem('language')
      if (type === 'refer') {
        return !!obj.pname
      } else if (type === 'necessary') {
        return obj.necessary === '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : obj.enname + (!bool ? ":" : "")
      }
    },
    // 获取制度支持文件
    queryDmDocList(pageNum) {
      queryDmDocList({
        attr: {},
        filters: [{ key: 'dmid', opt: 'EQ', type: 'S', value: this.modelid }],
        orderby: 'createon',
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        console.log(res)
        this.supfilelist = res.list
        this.supfilelist.forEach(item => {
          console.log(item)
          const name = item.name ? item.name.split(',') : []
          const docid = item.docid ? item.docid.split(',') : []
          const docArr = name.map((val, index) => {
            return {
              name: val,
              docid: docid[index]
            }
          })
          this.$set(item, 'docArr', docArr)
        })
        this.supportspages.total = res.total
      })
    },
    handleSupportsChange(val) {
      this.supportspages.pageNum = val
      this.queryDmDocList(val)
    },
    delsupportFile(item, index) {
      this.supportform.supportFile.splice(index, 1)
      if (!!item.type && item.type === 'upload') {
        this.supportDelFile.push(item.docid)
      }
    },
    // 弹出框关闭
    async handlesupportClose(done) {
      const self = this
      if (self.supportDelFile.length > 0) {
        const res = await this.deletefile(self.supportDelFile.join(','))
      }
      done()
    },
    async deletefile(ids) {
      const res = await deluploadFile(ids)
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    savesupport() {
      const self = this
      this.$refs.supportRef.validate(valid => {
        if (valid) {
          saveDmDoc({
            foldername: this.supportform.foldername,
            description: this.supportform.description,
            name: this.supportform.supportFile.map(item => item.name).join(),
            docid: this.supportform.supportFile.map(item => item.docid).join(),
            dmid: this.modelid
          }).then(res => {
            console.log(res)
            this.$message({
              message: this.existTabField('addedSuccessfully', '', true),
              type: 'success'
            })
            this.queryDmDocList(1)
            self.isFileVisible = false
          })
        } else {
          this.$message({
            message: this.existTabField('noteOrAttachmentCanNotBeEmpty', '', true),
            type: 'warning'
          })
          return false
        }
      })
    },
    delFile(item) {
      console.log(item)
      this.$confirm(this.existTabField('confirmThatYouWantToDeleteThisFile', '', true), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(async() => {
          deleteDmDoc(item.id).then(res => {
            this.queryDmDocList(this.supportspages.pageNum)
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
          })
        })
        .catch(() => { })
    },
    resetsupport() {
      this.supportform = {
        foldername: '制度相关文档',
        description: '',
        supportFile: []
      }
    },
    handlerSelect(obj) {
      this.supportform.supportFile = []
      console.log(obj)
      obj.uploadfiles.map(item => {
        this.supportform.supportFile.push({
          docid: item.id,
          name: item.newName,
          type: 'upload'
        })
      })
      obj.selectedList.map(item => {
        let count = 0
        for (let i = 0; i < this.supportform.supportFile.length; i++) {
          const temp = this.supportform.supportFile[i]
          if (temp.docid === item.docid) {
            count++
          }
        }
        if (!count) {
          this.supportform.supportFile.push({
            docid: item.docid,
            name: item.name
          })
        }
      })
      console.log(this.supportform.supportFile)
    }
  }
}
</script>

<style lang="scss" scoped>
/*附件部分*/
.showFiles {
  span {
    line-height: 18px;
    padding: 3px 20px 3px 8px;
    border: 1px solid #519eff;
    display: inline-block;
    vertical-align: top;
    max-width: 130px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.alink span {
    padding-right: 35px;
  }
  &.commonpadding span {
    padding: 3px 8px;
  }
  &.commonpadding.alink span {
    padding-right: 20px;
  }
  a:nth-of-type(2) {
    position: absolute;
    right: 17px;
    top: 5px;
  }
  &.commonpadding.alink a:nth-of-type(2) {
    position: absolute;
    right: 5px;
    top: 3px;
  }
  i {
    position: absolute;
    right: 3px;
    top: 5px;
    color: $ico;
  }
  &.processCommon i {
    top: 6px;
  }
}

.minHeight28 {
  min-height: 28px;
}

/*制度支持文件*/
.supportDialog {
  .el-dialog__header {
    .el-button {
      padding: 0 8px;
      margin-right: 15px;
    }
  }
}
/deep/.el-button:hover, .el-button:focus{
      background-color: #2d42af !important;
     color: #fff !important;
  }
</style>
