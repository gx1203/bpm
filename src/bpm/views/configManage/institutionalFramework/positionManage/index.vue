<template>
  <el-card shadow="never">
    <div class="item-left">
      <tree-position ref="tree" @confirm="treeHandle" @deleteSuccess="deleteSuccess"></tree-position>
    </div>
    <div class="item-right" v-if="!!treeData.id">
      <div class="tool-common-wrap">
        <div class="search-wrap">
          <quick-query :placeholder="$t('placeholderText.multipleFieldsPlaceholder19')" ref="quick" :isDate="false" @quickSearch="quickSearch" />
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="jobHandle('添加职务')">
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
          <el-button type="primary" @click="rest">
             {{ $t('refresh') }}
            <!---->
          </el-button>
        </div>
      </div>
      <el-form
        class="power-search"
        :model="searchForm"
        @keyup.enter.native="powerSearch"
        label-width="120px"
        v-if="isPowerSearch"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('name2') + '：'">
              <el-input clearable type="text" v-model="searchForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('description') + '：'">
              <el-input clearable type="text" v-model="searchForm.description"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-r">
            <el-button type="primary" @click="powerSearch">{{ $t('query') }}</el-button>
            <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="tableWrap" v-loading="loading">
        <div v-if="$store.state.app.tableStyle ==='default'">
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
                <el-col class="td textHide" :span="headers[0].span" :title="item.name">{{item.name}}</el-col>
                <el-col
                  class="td textHide"
                  :span="headers[1].span"
                  :title="item.description"
                >{{item.description}}</el-col>
                <el-col style="text-align: center" :span="headers[2].span">
                  <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                    <el-button type="text" @click="jobHandle('编辑职务',item)">{{ $t('edit') }}</el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                    <el-button type="text" @click="handleDeleteOne(item)">{{ $t('delete') }}</el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </div>
          <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
        </div>
        <div v-else>
          <el-table
            :data="content.list"
            class="margin-t10"
            stripe
            :header-cell-style="{background: '#E1EAFD !important'}"
            highlight-current-row
            @sort-change="elHandleSort"
            current-row-key="id"
          >
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked" />
              </template>
              <template slot="header">
                <el-checkbox v-model="checkAll" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('name2')" show-overflow-tooltip sortable prop="name" />
            <el-table-column :label="$t('description')" show-overflow-tooltip sortable prop="description" />
            <el-table-column :label="$t('operation')"  width="100">
              <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top">
                    <el-button type="text" @click="jobHandle('编辑职务',scope.row)">{{ $t('edit') }}</el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                    <el-button type="text" @click="handleDeleteOne(scope.row)">{{ $t('delete') }}</el-button>
                  </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-pagination
        class="margin-t15"
        :page-size="page.pageSize"
        :current-page.sync="page.pageNum"
        background
        @current-change="searchType === 'power' ? getData() : quickQueryData()"
        :total="content.total"
      ></el-pagination>
    </div>
    <position-manage-dialog
      v-model="dialogVisible"
      :item="editItem"
      :treeData="treeData"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import { queryJob, deleteJob } from "@/bpm/api/configManage/institutionalFramework/position_manage";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import treePosition from "@/bpm/components/treePosition";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import positionManageDialog from "./positionManageDialog";
export default {
  mixins: [SearchListMixin],
  name: "positionManage",
  components: {
    QuickQuery,
    treePosition,
    positionManageDialog
  },
  data() {
    return {
      headers: [
        {
          key: "name",
          name: this.$t('name2'),
          span: 12
        },
        {
          key: "description",
          name: this.$t('description'),
          span: 10
        },
        {
          name: this.$t('operation'),
          span: 2
        }
      ],
      dialogVisible: false,
      treeData: {},
      editItem: {},
      linkTitle: "",
      selections: [],
      checkAll: ""
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
  mounted() {},
  methods: {
    jobHandle(item, data) {
      if (item === "编辑职务") {
        this.editItem = Object.assign({}, data);
      } else {
        this.editItem = {};
      }
      this.linkTitle = item;
      this.dialogVisible = true;
    },
    saveSuccess(data) {
      if (this.searchType === "power") {
        this.getData();
      } else if (this.searchType === "quick") {
        this.quickQueryData();
      }
      this.treeRefresh()
    },
    handleAllDelete() {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          this.selections.forEach((item, index) => {
            this.loading = true
            deleteJob(item.id).then(rt => {
              this.loading = false
              if (rt.status === "200" && index === this.selections.length - 1) {
                this.$message({
                  message: this.$t('hintText.successfullyDelete'),
                  type: "success"
                });
                if (this.searchType === "power") {
                  this.getData();
                } else if (this.searchType === "quick") {
                  this.quickQueryData();
                }
                this.treeRefresh()
              }
            })
          })
          // deleteAllPositions(
          //   this.selections.map(item => item.id).join(",")
          // ).then(rt => {
          //   if (rt.status === "200") {
          //     this.getData();
          //     this.$message({
          //       message: this.$t('hintText.successfullyDelete'),
          //       type: "success"
          //     });
          //   } else {
          //     this.$message({
          //       message: this.$t('hintText.failToDelete'),
          //       type: "error"
          //     });
          //   }
          // });
        })
        .catch(_ => {});
    },
    treeHandle(data) {
      this.treeData = data;
      if (this.searchType === "power") {
        this.getData();
      } else if (this.searchType === "quick") {
        this.quickQueryData();
      }
    },
    // 快速获取数据
    quickQueryData() {
      this.loading = true;
      if (this.filters.findIndex(item => item.key === "pid") < 0) {
        this.filters.push({
          key: "pid",
          logic: "AND",
          opt: "EQ",
          value: this.treeData.id
        });
      } else {
        this.filters[
          this.filters.findIndex(item => item.key === "pid")
        ].value = this.treeData.id;
      }
      queryJob({
        filters: this.filters,
        fullFilters: [
          {
            filters: [
              {
                key: "name",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              },
              {
                key: "description",
                logic: "OR",
                opt: "LIKE",
                value: this.quickData.searchData
              }
            ],
            logic: "and"
          }
        ],
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取数据
    getData() {
      this.loading = true;
      if (this.filters.findIndex(item => item.key === "pid") < 0) {
        this.filters.push({
          key: "pid",
          logic: "AND",
          opt: "EQ",
          value: this.treeData.id
        });
      } else {
        this.filters[
          this.filters.findIndex(item => item.key === "pid")
        ].value = this.treeData.id;
      }
      queryJob({
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleDeleteOne(item) {
      // this.$confirm(`您确定要删除【${item.name}】吗?`, this.$t('hintText.hint'), {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          this.loading = true
          deleteJob(item.id).then(rt => {
            this.loading = false
            if (rt.status === "200") {
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              })
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
              this.treeRefresh()
            }
          });
        })
        .catch(_ => {});
    },
    deleteSuccess () {
      this.treeData = {}
    },
    treeRefresh () {
      this.$refs.tree.treeRefresh()
    }
  }
}
</script>

<style  lang="scss" scoped>
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
      left: 20px;
    }
  }
}
</style>
