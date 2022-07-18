<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query ref="quick" :placeholder="$t('placeholderText.multipleFieldsPlaceholder14')"
          @quickSearch="quickSearch" />
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
    <el-form v-if="isPowerSearch" ref="searchForm" class="power-search" :model="searchForm" label-width="120px"
      size="mini" @keyup.enter.native="powerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationNumber') + '：'">
            <el-input v-model="searchForm.reqNo" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('subject') + '：'">
            <el-input v-model="searchForm.subject" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicant') + '：'">
            <el-input v-model="searchForm.drafter" clearable type="text" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationDate') + '：'">
            <el-date-picker v-model="searchForm.reqDate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('approver') + '：'">
            <el-input v-model="searchForm.assigneesDisplayname" clearable type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('approvalNode') + '：'">
            <el-input v-model="searchForm.activityName" clearable type="text" />
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
    <div v-loading="loading" class="tableWrap">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <sort-button style="margin-top: 15px" :items="headers" @sort="handleSort" />
        <div v-if="content.list && content.list.length!==0">
          <div v-for="(item, index) in content.list" :key="index" class="tr">
            <div class="tr-title">
              <span>{{ $t('applicationDate') }}：{{ item.reqDate | formatDateTime }}</span>
              <span style="margin-left: 60px">
                {{ $t('applicationNumber') }}：
                <el-button type="text" @click="toFlow(item)">{{ item.reqNo }}</el-button>
              </span>
              <span v-if="item.comments" style="margin-left: 60px" :title="item.comments" class="tr-title-comments">
                {{ item.comments }}
              </span>
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td textHide link" :span="headers[0].span" :title="item.subject"
                @click.native="toFlow(item)">
                {{ item.subject }}
              </el-col>
              <el-col class="td textHide" :span="headers[1].span" :title="item.drafter">
                {{ item.drafter }}
              </el-col>
              <el-col class="td textHide" :span="headers[2].span" :title="item.assigneesDisplayname">
                {{ item.assigneesDisplayname }}
              </el-col>
              <el-col class="td textHide" :span="headers[3].span" :title="item.activityName">
                {{ item.activityName }}
              </el-col>
              <el-col class="td textHide" :span="headers[4].span" :title="item.processCnname">
                <el-button type="text" @click="toFlow(item)">
                  {{ item.processCnname }}
                </el-button>
              </el-col>
              <el-col style="text-align: center" :span="headers[5].span">
                <el-tooltip class="item" effect="dark" :content="$t('flowChart')" placement="top">
                  <el-button type="text" @click="getInstanceImage(item.instanceId)">
                    <i class="iconfont icon-liuchengtu" style="font-size: 20px" />
                  </el-button>
                </el-tooltip>
              </el-col>
              <el-col style="text-align: center" :span="headers[6].span">
                <el-tooltip class="item" effect="dark" :content="$t('urgeDo')" placement="top">
                  <el-button type="text" @click="handleCuiban(item)">
                    <i class="iconfont icon-cuiban" style="font-size: 20px" />
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty">
          {{ $t('noData') }}
        </div>
      </div>
      <div v-else>
        <el-table :data="content.list" class="margin-t10" stripe :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row @sort-change="elHandleSort" current-row-key="instanceId">
          <el-table-column :label="$t('applicationNumber')" show-overflow-tooltip sortable prop="reqNo">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.reqNo}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subject')" show-overflow-tooltip sortable prop="subject">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.subject}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('applicant')" show-overflow-tooltip sortable prop="drafter">
            <template slot-scope="scope">
              <div>{{scope.row.drafter}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('applicationDate')" show-overflow-tooltip sortable prop="reqDate">
            <template slot-scope="scope">
              <div>{{scope.row.reqDate | formatDateTime}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('approver')" show-overflow-tooltip sortable prop="currentUser">
            <template slot-scope="scope">
              <div>{{scope.row.assigneesDisplayname}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('approvalNode')" show-overflow-tooltip sortable prop="activityName">
            <template slot-scope="scope">
              <div>{{scope.row.activityName}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('processName')" show-overflow-tooltip sortable prop="processCnname">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.processCnname}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('flowChart')" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="getInstanceImage(scope.row.instanceId)">
                <i class="iconfont icon-liuchengtu" style="font-size: 20px" />
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" width="60">
            <template slot-scope="scope">
              <div>
                <el-tooltip class="item" effect="dark" :content="$t('urgeDo')" placement="top">
                  <el-button type="text" @click="handleCuiban(scope.row)">
                    <i class="iconfont icon-cuiban" style="font-size: 20px" />
                  </el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      :total="content.total" @current-change="searchType === 'power' ? getData() : quickQueryData()" />
    <instance-image-dialog v-model="dialogVisible" :instance-id="instanceId" />
  </el-card>
</template>

<script>
import {
  getFocusTaskList,
  quickFocusTaskList
} from '../../../../api/staging/personal/focus_task'
import { urge } from '../../../../api/staging/personal/apply'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import InstanceImageDialog from '@/bpm/components/instanceimage/InstanceImageDialog'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { checkProcessDefaultPage } from '../../../../api/flow/index'
export default {
  name: 'StagingPersonalFocusTask',
  components: {
    QuickQuery,
    InstanceImageDialog
  },
  mixins: [SearchListMixin],
  data () {
    return {
      headers: [
        {
          key: 'subject',
          name: this.$t('subject'),
          span: 5
        },
        {
          key: 'drafter',
          name: this.$t('applicant'),
          span: 3
        },
        {
          key: 'assigneesDisplayname',
          name: this.$t('approver'),
          span: 3
        },
        {
          key: 'activityName',
          name: this.$t('approvalNode'),
          span: 4
        },
        {
          key: 'processCnname',
          name: this.$t('processName'),
          span: 5
        },
        {
          name: this.$t('flowChart'),
          span: 2
        },
        {
          name: this.$t('operation'),
          span: 2
        }
      ],
      dialogVisible: false,
      instanceId: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 快速获取数据
    quickQueryData () {
      this.loading = true
      quickFocusTaskList({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['reqno', 'subject', 'drafter', 'activityName', 'assigneesDisplayname', 'processCnname'],
        ...this.quickData,
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
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取数据
    getData () {
      this.loading = true
      quickFocusTaskList({
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
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCuiban (item) {
      this.$confirm(this.$t('hintText.areYouSureDeletePush'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        this.loading = true
        urge(item.instanceId).then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.operateSuccessfully'))
          }
        }).catch(er => {
          this.loading = false
        })
      }).catch(_ => { })
    },
    toFlow (item) {
      let routeData = ''
      checkProcessDefaultPage({
        processName: item.processName,
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
    },
    getInstanceImage (id) {
      this.instanceId = id
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
</style>
