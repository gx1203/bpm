<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <!-- <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" /> -->
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList($t('addApprovalOrder'))">
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
      ref="searchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('name2') + '：'">
            <el-input clearable type="text" v-model="searchForm.approvalname"></el-input>
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
    <div v-if="$store.state.app.tableStyle ==='default'">
      <div class="table-header margin-t10">
        <el-checkbox v-model="checkAll" class="all-check" />
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">
        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <div class="tr-title">
            <el-checkbox v-model="item.checked" style="margin-right: 10px" />
            <!-- <span>{{ $t('applicationDate') }}：{{item.createDate | formatDateTime}}</span> -->
            <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col class="td" :span="headers[0].span"><p :title="item.approvalname">{{item.approvalname}}</p></el-col>
            <el-col style="text-align: center" :span="headers[1].span">
              <el-tooltip class="item" effect="dark" :content="$t('editApprovalOrder')" placement="top">
                <el-button type="text" icon="el-icon-edit" @click="addList($t('editApprovalOrder'),item)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
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
        <el-table-column :label="$t('name2')" show-overflow-tooltip prop="approvalname">
        </el-table-column>
        <el-table-column :label="$t('operation')" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('editApprovalOrder')" placement="top">
              <el-button type="text" icon="el-icon-edit" @click="addList($t('editApprovalOrder'),scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"
    ></el-pagination>
    <approval-process-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import approvalProcessDialog from './approvalProcessDialog'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  getOrderApprovalList,
  deleteOrderApproval,
  batchDeleteOrderApproval
} from '@/bpm/api/process/business/approval_process'
export default {
  name:'approvalProcess',
  mixins: [SearchListMixin],
  components: {
    approvalProcessDialog,
    QuickQuery
  },
  data () {
    return {
      isPowerSearch: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: '',
      headers: [
        {
          // key: "approvalname",
          name: this.$t('name2'),
          span: 21
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      content: {
        list: [{}]
      },
      selections: [],
      checkAll: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    saveSuccess (data) {
      if (data) {
        if (this.searchType === 'power') {
          this.getData()
        } else if (this.searchType === 'quick') {
          this.quickQueryData()
        }
      }
    },
    addList (item, data) {
      if (item === this.$t('addApprovalOrder')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {
          users: []
        }
      } else if (item === this.$t('editApprovalOrder')) {
        this.dialogVisible = true
        this.linkTitle = item
        if (data.users) {
          this.editItem = Object.assign({}, data)
        } else {
          let list = {
            approvalname: data.approvalname,
            id: data.id,
            users: []
          }
          this.editItem = Object.assign({}, list)
        }
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getOrderApprovalList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
          })
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteOrderApproval(item.id).then(rt => {
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
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          batchDeleteOrderApproval(
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
    quickQueryData () {
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
  }
}
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
</style>
