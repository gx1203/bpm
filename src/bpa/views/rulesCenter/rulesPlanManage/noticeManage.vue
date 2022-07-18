<template>
  <div id="handbookFiles">
    <el-row>
      <el-col :span="12">
        <el-input
          placeholder="请输入标题、创建人"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="singleSearch"
        >
          <el-button type="primary" slot="append" @click="singleSearch"
            >搜索</el-button
          >
        </el-input>
        <el-button
          class="high_search"
          @click="isHighSearch = !isHighSearch"
          type="primary"
        >
          高级查询
          <i
            :class="isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          ></i>
        </el-button>
      </el-col>
      <el-col :span="12" class="search_buttons_wrap">
        <el-button
          type="primary"
          @click="addDialog"
          >添加</el-button
        >
        <!-- v-if="authority === '2' || authority === '3'" 添加按钮的权限-->
        <el-button type="primary" @click="reset">刷新</el-button>
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
              <el-input v-model="searchForm.subject" clearable  @keyup.13.native="highSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input v-model="searchForm.createname" @keyup.13.native="highSearch" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-date-picker
                clearable
                value-format="yyyy-MM-dd"
                v-model="searchForm.createon"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @keyup.13.native="highSearch"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" @keyup.13.native="highSearch" clearable>
                <el-option label="未下发" value="0"></el-option>
                <el-option label="已下发" value="1"></el-option>
              </el-select>
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
    <el-table :data="booksList" border class="main_tab">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="subject" label="标题"></el-table-column>
      <el-table-column label="创建人" prop="createname"></el-table-column>
      <el-table-column prop="createon" label="创建时间"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{
          scope.row.status == 0 ? "未下发" : "已下发"
        }}</template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="修改"
            placement="top"
            v-if="scope.row.status == 0"
          >
          <!-- 修改的权限控制 -->
           <!-- userid === scope.row.createby && -->
              <!-- (authority === '2' || authority === '3') && -->
            <el-button
              @click="getDetails(scope.row.id, '修改');clearValidate()"
              class="no-border"
              type="text"
              circle
              >修改</el-button
            >
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="下发"
            placement="top"
            v-if="scope.row.status == 0"
          >
          <!--下发的权限控制 -->
           <!-- userid === scope.row.createby &&
              (authority === '2' || authority === '3') && -->
            <el-button
              class="no-border"
              @click="updateStatus(scope.row)"
              type="text"
              circle
              >下发</el-button
            >
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            v-if="scope.row.status == 0"
            placement="top"
          >
          <!-- 删除按钮的权限控制 -->
           <!-- userid === scope.row.createby &&
              (authority === '2' || authority === '3') && -->
            <el-button
              @click="deleteRow(scope.row.id)"
              class="no-border"
              type="text"
              circle
              >删除</el-button
            >
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button
              @click="getDetails(scope.row.id, '查看')"
              class="no-border"
              type="text"
              circle
              >查看</el-button
            >
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size.sync="pages.pageSize"
      layout="prev, pager, next, jumper"
      :total="pages.total"
    ></el-pagination> -->

    <el-pagination
          :current-page="pages.pageNum"
          :page-size.sync="pages.pageSize"
          background
          layout="total,prev, pager, next, jumper, total"
          :total="pages.total"
          @current-change="handleCurrentChange"
        />
    <!-- 添加弹框 -->
    <el-dialog
      title="通知下发"
      :visible.sync="dialogVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="90px"
        :rules="rules"
      >
        <el-row>
          <el-form-item label="标题:" prop="subject">
            <el-input
              v-model="editFormObj.subject"
              :disabled="!isEdit"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="OA通知:">
            <el-button size="mini" @click="toOaHref" type="primary">
              发送OA通知
            </el-button>
          </el-form-item> -->
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit" @click="saveNotice"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <select-group
      v-model="isSelectPersonVisible"
      :selectTree="['2']"
      :showTree="'1,2,3,4'"
      :selected="selectedPersonList"
      @confirm="handlerSelectPersonComfirm"
    ></select-group>
  </div>
</template>

