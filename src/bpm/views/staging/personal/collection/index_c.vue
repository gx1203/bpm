<template>
  <el-card shadow="never">
    <div class="item-left">
      <tree-collection @confirm="treeHandle" />
    </div>
    <div v-if="treeData.leveltype === '1' || treeData.leveltype === '2'" class="item-right">
      <div class="tool-common-wrap">
        <div class="search-wrap">
          <quick-query ref="quick" :placeholder="$t('placeholderText.multipleFieldsPlaceholder4')" @quickSearch="quickSearch" />
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
        v-if="isPowerSearch"
        class="power-search"
        :model="searchForm"
        label-width="120px"
        @keyup.enter.native="powerSearch"
      >
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
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item :label="$t('applicationDate') + '：'">
              <el-date-picker
                v-model="searchForm.reqDate"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00','23:59:59']"
                :range-separator="$t('placeholderText.to')"
                :start-placeholder="$t('placeholderText.startDate')"
                :end-placeholder="$t('placeholderText.endDate')"
              />
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
          <sort-button :items="headers" @sort="handleSort" />
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
                <el-col
                  class="td textHide link"
                  :span="headers[0].span"
                  :title="item.subject"
                  @click.native="toFlow(item)"
                >
                  {{ item.subject }}
                </el-col>
                <el-col class="td textHide" :span="headers[1].span" :title="item.processCnname">
                  <el-button type="text" @click="toFlow(item)">
                    {{ item.processCnname }}
                  </el-button>
                </el-col>
                <el-col style="text-align: center" :span="headers[2].span">
                  <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                    <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(item)" />
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
                <div class="link" :class="scope.row.urge === 'Y' ? 'urge' : ''" @click="toFlow(scope.row)">{{scope.row.subject}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('applicationDate')" show-overflow-tooltip sortable prop="reqDate">
              <template slot-scope="scope">
                <div>{{scope.row.reqDate | formatDateTime}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('processName')" show-overflow-tooltip sortable prop="processCnname">
              <template slot-scope="scope">
                <div class="link" @click="toFlow(scope.row)">{{scope.row.processCnname}}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('operation')"  width="80">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                  <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(scope.row)" />
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
        :total="content.total"
        @current-change="searchType === 'power' ? getData() : quickQueryData()"
      />
    </div>
  </el-card>
</template>

<script>
import {
  getCollectionList,
  quickQueryCollectionList,
  deleteCollection
} from '../../../../api/staging/personal/collection'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import treeCollection from '@/bpm/components/treeCollection'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { checkProcessDefaultPage } from '../../../../api/flow/index'
export default {
  name: 'StagingPersonalCollection',
  components: {
    QuickQuery,
    treeCollection
  },
  mixins: [SearchListMixin],
  data() {
    return {
      headers: [
        {
          key: 'subject',
          name: this.$t('subject'),
          span: 12
        },
        {
          key: 'processCnname',
          name: this.$t('processName'),
          span: 10
        },
        {
          name: this.$t('operation'),
          span: 2
        }
      ],
      dialogVisible: false,
      treeData: {},
      instanceId: ''
    }
  },
  mounted() {},
  methods: {
    treeHandle(data) {
      this.treeData = data
      if (this.searchType === 'power') {
        this.getData()
      } else if (this.searchType === 'quick') {
        this.quickQueryData()
      }
    },
    // 快速获取数据
    quickQueryData() {
      this.loading = true
      if (this.filters.findIndex(item => item.key === 'leveltype') < 0) {
        this.filters.push(
          {
            key: 'pid',
            logic: 'AND',
            opt: 'EQ',
            value: this.treeData.id
          },
          { key: 'leveltype', logic: 'AND', opt: 'EQ', value: '3' }
        )
      } else {
        this.filters[this.filters.findIndex(item => item.key === 'pid')].value = this.treeData.id
      }
      quickQueryCollectionList({
        logic: 'and',
        filters: this.filters,
        queryFilter: ['reqno', 'subject', 'processCnname'],
        ...this.quickData,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取数据
    getData() {
      this.loading = true
      if (this.filters.findIndex(item => item.key === 'leveltype') < 0) {
        this.filters.push(
          {
            key: 'pid',
            logic: 'AND',
            opt: 'EQ',
            value: this.treeData.id
          },
          { key: 'leveltype', logic: 'AND', opt: 'EQ', value: '3' }
        )
      } else {
        this.filters[this.filters.findIndex(item => item.key === 'pid')].value = this.treeData.id
      }
      quickQueryCollectionList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDeleteOne(item) {
      // this.$confirm(`您确定要删除【${item.subject}】吗?`, this.$t('hintText.hint'), {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteCollection(item.id).then(() => {
            if (this.searchType === 'power') {
              this.getData()
            } else if (this.searchType === 'quick') {
              this.quickQueryData()
            }
          })
        })
        .catch(_ => {})
    },
    toFlow(item) {
      let routeData = ''
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
                instanceId: item.instanceId,
                type: 'collection'
              }
            })
          } else {
            routeData = this.$router.resolve({
              name: 'processFormView',
              query: {
                name: item.processCnname,
                instanceId: item.instanceId,
                type: 'collection'
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
    }
  }
}
</script>

<style  lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.w100 {
  width: 100%;
}
.item-right {
  float: right;
  width: 78%;
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 10px;
    }
    .td {
      text-align: left;
    }
  }
}
</style>
