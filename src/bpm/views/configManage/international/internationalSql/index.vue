<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="userHandle($t('addInternationalizationModuleConfiguration'))">
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
    <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm" label-width="120px"
      size="mini" v-if="isPowerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('moduleName') + '：'">
            <el-input clearable type="text" v-model="searchForm.modelname"></el-input>
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
              <el-col class="td" :span="headers[0].span">{{item.modelname}}</el-col>
              <el-col class="td" :span="headers[1].span">{{item.searchsql}}</el-col>
              <el-col class="td" :span="headers[2].span">{{item.description}}</el-col>
              <el-col style="text-align: center" :span="headers[3].span">
                <el-tooltip class="item" :content="$t('edit')" placement="top">
                  <el-button type="text"
                    @click="userHandle($t('editInternationalizationModuleConfiguration'),item)">{{ $t('edit') }}</el-button>
                </el-tooltip>
                <el-tooltip class="item" :content="$t('delete')" placement="top">
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
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('moduleName')" show-overflow-tooltip sortable prop="modelname">
            <template slot-scope="scope">
              <div>{{scope.row.modelname}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('query')+'Sql'" min-width="200" show-overflow-tooltip sortable prop="searchsql">
            <template slot-scope="scope">
              <div>{{scope.row.searchsql}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('description')" show-overflow-tooltip sortable prop="description">
            <template slot-scope="scope">
              <div>{{scope.row.description}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" width="80">
            <template slot-scope="scope">
              <el-tooltip class="item" :content="$t('edit')" placement="top">
                <el-button type="text"
                  @click="userHandle($t('editInternationalizationModuleConfiguration'),scope.row)">{{ $t('edit') }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" :content="$t('delete')" placement="top">
                <el-button type="text" @click="handleDelete(scope.row)">{{ $t('delete') }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="getData" :total="content.total"></el-pagination>
    <international-sql-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
  </el-card>
</template>
<script>
import internationalSqlDialog from './internationalSqlDialog'
import {
  getManagmentList,
  deleteManagment,
  deleteAllManagment
} from '@/bpm/api/configManage/internationalSql'
export default {
  name: 'internationalSql',
  components: {
    internationalSqlDialog
  },
  data () {
    return {
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      businessDialogVisible: false,
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'modelname',
          name: this.$t('moduleName'),
          span: 6
        },
        {
          key: 'searchsql',
          name: this.$t('query') + 'Sql',
          span: 6
        },
        {
          key: 'description',
          name: this.$t('description'),
          span: 6
        },
        {
          name: this.$t('operation'),
          span: 6
        }
      ],
      content: {
        list: [{}]
      },
      selections: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: ''
    }
  },
  watch: {
    'content.list': {
      handler (val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true
          this.selections = []
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false
            } else {
              this.selections.push(this.content.list[i])
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
            item.checked = val
          })
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        }
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteAllManagment(this.selections.map(item => item.id)).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    handleDelete (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteManagment(item.id).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    userHandle (item, data) {
      this.linkTitle = item
      if (item === this.$t('addInternationalizationModuleConfiguration')) {
        this.editItem = {}
        this.dialogVisible = true
      } else if (item === this.$t('editInternationalizationModuleConfiguration')) {
        this.editItem = Object.assign({}, data)
        this.dialogVisible = true
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getManagmentList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === '200') {
            rt.data.list.forEach(item => {
              item.checked = false
            })
            this.content = rt.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSort (val) {
      this.sort = val
      this.getData()
    },
    search () {
      this.filters = []
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    reset () {
      this.searchForm = {}
      this.search()
    },
    saveSuccess (param) {
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.margin-t10 {
  /deep/ .el-table__header {
    width: 100% !important;
  }
  /deep/ .el-table__body {
    width: 100% !important;
  }
}
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
