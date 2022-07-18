<template>
  <el-card shadow="never">
    <div class="item-left">
      <!-- <tree-process type="1" @confirm="handleNodeClick" /> -->
      <BasProcessTree showView="1" @confirm="handleNodeClick" />
    </div>
    <div class="item-right" v-if="isShow">
      <div class="tool-common-wrap">
        <div class="search-wrap">
          <!-- <quick-query :isDate="false" ref="quick" :isData="false" @quickSearch="quickSearch" /> -->
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="addList($t('addChartConfiguration'))">
            {{ $t('add') }}
            <!---->
          </el-button>
          <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
            {{ $t('advancedQuery') }}
            <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
          </el-button>
          <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
            {{ $t('batchDelete') }}
            <!--<i class="el-icon-circle-close" />-->
          </el-button>
          <el-button type="primary" @click="reset">
            {{ $t('refresh') }}
            <!---->
          </el-button>
        </div>
      </div>
      <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm"
        label-width="120px" size="mini" v-if="isPowerSearch">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('chartName') + '：'">
              <el-input clearable type="text" v-model="searchForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('chartEnglishName') + '：'">
              <el-input clearable type="text" v-model="searchForm.name_en"></el-input>
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
                <el-col class="td" :title="item.id" :span="headers[0].span">{{'customChart?id=' + scope.row.id}}</el-col>
                <el-col class="td" :title="item.name" :span="headers[1].span">{{item.name }}</el-col>
                <el-col class="td" :title="item.nameEn" :span="headers[2].span">{{item.nameEn }}</el-col>
                <el-col style="text-align: center" :span="headers[3].span">
                  <el-tooltip :content="$t('editChartConfiguration')">
                    <el-button type="text" icon="el-icon-edit" @click="addList($t('editChartConfiguration'),item)">
                    </el-button>
                  </el-tooltip>
                  <el-tooltip :content="$t('setChartConfiguration')">
                    <el-button type="text" icon="el-icon-s-tools" @click="configHandle($t('chartConfiguration'),item)">
                    </el-button>
                  </el-tooltip>
                  <el-tooltip :content="$t('delete')">
                    <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)"></el-button>
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
            <el-table-column :label="$t('address')" show-overflow-tooltip prop="id" width="300">
              <template slot-scope="scope">
                <span>{{'customChart?id=' + scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('chartName')" show-overflow-tooltip sortable prop="name">
            </el-table-column>
            <el-table-column :label="$t('chartEnglishName')" show-overflow-tooltip sortable prop="nameEn">
            </el-table-column>
            <el-table-column :label="$t('operation')" width="140">
              <template slot-scope="scope">
                <el-tooltip :content="$t('editChartConfiguration')">
                  <el-button type="text" icon="el-icon-edit" @click="addList($t('editChartConfiguration'),scope.row)">
                  </el-button>
                </el-tooltip>
                <el-tooltip :content="$t('setChartConfiguration')">
                  <el-button type="text" icon="el-icon-s-tools"
                    @click="configHandle($t('chartConfiguration'),scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip :content="$t('delete')">
                  <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
        @current-change="getData()" :total="content.total"></el-pagination>
    </div>
    <chart-config-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
    <chart-dialog v-model="dialogReportVisible" :item="editItem" :title="$t('setChartConfiguration')"
      @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import chartConfigDialog from "./chartConfigDialog";
import chartDialog from "./chartDialog";
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  queryChartList,
  deleteChart,
  batchDeleteChart
} from "@/bpm/api/process/processModeling/chart_config";
export default {
  mixins: [SearchListMixin],
  components: {
    chartConfigDialog,
    chartDialog
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: "",
      isShow: false,
      dialogReportVisible: false,
      isPowerSearch: false,
      treeData: {},
      headers: [
        {
          name: this.$t('address'),
          span: 10
        },
        {
          key: "name",
          name: this.$t('chartName'),
          span: 5
        },
        {
          key: "nameEn",
          name: this.$t('chartEnglishName'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      searchForm: {},
      filters: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      sort: {},
      content: {
        total: 0
      },
      selections: [],
      checkAll: ""
    };
  },
  watch: {
    "content.list": {
      handler (val) {
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
    checkAll (val) {
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
  methods: {
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          deleteChart(item.id).then(rt => {
            if (rt.status === "200") {
              this.getData();
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            } else {
              this.loading = false;
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: "error"
              });
            }
          }).catch(() => {
            this.loading = false;
          });
        })
        .catch(() => {});
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          batchDeleteChart(
            this.selections
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
        .catch(() => {});
    },
    saveSuccess (data) {
      if (data) {
        this.getData();
      }
    },
    addList (item, data) {
      if (item === this.$t('addChartConfiguration')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = {
          processName: this.treeData.name,
          processId: this.treeData.id,
          type: 'process'
        };
      } else if (item === this.$t('editChartConfiguration')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        data.processName = this.treeData.name;
        data.processId = this.treeData.id;
        this.editItem = Object.assign({}, data);
      }
    },
    configHandle (item, data) {
      this.dialogReportVisible = true;
      this.editItem = Object.assign({}, data);
    },
    handleNodeClick (data) {
      this.treeData = data;
      if (data.type !== "1") {
        this.isShow = false;
      } else {
        this.getData();
        this.isShow = true;
      }
    },
    getData () {
      this.loading = true;
      this.checkAll = false;
      queryChartList({
        fullFilters: [
          {
            filters: this.filters,
            logic: "and"
          },
          {
            filters: [
              { key: "processId", opt: "EQ", type: "S", value: this.treeData.id }
            ],
            logic: "and"
          }
        ],
        orderby: 'createon',
        sort: 'desc',
        logic: "and",
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
    search () {
      this.filters = [];
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: "LIKE",
          type: "S",
          value: this.searchForm[key]
        };
        this.filters.push(filter);
      });
      this.getData();
    },
    reset () {
      this.searchForm = {};
      this.search();
    },
    handleSort (val) {
      this.sort = val;
      this.getData();
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
      left: 10px;
      top: 10px;
    }
  }
}
</style>
