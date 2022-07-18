<template>
  <el-card shadow="never">
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
                :placeholder="$t('placeholderText.multipleFieldsPlaceholder13')"
                ref="quick"
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
              <el-button type="primary" @click="rest">
                {{ $t('refresh') }}
                <!---->
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
                <el-form-item :label="$t('applicationNumber') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.reqNo"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('subject') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.subject"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('approver') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.currentUser"
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
          <el-form-item :label="$t('applicant') + '：'">
            <el-input clearable type="text" v-model="searchForm.drafter"></el-input>
          </el-form-item>
        </el-col>-->
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('approvalNode') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.activityName"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('applicationDate') + '：'">
                  <el-date-picker
                    v-model="searchForm.reqDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('state') + '：'">
                  <el-select
                    clearable
                    type="text"
                    class="w100"
                    v-model="searchForm.status"
                    :popper-append-to-body="false"
                  >
                    <el-option :label="$t('all')" value=""></el-option>
                    <el-option
                      :label="$t('beingProcessed')"
                      value="审批中"
                    ></el-option>
                    <el-option
                      :label="$t('completed')"
                      value="已完成"
                    ></el-option>
                    <el-option :label="$t('pause')" value="暂停"></el-option>
                    <el-option :label="$t('invalid')" value="作废"></el-option>
                    <el-option
                      :label="$t('terminated')"
                      value="已终止"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="powerSearch">
                  {{ $t('query') }}
                </el-button>
                <el-button type="primary" @click="rest">
                  {{ $t('reset') }}
                </el-button>
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
        <div class="link" @click="toFlow(row)">
          <span style="color: red;" v-if="row.priority === 1">{{
            `[${$t('urgent')}]`
          }}</span>
          {{ row.subject }}
        </div>
      </template>

      <!-- 申请时间 -->
      <template #reqDate="{ row }">
        <div>{{ row.reqDate | formatDateTime }}</div>
      </template>

      <!-- 审批节点 -->
      <template #activityName="{ row }">
        <div>{{ row.nodeAlias || row.activityName }}</div>
      </template>

      <!-- 流程名 -->
      <template #processCnname="{ row }">
        <div class="link" @click="toFlow(row)">
          {{ row.processCnname }}
        </div>
      </template>

      <!-- 流程图 -->
      <template #instanceId="{ row }">
        <el-button type="text" @click="getInstanceImage(row.instanceId)">
          <i class="iconfont icon-liuchengtu" style="font-size: 20px" />
        </el-button>
      </template>

      <!-- 操作 -->
      <template #default="{ row }">
        <div v-if="row.canUrge === 'Y'">
            <el-button type="text" @click="handleCuiban(row)">
              <!-- <i class="iconfont icon-cuiban" style="font-size: 20px"></i> -->
              {{ $t('urgeDo') }}
            </el-button>
            <el-button
              v-if="row.cancelOrder === 'Y'"
              type="text"
              @click="revokeHandle(row)"
            >
              <!-- <i class="iconfont icon-weibiaoti545" style="font-size: 20px"></i> -->
              {{ $t('cancelOrder') }}
            </el-button>
        </div>
      </template>
    </bas-table>
    <instance-image-dialog v-model="dialogVisible" :instanceId="instanceId" />
  </el-card>
</template>

<script>
import {
  getApplyList,
  quickQueryApplyList,
  cancelorder,
  urge
} from '../../../../api/staging/personal/apply'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import InstanceImageDialog from '@/bpm/components/instanceimage/InstanceImageDialog'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { checkProcessDefaultPage } from '../../../../api/flow/index'

