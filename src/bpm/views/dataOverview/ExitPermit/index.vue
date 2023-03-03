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
            <!-- <div class="search-wrap">
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
            </div> -->
            <div class="btn-wrap">
              <!-- <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{ $t('advancedQuery') }}
                <i
                  :class="
                    isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                  "
                />
              </el-button> -->
              <!-- <el-button type="primary" @click="getData">
                {{ $t('refresh') }}
              </el-button> -->
            </div>
          </div>
          <el-form
            class="power-search"
            :model="searchForm"
            @keyup.enter.native="search"
            ref="searchForm"
            label-width="120px"
            size="mini"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('createUser')">
                  <el-input
                    type="text"
                    v-model="searchForm.createUser"
                    :disabled="createUserDisabled"
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
      <!-- <template #permitNo="{ row }">
        <span class="link" @click="toFlow(row)">{{ row.permitNo }}</span>
      </template> -->
      <!-- 出门证编号 -->
      <template #permitNo="{ row }">
        <div>{{ row.permitNo }}</div>
      </template>
      <!-- 工厂编号 -->
      <template #factoryNo="{ row }">
        <div>{{ row.factoryNo }}</div>
      </template>
      <!-- 车牌号 -->
      <template #plateNumber="{ row }">
        <div>{{ row.plateNumber }}</div>
      </template>
      <!-- 单据类型 -->
      <template #orderType="{ row }">
        <div>{{ row.orderType }}</div>
      </template>
      <!-- 源单号 -->
      <template #originNo="{ row }">
        <div>{{ row.originNo }}</div>
      </template>
      <!-- 源单类型 -->
      <template #originType="{ row }">
        <div>{{ row.originType }}</div>
      </template>
      <!-- 出门时间 -->
      <template #outTime="{ row }">
        <div>{{ row.outTime }}</div>
      </template>
      <!-- 出门单位 -->
      <template #corporation="{ row }">
        <div>{{ row.corporation }}</div>
      </template>
      <!-- 出门原因 -->
      <template #outReason="{ row }">
        <div>{{ row.outReason }}</div>
      </template>
      <!-- 单据状态 -->
      <template #status_dictText="{ row }">
        <div>{{ row.status_dictText }}</div>
      </template>
      <!-- 经办人 -->
      <template #chargeUser="{ row }">
        <div>{{ row.chargeUser }}</div>
      </template>
      <!-- 审核人 -->
      <template #examineUser="{ row }">
        <div>{{ row.examineUser }}</div>
      </template>
      <!-- 审核时间 -->
      <template #examineDate="{ row }">
        <div>{{ row.examineDate }}</div>
      </template>
      <!-- 审核单位 -->
      <template #examineCorporation="{ row }">
        <div>{{ row.examineCorporation }}</div>
      </template>
      <!-- 出门操作人 -->
      <template #operator="{ row }">
        <div>{{ row.operator }}</div>
      </template>
      <!-- 实际出门时间 -->
      <template #actualOutTime="{ row }">
        <div>{{ row.actualOutTime }}</div>
      </template>
      <!-- 驳回原因 -->
      <template #rejectReason="{ row }">
        <div>{{ row.rejectReason }}</div>
      </template>
      <!-- 驳回备注 -->
      <template #rejectRemarks="{ row }">
        <div>{{ row.rejectRemarks }}</div>
      </template>
      <!-- 物料单位 -->
      <template #units="{ row }">
        <div>{{ row.units }}</div>
      </template>
      <!-- 数量 -->
      <template #qty="{ row }">
        <div>{{ row.qty }}</div>
      </template>
      <!-- 出门单位 -->
      <template #permitUnits="{ row }">
        <div>{{ row.permitUnits }}</div>
      </template>
      <!-- 出门数量 -->
      <template #permitQty="{ row }">
        <div>{{ row.permitQty }}</div>
      </template>
      <!-- 出门原因 -->
      <template #validity="{ row }">
        <div>{{ row.validity }}</div>
      </template>
      <!-- 创建人 -->
      <template #createUser="{ row }">
        <div>{{ row.createUser }}</div>
      </template>
      <!-- 创建时间 -->
      <template #createDate="{ row }">
        <div>{{ row.createDate }}</div>
      </template>
      <!-- 修改人 -->
      <template #updateUser="{ row }">
        <div>{{ row.updateUser }}</div>
      </template>
      <!-- 修改时间 -->
      <template #updateDate="{ row }">
        <div>{{ row.updateDate }}</div>
      </template>

      <!-- 操作时间 -->
      <!-- <template #occurTime="{ row }">
        <div>{{ row.occurTime | formatDateTime }}</div>
      </template> -->
      <!-- 操作内容 -->
      <!-- <template #description="{ row }">
        <span class="link" @click="toFlow(row)">{{ row.description }}</span>
      </template> -->
    </bas-table>
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
      createUserDisabled: 'false',
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
      searchForm: {
        createUser: '',
        materialNo: '',
        materialName: '',
        lendNo: '',
        statusOne: ''
      },
      editItem: {},
      logDetail: {},
      content: {
        list: [{}]
      },
      page: {
        pageSize: 10,
        pageNo: 1,
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
          sortable: true,
          width: 100
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
          sortable: true,
          width: 150
        },
        {
          label: this.$t('outReason'), // 出门原因
          prop: 'outReason',
          slotName: 'outReason',
          sortable: true
        },
        {
          label: this.$t('status'), // 单据状态
          prop: 'status_dictText',
          slotName: 'status_dictText',
          sortable: true,
          width: 100
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
        }
      ]
    }
  },

  created() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.$http({
      url: '/userModel/get/' + userInfo.empuid,
      method: 'GET',
      data: {}
    }).then(rt => {
      rt.data.checkedRoleIds.forEach(val => {
        if (val == '947682181210460160') {
          //是LES报表管理员则可以输入
          this.createUserDisabled = 'false'
        } else {
          //不是LES报表管理员不可编辑
          this.createUserDisabled = 'true'
          this.searchForm.createUser = userInfo.id
        }
      })
    })
  },

  mounted() {
    this.getData()
  },

  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNo = newPageNum
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
      this.getData()
      return false
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
        ...this.page,
        ...this.searchForm
      })
        .then(rt => {
          this.content.list = rt.data[0].result.records
          this.page.total = Number(rt.data[0].result.total)
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
