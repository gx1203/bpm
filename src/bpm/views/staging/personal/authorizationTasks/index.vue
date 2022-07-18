<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query ref="quick" @quickSearch="quickSearch" />
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
      ref="powerSearchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationNumber') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqno"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('subject') + '：'">
            <el-input clearable type="text" v-model="searchForm.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicant') + '：'">
            <el-input clearable type="text" v-model="searchForm.createuser"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationDate') + '：'">
            <el-date-picker
              v-model="searchForm.reqdate"
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
          <el-form-item :label="$t('approver') + '：'">
            <el-input clearable type="text" v-model="searchForm.applyuser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('receiptTime') + '：'">
            <el-date-picker
              v-model="searchForm.receipttime"
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
        <el-col :span="8">
          <el-form-item :label="$t('state') + '：'">
            <el-input clearable type="text" v-model="searchForm.status"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('processName') + '：'">
            <el-input clearable type="text" v-model="searchForm.processnamecn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('approvalNode') + '：'">
            <el-input clearable type="text" v-model="searchForm.applynodename"></el-input>
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
      <sort-button :items="headers" @sort="handleSort"/>
      <div v-if="content.list && content.list.length!==0">

      <div class="tr" v-for="(item, index) in content.list" :key="index">
        <div class="tr-title">
          <span>{{ $t('applicationDate') }}：{{item.reqdate}}</span>
          <span style="margin-left: 60px">{{ $t('applicationNumber') }}：
            <el-button type="text" @click="toFlow(item)">{{item.reqno}}</el-button></span>

          <span style="margin-left: 60px" :title='item.comments' class="tr-title-comments" v-if="item.comments">
            {{item.comments}}
          </span>
        </div>
        <el-row class="tr-body" type="flex" align="middle">
          <el-col @click.native="toFlow(item)" class="td textHide link" :span="headers[0].span" :title="item.title">{{item.title}}</el-col>
          <el-col class="td textHide" :span="headers[1].span" :title="item.createuser">{{item.createuser}}</el-col>
          <el-col class="td textHide" :span="headers[2].span" :title="item.applyuser">{{item.applyuser}}</el-col>
          <el-col class="td textHide" :span="headers[3].span" :title="item.receipttime">{{item.receipttime}}</el-col>
          <el-col class="td textHide" :span="headers[4].span" :title="item.applynodename">{{item.applynodename}}</el-col>
          <el-col class="td textHide" :span="headers[5].span" :title="item.status">{{item.status}}</el-col>
          <el-col class="td textHide" :span="headers[6].span" :title="item.processnamecn"><el-button type="text" @click="toFlow(item)">{{item.processnamecn}}</el-button></el-col>
          <el-col style="text-align: center" :span="headers[7].span">
            <el-button type="text" @click="getInstanceImage(item.instid)">
              <i class="iconfont icon-liuchengtu" style="font-size: 20px"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
      </div>
    <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>

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
import { getAuthorizationTaskList, quickQueryAuthorizationTaskList } from '../../../../api/staging/personal/authorization_task'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import InstanceImageDialog from '@/bpm/components/instanceimage/InstanceImageDialog'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  mixins: [SearchListMixin],
  components: {
    QuickQuery,
    InstanceImageDialog
  },
  data () {
    return {
      headers: [
        {
          key: 'title',
          name: this.$t('subject'),
          span: 6
        },
        {
          key: 'createuser',
          name: this.$t('applicant'),
          span: 3
        },
        {
          key: 'applyuser',
          name: this.$t('approver'),
          span: 3
        },
        {
          key: 'receipttime',
          name: this.$t('receiptTime'),
          span: 3
        },
        {
          key: 'applynodename',
          name: this.$t('approvalNode'),
          span: 4
        },

        {
          key: 'status',
          name: this.$t('state'),
          span: 3
        },

        {
          key: 'processnamecn',
          name: this.$t('processName'),
          span: 2
        },
        {
          name: this.$t('flowChart'),
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
      quickQueryAuthorizationTaskList({
        logic: 'or',
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
    // 获取数据
    getData () {
      this.loading = true
      getAuthorizationTaskList({
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
      // this.$router.push({
      //   name: 'processFormView',
      //   query: {
      //     name: item.attribute1,
      //     instanceId: item.instanceId
      //   }
      // })
      let routeData = this.$router.resolve({
        name: 'processFormView',
        query: {
          name: item.processnamecn,
          instanceId: item.instid
        }
      })
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