export default {
  mixins: [SearchListMixin],
  name: 'stagingPersonalApply',
  components: {
    QuickQuery,
    InstanceImageDialog
  },
  data() {
    return {
      dialogVisible: false,
      instanceId: '',
      headerList: [
        {
          label: this.$t('applicationNumber'), // 申请单号
          prop: 'reqNo',
          slotName: 'reqNo',
          sortable: true
        },
        {
          label: this.$t('subject'), // 主题
          prop: 'subject',
          slotName: 'subject',
          sortable: true
        },
        {
          label: this.$t('applicationDate'), // 申请时间
          prop: 'reqDate',
          slotName: 'reqDate',
          sortable: true,
          width: 120
        },
        {
          label: this.$t('approver'), // 审批人
          prop: 'currentUser',
          sortable: true,
          width: 80
        },
        {
          label: this.$t('approvalNode'), // 审批节点
          prop: 'activityName',
          slotName: 'activityName',
          sortable: true
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          sortable: true,
          width: 80
        },
        {
          label: this.$t('processName'), // 流程名
          prop: 'processCnname',
          slotName: 'processCnname',
          sortable: true
        },
        {
          label: this.$t('flowChart'), // 流程图
          prop: 'instanceId',
          slotName: 'instanceId',
          width: 70
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'default',
          slotName: 'default',
          width: 90
        }
      ]
    }
  },
  mounted() {
    if (
      this.$route.params.filters &&
      this.$route.params.active === 'application'
    ) {
      this.filters = this.$route.params.filters
    }
    this.getData()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      if (this.searchType === 'power') {
        this.getData()
      } else {
        this.quickQueryData()
      }
    },
    // 快速获取数据
    quickQueryData() {
      this.loading = true

      quickQueryApplyList({
        logic: 'or',
        filters: this.filters,
        queryFilter: [
          'reqNo',
          'subject',
          'currentUser',
          'activityName',
          'processCnname'
        ],
        ...this.sort,
        ...this.quickData,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            if (item.category) {
              if (item.category === 'MORE_APPLY') {
                item.activityName = '退回修改'
              } else if (item.category === 'MORE_APPROVE') {
                item.activityName = item.activityName + '-加签'
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
    getData() {
      this.loading = true
      quickQueryApplyList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            if (item.category) {
              if (item.category === 'MORE_APPLY') {
                item.activityName = '退回修改'
              } else if (item.category === 'MORE_APPROVE') {
                item.activityName = item.activityName + '-加签'
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
      let routeData = {}
      checkProcessDefaultPage({
        processName: item.processName,
        instanceId: item.instanceId
      }).then(rt => {
        if (rt.status === '200') {
          if (rt.data.isDefaultPage === 'Y') {
            routeData = this.$router.resolve({
              name: rt.data.spacename + 'View',
              query: {
                name: item.processCnname,
                instanceId: item.instanceId
              }
            })
          } else {
            if (item.processTrackingUrl.startsWith('http')) {
              routeData.href = `${item.linkUrl}?name=${item.processCnname}&instanceId=${item.instanceId}`
            } else {
              routeData.href = `${window.location.origin +
                window.location.pathname +
                item.processTrackingUrl}?name=${
                item.processCnname
              }&instanceId=${item.instanceId}`
            }

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
    },
    handleCuiban(item) {
      this.$confirm(
        this.$t('hintText.areYouSureDeletePush'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          urge(item.instanceId)
            .then(rt => {
              this.loading = false
              if (rt.status === '200') {
                this.$message.success(this.$t('hintText.operateSuccessfully'))
              }
            })
            .catch(er => {
              this.loading = false
            })
        })
        .catch(_ => {})
    },
    revokeHandle(item) {
      let that = this
      this.$confirm(
        this.$t('hintText.areYouSureWantCancelOrder'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          let obj = {
            approvalComment: '撤销单据',
            instanceId: item.instanceId,
            userId: this.$store.state.basuser.user.id
          }
          // ceshi合并请求
          cancelorder(obj)
            .then(rt => {
              if (rt.status === '200') {
                item.cancelOrder = 'N'
                this.$message.success(this.$t('hintText.operateSuccessfully'))
                setTimeout(() => {
                  that.getData()
                  that.loading = false
                }, 2000)
              } else {
                this.loading = false
              }
            })
            .catch(er => {
              this.loading = false
            })
        })
        .catch(_ => {})
    },
    getInstanceImage(id) {
      this.instanceId = id
      this.dialogVisible = true
    }
  }
}
</script>
