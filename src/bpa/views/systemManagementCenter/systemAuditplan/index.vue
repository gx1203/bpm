<template>
  <div id="auditplan">
    <el-row :gutter="20" class="group_container">
      <el-col :span="4" class="tree_wrap">
        <el-row>
          <el-input
            placeholder="请输入内容"
            class="search_component remove-margin-b"
            v-model="filterText"
            clearable
            @keyup.13.native="abstractSearch"
          >
            <el-button type="primary" @click="abstractSearch" slot="append"
              >搜索</el-button
            >
          </el-input>
        </el-row>
        <el-scrollbar class="tree_node">
          <el-tree
            v-show="!isSearch"
            :props="props"
            :isLeaf="isLeaf"
            node-key="id"
            :load="getFilterTreeList"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            ref="asyncTree"
            lazy
            style="padding:10px 0"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <p
                class="grow"
                :title="node.label"
                @click="handlerNodeClick(data, node)"
              >
                {{ node.label }}
              </p>
            </div>
          </el-tree>
          <el-tree
            v-show="isSearch"
            :props="props"
            :isLeaf="isLeaf"
            node-key="id"
            :data="treeData"
            :default-expanded-keys="expandedList"
            :expand-on-click-node="false"
            lazy
            style="padding:10px 0"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <p
                class="grow"
                :title="node.label"
                @click="handlerNodeClick(data, node)"
              >
                {{ node.label }}
              </p>
            </div>
          </el-tree>
        </el-scrollbar>
      </el-col>
      <el-col :span="20">
        <!-- <el-scrollbar class="right-content"> -->
          <el-row style="margin-bottom: 10px">
            <el-col :span="24">
              <div style="text-align: right">
                <el-button type="primary" @click="reset">刷新</el-button>
              </div>
            </el-col>
          </el-row>
          <el-table :data="userList" border class="main_tab blue-table">
            <el-table-column label="序号" type="index"> </el-table-column>
            <el-table-column prop="name" label="计划主题"> </el-table-column>
            <el-table-column prop="trialdept" label="受审部门">
            </el-table-column>
            <!-- <el-table-column
              prop="trialsystem"
              label="受审体系">
            </el-table-column> -->
            <el-table-column prop="datas" label="受审体系"> </el-table-column>
            <el-table-column prop="trialyear" label="受审年度">
            </el-table-column>
            <el-table-column prop="trialdate" label="受审日期">
            </el-table-column>
            <el-table-column
              prop="trialchapter"
              width="150px"
              label="受审体系章节"
            >
            </el-table-column>
            <el-table-column prop="versions" label="计划版本">
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{
                  scope.row.status === "1"
                    ? "草拟"
                    : scope.row.status === "2"
                    ? "修改中"
                    : scope.row.status === "3"
                    ? "审批中"
                    : scope.row.status === "4"
                    ? "修订中"
                    : scope.row.status === "5"
                    ? "已下发"
                    : scope.row.status === "6"
                    ? "已废止"
                    : scope.row.status === "7"
                    ? "修订中"
                    : ""
                }}
              </template>
            </el-table-column>
            <el-table-column prop="email" label="操作">
              <template slot-scope="scope">
                <!-- <el-tooltip class="item"
                            effect="dark"
                            v-if="!scope.row.id"
                            content="添加"
                            placement="top"> -->
                <el-button
                  @click="add(scope.row)"
                  class="add"
                  v-if="!scope.row.id"
                  >添加</el-button
                >
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item"
                          effect="dark"
                          content="查看"
                          placement="top"> -->
                <el-button
                  v-if="
                    scope.row.status !== '2' &&
                    scope.row.status !== '1' &&
                    scope.row.status
                  "
                  @click="edit(scope.row, '0')"
                  type="text"
                  >查看</el-button
                >
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item"
                            effect="dark"
                            v-if="scope.row.status === '1' || scope.row.status === '2' || scope.row.status === '7' || scope.row.status === '4'"
                            content="编辑"
                            placement="top"> -->
                <el-button
                  @click="edit(scope.row, '2')"
                  class="no-border"
                  type="text"
                  v-if="
                    scope.row.status === '1' ||
                    scope.row.status === '2' ||
                    scope.row.status === '7' ||
                    scope.row.status === '4'
                  "
                  >编辑</el-button
                >
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item"
                            effect="dark"
                            v-if="scope.row.status === '5'"
                            content="修订"
                            placement="top"> -->
                <el-button
                  @click="edit(scope.row, '7')"
                  class="no-border"
                  type="text"
                  v-if="scope.row.status === '5'"
                  >修订</el-button
                >
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item"
                            effect="dark"
