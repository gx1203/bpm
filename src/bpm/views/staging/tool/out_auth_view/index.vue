<template>
  <div class="authorization-process-records">
    <el-card shadow="never" class="card-reset">
      <!-- 表格 -->
      <bas-table
        row-key="id"
        :tableList="content.list"
        :headerList="headerList"
        :pages="page"
        @currentChange="currentChange"
      >
        <!-- 搜索和高级搜索 -->
        <template #search>
          <div>
            <div class="tool-common-wrap">
              <div class="search-wrap">
                <quick-query
                  class="pull-left"
                  :placeholder="
                    $t(
                      'outAuthView.OrderNumberSubjectApplicantProcessNameStatus'
                    )
                  "
                  ref="quick"
                  @showTip="showTip"
                  @quickSearch="quickSearch"
                />
              </div>
              <div class="btn-wrap">
                <el-button
                  type="primary"
                  @click="isPowerSearch = !isPowerSearch"
                >
                  {{ $t('advancedQuery') }}
                  <i
                    :class="
                      isPowerSearch
                        ? 'el-icon-caret-top'
                        : 'el-icon-caret-bottom'
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
              @keyup.enter.native="powerSearch"
              ref="searchForm"
              label-width="120px"
              size="mini"
              v-if="isPowerSearch"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('outAuthView.SQYSQD') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.instanceId"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('outAuthView.TheProcessOf') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.processCnname"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('outAuthView.theme') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.subject"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('creator') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.drafter"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('authorizer') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.grantorUserName"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('agent') + '：'">
                    <el-input
                      clearable
                      type="text"
                      v-model="searchForm.surrogateUserName"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    :label="$t('outAuthView.ApplicationDate') + '：'"
                  >
                    <el-date-picker
                      v-model="searchForm.reqDate"
                      type="daterange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00', '23:59:59']"
                      :range-separator="$t('placeholderText.to')"
                      :start-placeholder="$t('placeholderText.startDate')"
                      :end-placeholder="$t('placeholderText.endDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :label="$t('outAuthView.dateOfTreatment') + '：'"
                  >
                    <el-date-picker
                      v-model="searchForm.assignedDate"
                      type="daterange"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00', '23:59:59']"
                      :range-separator="$t('placeholderText.to')"
                      :start-placeholder="$t('placeholderText.startDate')"
                      :end-placeholder="$t('placeholderText.endDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
          <el-form-item :label="$t('takeTheTime') + '：'">
            <el-date-picker
              v-model="searchForm.finishDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col> -->
              </el-row>
              <!-- <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('state') + '：'">
            <el-select clearable type="text" v-model="searchForm.status">
              <el-option value :label="$t('all')" />
              <el-option
                v-for="(item, index) in headers"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
              <el-row>
                <el-col :span="24" class="text-r">
                  <el-button type="primary" @click="powerSearch">{{
                    $t('query')
                  }}</el-button>
                  <el-button type="primary" @click="rest">{{
                    $t('reset')
                  }}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>

        <!-- 申请单号 -->
        <template #reqNo="{ row }">
          <div class="link" @click="toFlow(row)">
            {{ row.reqNo }}
          </div>
        </template>

        <!-- 主题 -->
        <template #subject="{ row }">
          <span style="color: red;" v-if="row.priority === 1">{{
            `[${$t('urgent')}]`
          }}</span>
          <div class="link" @click="toFlow(row)">
            {{ row.subject }}
          </div>
        </template>

        <!-- 申请时间 -->
        <template #reqDate="{ row }">
          <div>{{ row.reqDate | formatDateTime }}</div>
        </template>

        <!-- 处理日期 -->
        <template #assignedDate="{ row }">
          <div>{{ row.assignedDate | formatDateTime }}</div>
        </template>
      </bas-table>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { getOutAuthViewList } from '../../../../api/staging/tool/out_auth_view'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { checkProcessDefaultPage } from '../../../../api/flow/index'
