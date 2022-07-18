<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query  :placeholder="$t('placeholderText.multipleFieldsPlaceholder12')" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'"/>
        </el-button>
        <el-button type="primary" @click="rest">
           {{ $t('refresh') }}
          <!--<i class="el-icon-refresh"/>-->
        </el-button>
      </div>
    </div>
    <el-form
      class="power-search"
      :model="searchForm"
      @keyup.enter.native="powerSearch"
      label-width="120px"
      v-if="isPowerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationNumber') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('subject') + '：'">
            <el-input clearable type="text" v-model="searchForm.subject"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicant') + '：'">
            <el-input clearable type="text" v-model="searchForm.drafter"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
<!--        <el-col :span="8">-->
<!--          <el-form-item :label="$t('approver') + '：'">-->
<!--            <el-input clearable type="text" v-model="searchForm.assigneesDisplayname"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      <el-col :span="8">
            <el-form-item :label="$t('applicationDate') + '：'">
              <el-date-picker
                v-model="searchForm.reqDate"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
                :range-separator="$t('placeholderText.to')"
                :start-placeholder="$t('placeholderText.startDate')"
                :end-placeholder="$t('placeholderText.endDate')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item :label="$t('receiptTime') + '：'">
            <el-date-picker
              v-model="searchForm.assignedDate"
              type="daterange"
             value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')">
            </el-date-picker>
          </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="powerSearch">{{ $t('query') }}</el-button>
          <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="tableWrap" v-loading="loading">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <sort-button :items="headers" @sort="handleSort"/>
        <div v-if="content.list && content.list.length!==0">
          <div class="tr" v-for="(item, index) in content.list" :key="index">
            <div class="tr-title">
              <span>{{ $t('applicationDate') }}：{{item.reqDate | formatDateTime}}</span>
              <span>{{ $t('receiptTime') }}：{{item.assignedDate | formatDateTime}}</span>
              <span style="margin-left: 60px"> {{ $t('applicationNumber') }}：<el-button type="text" @click="toFlow(item)">{{item.reqNo}}</el-button></span>

              <span style="margin-left: 60px" :title='item.comments' class="tr-title-comments" v-if="item.comments">
                {{item.comments}}
              </span>
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col @click.native="toFlow(item)" class="td textHide link" :span="headers[0].span" :title="item.subject">{{item.subject}}</el-col>
              <el-col class="td textHide" :span="headers[1].span" :title="item.drafter">{{item.drafter}}</el-col>
