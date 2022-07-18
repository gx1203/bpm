<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query placeholder='流程中文名称、申请单号、错误消息' :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'"/>
        </el-button>
        <el-button type="primary" @click="getData">
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
          <el-form-item :label="$t('processChineseName') + '：'">
            <el-input clearable type="text" v-model="searchForm.processnamecn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicationNumber') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqno"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障时间：">
              <el-date-picker
                v-model="searchForm.creationdate"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00','23:59:59']"
                :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')">
              </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="8">
          <el-form-item label="错误消息：">
            <el-input clearable type="text" v-model="searchForm.message"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="powerSearch">{{ $t('query') }}</el-button>
          <el-button type="primary" @click="reset">{{ $t('reset') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div v-loading="loading">

    <div class="table-header margin-t10">
      <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort"/>
    </div>
        <div v-if="content.list && content.list.length!==0">

    <div class="tr" v-for="(item, index) in content.list" :key="index">
      <div class="tr-title">
        <span>故障时间：{{item.creationdate | formatDateTime}}</span>
      </div>
      <el-row class="tr-body" type="flex" align="middle">
        <el-col class="td" :span="headers[0].span">{{item.processnamecn}}</el-col>
        <el-col class="td" :span="headers[1].span">{{item.reqno}}</el-col>
        <el-col class="td" :span="headers[2].span">{{item.message}}</el-col>
        <el-col style="text-align: center" :span="headers[3].span">
        </el-col>
      </el-row>
    </div>
    </div>
    <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

    </div>
    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize" :current-page.sync="page.pageNum"
      background @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"></el-pagination>
  </el-card>
</template>

<script>
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { getProcessWiFault } from '@/bpm/api/monitor/index.js'
export default {
  mixins: [SearchListMixin],
  components: {
    QuickQuery
  },
  data () {
    return {
      loading: false,
      isPowerSearch: false,
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'processnamecn',
          name: '流程中文名称',
          span: 8
        },
        {
          key: 'reqno',
          name: '申请单号',
          span: 4
        },
        {
          key: 'message',
          name: '错误消息',
          span: 8
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      content: {
        list: [{

        }]
      },
      sort: {},
      filters: [],
      page: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    quickQueryData () {
      this.loading = true
      getProcessWiFault({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page,
        ...this.quickData,
        queryFilter: ['processnamecn', 'message', 'reqno']
      }).then(rt => {
        this.content = rt.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getData (data) {
      this.loading = true
      getProcessWiFault({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      }).then(rt => {
        this.content = rt.data
        this.loading = false
      }).catch(() => {
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
        if (key === 'createDate') {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          filter.value = this.searchForm[key] ? this.searchForm[key].join('~') : ''
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    reset () {
      this.searchForm = {}
      this.search()
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