// import ElPage from "@/components/elPage/elPage";
// import CommonHead from "@/bpm/components/commonHead/commonHead";
export default {
  mixins: [SearchListMixin],
  components: {
    QuickQuery
    // ElPage,
    // CommonHead
  },
  data() {
    return {
      //  	tableHeight:window.innerHeight - 275,
      // commonTitle:'外出授权查询',
      headers: [
        {
          key: 'subject',
          name: this.$t('outAuthView.theme'),
          span: 3
        },
        {
          key: 'drafter',
          name: this.$t('outAuthView.proposer'),
          span: 3
        },
        {
          name: this.$t('outAuthView.approver'),
          span: 3
        },
        {
          name: this.$t('outAuthView.TheExaminationAndApprovalNode'),
          span: 4
        },
        {
          name: this.$t('outAuthView.state'),
          span: 3
        }
      ],
      instanceId: '',
      instanceId: '',
      searchForm: {},
      filters: [],
      showTipValue: false,
      headerList: [
        {
          label: this.$t('outAuthView.SQYSQD'), // 创建人
          prop: 'reqNo',
          slotName: 'reqNo',
          sortable: true
        },
        {
          label: this.$t('authorizer'), // 授权人
          prop: 'grantorUserName',
          sortable: true
        },
        {
          label: this.$t('outAuthView.TheProcessOf'), // 流程名称
          prop: 'processCnname',
          sortable: true
        },
        {
          label: this.$t('outAuthView.theme'), // 主题
          prop: 'subject',
          slotName: 'subject',
          sortable: true
        },
        {
          label: this.$t('creator'), // 创建人
          prop: 'drafter',
          sortable: true
        },
        {
          label: this.$t('outAuthView.ApplicationDate'), // 申请时间
          prop: 'reqDate',
          slotName: 'reqDate',
          sortable: true
        },
        {
          label: this.$t('outAuthView.agent'), // 代理人
          prop: 'surrogateUserName',
          sortable: true
        },
        {
          label: this.$t('outAuthView.TheAgentNode'), // 代理节点
          prop: 'activityName',
          sortable: true
        },
        {
          label: this.$t('outAuthView.dateOfTreatment'), // 处理日期
          prop: 'assignedDate',
          slotName: 'assignedDate',
          sortable: true
        }
      ]
    }
  },
  mounted() {
    //默认第一次筛选申请日期倒叙
    this.getData('reqdate', 'desc')
  },
  created() {
    //	if(this.$route.path.indexOf('stagingPublic') > 0) {
    //		this.tableHeight = window.innerHeight - 215
    //	} else {
    //		this.tableHeight = window.innerHeight - 275
    //	}
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      // if (this.searchType === 'power') {
      //   this.getData()
      // } else {
      //   this.quickQueryData()
      // }
      this.elPageChange()
    },
    powerSearch() {
      this.filters = []
      this.page.pageNum = 1
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        if (filter.key === 'status') {
          filter.opt = 'EQ'
        }
        if (
          key === 'startDate' ||
          key === 'endDate' ||
          key === 'finishDate' ||
          key === 'reqDate' ||
          key === 'assignedDate'
        ) {
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

    showTip(data) {
      console.log('data', data)
      this.showTipValue = data
    },
    elPageChange(data) {
      this.page.pageNum = data.pageNum
      this.page.pageSize = data.pageSize
      this.searchType === 'power'
        ? this.getData('reqdate', 'desc')
        : this.quickQueryData('reqdate', 'desc')
    },
    elHandleSort(data) {
      if (data.order) {
        this.sort.orderby = data.prop
        this.sort.sort = data.order === 'descending' ? 'desc' : 'asc'
      } else {
        this.sort = {}
      }
      this.getData()
    },
    handleSizeChange(pageSize) {
      this.page.pageNum = 1
      this.page.pageSize = pageSize
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
    },
    quickQueryData() {
      // let filtersArr = [];
      // let searchCondition = ['instanceId','subject','creator','processCnname']
      // searchCondition.forEach((item) => {
      // 	const filter = {
      //     key:item,
      //     opt: "LIKE",
      //     type: "S",
      //     value: this.quickData.searchData
      //   };
      // 	filtersArr.push(filter);
      // })
      //特殊处理  因为有些列表filters为空数组 混入搜索里面有个传值为true 但本页也有快捷搜素两个参数故
      console.log('this.quickData.searchData', this.quickData)
      this.loading = true
      getOutAuthViewList({
        logic: 'or',
        attr: {
          platform: 'PC'
        },
        queryFilter: ['instanceId', 'subject', 'creator', 'processCnname'],
        filters: this.filters,
        ...this.sort,
        ...this.quickData,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            if (item.category) {
              if (item.category === 'MORE_APPLY') {
                item.activityName = this.$t('outAuthView.ReturnToModify')
              } else if (item.category === 'MORE_APPROVE') {
                item.activityName =
                  item.activityName + '-' + this.$t('outAuthView.countersign')
              }
            }
          })
          this.content = rt.data
          this.page.total = this.content.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取数据
    getData(orderby, sort) {
      this.loading = true
      getOutAuthViewList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            if (item.category) {
              if (item.category === 'MORE_APPLY') {
                item.activityName = this.$t('outAuthView.ReturnToModify')
              } else if (item.category === 'MORE_APPROVE') {
                item.activityName =
                  item.activityName + '-' + this.$t('outAuthView.countersign')
              }
            }
          })
          this.content = rt.data
          this.page.total = this.content.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    toFlow(item) {
      console.log(item)
      let routeData = {}
      if (item.instanceId && item.instanceId.indexOf('$fbc1$') > -1) {
        let FBC_URL = `${process.env.FBC_URL}`
        routeData.href =
          FBC_URL +
          '/bpm/process-space!viewForm.do?instanceId=' +
          item.instanceId.slice(6).replace(/__/g, '/') +
          '&processname=' +
          item.processId +
          '&processnodename=&projectname=' +
          item.projectname +
          '&title='
        // window.open(routeData.href, "_blank");
        let a = document.createElement('a')
        // 给创建好的a标签赋值
        a.setAttribute('href', routeData.href)
        // 设置css 隐藏属性
        a.setAttribute('style', 'display:none')
        // 设置 a标签为新窗口打开
        a.setAttribute('target', '_blank')
        // 将设置好的a标签，添加到 body 内
        document.body.appendChild(a)
        // 模拟点击
        a.click()
        // 移除a标签
        a.parentNode.removeChild(a)
      } else {
        checkProcessDefaultPage({
          processName: item.processId,
          instanceId: item.instanceId
        }).then(rt => {
          if (rt.status === '200') {
            if (rt.data.isDefaultPage === 'Y') {
              routeData = this.$router.resolve({
                name: item.processId + 'View',
                query: {
                  name: item.processCnname,
                  instanceId: item.instanceId
                }
              })
            } else {
              routeData = this.$router.resolve({
                name: 'processFormView',
                query: {
                  name: item.processCnname,
                  instanceId: item.instanceId
                }
              })
            }
            // window.open(routeData.href, "_blank");
            let a = document.createElement('a')
            // 给创建好的a标签赋值
            a.setAttribute('href', routeData.href)
            // 设置css 隐藏属性
            a.setAttribute('style', 'display:none')
            // 设置 a标签为新窗口打开
            a.setAttribute('target', '_blank')
            // 将设置好的a标签，添加到 body 内
            document.body.appendChild(a)
            // 模拟点击
            a.click()
            // 移除a标签
            a.parentNode.removeChild(a)
          }
        })
      }
    },
    getInstanceImage(id) {
      this.instanceId = id
      this.instanceId = id
    }
  }
}
</script>
<style scoped>
.authorization-process-records {
  height: 100%;
}
.el-table__row .link {
  color: #2d42af;
}

.el-table__row .cell div {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
