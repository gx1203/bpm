<template>
  <el-card shadow="never" v-loading="loading" class="card-reset">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      :headerCellStyle="{ background: '#E1EAFD !important' }"
      @currentChange="currentChange"
    >
      <!-- 搜索和高级搜索 -->
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <!-- <div class="search-wrap">
              <quick-query
                style=""
                :isDate="false"
                ref="quick"
                :placeholder="
                  $t('createUser') +
                    '、' +
                    $t('materialNo') +
                    '、' +
                    $t('materialName') +
                    '、' +
                    $t('lendNo') +
                    '、' +
                    $t('statusOne')
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
              </el-button>
              <el-button type="primary" @click="getData">
                {{ $t('refresh') }}
              </el-button> -->
            </div>
          </div>
          <!--  v-if="isPowerSearch" -->
          <!--  搜索框 -->
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
                    :disabled="createUserDisabled ? true : false"
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
            <!--    查询重置按钮 -->
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
      <!-- 单据编号 -->
      <template #lendNo="{ row }">
        <div>{{ row.lendNo }}</div>
      </template>
      <!-- 工厂编码 -->
      <template #factoryNo="{ row }">
        <div>{{ row.factoryNo }}</div>
      </template>
      <!-- 外借物资类型 -->
      <template #lendMaterialType="{ row }">
        <div>{{ row.lendMaterialType }}</div>
      </template>
      <!-- 源单号 -->
      <template #originNo="{ row }">
        <div>{{ row.originNo }}</div>
      </template>
      <!-- 源单类型 -->
      <template #originType="{ row }">
        <div>{{ row.originType }}</div>
      </template>
      <!-- 车牌号 -->
      <template #plateNumber="{ row }">
        <div>{{ row.plateNumber }}</div>
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
      <!-- 审核人 -->
      <template #examineUser="{ row }">
        <div>{{ row.examineUser }}</div>
      </template>
      <!-- 审核单位 -->
      <template #examineCorporation="{ row }">
        <div>{{ row.examineCorporation }}</div>
      </template>
      <!-- 审核时间 -->
      <template #examineDate="{ row }">
        <div>{{ row.examineDate }}</div>
      </template>
      <!-- 预计归还时间 -->
      <template #prepaymentTime="{ row }">
        <div>{{ row.prepaymentTime }}</div>
      </template>
      <!-- 延期时间 -->
      <template #delayTime="{ row }">
        <div>{{ row.delayTime }}</div> </template
      ><!-- 延期原因 -->
      <template #delayReason="{ row }">
        <div>{{ row.delayReason }}</div>
      </template>
      <!-- 延期备注 -->
      <template #delayComments="{ row }">
        <div>{{ row.delayComments }}</div>
      </template>
      <!-- 单据状态 -->
      <template #statusOne="{ row }">
        <div>{{ row.statusOne }}</div>
      </template>
      <!-- 物料编码 -->
      <template #materialNo="{ row }">
        <div>{{ row.materialNo }}</div>
      </template>
      <!-- 编码名称 -->
      <template #materialName="{ row }">
        <div>{{ row.materialName }}</div>
      </template>
      <!-- 物料单位 -->
      <template #units="{ row }">
        <div>{{ row.units }}</div>
      </template>
      <!-- 数量 -->
      <template #qty="{ row }">
        <div>{{ row.qty }}</div>
      </template>
      <!-- 出门数量 -->
      <template #permitQty="{ row }">
        <div>{{ row.permitQty }}</div>
      </template>
      <!-- 操作人 -->
      <template #operateUser="{ row }">
        <div>{{ row.operateUser }}</div>
      </template>
      <!-- 操作时间 -->
      <template #operateDate="{ row }">
        <div>{{ row.operateDate }}</div>
      </template>
      <!-- 备注 -->
      <template #comment="{ row }">
        <div>{{ row.comment }}</div>
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
    </bas-table>
  </el-card>
