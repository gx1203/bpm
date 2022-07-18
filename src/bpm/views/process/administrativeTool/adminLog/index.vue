<template>
  <el-card shadow="never" v-loading="loading" class="card-reset">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      :headerCellStyle="{background: '#E1EAFD !important'}"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange">
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap">
              <quick-query style="" :isDate="false" ref="quick"
                :placeholder="$t('operator')+'、'+$t('module')+'、'+$t('operationalContext')" @quickSearch="quickSearch" />
            </div>
            <div class="btn-wrap">
              <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{$t('advancedQuery')}}
                <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
              </el-button>
              <el-button type="primary" @click="getData">
                {{$t('refresh')}}

              </el-button>
            </div>
          </div>
          <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm" label-width="120px"
            size="mini" v-if="isPowerSearch">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('operator')">
                  <el-input type="text" v-model="searchForm.user_name"></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item :label="$t('date')">
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
              </el-col> -->
              <!-- <el-col :span="8">
                <el-form-item label="分类：">
                  <el-select v-model="searchForm.classification" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item :label="$t('state')">
                  <!-- <el-input type="text" v-model="searchForm.status"></el-input> -->
                  <el-select v-model="searchForm.status">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('module')">
                  <el-input type="text" v-model="searchForm.module"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('operationalContext')">
                  <el-input type="text" v-model="searchForm.description"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="search">{{$t('query')}}</el-button>
                <el-button type="primary" @click="reset">{{$t('reset')}}</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
       <!-- 操作人 -->
      <template #userName="{ row }">
        <span class="link" @click="toFlow(row)">{{row.userName || row.userid}}</span>
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <div>{{ row.status }}</div>
      </template>
      <!-- 操作时间 -->
      <template #occurTime="{ row }">
        <div>{{row.occurTime | formatDateTime}}</div>
      </template>
      <!-- 模块 -->
      <template #module="{ row }">
        <div>{{row.module}}</div>
      </template>
      <!-- 操作内容 -->
      <template #description="{ row }">
        <span class="link" @click="toFlow(row)">{{row.description}}</span>
      </template>
    </bas-table>
    <!-- <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="searchType === 'power' ? getData() : quickQueryData()" :total="content.total"></el-pagination> -->
    <AdminLogDialog v-model="dialogVisible" @closeDiaLog="closeFun" :title="linkTitle" :item="logDetail">
    </AdminLogDialog>
  </el-card>
</template>
<script>
import { getAdminslogList, quickAdminsLogList, getAdminLogItem } from '@/bpm/api/process/administrativeTool/adminLog.js'
import AdminLogDialog from './adminLogDialog.vue'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  components: {
    QuickQuery,
    AdminLogDialog
  },
  mixins: [SearchListMixin],
  data () {
    return {
      options: [
        { value: '0', label: '成功' },
        { value: '1', label: '失败' }
      ],
      dialogVisible: false,
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
      linkTitle: '日志详情',
      logDetail: {},
      headers: [
        {
          key: 'userName',
          name: this.$t('operator'),
          span: 3
        },
        {
          key: 'status',
          name: this.$t('state'),
          span: 3
        },
        {
          key: 'module',
          name: this.$t('module'),
          span: 4
        },
        {
          key: 'module',
          name: this.$t('operationTime'),
          span: 4
        },
        {
          key: 'description',
          name: this.$t('operationalContext'),
          span: 10
        }
      ],
      content: {
        list: [{}]
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      checkAll: '',
      showDialog: false,
      // 表头字段
      headerList: [
        {
          label: this.$t('operator'), // 操作人
          prop: 'userName',
          slotName: 'userName',
          sortable: true
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status',
          sortable: true
        },
        {
          label: this.$t('operationTime'), // 操作时间
          prop: 'occurTime',
          slotName: 'occurTime',
          sortable: false
        },
        {
          label: this.$t('module'), // 模块
          prop: 'module',
          slotName: 'module',
          sortable: true
        },
        {
          label: this.$t('operationalContext'), // 操作内容
          prop: 'description',
          slotName: 'description',
          sortable: true
        }
      ]
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    closeFun () {
      this.dialogVisible = false;
    },
    toFlow (item) {
      console.log(item)
      getAdminLogItem(item.id)
        .then(rt => {
          if (rt.status === '200') {
            this.logDetail = rt.data
            this.dialogVisible = true
            console.log(this.logDetail)
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 快速获取数据
    quickQueryData () {
      this.loading = true
      quickAdminsLogList({
        logic: 'or',
        orderby: 'occurTime',
        sort: 'desc',
        filters: [
          { key: 'user_name', opt: 'LIKE', type: 'S', value: this.quickData.searchData },
          { key: 'module', opt: 'LIKE', type: 'S', value: this.quickData.searchData },
          { key: 'description', opt: 'LIKE', type: 'S', value: this.quickData.searchData }
        ],
        ...this.sort,
        ...this.page
      }).then(rt => {
        rt.data.list.forEach(element => {
          element.status = element.status === '0' ? '成功' : '失败'
        })
        this.content = rt.data
        this.page.total = rt.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getData () {
      this.loading = true
      getAdminslogList({
        logic: 'and',
        orderby: 'occurTime',
        sort: 'desc',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          if (rt.status === '200') {
            rt.data.list.forEach(item => {
              item.status = item.status === '0' ? '成功' : '失败'
              item.checked = false
            })
            this.content = rt.data
            this.page.total = rt.data.total
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
    left: 10px;
    top: 10px;
  }
}
.w100 {
  width: 100%;
}
</style>
