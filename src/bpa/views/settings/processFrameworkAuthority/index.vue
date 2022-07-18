<template>
  <div id="processFrameworkAuthority" class="pageWrap">
    <div class="pageContent">
      <!--左侧组织树-->
      <div class="leftTree">
        <!-- <el-scrollbar class="left_tree_wrapper"> -->
        <bas-search
          :placeholder="pleaseEnterEnterpriseProcessArchitecture"
          v-model="keyWords"
          @fnSearch="filterTree"
        />
        <div class="left_tree_wrapper margin-t10">
          <el-tree
            ref="tree"
            class="filter-tree elTree"
            v-show="!controlTree"
            :props="props"
            :load="loadNode"
            node-key="id"
            lazy
            :default-expanded-keys="grandParentId"
            :expand-on-click-node="false"
            @node-click="handlerNodeClick"
          >
            <div :class="data.isVisible === '0' ? 'disabled' : ''" class="custom-tree-node w100" slot-scope="{ node, data }">
              <p :class="{ green: data.release === 'Y' }" :title="node.label">
                {{
                  node.label +
                  "(" +
                  data.childrenReleaseCount +
                  "/" +
                  data.childrenCount +
                  ")"
                }}
              </p>
            </div>
          </el-tree>
          <el-tree
            ref="treeFilter"
            class="filter-tree elTree"
            v-show="controlTree"
            :props="props"
            :default-expand-all="true"
            :data="treelist"
            node-key="id"
            :expand-on-click-node="false"
            @node-click="handlerNodeClick"
          >
            <div :class="data.isVisible === '0' ? 'disabled' : ''" class="custom-tree-node w100" slot-scope="{ node, data }">
              <p :class="{ green: data.release === 'Y' }" :title="node.label">
                {{
                  node.label +
                  "(" +
                  data.childrenReleaseCount +
                  "/" +
                  data.childrenCount +
                  ")"
                }}
              </p>
            </div>
          </el-tree>
          <!-- </el-scrollbar> -->
        </div>
      </div>
      <!-- 右侧列表部分-->
      <div class="listContent">
        <process-framework-authority
          v-if="!!selectMenuId"
          ref="processFrameworkAuthority"
          :selectMenuName="selectMenuName"
          :selectMenuId="selectMenuId"
        ></process-framework-authority>
        <!-- <el-row class="margin-b10">
          <el-col :span="6">
            <el-input
              :placeholder="placeholderTitle"
              class="search_component"
              v-model="searchOrg"
              clearable
              @keyup.13.native="getMenuOrgList()"
            >
              <el-button
                type="primary"
                slot="append"
                @click="
                  pagesOrg.pageNum = 1;
                  getMenuOrgList();
                "
                >{{ $t("search") }}</el-button
              >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="margin-b10 text-r">
          <el-button
            type="primary"
            @click="referMenuSelect('organization')"
            >{{ $t("edit") }}</el-button
          >
        </el-row>
        <el-table :data="tableOrgData" stripe class="main_tab">
          <el-table-column :label="number" type="index"></el-table-column>
          <el-table-column
            prop="relatedname"
            :label="$t('name')"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="relatedname"
            :label="$t('type')"
            width="140"
          ></el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkOrgAdd"
                :disabled="!selectMenuId || tableOrgData.length == 0"
                @change="handleCheckAllChange('add')"
                >{{ $t("add") }}</el-checkbox
              >
            </template>
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.adder"
                @change="CheckOneChange(scope.row, 'add')"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkOrgDel"
                :disabled="!selectMenuId || tableOrgData.length == 0"
                @change="handleCheckAllChange('delete')"
                >{{ $t("delete") }}</el-checkbox
              >
            </template>
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.deleter"
                @change="CheckOneChange(scope.row, 'delete')"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkOrgUpd"
                :disabled="!selectMenuId || tableOrgData.length == 0"
                @change="handleCheckAllChange('update')"
                >{{ $t("edit") }}</el-checkbox
              >
            </template>
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.updater"
                @change="CheckOneChange(scope.row, 'update')"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkOrgLook"
                disabled
                @change="handleCheckAllChange('look')"
                >{{ $t("view") }}</el-checkbox
              >
            </template>
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.lookover"
                disabled
                @change="CheckOneChange(scope.row, 'look')"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center">
            <template slot="header" slot-scope="scope">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkOrgListAuth"
                :disabled="!selectMenuId || tableOrgData.length == 0"
                @change="ChangeListAuthAll('modelListAuth')"
                >{{ $t("processVisibilityPermissions") }}</el-checkbox
              >
            </template>
            <template slot-scope="scope">
              <el-switch
                v-if="scope.row.modelListAuth"
                v-model="scope.row.modelListAuth.lookover"
                @change="ChangeListAuth(scope.row, 'modelListAuth')"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="operation">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="delete2"
                placement="top"
              >
                <el-button
                  type="text"
                  @click="deleteMenu(scope.row.id, 'organization')"
                  >{{ delete2 }}</el-button
                >
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeOrg"
          :current-page.sync="pagesOrg.pageNum"
          :page-size="pagesOrg.pageSize"
          background
          layout="prev, pager, next, jumper, total"
          :total="pagesOrg.total"
        ></el-pagination> -->
      </div>
    </div>
    <!--    角色管理弹出框-->
    <iframe-role
      v-model="selectPersonVisible"
      :roleId="selectMenuId"
      :selected="selectedData"
      @confirm="confirmAdd"
    ></iframe-role>
    <select-iframe
      v-model="groupVisible"
      :selected="[]"
      :selectTree="['0', '1', '2', '4']"
      @confirm="confirmAdd"
      :frameworkId="selectMenuId"
    ></select-iframe>
  </div>
