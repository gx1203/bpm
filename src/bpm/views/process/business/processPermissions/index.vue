<template>
  <el-card shadow="never">
    <div class="item-left">
      <BasProcessTree showView="1" @confirm="handleNodeClick" />
    </div>
    <div v-show="treeData.type === '1'" class="item-right">
      <div class="tool-common-wrap">
        <div class="search-wrap">
          <!-- <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" /> -->
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="adminHandle">
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
      <el-form v-if="isPowerSearch" ref="searchForm" class="power-search" :model="searchForm" label-width="120px"
        size="mini" @keyup.enter.native="search">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('userName') + '：'">
              <el-input v-model="searchForm.displayname" clearable type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-r">
            <el-button type="primary" @click="search">
              {{ $t('query') }}
            </el-button>
            <el-button type="primary" @click="rest">
              {{ $t('reset') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="$store.state.app.tableStyle ==='default'">
        <div class="table-header margin-t10" style="height: 36px">
          <el-checkbox v-model="checkAll" class="all-check" />
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length!==0">
          <div v-for="(item, index) in content.list" :key="index" class="tr">
            <div class="tr-title" style="padding: 8px 10px;">
              <el-checkbox v-model="item.checked" style="margin-right: 10px" />
              <!-- <span>{{ $t('applicationDate') }}：{{item.createDate | formatDateTime}}</span> -->
              <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td" :span="headers[0].span">
                {{ item.displayname }}
              </el-col>
              <el-col style="text-align: center" :span="headers[1].span">
                <!-- <el-button type="text" icon="el-icon-edit" @click="adminHandle"></el-button> -->
                <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)" />
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty">
          {{ $t('noData') }}
        </div>
      </div>
      <div v-else>
        <el-table :data="content.list" class="margin-t10" stripe :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row current-row-key="id">
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('userName')" show-overflow-tooltip prop="displayname">
          </el-table-column>
          <el-table-column :label="$t('operation')" width="120">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
        :total="content.total" @current-change="getData()" />
    </div>
    <bas-organieation v-model="organieationShow" :selected-element="selectedElement" :is-specified-group-but="false"
      :is-show-bustom-groups-but="false" :select-element="selectElement" :show-element="showElement" :isShowPost="true"
      :title="orgtitle" :multiple="basOrganieationMultiple" @fnCallBack="fnBasOrganieationCallBack" />
  </el-card>
</template>

<script>
import Vue from 'vue'
import treeProcess from '@/bpm/components/treeProcessFlow'
import {
  getPowerControlList,
  savePowerControl,
  deletePowerControl,
  batchDeletePowerControl
} from '@/bpm/api/process/business/process_permissions'

import BasComponent from 'bas-component'
Vue.use(BasComponent)
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import 'bas-component/lib/BasComponent.css'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'

export default {
  name: 'ProcessPermissions',
  mixins: [SearchListMixin],
  components: {
    treeProcess
  },
  data () {
    return {
      isPowerSearch: false,
      searchForm: {},
      sort: {},
      page: {
        pagenum: 1,
        pagesize: 10
      },
      content: {},
      filters: [],
      treeData: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'name',
          name: this.$t('userName'),
          span: 21
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: '',
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ['9'],
      orgtitle: this.$t('selectPersonnel'),
      basOrganieationMultiple: true
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
              this.selections.push(this.content.list[i].id)
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
    },
    treeData (val) {
      if (val.type === '1') {
        this.getData()
      }
    }
  },
  methods: {
    handleNodeClick (data) {
      this.treeData = data
    },
    getData () {
      this.loading = true
      this.checkAll = false
      this.treeData
      getPowerControlList({
        attr: {
          processid: this.treeData.id
        },
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
    adminHandle () {
      this.selectedElement = {}
      this.organieationShow = true
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deletePowerControl(item.id).then(rt => {
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
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          batchDeletePowerControl(
            this.selections.join(',')
          ).then(rt => {
            if (rt.status === '200') {
              // this.quickQueryData()
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
    // 搜索
    search () {
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
    // 重置
    rest () {
      this.searchForm = {}
      this.search()
    },
    handleSort (val) {
      this.sort = val
      this.getData()
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
    fnBasOrganieationCallBack (data) {
      savePowerControl({
        userids: data.id.split(','),
        processid: this.treeData.id
      }).then(rt => {
        this.loading = false
        if (rt.status === '200') {
          this.$message.success(this.$t('hintText.operateSuccessfully'))
          this.getData()
          this.organieationShow = false
        }
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
      left: 10px;
    }
    .td {
      text-align: left;
    }
  }
}
</style>
