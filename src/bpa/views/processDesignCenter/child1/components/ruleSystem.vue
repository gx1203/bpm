<template>
  <div class="w100">
    <el-row class="margin-b15">
      <el-col :span="6" :offset="18" class="clear-fix">
        <el-button :disabled="!noEditing"
          class="float-r"
          v-if="existTabField('addAttach', 'refer')"
          @click="resetrules();isruleVisible = true"
          type="primary"
          icon="el-icon-plus"
          plain
        >{{existTabField('addAttach', '', true)}}</el-button>
      </el-col>
    </el-row> 
    <el-table :data="ruleSystemList" class="main_tab">
      <el-table-column
        v-if="existTabField('number', 'refer')"
        :label="existTabField('number', '', true)"
        type="index"
        width="50"
      ></el-table-column>
      <el-table-column :label="existTabField('version', '', true)"></el-table-column>
      <el-table-column :label="existTabField('systemName', '', true)"></el-table-column>
      <el-table-column :label="existTabField('revise_Content', '', true)"></el-table-column>
      <el-table-column :label="existTabField('repersonator', '', true)"></el-table-column>
      <el-table-column :label="existTabField('reviewer', '', true)"></el-table-column>
      <el-table-column :label="existTabField('approver', '', true)"></el-table-column>
      <el-table-column :label="existTabField('revision_date', '', true)"></el-table-column>
      <el-table-column
        v-if="existTabField('file', 'refer')"
        :label="existTabField('file', '', true)"
      >
        <template slot-scope="scope">
          <p class="showFiles commonpadding alink">
            <span class="margin-r5 margin-b5" v-for="file in scope.row.attatch" :key="file.id">
              <a :href="viewFile(file.id)" target="_blank">{{file.name}}</a>
              <a class="margin-l15" :href="downloadFile(file.id)" target="_blank">
                
              </a>
            </span>
          </p>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip v-if="true" class="item" effect="dark" :content="$t('modify')" placement="top">
            <el-button class="no-border" icon="el-icon-edit" type="text"></el-button>
          </el-tooltip>
          <el-tooltip v-if="true" class="item" effect="dark" :content="$t('delete')" placement="top">
            <el-button class="no-border" icon="el-icon-delete" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      @current-change="handleRuleChange"
      :current-page="rulepages.pageNum"
      background
      layout="prev, pager, next, jumper, total"
      :total="rulepages.total"
    ></el-pagination>-->

    <!-- 规章制度上传 -->
    <el-dialog title="规章制度上传" :visible.sync="isruleVisible" :append-to-body="true">
      <el-form
        label-width="110px"
        label-position="right"
        ref="ruleRef"
        :model="ruleform"
        :rules="rulerules"
      >
        <el-form-item
          class="label-height-auto"
          v-if="existTabField('Dialog_systemName', 'refer')"
          :label="existTabField('Dialog_systemName')"
          prop="rule"
        >
          <el-input v-model="ruleform.rule" rows="6" resize="none"></el-input>
        </el-form-item>
        <el-form-item
          class="label-height-auto"
          v-if="existTabField('Dialog_reviser', 'refer')"
          :label="existTabField('Dialog_reviser')"
          prop="rule"
        >
          <el-input v-model="ruleform.rule" rows="6" resize="none"></el-input>
        </el-form-item>
        <el-form-item
          class="label-height-auto"
          v-if="existTabField('Dialog_reviseContents', 'refer')"
          :label="existTabField('Dialog_reviseContents')"
          prop="rule"
        >
          <el-input type="textarea" v-model="ruleform.rule" rows="6" resize="none"></el-input>
        </el-form-item>
        <el-form-item
          class="label-height-auto"
          v-if="existTabField('c_attachmentRule', 'refer')"
          :label="existTabField('c_attachmentRule')"
          prop="ruleFile"
        >
          <!-- 上传附件 -->
          <el-upload
            class="upload-demo"
            :action="fileUploadUrl"
            :limit="1"
            :file-list="addFileList"
            :on-exceed="editHandleExceed"
            :on-success="(res) => {addHandleUpload('success', res)}"
            :on-error="(err) => {addHandleUpload('error', err)}"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">{{$t("bpa_clickUpload")}}</el-button>
          </el-upload>
        </el-form-item>
        <el-table class="main_tab" :data="addFileList">
          <el-table-column prop="filename" :label="$t('fileName')"></el-table-column>
          <el-table-column prop="filename" label="文件大小"></el-table-column>
          <el-table-column prop="status" label="上传状态"></el-table-column>
          <el-table-column :label="$t('operation')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button @click="deleteAddFile" class="no-border" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="下载" placement="top">
                <a :href="downloadFile(scope.row.fileid)" download>
                  <el-button class="no-border" icon="el-icon-download" circle></el-button>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isruleVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="saveRule">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRulelist,
  saveRulefile,
  delRuleFile
} from '@/bpa/api/processDesignCenter'

