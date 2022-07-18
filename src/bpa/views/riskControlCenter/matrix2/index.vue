<template>
  <div id="handbookFiles">
    <el-row>
      <el-col :span="12">
        <el-input
          placeholder="请输入标题"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="getList"
        >
          <el-button type="primary"  slot="append" @click="pages.pageNum = 1;getList()"> {{$t('search')}}</el-button>
        </el-input>
        <!--<el-button class="high_search" @click="isHighSearch=!isHighSearch" type="primary">-->
          <!--高级-->
          <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>-->
        <!--</el-button>-->
      </el-col>
      <el-col :span="12" class="search_buttons_wrap">
        <el-button type="primary" @click="isHighSearch=!isHighSearch">
          {{$t("advancedQuery")}}
          <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
        </el-button>
        <el-button type="primary" @click="addDialog">添加</el-button>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <el-form
        v-show="isHighSearch"
        class="search_options_wrap"
        :model="searchForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input clearable v-model="searchForm.doctitle" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布人">
              <el-input clearable v-model="searchForm.provideruser" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拟制人">
              <el-input clearable v-model="searchForm.authorname" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select clearable v-model="searchForm.status" >
                <el-option label="新建" value="1"></el-option>
                <el-option label="审批中" value="2"></el-option>
                <el-option label="已发布" value="3"></el-option>
                <el-option label="修改中" value="4"></el-option>
                <el-option label="已作废" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门">
              <el-input clearable v-model="searchForm.deptname" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体系分类">
              <el-input clearable v-model="searchForm.system" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('effectiveDate')">
              <el-date-picker clearable
                value-format="yyyy-MM-dd"
                v-model="searchForm.value1"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search_buttons_wrap">
          <el-button type="primary" @click="highSearch">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-collapse-transition>
    <!-- 信息表格 -->
    <el-table :data="booksList" class="main_tab" height="400">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="title" label="标题中英文">
        <template slot-scope="scope">
          <p>{{scope.row.title}}</p>
          <p>{{scope.row.enname}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="$t('version')"></el-table-column>
      <el-table-column prop="uploadon" :label="$t('uploadTime')"></el-table-column>
      <el-table-column label="部门">
        <template slot-scope="scope">
          <span v-for="item in scope.row.deptname" :key="item.id">{{item.value}}</span>
        </template>
      </el-table-column>
      <el-table-column label="拟制人">
        <template slot-scope="scope">
          <span v-for="item in scope.row.authorname" :key="item.id">{{item.cnname}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="system" label="体系分类"></el-table-column>
      <el-table-column prop="effectiveion" :label="$t('effectiveDate')"></el-table-column>
      <el-table-column prop="provideruser" label="发布人"></el-table-column>
      <el-table-column :label="$t('fileName')">
        <template slot-scope="scope">
          <a target="_blank" :href="viewFile(scope.row.docId)">{{scope.row.filename}}</a>
          <el-tooltip class="item margin-l5" effect="dark" content="下载" placement="top">
            <a :href="downloadFile(scope.row.docId)">
              
            </a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">{{scope.row.status | regState}}</template>
      </el-table-column>
      <el-table-column width="120" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('modify')"
            placement="top"
            v-if="!!scope.row.authorname[0] ? ((scope.row.authorname[0].userid == userid || (getUserAuthor && getUserAuthor.indexOf('3') > -1)) ? (scope.row.status==1||scope.row.status==3||scope.row.status==4  || scope.row.status==7  || scope.row.status==6):false):false"
          >
            <el-button
              @click="getDetails(scope.row.docId)"
              class="no-border"
              icon="el-icon-edit"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="发布"
            placement="top"
            v-if="scope.row.status==1 || scope.row.status==4 || scope.row.status==6"
          >
            <el-button
              class="no-border"
              @click="publishReg(scope.row)"
              icon="el-icon-s-promotion"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('delete')"
            placement="top"
            v-if="scope.row.status == 1"
          >
            <el-button
              @click="deleteRow(scope.row.docId)"
              class="no-border"
              icon="el-icon-delete"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="作废"
            placement="top"
            v-if="scope.row.status == 3 || scope.row.status == 7"
          >
            <el-button @click="abolishRow(scope.row)" class="no-border" icon="el-icon-error" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
    ></el-pagination>
    <!-- 添加弹框 -->
    <el-dialog
      title="规章制度上传"
      :visible.sync="dialogVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" :model="editFormObj" label-width="80px" :rules="rules">
        <el-form-item label="中文标题" prop="docTitle">
          <el-input clearable v-model="editFormObj.docTitle" maxlength="50" @input="descInput1"></el-input>
        </el-form-item>
        <el-form-item label="英文标题" prop="enname">
          <el-input clearable v-model="editFormObj.enname" maxlength="50" @input="descInput2"></el-input>
        </el-form-item>
        <el-form-item label="拟制人">
          <el-input clearable v-model="username" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input clearable v-model="type" disabled></el-input>
        </el-form-item>
        <el-form-item label="体系分类" prop="checkList">
          <el-checkbox-group v-model="editFormObj.checkList">
            <el-checkbox
              v-for="item in sysLists"
              :key="item.id"
              :label="item.system_name"
            >{{item.system_name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('effectiveDate')" prop="effectiveDate">
          <el-date-picker clearable
            v-model="editFormObj.effectiveDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="主文档">
          <span slot="label">
            <span style="color: red"> * </span>主文档
          </span>
          <el-upload
            :action="action"
            :on-success="handlerFileUploadSuccess"
            :show-file-list="false"
          >
            <el-button size="mini" type="primary">{{$t("bpa_clickUpload")}}</el-button>
          </el-upload>
        </el-form-item>
        <el-table class="main_tab" :data="fileList">
          <el-table-column prop="filename" :label="$t('fileName')"></el-table-column>
          <el-table-column prop="filesize" label="文件大小"></el-table-column>
          <el-table-column prop="status" label="上传状态"></el-table-column>
          <el-table-column :label="$t('operation')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button @click="deleteFile" class="no-border" icon="el-icon-delete" circle></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="下载" placement="top">
                <a :href="downloadUrl(scope.row.fileId)" download>
                  <el-button class="no-border" icon="el-icon-download" circle></el-button>
                </a>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="saveBooks">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBooksList,
  saveBooks,
  deleteBooks,
  getDetails,
  pblishRefuse,
  abolishRefuse,
  getSystem
} from '@/bpa/api/rulesCenter/handbookFiles'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import {
  getFormateDate,
  Base64,
  userId,
  viewFile,
  downloadFile
} from '@/bpa/utils/common'

import { updateStatusRule } from '@/bpa/api/common'

// 控制流程审批的方式
import { requireProcess } from '@/bpa/api/settings/processApprovalManage'

import { createNamespacedHelpers } from 'vuex'
const userInfo = createNamespacedHelpers('userInfo')
export default {
  data() {
    return {
      booksList: [],
      keyWords: '',
      type: '手册体系文件',
      dialogVisible: false,
      isHighSearch: false,
      fileList: [],
      searchForm: {
        doctitle: '',
        enname: '',
        provideruser: '',
        authorname: '',
        docAuthorDis: '',
        deptname: '',
        system: '',
        status: '',
        fordertype: '',
        effectivedate: ''
      },
      editFormObj: {
        effectiveDate: '',
        checkList: []
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      rules: {
        docTitle: [{ required: true, message: ' ', trigger: 'blur' }],
        enname: [{ required: true, message: ' ', trigger: 'blur' }],
        checkList: [{ required: true, message: ' ', trigger: 'blur' }],
        effectiveDate: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      // 判断是否修改主文档
      referMainDoc: false,
      processType: ''
    }
  },
  mixins: [paginations, fileOperation],
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
      return `${this.host}/regulation/upload?username=${this.userid}`
    },
    ...userInfo.mapGetters(['getUserAuthor']),
    download() {
      return this.host + '/regulation/download/'
    }
  },
  mounted() {
    this.getList()
    // 获取当前登录人权限
    this.requireAuthoriy()
    // h获取体系分类
    this.getSystem()
    // 审批方式
    this.getprocessType()
    console.log(this.getUserAuthor)
  },
  methods: {
    ...userInfo.mapActions(['requireAuthoriy']),
    downloadUrl(fileid) {
      return `${this.host}/regulation/download/${fileid}?username=${this.userid}`
    },
    // 控制流程审批的方式
    getprocessType () {
      requireProcess({
        'filters': [
          { 'key': 'name', 'opt': 'LIKE', 'type': 'S', 'value': '手册及体系文件'}
        ]
      }).then(res => {
        if (!res) return false
        this.processType = res.list[0].choosed
      })
    },
    addDialog() {
      this.dialogVisible = true
      this.referMainDoc = false
      this.fileList = []
      this.editFormObj = {
        docTitle: '',
        enname: '',
        effectiveDate: '',
        checkList: []
      }
    },
    // singleSearch() {
    //   this.pages.pageNum = 1
    //   let obj = {
    //     orderby: 'createon',
    //     pageNum: this.pages.pageNum,
    //     pageSize: this.pages.pageSize,
    //     sort: 'desc',
    //     filters: [
    //       { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords },
    //       { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
    //       { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
    //       { key: 'status', opt: 'LIKE', type: 'S', value: '' },
    //       { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
    //       { key: 'effectivedate', opt: 'BETWEEN', type: 'D', value: '' }
    //     ],
    //     attr: { folderid: '5001' },
    //     logic: 'or'
    //   }
    //   getBooksList(obj).then(res => {
    //     console.log(res)
    //     if (!res) return false
    //     this.booksList = res.list.map(item => {
    //       item.effectiveion = !item.effectiveion
    //         ? ''
    //         : getFormateDate(new Date(item.effectiveion), 'yyyy-MM-dd')
    //       return item
    //     })
    //     this.pages.total = res.total
    //   })
    // },
    // 高级搜索
    highSearch() {
      this.pages.pageNum = 1
      let obj = {
        attr: { folderid: '5001' },
        orderby: 'createon',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc',
        logic: 'and',
        filters: [
          {
            key: 'title',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.doctitle
          },
          // 发布人
          {
            key: 'provideruser',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.provideruser
          },
          // 拟制人
          {
            key: 'authorname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.authorname
          },
          // 部门
          {
            key: 'deptname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.deptname
          },
          // 状态
          {
            key: 'status',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.status
          },
          // 体系分类
          {
            key: 'system',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.system
          },
          // 生效日期
          {
            key: 'effectivedate',
            opt: 'BETWEEN',
            type: 'D',
            value:
              this.searchForm.value1 && this.searchForm.value1.length
                ? this.searchForm.value1[0] + '~' + this.searchForm.value1[1]
                : ''
          }
        ]
      }
      getBooksList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list.map(item => {
          item.effectiveion = !item.effectiveion
            ? ''
            : getFormateDate(new Date(item.effectiveion), 'yyyy-MM-dd')
          return item
        })
        this.pages.total = res.total
      })
    },
    reset() {
      this.pages.pageNum = 1
      this.searchForm = {
        doctitle: '',
        enname: '',
        provideruser: '',
        docAuthorDis: '',
        status: '',
        name: '',
        value1: []
      }
      this.getList()
    },
    getList() {
      let obj = {
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        filters: [
          { key: 'title', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'provideruser', opt: 'LIKE', type: 'S', value: '' },
          { key: 'authorname', opt: 'LIKE', type: 'S', value: '' },
          { key: 'status', opt: 'LIKE', type: 'S', value: '' },
          { key: 'deptname', opt: 'LIKE', type: 'S', value: '' },
          { key: 'effectivedate', opt: 'BETWEEN', type: 'D', value: '' }
        ],
        attr: { folderid: '5001' }
      }
      getBooksList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list.map(item => {
          item.effectiveion = !item.effectiveion
            ? ''
            : getFormateDate(new Date(item.effectiveion), 'yyyy-MM-dd')
          return item
        })
        this.pages.total = res.total
        console.log(this.booksList)
      })
    },
    // 确认添加
    saveBooks() {
      this.$refs['form'].validate(valid => {
        if (valid && this.editFormObj.checkList.length > 0) {
          // 生效日期验证
          if (this.editFormObj.effectiveDate.length === 0) {
            this.$message({
              type: 'warning',
              message: '日期未选择！'
            })
            return
          }
          // 主文档验证
          if (this.fileList.length !== 1) {
            this.$message({
              type: 'warning',
              message: '主文档未上传！'
            })
            return
          }
          let obj = {
            docId: !this.editFormObj.docId ? '' : this.editFormObj.docId,
            docTitle: this.editFormObj.docTitle,
            fileId: this.referMainDoc ? this.fileList[0].fileId : '',
            inDate: getFormateDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            folderDocumentList: [{ documentid: '', folderid: '5001' }],
            enname: this.editFormObj.enname,
            signerlist: [{ userid: this.userid, cnname: this.username }],
            system: this.editFormObj.checkList.toString(),
            effectiveDate: !this.editFormObj.effectiveDate
              ? ''
              : getFormateDate(
                new Date(this.editFormObj.effectiveDate),
                'yyyy-MM-dd hh:mm:ss'
              )
          }
          saveBooks(obj).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              this.dialogVisible = false
              this.getList()
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '必填项不能为空！'
          })
        }
      })
    },
    deleteFile() {
      this.fileList = []
    },
    // 删除表格某一行数据
    deleteRow(id) {
      this.$confirm('确认要删除该条信息吗?', this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      })
        .then(() => {
          deleteBooks(id).then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: this.$t('hintText.successfullyDelete')
              })
              this.getList()
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 作废
    abolishRow(item) {
      let me = this
      this.$confirm('确定要作废该条信息吗?', this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        switch (true) {
          case me.processType === 'bpm' :
            // if (item.status == 7) {
            //   abolishRefuse({
            //     docid: item.docId,
            //     type: 'docid',
            //     userid: userId,
            //     newdocid: item.docId
            //   }).subscribe(res => {
            //     let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
            //       userId + '●password1'
            //     )}&param=${Base64.encode(res.url + '&lang=zh-CN')}`
            //     window.open(openUrl)
            //   })
            // } else {
            //   let urlStr = `/bpm/creater-process!apply.action?processname=Departmentdutiesprocess&processnodename=Start&projectname=departmentdutiesprocess&defaultOrganization=39390&baProcessId=${item.docId}&state=5&lang=zh-CN`
            //   let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
            //     userId + '●password1'
            //   )}&param=${Base64.encode(urlStr)}`
            //   window.open(openUrl)
            // }
            break
          case me.processType === 'direct' :
            updateStatusRule({
              id: item.docId,
              status: 5
            }).then(res => {
              if (!res) return false
              this.$message({
                type: 'success',
                message: '作废成功!'
              })
              this.keyWords = ''
              this.reset()
            })
            break
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改功能
    getDetails(id) {
      console.log(id)
      this.referMainDoc = false
      getDetails(id).then(res => {
        console.log(res)
        if (!res) return false
        this.editFormObj = res
        this.dialogVisible = true
        this.editFormObj = Object.assign({}, this.editFormObj, {
          docTitle: res.title,
          effectiveDate: getFormateDate(
            new Date(res.effectiveion),
            'yyyy-MM-dd'
          ),
          docId: res.docId,
          checkList: res.system.split(',')
        })
        this.fileList = res.docFile.map(item => {
          return {
            filename: item.newName,
            filesize: item.size + 'B',
            downloadUrl: item.downloadUrl,
            status: this.$t("uploaded"),
            fileId: res.docId
          }
        })
        // console.log(this.fileList)
      })
    },
    handlerFileUploadSuccess(res) {
      console.log(res)
      if (this.fileList.length === 1) {
        this.$message({
          type: 'warning',
          message: this.$t('hintText.pleaseDeleteItAndUploadItAgain')
        })
      } else {
        console.log(res)
        this.referMainDoc = true
        this.fileList.push({
          filename: res.data.newName,
          filesize: res.data.size + 'B',
          downloadUrl: this.host + '/regulation/download/' + res.id,
          status: this.$t("uploaded"),
          fileId: res.data.id
        })
      }
    },
    // 发布事件
    publishReg(item) {
      let me = this
      this.$confirm('确定要发布该条信息吗?', this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        switch (true) {
          case me.processType === 'bpm' :
            // if (item.status == 6) {
            //   pblishRefuse({
            //     docid: item.docId,
            //     type: 'docid',
            //     userid: userId,
            //     newdocid: item.docId
            //   }).subscribe(res => {
            //     let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
            //       userId + '●password1'
            //     )}&param=${Base64.encode(res.url + '&lang=zh-CN')}`
            //     window.open(openUrl)
            //   })
            // } else {
            //   let urlStr = `/bpm/creater-process!apply.action?processname=Manualsystemprocess&processnodename=Start&projectname=manualsystemprocess&defaultOrganization=39390&baProcessId=${
            //     item.docId
            //   }&state=${item.status == 1 ? 3 : 4}&lang=zh-CN`
            //   let openUrl = `${process.env.URL_BAS_HOST}${Base64.encode(
            //     userId + '●password1'
            //   )}&param=${Base64.encode(urlStr)}`
            //   window.open(openUrl)
            // }
            break
          case me.processType === 'direct' :
            updateStatusRule({
              id: item.docId,
              status: 3
            }).then(res => {
              if (!res) return false
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              this.keyWords = ''
              this.reset()
            })
            break
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 文本框字数限制
    descInput1(editFormObj) {
      if (this.editFormObj.docTitle.length > this.textMaxLength) {
        this.$message({
          message: '警告哦，字符不能超过50字符哦',
          type: 'error'
        })
      }
    },
    descInput2(editFormObj) {
      if (this.editFormObj.enname.length > this.textMaxLength) {
        this.$message({
          message: '警告哦，字符不能超过50字符哦',
          type: 'error'
        })
      }
    },
    // 获取体系分类
    getSystem() {
      getSystem({
        attr: {},
        filters: [
          {
            key: 'RULE_IS_VISIBLE',
            opt: 'EQ',
            type: 'S',
            value: 'Y'
          }
        ],
        logic: '',
        orderby: '',
        pageNum: 1,
        pageSize: 10000,
        sort: ''
      }).then(res => {
        this.sysLists = res
        console.log(this.sysLists)
      })
    }
  }
}
</script>
