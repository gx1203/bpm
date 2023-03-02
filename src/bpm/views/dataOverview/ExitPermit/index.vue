<template>
  <el-card shadow="never" v-loading="loading" class="card-reset">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      :headerCellStyle="{ background: '#E1EAFD !important' }"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange"
    >
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap">
              <quick-query
                style=""
                :isDate="false"
                ref="quick"
                :placeholder="
                  $t('operator') +
                    '、' +
                    $t('module') +
                    '、' +
                    $t('operationalContext')
                "
                @quickSearch="quickSearch"
              />
            </div>
            <div class="btn-wrap">
              <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{ $t('advancedQuery') }}
                <i
                  :class="
                    isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                  "
                />
              </el-button>
              <el-button type="primary" @click="getData">
                {{ $t('refresh') }}
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
                <el-form-item :label="$t('creator')">
                  <el-input
                    type="text"
                    v-model="searchForm.user_name"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item :label="$t('materialNo')">
                  <el-input
                    type="text"
                    v-model="searchForm.materialNo"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('materialName')">
                  <el-input
                    type="text"
                    v-model="searchForm.materialName"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('lendNo')">
                  <el-input type="text" v-model="searchForm.lendNo"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('statusOne')">
                  <el-select v-model="searchForm.statusOne">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="search">{{
                  $t('query')
                }}</el-button>
                <el-button type="primary" @click="reset">{{
                  $t('reset')
                }}</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
      <!-- 操作人 -->
      <template #userName="{ row }">
        <span class="link" @click="toFlow(row)">{{
          row.userName || row.userid
        }}</span>
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <div>{{ row.status }}</div>
      </template>
      <!-- 操作时间 -->
      <template #occurTime="{ row }">
        <div>{{ row.occurTime | formatDateTime }}</div>
      </template>
      <!-- 模块 -->
      <template #module="{ row }">
        <div>{{ row.module }}</div>
      </template>
      <!-- 操作内容 -->
      <template #description="{ row }">
        <span class="link" @click="toFlow(row)">{{ row.description }}</span>
      </template>
    </bas-table>
    <!-- <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="searchType === 'power' ? getData() : quickQueryData()" :total="content.total"></el-pagination> -->
  </el-card>
</template>
<script>
import { postLendMaterialDetails } from '@/bpm/api/dataOverview/exitPermit.js'

