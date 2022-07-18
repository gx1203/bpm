<template>
  <div id="handbookFiles">
    <el-row>
      <el-col :span="12">
        <el-input
          placeholder="请输入信息内容、相关流程、信息来源、创建部门、创建人"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="singleSearch"
        >
          <el-button type="primary" slot="append" @click="singleSearch">
            {{ $t("search") }}</el-button
          >
        </el-input>
      </el-col>
      <el-col :span="12" class="search_buttons_wrap">
        <el-button @click="isHighSearch = !isHighSearch" type="primary">
          高级查询
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
            <el-form-item label="信息内容">
              <el-input clearable v-model="searchForm.content"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="信息来源">
              <el-input clearable v-model="searchForm.sourcefrom"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程框架">
              <el-input clearable v-model="searchForm.rsystem"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建部门">
              <el-input clearable v-model="searchForm.deptname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建人">
              <el-input clearable v-model="searchForm.username"></el-input>
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
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('state')">
              <el-select clearable v-model="searchForm.status">
                <el-option label="草 拟" value="0"></el-option>
                <el-option label="已同步" value="1"></el-option>
                <el-option label="已作废" value="2"></el-option>
                <el-option label="修改中" value="3"></el-option>
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
    <el-table :data="booksList" class="main_tab">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="content" label="信息内容"></el-table-column>
      <el-table-column label="信息来源" prop="sourcefrom"></el-table-column>
      <el-table-column label="流程框架" prop="rsystem"></el-table-column>
      <el-table-column label="创建人" prop="username"></el-table-column>
      <el-table-column prop="deptname" label="创建部门"></el-table-column>
      <el-table-column prop="createon" label="创建时间"></el-table-column>
      <el-table-column
        prop="filename"
        :label="$t('attachment')"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <a v-if="scope.row.filename" :href="downloadFile(scope.row.fileId)">{{
            scope.row.filename
          }}</a>
        </template>
      </el-table-column>
      <el-table-column :label="$t('state')">
        <template slot-scope="scope">
          <p v-if="scope.row.status === '0'">草拟</p>
          <p v-if="scope.row.status === '1'">已同步</p>
          <p v-if="scope.row.status === '2'">已作废</p>
          <p v-if="scope.row.status === '3'">修改中</p>
        </template>
      </el-table-column>

      <el-table-column width="160" :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <!-- class="no-border"
              icon="el-icon-view"
              circle -->
            <el-button @click="getDetails(scope.row.id, '查看')" type="text"
              >查看</el-button
            >
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            v-if="userid === scope.row.createby && scope.row.status == 1"
            content="作废"
            placement="top"
          >
            <!-- class="no-border"
              icon="el-icon-refresh-left"
              circle -->
            <el-button @click="voidById(scope.row.id)" type="text"
              >作废</el-button
            >
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('modify')"
            v-if="
              userid === scope.row.createby &&
              (scope.row.status == 0 || scope.row.status == 3)
            "
            placement="top"
          >
            <!-- class="no-border"
              icon="el-icon-edit"
              circle -->
            <el-button @click="getDetails(scope.row.id, '修改')" type="text">{{
              $t("modify")
            }}</el-button>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="同步"
            v-if="
              userid === scope.row.createby &&
              (scope.row.status === '0' || scope.row.status === '3')
            "
            placement="top"
          >
            <el-button @click="synchronizationHandle(scope.row)" type="text"
              >同步</el-button
            >
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('delete')"
            v-if="
              userid === scope.row.createby &&
              (scope.row.status === '0' || scope.row.status === '3')
            "
            placement="top"
          >
            <!-- class="no-border"
              icon="el-icon-delete"
              circle -->
            <el-button @click="deleteRow(scope.row.id)" type="text">{{
              $t("delete")
            }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-sizes="[10, 15, 20]"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
    ></el-pagination>
    <!-- 添加弹框 -->
    <el-dialog
      title="制度信息库"
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
          <el-form-item label="信息内容:" prop="content">
            <el-input
              clearable
              v-model="editFormObj.content"
              type="textarea"
              :disabled="!isEdit"
              maxlength="1000"
            ></el-input>
          </el-form-item>
          <el-form-item label="信息来源:" prop="sourcefrom">
            <el-input
              clearable
              v-model="editFormObj.sourcefrom"
              :disabled="!isEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="流程框架:" prop="rsystem">
            <el-input
              clearable
              v-model="editFormObj.rsystem"
              @focus="systemHandle"
              :disabled="!isEdit"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="editFormObj.id" label="创建人:">
            <el-input
              clearable
              v-model="editFormObj.username"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="创建部门:" v-if="editFormObj.id">
            <el-input
              clearable
              v-model="editFormObj.deptname"
              disabled
            ></el-input>
          </el-form-item>
          <!--
          <el-form-item label="创建部门:">
            <el-input clearable v-model="editFormObj.deptname" @focus="focusDeptHandle" :disabled="!isEdit"></el-input>
          </el-form-item>-->
          <el-form-item label="创建时间:" v-if="editFormObj.id">
            <el-date-picker
              clearable
              disabled
              v-model="editFormObj.createon"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <!-- 上传附件 -->
          <el-form-item :label="$t('attachment')" v-if="isEdit">
            <el-upload
              :action="action"
              :on-success="handlerFileUploadSuccess"
              :show-file-list="false"
            >
              <el-button size="mini" type="primary">{{
                $t("bpa_clickUpload")
              }}</el-button>
            </el-upload>
          </el-form-item>
          <el-table class="main_tab" :data="docFile">
            <el-table-column
              prop="filename"
              :label="$t('fileName')"
            ></el-table-column>
            <el-table-column prop="filesize" label="文件大小"></el-table-column>
            <el-table-column prop="status" label="上传状态"></el-table-column>
            <el-table-column :label="$t('operation')">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('delete')"
                  v-if="isEdit"
                  placement="top"
                >
                  <!-- class="no-border"
                    icon="el-icon-delete"
                    circle -->
                  <el-button @click="deleteFile" type="text">{{
                    $t("delete")
                  }}</el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="下载"
                  placement="top"
                >
                  <a :href="downloadFile(scope.row.fileId)" download>
                    <el-button type="text">下载</el-button>
                  </a>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t("cancel") }}</el-button>
        <el-button
          type="primary"
          v-if="isEdit"
          @click="saveInformationManage"
          >{{ $t("confirm") }}</el-button
        >
      </span>
    </el-dialog>
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
    <el-dialog
      title="信息同步"
      :visible.sync="synchronizationVisible"
      width="65%"
    >
      <el-form label-width="120px">
        <el-row>
          <el-form-item label="同步的制度：">{{
            synchronization.rsystem
          }}</el-form-item>
          <el-form-item label="通知人员：" required>
            <el-input
              clearable
              v-model="synchronizationUser.username"
              @focus="focusPersonHandle"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="synchronizationVisible = false">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="updateStatus">{{
          $t("confirm")
        }}</el-button>
      </span>
    </el-dialog>
    <select-person2
      v-model="isPersonVisible"
      @confirm="handlerSelectComfirm"
    ></select-person2>
  </div>
