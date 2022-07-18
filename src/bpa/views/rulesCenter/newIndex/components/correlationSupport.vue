<template>
  <div class="w100">
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 相关附件 -->
          <el-tab-pane :label="existTabField('relatedAccessory', '', true)" name="first">
            <el-row class="margin-b15" v-if="isEdit">
              <el-col :span="4" :offset="20" class="clear-fix">
                <el-button class="float-r" @click="resetsupport();isFileVisible = true" type="primary">{{existTabField('selectTheAttachment', '', true)}}</el-button>
              </el-col>
            </el-row>
            <el-table :data="lists1" class="main_tab" stripe>
              <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index"></el-table-column>
              <el-table-column prop="name" v-if="existTabField('fileName', 'refer')" :label="existTabField('fileName', '', true)">
                <template slot-scope="scope">
                  <a :href="viewFile(scope.row.docid)" target="_blank">{{scope.row.name}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="createby" v-if="existTabField('uploader', 'refer')" :label="existTabField('uploader', '', true)"></el-table-column>
              <el-table-column prop="createon" v-if="existTabField('uploadTime', 'refer')" :label="existTabField('uploadTime', '', true)"></el-table-column>
              <el-table-column prop="foldername" v-if="existTabField('fileType', 'refer')" :label="existTabField('fileType', '', true)"></el-table-column>
              <el-table-column prop="description" v-if="existTabField('comments', 'refer')" :label="existTabField('comments', '', true)"></el-table-column>
              <el-table-column width="80" v-if="existTabField('operation', 'refer') && isEdit" :label="existTabField('operation', '', true)">
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.foldername === '其他流程相关文件'" class="item" effect="dark"
                    :content="existTabField('delete', '', true)" placement="top">
                    <el-button class="no-border" icon="el-icon-delete" type="text" @click="delFile(scope.row)">
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pages.pageNum"
              :page-size="pages.pageSize" background layout="prev, pager, next, jumper, total" :total="pages.total">
            </el-pagination>
          </el-tab-pane>
          <!-- 修编依据 -->
          <el-tab-pane :label="existTabField('basedOnTheRevisionOfThe', '', true)" name="second">
            <el-row class="text-right margin-b15" v-if="isEdit">
              <el-button type="primary" @click="addDialog">{{existTabField('add', '', true)}}</el-button>
            </el-row>
            <el-table :data="list2Data" class="main_tab">
              <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index"></el-table-column>
              <el-table-column prop="content" v-if="existTabField('informationContent', 'refer')" :label="existTabField('informationContent', '', true)"></el-table-column>
              <el-table-column prop="sourcefrom" v-if="existTabField('informationSource', 'refer')" :label="existTabField('informationSource', '', true)"></el-table-column>
              <el-table-column prop="username" v-if="existTabField('creator', 'refer')" :label="existTabField('creator', '', true)"></el-table-column>
              <el-table-column prop="deptname" v-if="existTabField('createDepartment', 'refer')" :label="existTabField('createDepartment', '', true)"></el-table-column>
              <el-table-column prop="createon" v-if="existTabField('createTime', 'refer')" :label="existTabField('createTime', '', true)" width="130"></el-table-column>
              <el-table-column prop="filename" v-if="existTabField('relevantDocument', 'refer')" :label="existTabField('relevantDocument', '', true)" align="center" width="200">
                <template slot-scope="scope">
                  <p v-for="(item, index) in scope.row.docFile || []" :key="index">
                    <a :href="viewFile(item.id)" target="_blank">{{item.originalName}}</a>
                    <a class="margin-l5" :href="downloadUrl(item.id)" download>

                    </a>
                  </p>
                </template>
              </el-table-column>
              <el-table-column width="160" v-if="existTabField('operation', 'refer') && isEdit" :label="existTabField('operation', '', true)">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item" effect="dark" :content="existTabField('modify', '', true)" placement="top">
                    <el-button class="no-border" icon="el-icon-edit" circle @click="getDetails(scope.row.id,'修改')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="existTabField('delete', '', true)" placement="top">
                    <el-button class="no-border" icon="el-icon-delete" circle @click="deleteRow(scope.row.id)" />
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 评审意见 -->
        <el-tab-pane :label="existTabField('reviewcomments', '', true)" name="third">
             <!-- <el-row class="text-right margin-b15">
              <el-button type="primary" @click="addDialog">{{existTabField('add', '', true)}}</el-button>
            </el-row>  -->
           <el-table :data="opnionData" class="main_tab">
              <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index"></el-table-column>
              <el-table-column prop="yjnr" v-if="existTabField('yjnr', 'refer')" :label="existTabField('yjnr', '', true)"></el-table-column>
              <el-table-column prop="yjfbsj" v-if="existTabField('yjfbsj', 'refer')" :label="existTabField('yjfbsj', '', true)"></el-table-column>
              <el-table-column prop="yjtjr" v-if="existTabField('yjtjr', 'refer')" :label="existTabField('yjtjr', '', true)"></el-table-column>
              <el-table-column prop="fbyjbm" v-if="existTabField('fbyjbm', 'refer')" :label="existTabField('fbyjbm', '', true)"></el-table-column>
              <el-table-column prop="yjspr" v-if="existTabField('yjspr', 'refer')" :label="existTabField('yjspr', '', true)" width="130"></el-table-column>
              <el-table-column prop="cnqk" v-if="existTabField('cnqk', 'refer')" :label="existTabField('cnqk', '', true)" align="center" width="200">
                <template slot-scope="scope">
                  <p v-for="(item, index) in scope.row.docFile || []" :key="index">
                    <a :href="viewFile(item.id)" target="_blank">{{item.originalName}}</a>
                    <a class="margin-l5" :href="downloadUrl(item.id)" download>

                    </a>
                  </p>
                </template>
              </el-table-column>
              <el-table-column width="160" v-if="existTabField('bz', 'refer')" :label="existTabField('bz', '', true)">
                <!-- <template slot-scope="scope">
                  <el-tooltip
                    class="item" effect="dark" :content="existTabField('modify', '', true)" placement="top">
                    <el-button class="no-border" icon="el-icon-edit" circle @click="getDetails(scope.row.id,'修改')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="existTabField('delete', '', true)" placement="top">
                    <el-button class="no-border" icon="el-icon-delete" circle @click="deleteRow(scope.row.id)" />
                  </el-tooltip>
                </template> -->
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>




    <!-- 相关附件弹框 -->
    <el-dialog :title="existTabField('addSupportFile', '', true)" class="supportDialog" width="60%" :visible.sync="isFileVisible" :before-close="handlesupportClose"
      :append-to-body="true">
      <!-- <template slot="title">
        <div class="clear-fix">
          <span class="font14"
            v-if="existTabField('addSupportFile', 'refer')">{{existTabField('addSupportFile', '', true)}}</span>
        </div>
      </template> -->
      <el-form label-width="110px" label-position="right" ref="supportRef" :model="supportform" :rules="supportsrules">
        <el-form-item
          v-if="existTabField('fileType', 'refer')"
          :label="existTabField('fileType')"
          prop="fileType"
          :rules="[
            { required: existTabField('fileType', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-select v-model="supportform.fileType" placeholder="" disabled>
            <el-option v-for="item in filetypes" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="existTabField('comments', 'refer')"
          :label="existTabField('comments')"
          prop="remarks"
          :rules="[
            { required: existTabField('comments', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-input type="textarea" rows="5" resize="none" v-model="supportform.remarks"></el-input>
        </el-form-item>
        <el-form-item
          v-if="existTabField('attachment', 'refer')"
          :label="existTabField('attachment')"
          prop="supportFile"
          :rules="[
            { required: existTabField('attachment', 'necessary'), message: ' ', trigger: 'blur' }
          ]"
        >
          <el-row>
            <el-col :span="20" class="minHeight28">
              <p class="showFiles processCommon">
                <span class="margin-b5 margin-r5" style="background: #2d42af; color: white;" v-for="(item, index) in supportform.supportFile" :key="item.docid">
                  {{item.name}}
                  <i class="el-icon-close cursor-pointer" @click="delsupportFile(item, index)"></i>
                </span>
              </p>
            </el-col>
            <el-col :span="4">
              <el-button class="float-r" @click="isGroupVisible = true">{{existTabField('select', '', true)}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isFileVisible = false">{{existTabField('cancel', '', true)}}</el-button>
        <el-button type="primary" @click="savesupport">{{existTabField('confirm', '', true)}}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="existTabField('basedOnTheRevisionOfThe', '', true)"
      :visible.sync="dialogVisible"
      width="65%"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="editFormObj" label-width="90px">
        <el-row>
          <!-- 信息内容 -->
          <el-form-item
            v-if="existTabField('informationContent', 'refer')"
            :label="existTabField('informationContent')"
            prop="content"
            :rules="[
              { required: existTabField('informationContent', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input clearable
              v-model="editFormObj.content"
              type="textarea"
              maxlength="1000"
              :disabled="!isEdit"
            ></el-input>
          </el-form-item>
          <!-- 信息来源 -->
          <el-form-item
            v-if="existTabField('informationSource', 'refer')"
            :label="existTabField('informationSource')"
            prop="sourcefrom"
            :rules="[
              { required: existTabField('informationSource', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input clearable v-model="editFormObj.sourcefrom" :disabled="!isEdit"></el-input>
          </el-form-item>
          <!-- 创建人 -->
          <el-form-item
            v-if="existTabField('creator', 'refer') && editFormObj.id"
            :label="existTabField('creator')"
            prop="username"
            :rules="[
              { required: existTabField('creator', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input clearable v-model="editFormObj.username" disabled></el-input>
          </el-form-item>
          <!-- 创建部门 -->
          <el-form-item
            v-if="existTabField('createDepartment', 'refer') && editFormObj.id"
            :label="existTabField('createDepartment')"
            prop="deptname"
            :rules="[
              { required: existTabField('createDepartment', 'necessary'), message: ' ', trigger: 'blur' }
            ]"
          >
            <el-input clearable v-model="editFormObj.deptname" disabled></el-input>
          </el-form-item>
          <!--
          <el-form-item label="创建部门:">
            <el-input clearable v-model="editFormObj.deptname" @focus="focusDeptHandle" :disabled="!isEdit"></el-input>
          </el-form-item>-->
          <!-- 创建时间 -->
          <el-form-item
            v-if="existTabField('createTime', 'refer') && editFormObj.id"
            :label="existTabField('createTime')"
            prop="createon"
            :rules="[
              { required: existTabField('createTime', 'necessary'), message: ' ', trigger: 'change' }
            ]"
          >
            <el-date-picker clearable
              disabled
              v-model="editFormObj.createon"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <!-- 相关文件 -->
          <!-- 上传附件 -->
          <el-form-item
            v-if="existTabField('relevantDocument', 'refer') && isEdit"
            :label="existTabField('relevantDocument')"
            :required="existTabField('relevantDocument', 'necessary')"
          >
            <el-upload
              :action="action"
              :on-success="handlerFileUploadSuccess"
              :show-file-list="false"
            >
              <el-button size="mini" type="primary">{{existTabField('clickUpload', '', true)}}</el-button>
            </el-upload>
          </el-form-item>
          <!-- 相关附件弹框 -->
          <el-table
            stripe
            :header-cell-style="{background: '#E1EAFD !important'}"
            highlight-current-row
            :data="docFile"
          >
            <el-table-column prop="filename" v-if="existTabField('fileName2', 'refer')" :label="existTabField('fileName2', '', true)"></el-table-column>
            <el-table-column prop="filesize" v-if="existTabField('fileSize', 'refer')" :label="existTabField('fileSize', '', true)"></el-table-column>
            <el-table-column prop="status" v-if="existTabField('uploadStatus', 'refer')" :label="existTabField('uploadStatus', '', true)"></el-table-column>
            <el-table-column v-if="existTabField('operation', 'refer')" :label="existTabField('operation', '', true)">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="existTabField('delete', '', true)" v-if="isEdit" placement="top">
                  <el-button @click="deleteFile" class="no-border" icon="el-icon-delete" circle></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="existTabField('download', '', true)" placement="top">
                  <a :href="downloadUrl(scope.row.fileId)" download>
                    <el-button class="no-border" icon="el-icon-download" circle></el-button>
                  </a>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{existTabField('cancel', '', true)}}</el-button>
        <el-button type="primary" v-if="isEdit" @click="saveDmInfomation">{{existTabField('confirm', '', true)}}</el-button>
      </span>
    </el-dialog>

    <!-- 添加附件 -->
    <select-file v-model="isGroupVisible" :pageId="forlderId" @confirm="handlerSelect"></select-file>
  </div>
</template>
<script>
import { getRevisionSystemList } from '@/bpa/api/componentsApi'
import { deluploadFile } from '@/bpa/api/common'
import {
  delSupport,
  saveFile,
  saveRulefile,
  getsupportFile
} from '@/bpa/api/processDesignCenter'
import {
  saveDmInfomation,
  getDmInfomation,
  deleteDmInfomation,
  queryDmInfomationList,
  getReviewComments,
  getReviewCommentsStart
} from '@/bpa/api/rulesCenter/handbookFiles'

import { downloadFile2, viewFile2 } from '@/bpa/utils/common'

import paginations from '@/bpa/mixins/pagination_mixin'
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
  name: 'correlationSupport',
  data () {
    return {
      opnionData:[],
      activeName: 'first',
      isFileVisible: false,
      lists1: [],
      list2Data: [],
      pages: {
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
      rules: {
        content: [{ required: true, message: ' ', trigger: 'blur' }],
        sourcefrom: [{ required: true, message: ' ', trigger: 'blur' }],
        deptname: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      // 文件类型
      filetypes,
      // 业务规则
      isruleVisible: false,
      isGroupVisible: false,
      dialogVisible: false,
      // 组件附件的调用参数
      forlderId: '7A88EC3856C446EBE053BF1A13ACC390',
      viewFileUrl: `${process.env.HOST_URL}${process.env.BASE_URL}/document/print/`,
      downloadFileUrl: `${process.env.HOST_URL}${process.env.BASE_URL}/regulation/download/`,
      editFormObj: {},
      docFile: [],
      isEdit: false,
    }
  },
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    treeId: {
      type: String,
      default: ''
    },
    modelid: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    },
     docid: {
      type: String,
      default: "",
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  mixins: [paginations, fileOperation],
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action () {
      return `${this.host}/regulation/upload?username=${this.userid}`
    },
    download () {
      return this.host + '/regulation/download/'
    },
    viewfile () {
      return this.host + '/document/print/'
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    }
  },
  mounted () {
    this.getSupportFile(1)
    this.getReviewComments()
  },
  methods: {

    //获取评审意见
    getReviewComments(){
      getReviewComments(this.docid).then((res)=>{
        console.log(res)
        if (!res) return false
        this.opnionData = res.list
      })
    },
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
      if (type === 'refer') {
        return !!obj.pname
      } else if (type === 'necessary') {
        return obj.necessary === '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : obj.enname + (!bool ? ":" : "")
      }
    },
    addDialog() {
      this.dialogVisible = true
      this.docFile = []
      this.isEdit = true
      this.editFormObj = {
        content: '',
        sourcefrom: '',
        deptname: '',
        duty: '',
        timelimit: '',
        username: '',
        createon: ''
      }
    },
    handlerFileUploadSuccess(res) {
      this.docFile.push({
        filename: res.data.newName,
        filesize: res.data.size + 'B',
        downloadUrl: this.host + '/regulation/download/' + res.data.id,
        status: this.$t("uploaded"),
        fileId: res.data.id
      })
    },
    // 确认添加
    saveDmInfomation() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.docFile.length === 0) {
            this.$message({
              type: 'warning',
              message: this.existTabField('relevantDocumentCannotBeEmpty', '', true)
            })
            return
          }
          this.editFormObj.docFile = this.docFile
          this.editFormObj.fj = this.docFile.map(item => item.fileId).join(',')
          this.editFormObj.rsystemid = this.modelid
          saveDmInfomation(this.editFormObj).then(res => {
            this.$message({
              type: 'success',
              message: this.existTabField('saveSuccessfully', '', true)
            })
            this.dialogVisible = false
            this.getList2()
          })
        }
      })
    },
    getDetails(id, type) {
      this.docFile = []
      getDmInfomation(id).then(res => {
        if (!res) return false
        this.editFormObj = res
        if (res.docFile) {
          this.docFile = res.docFile.map(item => {
            return {
              filename: item.originalName,
              filesize: item.fileSize + 'B',
              downloadUrl: item.downloadUrl,
              status: this.$t("uploaded"),
              fileId: item.id
            }
          })
        }
        this.isEdit = type === '修改';
        this.dialogVisible = true
        this.editFormObj = Object.assign({}, this.editFormObj)
      })
    },
    deleteRow(id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          deleteDmInfomation(id).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            this.getList2()
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteFile(index) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          this.docFile.splice(index, 1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取流程支持文件
    getSupportFile (pageNum) {
      getsupportFile({
        attr: {},
        filters: [{ key: 'modelid', value: this.modelid }],
        orderby: 'createon',
        pageNum: !pageNum ? 1 : this.pages.pageNum,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        console.log(res)
        this.lists1 = res.list
        this.pages.total = res.total
      })
    },
    getList2 () {
      queryDmInfomationList({
        pagenum: this.pages.pageNum,
        pagesize: this.pages.pageSize,
        "filters": [{
          "key": "rsystemid",
          "opt": "EQ",
          "type": "S",
          "value": this.modelid
        }],
      }).then(res => {
        if (!res) return false
        console.log(res)
        this.list2Data = res.list
        console.log(this.list2Data)
      })
    },
    getList3 () {
      console.log(1)
    },
    handleClick (tab, event) {
      console.log(tab)
      let self = this
      if (tab.name == 'second') {
        self.getList2()
      } else if (tab.name == 'third') {
        self.getList3()
      }
    },
    handleCurrentChange (val) {
      this.pages.pageNum = val
      this.getSupportFile(val)
    },
    // 上传附件
    resetsupport () {
      this.supportform = {
        fileType: '7A88EC3856C446EBE053BF1A13ACC390',
        remarks: '',
        supportFile: []
      }
    },
    // 弹出框关闭
    async handlesupportClose (done) {
      let self = this
      if (self.supportDelFile.length > 0) {
        let res = await this.deletefile(self.supportDelFile.join(','))
      }
      done()
    },
    // 删除document接口的文件
    async deletefile (ids) {
      let res = await deluploadFile(ids)
      return new Promise((resolve, reject) => {
        resolve()
      })
    },
    delFile (item) {
      console.log(item)
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(async () => {
          let res = await delSupport(item.id)
          let res2 = await deluploadFile(item.docid)
          let pages = this.pages.pageNum
          console.log(pages)
          this.getSupportFile(pages)
          this.$message({
            type: 'success',
            message: this.$t('hintText.successfullyDelete')
          })
        })
        .catch(() => { })
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
              message: this.existTabField('saveSuccessfully', '', true),
              type: 'success'
            })
            this.getSupportFile(1)
            self.isFileVisible = false
          })
        } else {
          this.$message({
            message: this.existTabField('remarksOrAttachmentsCannotBeBlank', '', true),
            type: 'warning'
          })
          return false
        }
      })
    },
    delsupportFile (item, index) {
      this.supportform.supportFile.splice(index, 1)
      if (!!item.type && item.type === 'upload') {
        this.supportDelFile.push(item.docid)
      }
    },
    saveRule () {
      let self = this
      this.$refs.supportRef.validate(valid => {
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
              message: this.existTabField('addedSuccess', '', true),
              type: 'success'
            })
            this.getRule(1)
          })
        } else {
          this.$message({
            message: this.existTabField('rulesOrAttachmentsCannotBeEmpty', '', true),
            type: 'warning'
          })
          return false
        }
      })
    },
    handlerSelect (obj) {
      console.log(obj)
      let self = this
      console.log(111)
      if (obj.selectedList.length > 0) {
        obj.selectedList.forEach(item => {
          self.supportform.supportFile.push({
            name: item.name,
            docid: item.docid
          })
        })
      }
      if (obj.uploadfiles.length > 0) {
        obj.uploadfiles.forEach(item => {
          self.supportform.supportFile.push({
            name: item.newName,
            docid: item.id
          })
        })
      }
    },
    downloadUrl (fileid) {
      return `${this.host}/regulation/download/${fileid}?username=${this.userid}`
    }
  }
}
</script>

<style lang="scss" scoped>
.minHeight28 {
  min-height: 28px;
}
.minHeight35 {
  min-height: 35px;
}
.el-dialog__header {
  .el-button {
    padding: 0 8px;
    margin-right: 15px;
  }
}
.fileName {
  color: #409eff;
  cursor: pointer;
}
.fileName2 {
  color: #ccc;
  cursor: pointer;
}
/deep/.el-button:hover, .el-button:focus{
      background-color: #2d42af !important;
     color: #fff !important;
  }
</style>
