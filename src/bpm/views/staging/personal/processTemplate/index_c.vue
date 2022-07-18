<template>
  <el-card shadow="never">
    <div class="tool-common-wrap">
      <div class="search-wrap">
        <quick-query :placeholder="$t('placeholderText.multipleFieldsPlaceholder7')" ref="quick" @quickSearch="quickSearch" />
      </div>
      <div class="btn-wrap">
        <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
          {{ $t('batchDelete') }}
          <!---->
        </el-button>·
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
      ref="powerSearchForm"
      label-width="120px"
      size="mini"
      v-if="isPowerSearch"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('templateName') + '：'">
            <el-input clearable type="text" v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item :label="$t('subject') + '：'">
            <el-input clearable type="text" v-model="searchForm.subject"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item :label="$t('processName') + '：'">
            <el-input clearable type="text" v-model="searchForm.processnameCn"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="8">
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="searchForm.createon"
              type="daterange"
              value-format="yyyy-MM-dd"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row> -->
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
        <div class="table-header margin-t10">
          <el-checkbox v-model="checkAll" class="all-check" />
          <sort-button style="flex-grow: 1" :items="headers" @sort="handleSort" />
        </div>
        <div v-if="content.list && content.list.length!==0">

        <div class="tr" v-for="(item, index) in content.list" :key="index">
          <div class="tr-title">
            <el-checkbox v-model="item.checked" style="margin-right: 10px" />
            <span>{{ $t('createTime') }}：{{item.createon | formatDateTime}}</span>
            <!-- <span style="margin-left: 60px">申请单号：{{item.reqNo}}</span> -->
          </div>
          <el-row class="tr-body" type="flex" align="middle">
            <el-col @click.native="toFlow(item)" class="td textHide link" :span="headers[0].span" :title="item.name">{{item.name}}</el-col>
            <!-- <el-col @click.native="toFlow(item)" class="td textHide link" :span="headers[1].span" :title="item.subject">{{item.subject}}</el-col> -->
            <el-col class="td textHide" :span="headers[1].span" :title="item.processCnname">
              <el-tooltip class="item" effect="dark" :content="$t('processName')" placement="top">
                <el-button type="text" @click="toFlow(item)">{{item.processCnname}}</el-button>
              </el-tooltip>
            </el-col>
            <el-col style="text-align: center" :span="headers[2].span">
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)"></el-button>
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
          current-row-key="id"
        >
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('templateName2')" show-overflow-tooltip sortable prop="name">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.name}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('subject')" show-overflow-tooltip sortable prop="subject">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.subject}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('processName')" show-overflow-tooltip sortable prop="processCnname">
            <template slot-scope="scope">
              <div class="link" @click="toFlow(scope.row)">{{scope.row.processCnname}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('createTime')" show-overflow-tooltip sortable prop="createon">
            <template slot-scope="scope">
              <div>{{scope.row.createon | formatDateTime}}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')"  width="60">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(scope.row)"></el-button>
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
  </el-card>
</template>

<script>
import {
  getProcessTemplateList,
  quickQueryProcessTemplateList,
  deleteProcessTemplate,
  batchDeleteProcessTemplate
} from '../../../../api/staging/personal/process_template'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { checkProcessDefaultPage } from '../../../../api/flow/index'

window.addEventListener('storage', function (e) {
  if (e.key === 'isReloadTemplate' && e.newValue === 'true') {
    window.getTemplate()
  }
})
export default {
  mixins: [SearchListMixin],
  name:'stagingPersonalProcessTemplate',
  components: {
    QuickQuery
  },
  data () {
    return {
      selections: [],
      checkAll: false,
      headers: [
        {
          key: 'name',
          name: this.$t('templateName2'),
          span: 10
        },
        // {
        //   key: 'subject',
        //   name: this.$t('subject'),
        //   span: 8
        // },
        {
          key: 'processCnname',
          name: this.$t('processName'),
          span: 10
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ]
    }
  },
  watch: {
    'content.list': {
      handler (val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true
          this.selections = []
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false
            } else {
              this.selections.push(this.content.list[i])
            }
          }
        }
      },
      deep: true
    },
    checkAll (val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val
          })
        }
      }
    }
  },
  mounted () {
    window.getTemplate = this.getData
    this.quickQueryData()
  },
  methods: {
    // 快速获取数据
    quickQueryData () {
      this.loading = true
      this.checkAll = false

      quickQueryProcessTemplateList({
        logic: 'or',
        filters: this.filters,
        queryFilter: ['name', 'subject', 'processnameCn'],
        ...this.quickData,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
            rt.data.list.forEach(item => {
              item.checked = false
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
      this.checkAll = false
      quickQueryProcessTemplateList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
          })
          this.content = rt.data
          this.loading = false
          localStorage.setItem('isReloadTemplate', false)
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDeleteOne (item) {
      // this.$confirm(`您确定要删除【${item.name}】吗?`, this.$t('hintText.hint'), {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteProcessTemplate(item.id).then(rt => {
            if (rt.status === '200') {
              if (this.searchType === 'power') {
                this.getData()
              } else if (this.searchType === 'quick') {
                this.quickQueryData()
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => {})
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          batchDeleteProcessTemplate(
            this.selections.map(item => item.id).join(',')
          ).then(rt => {
            if (rt.status === '200') {
              if (this.searchType === 'power') {
                this.getData()
              } else if (this.searchType === 'quick') {
                this.quickQueryData()
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => {})
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
              name: item.processName + 'Start',
              query: {
                name: item.processCnname,
                bizId: item.businessId,
                stencilId: item.id,
                processName: item.processName,
                projectName: item.projectName,
                pid: item.defOrg
              }
            })
          } else {
            routeData = this.$router.resolve({
              name: 'processFormStart',
              query: {
                name: item.processCnname,
                bizId: item.businessId,
                stencilId: item.id,
                processName: item.processName,
                projectName: item.projectName,
                pid: item.defOrg
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
}
</script>
<style lang="scss" scoped>
</style>
