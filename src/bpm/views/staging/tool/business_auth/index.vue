<template>
  <el-card shadow="never" id="stagingToolBusinessAuth">
    <div class="item-left">
      <el-input
        clearable
        class="search_input"
        :placeholder="$t('placeholderText.enterKeywordsFiltering')"
        v-model="filterText"
      >
      </el-input>
      <el-tree
        :props="props"
        node-key="id"
        :data="leftDataTree"
        :default-expanded-keys="expandedList"
        :expand-on-click-node="false"
        ref="tree"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
      >
      </el-tree>
    </div>
    <div class="item-right" v-show="processInfo.type === '1'">
      <div class="tool-common-wrap">
        <div class="btn-wrap">
          <el-button type="primary" @click="handleAdd">
            {{ $t("add") }}
          </el-button>
          <el-button
            type="primary"
            :disabled="selections.length === 0"
            @click="handleAllDelete"
          >
            {{ $t("batchDelete") }}
          </el-button>
          <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
            {{ $t("advancedQuery") }}
            <i
              :class="
                isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
              "
            />
          </el-button>
          <el-button type="primary" @click="searchGetData">
            {{ $t("refresh") }}
          </el-button>
        </div>
      </div>
      <el-form
        class="power-search"
        :model="searchForm"
        @keyup.enter.native="searchGetData"
        ref="searchForm"
        label-width="110px"
        size="mini"
        v-if="isPowerSearch"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('authNode') + '：'">
              <el-select
                clearable
                v-model="searchForm.nodename"
                class="w100"
                :placeholder="$t('placeholderText.pleaseSelect')"
                @change="authNodeHandle"
              >
                <el-option
                  v-for="item in authNodeData"
                  :key="item.id"
                  :label="item.activityname"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('agent') + '：'">
              <el-input
                clearable
                type="text"
                v-model="searchForm.agentusercn"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('judgmentLogic') + '：'">
              <el-select
                clearable
                v-model="searchForm.judgemethod"
                class="w100"
                :placeholder="$t('placeholderText.pleaseSelect')"
              >
                <el-option
                  v-for="item in judgmentLogicList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">  
            <el-form-item :label="$t('judgmentConditions') + '：'">
              <el-input clearable type="text" v-model="searchForm.judgeparam"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item :label="$t('state') + '：'">
              <el-select
                clearable
                v-model="searchForm.state"
                class="w100"
                :placeholder="$t('placeholderText.pleaseSelect')"
              >
                <el-option
                  v-for="item in stateData"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('startTime') + '：'">
              <el-date-picker
                v-model="searchForm.begintime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :range-separator="$t('placeholderText.to')"
                :start-placeholder="$t('placeholderText.startDate')"
                :end-placeholder="$t('placeholderText.endDate')"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('endTime') + '：'">
              <el-date-picker
                v-model="searchForm.endtime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :range-separator="$t('placeholderText.to')"
                :start-placeholder="$t('placeholderText.startDate')"
                :end-placeholder="$t('placeholderText.endDate')"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('takeTheTime') + '：'">
              <el-date-picker
                v-model="searchForm.recovertime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :range-separator="$t('placeholderText.to')"
                :start-placeholder="$t('placeholderText.startDate')"
                :end-placeholder="$t('placeholderText.endDate')"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-r">
            <!-- <el-button type="primary" @click="getData">{{ $t('query') }}</el-button> -->
            <el-button type="primary" @click="searchGetData">{{
              $t("query")
            }}</el-button>
            <el-button
              type="primary"
              @click="
                searchForm = {};
                searchGetData();
              "
              >{{ $t("reset") }}</el-button
            >
          </el-col>
        </el-row>
      </el-form>
      <div v-loading="loading">
        <div v-if="$store.state.app.tableStyle === 'default'">
          <div class="table-header margin-t10">
            <el-checkbox v-model="checkAll" class="all-check" />
            <sort-button
              style="flex-grow: 1"
              :items="headers"
              @sort="handleSort"
            />
          </div>
          <div v-if="content.list && content.list.length !== 0">
            <div class="tr" v-for="(item, index) in content.list" :key="index">
              <div class="tr-title">
                <el-checkbox
                  v-model="item.checked"
                  style="margin-right: 10px"
                />
              </div>
              <el-row class="tr-body" type="flex" align="middle">
                <el-col class="td" :span="headers[0].span">{{
                  item.nodename
                }}</el-col>
                <el-col class="td" :span="headers[1].span">{{
                  item.agentusercn
                }}</el-col>
                <el-col class="td" :span="headers[2].span">{{
                  item.judgemethod
                }}</el-col>
                <el-col class="td" :span="headers[3].span">{{
                  item.judgeparam
                }}</el-col>
                <el-col class="td" :span="headers[4].span">{{
                  item.begintime
                }}</el-col>
                <el-col class="td" :span="headers[5].span">{{
                  item.endtime
                }}</el-col>
                <el-col class="td" :span="headers[6].span">{{
                  item.recovertime
                }}</el-col>
                <el-col class="td" :span="headers[7].span">{{
                  item.state
                }}</el-col>
                <el-col class="td" :span="headers[8].span">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="handleEdit(item)"
                  >
                  </el-button>
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDeleteOne(item)"
                  ></el-button>
                  <el-button type="text" @click="handleCancel(item)">
                    <i class="icon-weibiaoti545"></i>
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-else class="text-c pad-10px tr-empty">{{ $t("noData") }}</div>
        </div>
        <div v-else>
          <el-table
            :data="content.list"
            class="margin-t10"
            stripe
            :header-cell-style="{ background: '#E1EAFD !important' }"
            highlight-current-row
            @sort-change="elHandleSort"
            current-row-key="id"
          >
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" />
              </template>
              <template slot="header">
                <el-checkbox v-model="checkAll" />
              </template>
            </el-table-column>
            <!-- <el-table-column type="index" :label="$t('number')"  min-width="40"/> -->
            <el-table-column
              :label="$t('authNode')"
              show-overflow-tooltip
              prop="nodename"
              min-width="100"
            ></el-table-column>
            <el-table-column
              :label="$t('agent')"
              show-overflow-tooltip
              prop="agentusercn"
            ></el-table-column>
            <el-table-column
              :label="$t('judgmentLogic')"
              show-overflow-tooltip
              prop="judgemethod"
              min-width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.judgemethod | judgmentLogicFilter }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('judgmentConditions')"
              show-overflow-tooltip
              prop="judgeparam"
              min-width="150"
            ></el-table-column>
            <el-table-column
              :label="$t('startTime')"
              show-overflow-tooltip
              prop="begintime"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.begintime | formatDateTimess }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('endTime')"
              show-overflow-tooltip
              prop="endtime"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.endtime | formatDateTimess }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('takeTheTime')"
              show-overflow-tooltip
              prop="recovertime"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.recovertime | formatDateTimess }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('state')"
              show-overflow-tooltip
              prop="state"
              min-width="50"
            >
              <template slot-scope="scope">
                {{ scope.row.state | stateDataFilter }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')" width="90">
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row)">
                  {{ $t("edit") }}
                </el-button>
                <el-button type="text" @click="handleDeleteOne(scope.row)">{{
                  $t("delete")
                }}</el-button>
                <el-button
                  type="text"
                  v-show="scope.row.state === '0'"
                  @click="handleCancel(scope.row)"
                >
                  <i
                    class="iconfont icon-weibiaoti545"
                    style="font-size: 10px"
                  />
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          style="margin-top: 15px"
          :page-size="page.pageSize"
          :current-page.sync="page.pageNum"
          background
          @current-change="
            searchType === 'power' ? getData() : quickQueryData()
          "
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <add-business-auth-dialog
      v-model="dialogVisible"
      :item="editItem"
      :processInfo="processInfo"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import addBusinessAuthDialog from "./addBusinessAuthDialog";