<!--              <el-col class="td textHide" :span="headers[2].span" :title="item.assigneesDisplayname">{{item.assigneesDisplayname}}</el-col>-->
              <!-- <el-col class="td textHide" :span="headers[3].span" :title="item.activityName">{{item.activityName}}</el-col> -->
              <el-col class="td textHide" :span="headers[3].span" :title="item.processCnname"> <el-button type="text" @click="toFlow(item)">{{item.processCnname}}</el-button></el-col>
              <el-col style="text-align: center" :span="headers[4].span">
                <el-tooltip class="item" effect="dark" :content="$t('flowChart')" placement="top">
                  <el-button type="text" @click="getInstanceImage(item.instanceId)">
                    <i class="iconfont icon-liuchengtu" style="font-size: 20px"></i>
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty">{{ $t('noData') }}</div>
      </div>
      <div v-else>
        <el-table
          :data="content.list"
          class="margin-t10"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          @sort-change="elHandleSort"
          current-row-key="taskId"
        >
          <el-table-column :label="$t('applicationNumber')" show-overflow-tooltip sortable prop="reqNo">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.reqNo}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subject')" show-overflow-tooltip sortable prop="subject">
            <template slot-scope="scope">
              <div class="link" :class="scope.row.urge === 'Y' ? 'urge' : ''" @click="toFlow(scope.row)">{{scope.row.subject}}</div>
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
          <el-table-column :label="$t('receiptTime')" show-overflow-tooltip sortable prop="assignedDate">
            <template slot-scope="scope">
              <div>{{scope.row.assignedDate | formatDateTime}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('processName')" show-overflow-tooltip sortable prop="processCnname">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.processCnname}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('flowChart')"  width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="getInstanceImage(scope.row.instanceId)">
                   <el-tooltip :content="$t('view')" placement="top" >
                    <i class="iconfont icon-liuchengtu item-liuchengtu" style="font-size: 20px" />
                    </el-tooltip>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
	    </div>
    </div>
    <el-pagination
      class="margin-t15"
      :page-size="page.pageSize" :current-page.sync="page.pageNum"
      background @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"></el-pagination>
    <InstanceImageDialog v-model="dialogVisible" :instanceId="instanceId" />
  </el-card>
</template>

<script>
import { getReturnTaskList, quickReturnTaskList } from '../../../../api/staging/personal/return_task'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import InstanceImageDialog from '@/bpm/components/instanceimage/InstanceImageDialog'
import { checkProcessDefaultPage } from '../../../../api/flow/index'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
window.addEventListener('storage', function (e) {
  if (e.key === 'isReload' && e.newValue === 'true') {
    window.getData()
  }
})
export default {
  mixins: [SearchListMixin],
  name:'stagingPersonalReturnTask',
  components: {
    QuickQuery,
    InstanceImageDialog
  },
  data () {
    return {
      headers: [
        {
          key: 'subject',
          name: this.$t('subject'),
          span: 6
        },
        {
          key: 'drafter',
          name: this.$t('applicant'),
          span: 4
        },
        {
          key: 'assigneesDisplayname',
          name: this.$t('approver'),
          span: 4
        },
        // {
        //   key: 'activityName',
        //   name: this.$t('approvalNode'),
        //   span: 4
        // },
        {
          key: 'processCnname',
          name: this.$t('processName'),
          span: 6
        },
        {
          name: this.$t('flowChart'),
          span: 4
        }
      ],
      dialogVisible: false,
      instanceId: ''
    }
  },
  mounted () {
    window.getData = this.getData
    this.getData()
  },
  methods: {
    // 快速获取数据
    quickQueryData () {
      this.loading = true
      quickReturnTaskList({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['reqno', 'subject', 'drafter', 'processCnname'],
        ...this.quickData,
        ...this.sort,
        ...this.page
      }).then(rt => {
        this.content = rt.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取数据
    getData () {
      this.loading = true
      quickReturnTaskList({
        logic: 'and',
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
    toFlow (item) {
      let routeData = {}
      checkProcessDefaultPage({
        processName: item.processName,
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
                  processName:item.taskdefinitionId,
                  index: item.index
                }
              })
            } else {
              // routeData = this.$router.resolve({
              //   name: 'processFormApprove',
              //   query: {
              //     name: item.processCnname,
              //     category: item.category,
              //     processName:item.taskdefinitionId,
              //     taskId: item.taskId
              //   }
              // })
             if (item.linkUrl.startsWith("http")) {
               routeData.href = `${item.linkUrl}?name=${item.processCnname}&category=${item.category}&processName=${item.taskdefinitionId}&taskId=${item.taskId}&index=${item.index}`;
              } else {
                routeData.href = `${window.location.origin +window.location.pathname+
                  item.linkUrl}?name=${item.processCnname}&category=${
                  item.category
                }&processName=${item.taskdefinitionId}&taskId=${item.taskId}&index=${item.index}`;
              }
            }
          // if (rt.data.isDefaultPage === 'Y') {
          //   routeData = this.$router.resolve({
          //     name: item.processId + 'Start',
          //     query: {
          //       name: item.processCnname,
          //       instanceId: item.instanceId
          //     }
          //   })
          // } else {
          //   routeData = this.$router.resolve({
          //     name: 'processFormStart',
          //     query: {
          //       name: item.processCnname,
          //       instanceId: item.instanceId
          //     }
          //   })
          // }
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
    getInstanceImage (id) {
      this.instanceId = id
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.item-liuchengtu{
  color: #888;
}
.item-liuchengtu:hover{
  color: #2d42af;
}
</style>