<script>
import {
  getReportList,
  saveNotice,
  deleteReport,
  getDetails,
  updateStatus
} from '@/bpa/api/rulesCenter/noticeManage'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import {
  getFormateDate,
  Base64,
  userId,
  viewFile,
  downloadFile
} from '@/utils/common'
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'
export default {
  data() {
    return {
      booksList: [],
      docFile: [],
      selectedPersonList: [],
      keyWords: "",
      isSelectPersonVisible: false,
      params: {
        orderby: "createon",
        sort: "desc",
      },
      dialogVisible: false,
      isHighSearch: false,
      isEdit: false,
      authority: "",
      searchForm: {
        subject: "",
        username: "",
        content: "",
        createon: "",
      },
      editFormObj: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      rules: {
        subject: [{ required: true, message: " ", trigger: "blur" }],
        departmentname: [{ required: true, message: " ", trigger: "blur" }],
        content: [{ required: true, message: " ", trigger: "blur" }],
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
    };
  },
  computed:{
     host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`;
    },
    download() {
      return this.host + "/regulation/download/";
    },
    viewfile() {
      return this.host + "/document/print/";
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    },
   
  },
   mounted(){
      // 获取当前登录人权限
    // this.getAuthoriy()

    this.getList()
    },
  methods: {
    //清除表单验证
    clearValidate(){
      this.$refs['form'].clearValidate()
    },

    //权限管理
    // getAuthoriy () {
    //   axios
    //     .get(`${this.host}/jurisdictionConfigration/getByUserId/${this.userid}`)
    //     .then(rt => {
    //       let data = rt.data.data
    //       if (data.type === '1') {
    //         this.authority = '1'
    //       } else if (data.type === '2') {
    //         if (data.tzgl === 'Y') {
    //           this.authority = '2'
    //         } else {
    //           this.authority = '1'
    //         }
    //       } else if (data.type === '3') {
    //         this.authority = '3'
    //       }
    //     })
    // },
    addDialog () {
      this.dialogVisible = true
      this.docFile = []
      this.isEdit = true
      this.editFormObj = {
        subject: '',
        username: '',
        content: '',
        createon: ''
      }
    },
    focusHandle () {
      this.selectedPersonList = []
      if (this.editFormObj.departmentid) {
        this.editFormObj.departmentid.split(',').forEach((item, index) => {
          this.selectedPersonList.push({
            NAME: this.editFormObj.departmentname
              ? this.editFormObj.departmentname.split(',')[index]
              : '',
            ID: Number(item)
            // cnname: this.editFormObj.username
            //   ? this.editFormObj.username.split(',')[index]
            //   : '',
            // empuid: item
          })
        })
      }
      this.isSelectPersonVisible = true
    },
    addList () {
      this.editFormObj.list.push({})
    },
    singleSearch () {
      this.pages.pageNum = 1
      this.params = {
        orderby: 'createon',
        sort: 'desc',
        filters: [
          { key: 'subject', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'createname', opt: 'LIKE', type: 'S', value: this.keyWords }
        ],
        logic: 'or'
      }
      this.getList()
    },
    handlerSelectPersonComfirm (list) {
      this.$set(this.editFormObj, 'departmentname', list
        .map(item => {
          return item.NAME
        })
        .toString())
      this.$set(this.editFormObj, 'departmentid', list
        .map(item => {
          return item.ID
        })
        .join(','))
    },
    highSearch () {
      this.pages.pageNum = 1
      this.params = {
        orderby: 'createon',
        sort: 'desc',
        logic: 'and',
        filters: [
          {
            key: 'subject',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.subject
          },
          {
            key: 'createname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.createname
          },
          // 状态
          {
            key: 'status',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.status
          },
          // 生效日期
          {
            key: 'createon',
            opt: 'BETWEEN',
            type: 'D',
            value:
              this.searchForm.createon && this.searchForm.createon.length
                ? this.searchForm.createon[0] +
                '~' +
                this.searchForm.createon[1]
                : ''
          }
        ]
      }
      this.getList()
    },
    toOaHref () {
      axios({
        method: 'GET',
        url: `${this.host}/hytllc/getOaJtFw/${JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid}?username=${JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid}`,
        headers: {
          token: JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid
        }
      }).then(res => {
        if (res.data.status === '200') {
          let href = res.data.data
          // window.open(routeData.href, "_blank");
          let a = document.createElement('a')
          // 给创建好的a标签赋值
          a.setAttribute('href', href)
          // 设置css 隐藏属性
          a.setAttribute('style', 'display:none')
          // 设置 a标签为新窗口打开
          a.setAttribute('target', '_blank')
          // 将设置好的a标签，添加到 body 内
          document.body.appendChild(a)
          // 模拟点击
          a.click()
          // 移除a标签
          a.parentNode.removeChild(a)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch((e) => {
        this.$message.error('内部错误!')
      })
    },

    //分页
     handleCurrentChange(value) {
      this.processlistpage = value;
      this.pages.pageNum = value
      this.getList();
    },

    handleSizeChange(val){
      console.log(`每页${val}条`)
    },


    reset () {
      this.pages.pageNum = 1
      this.keyWords = ''
      this.searchForm = {
        doctitle: '',
        enname: '',
        provideruser: '',
        docAuthorDis: '',
        status: '',
        name: '',
        value1: []
      }
      this.params = {
        orderby: 'createon',
        sort: 'desc'
      }
      this.getList()
    },
    getList () {
      let obj = {
        ...this.params,
        ...this.pages
      }
      getReportList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list.map(item => {
          item.createon = !item.createon
            ? ''
            : getFormateDate(new Date(item.createon), 'yyyy-MM-dd hh:mm:ss')
          return item
        })
        this.pages.total = res.total
      })
    },
    // 确认添加
    saveNotice () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.editFormObj.docFile = this.docFile
          this.editFormObj.fj = this.docFile.map(item => item.fileId).join(',')
          saveNotice(this.editFormObj).then(res => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    deleteFile (index) {
      this.$confirm('确认要删除该条附件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.docFile.splice(index, 1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除表格某一行数据
    deleteRow (id) {
      this.$confirm('确认要删除该条信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteReport(id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getList()
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handlerFileUploadSuccess (res) {
      this.docFile.push({
        filename: res.newName,
        filesize: res.size + 'B',
        downloadUrl: this.host + '/attach/download/' + res.id,
        status: '已上传',
        fileId: res.id
      })
    },
    // 作废
    abolishRow (item) {
      this.$confirm('确定要作废该条信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
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
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDetails (id, type) {
      this.docFile = []
      getDetails(id).then(res => {
        if (!res) return false
        this.editFormObj = res
        if (res.docFile) {
          this.docFile = res.docFile.map(item => {
            return {
              filename: item.originalName,
              filesize: item.fileSize + 'B',
              downloadUrl: item.downloadUrl,
              status: '已上传',
              fileId: item.id
            }
          })
        }
        if (type === '修改') {
          this.isEdit = true
        } else {
          this.isEdit = false
        }
        this.dialogVisible = true
        this.editFormObj = Object.assign({}, this.editFormObj)
      })
    },
    // 下发事件
    updateStatus (item) {
      this.$confirm(
        `<p>标题: ${item.subject}</p><p>接收人: ${item.username}</p>`,
        '下发提示',
        {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          updateStatus(item.id).then(res => {
            this.$message({
              type: 'success',
              message: '下发成功!'
            })
            this.getList()
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
};
</script>

<style lang="scss" scoped>
#handbookFiles {
  padding: 20px;
}
.card {
  background: white;
  border-bottom: 1px solid $dc1;
  overflow: hidden;
  transition-duration: 0.5s;
  box-sizing: border-box;
  margin-bottom: 10px;
  .header {
    margin-right: 10px;
    display: flex;
    .title {
      height: 35px;
      line-height: 35px;
      color: $tc1;
      font-weight: bold;
    }
    .space {
      flex-grow: 1;
    }
  }
}
.high_search {
  margin-left: 10px;
  border-radius: none;
}
</style>
