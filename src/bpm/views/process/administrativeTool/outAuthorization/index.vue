<template>
  <el-card shadow="never" class="card-reset">
    <div id="out-table" v-loading="loading">
      <!--    表格-->
      <bas-table
        row-key="id"
        :tableList="content.list"
        :headerList="headerList"
        :pages="page"
        selectType="checkbox"
        @selectionChange="handleSelectionChange"
        @currentChange="currentChange">
        <template #search>
          <div>
            <div class="tool-common-wrap">
              <div class="btn-wrap">
                <el-button type="primary" @click="handleAdd">
                  {{ $t('add') }}
                  <!---->
                </el-button>
                <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
                  {{ $t('batchDelete') }}
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
            <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm" label-width="120px"
              size="mini" v-if="isPowerSearch">
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('creator') + '：'">
                    <el-input clearable type="text" v-model="searchForm.creator"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('authorizer') + '：'">
                    <el-input clearable type="text" v-model="searchForm.grantor"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('agent') + '：'">
                    <el-input clearable type="text" v-model="searchForm.surrogate"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('startTime') + '：'">
                    <el-date-picker v-model="searchForm.startDate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
                      :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('endTime') + '：'">
                    <el-date-picker v-model="searchForm.endDate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
                      :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('takeTheTime') + '：'">
                    <el-date-picker v-model="searchForm.loseEfficacyDate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                      :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
                      :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('state') + '：'">
                    <el-select clearable type="text" v-model="searchForm.status">
                      <el-option value :label="$t('all')" />
                      <el-option v-for="(item, index) in statusArr" :key="index" :value="item.value" :label="item.label" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" class="text-r">
                  <el-button type="primary" @click="search">{{ $t('query') }}</el-button>
                  <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
        <!-- 创建人 -->
        <template #creator="{ row }">
          <div>{{ row.creator }}</div>
        </template>
        <!-- 授权人-->
        <template #grantor="{ row }">
          <div>{{ row.grantor }}</div>
        </template>
        <!-- 代理人-->
        <template #surrogate="{ row }">
          <div>{{ row.surrogate }}</div>
        </template>
        <!-- 开始时间-->
        <template #startDate="{ row }">
          <div>{{row.startDate | formatDateTime}}</div>
        </template>
        <!-- 结束时间-->
        <template #endDate="{ row }">
          <div>{{row.endDate | formatDateTime}}</div>
        </template>
        <!-- 收回时间 -->
        <template #loseEfficacyDate="{ row }">
          <div>{{row.loseEfficacyDate | formatDateTime}}</div>
        </template>
        <!-- 流程名称 -->
        <template #processNameCn="{ row }">
          <div>{{row.processNameCn}}</div>
        </template>
        <!-- 状态 -->
        <template #status="{ row }">
          <div>{{getStatusStr(row.status)}}</div>
        </template>
        <!-- 操作 -->
        <template #id="{ row }">
          <el-tooltip class="item" v-if="row.status==='INVALID'|| row.status==='VALID'" effect="dark"
            :content="$t('edit')" placement="top">
            <el-button type="text" @click="handleEdit(row)">{{ $t('edit') }}</el-button>
          </el-tooltip>
          <el-tooltip class="item" v-if="row.status==='VALID'" effect="dark"
            :content="$t('cancelAuthorization')" placement="top">
            <el-button type="text" @click="handleCancel(row)">{{ $t('cancelAuthorization') }}</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" v-if="row.status==='INVALID'" :content="$t('delete')"
            placement="top">
            <el-button type="text" @click="handleDeleteOne(row)">{{ $t('delete') }}</el-button>
          </el-tooltip>
        </template>
      </bas-table>
    </div>
    <!-- <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
      @current-change="getData" :total="content.total"></el-pagination> -->
    <!-- <p class="text-r">
      导出选项：
      <el-button type="text" icon="el-icon-sold-out" @click="exportExcel">Excel</el-button>
    </p> -->
    <edit-out-auth-dialog v-model="dialogVisible" :item="editItem" @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {
  getOutAuthList,
  getAdminOutAuthList,
  deleteOutAuth,
  saveOutAuth,
  batchDeleteOutAuth
} from '@/bpm/api/staging/tool/out_auth'
import EditOutAuthDialog from './outAuthorizationDialog'
import ExportExcel from '@/bpm/utils/xslx.js'
import SearchListMixin from '@/bpm/mixins/search_list_mixin'
export default {
  name: 'outAuthorization',
  mixins: [SearchListMixin],
  inject: ['reload'],
  components: {
    EditOutAuthDialog
  },
  data () {
    return {
      isPowerSearch: false,
      searchForm: {},
      sort: {},
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      content: {},
      filters: [],
      selections: [],
      checkAll: false,
      loading: true,
      dialogVisible: false,
      editItem: {},
      headers: [
        {
          key: 'creator',
          name: this.$t('creator'),
          span: 4
        },
        {
          key: 'grantor',
          name: this.$t('authorizer'),
          span: 4
        },
        {
          key: 'surrogate',
          name: this.$t('agent'),
          span: 4
        },
        {
          name: this.$t('processName2'),
          span: 6
        },
        {
          key: 'status',
          name: this.$t('state'),
          span: 4
        },
        {
          name: this.$t('operation'),
          span: 2
        }
      ],
      statusArr: [
        {
          label: this.$t('takeEffect'),
          value: 'VALID'
        },
        {
          label: this.$t('notActive'),
          value: 'INVALID'
        },
        {
          label: this.$t('retracted'),
          value: 'RECOVERY'
        },
        {
          label: this.$t('completed'),
          value: 'EXPIRED'
        }
      ],
      // 表头字段
      headerList: [
        {
          label: this.$t('creator'), // 创建人
          prop: 'creator',
          slotName: 'creator',
          sortable: true
        },
        {
          label: this.$t('authorizer'), // 授权人
          prop: 'grantor',
          slotName: 'grantor',
          sortable: true
        },
        {
          label: this.$t('agent'), // 代理人
          prop: 'surrogate',
          slotName: 'surrogate',
          sortable: true
        },
        {
          label: this.$t('startTime'), // 开始时间
          prop: 'startDate',
          slotName: 'startDate',
          sortable: true
        },
        {
          label: this.$t('endTime'), // 结束时间
          prop: 'endDate',
          slotName: 'endDate',
          sortable: true
        },
        {
          label: this.$t('takeTheTime'), // 收回时间
          prop: 'loseEfficacyDate',
          slotName: 'loseEfficacyDate',
          sortable: true
        },
        {
          label: this.$t('processName2'), // 流程名称
          prop: 'processNameCn',
          slotName: 'processNameCn',
          sortable: true
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status',
          sortable: true
        },
        {
          label: this.$t('operation'), //
          prop: 'id',
          slotName: 'id',
          sortable: false
        }
      ]
    }
  },
  watch: {
    "content.list": {
      handler (val) {
        let newArr = this.content.list.filter(x => x.status === "INVALID");
        if (
          this.content.list &&
          this.content.list.length !== 0 &&
          newArr.length > 0
        ) {
          this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < newArr.length; i++) {
            if (!newArr[i].checked) {
              this.checkAll = false;
            } else {
              this.selections.push(newArr[i]);
            }
          }
        }
      },
      deep: true
    },
    checkAll (val) {
      let newArr = this.content.list.filter(x => x.status === "INVALID");
      if (val) {
        this.content.list.forEach(item => {
          if (item.status === "INVALID") {
            item.checked = val;
          }
        });
      } else if (this.selections.length === newArr.length) {
        this.content.list.forEach(item => {
          if (item.status === "INVALID") {
            item.checked = val;
          }
        });
      }
    }
  },
  mounted () {
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
    getStatusStr (status) {
      const result = this.statusArr.find(item => item.value === status)
      return result ? result.label : '未知'
    },
    // 获取数据
    getData () {
      this.loading = true
      this.checkAll = false
      getAdminOutAuthList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
            if (item.processList) {
              item.processName = item.processList.map((item) => item.processName).join(',')
              item.processNameCn = item.processList.map((item) => item.processNameCn).join(',')
            }
          })
          this.content = rt.data
          this.page.total = rt.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 搜索
    search () {
      this.filters = []
      this.page.pageNum = 1;
      Object.keys(this.searchForm).forEach(key => {
        const filter = {
          key,
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm[key]
        }
        if (filter.key === 'status') {
          filter.opt = 'EQ'
        }
        if (key === 'startDate' || key === 'endDate' || key === 'loseEfficacyDate') {
          filter.type = 'D'
          filter.opt = 'BETWEEN'
          filter.value = this.searchForm[key]
            ? this.searchForm[key].join('~')
            : ''
        }
        this.filters.push(filter)
      })
      this.getData()
    },
    // 重置
    rest () {
      this.searchForm = {}
      this.search()
    },
    handleSort (val) {
      this.sort = val
      this.getData()
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          deleteOutAuth(item.id).then(rt => {
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
        .catch(_ => { })
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          batchDeleteOutAuth(
            this.selections.map(item => item.id).join(',')
          ).then(rt => {
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
        .catch(_ => { })
    },
    handleAdd () {
      this.editItem = {
        startDate: new Date()
      }
      this.dialogVisible = true
    },
    handleEdit (item) {
      this.editItem = JSON.parse(JSON.stringify(item))
      this.dialogVisible = true
    },
    handleCancel (item) {
      this.$confirm(this.$t('hintText.areYouSureCancelAuthorization'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          item.status = "RECOVERY"
          saveOutAuth(item).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfulAuthorizationCancellation'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('hintText.FailedToCancelAuthorization'),
                type: 'error'
              })
            }
          }).catch(() => {
            this.$message({
              message: this.$t('hintText.FailedToCancelAuthorization2'),
              type: 'error'
            })
          })
        })

    },
    saveSuccess (data) {
      if (data) {
        this.getData()
      }
    },
    exportExcel () {
      let content = Object.assign({}, this.content)
      const dataSource = content.list.map(item => {
        Object.keys(item).forEach(key => {
          // 后端传null node写入会有问题
          if (item[key] === null) {
            item[key] = ''
          }
          if (key === 'status') {
            item[key] = this.getStatusStr(item[key])
          }
          if (Array.isArray(item[key])) {
            item[key] = item[key].join(',')
          }
          if (key === 'startDate' || key === 'endDate') {
            item[key] = this.$options.filters.formatDateTime(item[key])
          }
        })
        return item
      })
      // const columns = this.headers.map(item => ({key: item.key,title: item.name}));
      const columns = [
        {
          key: 'creator',
          name: this.$t('creator'),
        },
        {
          key: 'grantor',
          name: this.$t('authorizer'),
        },
        {
          key: 'surrogate',
          name: this.$t('agent'),
        },
        {
          key: 'status',
          name: this.$t('state'),
        },
        {
          key: 'startDate',
          name: this.$t('startTime'),
        },
        {
          key: 'endDate',
          name: this.$t('endTime'),
        }
      ]
      ExportExcel(
        columns,
        dataSource,
        this.$t('goOutAuthorization') + `.xlsx`
      )
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
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
