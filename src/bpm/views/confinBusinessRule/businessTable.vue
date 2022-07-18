<template>
  <el-card shadow="never">
    <el-tabs type="card" v-model="activeName" class="topCustom">
      <el-tab-pane :label="$t('ListingRules')" name="1">
        <div class="tool-common-wrap" style="margin-top: 20px">
          <div class="search-wrap" style="display: none">
            <quick-query ref="quick" @quickSearch="quickSearch" />
          </div>
          <div class="btn-wrap">
            <el-button
              type="primary"
              @click="showReplaceDialog"
              :disabled="selections.length === 0"
            >
              {{ $t("RulesReplace") }}
            </el-button>
            <el-upload
              class="upload-demo"
              :action="action"
              :data="{ username: username }"
              name="file"
              :headers="headData"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSuccess"
              style="display: inline-block; margin: 0 10px"
            >
              <el-button type="primary">
                {{ $t("import") }}
                <!--<i class="el-icon-download" />-->
              </el-button>
            </el-upload>

            <el-button type="primary" @click="excelFile">
              {{ $t("export") }}
              <!--<i class="el-icon-download" />-->
            </el-button>
            <el-button @click="handleRule" v-if="isReadonly" type="primary">
              {{ $t("preview") }}
              <!--<i class="iconfont icon-check-line" />-->
            </el-button>
            <el-button
              @click="handleAllDelete"
              v-if="isReadonly"
              type="primary"
              :disabled="selections.length === 0"
            >
              {{ $t("batchDelete") }}
              <!--<i class="el-icon-circle-close" />-->
            </el-button>

            <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
              {{ $t("advancedQuery") }}
              <i
                :class="
                  isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                "
              />
            </el-button>

            <el-button type="primary" @click="rest">
              {{ $t("refresh") }}
              <!---->
            </el-button>
          </div>
        </div>
        <el-form
          class="power-search"
          :model="searchForm"
          @keyup.enter.native="powerSearch"
          ref="searchForm"
          label-width="120px"
          size="mini"
          v-if="isPowerSearch"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('ruleName') + '：'">
                <el-input
                  clearable
                  type="text"
                  v-model="searchForm.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('ruleDescription') + '：'">
                <el-input
                  clearable
                  type="text"
                  v-model="searchForm.description"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('organization2') + '：'">
                <el-input
                  clearable
                  type="text"
                  v-model="searchForm.orgnames"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('creator') + '：'">
                <el-input
                  clearable
                  type="text"
                  v-model="searchForm.createby"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('changeTheTime') + '：'">
                <el-date-picker
                  v-model="searchForm.updatedate"
                  clearable
                  type="daterange"
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
              <el-button type="primary" @click="powerSearch">{{
                $t("query")
              }}</el-button>
              <el-button type="primary" @click="rest">{{
                $t("reset")
              }}</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div v-loading="loading">
          <div v-if="$store.state.app.tableStyle === 'default'">
            <div class="table-header margin-t10">
              <el-checkbox
                v-if="isReadonly"
                v-model="checkAll"
                class="all-check"
              />
              <sort-button
                style="flex-grow: 1"
                :items="headers"
                @sort="handleSort"
              />
            </div>
            <div v-if="content.list && content.list.length !== 0">
              <div
                class="tr"
                v-for="(item, index) in content.list"
                :key="index"
              >
                <div class="tr-title" style="padding: 8px 10px">
                  <el-checkbox
                    v-if="isReadonly"
                    v-model="item.checked"
                    style="margin-right: 10px"
                  />
                </div>
                <el-row class="tr-body" type="flex" align="middle">
                  <el-col class="td" :span="headers[0].span">{{
                    item.name
                  }}</el-col>
                  <el-col class="td" :span="headers[1].span">{{
                    item.description
                  }}</el-col>
                  <el-col
                    class="td textHide"
                    :title="item.orgnames"
                    :span="headers[2].span"
                    >{{ item.orgnames }}</el-col
                  >
                  <!-- <el-col class="td" :span="headers[3].span">{{item.bgnames}}</el-col> -->
                  <!-- <el-col class="td" :span="headers[4].span">{{item.isbyunconditionally}}</el-col> -->
                  <el-col class="td" :span="headers[3].span">{{
                    item.createby
                  }}</el-col>
                  <el-col class="td" :span="headers[4].span">{{
                    item.updatedate
                  }}</el-col>
                  <el-col style="text-align: center" :span="headers[5].span">
                    <el-tooltip :content="$t('delete')" placement="top">
                      <el-button
                        type="text"
                        icon="el-icon-delete"
                        style="font-size: 16px"
                        v-show="isReadonly"
                        @click="handleDeleteOne(item)"
                      ></el-button>
                    </el-tooltip>
                    <el-tooltip :content="$t('copy')" placement="top">
                      <el-button
                        type="text"
                        v-show="isReadonly"
                        icon="iconfont icon-copy"
                        @click="copyRule(item)"
                      >
                      </el-button>
                    </el-tooltip>
                    <el-tooltip :content="$t('reduction')" placement="top">
                      <el-button
                        type="text"
                        v-show="!isReadonly"
                        style="font-size: 16px"
                        icon="el-icon-refresh-left"
                        @click="recoveryBRRule(item)"
                      ></el-button>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-else class="text-c pad-10px tr-empty">
              {{ $t("noData") }}
            </div>
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
              <el-table-column
                :label="$t('ruleName')"
                show-overflow-tooltip
                sortable
                prop="name"
              >
              </el-table-column>
              <el-table-column
                :label="$t('ruleDescription')"
                show-overflow-tooltip
                sortable
                prop="description"
              >
              </el-table-column>
              <el-table-column
                :label="$t('organization2')"
                show-overflow-tooltip
                sortable
                prop="orgnames"
                min-width="120"
              >
              </el-table-column>
              <el-table-column
                :label="$t('creator')"
                show-overflow-tooltip
                sortable
                prop="createby"
              >
              </el-table-column>
              <el-table-column
                :label="$t('changeTheTime')"
                show-overflow-tooltip
                sortable
                prop="updatedate"
              >
              </el-table-column>
              <el-table-column :label="$t('operation')">
                <template slot-scope="scope">
                  <el-tooltip :content="$t('delete')" placement="top">
                    <el-button
                      type="text"
                      icon="el-icon-delete"
                      style="font-size: 16px"
                      v-show="isReadonly"
                      @click="handleDeleteOne(scope.row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip :content="$t('copy')" placement="top">
                    <el-button
                      type="text"
                      v-show="isReadonly"
                      icon="iconfont icon-copy"
                      @click="copyRule(scope.row)"
                    >
                    </el-button>
                  </el-tooltip>
                  <el-tooltip :content="$t('reduction')" placement="top">
                    <el-button
                      type="text"
                      v-show="!isReadonly"
                      style="font-size: 16px"
                      icon="el-icon-refresh-left"
                      @click="recoveryBRRule(scope.row)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-pagination
          style="margin-top: 15px"
          :page-size="page.pageSize"
          :current-page.sync="page.pageNum"
          background
          @current-change="
            searchType === 'power' ? getData() : quickQueryData()
          "
          :total="content.total"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane :label="$t('ReplaceRecord')" name="2">
        <replaceRecord :treeData="treeData" :states="states" />
      </el-tab-pane>
    </el-tabs>
    <replaceDialog
      v-model="dialogVisible"
      :ruleList="selections"
      @confirm="getState"
    />
  </el-card>
