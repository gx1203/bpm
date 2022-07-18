<template>
  <el-card shadow="never" class="card-reset">
    <div class="prompt">
      {{$t('NoteItCanBeProcessedAccordingToTheProcessOrTheOrderNumberRespectivelyTheProcessDataAfterSuccessfulProcessingCanOnlyBeSeenInTheAdministratorLogAllCleanedDataIsUnrecoverable')}}
    </div>
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" :disabled="selections.length === 0" @click="handleBatchDelete()">
          {{ $t('bpa_batchDelete') }}
        </el-button>
        <el-button type="primary" @click="handleAllDelete()">
          {{ $t('allDelete') }}
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
      <div class="radio">
        <el-radio v-model="quxian" label="1">{{$t('PurgeByProcess')}}</el-radio>
        <el-radio v-model="quxian" label="2">{{$t('ClearByOrderNumber')}}</el-radio>
      </div>
    </div>
    <div v-if="quxian === '1'">
      <div v-loading="loading">
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
              <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm"
                  label-width="120px" size="mini" v-if="isPowerSearch">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="$t('processName') + '：'">
                        <el-input clearable type="text" v-model="searchForm.processnamecn"></el-input>
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
            </div>
          </template>
          <!-- 流程名称 -->
          <template #processnamecn="{ row }">
            <div>{{ row.processnamecn }}</div>
          </template>
          <!-- 已发起流程数量 -->
          <template #applycount="{ row }">
            <div>{{ row.applycount }}</div>
          </template>
          <!-- 已完成数量 -->
          <template #finishcount="{ row }">
            <div>{{ row.finishcount }}</div>
          </template>
          <!-- 进行中数量 -->
          <template #runingcount="{ row }">
            <div>{{ row.runingcount }}</div>
          </template>
          <!-- 操作 -->
          <template #id="{ row }">
            <el-tooltip class="item" effect="dark" :content="$t('delete')">
              <el-button type="text" @click="handleDeleteOne(row)">{{ $t('delete') }}</el-button>
            </el-tooltip>
          </template>
        </bas-table>
      </div>

    </div>
    <div v-if="quxian === '2'">
      <div v-loading="loading">
        <!--    表格-->
        <bas-table
          row-key="id"
          :tableList="content.list"
          :headerList="singleHeaderList"
          :pages="page"
          selectType="checkbox"
          :headerCellStyle="{background: '#E1EAFD !important'}"
          @selectionChange="handleSelectionChange"
          @currentChange="currentChange">
          <template #search>
            <div>
              <el-form class="power-search" :model="searchForm" @keyup.enter.native="search" ref="searchForm"
        label-width="120px" size="mini" v-if="isPowerSearch">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('applicationNumber') + '：'">
              <el-input clearable type="text" v-model="searchForm.reqno"></el-input>
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
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('appDate') + '：'">
              <el-date-picker v-model="searchForm.reqdate" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00','23:59:59']" :range-separator="$t('placeholderText.to')"
                :start-placeholder="$t('placeholderText.startDate')" :end-placeholder="$t('placeholderText.endDate')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('approver') + '：'">
              <el-input clearable type="text" v-model="searchForm.assignees"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('currentNode') + '：'">
              <el-input clearable type="text" v-model="searchForm.processnodename"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('state') + '：'">
              <el-select clearable v-model="searchForm.status" :placeholder="$t('placeholderText.pleaseSelect')"
                class="w100">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('processName') + '：'">
              <el-input clearable type="text" v-model="searchForm.processnamecn"></el-input>
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
            </div>
          </template>
          <!-- 申请单号 -->
          <template #reqno="{ row }">
            <div>{{ row.reqno }}</div>
          </template>
          <!-- 主题 -->
          <template #subject="{ row }">
            <div>{{ row.subject }}</div>
          </template>
          <!-- 申请人 -->
          <template #drafter="{ row }">
            <div>{{ row.drafter }}</div>
          </template>
          <!-- 申请时间 -->
          <template #reqdate="{ row }">
            <div>{{row.reqdate | formatDateTime}}</div>
          </template>
          <!-- 审批人 -->
          <template #assignees="{ row }">
            <div>{{ row.assignees }}</div>
          </template>
          <!-- 当前节点 -->
          <template #processnodename="{ row }">
            <div>{{row.nodeAlias || row.processnodename}}</div>
          </template>
          <!-- 状态 -->
          <template #status="{ row }">
            <div>{{row.status}}</div>
          </template>
          <!-- 流程名 -->
          <template #processnamecn="{ row }">
            <div>{{row.processnamecn}}</div>
          </template>
          <!-- 操作 -->
          <template #id="{ row }">
            <el-tooltip class="item" effect="dark" :content="$t('delete')">
              <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(row)" />
            </el-tooltip>
          </template>
        </bas-table>
      </div>
      <!-- <el-pagination style="margin-top: 15px" :page-size="page.pageSize" :current-page.sync="page.pageNum" background
        @current-change="getData()" :total="content.total"></el-pagination> -->
    </div>
  </el-card>
