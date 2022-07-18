<template>
  <div class="bpmHome" v-loading="loading">
    <el-row :gutter="16">
      <el-col :span="16">
        <el-card class="form-card">
          <div class="statistics-card">
            <div class="examine" @click="goProcessTrace">
              <div class="title">
                {{ $t('AuditTotalNumberWithinNearlyOneMonth') }}
              </div>
              <div class="circular">
                <b>{{ audit.total }}</b>
                <span>{{ $t('item') }}</span>
              </div>
            </div>
            <div class="examine" @click="goApproveList">
              <div class="title">{{ $t('TasksOk') }}</div>
              <div class="circular">
                <i class="gray" />
                <b>{{ content.total }}</b>
                <span>{{ $t('item') }}</span>
              </div>
            </div>
            <div class="examine" @click="goApply">
              <div class="title">{{ $t('MyUnfinishedApplication') }}</div>
              <div class="circular">
                <i />
                <b>{{ applicationList.total }}</b>
                <span>{{ $t('item') }}</span>
              </div>
            </div>
            <div class="examine" @click="goCollection">
              <div class="title">{{ $t('MyFavorite') }}</div>
              <div class="circular">
                <i class="apply" />
                <b>{{ collectList.total }}</b>
                <span>{{ $t('item') }}</span>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="form-card">
          <div class="card-header">
            <div class="title">
              <b
                >{{ $t('TheExaminationAndApprovalToAo')
                }}<span class="total">({{ content.total }})</span></b
              >
            </div>
          </div>
          <el-table
            :data="content.list"
            class="margin-t10"
            stripe
            :header-cell-style="{ background: '#E1EAFD' }"
            highlight-current-row
            current-row-key="id"
          >
            <el-table-column
              :label="$t('subject')"
              show-overflow-tooltip
              sortable
              prop="subject"
            >
              <template slot-scope="scope">
                <div
                  :class="scope.row.urge === 'Y' ? 'urge' : 'link'"
                  @click="toFlow(scope.row)"
                >
                  {{ scope.row.subject }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('applicant')"
              show-overflow-tooltip
              sortable
              prop="drafter"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.drafter }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('applicationDate')"
              show-overflow-tooltip
              sortable
              prop="reqDate"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.reqDate | formatDateTime }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('approvalNode')"
              show-overflow-tooltip
              sortable
              prop="activityName"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.activityName }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('receiptTime')"
              show-overflow-tooltip
              sortable
              prop="assignedDate"
            >
              <template slot-scope="scope">
                <div>{{ scope.row.assignedDate | formatDateTime }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('flowChart')" width="80">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="getInstanceImage(scope.row.instanceId)"
                >
                  <el-tooltip :content="$t('view')" placement="top">
                    <i
                      class="iconfont icon-liuchengtu item-liuchengtu"
                      style="font-size: 20px"
                    />
                  </el-tooltip>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top: 15px"
            :page-size="page.pageSize"
            :current-page.sync="page.pageNum"
            background
            :total="content.total"
            @current-change="getData()"
          />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="form-card">
          <div class="card-header">
            <div class="title">
              <b>{{ $t('ApplicationOfTheNavigation') }}</b>
            </div>
            <div class="more" @click="handlerMoreNavigation">
              {{ $t('toMore') }}<i class="el-icon-arrow-right" />
            </div>
          </div>
          <div class="application-content">
            <div
              class="block"
              v-for="item in navigationList"
              :key="item.id"
              :title="item.applistname"
              @click="navigationLink(item)"
            >
              <template>
                <el-image
                  :key="item.appnewimgUrl"
                  :src="item.appnewimgUrl"
                ></el-image>
                <!--                <el-avatar shape="square" :size="70" fit="fill" :src="item.appnewimgUrl"/>-->
                <div class="title">{{ item.applistname }}</div>
              </template>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 点击更多 -->
    <el-dialog
      v-show="moreNavigation"
      :title="$t('ApplicationOfTheNavigation')"
      :visible.sync="moreNavigation"
      class="application-dialog"
    >
      <div class="application-content">
        <div
          class="block"
          v-for="item in navigationAllList"
          :key="item.id"
          :title="item.applistname"
          @click="navigationLink(item)"
        >
          <template>
            <el-image
              :key="item.appnewimgUrl"
              :src="item.appnewimgUrl"
              lazy
            ></el-image>
            <!--            <el-avatar shape="square" :size="70" fit="fill" :src="item.appnewimgUrl"/>-->
            <div class="title">{{ item.applistname }}</div>
          </template>
        </div>
      </div>
    </el-dialog>
    <InstanceImageDialog v-model="dialogVisible" :instance-id="instanceId" />
  </div>
</template>

<script>
// 数据初始化
import {
  queryTodo,
  quickQueryCollection,
  queryCopy,
  attachment
} from '@/bpm/api/bpmHome'
import { taskExists } from '@/bpm/api/staging/personal/approve_list'
import { checkProcessDefaultPage } from '@/bpm/api/flow/index'
import { quickQueryProcessTraceList } from '@/bpm/api/staging/personal/process_trace'
import { quickQueryApplyList } from '@/bpm/api/staging/personal/apply'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import InstanceImageDialog from '@/bpm/components/instanceimage/InstanceImageDialog'
import { getDate } from '@/bpm/utils/utils'

window.addEventListener('storage', function(e) {
  if (e.key === 'isReload' && e.newValue === 'true') {
    window.getData()
  }
})
export default {
  components: {
    InstanceImageDialog
  },
  mixins: [SearchListMixin],
  data() {
    return {
      moreNavigation: false,
      // 导航应用
      navigationList: [],
      navigationAllList: [],
      // 我的收藏
      collectList: {},
      // 我的未完成申请
      applicationList: {},
      // 近一个月内审批总数
      audit: {},
      content: {
        list: []
      },
      dialogVisible: false,
      instanceId: '',
      loading: false
    }
  },
  watch: {},
  mounted() {
    window.getData = this.getData
    this.getData()
    this.quickQueryProcessTraceList()
    this.quickQueryApplyList()
    this.quickQueryCollection()
    this.queryNavigation()
  },
  methods: {
    goProcessTrace() {
      this.$router.push({
        name: 'stagingPersonalProcessTrace',
        params: {
          searchDate: getDate('month', -2)
        }
      })
    },
    // 我的未完成跳转到 我的申请
    goApply() {
      this.$router.push({
        path: '/staging/personal/apply',
        params: {
          filters: [
            {
              key: 'status', //状态字段
              opt: 'EQ', //等于
              type: 'S',
              value: '审批中'
            }
          ]
        }
      })
    },
    // 我的收藏 跳转我的收藏
    goCollection() {
      this.$router.push('/staging/personal/collection')
    },
    // 我的代办跳转到进一月内 审批
    goApproveList() {
      console.log(111111111)
      this.$router.push('/staging/personal/approveList')
    },
    // 待办列表数据
    getData() {
      this.loading = true
      queryTodo({
        logic: 'and',
        attr: {
          platform: 'PC'
        },
        ...this.page
      })
        .then(rt => {
          if (rt.status === '200') {
            this.content = rt.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 近一个月内审批总数
    quickQueryProcessTraceList() {
      quickQueryProcessTraceList({
        filters: [],
        logic: 'or',
        searchData: '',
        searchDate: getDate('month', -2),
        pageNum: 1,
        pageSize: 1,
        queryFilter: []
      })
        .then(rt => {
          if (rt.status === '200') {
            this.audit = rt.data
          }
        })
        .catch(() => {})
    },

    // 我的未完成
    quickQueryApplyList() {
      quickQueryApplyList({
        logic: 'and',
        filters: [
          {
            key: 'status',
            opt: 'EQ',
            type: 'S',
            value: '审批中'
          }
        ],
        pageNum: 1,
        pageSize: 1
      })
        .then(rt => {
          if (rt.status === '200') {
            this.applicationList = rt.data
          }
        })
        .catch(() => {})
    },
    // 我的收藏
    quickQueryCollection() {
      quickQueryCollection()
        .then(res => {
          if (res.status === '200') {
            this.collectList = res.data
          }
        })
        .catch(() => {})
    },
    toFlow(item) {
      let routeData = {}
      taskExists(item.taskId, item.index).then(rt => {
        if (!rt.data) {
          this.$message.error(this.$t('hintText.taskDoesNotExist'))
          return
        }
        checkProcessDefaultPage({
          processName: item.processId,
          instanceId: item.instanceId
        }).then(rt => {
          if (rt.status === '200') {
            if (rt.data.isDefaultPage === 'Y') {
              routeData = this.$router.resolve({
                name: item.processId + 'Approve',
                query: {
                  name: item.processCnname,
                  taskId: item.taskId,
                  category: item.category,
                  processName: item.taskdefinitionId,
                  index: item.index
                }
              })
            } else {
              if (item.linkUrl.startsWith('http')) {
                routeData.href = `${item.linkUrl}?name=${item.processCnname}&category=${item.category}&processName=${item.taskdefinitionId}&taskId=${item.taskId}&index=${item.index}`
              } else {
                routeData.href = `${window.location.origin +
                  window.location.pathname +
                  item.linkUrl}?name=${item.processCnname}&category=${
                  item.category
                }&processName=${item.taskdefinitionId}&taskId=${
                  item.taskId
                }&index=${item.index}`
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
    },
    handlerMoreNavigation() {
      this.moreNavigation = true
      this.queryNavigation(100000)
    },
    // 导航应用
    queryNavigation(pageSize) {
      queryCopy({
        pageSize: pageSize || 20,
        filters: [
          {
            key: 'isdelete',
            opt: 'EQ',
            type: 'S',
            value: '0'
          },
          {
            key: 'applistscenarios',
            opt: 'LIKE',
            type: 'S',
            value: 'app'
          }
        ]
      })
        .then(rt => {
          if (rt.status === '200' && rt.data && rt.data.list.length > 0) {
            rt.data.list.forEach(item => {
              this.$set(
                item,
                'appnewimgUrl',
                `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${item.appnewimg}?attachmentType=bpm`
              )
            })
            if (pageSize) {
              this.navigationAllList = rt.data.list
            } else {
              this.navigationList = rt.data.list
            }
          }
        })
        .catch(() => {})
    },
    navigationLink(item) {
      window.open(item.applisturl, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.bpmHome {
  padding: 20px;
}
.statistics-card {
  display: flex;
  justify-content: space-evenly;

  .examine {
    font-size: 15px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    .title {
      margin-bottom: 8px;
      font-weight: bold;
      font-size: 13px;
    }
    .circular {
      display: flex;
      line-height: 20px;
      i {
        display: inline-block;
        width: 10px;
        height: 10px;
        text-align: center;
        line-height: 10px;
        border-radius: 50%;
        background-color: red;
        box-shadow: 1px 1px 10px red;
        position: relative;
        top: 5px;
        margin-right: 5px;
      }
      b {
        font-size: 18px;
        margin: 0 4px;
      }
      span {
        font-size: 12px;
        color: #999;
      }
      .apply {
        background-color: green;
        box-shadow: 1px 1px 10px green;
      }
      .gray {
        background-color: #ccc;
        box-shadow: 1px 1px 10px #ccc;
      }
    }
  }
}

.form-card {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  div.title {
    b {
      font-size: 15px;
    }
    span {
      margin-left: 3px;
      color: $active-color;
      font-size: 12px;
    }
  }
  .more {
    cursor: pointer;
  }
}
.application-content {
  margin-top: 20px;
  overflow: hidden;
  .block {
    float: left;
    width: 25%;
    padding: 0 5px;
    margin-bottom: 10px;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    .el-image {
      display: inline-block;
      width: 70px;
      height: 70px;
    }
    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 24px;
      height: 24px;
    }
  }
}
.application-dialog {
  /deep/ .el-dialog {
    width: 770px;
    .el-dialog__body {
      max-height: 70vh;
      .application-content {
        width: 720px;
        margin: 0 auto;
        .block {
          width: 90px;
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