</template>

<script>
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import replaceRecord from "./replaceRecord";
import replaceDialog from "./replaceDialog";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import axios from "axios";
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapGetters } = createNamespacedHelpers("processDesign");
import {
  queryList,
  duplicateRule,
  deleteControl,
  queryRecyList,
  recoveryBRTree,
  batchDelete,
  businessRuleManageimport,
} from "../../api/confinBusinessRule";
export default {
  name: "businessTable",
  mixins: [SearchListMixin],
  components: {
    QuickQuery,
    replaceRecord,
    replaceDialog,
  },
  computed: {
    // ...mapGetters(["processData"]),
  },
  data() {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      activeName: "1",
      isReadonly: this.$route.query.type === "edit" || this.type === "edit",
      isPowerSearch: false,
      selectTypeList: [
        {
          name: this.$t("yes"),
          value: "Y",
        },
        {
          name: this.$t("no"),
          value: "N",
        },
      ],
      dialogVisible: false,
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "name",
          name: this.$t("ruleName"),
          span: 4,
        },
        {
          key: "description",
          name: this.$t("ruleDescription"),
          span: 4,
        },
        {
          key: "orgnames",
          name: this.$t("organization2"),
          span: 4,
        },
        // {
        //   key: 'bgnames',
        //   name: '所属业务组',
        //   span: 4
        // },
        // {
        //   key: 'isbyunconditionally',
        //   name: '是否无条件审批',
        //   span: 4
        // },
        {
          key: "createby",
          name: this.$t("creator"),
          span: 4,
        },
        {
          key: "updatedate",
          name: this.$t("changeTheTime"),
          span: 4,
        },
        {
          name: this.$t("operation"),
          span: 4,
        },
      ],
      selections: [],
      checkAll: "",
      states: "",
    };
  },
  props: {
    treeData: {
      type: Object,
    },
    isRef: {
      type: Boolean,
    },
    type: {
      type: String,
      default: "",
    },
    processData: {
      type: Object,
      default:()=>{}
    }
  },
  watch: {
    "content.list": {
      handler(val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i]);
            }
          }
        }
      },
      deep: true,
    },
    checkAll(val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach((item) => {
            item.checked = val;
          });
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach((item) => {
            item.checked = val;
          });
        }
      }
    },
    treeData(val) {
      if (val.type === "1") {
        this.getData();
      }
    },
  },
  computed: {
    host() {
      if(process.env.NODE_ENV === 'production') return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
      else return 'http://huawei5.jiucaiyun.cn/sbpmtestapi/'
    },
    processId() {
      return this.$route.query.processId ? this.$route.query.processId : this.treeData.id;
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    },
    action() {
      return `${this.host}/businessRuleManage/import-brs/${this.processId}?username=${this.userid}`;
    },
  },
  methods: {
    beforeAvatarUpload(file) {
      // const isLt2M = file.size / 1024 / 1024 < 100;
      // let postfix = file.name.replace(/.+\./, "");
      // const isPostfix = ['JSON'].indexOf(postfix.toUpperCase()) === -1
      // if (isPostfix) {
      //   this.$message.error(this.$t('hintText.pleaseUploadJsonFile'))
      // }
      // if (!isLt2M) {
      //   this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
      // }
      // if (!isPostfix && isLt2M) {
      //   this.pageLoading = true
      // }
      // return !isPostfix && isLt2M
    },
    uploadSuccess(file) {
      this.pageLoading = false;
      if (file.status === "200") {
        this.$message.success(this.$t("hintText.importedSuccessfully"));
        this.getData();
      } else {
        this.$message.error(file.message);
      }
      this.$emit("confirm", (this.isRef = !this.isRef));
    },
    importFile() {
      businessRuleManageimport(
        this.$route.query.processId
          ? this.$route.query.processId
          : this.treeData.id
      ).then((res) => {
        console.log(res);
      });
    },
    getState(data) {
      this.states = data;
    },
    showReplaceDialog() {
      this.dialogVisible = true;
    },
    handleRule() {
      this.filters = [];
      Object.keys(this.searchForm).forEach((key) => {
        const filter = {
          key,
          opt: "LIKE",
          type: "S",
          value: this.searchForm[key],
        };
        if (key === "updatedate") {
          filter.type = "D";
          filter.opt = "BETWEEN";
          filter.value = this.searchForm[key]
            ? this.searchForm[key].join("~")
            : "";
        }
        this.filters.push(filter);
      });
      let params = {
        processId: this.$route.query.processId
          ? this.$route.query.processId
          : this.treeData.id,
        treeId: this.treeData.id,
        logic: "and",
        filters: this.filters,
      };
      localStorage.setItem("ruleCheckingData", JSON.stringify(params));
      let routeData = this.$router.resolve({
        name: "ruleChecking",
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
    excelFile() {
      let processId = this.$route.query.processId
        ? this.$route.query.processId
        : this.treeData.id;
      let _this = this;
      axios({
        method: "post",
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/businessRuleManage/export-brs/${processId}`,
        data: {
          logic: "and",
          processId: processId,
          treeId: this.treeData.id,
          filters: this.filters,
          ...this.sort,
          ...this.page,
        },
        headers: {
          token: localStorage.getItem("token"),
        },
        responseType: "blob",
      })
        .then((res) => {
          let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, `业务规则` + ".xls");
          } else {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var url = window.URL.createObjectURL(blob);
            a.download = `业务规则`;
            a.href = url;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          }
        })
        .catch(() => {});
    },
    recoveryBRRule(item) {
      this.loading = true;
      recoveryBRTree(item.brtreeid)
        .then((rt) => {
          this.loading = false;
          if (rt.status === "200") {
            this.$message.success(this.$t("hintText.addedSuccess"));
            this.getData();
            this.$emit("confirm", (this.isRef = !this.isRef));
          } else {
            this.$message.success(rt.message);
          }
        })
        .catch((er) => {
          this.loading = false;
        });
    },
    copyRule(item) {
      this.loading = true;
      duplicateRule({
        brId: item.id,
      })
        .then((rt) => {
          this.loading = false;
          if (rt.status === "200") {
            this.$emit("confirm", (this.isRef = !this.isRef));
            this.$message.success(this.$t("copySuccessfully"));
            this.getData();
          }
        })
        .catch((er) => {
          this.loading = false;
        });
    },
    handleDeleteOne(data) {
      // this.$confirm(`您确定要删除${data.name}吗?`, this.$t('hintText.hint'), {
      this.$confirm(
        this.$t("hintText.areYouSureDelete"),
        this.$t("hintText.hint"),
        {
          type: "warning",
        }
      )
        .then(() => {
          let canshu = `${data.brtreeid}?userId=${this.$store.state.basuser.user.id}&type=2`;
          deleteControl(canshu).then((rt) => {
            if (rt.status === "200") {
              this.$emit("confirm", (this.isRef = !this.isRef));
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
              this.$message({
                message: this.$t("hintText.successfullyDelete"),
                type: "success",
              });
            }
          });
        })
        .catch((_) => {});
    },
    handleAllDelete() {
      this.$confirm(
        this.$t("hintText.areYouSureDeleteSelectedData"),
        this.$t("hintText.hint"),
        {
          type: "warning",
        }
      )
        .then(() => {
          batchDelete({
            ids: this.selections.map((item) => item.brtreeid),
          }).then((rt) => {
            if (rt.status === "200") {
              this.$emit("confirm", (this.isRef = !this.isRef));
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
              this.$message({
                message: this.$t("hintText.successfullyDelete"),
                type: "success",
              });
            } else {
              this.$message({
                message: this.$t("hintText.failToDelete"),
                type: "error",
              });
            }
          });
        })
        .catch((_) => {});
    },
    quickQueryData() {
      // this.loading = true
      // quickQueryCenterList({
      //   logic: 'or',
      //   filters: this.filters,
      //   ...this.sort,
      //   ...this.page
      // }).then(rt => {
      //   this.content = rt.data
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      let action = "";
      console.log('action')
      if (this.isReadonly) {
        action = queryList;
      } else {
        action = queryRecyList;
      }
      action({
        processId: this.$route.query.processId
          ? this.$route.query.processId
          : this.processData.id
          ? this.processData.id
          : this.treeData.id,
        version: this.$route.query.version || this.$route.query.version === ''
          ? this.$route.query.version
          : this.processData.version
          ? this.processData.version
          : this.treeData.version,
        treeId: this.treeData.id,
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then((rt) => {
          rt.data.list.forEach((item) => {
            item.checked = false;
          });
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.w100 {
  width: 100%;
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
      left: 10px;
    }
  }
}
.textHide {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.topCustom {
  /deep/ .el-tabs__header {
    margin: 0;
    border-bottom: 1px solid $active-color !important;
  }
  /deep/ .el-tabs__nav {
    border-radius: 6px 6px 0 0;
    background-color: white;
    border-bottom: 1px solid $active-color !important;
  }
  /deep/ .el-tabs__item {
    padding: 0 28px !important;
  }
  /deep/ .el-tabs__item.is-active {
    color: #fff;
    background: $active-color;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    border-bottom-color: $active-color !important;
  }
}
</style>