</template>

<script>
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import { getProcessList } from "@/bpm/api/process/administrativeTool/flowManagement";
import { checkProcessDefaultPage } from "../../../../api/flow/index";
import { allClear, batchClear, queryDatacleanup } from "@/bpm/api/process/administrativeTool/dataClearning";
window.addEventListener("storage", function (e) {
  if (e.key === "isReload" && e.newValue === "true") {
    window.getData();
  }
});
export default {
  name: "dataCleaning",
  mixins: [SearchListMixin],
  components: {
    QuickQuery
  },
  data () {
    return {
      loading: false,
      isPowerSearch: false,
      quxian: '1',
      options: [
        {
          value: "",
          label: this.$t('all')
        },
        {
          value: "审批中",
          label: this.$t('beingProcessed')
        },
        {
          value: "已完成",
          label: this.$t('completed')
        },
        {
          value: "暂停",
          label: this.$t('pause')
        },
        {
          value: "终止",
          label: this.$t('termination')
        }
      ],
      searchForm: {},
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "reqno",
          name: this.$t('applicationNumber'),
          span: 3
        },
        {
          key: "subject",
          name: this.$t('subject'),
          span: 4
        },
        {
          key: "drafter",
          name: this.$t('applicant'),
          span: 3
        },
        {
          name: this.$t('approver'),
          span: 3
        },
        {
          name: this.$t('currentNode'),
          span: 3
        },
        {
          key: "status",
          name: this.$t('state'),
          span: 2
        },
        {
          key: "processnamecn",
          name: this.$t('processName'),
          span: 4
        },
        {
          key: "operation",
          name: this.$t('operation'),
          span: 2
        },

      ],
      content: {
        list: []
      },
      filters: [],
      sort: {},
      page: {
        pageNum: 1,
        pageSize: 10
      },
      checkAll: false,
      selections: [],
      // 表头字段
      headerList: [
        {
          label: this.$t('processName2'), // 流程名称
          prop: 'processnamecn',
          slotName: 'processnamecn',
          sortable: false
        },
        {
          label: this.$t('quantitycompletion'), // 已发起流程数量
          prop: 'applycount',
          slotName: 'applycount',
          sortable: false
        },
        {
          label: this.$t('amount'), // 已完成数量
          prop: 'finishcount',
          slotName: 'finishcount',
          sortable: false
        },
        {
          label: this.$t('processnumber'), // 进行中数量
          prop: 'runingcount',
          slotName: 'runingcount',
          sortable: false
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          width: '80',
          sortable: false
        }
      ],
      // 表头字段
      singleHeaderList: [
        {
          label: this.$t('applicationNumber'), // 申请单号
          prop: 'reqno',
          slotName: 'reqno',
          sortable: true
        },
        {
          label: this.$t('subject'), // 主题
          prop: 'subject',
          slotName: 'subject',
          sortable: true
        },
        {
          label: this.$t('applicant'), // 申请人
          prop: 'drafter',
          slotName: 'drafter',
          sortable: true
        },
        {
          label: this.$t('applicationDate'), // 申请时间
          prop: 'reqdate',
          slotName: 'reqdate',
          sortable: true
        },
        {
          label: this.$t('approver'), // 审批人
          prop: 'assignees',
          slotName: 'assignees',
          sortable: false
        },
        {
          label: this.$t('currentNode'), // 当前节点
          prop: 'processnodename',
          slotName: 'processnodename',
          sortable: false
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status',
          sortable: false
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          width: '80',
          sortable: false
        }
      ]
    };
  },
  watch: {
    searchType (val) {
      window.searchType = this.searchType
    },
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
    },
    quxian (val) {
      this.filters = []
      this.searchForm = {}
      this.sort = {}
      // this.$refs.table.clearSort()
      this.page.pageNum = 1
      this.isPowerSearch = false
      this.content = {
        list: []
      }
      this.getData();
    }
  },
  mounted () {
    window.getData = this.getData;
    // window.quickQueryData = this.quickQueryData;
    this.getData();
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
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let data = this.quxian === '1' ? { processNameList: [item.processname] } : this.quxian === '2' ? { instidList: [item.instid] } : {}
          batchClear(data).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.loading = false;
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    handleBatchDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          let data = this.quxian === '1' ? { processNameList: this.selections.map(item => item.processname) } : this.quxian === '2' ? { instidList: this.selections.map(item => item.instid) } : {}
          batchClear(data).then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.loading = false;
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
      this.$confirm(`<div>全部清除将清空系统内<span style="color:red;">所有流程数据</span>！ 是否确认删除？</div>`, this.$t('hintText.hint'), {
        type: 'warning',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.loading = true;
          allClear().then(rt => {
            if (rt.status === '200') {
              this.getData()
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: 'success'
              })
            } else {
              this.loading = false;
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    quickQueryData () {
      this.loading = true;
      getProcessList({
        logic: "or",
        queryFilter: [
          "reqno",
          "subject",
          "drafter",
          "assignees",
          "processnodename",
          "processnamecn"
        ],
        ...this.quickData,
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          this.content = rt.data;
          this.page.total = rt.data.total
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    toFlow (item) {
      let routeData = "";
      checkProcessDefaultPage({
        processName: item.processname,
        instanceId: item.instid
      }).then(rt => {
        if (rt.status === "200") {
          localStorage.setItem("isReload", false);
          if (rt.data.isDefaultPage === "Y") {

            routeData = this.$router.resolve({
              name: item.processname + "View",
              query: {
                name: item.processnamecn,
                instanceId: item.instid,
                type: "edit"
              }
            });
          } else {
            routeData = this.$router.resolve({
              name: "processFormView",
              query: {
                name: item.processnamecn,
                instanceId: item.instid,
                type: "edit"
              }
            });
          }
          // window.open(routeData.href, "_blank");
          let a = document.createElement("a");
          // 给创建好的a标签赋值
          a.setAttribute("href", routeData.href);
          // 设置css 隐藏属性
          a.setAttribute("style", "display:none");
          // 设置 a标签为新窗口打开
          a.setAttribute("target", "_blank");
          // 将设置好的a标签，{{ $t('add') }}到 body 内
          document.body.appendChild(a);
          // 模拟点击
          a.click();
          // 移除a标签
          a.parentNode.removeChild(a);
        }
      });
    },
    getData () {
      this.loading = true;
      this.checkAll = false;
      if (this.quxian === '1') {
        queryDatacleanup({
          logic: "and",
          filters: this.filters,
          ...this.sort,
          ...this.page
        })
          .then(rt => {
            rt.data.list.forEach(item => {
              item.checked = false;
            });
            this.content = rt.data;
            this.page.total = rt.data.total
            this.loading = false;
            this.$forceUpdate()
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        getProcessList({
          logic: "and",
          filters: this.filters,
          ...this.sort,
          ...this.page
        })
          .then(rt => {
            rt.data.list.forEach(item => {
              item.checked = false;
            });
            this.content = rt.data;
            this.page.total = rt.data.total
            this.loading = false;
            this.$forceUpdate()
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    handleSort (val) {
      this.sort = val;
      this.getData();
    }
  }
};
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

.prompt {
  margin-bottom: 10px;
  color: red;
}
</style>
