<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :placeholder="$t('placeholderText.multipleFieldsPlaceholder9')" ref="quick" @quickSearch="quickSearch" />
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
    <el-form
      class="power-search"
      :model="searchForm"
      @keyup.enter.native="powerSearch"
      label-width="120px"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('applicationNumber') + '：'">
            <el-input clearable type="text" v-model="searchForm.reqNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('processName') + '：'">
            <el-input clearable type="text" v-model="searchForm.attribute1"></el-input>
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
        <el-col :span="8">
          <el-form-item :label="$t('receiver') + '：'">
            <el-input clearable type="text" v-model="searchForm.readerUserName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('applicationDate') + '：'">
            <el-date-picker
              v-model="searchForm.createDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('ccTime') + '：'">
            <el-date-picker
              v-model="searchForm.passReadTime"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00','23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
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
    <div class="tableWrap" v-loading="loading">
      <div v-if="$store.state.app.tableStyle ==='default'">
        <sort-button :items="headers" @sort="handleSort" />
        <div v-if="content.list && content.list.length!==0">
          <div class="tr" v-for="(item, index) in content.list" :key="index">
            <div class="tr-title">
              <span>{{ $t('appDate') }}：{{item.createDate | formatDateTime}}</span>
              <span>{{ $t('ccTime') }}：{{item.passReadTime | formatDateTime}}</span>
              <span style="margin-left: 60px">
                {{ $t('applicationNumber') }}：
                <el-button type="text" @click="toFlow(item)">{{item.reqNo}}</el-button>
              </span>

            <span style="margin-left: 60px" :title='item.comments' class="tr-title-comments" v-if="item.comments">
              {{item.comments}}
            </span>
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col class="td textHide" :span="headers[0].span" :title="item.attribute1">
                <el-button type="text" @click="toFlow(item)">{{item.attribute1}}</el-button>
              </el-col>
              <el-col
                @click.native="toFlow(item)"
                class="td textHide"
                :span="headers[1].span"
                :title="item.subject"
              > <el-button type="text" @click="toFlow(item)">{{item.subject}}</el-button></el-col>
              <el-col
                class="td textHide"
                :span="headers[2].span"
                :title="item.drafter"
              >{{item.drafter}}</el-col>
              <el-col
                class="td textHide"
                :span="headers[3].span"
                :title="item.readerUserName"
              >{{item.readerUserName}}</el-col>
              <el-col style="text-align: center" :span="headers[4].span">
                <el-tooltip class="item" effect="dark" :content="$t('carbonCopy')" placement="top">
                  <el-button type="text" @click="handleRound(item)">
                    <i class="iconfont icon-chuanyue2" style="font-size: 20px"></i>
                  </el-button>
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-else class="text-c pad-10px tr-empty"> {{ $t('noData') }}</div>
      </div>
      <div v-else>
        <el-table
          :data="content.list"
          class="margin-t10"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          @sort-change="elHandleSort"
          current-row-key="instanceId"
        >
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
          <el-table-column :label="$t('applicationDate')" show-overflow-tooltip sortable prop="createDate">
            <template slot-scope="scope">
              <div>{{scope.row.createDate | formatDateTime}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('receiver')" show-overflow-tooltip sortable prop="readerUserName">
            <template slot-scope="scope">
              <div>{{scope.row.readerUserName}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ccTime')" show-overflow-tooltip sortable prop="passReadTime">
            <template slot-scope="scope">
              <div>{{scope.row.passReadTime | formatDateTime}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('processName')" show-overflow-tooltip sortable prop="attribute1">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.attribute1}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')"  width="80">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="$t('carbonCopy')" placement="top">
                  <el-button type="text" @click="handleRound(scope.row)">
                    <i class="iconfont icon-chuanyue2" style="font-size: 20px"></i>
                  </el-button>
                </el-tooltip>
            </template>
          </el-table-column>
        </el-table> 
	    </div>
    </div>
    <el-pagination
      class="margin-t15"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"
    ></el-pagination>
      <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"/>
  </el-card>
</template>

<script>
import {
  mypassread
} from "@/bpm/api/staging/personal/process_circulated";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import { checkProcessDefaultPage } from "../../../../api/flow/index";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";

import { circulate } from '@/bpm/api/staging/personal/process_trace'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
export default {
  mixins: [SearchListMixin],
  name: "myCC",
  components: {
    QuickQuery,
    BasComponent
  },
  data() {
    return {
      checkItem: {},
      headers: [
        {
          name: this.$t('processName'),
          span: 6
        },
        {
          key: "subject",
          name: this.$t('subject'),
          span: 6
        },
        {
          key: "drafter",
          name: this.$t('applicant'),
          span: 4
        },
        {
          key: "readerUserName",
          name: this.$t('receiver'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      organieationShow:false,
      selectedElement: {},
      showElement:[],
      selectElement: ["9"],
      orgtitle: this.$t('placeholderText.selectCarbonCopyRecipients'),
      instanceId: ""
    };
  },
  mounted() {
    window.getData = this.getData;
    this.getData();
  },
  methods: {
    handleRound (item) {
      this.selectedElement = {};
      this.organieationShow = true
      this.checkItem = item
    },
    // 快速获取数据
    quickQueryData() {
      this.loading = true;
      mypassread({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['reqno', 'attribute1','subject','drafter','readerUserName'],
        ...this.quickData,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    fnBasOrganieationCallBack(data) {
      if(data.id&&data.id.length>0){
        this.loading = true
        circulate(this.checkItem.instanceId, data.id).then(rt => {
          this.loading = false
          if (rt.status === '200') {
            this.organieationShow = false;
            this.getData()
            this.$message.success(this.$t('hintText.operateSuccessfully'))
          }
        }).catch(er => {
          this.loading = false
        })
      }
    },
    // 获取数据
    getData() {
      this.loading = true;
      mypassread({
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.content = rt.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    toFlow(item) {
      let routeData = ''
      checkProcessDefaultPage({
        processName: item.processName,
        instanceId: item.instanceId
      }).then(rt => {
        if (rt.status === '200') {
          if (rt.data.isDefaultPage === 'Y') {
            routeData = this.$router.resolve({
              name: item.processName + 'View',
              query: {
                name: item.attribute1,
                instanceId: item.instanceId
              }
            })
          } else {
            routeData = this.$router.resolve({
              name: 'processFormView',
              query: {
                name: item.attribute1,
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
  }
};
</script>

<style scoped>
</style>