import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  components: {
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      options: [
        { value: '1', label: '制单' },
        { value: '2', label: '已确认' },
        { value: '3', label: '已驳回' },
        { value: '4', label: '已审核' },
        { value: '5', label: '已出门' },
        { value: '6', label: '已延期' },
        { value: '7', label: '已归还' },
        { value: '8', label: '超期归还' },
        { value: '9', label: '作废' }
      ],
      dialogVisible: false,
      loading: false,
      isPowerSearch: false,
      searchForm: {},
      editItem: {},
      logDetail: {},
      content: {
        list: [{}]
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 表头字段
      headerList: [
        {
          label: this.$t('permitNo'), // 出门证编号
          prop: 'permitNo',
          slotName: 'permitNo',
          sortable: true
        },
        {
          label: this.$t('factoryNo'), // 工厂编号
          prop: 'factoryNo',
          slotName: 'factoryNo',
          sortable: true
        },
        {
          label: this.$t('plateNumber'), // 车牌号
          prop: 'plateNumber',
          slotName: 'plateNumber',
          sortable: false
        },
        {
          label: this.$t('orderType'), // 单据类型
          prop: 'orderType',
          slotName: 'orderType',
          sortable: true
        },
        {
          label: this.$t('originNo'), // 源单号
          prop: 'originNo',
          slotName: 'originNo',
          sortable: true
        },
        {
          label: this.$t('originType'), // 源单类型
          prop: 'originType',
          slotName: 'originType',
          sortable: true
        },
        {
          label: this.$t('outTime'), // 出门时间
          prop: 'outTime',
          slotName: 'outTime',
          sortable: true
        },
        {
          label: this.$t('corporation'), // 出门单位
          prop: 'corporation',
          slotName: 'corporation',
          sortable: true
        },
        {
          label: this.$t('outReason'), // 出门原因
          prop: 'outReason',
          slotName: 'outReason',
          sortable: true
        },
        {
          label: this.$t('status'), // 单据状态
          prop: 'status',
          slotName: 'status',
          sortable: true
        },
        {
          label: this.$t('chargeUser'), // 经办人
          prop: 'chargeUser',
          slotName: 'chargeUser',
          sortable: true
        },
        {
          label: this.$t('examineUser'), // 审核人
          prop: 'examineUser',
          slotName: 'examineUser',
          sortable: true
        },
        {
          label: this.$t('examineDate'), // 审核时间
          prop: 'examineDate',
          slotName: 'examineDate',
          sortable: true
        },
        {
          label: this.$t('examineCorporation'), // 审核单位
          prop: 'examineCorporation',
          slotName: 'examineCorporation',
          sortable: true
        },
        {
          label: this.$t('operator'), // 出门操作人
          prop: 'operator',
          slotName: 'operator',
          sortable: true
        },
        {
          label: this.$t('actualOutTime'), // 实际出门时间
          prop: 'actualOutTime',
          slotName: 'actualOutTime',
          sortable: true
        },
        {
          label: this.$t('rejectReason'), // 驳回原因
          prop: 'rejectReason',
          slotName: 'rejectReason',
          sortable: true
        },
        {
          label: this.$t('rejectReason'), // 驳回原因
          prop: 'rejectReason',
          slotName: 'rejectReason',
          sortable: true
        },
        {
          label: this.$t('rejectRemarks'), // 驳回备注
          prop: 'rejectRemarks',
          slotName: 'rejectRemarks',
          sortable: true
        },
        {
          label: this.$t('units'), // 物料单位
          prop: 'units',
          slotName: 'units',
          sortable: true
        },
        {
          label: this.$t('qty'), // 数量
          prop: 'qty',
          slotName: 'qty',
          sortable: true
        },
        {
          label: this.$t('permitUnits'), // 出门单位
          prop: 'permitUnits',
          slotName: 'permitUnits',
          sortable: true
        },
        {
          label: this.$t('permitQty'), // 出门数量
          prop: 'permitQty',
          slotName: 'permitQty',
          sortable: true
        },
        {
          label: this.$t('validity'), // 有效期
          prop: 'validity',
          slotName: 'validity',
          sortable: true
        },
        {
          label: this.$t('createUser'), // 创建人
          prop: 'createUser',
          slotName: 'createUser',
          sortable: true
        },
        {
          label: this.$t('createDate'), // 创建时间
          prop: 'createDate',
          slotName: 'createDate',
          sortable: true
        },
        {
          label: this.$t('updateUser'), // 修改人
          prop: 'updateUser',
          slotName: 'updateUser',
          sortable: true
        },
        {
          label: this.$t('updateDate'), // 修改时间
          prop: 'updateDate',
          slotName: 'updateDate',
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
  mounted() {
    this.getData()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.getData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    closeFun() {
      this.dialogVisible = false
    },
    toFlow(item) {
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
    quickQueryData() {
      this.loading = true
      quickAdminsLogList({
        logic: 'or',
        orderby: 'occurTime',
        sort: 'desc',
        filters: [
          {
            key: 'user_name',
            opt: 'LIKE',
            type: 'S',
            value: this.quickData.searchData
          },
          {
            key: 'module',
            opt: 'LIKE',
            type: 'S',
            value: this.quickData.searchData
          },
          {
            key: 'description',
            opt: 'LIKE',
            type: 'S',
            value: this.quickData.searchData
          }
        ],
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(element => {
            element.status = element.status === '0' ? '成功' : '失败'
          })
          this.content = rt.data
          this.page.total = rt.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getData() {
      this.loading = true
      postLendMaterialDetails({
        // logic: 'and',
        // orderby: 'occurTime',
        // sort: 'desc',
        // filters: this.filters,
        // ...this.sort,
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
    handleSort(val) {
      this.sort = val
      this.getData()
    },
    search() {
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
          filter.value = this.searchForm[key]
            ? this.searchForm[key].join('~')
            : ''
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    reset() {
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