import {
  getAllTree,
  queryList,
  updateState,
  getAuthNodeData,
  deleteAuth,
  batchDelete
} from "@/bpm/api/staging/tool/business_auth.js";
import main from "@/main";
import moment from "moment-mini";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";

export default {
  name: "stagingToolBusinessAuth",
  mixins: [SearchListMixin],
  components: {
    addBusinessAuthDialog
  },
  data() {
    return {
      total: 0,
      filterText: "",
      expandedList: [],
      selectNode: {},
      props: {
        label: "modelname",
        children: "children"
      },
      judgmentLogicList: [
        {
          name: this.$t("meetAllConditions"),
          value: "0"
        },
        {
          name: this.$t("meetOneConditions"),
          value: "1"
        }
      ],
      stateData: [
        {
          name: this.$t("takeEffect"),
          value: "0"
        },
        {
          name: this.$t("loseEfficacy"),
          value: "1"
        }
      ],
      authNodeData: [],
      selections: [],
      editItem: {},
      processInfo: {},
      dialogVisible: false,
      leftDataTree: [],
      searchForm: {},
      checkAll: "",
      headers: [
        // {
        //   key: 'number',
        //   name: this.$t('number'),
        //   span: 3
        // },
        {
          key: "nodename",
          name: this.$t("authNode"),
          span: 3
        },
        {
          key: "agentusercn",
          name: this.$t("agent"),
          span: 2
        },
        {
          key: "judgemethod",
          name: this.$t("judgmentLogic"),
          span: 3
        },
        {
          key: "judgeparam",
          name: this.$t("judgmentConditions"),
          span: 3
        },
        {
          key: "begintime",
          name: this.$t("startTime"),
          span: 3
        },
        {
          key: "endtime",
          name: this.$t("endTime"),
          span: 3
        },
        {
          key: "recovertime",
          name: this.$t("takeTheTime"),
          span: 3
        },
        {
          key: "state",
          name: this.$t("state"),
          span: 2
        },
        {
          name: this.$t("operation"),
          span: 2
        }
      ],
      linkTitle: "",
      page: {
        pagenum: 1,
        pagesize: 10
      },
      filters: []
    };
  },
  filters: {
    judgmentLogicFilter: val => {
      switch (val) {
        case "0":
          return `${main.$t("meetAllConditions")}`;
          break;
        case "1":
          return `${main.$t("meetOneConditions")}`;
          break;
        // default:
        //   return val
      }
    },
    stateDataFilter: val => {
      switch (val) {
        case "0":
          return `${main.$t("takeEffect")}`;
          break;
        case "1":
          return `${main.$t("loseEfficacy")}`;
          break;
        // default:
        //   return val
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    "content.list": {
      handler(val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i].id);
            }
          }
        }
      },
      deep: true
    },
    checkAll(val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        }
      }
    },
    processInfo(val) {
      if (val.type === "1") {
        this.getTableData(this.processInfo.id);
      }
    }
  },
  mounted() {
    this.getAllTreeList();
  },
  methods: {
    authNodeHandle(val) {
      this.searchForm.processnodeid = val;
    },
    getAuthNodeData(id) {
      getAuthNodeData(id).then(res => {
        if (res.status === "200") {
          this.authNodeData = res.data;
        }
      });
    },
    // 根据登录人及规则获取业务树
    getAllTreeList() {
      getAllTree().then(res => {
        if (res.status === "200") {
          this.leftDataTree = res.data;
        }
      });
    },
    handleNodeClick(data) {
      this.processInfo = data;
      this.$refs.tree.getCheckedNodes();
      this.getTableData(data.id);
      this.getAuthNodeData(data.id);
    },
    getTableData(id) {
      this.checkAll = false;
      queryList({
        attr: {
          processId: id
        }
      }).then(res => {
        if (res.status === "200") {
          res.data.list.forEach(item => {
            item.checked = false;
          });
          this.loading = false;
          this.content = res.data;
          this.total = res.data.total;
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.modelname.indexOf(value) !== -1;
    },
    handleAdd() {
      this.linkTitle = "添加业务授权";
      this.editItem = {
        processname: this.processInfo.modelname,
        judgemethod: "0",
        begintime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        endtime: "",
        state: "0",
        authJudgeDetailData: []
      };
      this.dialogVisible = true;
    },
    handleEdit(item) {
      this.linkTitle = "编辑业务授权";
      this.editItem = JSON.parse(JSON.stringify(item));
      (this.editItem.processname = this.processInfo.modelname),
        (this.editItem = { ...this.editItem });
      this.dialogVisible = true;
    },
    handleDeleteOne(item) {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          type: "warning"
        }
      )
        .then(() => {
          deleteAuth(item.id).then(rt => {
            if (rt.status === "200") {
              this.getData();
              this.$message({
                message: this.$t("hintText.successfullyDelete"),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t("hintText.failToDelete"),
                type: "error"
              });
            }
          });
        })
        .catch(_ => {});
    },
    handleAllDelete() {
      this.$confirm(
        this.$t("hintText.areYouSureDeleteSelectedData"),
        this.$t("hintText.hint"),
        {
          type: "warning"
        }
      )
        .then(() => {
          batchDelete(this.selections).then(rt => {
            if (rt.status === "200") {
              this.getData();
              this.$message({
                message: this.$t("hintText.successfullyDelete"),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t("hintText.failToDelete"),
                type: "error"
              });
            }
          });
        })
        .catch(_ => {});
    },
    handleCancel(item) {
      this.$confirm(
        this.$t("hintText.areYouSureCancelAuthorization"),
        this.$t("hintText.hint"),
        {
          type: "warning"
        }
      )
        .then(() => {
          updateState({
            id: item.id,
            recovertime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            state: "1"
          }).then(res => {
            if (res.status === "200") {
              this.getTableData(this.processInfo.id);
              this.$message.success(
                this.$t("hintText.successfulAuthorizationCancellation")
              );
            } else {
              this.$message.error(res.message);
            }
          });
        })
        .catch(_ => {});
    },
    searchGetData() {
      this.filters = [];
      this.page.pageNum = 1;
      this.filters = [
        {
          key: "processnodeid",
          opt: "EQ",
          type: "S",
          value: this.searchForm.processnodeid
        },
        {
          key: "agentusercn",
          opt: "LIKE",
          type: "S",
          value: this.searchForm.agentusercn
        },
        {
          key: "judgemethod",
          opt: "LIKE",
          type: "S",
          value: this.searchForm.judgemethod
        },
        {
          key: "begintime",
          opt: "BETWEEN",
          type: "D",
          value: this.searchForm.begintime
            ? this.searchForm.begintime.join("~")
            : ""
        },
        {
          key: "endtime",
          opt: "BETWEEN",
          type: "D",
          value: this.searchForm.endtime
            ? this.searchForm.endtime.join("~")
            : ""
        },
        {
          key: "recovertime",
          opt: "BETWEEN",
          type: "D",
          value: this.searchForm.recovertime
            ? this.searchForm.recovertime.join("~")
            : ""
        },
        {
          key: "state",
          opt: "LIKE",
          type: "S",
          value: this.searchForm.state
        }
      ];
      this.getData();
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      queryList({
        logic: "and",
        filters: this.filters,
        attr: { processId: this.processInfo.id },
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.loading = false;
          this.content = rt.data;
          this.total = rt.data.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    quickQueryData() {},
    saveSuccess(data) {
      if (data) {
        this.getTableData(this.processInfo.id);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.item-right {
  float: right;
  width: 78%;
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 20px;
    }
    .td {
      text-align: left;
    }
  }
}
</style>

<style lang="scss">
#stagingToolBusinessAuth {
  .search_input .el-input__inner {
    border: none;
    border-bottom: 1px solid rgb(229, 229, 229);
  }
}
</style>
