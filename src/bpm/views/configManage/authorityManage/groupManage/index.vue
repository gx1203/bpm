<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="userHandle('添加角色')">
          {{ $t('add') }}
          <!---->
        </el-button>
        <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
          {{ $t('batchDelete') }}
          <!--<i class="el-icon-circle-close" />-->
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
        </el-button>
        <el-button type="primary" @click="getData">
           {{ $t('refresh') }}
          <!---->
        </el-button>
      </div>
    </div>
    <el-form
      class="power-search"
      :model="searchForm"
      @keyup.enter.native="search"
      ref="searchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('name2') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="search">{{ $t('query') }}</el-button>
          <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-loading="loading">
      <div class="table-header margin-t10">
        <el-checkbox v-model="checkAll" class="all-check" />
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <div class="tr-title">
            <el-checkbox v-model="item.checked" style="margin-right: 10px" />
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span">{{item.drafter}}</el-col>
            <el-col class="td" :span="headers[1].span">{{item.passReaderUserName}}</el-col>
            <el-col class="td" :span="headers[2].span">{{item.passReaderUserName}}</el-col>
            <el-col class="td" :span="headers[3].span">{{item.passReaderUserName}}</el-col>
            <el-col style="text-align: center" :span="headers[4].span">
              <el-tooltip class="item" content="分配成员" placement="top">
                <el-button type="text" @click="userHandle('分配成员')">分配成员</el-button>
              </el-tooltip>
              <el-tooltip class="item" :content="$t('edit')" placement="top">
                <el-button type="text" icon="el-icon-edit" @click="userHandle('编辑角色')"></el-button>
              </el-tooltip>
              <el-tooltip class="item" :content="$t('delete')" placement="top">
                <el-button type="text" icon="el-icon-delete" @click="handleDelete(item)"></el-button>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
    </div>
    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="getData"
      :total="content.total"
    ></el-pagination>
    <group-manage-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
    <allocation-dialog v-model="businessDialogVisible" />
  </el-card>
</template>
<script>
import groupManageDialog from "./groupManageDialog";
import allocationDialog from "./allocationDialog";
import { getAuthgroupList } from "@/bpm/api/configManage/authorityManage/groupManage";
export default {
  components: {
    groupManageDialog,
    allocationDialog
  },
  data() {
    return {
      searchKey: "",
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      businessDialogVisible: false,
      searchForm: {},
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "drafter",
          name: this.$t('name2'),
          span: 5
        },
        {
          key: "passReaderUserName",
          name: this.$t('type'),
          span: 5
        },
        {
          key: "passReaderUserName",
          name: "默认",
          span: 5
        },
        {
          key: "passReaderUserName",
          name: "禁用",
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      filters: [],
      content: {
        list: []
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: "",
      selections: []
    };
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
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    handleAllDelete() {
      this.$confirm("您确定要删除选择的数据吗?", this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteAllDictorary(
            this.selections.map(item => item.id).join(",")
          ).then(rt => {
            if (rt.status === "200") {
              this.getData();
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: "error"
              });
            }
          });
        })
        .catch(_ => {});
    },
    handleDelete(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteDictorary(item.id).then(rt => {
            if (rt.status === "200") {
              this.getData();
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: "error"
              });
            }
          });
        })
        .catch(_ => {});
    },
    userHandle(item, data) {
      this.linkTitle = item;
      if (item === "添加角色") {
        this.editItem = {
          conditionList: []
        };
        this.dialogVisible = true;
      } else if (item === "编辑角色") {
        this.editItem = Object.assign({}, data);
        this.dialogVisible = true;
      } else if (item === "分配成员") {
        this.businessDialogVisible = true;
      } else if (item === "删除角色") {
      }
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
      getAuthgroupList({
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === "200") {
            rt.data.list.forEach(item => {
              item.checked = false;
            });
            this.content = rt.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSort(val) {
      this.sort = val;
      this.getData();
    },
    search() {},
    reset() {
      this.searchForm = {};
      this.search();
    },
    saveSuccess(param) {
      if (param) {
        this.getData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.table-header {
  position: relative;
  background: $bc2;
  display: flex;
  align-items: center;
  .all-check {
    position: absolute;
    left: 20px;
  }
}
.w100 {
  width: 100%;
}
</style>