import { deluploadFile } from '@/bpa/api/common'

import fileOperation from '@/bpa/mixins/fileDownView'

export default {
  name: 'ruleSystem',
  data() {
    return {
      isruleVisible: false,
      ruleSystemList: [],
      rulepages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      ruleform: {
        rule: '',
        ruleFile: []
      },
      rulerules: {
        rule: [{ required: true, message: ' ', trigger: 'blur' }],
        ruleFile: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      selrulelist: [],
      addFileList: [],
      forlderId: '7BC636EDF11967C0E0530701A8C06A7D',
      fileUploadUrl: ''
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    download() {
      return this.host + '/attach/download/'
    },
    viewfile() {
      return this.host + '/document/print/'
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username() {
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
    showtabfiled(val) {
      console.log(val)
      this.getRule(1)
    }
  },
  methods: {
    // 判断条件
    existTabField(pname, type, bool) {
      console.log(pname)
      console.log(type)
      console.log(bool)
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      console.log(type)
      console.log(obj)
      if (type == 'refer') {
        console.log(!!obj.pname)
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return !obj.pname ? '' : obj.name + (!bool ? ':' : '')
      }
    },
    // getRule(pageNum) {
    //   getRulelist({
    //     filters: [{ key: 'listid', value: this.modelid }],
    //     orderby: 'createon',
    //     pageNum: !pageNum ? 1 : pageNum,
    //     pageSize: 10,
    //     sort: 'desc'
    //   }).then(res => {
    //     console.log(res)
    //     this.rulelist = res.list
    //     this.rulepages.total = res.total
    //   })
    // },
    // handleRuleChange(val) {
    //   this.rulepages.pageNum = val
    //   this.getRule(val)
    // },
    delRuleFile(item, index) {
      this.ruleform.ruleFile.splice(index, 1)
      if (!!item.type && item.type === 'upload') {
        this.deletefile(item.docid)
      }
    },
    saveRule() {
      let self = this
      this.$refs.ruleRef.validate(valid => {
        if (valid) {
          saveRulefile({
            attatch: this.ruleform.ruleFile,
            bpo: 'diq',
            listid: this.modelid,
            param1: '翟青/一汽-大众汽车有限公司',
            rule: this.ruleform.rule
          }).then(res => {
            console.log(res)
            self.isruleVisible = false
            this.$message({
              message: '添加成功!',
              type: 'success'
            })
            this.getRule(1)
          })
        } else {
          this.$message({
            message: '规则或者附件不能为空!',
            type: 'warning'
          })
          return false
        }
      })
    },
    resetrules() {
      this.ruleform = {
        rule: '',
        ruleFile: []
      }
    },
    // handleruleChange(val) {
    //   this.selrulelist = val
    // },
    // 删除document接口的文件
    async deletefile(ids) {
      let res = await deluploadFile(ids)
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    editHandleExceed() {}
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
/deep/.el-button:hover, .el-button:focus{
      background-color: #2d42af !important;
     color: #fff !important;
  }
</style>
