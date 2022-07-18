<template>
  <el-card shadow="never" class="card-reset-inner">
    <div v-loading="loading">
      <!--    表格-->
      <bas-table
        row-key="id"
        :tableList="content.list"
        :headerList="headerList"
        :pages="page"
        :isShowIndex="false"
        @selectionChange="handleSelectionChange"
        @currentChange="currentChange">
        <template #search>
          <div>
            <div class="tool-common-wrap">
              <div class="search-wrap">
                <quick-query ref="quick" style="display:none" :is-date="false" @quickSearch="quickSearch" />
              </div>
              <div class="btn-wrap">
                <el-button type="primary" @click="addList($t('addPendingChanges'))">
                  {{ $t('add') }}
                  <!---->
                </el-button>
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
              ref="searchForm"
              class="power-search"
              :model="searchForm"
              label-width="120px"
              size="mini"
              @keyup.enter.native="powerSearch"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('changeUser') + '：'">
                    <el-input v-model="searchForm.oldusername" clearable type="text" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('replaceUser') + '：'">
                    <el-input v-model="searchForm.newusername" clearable type="text" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('owningProcess') + '：'">
                    <el-input v-model="searchForm.processnames" clearable type="text" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('modifiedDate') + '：'">
                    <el-date-picker
                      v-model="searchForm.changedate"
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
          </div>
        </template>
        <!-- 变更用户 -->
        <template #olduser="{ row }">
          <div>{{ row.olduser }}</div>
        </template>
        <!-- 替换用户 -->
        <template #newuser="{ row }">
          <div>{{ row.newuser }}</div>
        </template>
        <!-- 所属流程-->
        <template #processnames="{ row }">
          <div>{{ row.processnames }}</div>
        </template>
        <!-- 修改日期-->
        <template #changedate="{ row }">
          <div>{{ row.changedate | formatDate }}</div>
        </template>
      </bas-table>

    </div>
    <agents-change-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import agentsChangeDialog from './agentsChangeDialog'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { getBpmUserChange } from '@/bpm/api/process/administrativeTool/agents_change'

export default {
  components: {
    agentsChangeDialog,
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      editItem: {},
      isPowerSearch: false,
      dialogVisible: false,
      loading: false,
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'olduser',
          name: this.$t('changeUser'),
          span: 8
        },
        {
          key: 'newuser',
          name: this.$t('replaceUser'),
          span: 8
        },
        {
          key: 'processnames',
          name: this.$t('owningProcess'),
          span: 8
        }
      ],
      checkAll: '',
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 表头字段
      headerList: [
        {
          label: this.$t('changeUser'), // 变更用户
          prop: 'olduser',
          slotName: 'olduser',
          sortable: true
        },
        {
          label: this.$t('replaceUser'), // 替换用户
          prop: 'newuser',
          slotName: 'newuser',
          sortable: true
        },
        {
          label: this.$t('owningProcess'), // 所属流程
          prop: 'processnames',
          slotName: 'processnames',
          sortable: true
        },
        {
          label: this.$t('modifiedDate'), // 修改日期
          prop: 'changedate',
          slotName: 'changedate',
          sortable: true
        }
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.getData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    quickQueryData() {
      // this.loading = true
      // quickQueryCenterList({
      //   logic: 'or',
      //   filters: this.filters,
      //   ...this.sort,
      //   ...this.page
      // }).then(rt => {
      //   this.content = rt.data
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    saveSuccess(data) {
      if (data) {
        this.getData()
      }
    },
    addList(item, data) {
      if (item === this.$t('addPendingChanges')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {
          dataList: []
        }
      } else if (item === this.$t('editPendingChanges')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = data
      }
    },
    getData() {
      this.loading = true
      this.checkAll = false
      if (this.filters.findIndex(item => item.key === 'type') < 0) {
        this.filters.push({ key: 'type', opt: 'LIKE', type: 'S', value: '1' })
      }
      getBpmUserChange({
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
          this.page.total = rt.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.topCustom .card-reset-inner {
  ::v-deep > .el-card__body {
    padding: 10px 0 0 0!important;
  }
}

.card-reset-inner {
  ::v-deep > .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
.table-header {
  position: relative;
  background: $bc2;
  display: flex;
  align-items: center;
  .all-check {
    position: absolute;
    left: 20px;
  }
}
.w100 {
  width: 100%;
}
</style>