v-if="scope.row.status === '1' || scope.row.status === '2' || scope.row.status === '7' || scope.row.status === '4'"
                            content="下发"
                            placement="top"> -->
                <el-button
                  @click="systemAuditMangerisSued(scope.row, '1')"
                  class="no-border"
                  type="text"
                  v-if="
                    scope.row.status === '1' ||
                    scope.row.status === '2' ||
                    scope.row.status === '7' ||
                    scope.row.status === '4'
                  "
                  >下发</el-button
                >
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item"
                            effect="dark"
v-if="scope.row.status === '5'"
                            content="废止"
                            placement="top"> -->
                <el-button
                  @click="systemAuditMangerisSued(scope.row, '2')"
                  class="no-border"
                  type="text"
                  v-if="scope.row.status === '5'"
                  >废止</el-button
                >
                <!-- </el-tooltip> -->
                <!-- <el-tooltip class="item"
                            effect="dark"
v-if="scope.row.status === '1' || scope.row.status === '2' || scope.row.status === '4'"
                            content="删除"
                            placement="top"> -->
                <el-button
                  class="no-border"
                  type="text"
                  @click="deleteItem(scope.row)"
                  v-if="
                    scope.row.status === '1' ||
                    scope.row.status === '2' ||
                    scope.row.status === '4'
                  "
                  >删除</el-button
                >
                <!-- </el-tooltip> -->
              </template>
            </el-table-column>
          </el-table>
        <!-- </el-scrollbar> -->
      </el-col>
    </el-row>
    <!-- 添加弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="900px"
    >
      <el-form
        ref="form"
        :model="editFormObj"
        label-width="90px"
        :rules="rules"
      >
        <div id="pdfDom">
          <el-row>
            <div class="card">
              <div class="header">
                <span class="title">基本信息</span>
              </div>
            </div>
            <el-col :span="11" style="width: 46%" :offset="1">
              <el-form-item label="计划主题:" prop="name">
                <el-input
                  v-model="editFormObj.name"
                  :disabled="!isEdit"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="width: 45%" :offset="1">
              <el-form-item label="计划版本:" prop="versions">
                <el-input
                  v-model="editFormObj.versions"
                  :style="this.editFormObj.versionid ? 'width: 80%' : ''"
                  disabled
                ></el-input>
                <el-button
                  v-if="
                    this.editFormObj.versionid &&
                    editFormObj.versions !== 'V1.0'
                  "
                  type="text"
                  @click="detailsHistory"
                  >查看历史版本</el-button
                >
              </el-form-item>
            </el-col>
            <el-col :span="11" style="width: 46%" :offset="1">
              <el-form-item label="受审部门:" prop="trialdept">
                <el-input v-model="editFormObj.trialdept" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="width: 45%" :offset="1">
              <el-form-item label="受审年度:" prop="trialyear">
                <el-date-picker
                  :disabled="!isEdit"
                  v-model="editFormObj.trialyear"
                  type="year"
                  value-format="yyyy"
                  placeholder="选择年"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="width: 46%" :offset="1">
              <el-form-item label="受审日期:" prop="trialdate">
                <el-date-picker
                  v-model="editFormObj.trialdate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  :disabled="!isEdit"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11" style="width: 45%" :offset="1">
              <el-form-item label="受审体系:" prop="trialsystem">
                <el-select
                  v-model="editFormObj.trialsystemid"
                  v-if="isEdit"
                  placeholder="请选择"
                  @change="systemChange"
                  :disabled="!isEdit"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.datas"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-else
                  v-model="editFormObj.datas"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="22" :offset="1">
              <el-form-item label="废止原因:" v-if="editFormObj.reason">
                <el-input
                  v-model="editFormObj.reason"
                  disabled
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="card">
            <div class="header">
              <span class="title">审核计划</span>
            </div>
          </div>
          <div v-for="(item, index) in editFormObj.children" :key="index">
            <el-button
              size="mini"
              type="primary"
              style="margin-bottom: 10px; margin-top: 10px"
              @click="addList(index)"
            >
              <span
                :title="item.systemname"
                style="
                  display: inline-block;
                  margin-top: 3px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  width: 100%;
                "
                >{{ item.systemname }}</span
              ><br />
              <span
                :title="item.standard"
                style="
                  display: inline-block;
                  margin-top: 3px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
                >{{ item.standard }}</span
              >
            </el-button>
            <!-- <el-button type="text" @click="addName(index)">添加</el-button> -->
            <el-table border class="main_tab blue-table" :data="item.children">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column label="受审体系章节" prop="chapterdetail">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.chapterdetail"
                    :disabled="!isEdit"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="体系章节内容" prop="chapterdetail">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.chapterdata"
                    disabled
                    type="textarea"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="persion"
                :render-header="renderHeader"
                label="相关负责人"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.persion"
                    :disabled="!isEdit"
                    @focus="focusHandle(index, scope.$index)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remarks" label="备注">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remarks"
                    :disabled="!isEdit"
                  ></el-input>
                </template>
              </el-table-column>

              <el-table-column label="操作" v-if="isEdit">
                <template slot-scope="scope">
                  <!-- <el-tooltip class="item"
                            effect="dark"
                            content="删除"
                            placement="top"> -->
                  <el-button
                    @click="deleteFile(scope.$index, index)"
                    class="no-border"
                    type="text"
                    >删除</el-button
                  >
                  <!-- </el-tooltip> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="isEdit" @click="saveInstitution"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 历史版本弹框 -->
    <el-dialog
      title="历史版本"
      :visible.sync="dialogHistoryVisible"
      :close-on-click-modal="false"
      width="70%"
      :close-on-press-escape="false"
    >
      <el-form ref="form1" label-width="90px">
        <div>
          <el-table border class="main_tab blue-table" :data="nameList">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="计划主题" prop="name"> </el-table-column>
            <el-table-column label="受审部门" prop="trialdept">
            </el-table-column>
            <el-table-column label="受审体系" prop="trialsystem">
            </el-table-column>
            <el-table-column label="受审年度" prop="trialyear">
            </el-table-column>
            <el-table-column label="受审日期" prop="trialdate">
            </el-table-column>
            <el-table-column label="受审体系章节" prop="trialchapter">
            </el-table-column>
            <el-table-column label="计划版本" prop="versions">
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{
                  scope.row.status === "1"
                    ? "草拟"
                    : scope.row.status === "2"
                    ? "修改中"
                    : scope.row.status === "3"
                    ? "审批中"
                    : scope.row.status === "4"
                    ? "修订中"
                    : scope.row.status === "5"
                    ? "已下发"
                    : scope.row.status === "6"
                    ? "已废止"
                    : scope.row.status === "7"
                    ? "修订中"
                    : ""
                }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHistoryVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 体系章节树弹框 -->
    <el-dialog
      title="选择审核要求"
      class="tree_list"
      :visible.sync="dialogTreeVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row :gutter="20" class="group_container">
        <el-col :span="24" class="tree_wrap">
          <el-scrollbar class="tree_node">
            <el-tree
              :highlight-current="true"
              :data="menusTree"
              node-key="id"
              :props="defaultProps"
              show-checkbox
              :check-strictly="true"
              :default-checked-keys="grandParentId"
              :expand-on-click-node="false"
              @check="handleNodeCheck"
              ref="menuTree"
              style="padding:5px 0"
            ></el-tree>
          </el-scrollbar>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTreeVisible = false">取消</el-button>
        <el-button type="primary" @click="handlerConfirmDialog">确定</el-button>
      </span>
    </el-dialog>
    <!-- 废止弹框 -->
    <el-dialog
      :title="statusTitle"
      :visible.sync="dialogOutVisible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="outRef" label-width="120px">
        <el-row>
          <el-form-item label="废止原因:" required>
            <el-input v-model="reason" type="textarea"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogOutVisible = false">取 消</el-button>
        <el-button type="primary" @click="agreeOut">确 定</el-button>
      </span>
    </el-dialog>
    <select-person2
      :selected="selectedPersonList"
      v-model="isSelectPersonVisible"
      @confirm="handlerSelectPersonComfirm"
    ></select-person2>
  </div>
