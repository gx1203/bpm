<template>
  <div id="processChangeRecords">
    <el-row>
      <el-col :span="8">
        <el-input clearable placeholder="请输入内容" class="search_component" v-model="keyWords" >
          <el-button type="primary" slot="append" @click="singleSearch"> {{$t('search')}}</el-button>
        </el-input>
        <el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">
          高级查询
          <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
        </el-button>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <el-form
        v-show="isHighSearch"
        class="search_options_wrap"
        :model="searchForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('processName2')">
              <el-input clearable v-model="searchForm.classify" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input clearable v-model="searchForm.operatorname" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工号">
              <el-input clearable v-model="searchForm.operator" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作类型">
              <el-select clearable v-model="searchForm.status" >
                <el-option label="新建审批中" value="1"></el-option>
                <el-option label="新建审批通过" value="2"></el-option>
                <el-option label="新建审批失败" value="3"></el-option>
                <el-option label="修改审批中" value="4"></el-option>
                <el-option label="修改审批通过" value="5"></el-option>
                <el-option label="修改审批失败" value="6"></el-option>
                <el-option label="作废审批中" value="7"></el-option>
                <el-option label="作废审批通过" value="8"></el-option>
                <el-option label="作废审批失败" value="9"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                clearable
                value-format="yyyy-MM-dd"
                v-model="searchForm.operatetime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search_buttons_wrap">
          <el-button type="primary" @click="highSearch">搜索</el-button>
          <el-button type="primary" @click="resetSearch">重置</el-button>
        </div>
      </el-form>
    </el-collapse-transition>
    <el-table :data="recordsList" class="main_tab">
      <el-table-column :label="$t('number')" type="index"></el-table-column>
      <el-table-column prop="operatetime" label="操作时间"></el-table-column>
      <el-table-column prop="status" label="操作类型">
        <template slot-scope="scope">
          <span>{{ scope.row.status | filterType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="classify" :label="$t('processName2')"></el-table-column>
      <el-table-column prop="operator" label="操作人工号"></el-table-column>
      <el-table-column prop="operatorname" label="操作人姓名"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.pageNum"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
    ></el-pagination>
  </div>
</template>

<script>
import { getRecordsList } from '@/bpa/api/settings/processChangeRecords'
import { getFormateDate } from '@/bpa/utils/common.js'
import paginations from '@/bpa/mixins/pagination_mixin'
export default {
  data() {
    return {
      recordsList: [],
      isHighSearch: false,
      keyWords: '',
      searchForm: {},
      form: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  mixins: [paginations],
  computed: {
    username() {
      let localData = JSON.parse(localStorage.getItem('portalCurrentUserInfo'))
      return localData.name
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getRecordsList(this.username, {
        attr: {},
        filters: [
          { key: 'status', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'operator', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'classify', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'operatetime', opt: 'BETWEEN', type: 'D', value: '' },
          { key: 'operatorname', opt: 'LIKE', type: 'S', value: this.keyWords }
        ],
        logic: 'or',
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc'
      }).then(res => {
        // this.recordsList = res.list
        let recordsList = res.list
        recordsList.map(item => {
          item.operatetime = getFormateDate(
            new Date(item.operatetime),
            'yyyy-MM-dd'
          )
        })
        this.recordsList = recordsList
        this.pages.total = res.total
      })
    },
    highSearch() {
      let obj = {
        attr: {},
        orderby: 'createon',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc',
        logic: 'and',
        filters: [
          {
            key: 'status',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.status
          },
          {
            key: 'operator',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.operator
          },
          {
            key: 'classify',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.classify
          },
          {
            key: 'operatetime',
            opt: 'BETWEEN',
            type: 'D',
            value: !!this.searchForm.operatetime
              ? this.searchForm.operatetime[0] +
                '~' +
                this.searchForm.operatetime[1]
              : ''
          },
          {
            key: 'operatorname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.operatorname
          }
        ]
      }
      getRecordsList(this.username, obj).then(res => {
        let recordsList = res.list
        recordsList.map(item => {
          item.operatetime = getFormateDate(
            new Date(item.operatetime),
            'yyyy-MM-dd'
          )
        })
        this.recordsList = res.list
        this.pages.total = res.total
      })
    },
    resetSearch() {
      this.searchForm = {}
      this.pages.pageNum = 1
      this.getList()
    }
  }
}
</script>
