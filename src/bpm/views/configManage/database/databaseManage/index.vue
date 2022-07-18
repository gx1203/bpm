<template>
  <el-card shadow="never" class="card-reset">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :placeholder="$t('tableName') + '、' + $t('tableRemark')" :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList('add')">
          {{ $t('add') }}
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
         <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
        </el-button>
        <el-button type="primary" @click="rest">
          {{ $t('refresh') }}
        </el-button>
      </div>
    </div>
    <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm" label-width="120px"
      size="mini" v-if="isPowerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('tableName') + '：'">
            <el-input clearable type="text" v-model="searchForm.tableName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('tableRemark') + '：'">
            <el-input clearable type="text" v-model="searchForm.tableComment"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('tableType') + '：'">
            <el-select clearable type="text" class="w100" v-model="searchForm.isMainTable" :popper-append-to-body="false">
              <el-option :label="$t('all')" value=""></el-option>
              <el-option :label="$t('subtabulation')" value="1"></el-option>
              <el-option :label="$t('mainTable')" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('createTime') + '：'">
            <el-date-picker
              v-model="searchForm.createon"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
         <el-col :span="8">
          <el-form-item :label="$t('creator') + '：'">
            <el-input clearable type="text" v-model="searchForm.createByName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('updateTime') + '：'">
            <el-date-picker
              v-model="searchForm.updateon"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('lastUpdator') + '：'">
            <el-input clearable type="text" v-model="searchForm.updateByName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('state') + '：'">
            <el-select clearable type="text" class="w100" v-model="searchForm.isDelete" :popper-append-to-body="false">
              <el-option :label="$t('all')" value=""></el-option>
              <el-option :label="$t('valid')" value="0"></el-option>
              <el-option :label="$t('loseEfficacy')" value="1"></el-option>
              <el-option label="未生成库" value="2"></el-option>
            </el-select>
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
    <div v-loading="loading">
      <div v-if="$store.state.app.tableStyle ==='default'">
         <div class="table-header margin-t10">
          <!-- <el-checkbox v-model="checkAll" class="all-check" /> -->
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length !== 0">
          <div class="tr" v-for="(item, index) in content.list" :key="index">
            <el-row class="tr-body" type="flex" align="middle">
              <!-- <el-col class="td" :span="headers[0].span">{{item.dictionaryen}}</el-col> -->
              <el-col class="td" :span="headers[0].span">{{item.tableName}}</el-col>
              <el-col class="td" :span="headers[1].span">{{item.tableComment}}</el-col>
              <el-col class="td" :span="headers[2].span">{{item.isMainTable}}</el-col>
              <el-col class="td" :span="headers[3].span">{{item.extension}}</el-col>
              <el-col style="text-align: center" :span="headers[4].span">
               <el-tooltip class="item" effect="dark" :content="$t('editDatabase')" placement="top">
                <el-button type="text" @click="addList('edit' ,item)">
                  {{ $t('editDatabase') }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('view')" placement="top">
                <el-button type="text" @click="addList('view', item)">
                  {{ $t('view') }}
                </el-button>
              </el-tooltip>
               <el-tooltip class="item" effect="dark" :content="$t('setUp')" placement="top">
                <el-button type="text" @click="setList(item)">{{ $t('setUp') }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('generateLibrary')" placement="top">
                <el-button type="text" @click="addList($t('generateLibrary'),item)">
                {{ $t('generateLibrary') }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button type="text" @click="handleDelete(item)">{{ $t('delete') }}</el-button>
              </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
      </div>
      <div v-else>
        <el-table :data="content.list" class="margin-t10" stripe :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row @sort-change="elHandleSort" current-row-key="id">
           <!-- <el-table-column label="序号" type="index" >
          </el-table-column> -->
          <el-table-column :label="$t('tableName')" show-overflow-tooltip sortable prop="tableName">
          </el-table-column>
          <el-table-column :label="$t('tableRemark')" show-overflow-tooltip sortable prop="tableComment">
          </el-table-column>
          <el-table-column :label="$t('tableType')" show-overflow-tooltip sortable prop="isMainTable">
            <template slot-scope="scope">
              <span>{{scope.row.isMainTable === '0' ? $t('mainTable') : scope.row.isMainTable === '1' ? $t('subtabulation') : ''}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('createTime')" show-overflow-tooltip sortable width="130px">
            <template v-slot="slotProps">
              {{slotProps.row.createon | formatDateTime}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('creator')" show-overflow-tooltip sortable prop="createByName" width="110">
          </el-table-column>
           <el-table-column :label="$t('updateTime')" show-overflow-tooltip sortable width="130px">
             <template v-slot="slotProps">
               {{slotProps.row.updateon | formatDateTime}}
             </template>
          </el-table-column>
           <el-table-column :label="$t('lastUpdator')" show-overflow-tooltip sortable prop="updateByName">
          </el-table-column>
           <el-table-column :label="$t('state')" show-overflow-tooltip sortable prop="isDelete">
             <template slot-scope="scope">
               <span>{{scope.row.isDelete === '0' ? $t('valid') : scope.row.isDelete === '1' ? $t('loseEfficacy'): scope.row.isDelete === '2' ? '未生成库' : ''}}</span>
             </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" width="250px">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('editDatabase')" placement="top">
                <el-button type="text" @click="addList('edit', scope.row)">
                  {{ $t('editDatabase') }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('view')" placement="top">
                <el-button type="text" @click="addList('view', scope.row)">
                  {{ $t('view') }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('configure')" placement="top">
                <el-button type="text" @click="setList(scope.row)">{{ $t('configure') }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('generateLibrary')" placement="top">
                <el-button type="text" @click="generateLibrary(scope.row)">
                  {{ $t('generateLibrary') }}
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button type="text" @click="handleDelete(scope.row)">{{ $t('delete') }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background @current-change="searchType === 'power' ? getData() : quickQueryData()" :total="content.total"></el-pagination>
    <add-database-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
    <set-database-dialog v-model="dialogVisibleSet" :item="setItem" @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import addDatabaseDialog from "./addDatabaseDialog";
import SetDatabaseDialog from "./SetDatabaseDialog";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import Export from '@/bpm/components/export/Export'
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import {
  getDatabaseList,
  createTable,
  deleteTable
  // deleteDictorary
} from "@/bpm/api/configManage/database";
export default {
  name: 'databaseManage',
  components: {
    addDatabaseDialog,
    SetDatabaseDialog,
    QuickQuery,
    Export
  },
  mixins: [SearchListMixin],
  data () {
    return {
      setItem: {},
      loading: false,
      dialogVisible: false,
      isPowerSearch: false,
      dialogVisibleSet: false,
      editItem: {},
      linkTitle: "",
      searchForm: {},
      headers: [
        {
          key: "tableName",
          name: this.$t('tableName'),
          span: 3
        },
        {
          key: "tableRemark",
          name: this.$t('tableRemark'),
          span: 6
        },
        {
          key: "tableType",
          name: this.$t('tableType'),
          span: 6
        },{
          key: "createTime",
          name: this.$t('createTime'),
          span: 3
        },
        {
          key: "creator",
          name: this.$t('creator'),
          span: 6
        },
        {
          key: "updateTime",
          name: this.$t('updateTime'),
          span: 6
        },
        {
          key: "lastUpdator",
          name: this.$t('lastUpdator'),
          span: 5
        }, {
          key: "state",
          name: this.$t('state'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      filters: [],
      content: {
        list: [{}]
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
    };
  },
  mounted () {
    this.getData();
  },
  watch: {
    dialogVisible(val) {
      if(!val) {
        this.editItem = {}
      }
    }
  },
  methods: {
    saveSuccess (data) {
      if (data) {
        this.getData();
      }
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          deleteTable(item.tableName, item.id).then(rt => {
            if (rt.status === "200") {
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
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
          });
        })
        .catch(_ => {
          this.loading = false;
        });
    },
    addList (item, data) {
      if (item === 'add') {
        this.linkTitle = this.$t('addDatabase');
        this.editItem = {
          isMainTable:'0',
          isDelete:'0'
        };
      } else if (item === 'edit') {
        this.linkTitle = this.$t('editDatabase');
        this.editItem = JSON.parse(JSON.stringify(data))
      } else if (item === 'view') {
        this.linkTitle = this.$t('viewDatabase');
        this.editItem = JSON.parse(JSON.stringify(data))
      }
      this.dialogVisible = true;
    },
    setList (item) {
      this.dialogVisibleSet = true;
      this.setItem = item
    },
    quickQueryData () {
      this.loading = true;
      let filters = [
        { "key": "tableName", "opt": "LIKE", "type": "S", "value": this.quickData.searchData },
        { "key": "tableComment", "opt": "LIKE", "type": "S", "value": this.quickData.searchData }
      ]
      getDatabaseList({
        logic: "or",
        filters: filters,
        orderby: 'createon',
        sort: 'desc',
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === "200") {
            this.content = rt.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getData () {
      this.loading = true;
      getDatabaseList({
        logic: "and",
        filters: this.filters,
        orderby: 'createon',
        sort: 'desc',
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === "200") {
            this.content = rt.data;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    generateLibrary(item) {
      this.loading = true;
      createTable(item.id).then(rt => {
        if (rt.status === "200") {
          this.$message.success(this.$t("hintText.buildLibrarySuccessfully"));
          this.getData()
        } else {
          this.$message.error(rt.message);
        }
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
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
/deep/ .tool-common-wrap .search-wrap .el-input-group.el-input {
  margin-left: 0 !important;
  width: 250px !important;
}
</style>
