<template>
  <el-card shadow="never" class="card-reset-inner">
    <div class="item-left">
      <treeProcess type="1" @confirm="handleNodeClick" />
    </div>
    <div class="item-right" v-if="treeData.isProcess === 'Y'">
      <div class="tool-common-wrap">
        <div class="search-wrap" />
        <div class="btn-wrap">
          <el-button type="primary" @click="addHandle('add')">
            {{ $t('add') }}
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
        v-if="isPowerSearch"
        ref="searchForm"
        class="power-search"
        :model="searchForm"
        label-width="120px"
        size="mini"
        @keyup.enter.native="search"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="测试名称">
              <el-input v-model="searchForm.testname" clearable type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="测试人">
              <el-input v-model="searchForm.tester" clearable type="text" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="组织机构">
              <el-input v-model="searchForm.testorgname" clearable type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="测试时间">
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
        </el-row>
        <el-row>
          <el-col :span="24" class="text-r">
            <el-button type="primary" @click="powerSearch">
              {{ $t('query') }}
            </el-button>
            <el-button type="primary" @click="rest">
              {{ $t('reset') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="tableWrap" v-loading="loading">
        <el-table
          :data="content.list"
          class="margin-t10"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          current-row-key="id">
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column
            prop="testname"
            label="测试名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="tester"
            label="测试人"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="测试时间"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.createon | formatDateTime }}
            </template>
          </el-table-column>
          <el-table-column
            prop="testorgname"
            label="组织机构"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="errcount"
            label="测试出错数量"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            :label="$t('operating')"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" icon="iconfont icon-check-line" @click="addHandle('edit', scope.row)" />
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne( scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="margin-t15"
        :page-size="page.pageSize"
        :current-page.sync="page.pageNum"
        background
        @current-change="getData()"
        :total="content.total"
      ></el-pagination>
    </div>
    <detailList v-model="dialogVisibles" :editItem="editItem"/>
    <executeTestDialog v-model="dialogVisible" :testProcessId="testProcessId" @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import treeProcess from '@/bpm/components/treeProcessFlow'
import executeTestDialog from './executeTestDialog'
import detailList from './details'
import { getAutoList, deleteAutoRecord, deleteAutoRecords } from '@/bpm/api/process/automatedTest'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  mixins: [SearchListMixin],
  name: 'AutomatedTest',
  components: {
    treeProcess,
    executeTestDialog,
    detailList
  },
  data() {
    return {
      testProcessId: '',
      dialogVisibles: false,
      dialogVisible: false,
      treeData: {},
      editItem: {},
      headers: [{
        key: 'name',
        name: this.$t('testname'),
        span: 4
      }, {
        key: '测试人',
        name: this.$t('tester'),
        span: 8
      },
      {
        key: '测试时间',
        name: this.$t('createon'),
        span: 8
      }, {
        key: '组织机构',
        name: this.$t('testorgname'),
        span: 8
      },
      {
        key: '测试出错数量',
        name: this.$t('errcount'),
        span: 4
      },
      {
        name: this.$t('operation'),
        span: 4
      }
      ],
      selections: [],
      checkAll: false
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
  methods: {
    handleNodeClick(data) {
      this.treeData = data
      this.getData()
    },
    getData() {
      this.loading = true
      this.checkAll = false
      getAutoList({
        logic: 'and',
        filters: [
          { key: 'testprocessid',
            opt: 'EQ',
            type:'S',
            value: this.treeData.id
          },
          ...this.filters
        ],
        pageNum: this.page.pagenum,
        pageSize: this.page.pagesize
      }).then(rt => {
        rt.data.list.forEach(item => {
          this.$set(item, 'checked', false)
        })
        this.content = rt.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addHandle(type, date) {
      if (type === 'edit') {
        this.editItem = Object.assign({}, date)
        this.dialogVisibles = true
      }
      if (type === 'add') {
        if (this.treeData.isProcess !== 'Y') return false
        this.testProcessId = this.treeData.id
        this.dialogVisible = true
      }
    },
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        deleteAutoRecord(item.id).then(rt => {
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
      }).catch(_ => {})
    },
    handleAllDelete() {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteAutoRecords(
            this.selections.map(item => item.id).join(',')
          ).then(rt => {
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
        .catch(_ => {})
    },
    // 搜索
    search() {
      this.filters = []
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        if (key === 'startDate' || key === 'endDate') {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          filter.value = this.searchForm[key]
            ? this.searchForm[key].join('~')
            : ''
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    saveSuccess() {
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.card-reset-inner {
  padding-top: 10px;
}
.card-reset-inner /deep/ .el-card__body {
  display: flex;
}
.item-left {
  width: 250px;
  height: 100%;
  margin-right: 20px;
}
.w100 {
  width: 100%;
}
.item-right {
  // width: calc(100% - 270px);
  flex: 1;
}
</style>
