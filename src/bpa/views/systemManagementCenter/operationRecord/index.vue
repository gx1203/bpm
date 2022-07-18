<template>
  <div id="groupManage">
    <el-row :gutter="20" class="group_container">
      <el-col :span="4" class="tree_wrap">
        <el-row>
          <el-input
            placeholder="请输入内容"
            class="search_component remove-margin-b"
            v-model="searchInter"
            clearable
            @keyup.13.native="searchSystem"
          >
            <el-button type="primary" @click="searchSystem" slot="append"
              >搜索</el-button
            >
          </el-input>
        </el-row>
        <el-scrollbar class="tree_node">
          <ul class="inside_ul">
            <li
              class="inside_li"
              v-for="(item, index) in itList"
              :key="index"
              :style="
                indexInfo === index
                  ? 'color: #0796f9;border-left: 5px solid #0796f9;background: #e6f5fe;font-size: 13px;'
                  : 'font-size: 13px;'
              "
            >
              <span
                :style="
                  indexInfo === index
                    ? 'color: #0796f9;font-size: 13px;'
                    : 'font-size: 13px;'
                "
                :title="item.name"
                @click="insideName(index)"
                >{{ item.name }}</span
              >
            </li>
          </ul>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <el-scrollbar class="right-content">
          <el-row style="margin-bottom: 10px">
            <el-col :span="8">
              <el-input
                placeholder="体系条款"
                class="search_component remove-margin-b"
                v-model="searchDetail"
                clearable
                @keyup.13.native="getDetails"
              >
                <el-button type="primary" @click="getDetails" slot="append"
                  >搜索</el-button
                >
              </el-input>
            </el-col>
            <el-col :span="16">
              <div style="text-align: right">
                <span>选择版本：</span>
                <el-select
                  v-model="version"
                  @change="selectVersion"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in optionsList"
                    :key="item.id"
                    :label="item.versions"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <el-button type="primary" @click="reset">刷新</el-button>
              </div>
            </el-col>
          </el-row>
          <el-table
            :data="userList"
            border
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'left' }"
            class="main_tab system_table blue-table"
          >
            <el-table-column prop="content" width="400px" label="体系条款">
              <template slot-scope="scope">
                <p style="text-align: left">{{ scope.row.content }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="processCount" label="流程记录">
              <template slot-scope="scope">
                <p
                  @click="getFlow(scope.row, scope.$index)"
                  style="color: #4ba2ef; cursor: pointer"
                >
                  {{ scope.row.processCount }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="fileCount" label="文件记录">
              <template slot-scope="scope">
                <p
                  @click="getRecord(scope.row, scope.$index)"
                  style="color: #4ba2ef; cursor: pointer"
                >
                  {{ scope.row.fileCount }}
                </p>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </el-col>
    </el-row>
    <!-- 流程记录 -->
    <el-dialog
      title="流程记录详情"
      :visible.sync="dialogRecordListVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="formRecord" label-width="120px">
        <el-table :data="flowList" border class="main_tab blue-table">
          <el-table-column type="index" width="80px" label="序号">
          </el-table-column>
          <el-table-column prop="processname" width="150px" label="流程名称">
            <template slot-scope="scope">
              <p
                style="color: #4ba2ef; cursor: pointer"
                @click="getFlowItem(scope.row, scope.$index)"
              >
                {{ scope.row.processname }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="运行次数"> </el-table-column>
          <el-table-column prop="overcount" label="已完成"> </el-table-column>
          <el-table-column prop="approvecount" label="审批中">
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRecordListVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 文件记录 -->
    <el-dialog
      title="文件记录详情"
      :visible.sync="dialogFlowVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="formRecord" label-width="120px">
        <el-table :data="filesList" border class="main_tab blue-table">
          <el-table-column type="index" width="80px" label="序号">
          </el-table-column>
          <el-table-column prop="name" width="150px" label="文件名称">
            <template slot-scope="scope">
              <a :href="viewFile(scope.row.fileids)" target="_blank">{{
                scope.row.name
              }}</a>
              <!-- <p style="color: #4ba2ef;cursor: pointer;" @click="getRecordDetails(scope.row, scope.$index)">{{scope.row.name}}</p> -->
            </template>
          </el-table-column>
          <el-table-column prop="deptname" label="部门"> </el-table-column>
          <el-table-column prop="username" label="上传人"> </el-table-column>
          <el-table-column prop="createdate" label="上传时间">
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFlowVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 查看流程列表 -->
    <el-dialog
      title="流程详情"
      :visible.sync="dialogFlowItemVisible"
      width="85%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="formRecord" :model="editFormRecordObj" label-width="120px">
        <el-row style="margin-bottom: 10px">
          <el-col :span="16">
            <el-input
              placeholder="申请单号、主题、申请人"
              class="search_component remove-margin-b"
              v-model="filterDetails"
              clearable
              @keyup.13.native="searchFlowDetails"
            >
              <el-button type="primary" @click="searchFlowDetails" slot="append"
                >搜索</el-button
              >
            </el-input>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button @click="isShowSearch = !isShowSearch" type="primary"
              >高级查询
              <i
                :class="
                  isShowSearch ? 'el-icon-folder-remove' : 'el-icon-folder-add'
                "
              />
            </el-button>
          </el-col>
        </el-row>
        <el-row
          v-if="isShowSearch"
          style="
            padding: 15px;
            border: 1px solid #e5e5e5;
            border-radius: 1px;
            margin: 10px 0;
          "
        >
          <el-col :span="8">
            <el-form-item label="申请单号：">
              <el-input
                type="text"
                v-model="editFormRecordObj.reqno"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主题：">
              <el-input
                type="text"
                v-model="editFormRecordObj.subject"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人：">
              <el-input
                type="text"
                v-model="editFormRecordObj.drafter"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请日期：">
              <el-date-picker
                v-model="editFormRecordObj.reqdate"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：">
              <el-select
                v-model="editFormRecordObj.status"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align: right">
            <el-button type="primary" @click="powerSearch">查询</el-button>
            <el-button type="primary" @click="rest">重置</el-button>
          </el-col>
        </el-row>
        <div v-loadig="detailLoading">
          <el-table
            :data="flowDetailList"
            v-loading="pictLoading"
            border
            class="main_tab blue-table"
          >
            <el-table-column type="index" width="80px" label="序号">
            </el-table-column>
            <el-table-column prop="reqno" label="申请单号"> </el-table-column>
            <el-table-column prop="subject" width="150px" label="主题">
              <template slot-scope="scope">
                <p
                  style="color: #4ba2ef; cursor: pointer"
                  @click="openBpm(scope.row, scope.$index)"
                >
                  {{ scope.row.subject }}
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="drafter" label="申请人"> </el-table-column>
            <el-table-column label="申请时间">
              <template slot-scope="scope">
                <span>{{ scope.row.reqdate }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="assignees" label="审批人"> </el-table-column>
            <el-table-column prop="processnodename" label="当前节点">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
            <el-table-column prop="processnamecn" label="流程名">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.pageNum"
            :page-size="pages.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pages.total"
          ></el-pagination>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFlowItemVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 记录文件详情 -->
    <el-dialog
      title="记录文件"
      :visible.sync="dialogRecordListDetailsVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="formRecord"
        :model="editFormRecordDetailsObj"
        label-width="120px"
      >
        <el-row>
          <el-form-item label="文件名称:" prop="name">
            <el-input
              v-model="editFormRecordDetailsObj.name"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="相关体系:" prop="systemname">
            <el-select
              disabled
              v-model="editFormRecordDetailsObj.systemname"
              placeholder="请选择"
            >
              <el-option
                v-for="item in itList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="体系条款:" prop="systemsclause">
            <el-input
              v-model="editFormRecordDetailsObj.systemsclause"
              disabled
              placeholder="请单击选择"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="审核年度:" prop="years">
            <el-input
              v-model="editFormRecordDetailsObj.years"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布人:" prop="username">
            <el-input
              v-model="editFormRecordDetailsObj.username"
              disabled
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="发布时间:" prop="createdate">
            <el-date-picker
              disabled
              v-model="editFormRecordDetailsObj.createdate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <upload-files
            :isexct="false"
            :labelName="name2"
            :limitNum="limitNums2"
            :fileList="fileList2"
          ></upload-files>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRecordListDetailsVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getInterList,
  getrecordingdmList,
} from "@/bpa/api/systemManagementCenter/fileManagement";
import {
  getDetailBySystemid,
  getFileList,
  getProcessList,
} from "@/bpa/api/systemManagementCenter/operationRecord";
import axios from "axios";
import uploadFiles from "./uploadFiles";
import { viewFile } from "@/bpa/utils/common";
export default {
  components: {
    uploadFiles,
  },
  data() {
    return {
      dialogVisible: false,
      type: "add",
      treeData: [],
      userList: [],
      isSearch: false,
      filterText: "",
      keyWords: "",
      expandedList: [],
      orgid: "",
      title: "",
      dept: "",
      deptid: "",
      typeStatus: "",
      nameList: [],
      grandParentId: [],
      indexInfo: "",
      grandParentContent: [],
      selectedPersonList: [],
      editFormRecordObj: {
        reqdate: [],
      },
      dialogRecordListVisible: false,
      itList: [],
      approvePlan: "",
      approvePlanid: "",
      dialogFlowVisible: false,
      isShowSearch: false,
      dialogFlowItemVisible: false,
      options: [
        {
          value: "审批中",
          label: "审批中",
        },
        {
          value: "已完成",
          label: "已完成",
        },
        {
          value: "暂停",
          label: "暂停",
        },
        {
          value: "终止",
          label: "终止",
        },
      ],
      optionsList: [],
      flowDetailList: [],
      filters: [],
      pages: {
        pageSize: 8,
        pageNum: 1,
        total: 0,
      },
      dataname: "",
      detailLoading: false,
      flowList: [],
      version: "",
      filesList: [],
      dialogRecordListDetailsVisible: false,
      name2: "附件",
      limitNums2: 1,
      editFormRecordDetailsObj: {},
      fileList2: [],
      pictLoading: false,
      paramDetails: {},
      filterDetails: "",
      detailid: "",
      searchDetail: "",
      searchInter: "",
    };
  },
  mounted() {
    this.getInterList();
  },
  computed: {
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
  },
  methods: {
    // 预览文件
    viewFile(fileId) {
      return viewFile(fileId);
    },
    reset() {
      this.searchDetail = "";
      this.getDetails();
    },
    rest() {
      this.editFormRecordObj = {
        reqdate: [],
      };
      this.filterDetails = "";
      this.paramDetails = {
        logic: "or",
        filters: [
          {
            key: "processnamecn",
            opt: "LIKE",
            type: "S",
            value: this.dataname,
          },
          {
            key: "reqdate",
            opt: "BETWEEN",
            type: "D",
            value:
              this.editFormRecordObj.reqdate &&
              this.editFormRecordObj.reqdate.length > 0
                ? this.editFormRecordObj.reqdate[0] +
                  "~" +
                  this.editFormRecordObj.reqdate[1]
                : "",
          },
          {
            key: "status",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.status
              ? this.editFormRecordObj.status
              : "",
          },
          {
            key: "subject",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.subject
              ? this.editFormRecordObj.subject
              : "",
          },
          {
            key: "drafter",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.drafter
              ? this.editFormRecordObj.drafter
              : "",
          },
          {
            key: "reqno",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.reqno
              ? this.editFormRecordObj.reqno
              : "",
          },
        ],
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      this.pages.pageNum = 1;
      this.getFlowDetail();
    },
    powerSearch() {
      this.pages.pageNum = 1;
      this.filterDetails = "";
      this.paramDetails = {
        logic: "and",
        filters: [
          {
            key: "processnamecn",
            opt: "LIKE",
            type: "S",
            value: this.dataname,
          },
          {
            key: "reqdate",
            opt: "BETWEEN",
            type: "D",
            value:
              this.editFormRecordObj.reqdate &&
              this.editFormRecordObj.reqdate.length > 0
                ? this.editFormRecordObj.reqdate[0] +
                  "~" +
                  this.editFormRecordObj.reqdate[1]
                : "",
          },
          {
            key: "status",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.status
              ? this.editFormRecordObj.status
              : "",
          },
          {
            key: "subject",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.subject
              ? this.editFormRecordObj.subject
              : "",
          },
          {
            key: "drafter",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.drafter
              ? this.editFormRecordObj.drafter
              : "",
          },
          {
            key: "reqno",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.reqno
              ? this.editFormRecordObj.reqno
              : "",
          },
        ],
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      this.getFlowDetail();
    },
    searchFlowDetails() {
      this.editFormRecordObj = {
        reqdate: [],
      };
      this.paramDetails = {
        logic: "or",
        filters: [
          {
            key: "processnamecn",
            opt: "LIKE",
            type: "S",
            value: this.dataname,
          },
        ],
        queryFilter: [
          "reqno",
          "subject",
          "drafter",
          "assignees",
          "processnodename",
          "processnamecn",
        ],
        searchData: this.filterDetails,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      this.getFlowDetail();
    },
    getFlowDetail() {
      this.pictLoading = true;
      axios({
        method: "post",
        url:
          `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/rpa/process/getProcessManageList/query?username=` +
          JSON.parse(localStorage.getItem("portalCurrentUserInfo")).empuid,
        data: this.paramDetails,
        headers: {
          token: JSON.parse(localStorage.getItem("portalCurrentUserInfo"))
            .empuid,
        },
      })
        .then((res) => {
          this.flowDetailList = res.data.data.list;
          this.pages.total = res.data.data.total;
          this.pictLoading = false;
        })
        .catch(() => {
          this.pictLoading = false;
        });
    },
    searchSystem() {
      this.getInterList();
    },
    getInterList() {
      getInterList({
        pageSize: 9999,
        pageNum: 1,
        total: 100,
        filters: [
          {
            key: "name",
            opt: "LIKE",
            type: "S",
            value: this.searchInter ? this.searchInter : "",
          },
        ],
      }).then((res) => {
        this.itList = res.list;
      });
    },
    // 获取当前时间
    getdate() {
      var now = new Date();
      var y = now.getFullYear();
      var m = now.getMonth() + 1;
      var d = now.getDate();
      var h = now.getHours();
      var mm = now.getMinutes();
      var ff = now.getSeconds();
      return (
        y +
        "-" +
        (m < 10 ? "0" + m : m) +
        "-" +
        (d < 10 ? "0" + d : d) +
        " " +
        (h < 10 ? "0" + h : h) +
        ":" +
        (mm < 10 ? "0" + mm : mm) +
        ":" +
        (ff < 10 ? "0" + ff : ff)
      );
    },
    getFlow(item, index) {
      if (item.processCount > 0) {
        getProcessList(item.id).then((rt) => {
          this.flowList = rt;
          this.dialogRecordListVisible = true;
        });
      } else {
        this.$message.error("当前暂无流程记录");
      }
    },
    getRecord(item, index) {
      if (item.fileCount > 0) {
        this.dialogFlowVisible = true;
        getFileList(item.id).then((rt) => {
          this.filesList = rt;
        });
      } else {
        this.$message.error("当前暂无文件记录");
      }
    },
    getFlowItem(item, index) {
      this.pages.pageNum = 1;
      this.dataname = item.processname;
      this.editFormRecordObj = {
        reqdate: [],
      };
      this.flowDetailList = [];
      this.paramDetails = {
        logic: "or",
        filters: [
          {
            key: "processnamecn",
            opt: "LIKE",
            type: "S",
            value: this.dataname,
          },
          {
            key: "reqdate",
            opt: "BETWEEN",
            type: "D",
            value:
              this.editFormRecordObj.reqdate &&
              this.editFormRecordObj.reqdate.length > 0
                ? this.editFormRecordObj.reqdate[0] +
                  "~" +
                  this.editFormRecordObj.reqdate[1]
                : "",
          },
          {
            key: "status",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.status
              ? this.editFormRecordObj.status
              : "",
          },
          {
            key: "subject",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.subject
              ? this.editFormRecordObj.subject
              : "",
          },
          {
            key: "drafter",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.drafter
              ? this.editFormRecordObj.drafter
              : "",
          },
          {
            key: "reqno",
            opt: "LIKE",
            type: "S",
            value: this.editFormRecordObj.reqno
              ? this.editFormRecordObj.reqno
              : "",
          },
        ],
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
      };
      this.getFlowDetail();
      this.dialogFlowItemVisible = true;
    },
    insideName(index) {
      this.indexInfo = index;
      this.optionsList = this.itList[index].versionList;
      this.version = this.optionsList[0].id;
      this.searchDetail = "";
      this.getlist(this.itList[index].id);
    },
    getlist(id) {
      this.detailid = id;
      this.getDetails();
    },
    getDetails() {
      getDetailBySystemid({
        systemid: this.detailid,
        content: this.searchDetail,
      }).then((rt) => {
        this.userList = rt;
      });
    },
    handleSizeChange(val) {
      this.pages.pageNum = val;
      if (this.filterDetails) {
        this.paramDetails = {
          logic: "or",
          filters: [
            {
              key: "processnamecn",
              opt: "LIKE",
              type: "S",
              value: this.dataname,
            },
          ],
          queryFilter: [
            "reqno",
            "subject",
            "drafter",
            "assignees",
            "processnodename",
            "processnamecn",
          ],
          searchData: this.filterDetails,
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
        };
      } else {
        this.paramDetails = {
          logic: "or",
          filters: [
            {
              key: "processnamecn",
              opt: "LIKE",
              type: "S",
              value: this.dataname,
            },
            {
              key: "reqdate",
              opt: "BETWEEN",
              type: "D",
              value:
                this.editFormRecordObj.reqdate &&
                this.editFormRecordObj.reqdate.length > 0
                  ? this.editFormRecordObj.reqdate[0] +
                    "~" +
                    this.editFormRecordObj.reqdate[1]
                  : "",
            },
            {
              key: "status",
              opt: "LIKE",
              type: "S",
              value: this.editFormRecordObj.status
                ? this.editFormRecordObj.status
                : "",
            },
            {
              key: "subject",
              opt: "LIKE",
              type: "S",
              value: this.editFormRecordObj.subject
                ? this.editFormRecordObj.subject
                : "",
            },
            {
              key: "drafter",
              opt: "LIKE",
              type: "S",
              value: this.editFormRecordObj.drafter
                ? this.editFormRecordObj.drafter
                : "",
            },
            {
              key: "reqno",
              opt: "LIKE",
              type: "S",
              value: this.editFormRecordObj.reqno
                ? this.editFormRecordObj.reqno
                : "",
            },
          ],
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
        };
      }
      this.getFlowDetail();
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val;
      if (this.filterDetails) {
        this.paramDetails = {
          logic: "or",
          filters: [
            {
              key: "processnamecn",
              opt: "LIKE",
              type: "S",
              value: this.dataname,
            },
          ],
          queryFilter: [
            "reqno",
            "subject",
            "drafter",
            "assignees",
            "processnodename",
            "processnamecn",
          ],
          searchData: this.filterDetails,
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
        };
      } else {
        this.paramDetails = {
          logic: "or",
          filters: [
            {
              key: "processnamecn",
              opt: "LIKE",
              type: "S",
              value: this.dataname,
            },
            {
              key: "reqdate",
              opt: "BETWEEN",
              type: "D",
              value:
                this.editFormRecordObj.reqdate &&
                this.editFormRecordObj.reqdate.length > 0
                  ? this.editFormRecordObj.reqdate[0] +
                    "~" +
                    this.editFormRecordObj.reqdate[1]
                  : "",
            },
            {
              key: "status",
              opt: "LIKE",
              type: "S",
              value: this.editFormRecordObj.status
                ? this.editFormRecordObj.status
                : "",
            },
            {
              key: "subject",
              opt: "LIKE",
              type: "S",
              value: this.editFormRecordObj.subject
                ? this.editFormRecordObj.subject
                : "",
            },
            {
              key: "drafter",
              opt: "LIKE",
              type: "S",
              value: this.editFormRecordObj.drafter
                ? this.editFormRecordObj.drafter
                : "",
            },
            {
              key: "reqno",
              opt: "LIKE",
              type: "S",
              value: this.editFormRecordObj.reqno
                ? this.editFormRecordObj.reqno
                : "",
            },
          ],
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
        };
      }
      this.getFlowDetail();
    },
    openBpm(item) {
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute(
        "href",
        process.env.BPM_URL +
          "/#/processForm/view?name=" +
          item.processnamecn +
          "&instanceId=" +
          item.instid +
          "&username=" +
          this.userid
      );
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    selectVersion() {
      this.searchDetail = "";
      this.getlist(this.version);
    },
    getRecordDetails(item, index) {
      getrecordingdmList(item.id).then((res) => {
        if (!res) return false;
        this.editFormRecordDetailsObj = res;
        this.fileList2 = [
          {
            filename: res.list ? res.list.originalName : "",
            filesize: res.list ? res.list.fileSize + "B" : "",
            downloadUrl: this.host + "/attach/download/" + res.fileids,
            status: "已上传",
            fileId: res.fileids ? res.fileids : "",
          },
        ];
        // this.dialogRecordListDetailsVisible = true
        this.editFormRecordDetailsObj = Object.assign(
          {},
          this.editFormRecordDetailsObj
        );
        this.open(res.list);
      });
    },
    open(row) {
      this.openNTKO(row);
      // if (
      //   ['DOC', 'DOCX', 'XLS', 'XLSX', 'PPTX', 'PPT'].indexOf(
      //     row.FILETYPE.toUpperCase()
      //   ) !== -1
      // ) {
      //   this.openNTKO(row)
      // } else if ('PDF'.indexOf(row.FILETYPE.toUpperCase()) !== -1) {
      //   this.openPDF(row)
      // } else if (['JPG', 'PNG', 'GIF', 'JPEG'].indexOf(row.FILETYPE.toUpperCase()) !== -1) {
      //   this.openIMG(row)
      // } else {
      //   this.downloadFile(row)
      //   // this.$message.error('该文件不支持预览!!!!')
      // }
    },
    openNTKO(row) {
      var datatochildcmd = 4;
      var v1 = Math.random();
      let _this = this;
      var ntkoed = ntkoBrowser.ExtensionInstalled();
      let _href =
        window.location.origin + window.location.pathname + "/static/ntko";
      if (userAgent.indexOf("Edg") === -1) {
        if (ntkoed) {
          let _href =
            window.location.origin + window.location.pathname + "/static/ntko";
          ntkoBrowser.openWindow(
            _href +
              "/editindex.html?item=" +
              row.originalName +
              "&id=" +
              row.id +
              "&type=" +
              false +
              "&href=" +
              process.env.HOST_URL +
              process.env.BASE_URL,
            false,
            "    ",
            "D932426ADFC4A317DD39C592A4171B0DE642EA73"
          );

          window.ntkoCloseEvent = function () {
            // alert("跨浏览器插件应用程序窗口已关闭!");
          };
          window.OnData = function (id, name) {
            // _this.item.value = id
            // _this.item.showValue = name
          };
        } else {
          this.$router.push({
            name: "installNtko",
          });
        }
      } else {
        let _href =
          window.location.origin + window.location.pathname + "/static/ntko";
        ntkoBrowser.openWindow(
          _href +
            "/editindex.html?item=" +
            row.originalName +
            "&id=" +
            row.id +
            "&type=" +
            false +
            "&href=" +
            process.env.HOST_URL +
            process.env.BASE_URL,
          false,
          "    ",
          "D932426ADFC4A317DD39C592A4171B0DE642EA73"
        );

        window.ntkoCloseEvent = function () {
          // alert("跨浏览器插件应用程序窗口已关闭!");
        };
        window.OnData = function (id, name) {
          // _this.item.value = id
          // _this.item.showValue = name
        };
      }
    },
    openPDF(row) {
      if (!window.location.origin) {
        window.location.origin =
          window.location.protocol +
          "//" +
          window.location.hostname +
          (window.location.port ? ":" + window.location.port : "");
      }
      let url =
        window.location.origin +
        window.location.pathname +
        "/pdf/web/viewer.html?file=" +
        encodeURIComponent(
          `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${row.id}`
        );
      // window.open(routeData.href, "_blank");
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", url);
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
    openIMG(item) {
      let routeData = this.$router.resolve({
        name: "previewImg",
        query: {
          id: item.id,
        },
      });
      // window.open(routeData.href, "_blank");
      let a = document.createElement("a");
      // 给创建好的a标签赋值
      a.setAttribute("href", routeData.href);
      // 设置css 隐藏属性
      a.setAttribute("style", "display:none");
      // 设置 a标签为新窗口打开
      a.setAttribute("target", "_blank");
      // 将设置好的a标签，添加到 body 内
      document.body.appendChild(a);
      // 模拟点击
      a.click();
      // 移除a标签
      a.parentNode.removeChild(a);
    },
  },
};
</script>

<style lang="scss" scoped>
#groupManage {
  .tree_node {
    height: 380px;
  }
  .right-content {
    height: calc(100vh - 160px);
    .el-scrollbar__wrap {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
  .tree_node {
    height: calc(100vh - 190px) !important;
    .inside_ul {
      .inside_li {
        padding: 6px;
        cursor: pointer;
        &:hover {
          color: #4ba2ef;
          background-color: #f5f7fa;
        }
        span {
          display: inline-block;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
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
.w100 {
  width: 60% !important;
}
#pdfDom {
  padding: 10px;
}
</style>
