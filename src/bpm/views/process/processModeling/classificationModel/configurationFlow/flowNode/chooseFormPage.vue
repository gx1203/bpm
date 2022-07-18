<template>
  <el-dialog
    :title="$t('basFormPageConfig.selectFormPage')"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="80%"
    top="10vh"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    append-to-body
  >
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <el-input
          v-model="searchKey"
          @keyup.enter.native="quickSearch"
          :title="placeholder"
          :placeholder="placeholder"
          clearable
        >
          <span slot="append" @click="quickSearch"
            ><i class="iconfont icon-sousuo2"
          /></span>
        </el-input>
      </div>
      <router-link target="_blank" :to="{ path:'/process/moduledev/formPageConfig', query:{ isShowAddDialog: 'true' }}">
        <el-button type="primary">{{ $t('newAdd') }}</el-button>
      </router-link>
    </div>
    <el-table
      v-if="isMore"
      :data="content.list"
      stripe
      v-loading="loading"
      :header-cell-style="{ background: '#E1EAFD !important' }"
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
      @sort-change="elHandleSort"
      ref="multipleTable"
      :row-key="getRowKeys"
    >
      <el-table-column type="selection" width="55" fixed align="center" />
      <el-table-column
        :label="$t('basFormPageConfig.number')"
        type="index"
        width="50"
      />
      <el-table-column
        :label="$t('basFormPageConfig.formName')"
        show-overflow-tooltip
        sortable
        prop="name"
      >
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.formExplain')"
        show-overflow-tooltip
        sortable
        prop="description"
      >
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.creationTime')"
        show-overflow-tooltip
        sortable
        prop="createon"
        min-width="140"
      >
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.creator')"
        show-overflow-tooltip
        sortable
        prop="createUserName"
      >
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.createModes')"
        show-overflow-tooltip
        sortable
        prop="modeType"
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.modeType === "1"
                ? $t("basFormPageConfig.config")
                : scope.row.modeType === "2"
                ? $t("basFormPageConfig.databaseTableGeneration")
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.state')"
        show-overflow-tooltip
        sortable
        prop="status"
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.status === "1"
                ? $t("basFormPageConfig.valid")
                : scope.row.status === "0"
                ? $t("basFormPageConfig.invalid")
                : ""
            }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-else
      :data="content.list"
      stripe
      v-loading="loading"
      :header-cell-style="{ background: '#E1EAFD !important' }"
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
      @current-change="handleCurrentChange"
      @sort-change="elHandleSort"
      ref="multipleTable"
      :row-key="getRowKeys"
    >
      <el-table-column
        :label="$t('basFormPageConfig.number')"
        type="index"
        width="50"
      />
      <el-table-column
        :label="$t('basFormPageConfig.formName')"
        show-overflow-tooltip
        sortable
        prop="name"
      >
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.formExplain')"
        show-overflow-tooltip
        sortable
        prop="description"
      >
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.creationTime')"
        show-overflow-tooltip
        sortable
        prop="createon"
        min-width="140"
      >
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.creator')"
        show-overflow-tooltip
        sortable
        prop="createUserName"
      >
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.createModes')"
        show-overflow-tooltip
        sortable
        prop="modeType"
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.modeType === "1"
                ? $t("basFormPageConfig.config")
                : scope.row.modeType === "2"
                ? $t("basFormPageConfig.databaseTableGeneration")
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.state')"
        show-overflow-tooltip
        sortable
        prop="status"
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.status === "1"
                ? $t("basFormPageConfig.valid")
                : scope.row.status === "0"
                ? $t("basFormPageConfig.invalid")
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('basFormPageConfig.select')"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-radio v-model="selectIndex" :label="scope.$index">{{
            ""
          }}</el-radio>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 15px"
      :page-size="searchEntity.pageSize"
      :current-page.sync="searchEntity.pageNum"
      background
      @current-change="getData"
      :total="content.total"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{
        $t("basFormPageConfig.cancel")
      }}</el-button>
      <el-button type="primary" @click="submit('item')">{{
        $t("basFormPageConfig.confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      searchKey: "",
      placeholder:
        this.$t("basFormPageConfig.formName") +
        "、" +
        this.$t("basFormPageConfig.formExplain"),
      content: {
        list: [],
        total: 0
      },
      searchEntity: {
        attr: {},
        filters: [],
        fullFilters: [
          {
            filters: [],
            logic: "and"
          },
          {
            filters: [
              { key: "status", opt: "EQ", type: "S", value: "1" }
            ],
            logic: "and"
          }
        ],
        logic: "and",
        orderby: "createon",
        pageNum: 1,
        pageSize: 10,
        sort: "desc"
      },
      quickSearchFilters: [
        {
          key: "name",
          opt: "LIKE",
          type: "S",
          value: "",
          logic: "or"
        },
        {
          key: "description",
          opt: "LIKE",
          type: "S",
          value: "",
          logic: "or"
        }
      ],
      dialogVisible: this.value,
      loading: false,
      selectIndex: -1,
      multipleSelection: [],
      datamaintainConfigQuery: "/form/model/query"
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default() {
        return {};
      }
    },
    tableItem: {
      type: Object,
      default() {
        return {};
      }
    },
    nodeId: {
      type: String,
      default() {
        return "";
      }
    },
    type: {
      type: String,
      default() {
        return "";
      }
    },
    isMore: {
      type: Boolean,
      default: false
    },
    mainTableName: {
      type: String,
      default() {
        return "";
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.selectIndex = -1;
        this.getData();
      } else {
        this.$refs.multipleTable.clearSelection();
      }
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    getRowKeys(row) {
      return row.id;
    },
    // 单选
    handleCurrentChange(val) {
      if (val) {
        this.selectIndex = this.content.list.findIndex(
          item => item.id === val.id
        );
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    quickSearch() {
      for (let i = 0; i < this.quickSearchFilters.length; i++) {
        this.quickSearchFilters[i].value = this.searchKey;
      }
      this.searchEntity.fullFilters[0].filters = this.quickSearchFilters;
      this.searchEntity.pageNum = 1;
      this.searchEntity.pageSize = 10;
      this.getData();
    },
    elHandleSort(data) {
      if (data.order) {
        this.searchEntity.orderby = data.prop;
        this.searchEntity.sort = data.order === "descending" ? "desc" : "asc";
      } else {
        this.searchEntity.orderby = "";
        this.searchEntity.sort = "";
      }
      this.getData();
    },
    getData() {
      if (this.$http) {
        this.loading = true;
        this.$http({
          url: this.datamaintainConfigQuery,
          method: "POST",
          data: this.searchEntity
        })
          .then(rt => {
            if (rt.data) {
              rt.data.list.forEach(item => {
                this.$set(item, "checked", false);
              });
              this.content.list = rt.data.list;
              this.content.total = rt.data.total;
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    submit() {
      if (this.isMore) {
        this.$emit("confirm", this.multipleSelection);
      } else {
        if (this.selectIndex >= 0) {
          const data = JSON.parse(
            JSON.stringify(this.content.list[this.selectIndex])
          );
          this.$emit("confirm", data);
        }
      }
      this.dialogVisible = false;
    },
    cancel() {
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  .tool-common-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
