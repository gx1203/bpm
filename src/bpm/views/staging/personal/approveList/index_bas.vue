<template>
  <el-card shadow="never" class="card-reset">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      selectType="checkbox"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange"
    >
      <!-- 自定义搜索区域 -->
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap">
              <quick-query
                ref="quick"
                :placeholder="$t('placeholderText.toDoTasksPlaceholder')"
                @quickSearch="quickSearch"
              />
            </div>
            <div class="btn-wrap">
              <el-button
                :disabled="selections.length === 0"
                type="primary"
                @click="commentVisible = true"
              >
                {{ $t('batchApproval') }}
                <!--<i class="el-icon-finished" />-->
              </el-button>
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
                <!--<i class="el-icon-refresh" />-->
              </el-button>
            </div>
          </div>
          <el-form
            v-if="isPowerSearch"
            class="power-search"
            :model="searchForm"
            label-width="120px"
            @keyup.enter.native="powerSearch"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('processName') + '：'">
                  <el-input
                    v-model="searchForm.processCnname"
                    clearable
                    type="text"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('applicationNumber') + '：'">
                  <el-input v-model="searchForm.reqNo" clearable type="text" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('subject') + '：'">
                  <el-input
                    v-model="searchForm.subject"
                    clearable
                    type="text"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('applicant') + '：'">
                  <el-input
                    v-model="searchForm.drafter"
                    clearable
                    type="text"
                  />
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
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('receiptTime') + '：'">
                  <el-date-picker
                    v-model="searchForm.assignedDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('agenttype') + '：'">
                  <el-select v-model="searchForm.category" placeholder="请选择">
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
      <!-- 星标 -->
      <template #starmark="{ row }">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <i
              :class="{
                red: row.starmark === '4',
                yellow: row.starmark === '3',
                blue: row.starmark === '2',
                gray: row.starmark === '1',
                'el-icon-star-on': row.starmark !== '1',
                'el-icon-star-off': row.starmark === '1'
              }"
              @click="handleClick(row)"
            ></i>
            <!--                  <i class="el-icon-star-off" @click="handleClick(row)"></i>-->
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="4" class="red">
              <i class="el-icon-star-on"></i>
            </el-dropdown-item>
            <el-dropdown-item command="3" class="yellow">
              <i class="el-icon-star-on"></i>
            </el-dropdown-item>
            <el-dropdown-item command="2" class="blue">
              <i class="el-icon-star-on"></i>
            </el-dropdown-item>
            <el-dropdown-item command="1" class="gray">
              <i class="el-icon-star-off" style="margin-left: 2px;"></i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <!-- 申请单号 -->
      <template #reqNo="{ row }">
        <div class="link" @click="toFlow(row)">
          {{ row.reqNo }}
        </div>
      </template>

      <!-- 主题 -->
      <template #subject="{ row }">
        <div
          class="link"
          :class="row.urge === 'Y' ? 'urge' : ''"
          @click="toFlow(row)"
        >
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

      <!-- 待办类型 -->
      <template #category="{ row }">
        <div>
          {{
            row.category === 'TRANSFER'
              ? $t('administrativetodo')
              : row.category === 'MORE_APPROVE'
              ? $t('communicationtodo')
              : $t('normaltodo')
          }}
        </div>
      </template>

      <!-- 接收时间 -->
      <template #assignedDate="{ row }">
        <div>{{ row.assignedDate | formatDateTime }}</div>
      </template>

      <!-- 审批时限 -->
      <template #remainingDate="{ row }">
        <div>
          <span
            :class="{
              timeout: row.timeoutState === 'Y',
              'will-timeout': row.timeoutState === 'L'
            }"
          >
            {{ row.remainingDate }}
          </span>
          <span v-if="!row.remainingDate">
            {{ $t('noTimeLimit') }}
          </span>
        </div>
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
          <el-tooltip :content="$t('view')" placement="top">
            <i
              class="iconfont icon-liuchengtu item-liuchengtu"
              style="font-size: 20px"
            />
          </el-tooltip>
        </el-button>
      </template>
    </bas-table>

    <InstanceImageDialog
      v-model="dialogVisible"
      :instance-id="instanceId"
      :VUE_APP_BPA_URL="VUE_APP_BPA_URL"
      :host="host"
    />
    <approvalComment
      v-model="commentVisible"
      :item="selections"
      @confirm="getData"
    />
  </el-card>