</template>
<script>
import {
  getNodePermissions,
  deleteOrganization,
  addPerson,
  checkListAuth,
  batchSavePerson,
  batchSaveAuth,
} from "@/bpa/api/settings/processFrameworkAuthority";
import {
  getProcessIframeTree,
  searchProcessIframeTree1,
} from "@/bpa/api/componentsApi";

import SelectIframe from "@/bpa/components/SelectIframe.vue";
import iframeRole from "@/bpa/components/iframeRole.vue";
import ProcessFrameworkAuthority from './components/ProcessFrameworkAuthority.vue'
export default {
  components: {
    SelectIframe,
    iframeRole,
    ProcessFrameworkAuthority
  },
  data() {
    return {
      // 角色管理部分
      value: "",
      checked: "",
      // 组织部分
      relatedtype1: 0,
      // 角色部分
      relatedtype2: 8,
      controlTree: false,
      treelist: [],
      keyWords: "",
      grandParentId: [],
      props: {
        label: "name",
        isLeaf: function (data, node) {
          if (data.isparent === true) {
            return false;
          } else {
            return true;
          }
        },
      },
      checkOrgAdd: false,
      checkOrgDel: false,
      checkOrgUpd: false,
      checkOrgLook: false,
      checkOrgListAuth: false,
      checkRolListAuth: false,
      checkRolAdd: false,
      checkRolDel: false,
      checkRolUpd: false,
      checkRolLook: false,
      isIndeterminate: true,
      // ===============================
      selectPersonVisible: false,
      groupVisible: false,
      // 节点选中的id
      selectMenuId: "",
      searchOrg: "",
      searchRole: "",
      tableOrgData: [],
      tableRoleData: [],
      selectedData: [],
      // 右侧tab默认的选中
      activeName: "organization",
      selectMenuName: "",
      searchMenu: "",
      menutitle: "添加",
      // 添加菜单的模态框的样式
      dialogVisible: false,
      menulist: {
        fatherName: "",
        name: "",
        enname: "",
        link: "",
        sort: "",
        pid: "",
        id: "",
      },
      pagesOrg: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      pagesRole: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      menusTree: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 弹出框的必填规则
      rules: {
        name: [{ required: true, message: " ", trigger: "blur" }],
        enname: [{ required: true, message: " ", trigger: "blur" }],
        link: [{ required: true, message: " ", trigger: "blur" }],
        sort: [{ required: true, message: " ", trigger: "blur" }],
      },
      // 菜单树的参数
      menuTreeParams: {
        attr: { menuname: "" },
        orderby: "",
        pageNum: 1,
        pageSize: 100000,
        sort: "desc",
        logic: "or",
        filters: [],
      },
      addBtnDialogVisible: false,
      menuInfo: {},
      pleaseEnterEnterpriseProcessArchitecture: this.$t(
        "placeholderText.pleaseEnterEnterpriseProcessArchitecture"
      ),
      organization: this.$t("organization"),
      placeholderTitle: this.$t(
        "placeholderText.enterSettingsProcessFrameworkAuthority"
      ),
      placeholderTitle2: this.$t("placeholderText.pleaseEnterTheContent"),
      number: this.$t("number"),
      personOrorganization: this.$t("personOrorganization"),
      open: this.$t("open"),
      close: this.$t("close"),
      operation: this.$t("operation"),
      role: this.$t("role"),
      characterName: this.$t("characterName"),
      pleaseSelectAMenuToProceed: this.$t(
        "hintText.pleaseSelectAMenuToProceed"
      ),
      areYouSureDelete: this.$t("hintText.areYouSureDelete"),
      successfullyDelete: this.$t("hintText.successfullyDelete"),
      hint: this.$t("hintText.hint"),
      Undeleted: this.$t("hintText.Undeleted"),
      permissionBatchModifySuccessfully: this.$t(
        "hintText.permissionBatchModifySuccessfully"
      ),
      permissionHasBeenModifiedSuccessfully: this.$t(
        "hintText.permissionHasBeenModifiedSuccessfully"
      ),
      confirm: this.$t("confirm"),
      cancel: this.$t("cancel"),
      delete2: this.$t("delete"),
    };
  },
  methods: {
    // tab栏的切换事件
    handleClick(tab, event) {
      let self = this;
      if (this.selectMenuName == "") {
        return false;
      } else {
        self.getMenuOrgList();
      }
    },
    // 添加的按钮点击事件
    referMenuSelect(type) {
      if (!this.selectMenuId) {
        this.$message({
          message: this.pleaseSelectAMenuToProceed,
          type: "warning",
        });
        return false;
      }
      if (type === "organization") {
        this.groupVisible = true;
      } else {
        this.selectPersonVisible = true;
      }
    },
    booleanNum(value) {
      return value ? 1 : 0;
    },
    fixData(temp) {
      const {
        modelid,
        lookover,
        adder,
        updater,
        deleter,
        relatedid,
        relatedtype,
      } = temp;
      return {
        modelid,
        relatedid,
        relatedtype,
        lookover: this.booleanNum(lookover),
        adder: this.booleanNum(adder),
        updater: this.booleanNum(updater),
        deleter: this.booleanNum(deleter),
      };
    },
    fixAuthData(temp) {
      const { id, listid, lookover, relatedid, relatedtype } = temp;
      return {
        id,
        listid,
        relatedid,
        relatedtype,
        lookover: this.booleanNum(lookover),
      };
    },
    confirmAdd(data) {
      let self = this;
      let dataNew = data.map((item) => {
        let result = {};
        if (self.activeName === "organization") {
          result.relatedtype = 0;
        } else {
          result.relatedtype = 8;
        }
        result.modelid = self.selectMenuId;
        result.relatedid = item.id;
        result.lookover = 1;
        result.adder = 1;
        result.updater = 1;
        result.deleter = 1;
        return result;
      });
      let newList = dataNew.map((item) => {
        const temp = self.tableOrgData.find(
          (el) => el.relatedid == item.relatedid
        );
        return temp ? this.fixData(temp) : item;
      });
      batchSavePerson({
        modelTreeAuthoritys: newList,
        modelid: self.selectMenuId
      }).then((res1) => {
        // 深拷贝
        let authList = JSON.parse(JSON.stringify(data));
        let newAuthList = authList.map((item2) => {
          let result = {};
          if (self.activeName === "organization") {
            result.relatedtype = 0;
          } else {
            result.relatedtype = 8;
          }
          result.id = "";
          result.listid = self.selectMenuId;
          result.relatedid = item2.id;
          result.lookover = 1;
          return result;
        });
        let tableAuthList = self.tableOrgData
          .map((item) => item.modelListAuth)
          .map((item) => {
            return { ...item, listid: self.selectMenuId };
          });
        let modelListAuths = newAuthList.map((item) => {
          const temp = tableAuthList.find(
            (el) => el.relatedid == item.relatedid
          );
          return temp ? this.fixAuthData(temp) : item;
        });
        batchSaveAuth({
          modelListAuths: modelListAuths,
          listid: self.selectMenuId
        }).then((res2) => {
          self.$message({
            message: "添加成功！",
            type: "success",
          });
          self.getMenuOrgList();
        });
        // }
      });
    },
    // 删除事件
    deleteMenu(id, type) {
      let self = this;
      let deleteId = id;
      if (!self.selectMenuId) {
        self.$message({
          message: this.pleaseSelectAMenuToProceed,
          type: "waining",
        });
        return false;
      }
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: "warning",
      })
        .then(() => {
          deleteOrganization(deleteId).then((res) => {
            self.$message({
              message: this.successfullyDelete,
              type: "success",
            });
            self.getMenuOrgList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.Undeleted,
          });
        });
    },
    /*
      组织部分的分页
     */
    getMenuOrgList() {
      let self = this;
      let obj = {
        filters: [
          { key: "modelid", opt: "EQ", type: "S", value: self.selectMenuId },
          { key: "relatedname", opt: "LIKE", type: "S", value: this.searchOrg },
        ],
        ...this.pagesOrg
      };
      getNodePermissions(obj).then((res) => {
        // console.log("组织", res);
        if (!res) return false;
        self.tableOrgData = res.list;
        self.pagesOrg.total = res.total;
      });
    },
    handleCurrentChangeOrg(data) {
      let self = this;
      self.pagesOrg.pageNum = data;
      self.getMenuOrgList();
    },
    /*
      角色部分
     */
    handleCurrentChangeRole(data) {
      let self = this;
      self.pagesRole.pageNum = data;
      self.getMenuRoleList();
    },
    getMenuRoleList() {
      let self = this;
      let obj = {
        filters: [
          { key: "modelid", opt: "EQ", type: "S", value: self.selectMenuId },
          { key: "relatedtype", opt: "EQ", type: "S", value: 8 },
          {
            key: "relatedname",
            opt: "LIKE",
            type: "S",
            value: self.searchRole,
          },
        ],
        ...this.pagesRole,
      };
      getNodePermissions(obj).then((res) => {
        // console.log("角色", res);
        if (!res) return false;
        self.tableRoleData = res.list;
        self.selectedData = JSON.parse(JSON.stringify(res.list));
        self.pagesRole.total = res.total;
      });
    },
    // 加载子节点
    loadNode(node, resolve) {
      let id = node.data ? node.data.id : "0";
      getProcessIframeTree(id).then((res) => {
        res = res || []
        if (id === "0") {
          this.grandParentId = []
          this.grandParentId.push(res[0].id);
        } else if (res.length == 1) {
          this.grandParentId.push(res[0].id);
        }
        resolve(res);
        if (node.level === 1 && res.length > 0) {
          let cur = res.find(item => item.isVisible === '1')
          this.$nextTick(() => {
            if (cur) {
              this.$refs['tree'].setCurrentKey(cur.id)
              this.selectMenuId = cur.id
            }
          })
        }
      });
    },
    renderContent(h, { node, data, store }) {
      let dom1 = (
        <span class="custom-tree-node">
          <span class="process_01"></span>
          <span class="text">{node.label}</span>
        </span>
      );
      let dom2 = (
        <span class="custom-tree-node">
          <span class="process_02"></span>
          <span class="text">{node.label}</span>
        </span>
      );
      if (data.pid) {
        return dom2;
      }
      return dom1;
    },
    // 子节点的点击触发触发事件
    handlerNodeClick(data, node, type) {
      if (data.isVisible === '0') {
        let ref = this.controlTree ? 'treeFilter' : 'tree'
        this.$refs[ref].setCurrentKey(this.selectMenuId)
        return
      }
      this.selectMenuName = data.name;
      this.selectMenuId = data.id;
    },
    filterTree() {
      if (!this.keyWords) {
        this.controlTree = false;
        return false;
      }
      searchProcessIframeTree1({
        name: this.keyWords,
        moduletype: 'rulemanagement',
        id: this.grandParentId.length > 0 ? this.grandParentId[0] : ''
      }).then((res) => {
        this.controlTree = true;
        this.treelist = res;
      });
    },
    // 选中所有的点击事件
    handleCheckAllChange(type) {
      if (this.activeName === "organization") {
        if (type == "add") {
          this.isIndeterminate = false;
          this.tableOrgData.forEach((item) => {
            item.adder = !this.checkOrgAdd;
            if (item.adder == true) {
              item.adder = 1;
            } else {
              item.adder = 0;
            }
            item.deleter = item.deleter == true ? 1 : 0;
            item.updater = item.updater == true ? 1 : 0;
            item.lookover = item.lookover == true ? 1 : 0;
          });
        } else if (type == "delete") {
          this.isIndeterminate = false;
          this.tableOrgData.forEach((item) => {
            item.deleter = !this.checkOrgDel;
            if (item.deleter == true) {
              item.deleter = 1;
            } else {
              item.deleter = 0;
            }
            item.adder = item.adder == true ? 1 : 0;
            item.updater = item.updater == true ? 1 : 0;
            item.lookover = item.lookover == true ? 1 : 0;
          });
        } else if (type == "update") {
          this.isIndeterminate = false;
          this.tableOrgData.forEach((item) => {
            item.updater = !this.checkOrgUpd;
            if (item.updater == true) {
              item.updater = 1;
            } else {
              item.updater = 0;
            }
            item.adder = item.adder == true ? 1 : 0;
            item.deleter = item.deleter == true ? 1 : 0;
            item.lookover = item.lookover == true ? 1 : 0;
          });
        } else if (type == "look") {
          this.isIndeterminate = false;
          this.tableOrgData.forEach((item) => {
            item.lookover = !this.checkOrgLook;
            if (item.lookover == true) {
              item.lookover = 1;
            } else {
              item.lookover = 0;
            }
            item.adder = item.adder == true ? 1 : 0;
            item.deleter = item.deleter == true ? 1 : 0;
            item.updater = item.updater == true ? 1 : 0;
          });
        }
      } else if (this.activeName === "role") {
        if (type == "add") {
          this.isIndeterminate = false;
          this.tableRoleData.forEach((item) => {
            item.adder = !this.checkRolAdd;
            if (item.adder == true) {
              item.adder = 1;
            } else {
              item.adder = 0;
            }
            item.lookover = item.lookover == true ? 1 : 0;
            item.deleter = item.deleter == true ? 1 : 0;
            item.updater = item.updater == true ? 1 : 0;
          });
        } else if (type == "delete") {
          this.isIndeterminate = false;
          this.tableRoleData.forEach((item) => {
            item.deleter = !this.checkRolDel;
            if (item.deleter == true) {
              item.deleter = 1;
            } else {
              item.deleter = 0;
            }
            item.lookover = item.lookover == true ? 1 : 0;
            item.adder = item.adder == true ? 1 : 0;
            item.updater = item.updater == true ? 1 : 0;
          });
        } else if (type == "update") {
          this.isIndeterminate = false;
          this.tableRoleData.forEach((item) => {
            item.updater = !this.checkRolUpd;
            if (item.updater == true) {
              item.updater = 1;
            } else {
              item.updater = 0;
            }
            item.lookover = item.lookover == true ? 1 : 0;
            item.adder = item.adder == true ? 1 : 0;
            item.deleter = item.deleter == true ? 1 : 0;
          });
        } else if (type == "look") {
          this.isIndeterminate = false;
          this.tableRoleData.forEach((item) => {
            item.lookover = !this.checkRolLook;
            if (item.lookover == true) {
              item.lookover = 1;
            } else {
              item.lookover = 0;
            }
            item.updater = item.updater == true ? 1 : 0;
            item.adder = item.adder == true ? 1 : 0;
            item.deleter = item.deleter == true ? 1 : 0;
          });
        }
      }
      let obj = [];
      if (this.activeName === "organization") {
        obj = this.tableOrgData;
      } else {
        obj = this.tableRoleData;
      }
      addPerson(obj).then((res) => {
        this.$message({
          message: this.permissionBatchModifySuccessfully,
          type: "success",
        });
        this.getMenuOrgList();
      });
    },
    CheckOneChange(item, type) {
      let self = this;
      let obj = {
        id: item.id,
        modelid: item.modelid,
        relatedid: item.relatedid,
        relatedtype: item.relatedtype,
        lookover: item.lookover == true ? 1 : 0,
        adder: item.adder == true ? 1 : 0,
        updater: item.updater == true ? 1 : 0,
        deleter: item.deleter == true ? 1 : 0,
      };
      addPerson([obj]).then((res) => {
        self.$message({
          message: this.permissionHasBeenModifiedSuccessfully,
          type: "success",
        });
        self.getMenuOrgList();
      });
    },
    // 修改流程可见权限
    ChangeListAuth(data) {
      let self = this;
      let item = data.modelListAuth;
      let obj = {
        id: item.id,
        listid: item.modelid,
        relatedid: item.relatedid,
        relatedtype: item.relatedtype,
        lookover: item.lookover == true ? 1 : 0,
      };
      checkListAuth([obj]).then((res) => {
        self.$message({
          message: this.permissionHasBeenModifiedSuccessfully,
          type: "success",
        });
        self.getMenuOrgList();
      });
    },
    // 批量修改流程可见权限
    ChangeListAuthAll() {
      let self = this;
      let obj1 = [];
      let obj2 = [];
      if (self.activeName === "organization") {
        self.isIndeterminate = false;
        self.tableOrgData.forEach((item) => {
          item.modelListAuth.lookover = !self.checkOrgListAuth;
          if (item.modelListAuth.lookover == true) {
            item.modelListAuth.lookover = 1;
          } else {
            item.modelListAuth.lookover = 0;
          }
          obj1.push(item.modelListAuth);
        });
      } else {
        self.tableRoleData.forEach((item) => {
          item.modelListAuth.lookover = !self.checkRolListAuth;
          if (item.modelListAuth.lookover == true) {
            item.modelListAuth.lookover = 1;
          } else {
            item.modelListAuth.lookover = 0;
          }
          obj2.push(item.modelListAuth);
        });
      }
      let obj = [];
      if (self.activeName == "organization") {
        obj = obj1;
      } else {
        obj = obj2;
      }
      checkListAuth(obj).then((res) => {
        self.$message({
          message: this.permissionBatchModifySuccessfully,
          type: "success",
        });
        self.getMenuOrgList();
      });
    },
  },
};
</script>

