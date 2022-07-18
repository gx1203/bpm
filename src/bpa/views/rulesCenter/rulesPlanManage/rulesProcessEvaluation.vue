<template>
  <div id="rulesProcessEvalution">
    <el-row>
      <el-col :span="12">
        <el-input
          placeholder="请输入"
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
        <el-button type="primary" @click="addDialog">添加</el-button>
        <el-button type="primary" @click="reset">刷新</el-button>
      </el-col>
    </el-row>

    <!-- 高级搜索 -->
    <el-collapse-transition>
      <el-form
        v-show="isHighSearch"
        class="search_options_wrap"
        :model="searchForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="评估主题">
              <el-input v-model="searchForm.subject" @keyup.13.native="highSearch" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评估年度">
              <el-input v-model="searchForm.years" @keyup.13.native="highSearch" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建部门">
              <el-input v-model="searchForm.deptname" @keyup.13.native="highSearch" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input v-model="searchForm.username" @keyup.13.native="highSearch" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" @keyup.13.native="highSearch" clearable>
                <el-option label="草 拟" value="0"></el-option>
                <el-option label="已完成" value="1"></el-option>
                <el-option label="审批中" value="2"></el-option>
                <el-option label="退 回" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">
              <el-date-picker
               @keyup.13.native="highSearch"
                clearable
                value-format="yyyy-MM-dd"
                v-model="searchForm.createon"
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
    <el-table :data="booksList" border class="main_tab">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="subject" label="评估主题"></el-table-column>
      <el-table-column prop="years" label="评估年度"></el-table-column>
      <el-table-column prop="deptname" label="创建部门"></el-table-column>
      <el-table-column label="创建人" prop="username"></el-table-column>
      <el-table-column prop="createon" label="创建时间"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{
          getStatus(scope.row.status)
        }}</template>
      </el-table-column>
      <el-table-column width="180" label="操作">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="修改"
            placement="top"
            v-if="
              userid === scope.row.createby &&
              (scope.row.status == 0 || scope.row.status == 3)
            "
          >
            <el-button
              @click="getDetails(scope.row.id, '修改')"
              class="no-border"
              type="text"
              circle
              >修改</el-button
            >
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="上报"
            placement="top"
            v-if="userid === scope.row.createby && scope.row.status == 0"
          >
            <el-button
              class="no-border"
              @click="updateStatus(scope.row)"
              type="text"
              circle
              >上报</el-button
            >
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="重新发起"
            placement="top"
            v-if="userid === scope.row.createby && scope.row.status == 3"
          >
            <el-button
              class="no-border"
              @click="toInitiate(scope.row)"
              type="text"
              circle
              >重新发起</el-button
            >
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="查看表单"
            placement="top"
            v-if="
              userid === scope.row.createby &&
              scope.row.instid &&
              scope.row.status == 3
            "
          >
            <el-button
              class="no-border"
              @click="openBpm(scope.row)"
              type="text"
              circle
              >查看表单</el-button
            >
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            v-if="
              userid === scope.row.createby &&
              (scope.row.status == 0)
            "
          >
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
              @click="getDetails(scope.row.id, '查看'); clearValidate(editFormObj)"
              class="no-border"
              type="text"
              circle
              >查看</el-button
            >
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pages.total"
    >
    </el-pagination>

    <!-- 评论弹窗 -->
    <el-dialog
      title="评估报告"
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
        <!-- <el-row v-if="!isEdit" style="padding: 0 10px"> -->
        <!-- <el-col :span="4" :offset="20" align="right"> -->
        <!-- <el-button
              type="primary"
              @click="
                getPdf({
                  title: editFormObj.deptname + '-' + editFormObj.subject,
                })
              "
              >下 载</el-button
            > -->
        <!-- </el-col> -->
        <!-- </el-row> -->
        <div id="pdfDom">
          <el-row>
            <div class="card">
              <div class="header">
                <span class="title">基本信息</span>
              </div>
            </div>
          </el-row>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-form-item label="评估主题:" prop="subject">
                <el-input
                  v-model="editFormObj.subject"
                  :disabled="!isEdit"
                  maxlength="100"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="评估年度:" prop="years">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="editFormObj.years"
                  type="year"
                  value-format="yyyy"
                  placeholder="选择年"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="editFormObj.id">
            <el-col :span="11" :offset="1">
              <el-form-item label="创建部门:">
                <el-input v-model="editFormObj.deptname" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="创建人:">
                <el-input v-model="editFormObj.username" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="editFormObj.id">
            <el-col :span="11" :offset="1" prop="createon">
              <el-form-item label="创建时间:">
                <el-date-picker
                  disabled
                  v-model="editFormObj.createon"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="card">
            <div class="header">
              <span class="title">评估内容</span>
            </div>
          </div>
          <el-form-item  v-if='!editFormObj.deptname'>
            <span class="attchFile"><span class="attchfile">*</span>附件</span>
            <el-upload
              :action="action"
              class="text-right"
              :on-success="handlerFileUploadSuccess"
              :show-file-list="false"
              :disabled="!isEdit"
            >
              <el-button size="mini" type="primary" class="attchUpload"
                ><span>附件上传</span
                ></el-button
              >
            </el-upload>
          </el-form-item>
          <el-table class="main_tab" :data="docFile">
            <el-table-column prop="filename" label="文件名"></el-table-column>
            <el-table-column prop="filesize" label="文件大小"></el-table-column>
            <el-table-column prop="status" label="上传状态"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="isEdit"
                  content="删除"
                  placement="top"
                >
                  <el-button
                    @click="deleteFile(scope.$index)"
                    class="no-border"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="下载"
                  placement="top"
                >
                  <a :href="downloadFile(scope.row.fileId)" download>
                    <el-button
                      class="no-border"
                      icon="el-icon-download"
                      circle
                    ></el-button>
                  </a>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit" @click="saveReport"
          >确 定</el-button
        >
        <!-- <el-button type="primary" v-if="isEdit" @click="saveIssueReport"
          >上 报</el-button -->
        <!-- > -->
      </span>
    </el-dialog>

    <!-- 上报选岗 -->
    <el-dialog title="选择岗位" :visible.sync="dialogPositionVisible">
      <el-form ref="item" label-width="250px" class="content">
        <el-form-item label="选择岗位:" required>
          <el-select v-model="positionId" class="w100" placeholder="请选择">
            <el-option
              v-for="data in positionList"
              :key="data.pid"
              :label="data.dname + '-' + data.pname"
              :value="data.pid"
            >
              <span style="float: left">{{
                data.dname + "-" + data.pname
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogPositionVisible = false;
            positionId = '';
          "
          >取 消</el-button
        >
        <el-button type="primary" @click="submitPosition()">确 定</el-button>
      </span>
    </el-dialog>

    <select-person2
      v-model="isPersonVisible"
      :selected="selectedPersonList"
      title="选择部门领导审批人"
      :isRequired="true"
      @confirm="handlerPersonComfirm"
    ></select-person2>
    <select-group
      v-model="isGroupVisible"
      :selectTree="['2']"
      :showTree="'1,2,3,4'"
      :selected="selectedID"
      @confirm="handlerGroupSelect"
    ></select-group>
    <systemDialog
      v-model="systemVisible"
      @confirm="confirmSystem"
      :processlists="defaultList"
    ></systemDialog>
  </div>
</template>

<script>
import {
  getReportList,
  saveReport,
  deleteReport,
  getDetails,
  updateStatus,
  restart,
  updateSelect,
} from "@/bpa/api/rulesCenter/rulesPlanManage";
import { getFormateDate } from "@/utils/common";
import systemDialog from "@/bpa/components/systemDialog";
import { downloadFile } from "@/bpa/utils/common";
export default {
  components: {
    systemDialog,
  },
  data() {
    return {
      booksList: [],
      keyWords: "",
      type: "手册体系文件",
      dialogVisible: false,
      dialogPositionVisible: false,
      isHighSearch: false,
      isEdit: false,
      selectedID: [],
      selectedPersonList: [],
      isGroupVisible: false,
      isPersonVisible: false,
      systemVisible: false,
      defaultList: [],
      params: {
        orderby: "createon",
        sort: "desc",
        logic: "and",
        attr: { jstatus: "0" },
      },
      docFile: [],
      searchForm: {
        subject: "",
        years: "",
        deptname: "",
        username: "",
        createon: "",
        status: "",
      },
      editFormObj: {
        effectiveDate: "",
      },
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      rules: {
        subject: [{ required: true, message: "请输入评估主题!!", trigger: "blur" }],
        years: [{ required: true, message: " ", trigger: "blur" }],
        createon: [{ required: true, message: " ", trigger: "blur" }],
        checkList: [{ required: true, message: " ", trigger: "blur" }],
        // uplodFile: [{require: true, message: " ",trigger: "blur"}]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
      positionList: [],
      positionId: "",
      itemId: "",
      mainLeader: {},
      userkey: "",
    };
  },
  //  mixins: [paginations, fileOperation],
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    action() {
      // return `${this.host}/regulation/upload?username=${this.userid}`;
      return `${this.host}/regulation/upload/?username=${this.userid}`;
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
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.docFile = [];
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    //清除表单验证
    clearValidate(formName){
      this.$refs['form'].clearValidate()
    },
    openBpm(item){
      window.open(process.env.VUE_APP_BPA_URL + '/#/processForm/view?name=%E5%88%B6%E5%BA%A6%E6%B5%81%E7%A8%8B%E8%AE%A1%E5%88%92%E5%88%9B%E5%BB%BA%E6%B5%81%E7%A8%8B&instanceId=' + item.instid + '&username=' + this.userid, '_blank')
    },
    // 下载文件
    downloadFile(fileId) {
      return downloadFile(fileId);
    },
    singleSearch() {
      this.pages.pageNum = 1;
      this.params = {
        orderby: "createon",
        sort: "desc",
        attr: { jstatus: "0" },
        filters: [
          { key: "subject", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "years", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "username", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "deptname", opt: "LIKE", type: "S", value: this.keyWords },
        ],
        logic: "or",
      };
      this.getList();
    },

    handlerGroupSelect(list) {
      this.editFormObj.deptid = list
        .map((item) => {
          return item.ID;
        })
        .join(",");
      this.editFormObj.deptname = list
        .map((item) => {
          return item.NAME;
        })
        .join(",");
    },

    confirmSystem(data) {
      if (this.editFormObj.list.length === 0) {
        this.editFormObj.list = data.map((item) => {
          return {
            name: item.name,
            nameid: item.id,
          };
        });
      } else {
        let sysname = [];
        data.forEach((val) => {
          let list = this.editFormObj.list.map((item) => item.nameid);
          if (list.indexOf(val.id) !== -1) {
            sysname.push(
              this.editFormObj.list.find((item) => {
                return item.nameid === val.id;
              })
            );
          }
        });
        data.forEach((val) => {
          let list = this.editFormObj.list.map((item) => item.nameid);
          if (list.indexOf(val.id) === -1) {
            sysname.push({
              name: val.name,
              nameid: val.id,
            });
          }
        });
        this.editFormObj.list = sysname;
      }

      this.systemVisible = false;
    },

    getStatus(type) {
      if (type === "0") {
        return "草拟";
      } else if (type === "1") {
        return "已完成";
      } else if (type === "2") {
        return "审批中";
      } else if (type === "3") {
        return "退回";
      }
    },

    handlerPersonComfirm(list) {
      let self = this;
      if (!list || list.length === 0) {
        this.$message.error("请选择部门领导审批人");
        return false;
      }
      self.$set(
        self.mainLeader,
        "mainLeaderid",
        list
          .map((item) => {
            return item.empuid;
          })
          .join(",")
      );
      self.$set(
        self.mainLeader,
        "mainLeader",
        list
          .map((item) => {
            return item.cnname;
          })
          .join(",")
      );
      self.$forceUpdate();
      this.submitPosition();
      return;
      // 不在获取当前登陆人员的岗位
      let data = JSON.parse(
        localStorage.getItem("portalCurrentUserInfo") || "{}"
      ).empuid;
      updateSelect(data).then((res) => {
        if (res && res.length === 1) {
          this.positionId = res[0].pid;
          this.submitPosition();
        } else if (res.length === 0) {
          this.$message.error("当前没有岗位信息，请联系BPM");
        } else {
          this.positionList = res;
          console.log(res);
          this.dialogPositionVisible = true;
        }
      });
    },

    handlerFileUploadSuccess(res) {
      if (this.docFile.length === 1) {
        this.$message.error("附件只能上传一份，请删除后上传！！");
        return;
      }
      console.log(res);
      this.docFile.push({
        filename: res.data.newName,
        filesize: res.data.size + "B",
        downloadUrl: this.host + "/attach/download/" + res.data.id,
        status: "已上传",
        fileId: res.data.id,
      });
    },

    getList() {
      let obj = {
        ...this.pages,
        ...this.params,
      };
      getReportList(obj).then((res) => {
        console.log(res);
        if (!res) return false;
        this.booksList = res.list;
        this.pages.total = res.total;
      });
    },

    addDialog() {
      this.dialogVisible = true;
      this.isEdit = true;
      this.docFile = [];
      this.editFormObj = {
        subject: "",
        years: new Date(),
        createon: new Date(),
      };
      this.$refs['form'].clearValidate()
    },
    reset() {
      this.keyWords = "";
      this.pages.pageNum = 1;
      this.searchForm = {
        doctitle: "",
        enname: "",
        provideruser: "",
        docAuthorDis: "",
        status: "",
        name: "",
        value1: [],
      };
      this.params = {
        orderby: "createon",
        sort: "desc",
        logic: "and",
        attr: { jstatus: "0" },
      };
      this.getList();
    },
    highSearch() {
      this.pages.pageNum = 1;
      this.params = {
        orderby: "createon",
        sort: "desc",
        logic: "and",
        attr: { jstatus: "0" },
        filters: [
          {
            key: "subject",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.subject,
          },
          {
            key: "years",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.years,
          },
          {
            key: "deptname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.deptname,
          },
          // 部门
          {
            key: "username",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.username,
          },
          // 状态
          {
            key: "status",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.status,
          },
          // 生效日期
          {
            key: "createon",
            opt: "BETWEEN",
            type: "D",
            value:
              this.searchForm.createon && this.searchForm.createon.length
                ? this.searchForm.createon[0] +
                  "~" +
                  this.searchForm.createon[1]
                : "",
          },
        ],
      };
      this.getList();
    },
    // 上报事件
    updateStatus(item) {
      // if (this.docFile.length < 1) {
      //   this.$message.error("附件不能为空！！");
      //   return;
      // }
      console.log(item);
      this.itemId = item.id;
      console.log(item.id);
      this.isPersonVisible = true;
    },
    // 选岗确认
    submitPosition() {
      updateStatus({
        id: this.itemId,
        userids: this.mainLeader.mainLeaderid,
      }).then((res) => {
        console.log(res);
        this.$message({
          type: "success",
          message: "上报成功!",
        });
        this.dialogPositionVisible = false;
        this.dialogVisible = false;
        this.getList();
      });
    },
    toInitiate(item) {
      getDetails(item.id)
        .then((res) => {
          if (!res) return false;
          return restart(res);
        })
        .then((re) => {
          this.$message({
            type: "success",
            message: "发起成功!",
          });
          this.dialogPositionVisible = false;
          this.getList();
        });
        
    },

    saveIssueReport() {
       if (this.docFile.length < 1) {
        this.$message.error("附件不能为空！！");
        return;
      }else{
      this.saveReport("isIssue");
      }
    },
    // 确认添加
    saveReport(type) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.docFile.length < 1) {
            this.$message.error("附件不能为空！！");
            return;
          }
          this.editFormObj.createon = getFormateDate(
            new Date(this.editFormObj.createon),
            "yyyy-MM-dd hh:mm:ss"
          );
          this.editFormObj.years = getFormateDate(
            new Date(this.editFormObj.years),
            "yyyy"
          );
          this.editFormObj.jstatus = "0";
          this.editFormObj.fj = this.docFile
            .map((item) => item.fileId)
            .join(",");
          saveReport(this.editFormObj).then((res) => {
            if (type === "isIssue") {
              if (this.editFormObj.status === "3") {
                restart(this.editFormObj).then((re) => {
                  this.$message({
                    type: "success",
                    message: "发起成功!",
                  });
                  this.dialogVisible = false;
                  this.getList();
                });
              } else {
                this.dialogVisible = false;
                this.getList();
                this.updateStatus(res);
              }
            } else {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.getList();
            }
          });
        }
      });
    },
    deleteFile(index) {
      this.$confirm("确认要删除该条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.docFile.splice(index, 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除表格某一行数据
    deleteRow(id) {
      this.$confirm("确认要删除该条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteReport(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功！",
            });
            this.getList();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // getDetails(id, type) {
    //   console.log('========')
    //   getDetails(id).then((res) => {
    //     if (!res) return false;
    //     this.editFormObj = res;
    //     console.log(res)
    //     if (res.fjDto) {
    //       this.docFile = [
    //         {
    //           filename: res.fjDto.originalName,
    //           filesize: res.fjDto.fileSize + "B",
    //           status: "已上传",
    //           fileId: res.fjDto.id,
    //         },
    //       ];

    //     }
    //     if (type === "修改") {
    //       this.isEdit = true;
    //     } else {
    //       this.isEdit = false;
    //     }
    //     this.dialogVisible = true;
    //     this.editFormObj = Object.assign({}, this.editFormObj);
    //   });
    // },
    deleteFile(index) {
      this.$confirm("确认要删除该条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.docFile.splice(index, 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除表格某一行数据
    deleteRow(id) {
      this.$confirm("确认要删除该条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteReport(id).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功！",
            });
            this.getList();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDetails(id, type) {
      console.log("========");
      getDetails(id).then((res) => {
        console.log(res);
        if (!res) return false;
        this.editFormObj = res;
        if (type === "修改") {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
        this.dialogVisible = true;
        if (res.fjDto) {
          this.docFile.push({
            filename: res.fjDto.originalName,
            filesize: res.fjDto.fileSize + "B",
            status: "已上传",
            fileId: res.fjDto.id,
          });
          console.log(this.docFile);
        }
        this.editFormObj = Object.assign({}, this.editFormObj);
      });
      this.$refs['form'].clearValidate()
    },

    //分页
    handleCurrentChange(value) {
      console.log(this.pages);
      console.log(value);
      this.processlistpage = value;
      this.pages.pageNum = value;
      if (this.historyPages == "1") {
        this.checkHistoryRules(this.docno);
      } else {
        this.getList();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
.w100 {
  width: 60% !important;
}
#pdfDom {
  padding: 10px;
}
#rulesProcessEvalution {
  padding: 20px;
  .high_search {
    margin-left: 20px;
    // border-radius: 0;
  }
}
.attchfile {
  text-align: center;
  margin-right: 3px;
  color: rgba($color:red, $alpha: 0.7);
  // transform: translateY(-2px);
}
// .attachfile::before {
//   content: " *";
//   color:rgba($color:red, $alpha: 0.8);
//   font-size: 150%;
// }
.text-right{
  transform: translateY(-20px);
  z-index: 99;
}
.dialog-footer{
  margin-right: 20px;
}
// .attchUpload:hover{
//   background-color: #999999 !important;
//   border-color: #999999 !important;
// }
</style>