</template>

<script>
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import InstanceImageDialog from '@/bpm/components/instanceimage/InstanceImageDialog'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import approvalComment from './approvalComment'

import cookie from 'js-cookie'

import { createNamespacedHelpers } from 'vuex'
import { updateStarMarkStatus } from '@/bpm/api/staging/personal/approve_list'

const { mapActions } = createNamespacedHelpers('app')

window.addEventListener('storage', function(e) {
  if (e.key === 'isReload' && e.newValue === 'true') {
    window.getData()
  }
})
export default {
  name: 'BasPageBpmStagingPersonalApproveList',
  components: {
    QuickQuery,
    InstanceImageDialog,
    approvalComment
  },
  mixins: [SearchListMixin],
  data() {
    return {
      options: [
        {
          value: 'TODO',
          label: this.$t('normaltodo')
        },
        {
          value: 'TRANSFER',
          label: this.$t('administrativetodo')
        },
        {
          value: 'MORE_APPROVE',
          label: this.$t('communicationtodo')
        },
        {
          value: 'ReturnTodo',
          label: this.$t('returnTodo')
        }
      ],
      headers: [
        {
          key: 'subject',
          name: this.$t('subject'),
          span: 6
        },
        {
          key: 'drafter',
          name: this.$t('applicant'),
          span: 5
        },
        {
          key: 'activityName',
          name: this.$t('approvalNode'),
          span: 5
        },
        {
          key: 'processCnname',
          name: this.$t('processName'),
          span: 6
        },
        {
          name: this.$t('flowChart'),
          span: 2
        }
      ],
      dialogVisible: false,
      commentVisible: false,
      instanceId: '',
      checkAll: false,
      selections: [],
      currentRow: {},
      // 表头字段
      headerList: [
        {
          label: '', // 星标
          prop: 'starmark',
          slotName: 'starmark',
          width: 35
        },
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
          label: this.$t('applicant'), // 申请人
          prop: 'drafter',
          sortable: true,
          width: 80
        },
        {
          label: this.$t('applicationDate'), // 申请时间
          prop: 'reqDate',
          slotName: 'reqDate',
          sortable: true
        },
        {
          label: this.$t('approvalNode'), // 审批节点
          prop: 'activityName',
          sortable: true
        },
        {
          label: this.$t('agenttype'), // 待办类型
          prop: 'category',
          slotName: 'category',
          sortable: true,
          width: 95
        },
        {
          label: this.$t('receiptTime'), // 接收时间
          prop: 'assignedDate',
          slotName: 'assignedDate',
          sortable: true
        },
        {
          label: this.$t('approvalTimeLimit'), // 审批时限
          prop: 'remainingDate',
          slotName: 'remainingDate',
          width: 135
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
          sortable: true,
          width: 80
        }
      ]
    }
  },
  props: {
    host: {
      type: String,
      // default: "http://jiucaiyunbpm.jiucaiyun.cn/bpabpmapi"
      default: process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    VUE_APP_BPA_URL: {
      type: String,
      // default: "http://jiucaiyunbpm.jiucaiyun.cn"
      default: process.env.VUE_APP_BPA_URL
    }
  },
  watch: {
    'content.list': {
      handler(val) {
        if (this.content.list && this.content.list.length !== 0) {
          // this.checkAll = true;
          this.selections = []
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              // this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i])
            }
          }
        }
      },
      deep: true
    }
    // checkAll(val) {
    //   console.log(this.selections,this.content.list);
    //   console.log(val);
    // },
  },
  mounted() {
    window.getData = this.getData
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
    // 复选框勾选事件
    handleSelectionChange(data) {
      this.selections = data
    },
    // 星标点击事件
    handleClick(rowData) {
      console.log(rowData)
      this.currentRow = rowData
    },
    // 选择星标事件
    async handleCommand(command) {
      try {
        console.log(command)
        const params = {
          taskId: this.currentRow.taskId,
          userId: cookie.get('username'),
          starmark: command
        }
        const res = await updateStarMarkStatus(params)
        if (res.status !== '200') {
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
        this.getData()
      } catch (error) {
        console.log(error)
      }
    },
    selectall(val) {
      if (this.content.list) {
        if (this.checkAll == true) {
          this.content.list.forEach(item => {
            if (item.isapprovedlist == 'Y' && item.isapprovedlist) {
              item.checked = this.checkAll
              this.selections.push(item)
            }
          })
        } else {
          this.content.list.forEach(item => {
            item.checked = this.checkAll
            this.selections = []
          })
        }
      }
    },
    ...mapActions(['requireApproveCount']),
    // 快速获取数据
    quickQueryData() {
      this.loading = true
      this.checkAll = false
      this.$http({
        url: '/bpm/processquery/v2/todo',
        method: 'POST',
        data: {
          logic: 'or',
          attr: {
            platform: 'PC'
          },
          filters: this.filters,
          queryFilter: [
            'reqno',
            'subject',
            'drafter',
            'activityName',
            'processCnname'
          ],
          ...this.quickData,
          ...this.sort,
          ...this.page
        }
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
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
          this.requireApproveCount()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取数据
    getData() {
      this.loading = true
      this.checkAll = false
      localStorage.setItem('isReload', false)
      this.$http({
        url: '/bpm/processquery/v2/todo',
        method: 'POST',
        data: {
          logic: 'and',
          attr: {
            platform: 'PC'
          },
          filters: this.filters,
          ...this.sort,
          ...this.page
        }
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
          rt.data.list.forEach(item => {
            item.checked = false
          })
          this.content = rt.data
          this.page.total = this.content.total
          this.requireApproveCount()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    toFlow(item) {
      let routeData = {}
      this.$http({
        url: `/bpm/processquery/v2/taskExists/${item.taskId}/${item.index}`,
        method: 'GET'
      }).then(rt => {
        if (!rt.data) {
          this.$message.error(this.$t('hintText.taskDoesNotExist'))
          return
        }
        this.$http({
          url: '/bpm/process/checkProcessDefaultPage',
          method: 'POST',
          data: {
            processName: item.processId,
            instanceId: item.instanceId
          }
        }).then(rt => {
          if (rt.status === '200') {
            if (rt.data.isDefaultPage === 'Y') {
              routeData = this.$router.resolve({
                name: item.processId + 'Approve',
                query: {
                  name: item.processCnname,
                  taskId: item.taskId,
                  category: item.category,
                  // processName: item.taskdefinitionId,
                  processName: item.processId,
                  index: item.index
                }
              })
            } else {
              // routeData = this.$router.resolve({
              //   path: item.linkUrl,
              //   query: {
              //     name: item.processCnname,
              //     category: item.category,
              //     processName:item.taskdefinitionId,
              //     taskId: item.taskId
              //   }
              // })
              if (item.linkUrl.startsWith('http')) {
                routeData.href = `${item.linkUrl}?name=${item.processCnname}&category=${item.category}&processName=${item.processId}&taskId=${item.taskId}&index=${item.index}`
              } else {
                routeData.href = `${window.location.origin +
                  window.location.pathname +
                  item.linkUrl}?name=${item.processCnname}&category=${
                  item.category
                }&processName=${item.processId}&taskId=${item.taskId}&index=${
                  item.index
                }`
              }
            }
            // window.open(routeData.href, "_blank");
            const a = document.createElement('a')
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
      })
    },
    getInstanceImage(id) {
      this.instanceId = id
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: #2d42af;
}

.urge {
  color: #ea3c40;
  font-weight: 600;
}

.item-liuchengtu {
  color: #888;
}

.item-liuchengtu:hover {
  color: #2d42af;
}

.el-dropdown-link {
  cursor: pointer;
  color: gray;
}

.el-icon-star-on {
  font-size: 20px;
}

.el-icon-star-off {
  font-size: 17px;
}

.red {
  color: red;
}
.red:hover {
  color: red !important;
}

.yellow {
  color: yellow;
}
.yellow:hover {
  color: yellow !important;
}

.blue {
  color: dodgerblue;
}
.blue:hover {
  color: dodgerblue !important;
}

.gray {
  color: gray;
}
.gray:hover {
  color: gray !important;
}

.timeout {
  color: red;
}
.will-timeout {
  color: red;
}
.card-reset {
  /deep/ .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
</style>
