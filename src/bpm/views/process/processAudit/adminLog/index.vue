<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :isDate="false" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
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
      @keyup.enter.native="search"
      ref="searchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="操作人：">
            <el-input clearable type="text" v-model="searchForm.people"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作时间：">
            <el-date-picker
              v-model="searchForm.time"
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
          <el-form-item label="分类：">
            <el-select clearable v-model="searchForm.classification" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="操作项：">
            <el-input clearable type="text" v-model="searchForm.items"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作内容：">
            <el-input clearable type="text" v-model="searchForm.contents"></el-input>
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
      <div class="table-header margin-t10">
        <el-checkbox style="left:10px;" v-model="checkAll" class="all-check" />
        <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
      </div>
      <div v-if="content.list && content.list.length!==0">

      <div class="tr" v-for="(item, index) in content.list" :key="index">
        <div class="tr-title" style="padding:5px 10px;">
          <el-checkbox v-model="item.checked" style="margin-right: 10px" />
          <span>操作时间：{{item.time | formatDateTime}}</span>
          <!-- <span style="margin-left: 60px">结束时间：{{item.createDate | formatDateTime}}</span>
          <span style="margin-left: 60px">收回时间：{{item.createDate | formatDateTime}}</span>-->
          <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
        </div>
        <el-row class="tr-body" type="flex" align="middle">
          <el-col class="td" :span="headers[0].span">{{item.people}}</el-col>
          <el-col class="td" :span="headers[1].span">{{item.classification}}</el-col>
          <el-col class="td" :span="headers[2].span">{{item.items}}</el-col>
          <el-col class="td" :span="headers[3].span">{{item.contents}}</el-col>
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
  </el-card>
</template>
<script>
import { getAdminslogList, quickAdminsLogList } from '@/bpm/api/process/processAudit/admin_log.js'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  name:'adminLog',
  components: {
    QuickQuery
  },
  mixins: [SearchListMixin],
  data () {
    return {
      loading: false,
      typeList: [
        {
          value: '流程处理',
          label: '流程处理'
        },
        {
          value: '外出授权',
          label: '外出授权'
        }
      ],
      isPowerSearch: false,
      searchForm: {},
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'people',
          name: '操作人',
          span: 3
        },
        {
          key: 'classification',
          name: '分类',
          span: 3
        },
        {
          key: 'items',
          name: '操作项',
          span: 6
        },
        {
          key: 'contents',
          name: '操作内容',
          span: 12
        }
      ],
      content: {
        list: [{}]
      },
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 快速获取数据
    quickQueryData () {
      this.loading = true
      quickAdminsLogList({
        logic: 'or',
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
    getData () {
      this.loading = true
      getAdminslogList({
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
        if (key === 'time') {
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
