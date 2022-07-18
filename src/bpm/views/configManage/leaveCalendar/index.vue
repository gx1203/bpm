<template>
  <el-card shadow="never" class="card-reset">
    <div id="out-table" v-loading="loading">
      <!--    表格-->
        <bas-table
          row-key="id"
          :tableList="content.list"
          :headerList="headerList"
          :pages="page"
          :headerCellStyle="{background: '#E1EAFD !important'}"
          :isShowIndex="true"
          @selectionChange="handleSelectionChange"
          @currentChange="currentChange">
          <template #search>
            <div>
              <div class="tool-common-wrap">
                <div class="btn-wrap">
                  <el-button type="primary" @click="addList($t('addLeaveCalendar'))">
                    {{ $t('add') }}
                    <!---->
                  </el-button>
                  <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                    {{ $t('advancedQuery') }}
                    <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
                  </el-button>
                  <el-button type="primary" @click="getData">
                    {{ $t('refresh') }}
                    <!---->
                  </el-button>
                </div>
              </div>
              <el-form
                class="power-search"
                :model="searchForm"
                @keyup.enter.native="search"
                ref="searchForm"
                label-width="120px"
                size="mini"
                v-if="isPowerSearch"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('calendarName') + '：'">
                      <el-input clearable type="text" v-model="searchForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('state') + '：'" prop="state">
                      <el-radio v-model="searchForm.state" :label="0">{{$t('takeEffect')}}</el-radio>
                      <el-radio v-model="searchForm.state" :label="1">{{$t('loseEfficacy')}}</el-radio>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="$t('date') + '：'">
                      <el-row>
                        <el-col :span="11">
                          <el-date-picker
                            style="width:158px"
                            v-model="searchForm.startDate"
                            @change="changeStartDate"
                            value-format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期">
                          </el-date-picker>
                        </el-col>
                        <el-col :span="2" style="text-align: center;">
                          ~
                        </el-col>
                        <el-col :span="11">
                          <el-date-picker
                            style="width:158px;float: right;"
                            v-model="searchForm.endDate"
                            value-format="yyyy-MM-dd"
                            type="date"
                            @change="changeEndtime"
                            placeholder="选择日期">
                          </el-date-picker>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" class="text-r">
                    <el-button type="primary" @click="search">
                      {{ $t('query') }}
                    </el-button>
                    <el-button type="primary" @click="reset">
                      {{ $t('reset') }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </template>
          <!-- 日历名称 -->
          <template #name="{ row }">
            <div>{{ row.name }}</div>
          </template>
          <!-- 日期 -->
          <template #dateShow="{ row }">
            <div>{{ row.dateShow }}</div>
          </template>
          <!-- 状态 -->
          <template #stateShow="{ row }">
            <div>{{ row.stateShow }}</div>
          </template>
          <!-- 创建时间 -->
          <template #createon="{ row }">
            <div>{{ row.createon | formatDateTime }}</div>
          </template>
          <!-- 创建人 -->
          <template #createby="{ row }">
            <div>{{ row.createname }}</div>
          </template>
          <!-- 更新时间 -->
          <template #updateon="{ row }">
            <div>{{row.updateon | formatDateTime}}</div>
          </template>
          <!-- 最后更新人 -->
          <template #updateby="{ row }">
            <div>{{row.updatename}}</div>
          </template>
          <!-- 操作 -->
          <template #id="{ row }">
            <el-tooltip class="item" effect="dark" :content="$t('editLeaveCalendar')" placement="top">
                <el-button type="text" @click="addList($t('editLeaveCalendar'),row)">{{ $t('editLeaveCalendar') }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
                <el-button type="text" @click="deleteList(row)">{{ $t('delete') }}</el-button>
              </el-tooltip>
          </template>
        </bas-table>
    </div>
    <link-configuration-dialog
      v-model="dialogVisible"
      :item="editItem"
      :title="linkTitle"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import LinkConfigurationDialog from './LinkConfigurationDialog'
import {
  getHolidayCalendar,
  deleteHolidayCalendar
} from '@/bpm/api/configManage/leaveCalendar'
export default {
  name:'LeaveCalendarConfiguration',
  components: {
    LinkConfigurationDialog
  },
  inject: ['reload'],
  data () {
    return {
      dialogVisible: false,
      loading: false,
      filters: [],
      isPowerSearch: false,
      searchForm: {},
      linkTitle: '',
      editItem: {},
      headers: [
        {
          key: 'projectTypeCode',
          name: this.$t('projectName2'),
          span: 10
        },
        {
          key: 'projectTypeName',
          name: this.$t('projectDisplayName'),
          span: 10
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      content: {
        list: []
      },
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      selections: [],
      checkAll: '',
      // 表头字段
      headerList: [
        {
          label: this.$t('calendarName'), // 日历名称
          prop: 'name',
          slotName: 'name',
          sortable: true
        },
        {
          label: this.$t('date'), // 日期
          prop: 'dateShow',
          slotName: 'dateShow',
          sortable: true
        },
        {
          label: this.$t('state'), // 状态
          prop: 'stateShow',
          slotName: 'stateShow',
          sortable: true
        },
        {
          label: this.$t('createTime'), // 创建时间
          prop: 'createon',
          slotName: 'createon',
          sortable: true
        },
        {
          label: this.$t('creator'), // 创建人
          prop: 'createby',
          slotName: 'createby',
          sortable: true
        },
        {
          label: this.$t('updateTime'), // 更新时间
          prop: 'updateon',
          slotName: 'updateon',
          sortable: true
        },
        {
          label: this.$t('lastUpdator'), // 最后更新人
          prop: 'updateby',
          slotName: 'updateby',
          sortable: true
        },
        {
          label: this.$t('operation'), // 最后更新人
          prop: 'id',
          slotName: 'id',
          sortable: false
        }
      ]
    }
  },
  mounted () {
    this.getData()
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
    deleteList (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteHolidayCalendar(item.id).then(rt => {
            if (rt.status === '200') {
              this.getData()
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
    reset () {
      this.searchForm = {}
      this.search()
    },
    changeEndtime() {
      if (this.searchForm.startDate) {
        if (this.searchForm.endDate < this.searchForm.startDate) {
          this.$message({
            message: '结束时间不能小于开始时间!',
            type: 'warning'
          })
          this.searchForm.endDate = ''
          return false
        }
      }
    },
    changeStartDate() {
      if (this.searchForm.endDate) {
        if (this.searchForm.startDate > this.searchForm.endDate) {
          this.$message({
            message: '开始时间不能大于开始时间!',
            type: 'warning'
          })
          this.searchForm.startDate = ''
          return false
        }
      }
    },
    search () {
      this.getData()
    },
    addList (item, data) {
      this.linkTitle = item
      if (item === this.$t('addLeaveCalendar')) {
        this.editItem = {}
      } else if (item === this.$t('editLeaveCalendar')) {
        this.editItem = JSON.parse(JSON.stringify(data))
      }
      this.dialogVisible = true
    },
    saveSuccess (data) {
      if (data) {
        this.getData()
      }
    },
    getData () {
      this.loading = true
      this.checkAll = false
      getHolidayCalendar({
        ...this.sort,
        ...this.page,
        name: this.searchForm.name,
        state: this.searchForm.state,
        startDate: this.searchForm.startDate,
        endDate: this.searchForm.endDate
      })
        .then(rt => {
          if (rt.status === '200') {
            this.content = rt.data
            this.page.total = rt.data.total
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSort (val) {
      this.sort = val
      this.getData()
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
</style>