</template>

<script>
import {
  getInformationManageList,
  saveInformationManage,
  deleteInformationManage,
  getDetails,
  voidById,
  updateStatus,
} from "@/bpa/api/settings/informationManage";
import paginations from "@/bpa/mixins/pagination_mixin";
import fileOperation from "@/bpa/mixins/fileDownView";
import systemDialog from "@/bpa/components/systemDialog";
import {
  getFormateDate,
  Base64,
  userId,
  viewFile,
  downloadFile,
} from "@/bpa/utils/common";
import { createNamespacedHelpers } from "vuex";
import axios from "axios";

const userInfo = createNamespacedHelpers("userInfo");
export default {
  data() {
    return {
      booksList: [],
      docFile: [],
      selectedPersonList: [],
      authority: "",
      systemVisible: false,
      defaultList: [],
      keyWords: "",
      isPersonVisible: false,
      PersonList: [],
      synchronization: {},
      synchronizationUser: {},
      synchronizationVisible: false,
      isSelectPersonVisible: false,
      dialogVisible: false,
      isHighSearch: false,
      isEdit: false,
      selectedID: [],
      isGroupVisible: false,
      searchForm: {
        content: "",
        sourcefrom: "",
        deptname: "",
        duty: "",
        timelimit: "",
        username: "",
        createon: "",
      },
      editFormObj: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      rules: {
        content: [{ required: true, message: " ", trigger: "blur" }],
        sourcefrom: [{ required: true, message: " ", trigger: "blur" }],
        deptname: [{ required: true, message: " ", trigger: "blur" }],
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
    };
  },
  mixins: [paginations, fileOperation],
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`;
      // return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    download() {
      return this.host + "/regulation/download/";
    },
  },
  components: {
    systemDialog,
  },
  mounted() {
    // 获取当前登录人权限
    this.getAuthoriy();
    this.getList();
  },
  methods: {
    // 下载文件
    downloadFile(fileId) {
      return downloadFile(fileId);
    },
    focusDeptHandle() {
      this.selectedID = [];
      if (this.editFormObj.deptid) {
        this.editFormObj.deptid.split(",").forEach((item, index) => {
          this.selectedID.push({
            NAME: this.editFormObj.deptname
              ? this.editFormObj.deptname.split(",")[index]
              : "",
            ID: Number(item),
          });
        });
      }
      this.isGroupVisible = true;
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
    systemHandle() {
      this.defaultList = [];
      if (this.editFormObj.rsystemid) {
        this.editFormObj.rsystemid.split(",").forEach((item, index) => {
          this.defaultList.push({
            name: this.editFormObj.rsystem
              ? this.editFormObj.rsystem.split(",")[index]
              : "",
            id: item,
          });
        });
      }
      this.systemVisible = true;
    },
    confirmSystem(data) {
      this.editFormObj.rsystem = data.map((item) => item.name?item.name:item.foldername).join(",");
      this.editFormObj.rsystemid = data.map((item) => item.id).join(",");
      this.systemVisible = false;
    },
    getAuthoriy() {
      axios
        .get(`${this.host}/jurisdictionConfigration/getByUserId/${this.userid}`)
        .then((rt) => {
          let data = rt.data.data;
          if (data.type === "1") {
            this.authority = "1";
          } else if (data.type === "2") {
            if (data.zdxxkgl === "Y") {
              this.authority = "2";
            } else {
              this.authority = "1";
            }
          } else if (data.type === "3") {
            this.authority = "3";
          }
        });
    },
    addDialog() {
      this.dialogVisible = true;
      this.docFile = [];
      this.isEdit = true;
      this.editFormObj = {
        content: "",
        sourcefrom: "",
        deptname: "",
        duty: "",
        timelimit: "",
        username: "",
        createon: "",
      };
    },
    focusHandle() {
      this.selectedPersonList = [];
      if (this.editFormObj.deptname) {
      }
      this.isSelectPersonVisible = true;
    },
    addList() {
      this.editFormObj.list.push({});
    },
    singleSearch() {
      this.pages.pageNum = 1;
      let obj = {
        orderby: "createon",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: "desc",
        filters: [
          { key: "content", opt: "LIKE", type: "S", value: this.keyWords },
          {
            key: "sourcefrom",
            opt: "LIKE",
            type: "S",
            value: this.keyWords,
          },
          { key: "deptname", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "rsystem", opt: "LIKE", type: "S", value: this.keyWords },
          { key: "username", opt: "LIKE", type: "S", value: this.keyWords },
        ],
        logic: "or",
      };
      getInformationManageList(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list.map((item) => {
          item.createon = !item.createon
            ? ""
            : getFormateDate(item.createon, "yyyy-MM-dd hh:mm:ss");
          if (item.docFile) {
            item.filename = item.docFile[0].originalName;
            item.fileId = item.docFile[0].id;
          }
          return item;
        });
        this.pages.total = res.total;
      });
    },
    handlerSelectPersonComfirm(list) {
      this.editFormObj.deptid = list
        .map((item) => {
          return item.cnname;
        })
        .toString();
      this.editFormObj.deptname = list
        .map((item) => {
          return item.empuid;
        })
        .join(",");
    },
    highSearch() {
      this.pages.pageNum = 1;
      let obj = {
        orderby: "createon",
        pageNum: 1,
        pageSize: 10,
        sort: "desc",
        logic: "and",

        filters: [
          {
            key: "content",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.content,
          },
          {
            key: "sourcefrom",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.sourcefrom,
          },
          {
            key: "deptname",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.deptname,
          },
          {
            key: "rsystem",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.rsystem,
          },
          {
            key: "status",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.status,
          },
          {
            key: "username",
            opt: "LIKE",
            type: "S",
            value: this.searchForm.username,
          },
          // 生效日期
          {
            key: "createon",
            opt: "BETWEEN",
            type: "D",
            value:
              this.searchForm.createon && this.searchForm.createon.length
                ? this.searchForm.createon[0] +
                  " 00:00:00" +
                  "~" +
                  this.searchForm.createon[1] +
                  " 23:59:59"
                : "",
          },
        ],
      };
      getInformationManageList(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list.map((item) => {
          item.createon = !item.createon
            ? ""
            : getFormateDate(item.createon, "yyyy-MM-dd hh:mm:ss");
          if (item.docFile) {
            item.filename = item.docFile[0].originalName;
            item.fileId = item.docFile[0].id;
          }
          return item;
        });

        this.pages.total = res.total;
      });
    },
    reset() {
      this.pages.pageNum = 1;
      this.searchForm = {
        doctitle: "",
        enname: "",
        provideruser: "",
        docAuthorDis: "",
        status: "",
        content: "",
        value1: [],
      };
      this.getList();
    },
    getList() {
      let obj = {
        orderby: "createon",
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: "desc",
        filters: [],
      };
      getInformationManageList(obj).then((res) => {
        if (!res) return false;
        this.booksList = res.list.map((item) => {
          item.createon = !item.createon
            ? ""
            : getFormateDate(item.createon, "yyyy-MM-dd hh:mm:ss");
          if (item.docFile) {
            item.filename = item.docFile[0].originalName;
            item.fileId = item.docFile[0].id;
          }
          return item;
        });
        this.pages.total = res.total;
      });
    },
    // 确认添加
    saveInformationManage() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.editFormObj.docFile = this.docFile;
          this.editFormObj.fj = this.docFile
            .map((item) => item.fileId)
            .join(",");
          saveInformationManage(this.editFormObj).then((res) => {
            this.$message({
              type: "success",
              message: "保存成功！",
            });
            this.dialogVisible = false;
            this.getList();
          });
        }
      });
    },
    deleteFile(index) {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          this.docFile.splice(index, 1);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除表格某一行数据
    deleteRow(id) {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          deleteInformationManage(id).then((res) => {
            this.$message({
              type: "success",
              message: this.$t("hintText.successfullyDelete"),
            });
            this.getList();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    voidById(id) {
      this.$confirm(
        "确认要作废该条信息并通知相关人员?",
        this.$t("hintText.hint"),
        {
          confirmButtonText: this.$t("confirm"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      )
        .then(() => {
          voidById(id).then((res) => {
            this.$message({
              type: "success",
              message: "作废成功！",
            });
            this.getList();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handlerFileUploadSuccess(res) {
      if (this.docFile.length === 1) {
        this.$message({
          type: "warning",
          message: "附件只能上传一份，请删除后再重新上传",
        });
      } else {
        this.docFile.push({
          filename: res.data.newName,
          filesize: res.data.size + "B",
          downloadUrl: this.host + "/regulation/download/" + res.data.id,
          status: this.$t("uploaded"),
          fileId: res.data.id,
        });
      }
    },
    // 作废
    abolishRow(item) {
      this.$confirm("确定要作废该条信息吗?", this.$t("hintText.hint"), {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        type: "warning",
      })
        .then(() => {
          updateStatusRule({
            id: item.docId,
            status: 5,
          }).then((res) => {
            if (!res) return false;
            this.$message({
              type: "success",
              message: "作废成功!",
            });
            this.keyWords = "";
            this.reset();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDetails(id, type) {
      this.docFile = [];
      getDetails(id).then((res) => {
        if (!res) return false;
        this.editFormObj = res;
        if (res.docFile) {
          this.docFile = res.docFile.map((item) => {
            return {
              filename: item.originalName,
              filesize: item.fileSize + "B",
              downloadUrl: item.downloadUrl,
              status: this.$t("uploaded"),
              fileId: item.id,
            };
          });
        }
        if (type === "修改") {
          this.isEdit = true;
        } else {
          this.isEdit = false;
        }
        this.dialogVisible = true;
        this.editFormObj = Object.assign({}, this.editFormObj);
      });
    },
    handlerSelectComfirm(list) {
      this.synchronizationUser.username = list
        .map((item) => {
          return item.cnname;
        })
        .toString();
      this.synchronizationUser.userid = list
        .map((item) => {
          return item.empuid;
        })
        .join(",");
    },
    focusPersonHandle() {
      this.isPersonVisible = true;
    },
    synchronizationHandle(item) {
      this.synchronizationUser = {
        username: "",
        userid: "",
      };
      this.synchronization = item;
      this.synchronizationVisible = true;
    },
    // 下发事件
    updateStatus() {
      if (!this.synchronizationUser.userid) {
        this.$message.error("请选择通知人员！！");
        return false;
      }
      updateStatus(this.synchronization.id, this.synchronizationUser.userid)
        .then((res) => {
          this.$message({
            type: "success",
            message: "同步成功!",
          });
          this.synchronizationVisible = false;
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-col-8 {
  height: 42px !important;
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
</style>
