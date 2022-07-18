<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query  :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList('添加业务组管理')">
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
          <el-form-item label="ID：">
            <el-input clearable type="text" v-model="searchForm.id"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务组名称：">
            <el-input clearable type="text" v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务组描述：">
            <el-input clearable type="text" v-model="searchForm.description"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="业务组类型：">
            <el-select clearable v-model="searchForm.typeid" class="w100">
              <el-option
                v-for="item in selectTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
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
          <el-col class="td" :span="headers[0].span">{{item.id}}</el-col>
          <el-col class="td" :span="headers[1].span">{{item.name}}</el-col>
          <el-col class="td" :span="headers[2].span">{{item.description}}</el-col>
          <el-col class="td" :span="headers[3].span">{{typeFilter(item.typeid)}}</el-col>
          <el-col style="text-align: center" :span="headers[4].span">
            <el-button type="text" icon="el-icon-edit" @click="addList('编辑业务组管理',item)"></el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)"></el-button>
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
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"
    ></el-pagination>
    <business-group-management-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import businessGroupManagementDialog from './businessGroupManagementDialog'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import {
  getBusinessGroupList,
  deleteBusinessGroup,
  batchDeleteBusinessGroup
} from '@/bpm/api/process/business/business_group_manage'
import { getBusinessGroupTypeList } from '@/bpm/api/process/business/business_group_type'
export default {
  mixins: [SearchListMixin],
  components: {
    businessGroupManagementDialog,
    QuickQuery
  },
  data () {
    return {
      isPowerSearch: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: '',
      selectTypeList: [],
      headers: [
        {
          key: 'id',
          name: 'ID',
          span: 4
        },
        {
          key: 'name',
          name: '业务组名称',
          span: 7
        },
        {
          key: 'description',
          name: '业务组描述',
          span: 7
        },
        {
          key: 'typeid',
          name: '业务组类型',
          span: 7
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      filters: [],
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
  mounted () {
    this.getData()
  },
  methods: {
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteBusinessGroup(item.id).then(rt => {
            if (rt.status === '200') {
              if (this.searchType === 'power') {
                this.getData()
              } else if (this.searchType === 'quick') {
                this.quickQueryData()
              }
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
          batchDeleteBusinessGroup(
            this.selections.map(item => item.id).join(',')
          ).then(rt => {
            if (rt.status === '200') {
              if (this.searchType === 'power') {
                this.getData()
              } else if (this.searchType === 'quick') {
                this.quickQueryData()
              }
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
    typeFilter (item) {
      for (let i = 0; i < this.selectTypeList.length; i++) {
        if (this.selectTypeList[i].id === item) {
          return this.selectTypeList[i].name
        }
      }
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
    },
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
      if (item === '添加业务组管理') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {}
      } else if (item === '编辑业务组管理') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = Object.assign({}, data)
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getBusinessGroupList({
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
          return getBusinessGroupTypeList()
        })
        .then(rt => {
          if (rt.status === '200') {
            this.selectTypeList = rt.data.list
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
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
.w100 {
  width: 100%;
}
</style>
