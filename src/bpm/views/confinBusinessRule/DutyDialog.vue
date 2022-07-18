<template>
  <el-dialog
    title="请选择职责"
    :visible.sync="dialogVisible"
    width="60%"
    top="2vh"
    append-to-body
  >
    <el-row>
      <el-col :offset="16" :span="8">
        <el-input
          clearable
          :placeholder="$t('placeholderText.enterSettingsProcessTabCard')"
          v-model="searchKey"
          @keyup.enter.native="
            pageNum = 1;
            getData();
          "
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="
              pageNum = 1;
              getData();
            "
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <div class="content">
      <el-table
        :data="content.list"
        v-loading="loading"
        border
        @row-click="handleRowClick"
        style="width: 100%; margin-top: 10px"
        ref="multipleTable"
        tooltip-effect="dark"
        :header-cell-style="{ background: '#E1EAFD !important' }"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="100"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column
          type="index"
          align="center"
          :label="$t('number')"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          :label="$t('responsibility')"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="id"
          align="center"
          label="职责代码"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="rolesuser"
          align="center"
          label="归属组织"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <div class="margin-t15" v-if="content.list">
        <el-pagination
          :page-size="pageSize"
          :current-page.sync="pageNum"
          :total="content.total"
          background
          @current-change="getData"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        @click="
          dialogVisible = false;
          multipleSelection = [];
        "
        >{{ $t("cancelAction") }}</el-button
      >
      <el-button type="primary" @click="submit">{{ $t("confirm") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { queryduty } from "@/bpa/api/settings/userManage";
export default {
  name: "processRolesDialog",
  data() {
    return {
      loading: true,
      dialogVisible: false,
      searchKey: "",
      content: {},
      pageSize: 8,
      pageNum: 1,
      multipleSelection: "",
    };
  },
  props: {
    value: {
      type: Boolean,
    },
    itemList: {
      type: Array,
    },
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      queryduty({
        logic: "or",
        filters: [
          { key: "ISDELETE", opt: "eq", type: "S", value: '0' },
          { key: "name", opt: "LIKE", type: "S", value: this.searchKey },
          { key: "id", opt: "LIKE", type: "S", value: this.searchKey },
        ],
        searchData: this.searchKey,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((rt) => {
          this.content = rt;
          rt.list.forEach((item) => {
            item.checked = false;
          });
          // if (this.itemList) {
          if (this.itemList.length > 0) {
            this.check();
          } else {
            this.$refs.multipleTable.clearSelection();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    check() {
      let _this = this;
      setTimeout(() => {
        _this.content.list.forEach((item) => {
          _this.itemList.forEach((v) => {
            if (item.id === v) {
              if (_this.$refs.multipleTable) {
                _this.$refs.multipleTable.toggleRowSelection(item, true);
              }
            }
          });
        });
      }, 0);
    },
    submit() {
      this.$emit("confirm", this.multipleSelection);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