</template>
<script>
import { getTreeList, abstractSearch } from "@/bpa/api/settings/groupManage";
import { getFormateDate } from "@/bpa/utils/common";
import {
  getDetailByOrgid,
  getInterListForPlan,
  systemAuditMangerSave,
  systemAuditMangerById,
  delSystemManagement,
  systemAuditMangerList,
  systemAuditMangerisSued,
  getHistoryVersion,
  getSystemTree,
  getCountsystemChapterRelation,
} from "@/bpa/api/systemManagementCenter/systemAuditplan";
export default {
  data() {
    return {
      dialogVisible: false,
      type: "add",
      treeData: [],
      userList: [{}],
      isSearch: false,
      filterText: "",
      keyWords: "",
      expandedList: [],
      orgid: "",
      props: {
        label: "name",
        children: "zones",
        isLeaf: function (data, node) {
          if (data.isParent === "true") {
            return false;
          } else {
            return true;
          }
        },
      },
      editFormObj: {},
      isEdit: true,
      rules: {},
      title: "",
      options: [],
      dept: "",
      deptid: "",
      typeStatus: "",
      nameList: [],
      dialogHistoryVisible: false,
      dialogTreeVisible: false,
      menusTree: [],
      defaultProps: {
        children: "sectionChildrens",
        label: "content",
        disabled: function (data, node) {
          if (
            (data.section_class === "1" && data.isparent === "Y") ||
            (data.section_class === "0" && data.isparent === "Y")
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
      grandParentId: [],
      indexInfo: "",
      grandParentContent: [],
      selectedPersonList: [],
      isSelectPersonVisible: false,
      personIndex1: "",
      personIndex: "",
      indexList: [],
      dialogOutVisible: false,
      reason: "",
      statusTitle: "",
      outStatus: "",
      outId: "",
      outRules: {
        reason: [{ required: true, message: " ", trigger: "blur" }],
      },
      XDStatus: "",
    };
  },
  components: {},
  mounted() {
    this.getInterListForPlan();
  },
  methods: {
    renderHeader(cerateElement, { column }) {
      return cerateElement("div", [
        cerateElement("span", {
          domProps: {
            innerHTML: "*",
          },
          style: {
            color: "red",
            fontSize: "16px",
            marginLeft: "5px",
          },
        }),
        cerateElement("span", column.label),
      ]);
    },
    getFilterTreeList(node, resolve) {
      let id = node.data ? node.data.id : "0";
      getTreeList(id).then((res) => {
        if (!res) return false;
        if (id === "0") {
          this.expandedList = [res[0].id];
        }
        resolve(res);
      });
    },
    abstractSearch() {
      if (this.filterText) {
        this.isSearch = true;
        abstractSearch({ orgname: this.filterText }).then((res) => {
          this.treeData = res;
        });
      } else {
        this.isSearch = false;
      }
    },
    handlerNodeClick(data, node) {
      this.userList = [];
      this.dept = data.name;
      this.deptid = data.id;
      getDetailByOrgid(data.id).then((rt) => {
        if (rt) {
          if (rt.trialdate) {
            rt.trialdate = !rt.trialdate
              ? ""
              : getFormateDate(new Date(rt.trialdate), "yyyy-MM-dd");
          }
          this.userList.push(rt);
        } else {
          this.userList = [{}];
        }
      });
    },
    reset() {
      if (this.deptid) {
        this.userList = [];
        getDetailByOrgid(this.deptid).then((rt) => {
          if (rt) {
            if (rt.trialdate) {
              rt.trialdate = !rt.trialdate
                ? ""
                : getFormateDate(new Date(rt.trialdate), "yyyy-MM-dd");
            }
            this.userList.push(rt);
          } else {
            this.userList = [{}];
          }
        });
      }
    },
    isLeaf(data, node) {},
    getInterListForPlan() {
      getInterListForPlan({
        filters: [],
        logic: "and",
        pageNum: 1,
        pageSize: 9999,
      }).then((rt) => {
        this.options = rt.list;
      });
    },
    add(item) {
      if (this.dept && this.dept.length > 0) {
        this.title = "审核计划创建";
        this.editFormObj = {};
        this.XDStatus = "1";
        this.editFormObj.status = "1";
        this.editFormObj.versions = item.versions ? item.versions : "V1.0";
        this.editFormObj.trialdept = this.dept;
        this.editFormObj.trialdeptid = this.deptid;
        this.indexList = [];
        this.isEdit = true;
        this.dialogVisible = true;
      } else {
        this.$message.error("请先选择部门");
      }
    },
    edit(item, type) {
      this.XDStatus = type;
      systemAuditMangerById(item.id).then((rt) => {
        this.editFormObj = rt;
        if (type === "0") {
          this.isEdit = false;
        } else {
          this.isEdit = true;
        }
        this.title =
          type === "2"
            ? "审核计划修改"
            : type === "7"
            ? "审核计划修订"
            : "审核计划查看";
        // this.editFormObj.status = type
        this.indexList = [];
        this.dialogVisible = true;
      });
    },
    systemChange() {
      let _list = this.options.find(
        (item) => item.id === this.editFormObj.trialsystemid
      );
      if (_list.list) {
        this.editFormObj.children = _list.list.map((item) => {
          return {
            systemid: item.systemid,
            systemname: item.systemname,
            standard: item.standard,
            children: item.children ? item.children : [],
          };
        });
        this.editFormObj.trialsystem = _list.name;
        this.editFormObj.datas = _list.datas;
        for (let i = 0; i < this.editFormObj.children.length; i++) {
          if (!this.editFormObj.children[i].children) {
            this.editFormObj.children[i].children = [];
          }
        }
      }else{
        this.editFormObj.trialsystem = ''
        this.editFormObj.children = []
        this.editFormObj.datas = ''
      }
    },
    addName(index) {
      this.editFormObj.children[index].children.push({});
    },
    deleteFile(index, index1) {
      this.editFormObj.children[index1].children.splice(index, 1);
    },
    saveInstitution() {
      let _list = this.editFormObj.children;
      for (let i = 0; i < _list.length; i++) {
        let data = _list[i].children;
        for (let a = 0; a < data.length; a++) {
          if (!data[a].persion) {
            this.$message.error(
              "【" +
                _list[i].systemname +
                "】第" +
                Number(a + 1) +
                "行，请填写相关负责人！！"
            );
            return false;
          }
        }
      }
      if (this.XDStatus === "7") {
        systemAuditMangerList(this.editFormObj).then((rt) => {
          this.$message.success("修订成功");
          this.userList = [];
          getDetailByOrgid(this.deptid).then((rt) => {
            if (rt) {
              this.userList.push(rt);
            } else {
              this.userList = [{}];
            }
          });
          this.dialogVisible = false;
        });
      } else {
        systemAuditMangerSave(this.editFormObj).then((rt) => {
          this.$message.success("保存成功");
          this.userList = [];
          getDetailByOrgid(this.deptid).then((rt) => {
            if (rt) {
              this.userList.push(rt);
            } else {
              this.userList = [{}];
            }
          });
          this.dialogVisible = false;
        });
      }
    },
    deleteItem(item) {
      this.$confirm("是否确定删除？", "提示", {
        confirmBtnText: "确定",
        cancelBtnText: "取消",
        type: "warning",
      }).then(() => {
        delSystemManagement(item.id).then((res) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.userList = [];
          getDetailByOrgid(this.deptid).then((rt) => {
            if (rt) {
              this.userList.push(rt);
            } else {
              this.userList = [{}];
            }
          });
        });
      });
    },
    systemAuditMangerisSued(item, type) {
      this.outStatus = type;
      this.outId = item.id;
      if (type === "1") {
        this.$confirm("是否确定下发？", "下发提示", {
          confirmBtnText: "确定",
          cancelBtnText: "取消",
          type: "warning",
        }).then(() => {
          systemAuditMangerisSued({
            id: item.id,
            type: type,
          }).then((res) => {
            this.$message({
              type: "success",
              message: "成功发起计划下发申请!",
            });
            this.userList = [];
            getDetailByOrgid(this.deptid).then((rt) => {
              if (rt) {
                this.userList.push(rt);
              } else {
                this.userList = [{}];
              }
            });
          });
        });
      } else {
        this.statusTitle = "是否废止审核计划【" + item.name + "】？";
        this.dialogOutVisible = true;
      }
    },
    // 废止
    agreeOut() {
      // this.$refs['outRef'].validate((valid) => {
      //   if (valid) {
      if (!this.reason) {
        this.$message.error("请输入废止原因");
        return false;
      }
      systemAuditMangerisSued({
        id: this.outId,
        reason: this.reason,
        type: this.outStatus,
      }).then((res) => {
        this.$message({
          type: "success",
          message: "废止成功!",
        });
        this.userList = [];
        this.dialogOutVisible = false;
        getDetailByOrgid(this.deptid).then((rt) => {
          if (rt) {
            this.userList.push(rt);
          } else {
            this.userList = [{}];
          }
        });
      });
      //   }
      // })
    },
    detailsHistory() {
      if (this.editFormObj.versionid) {
        getHistoryVersion(this.editFormObj.versionid).then((rt) => {
          this.nameList = rt;
          this.dialogHistoryVisible = true;
        });
      } else {
        this.$message.error("当前暂无历史版本");
      }
    },
    addList(index) {
      if (this.isEdit) {
        this.indexInfo = index;
        this.menusTree = [];
        let _list = this.editFormObj.children[this.indexInfo].children;
        this.indexList = _list;
        getSystemTree(this.editFormObj.children[index].systemid).then((res) => {
          if (res) {
            this.dialogTreeVisible = true;
            this.menusTree = [res];
            if (_list && _list.length > 0) {
              this.grandParentId = [];
              this.grandParentContent = [];
              for (let i = 0; i < _list.length; i++) {
                this.grandParentId.push(_list[i].chapterid);
                this.grandParentContent.push({
                  id: _list[i].chapterid,
                  title: _list[i].chapterdetail,
                  content: _list[i].chapterdata,
                });
              }
            } else {
              this.grandParentId = [];
              this.grandParentContent = [];
            }
          } else {
            this.$message.error("还未上传文件，请上传后在选择");
          }
        });
      }
    },
    // 菜单权限按钮的id
    handleNodeCheck(
      checkedNodes,
      checkedKeys,
      halfCheckedNodes,
      halfCheckedKeys
    ) {
      this.grandParentId = checkedKeys.checkedKeys;
      this.grandParentContent = checkedKeys.checkedNodes;
    },
    handlerConfirmDialog() {
      let _list = JSON.parse(
        JSON.stringify(this.editFormObj.children[this.indexInfo].children)
      );
      let datalist = [];
      for (let i = 0; i < this.grandParentContent.length; i++) {
        datalist.push({
          chapterid: this.grandParentContent[i].id,
          chapterdetail: this.grandParentContent[i].content,
          chapterdata: "",
        });
      }
      getCountsystemChapterRelation(datalist).then((rt) => {
        let _listId = _list.map((i) => i.chapterid);
        let _listId1 = rt.map((i) => i.chapterid);
        if (rt && rt.length > 0) {
          if (_list && _list.length > 0) {
            for (let i = 0; i < _list.length; i++) {
              if (!_listId1.includes(_list[i].chapterid)) {
                this.editFormObj.children[this.indexInfo].children.splice(i, 1);
              }
            }
            for (let i = 0; i < rt.length; i++) {
              if (!_listId.includes(rt[i].chapterid)) {
                this.editFormObj.children[this.indexInfo].children.push({
                  chapterid: rt[i].chapterid,
                  chapterdetail: rt[i].chapterdetail,
                  chapterdata: rt[i].chapterdata,
                });
              }
            }
          } else {
            for (let i = 0; i < rt.length; i++) {
              this.editFormObj.children[this.indexInfo].children.push({
                chapterid: rt[i].chapterid,
                chapterdetail: rt[i].chapterdetail,
                chapterdata: rt[i].chapterdata,
              });
            }
          }
          this.dialogTreeVisible = false;
        }
      });
    },
    focusHandle(index, index1) {
      this.selectedPersonList = [];
      this.personIndex = index;
      this.personIndex1 = index1;
      if (
        this.editFormObj.children[this.personIndex].children[this.personIndex1]
          .persion
      ) {
        this.editFormObj.children[this.personIndex].children[
          this.personIndex1
        ].persion
          .split(",")
          .forEach((item, index) => {
            this.selectedPersonList.push({
              cnname: item,
              empuid: this.editFormObj.children[this.personIndex].children[
                this.personIndex1
              ].persionid
                ? this.editFormObj.children[this.personIndex].children[
                    this.personIndex1
                  ].persionid.split(",")[index]
                : "",
            });
          });
      }
      this.isSelectPersonVisible = true;
    },
    handlerSelectPersonComfirm(list) {
      let self = this;
      self.$set(
        self.editFormObj.children[self.personIndex].children[self.personIndex1],
        "persionid",
        list
          .map((item) => {
            return item.empuid;
          })
          .join(",")
      );
      self.$set(
        self.editFormObj.children[self.personIndex].children[self.personIndex1],
        "persion",
        list
          .map((item) => {
            return item.cnname;
          })
          .join(",")
      );
      self.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
.custom-tree-node {
  height: 100%;
  position: relative;
  .opertionBtn {
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    min-width: 50px;
    display: flex;
    display: none;
    justify-content: space-between;
    align-items: center;
    i {
      display: inline-block;
      height: 14px;
      padding: 0;
      margin: 0;
      &:hover {
        background: none;
        font-weight: bold;
      }
    }
  }
  &:hover {
    .opertionBtn {
      display: flex;
    }
  }
}
.custom-tree-node {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .grow {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 70px;
  }
  .add {
    color: $tc5;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  .del {
    color: $tc4;
    padding: 5px;
    display: none;
    &:hover {
      background: $dc1;
    }
  }
  &:hover {
    .add {
      display: inherit;
    }
    .del {
      display: inherit;
    }
  }
}
#auditplan {
  .tree_node {
    // height: 380px;
  }
  .right-content {
    // height: calc(60vh - 160px);
    .el-scrollbar__wrap {
      height: 100%;
    }
    .el-scrollbar__view {
      height: 100%;
    }
  }
  .tree_node {
    // height: calc(60vh - 160px);
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
