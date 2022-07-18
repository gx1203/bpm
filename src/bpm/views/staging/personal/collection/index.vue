<template>
  <el-card shadow="never" class="card-reset">
    <div class="item-left">
      <tree-collection @confirm="treeHandle" />
    </div>
    <div
      v-if="treeData.leveltype === '1' || treeData.leveltype === '2'"
      class="item-right"
    >
      <!-- 表格 -->
      <bas-table
        row-key="id"
        :tableList="content.list"
        :headerList="headerList"
        :pages="page"
        @currentChange="currentChange"
      >
        <!-- 搜索和高级搜索区域 -->
        <template #search>
          <div>
            <div class="tool-common-wrap">
              <div class="search-wrap">
                <quick-query
                  ref="quick"
                  :placeholder="
                    $t('placeholderText.multipleFieldsPlaceholder4')
                  "
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
                    <el-input
                      v-model="searchForm.reqNo"
                      clearable
                      type="text"
                    />
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
              </el-row>
              <el-row>
                <el-col :span="16">
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

        <!-- 流程名 -->
        <template #processCnname="{ row }">
          <div class="link" @click="toFlow(row)">
            {{ row.processCnname }}
          </div>
        </template>

        <!-- 操作 -->
        <template #default="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('delete')"
            placement="top"
          >
            <el-button type="text" @click="handleDeleteOne(row)">{{
              $t('delete')
            }}</el-button>
          </el-tooltip>
        </template>
      </bas-table>
    </div>
  </el-card>
</template>

<script>
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import treeCollection from '@/bpm/components/treeCollection'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  name: 'BasPageBpmStagingPersonalCollection',
  components: {
    QuickQuery,
    treeCollection
  },
  mixins: [SearchListMixin],
  data() {
    return {
      dialogVisible: false,
      treeData: {},
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
          sortable: true
        },
        {
          label: this.$t('processName'), // 流程名
          prop: 'processCnname',
          slotName: 'processCnname',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'default',
          slotName: 'default'
        }
      ]
    }
  },
  mounted() {},
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
        this.filters[
          this.filters.findIndex(item => item.key === 'pid')
        ].value = this.treeData.id
      }
      this.$http({
        url: `/bpm/collection/quick-query`,
        method: 'POST',
        data: {
          logic: 'and',
          filters: this.filters,
          queryFilter: ['reqno', 'subject', 'processCnname'],
          ...this.quickData,
          ...this.sort,
          ...this.page
        }
      })
        .then(rt => {
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
        this.filters[
          this.filters.findIndex(item => item.key === 'pid')
        ].value = this.treeData.id
      }
      this.$http({
        url: `/bpm/collection/quick-query`,
        method: 'POST',
        data: {
          logic: 'and',
          filters: this.filters,
          ...this.sort,
          ...this.page
        }
      })
        .then(rt => {
          this.content = rt.data
          this.page.total = this.content.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDeleteOne(item) {
      // this.$confirm(`您确定要删除【${item.subject}】吗?`, this.$t('hintText.hint'), {
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.$http({
            url: `/bpm/collection/delete/${item.id}`,
            method: 'DELETE'
          }).then(() => {
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
      this.$http({
        url: `/bpm/process/checkProcessDefaultPage`,
        method: 'POST',
        data: {
          processName: item.processId,
          instanceId: item.instanceId
        }
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

<style lang="scss" scoped>
.el-card /deep/ .el-card__body {
  display: flex;
}
.item-left {
  box-sizing: border-box;
  width: 270px;
  padding-right: 20px;
}
.w100 {
  width: 100%;
}
.item-right {
  // width: calc(100% - 270px);
  flex: 1;
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
.container-test {
  background-color: skyblue;
  .el-card__body {
    height: 100% !important;
    background-color: yellow;
  }
}
</style>