<style scoped lang="scss">
#processFrameworkAuthority {
  background-color: white;
  .green {
    color: green;
  }
  /deep/
    .el-tree-node.is-current
    > .el-tree-node__content
    .custom-tree-node
    .green {
    color: #2d42af;
  }
  /deep/ .el-tree-node.is-current > .el-tree-node__content .custom-tree-node {
    font-weight: 600;
    color: #2d42af;
  }
  /deep/ .custom-tree-node {
    color: #666;
  }
  .left_tree_wrapper {
    /deep/ .el-tree-node__content {
      width: 100%;
    }
    /deep/ .el-tree-node > .el-tree-node__children {
      overflow: visible;
    }
  }
  .custom-tree-node {
    // width: calc(100% - 24px);
    position: relative;
    height: 100%;
    line-height: 26px;
    .grow {
      // width: 100%;
      // padding-right: 80px;
      // box-sizing: border-box;
      p {
        // width: 100%;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }
    }
    .opertionBtn {
      opacity: 0;
      position: absolute;
      right: 10px;
      top: 0;
      transition: 0.3s;
    }
  }
  .custom-tree-node.disabled, .custom-tree-node.disabled * {
    color: #bbb !important;
    font-weight: normal !important;
    cursor: not-allowed !important;
    background-color: transparent !important;
  }
  .el-tree-node__content:hover {
    .opertionBtn {
      opacity: 1;
    }
  }
  .selectMenu {
    position: absolute;
    top: 0;
    right: 10px;
    line-height: 40px;
    font-size: 14px;
    letter-spacing: 2px;
  }
}
</style>
