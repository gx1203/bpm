<template>
  <el-card shadow="never" class="card-reset">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="handleAdd">
          {{ $t('add') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="selections.length === 0"
          @click="handleAllDelete"
        >
          {{ $t('batchDelete') }}
        </el-button>
        <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t('advancedQuery') }}
          <i
            :class="
              isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
          />
        </el-button>
        <el-button type="primary" @click="getData">
          {{ $t('refresh') }}
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
          <el-form-item :label="$t('creator') + '：'">
            <el-input
              clearable
              type="text"
              v-model="searchForm.creator"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('authorizer') + '：'">
            <el-input
              clearable
              type="text"
              v-model="searchForm.grantor"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('agent') + '：'">
            <el-input
              clearable
              type="text"
              v-model="searchForm.surrogate"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('startTime') + '：'">
            <el-date-picker
              v-model="searchForm.startDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('endTime') + '：'">
            <el-date-picker
              v-model="searchForm.endDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('takeTheTime') + '：'">
            <el-date-picker
              v-model="searchForm.loseEfficacyDate"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :range-separator="$t('placeholderText.to')"
              :start-placeholder="$t('placeholderText.startDate')"
              :end-placeholder="$t('placeholderText.endDate')"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('state') + '：'">
            <el-select clearable type="text" v-model="searchForm.status">
              <el-option value :label="$t('all')" />
              <el-option
                v-for="(item, index) in statusArr"
                :key="index"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="text-r">
          <el-button type="primary" @click="search">
            {{ $t('query') }}
          </el-button>
          <el-button type="primary" @click="rest">
            {{ $t('reset') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div id="out-table" v-loading="loading">
      <div v-if="$store.state.app.tableStyle === 'default'">
        <div class="table-header margin-t10">
          <el-checkbox v-model="checkAll" class="all-check" />
          <sort-button
            style="flex-grow: 1"
            :items="headers"
            @sort="handleSort"
          />
        </div>
        <div v-if="content.list && content.list.length !== 0">
          <div class="tr" v-for="(item, index) in content.list" :key="index">
            <div class="tr-title">
              <el-checkbox
                v-model="item.checked"
                :disabled="item.status !== 'INVALID'"
                style="margin-right: 10px"
              />
              <span
                >{{ $t('startTime') }}：{{
                  item.startDate | formatDateTime
                }}</span
              >
              <span style="margin-left: 60px"
                >{{ $t('endTime') }}：{{ item.endDate | formatDateTime }}</span
              >
              <span style="margin-left: 60px" v-if="item.loseEfficacyDate"
                >{{ $t('takeTheTime') }}：{{
                  item.loseEfficacyDate | formatDateTime
                }}</span
              >
            </div>
            <el-row class="tr-body" type="flex" align="middle">
              <el-col
                class="td textHide"
                :span="headers[0].span"
                :title="item.creator"
                >{{ item.creator }}</el-col
              >
              <el-col
                class="td textHide"
                :span="headers[1].span"
                :title="item.grantor"
                >{{ item.grantor }}</el-col
              >
              <el-col
                class="td textHide"
                :span="headers[2].span"
                :title="item.surrogate"
                >{{ item.surrogate }}</el-col
              >
              <el-col
                class="td textHide"
                :span="headers[3].span"
                :title="item.processNameCn"
                >{{ item.processNameCn }}
              </el-col>
              <el-col
                class="td textHide"
                :span="headers[4].span"
                :title="getStatusStr(item.status)"
              >
                {{ getStatusStr(item.status) }}</el-col
              >
              <el-col style="text-align: center" :span="headers[5].span">
                <el-tooltip
                  class="item"
                  v-if="item.status === 'INVALID' || item.status === 'VALID'"
                  effect="dark"
                  :content="$t('edit')"
                  placement="top"
                >
                  <el-button type="text" @click="handleEdit(item)">{{
                    $t('edit')
                  }}</el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  v-if="item.status === 'VALID'"
                  effect="dark"
                  :content="$t('cancelAuthorization')"
                  placement="top"
                >
                  <el-button type="text" @click="handleCancel(item)">{{
                    $t('cancelAuthorization')
                  }}</el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="item.status === 'INVALID'"
                  :content="$t('delete')"
                  placement="top"
                >
                  <el-button type="text" @click="handleDeleteOne(item)">{{
                    $t('delete')
                  }}</el-button>
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
          :header-cell-style="{ background: '#E1EAFD !important' }"
          highlight-current-row
          current-row-key="id"
        >
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox
                :disabled="scope.row.status !== 'INVALID'"
                v-model="scope.row.checked"
              />
            </template>
            <template slot="header">
              <el-checkbox v-model="checkAll" />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('creator')"
            show-overflow-tooltip
            sortable
            prop="creator"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.creator }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('authorizer')"
            show-overflow-tooltip
            sortable
            prop="grantor"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.grantor }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('agent')"
            show-overflow-tooltip
            sortable
            prop="surrogate"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.surrogate }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('startTime')"
            show-overflow-tooltip
            sortable
            prop="startDate"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.startDate | formatDateTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('endTime')"
            show-overflow-tooltip
            sortable
            prop="endDate"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.endDate | formatDateTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('takeTheTime')"
            show-overflow-tooltip
            sortable
            prop="loseEfficacyDate"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.loseEfficacyDate | formatDateTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('state')"
            show-overflow-tooltip
            sortable
            prop="status"
          >
            <template slot-scope="scope">
              <div>{{ getStatusStr(scope.row.status) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('processName2')"
            show-overflow-tooltip
            sortable
            prop="processNameCn"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.processNameCn }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" width="120">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                v-if="
                  scope.row.status === 'INVALID' || scope.row.status === 'VALID'
                "
                effect="dark"
                :content="$t('edit')"
                placement="top"
              >
                <el-button type="text" @click="handleEdit(scope.row)">{{
                  $t('edit')
                }}</el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                v-if="scope.row.status === 'VALID'"
                effect="dark"
                :content="$t('cancelAuthorization')"
                placement="top"
              >
                <el-button type="text" @click="handleCancel(scope.row)">{{
                  $t('cancelAuthorization')
                }}</el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                v-if="scope.row.status === 'INVALID'"
                :content="$t('delete')"
                placement="top"
              >
                <el-button type="text" @click="handleDeleteOne(scope.row)">{{
                  $t('delete')
                }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="getData"
      :total="content.total"
    ></el-pagination>
    <!-- <p class="text-r">
      导出选项：
      <el-button type="text" icon="el-icon-sold-out" @click="exportExcel">Excel</el-button>
    </p> -->

    <!-- 表格 -->
    <!-- <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      @currentChange="getData"
    >

      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="btn-wrap">
              <el-button type="primary" @click="handleAdd">
                {{ $t('add') }}
              </el-button>
              <el-button
                type="primary"
                :disabled="selections.length === 0"
                @click="handleAllDelete"
              >
                {{ $t('batchDelete') }}
              </el-button>
              <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{ $t('advancedQuery') }}
                <i
                  :class="
                    isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                  "
                />
              </el-button>
              <el-button type="primary" @click="getData">
                {{ $t('refresh') }}
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
                <el-form-item :label="$t('creator') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.creator"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('authorizer') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.grantor"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('agent') + '：'">
                  <el-input
                    clearable
                    type="text"
                    v-model="searchForm.surrogate"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('startTime') + '：'">
                  <el-date-picker
                    v-model="searchForm.startDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('endTime') + '：'">
                  <el-date-picker
                    v-model="searchForm.endDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('takeTheTime') + '：'">
                  <el-date-picker
                    v-model="searchForm.loseEfficacyDate"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    :range-separator="$t('placeholderText.to')"
                    :start-placeholder="$t('placeholderText.startDate')"
                    :end-placeholder="$t('placeholderText.endDate')"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('state') + '：'">
                  <el-select clearable type="text" v-model="searchForm.status">
                    <el-option value :label="$t('all')" />
                    <el-option
                      v-for="(item, index) in statusArr"
                      :key="index"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="search">
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

      <template #id="{ row }">
        <el-checkbox
          :disabled="row.status !== 'INVALID'"
          v-model="row.checked"
        />
      </template>


      <template #startDate="{ row }">
        <div>{{ row.startDate | formatDateTime }}</div>
      </template>


      <template #endDate="{ row }">
        <div>{{ row.endDate | formatDateTime }}</div>
      </template>


      <template #loseEfficacyDate="{ row }">
        <div>{{ row.loseEfficacyDate | formatDateTime }}</div>
      </template>


      <template #status="{ row }">
        <div>{{ getStatusStr(row.status) }}</div>
      </template>


      <template #default="{ row }">
        <el-tooltip
          class="item"
          v-if="row.status === 'INVALID' || row.status === 'VALID'"
          effect="dark"
          :content="$t('edit')"
          placement="top"
        >
          <el-button type="text" @click="handleEdit(row)">{{
            $t('edit')
          }}</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          v-if="row.status === 'VALID'"
          effect="dark"
          :content="$t('cancelAuthorization')"
          placement="top"
        >
          <el-button type="text" @click="handleCancel(row)">{{
            $t('cancelAuthorization')
          }}</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          v-if="row.status === 'INVALID'"
          :content="$t('delete')"
          placement="top"
        >
          <el-button type="text" @click="handleDeleteOne(row)">{{
            $t('delete')
          }}</el-button>
        </el-tooltip>
      </template>
    </bas-table> -->

    <edit-out-auth-dialog
      v-model="dialogVisible"
      :item="editItem"
      @confirm="saveSuccess"
    />
  </el-card>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {
  getOutAuthList,
  deleteOutAuth,
  saveOutAuth,
  batchDeleteOutAuth
} from '../../../../api/staging/tool/out_auth'

import SearchListMixin from '@/bpm/mixins/search_list_mixin'
import EditOutAuthDialog from './EditOutAuthDialog'
import ExportExcel from '../../../../utils/xslx.js'
export default {
  mixins: [SearchListMixin],
  inject: ['reload'],
  name: 'stagingToolOutAuth',
  components: {
    EditOutAuthDialog
  },
  data() {
    return {
      isPowerSearch: false,
      searchForm: {},
      sort: {},
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
      headerList: [
        {
          label: '', // 复选框
          prop: 'id',
          slotName: 'id'
        },
        {
          label: this.$t('creator'), // 创建人
          prop: 'creator',
          sortable: true
        },
        {
          label: this.$t('authorizer'), // 授权人
          prop: 'grantor',
          sortable: true
        },
        {
          label: this.$t('agent'), // 代理人
          prop: 'surrogate',
          sortable: true
        },
        {
          label: this.$t('startTime'), // 开始时间
          prop: 'startDate',
          slotName: 'startDate',
          sortable: true,
          width: 120
        },
        {
          label: this.$t('endTime'), // 结束时间
          prop: 'endDate',
          slotName: 'endDate',
          sortable: true,
          width: 120
        },
        {
          label: this.$t('takeTheTime'), // 收回时间
          prop: 'loseEfficacyDate',
          slotName: 'loseEfficacyDate',
          sortable: true,
          width: 120
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status',
          sortable: true,
          width: 80
        },
        {
          label: this.$t('processName2'), // 流程名称
          prop: 'processNameCn',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'default',
          slotName: 'default',
          width: 70
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
      pickerOptions0: {
        disabledDate: time => {
          if (this.item.endDate) {
            return time.getTime() > new Date(this.item.endDate).getTime()
          } else {
            //还没有选择结束时间的时候，让他只能选择今天之后的时间包括今天
            // return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.item.startDate) {
            return time.getTime() < new Date(this.item.startDate).getTime() //可以选择同一天
          }
        }
      }
    }
  },
  watch: {
    'content.list': {
      handler(val) {
        let newArr = this.content.list.filter(x => x.status === 'INVALID')
        if (
          this.content.list &&
          this.content.list.length !== 0 &&
          newArr.length > 0
        ) {
          this.checkAll = true
          this.selections = []
          for (let i = 0; i < newArr.length; i++) {
            if (!newArr[i].checked) {
              this.checkAll = false
            } else {
              this.selections.push(newArr[i])
            }
          }
        }
      },
      deep: true
    },
    checkAll(val) {
      let newArr = this.content.list.filter(x => x.status === 'INVALID')
      if (val) {
        this.content.list.forEach(item => {
          if (item.status === 'INVALID') {
            item.checked = val
          }
        })
      } else if (this.selections.length === newArr.length) {
        this.content.list.forEach(item => {
          if (item.status === 'INVALID') {
            item.checked = val
          }
        })
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
      if (this.searchType === 'power') {
        this.getData()
      } else {
        this.quickQueryData()
      }
    },
    getStatusStr(status) {
      const result = this.statusArr.find(item => item.value === status)
      return result ? result.label : '未知'
    },
    // 获取数据
    getData() {
      this.loading = true
      this.checkAll = false
      getOutAuthList({
        logic: 'and',
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false
            if (item.processList) {
              item.processName = item.processList
                .map(item => item.processName)
                .join(',')
              item.processNameCn = item.processList
                .map(item => item.processNameCn)
                .join(',')
            }
          })
          this.content = rt.data
          this.page.total = this.content.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 搜索
    search() {
      this.filters = []
      this.page.pageNum = 1
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
        if (
          key === 'startDate' ||
          key === 'endDate' ||
          key === 'loseEfficacyDate'
        ) {
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
    rest() {
      this.searchForm = {}
      this.search()
    },
    handleSort(val) {
      this.sort = val
      this.getData()
    },
    handleDeleteOne(item) {
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
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
        .catch(_ => {})
    },
    handleAllDelete() {
      this.$confirm(
        this.$t('hintText.areYouSureDeleteSelectedData'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      )
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
        .catch(_ => {})
    },
    handleAdd() {
      this.editItem = {
        grantor: this.$store.state.basuser.user.displayname,
        grantorUid: this.$store.state.basuser.user.id,
        startDate: new Date(),
        endDate: ''
      }
      this.dialogVisible = true
    },
    handleEdit(item) {
      this.editItem = JSON.parse(JSON.stringify(item))
      this.dialogVisible = true
    },
    handleCancel(item) {
      this.$confirm(
        this.$t('hintText.areYouSureCancelAuthorization'),
        this.$t('hintText.hint'),
        {
          type: 'warning'
        }
      ).then(() => {
        item.status = 'RECOVERY'
        saveOutAuth(item)
          .then(rt => {
            if (rt.status === '200') {
              this.$message({
                message: this.$t(
                  'hintText.successfulAuthorizationCancellation'
                ),
                type: 'success'
              })
              this.getData()
            } else {
              this.$message({
                message: this.$t('hintText.FailedToCancelAuthorization'),
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.$message({
              message: this.$t('hintText.FailedToCancelAuthorization2'),
              type: 'error'
            })
          })
      })
    },
    saveSuccess(data) {
      if (data) {
        this.getData()
      }
    },
    exportExcel() {
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
          name: this.$t('creator')
        },
        {
          key: 'grantor',
          name: this.$t('authorizer')
        },
        {
          key: 'surrogate',
          name: this.$t('agent')
        },
        {
          key: 'status',
          name: this.$t('state')
        },
        {
          key: 'startDate',
          name: this.$t('startTime')
        },
        {
          key: 'endDate',
          name: this.$t('endTime')
        }
      ]
      ExportExcel(columns, dataSource, this.$t('goOutAuthorization') + `.xlsx`)
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