</template>
<script>
import { postloaddragform } from '@/bpm/api/dataOverview/borrowThing.js'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  components: {
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      //字典项
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
      createUserDisabled: true,
      searchForm: {
        createUser: '',
        materialNo: '',
        materialName: '',
        lendNo: '',
        statusOne: ''
      },
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
          label: this.$t('lendNo'), // 单据编号
          prop: 'lendNo',
          slotName: 'lendNo',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('factoryNo'), // 工厂编号
          prop: 'factoryNo',
          slotName: 'factoryNo',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('lendMaterialType'), // 外借物资类型
          prop: 'lendMaterialType',
          slotName: 'lendMaterialType',
          sortable: false,
          width: 100
        },
        {
          label: this.$t('originNo'), // 源单号
          prop: 'originNo',
          slotName: 'originNo',
          sortable: true,
          width: 60
        },
        {
          label: this.$t('originType'), // 源单类型
          prop: 'originType',
          slotName: 'originType',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('plateNumber'), // 车牌号
          prop: 'plateNumber',
          slotName: 'plateNumber',
          sortable: true,
          width: 60
        },
        {
          label: this.$t('outTime'), // 出门时间
          prop: 'outTime',
          slotName: 'outTime',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('corporation'), // 出门单位
          prop: 'corporation',
          slotName: 'corporation',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('outReason'), // 出门原因
          prop: 'outReason',
          slotName: 'outReason',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('examineUser'), // 审核人
          prop: 'examineUser',
          slotName: 'examineUser',
          sortable: true,
          width: 60
        },
        {
          label: this.$t('examineCorporation'), // 审核单位
          prop: 'examineCorporation',
          slotName: 'examineCorporation',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('examineDate'), // 审核时间
          prop: 'examineDate',
          slotName: 'examineDate',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('prepaymentTime'), // 预计归还时间
          prop: 'prepaymentTime',
          slotName: 'prepaymentTime',
          sortable: true,
          width: 100
        },
        {
          label: this.$t('delayTime'), // 延期时间
          prop: 'delayTime',
          slotName: 'delayTime',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('delayReason'), // 延期原因
          prop: 'delayReason',
          slotName: 'delayReason',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('delayComments'), // 延期备注
          prop: 'delayComments',
          slotName: 'delayComments',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('statusOne'), // 单据状态
          prop: 'statusOne',
          slotName: 'statusOne',
          sortable: false,
          width: 70
        },
        {
          label: this.$t('materialNo'), // 物料编码
          prop: 'materialNo',
          slotName: 'materialNo',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('materialName'), // 物料名称
          prop: 'materialName',
          slotName: 'materialName',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('units'), //物料单位
          prop: 'units',
          slotName: 'units',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('qty'), // 数量
          prop: 'qty',
          slotName: 'qty',
          sortable: true
        },
        {
          label: this.$t('permitQty'), // 出门数量
          prop: 'permitQty',
          slotName: 'permitQty',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('operateUser'), // 操作人
          prop: 'operateUser',
          slotName: 'operateUser',
          sortable: true,
          width: 60
        },
        {
          label: this.$t('operateDate'), // 操作时间
          prop: 'operateDate',
          slotName: 'operateDate',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('comment'), // 备注
          prop: 'comment',
          slotName: 'comment',
          sortable: true
        },
        {
          label: this.$t('createUser'), // 创建人
          prop: 'createUser',
          slotName: 'createUser',
          sortable: true,
          width: 60
        },
        {
          label: this.$t('createDate'), // 创建时间
          prop: 'createDate',
          slotName: 'createDate',
          sortable: true,
          width: 70
        },
        {
          label: this.$t('updateUser'), // 修改人
          prop: 'updateUser',
          slotName: 'updateUser',
          sortable: true,
          width: 60
        },
        {
          label: this.$t('updateDate'), // 修改时间
          prop: 'updateDate',
          slotName: 'updateDate',
          sortable: true,
          width: 70
        }
      ]
    }
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.searchForm.createUser = userInfo.id
    this.$http({
      url: '/userModel/get/' + userInfo.empuid,
      method: 'GET',
      data: {}
    }).then(rt => {
      for (var i = 0; i < rt.data.checkedRoleIds.length; i++) {
        if (rt.data.checkedRoleIds[i] == '947682181210460160') {
          this.createUserDisabled = false
          this.searchForm.createUser = ''
          return
        }
      }
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

    // 快速获取数据
    quickQueryData() {
      this.loading = true
      postloaddragform({
        ...this.searchForm,
        ...this.page
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

    getData() {
      this.loading = true
      postloaddragform({
        ...this.searchForm,
        ...this.page
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
    /*    quickSearch() {
      console.log(this.$refs.quick.quickSearch.searchKey)
    }, */
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
      this.searchForm = {
        createUser: '',
        materialNo: '',
        materialName: '',
        lendNo: '',
        statusOne: ''
      }
      this.getData()
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
