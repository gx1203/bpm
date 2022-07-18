<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <el-select clearable v-model="dateRange">
          <el-option
            v-for="item in dateRangeList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable v-model="searchKey">
          <span slot="append"><i class="iconfont icon-sousuo2"></i></span>
        </el-input>
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="addList('添加审批类型')">
          {{ $t('add') }}
          <!--<i class="el-icon-circle-plus-outline"/>-->
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('batchDelete') }}
          <!--<i class="el-icon-circle-close"/>-->
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'"/>
        </el-button>
        <el-button type="primary" @click="refreshData">
           {{ $t('refresh') }}
          <!--<i class="el-icon-refresh"/>-->
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
      v-if="isPowerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('authorityName') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="URL：">
            <el-input clearable type="text" v-model="searchForm.subject"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('sort') + '：'">
            <el-input clearable type="number" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"  v-model="searchForm.subject"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('permissionCode') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="outComes：">
            <el-input clearable type="text" v-model="searchForm.subject"></el-input>
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
    <div class="table-header margin-t10">
      <el-checkbox v-model="checkAll" class="all-check"/>
      <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort"/>
    </div>

      <div v-if="content.list && content.list.length!==0">

    <div class="tr" v-for="(item, index) in content.list" :key="index">
      <div class="tr-title">
        <el-checkbox v-model="item.checked" style="margin-right: 10px" />
        <span>{{ $t('applicationDate') }}：{{item.createDate | formatDateTime}}</span>
        <span style="margin-left: 60px">{{ $t('applicationNumber') }}：{{item.reqNo}}</span>
      </div>
      <el-row class="tr-body" type="flex" align="middle">
        <el-col class="td" :span="headers[0].span">{{item.drafter}}</el-col>
        <el-col class="td" :span="headers[1].span">{{item.passReaderUserName}}</el-col>
        <el-col class="td" :span="headers[2].span">{{item.processCnname}}</el-col>
        <el-col class="td" :span="headers[3].span">{{item.passReadTime}}</el-col>
        <el-col class="td" :span="headers[4].span">{{item.processCnname}}</el-col>
        <el-col style="text-align: center" :span="headers[5].span">
          <el-button type="text" icon="el-icon-edit" @click="addList('编辑审批类型',item)"></el-button>
          <el-button type="text" icon="el-icon-delete"></el-button>
        </el-col>
      </el-row>
    </div>
    </div>
    <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

    <el-pagination
      style="margin-top: 15px"

      :page-size="page.pageSize" :current-page.sync="page.pageNum"
      background @current-change="getData"
      :total="content.total"></el-pagination>
    <add-type-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess"/>
  </el-card>
</template>

<script>
import AddTypeDialog from './AddTypeDialog'
export default {
  components: {
    AddTypeDialog
  },
  data() {
    return {
      dateRange: '',
      dateRangeList: [
        {
          name: '近一个月',
          value: '1'
        },
        {
          name: '近二个月',
          value: '2'
        },
        {
          name: '近三个月',
          value: '3'
        }
      ],
      searchKey: '',
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      reportList: [],
      num: '',
      value: '',
      checked: '',
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'drafter',
          name: '权限名称',
          span: 4
        },
        {
          key: 'passReaderUserName',
          name: 'URL',
          span: 7
        },
        {
          key: 'passReadTime',
          name: this.$t('sort'),
          span: 2
        },
        {
          key: 'processCnname',
          name: '权限代码',
          span: 4
        },
        {
          name: 'outComes',
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      content: {
        list: [{

        }]
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: ''
    }
  },
  methods:{
    refreshData() {

    },
    saveSuccess(data) {
      if (data) {
        // this.getData()
      }
    },
    addList(item,data) {
      if (item === '添加审批类型') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {}
      } else if (item === '编辑审批类型') {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = data
      }
    },
    getData() {},
    handleSort(val) {
      this.sort = val
      // this.getData()
    },
    search() {},
    reset() {}
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
    left: 10px;
  }
  }
</style>
