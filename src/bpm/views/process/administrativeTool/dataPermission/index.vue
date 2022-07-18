<template>
  <el-card shadow="never" class="card-reset">
   <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      selectType="checkbox"
      :headerCellStyle="{background: '#E1EAFD !important'}"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange">
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap">
              <quick-query
                ref="quick"
                :placeholder="$t('placeholderText.multipleFieldsPlaceholder37')"
                :is-date="false"
                @quickSearch="quickSearch"
              />
            </div>
            <div class="btn-wrap">
              <el-button type="primary" @click="addList($t('addDataPermissions'))">
                {{ $t('add') }}
                <!---->
              </el-button>
              <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
                {{ $t('batchDelete') }}
                <!--<i class="el-icon-circle-close" />-->
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
                <el-form-item :label="$t('menuName') + '：'">
                  <el-input v-model="searchForm.menuname" clearable type="text" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('conditionType') + '：'">
                  <el-select v-model="searchForm.conditiontype" clearable :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                    <el-option
                      v-for="item in conditiontypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('remarks') + '：'">
                  <el-input v-model="searchForm.comments" clearable type="text" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('state') + '：'">
                  <el-select v-model="searchForm.status" clearable :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
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
      <!-- 菜单名称 -->
      <template #menuname="{ row }">
        <div>{{ row.menuname }}</div>
      </template>
      <!-- 授权组织 -->
      <template #grantorgStr="{ row }">
        <div>{{ row.grantorgStr }}</div>
      </template>
      <!-- 权限 -->
      <template #menumethodStr="{ row }">
        <div>{{ row.menumethodStr }}</div>
      </template>
      <!-- 条件类型 -->
      <template #conditiontype="{ row }">
        <div>{{ row.conditiontype === '0' ? $t('byOrganizationalScope') : row.conditiontype === '1' ? $t('customCondition') : '' }}</div>
      </template>
      <!-- 备注 -->
      <template #comments="{ row }">
        <div>{{ row.comments }}</div>
      </template>
      <!-- 状态 -->
      <template #status="{ row }">
        <div>{{ row.status ==='0' ? $t('enable') : $t('disable') }}</div>
      </template>
       <!-- 操作 -->
      <template #id="{ row }">
        <el-tooltip class="item" effect="dark" :content="$t('edit')">
          <el-button type="text" @click="addList($t('editDataPermissions'),row)">{{ $t('edit') }}</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('delete')">
          <el-button type="text" @click="handleDeleteOne(row)">{{ $t('delete') }}</el-button>
        </el-tooltip>
      </template>
    </bas-table>
    <out-authorization-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import outAuthorizationDialog from './outAuthorizationDialog'
import QuickQuery from '@/bpm/components/quickquery/QuickQuery'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import { query, deleteauthority } from '@/bpm/api/process/administrativeTool/dataPermission.js'

export default {
  components: {
    outAuthorizationDialog,
    QuickQuery
  },
  mixins: [SearchListMixin],
  data() {
    return {
      isPowerSearch: false,
      dialogVisible: false,
      options: [
        {
          value: '0',
          label: '启用'
        },
        {
          value: '1',
          label: '禁用'
        }
      ],
      conditiontypeList: [
        {
          value: '0',
          label: this.$t('byOrganizationalScope')
        },
        {
          value: '1',
          label: this.$t('customCondition')
        }
      ],
      editItem: {},
      linkTitle: '',
      headers: [
        {
          key: 'menuname',
          name: this.$t('menuName'),
          span: 4
        },
        {
          name: this.$t('authorizedOrganization'),
          span: 3
        },
        {
          name: this.$t('authority'),
          span: 3
        },
        {
          key: 'conditiontype',
          name: this.$t('conditionType'),
          span: 3
        },
        {
          key: 'comments',
          name: this.$t('remarks'),
          span: 5
        },
        {
          key: 'status',
          name: this.$t('state'),
          span: 3
        },
        {
          name: this.$t('operation'),
          span: 3
        }
      ],
      selections: [],
      checkAll: '',
      quickSearchFilters: [
        {
          'key': 'menuname',
          'opt': 'LIKE',
          'type': 'S',
          'value': ''
        },
        {
          'key': 'comments',
          'opt': 'LIKE',
          'type': 'S',
          'value': ''
        }
      ],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 表头字段
      headerList: [
        {
          label: this.$t('menuName'), // 菜单名称
          prop: 'menuname',
          slotName: 'menuname',
          sortable: true
        },
        {
          label: this.$t('authorizedOrganization'), // 授权组织
          prop: 'grantorgStr',
          slotName: 'grantorgStr',
          sortable: true
        },
        {
          label: this.$t('authority'), // 权限
          prop: 'menumethodStr',
          slotName: 'menumethodStr',
          sortable: false
        },
        {
          label: this.$t('conditionType'), // 条件类型
          prop: 'conditiontype',
          slotName: 'conditiontype',
          sortable: true
        },
        {
          label: this.$t('remarks'), // 备注
          prop: 'comments',
          slotName: 'comments',
          sortable: true
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          sortable: false
        }
      ]
    }
  },
  watch: {
    'content.list': {
      handler(val) {
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
    checkAll(val) {
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
  mounted() {
    this.getData()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    handleDeleteOne(item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteauthority(item.id).then(rt => {
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
    handleAllDelete() {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      }).then(() => {
        deleteauthority(
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
      }).catch(_ => {

      })
    },
    quickQueryData() {
      this.loading = true
      for (let i = 0; i < this.quickSearchFilters.length; i++) {
        this.quickSearchFilters[i].value = this.quickData.searchData
      }
      query({
        logic: 'or',
        filters: this.quickSearchFilters,
        ...this.sort,
        ...this.page
      }).then(rt => {
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
    },
    saveSuccess(data) {
      if (data) {
        if (this.searchType === 'power') {
          this.getData()
        } else if (this.searchType === 'quick') {
          this.quickQueryData()
        }
      }
    },
    addList(item, data) {
      if (item === this.$t('addDataPermissions')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = {}
      } else if (item === this.$t('editDataPermissions')) {
        this.dialogVisible = true
        this.linkTitle = item
        this.editItem = data
      }
    },
    getData() {
      this.loading = true
      this.checkAll = false
      query({
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
