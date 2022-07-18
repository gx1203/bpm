<template>
  <div class="w100">
    <el-row class="margin-b15" v-if="existTabField('selectFile', 'refer')">
      <el-col :span="4" :offset="20" class="clear-fix">
        <el-button :disabled="!noEditing" class="float-r" @click="resetsupport();isFileVisible = true" type="primary" >{{existTabField('selectFile','', true)}}</el-button>
      </el-col>
    </el-row>
    <el-table :data="supfilelist" class="main_tab" stripe>
      <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number','', true)" type="index"
        width="50"></el-table-column>
      <el-table-column v-if="existTabField('fileName', 'refer')" :label="existTabField('fileName','', true)">
        <template slot-scope="scope">
          <a :href="viewFile(scope.row.docid)" target="_blank">{{scope.row.name}}</a>
          <a class="margin-l5" :href="downloadFile(scope.row.docid)" target="_blank">
            
          </a>
        </template>
      </el-table-column>
      <el-table-column v-if="existTabField('uploader', 'refer')" prop="createby" width="100"
        :label="existTabField('uploader','', true)"></el-table-column>
      <el-table-column v-if="existTabField('uploadTime', 'refer')" prop="createon" width="200"
        :label="existTabField('uploadTime','', true)"></el-table-column>
      <el-table-column v-if="existTabField('fileType', 'refer')" prop="foldername" width="120"
        :label="existTabField('fileType','', true)"></el-table-column>
      <el-table-column v-if="existTabField('remarksDialog', 'refer')" prop="description" width="200"
        :label="$t('basEmployee.remark')"></el-table-column> 
      <el-table-column v-if="existTabField('operation', 'refer')" width="80"
        :label="existTabField('operation','', true)">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.foldername === '其他流程相关文件'" class="item" effect="dark" :content="$t('delete')"
            placement="top">
            <el-button :disabled="!noEditing" class="no-border" icon="el-icon-delete" type="text" @click="delFile(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleSupportsChange" :current-page="supportspages.pageNum" background
      layout="prev, pager, next, jumper, total" :total="supportspages.total"></el-pagination>

    <!-- 流程支持文件 -->
    <el-dialog class="supportDialog" :visible.sync="isFileVisible" :before-close="handlesupportClose"
      :append-to-body="true">
      <template slot="title">
        <div class="clear-fix">
          <span class="font14"
            v-if="existTabField('addSupportFile', 'refer')">{{existTabField('addSupportFile', '', true)}}</span>
          <!-- <el-button class="float-r" size="large" type="text" @click="savesupport"
            v-if="existTabField('save', 'refer')">{{existTabField('save', '', true)}}</el-button> -->
        </div>
      </template>
      <el-form label-width="110px" label-position="right" ref="supportRef" :model="supportform" :rules="supportsrules">
        <el-form-item v-if="existTabField('fileType', 'refer')" :label="existTabField('fileType')" prop="fileType">
          <el-select v-model="supportform.fileType" :placeholder="$t('pleaseSelect')" disabled>
            <el-option v-for="item in filetypes" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="existTabField('comments', 'refer')" :label="existTabField('comments')" prop="remarks">
          <el-input type="textarea" rows="5" resize="none" v-model="supportform.remarks"></el-input>
        </el-form-item>
        <el-form-item v-if="existTabField('attachmentDialog', 'refer')" :label="existTabField('attachmentDialog')"
          prop="supportFile">
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span class="margin-b5 margin-r5" v-for="(item, index) in supportform.supportFile" :key="item.docid">
                  {{item.name}}
                  <i class="el-icon-close cursor-pointer" @click="delsupportFile(item, index)"></i>
                </span>
              </p>
            </el-col>
            <el-col :span="4">
              <el-button class="float-r" @click="isGroupVisible = true">{{existTabField('placeholderText','','true')}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="isFileVisible = false">{{existTabField('cancel','','true')}}</el-button>
        <el-button type="primary"  v-if="existTabField('save', 'refer')" @click="savesupport">{{existTabField('confirm','','true')}}</el-button>
      </span>
          </el-dialog>
    <!-- 添加附件 -->
    <select-file v-model="isGroupVisible" :pageId="forlderId" @confirm="handlerSelect"></select-file>
  </div>
</template>
<script>
import {
  getsupportFile,
  saveFile,
  delSupport
} from '@/bpa/api/processDesignCenter'

import { deluploadFile } from '@/bpa/api/common'

import fileOperation from '@/bpa/mixins/fileDownView'

const filetypes = [
  {
    label: '流程输出文件',
    id: '7A88687D266A3D7CE053BF1A13ACD2C3'
  },
  {
    label: '其他流程相关文件',
    id: '7A88EC3856C446EBE053BF1A13ACC390'
  },
  {
    label: '输入',
    id: '7B4DBBED904B1C5DE053BF1A13AC64F1'
  },
  {
    label: '输出',
    id: '7B4DBBED904E1C5DE053BF1A13AC64F1'
  },
  {
    label: 'QMS',
    id: '7B000C586A5D3A31E053BF1A13AC8D0A'
  },
  {
    label: 'EMS',
    id: '7B000D65C18D3A0DE053BF1A13AC5F6B'
  },
  {
    label: 'OHSAS',
    id: '7B000C586A603A31E053BF1A13AC8D0A'
  },
  {
    label: 'EnMs',
    id: '7B3D9B5F12664172E053BF1A13AC131E'
  },
  {
    label: '业务规则',
    id: '7BC636EDF11967C0E0530701A8C06A7D'
  },
  {
    label: '流程输入文件',
    id: '6CCAFE3781CA4875E053BF1A13AC0E97'
  }
]

export default {
  name: 'processInsit',
  data () {
    return {
      // 流程支持文件
      isFileVisible: false,
      supfilelist: [],
      supportspages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      supportDelFile: [],
      supportform: {
        fileType: '7A88EC3856C446EBE053BF1A13ACC390',
        remarks: '',
        supportFile: []
      },
      supportsrules: {
        fileType: [{ required: true, message: ' ', trigger: 'blur' }],
        remarks: [{ required: true, message: ' ', trigger: 'blur' }],
        supportFile: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      // 文件类型
      filetypes,
      isGroupVisible: false,
      forlderId: '7A88EC3856C446EBE053BF1A13ACC390'
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    download () {
      return this.host + '/attach/download/'
    },
    viewfile () {
      return this.host + '/document/print/'
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .name
    },
    username () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    }
  },
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    modelid: {
      type: String,
      default: ''
    },
    noEditing: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [fileOperation],
  watch: {
    showtabfiled (val) {
      console.log(val)
      this.getSupportFile(1)
    }
  },
  methods: {
    // 判断条件
    existTabField (pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      let lang = localStorage.getItem("language")
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : ''
      }
    },
    // 获取流程支持文件
    getSupportFile (pageNum) {
      getsupportFile({
        attr: {},
        filters: [{ key: 'modelid', value: this.modelid }],
        orderby: 'createon',
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        console.log(res)
        this.supfilelist = res.list
        this.supportspages.total = res.total
      })
    },
    handleSupportsChange (val) {
      this.supportspages.pageNum = val
      this.getSupportFile(val)
    },
    delsupportFile (item, index) {
      this.supportform.supportFile.splice(index, 1)
      if (!!item.type && item.type === 'upload') {
        this.supportDelFile.push(item.docid)
      }
    },
    // 保存到流程支持文件中
    savesupportsfile (lists) {
      saveFile({
        doclist: lists
      }).then(res => {
        console.log('保存流程支持文件成功')
      })
    },
    // 弹出框关闭
    async handlesupportClose (done) {
      let self = this
      if (self.supportDelFile.length > 0) {
        let res = await this.deletefile(self.supportDelFile.join(','))
      }
      done()
    },
    async deletefile (ids) {
      let res = await deluploadFile(ids)
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    savesupport () {
      let self = this
      this.$refs.supportRef.validate(valid => {
        if (valid) {
          saveFile({
            doclist: [
              {
                description: this.supportform.remarks,
                docs: this.supportform.supportFile,
                folderid: this.supportform.fileType,
                modelid: this.modelid
              }
            ]
          }).then(res => {
            console.log(res)
            this.$message({
              message: this.existTabField('addedSuccessfully', '', true),
              type: 'success'
            })
            this.getSupportFile(1)
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
    delFile (item) {
      console.log(item)
      this.$confirm(this.existTabField('confirmThatYouWantToDeleteThisFile', '', true), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(async () => {
          let res = await delSupport(item.id)
          let res2 = await deluploadFile(item.docid)
          this.getSupportFile(this.supportspages.pageNum)
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
        })
        .catch(() => { })
    },
    resetsupport () {
      this.supportform = {
        fileType: '7A88EC3856C446EBE053BF1A13ACC390',
        remarks: '',
        supportFile: []
      }
    },
    handlerSelect (obj) {
      let self = this
      console.log(111)
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
          let temp = this.supportform.supportFile[i]
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

/*流程支持文件*/
.supportDialog {
  .el-dialog__header {
    .el-button {
      padding: 0 8px;
      margin-right: 15px;
    }
  }
}
.el-button:focus, .el-button:hover{
  background-color: #2d42af!important;
    color: #fff!important;
}
</style>
