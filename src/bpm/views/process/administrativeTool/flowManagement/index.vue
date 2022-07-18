<template>
  <el-card shadow="never" class="card-reset">
    <div v-loading="loading">
      <!--    表格-->
        <bas-table
          row-key="id"
          :tableList="content.list"
          :headerList="headerList"
          :pages="page"
          :headerCellStyle="{background: '#E1EAFD !important'}"
          selectType="checkbox"
          @selectionChange="handleSelectionChange"
          @currentChange="currentChange">
          <template #search>
            <div>
              <div class="tool-common-wrap">
                <div class="search-wrap">
                  <quick-query
                    :placeholder="$t('placeholderText.multipleFieldsPlaceholder32')"
                    :isDate="false"
                    ref="quick"
                    @quickSearch="quickSearch"
                  />
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
                @keyup.enter.native="search"
                ref="searchForm"
                label-width="120px"
                size="mini"
                v-if="isPowerSearch"
              >
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
                      <el-date-picker
                        v-model="searchForm.reqdate"
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
                      <el-select clearable v-model="searchForm.status" :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
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
            <div>{{row.assignees}}</div>
          </template>
          <!-- 当前节点 -->
          <template #processnodename="{ row }">
            <div>{{row.nodeAlias || row.processnodename}}</div>
          </template>
          <!-- 状态 -->
          <template #status="{ row }">
            <div>{{row.status}}</div>
          </template>
          <!-- 流程名字 -->
          <template #processnamecn="{ row }">
            <div>{{row.processnamecn}}</div>
          </template>
          <!-- 操作 -->
          <template #instid="{ row }">
            <el-tooltip class="item" effect="dark" :content="$t('edit')" placement="top" v-if="row.status === '审批中'">
                <el-button type="text" @click="toFlow(row)">{{ $t('edit') }}</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'路由'" placement="top" v-if="row.status === '审批中'">
                <el-button type="text" @click="handleRoute(row, '路由')">路由</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'暂停'" placement="top" v-if="row.status === '审批中'">
                <el-button type="text" @click="check(row, '暂停')">暂停</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'终止'" placement="top" v-if="row.status === '审批中'">
                <el-button type="text" @click="check(row, '终止')">终止</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="'启用'" placement="top" v-if="row.status === '暂停'">
                <el-button type="text" @click="check(row, '启用')">启用</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('activation')" placement="top" v-if="['已完成', '已终止'].includes(row.status)">
                <el-button type="text" @click="handleActivate(row)">{{ $t('activation') }}</el-button>
              </el-tooltip>
          </template>
        </bas-table>
    </div>
    <!-- <el-pagination
      style="margin-top: 15px"
      :page-size="page.pageSize"
      :current-page.sync="page.pageNum"
      background
      @current-change="searchType === 'power' ? getData() : quickQueryData()"
      :total="content.total"
    ></el-pagination> -->
  </el-card>
</template>

<script>
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import {
  cancelinstance,
  executeProcessInstance,
  getProcessList
} from "@/bpm/api/process/administrativeTool/flowManagement.js";
import { checkProcessDefaultPage } from "../../../../api/flow/index";
import {
  activate
} from '../../../../api/process/administrativeTool/processActive'
window.addEventListener("storage", function(e) {
  if (e.key === "isReload" && e.newValue === "true") {
    if (window.searchType === "power") {
      window.getData();
    } else {
      window.quickQueryData();
    }
  }
});
export default {
  name: "flowManagement",
  mixins: [SearchListMixin],
  components: {
    QuickQuery
  },
  data() {
    return {
      timer: null,
      loading: false,
      isPowerSearch: false,
      dialogVisible: false,
      reportList: [],
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
          value: "已终止",
          label: this.$t('terminated')
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
          name: this.$t('operation'),
          span: 2
        }
      ],
      content: {
        list: []
      },
      filters: [],
      sort: {},
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      checkAll: "",
      // 表头字段
      headerList: [
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
          sortable: true
        },
        {
          label: this.$t('currentNode'), // 当前节点
          prop: 'processnodename',
          slotName: 'processnodename',
          sortable: true
        },
        {
          label: this.$t('state'), // 状态
          prop: 'status',
          slotName: 'status',
          sortable: true
        },
        {
          label: this.$t('processName'), // 流程名
          prop: 'processnamecn',
          slotName: 'processnamecn',
          sortable: true
        },
        {
          label: this.$t('operation'), //
          prop: 'instid',
          slotName: 'instid',
          sortable: false,
          width: '180'
        }
      ]
    };
  },
  watch:{
    searchType(val){
      window.searchType = this.searchType
    }
  },
  mounted() {
    window.getData = this.getData;
    window.quickQueryData = this.quickQueryData;
    this.getData();
  },
  beforeDestroy() {
    clearTimeout(this.timer)
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
    // 复选框勾选事件
    handleSelectionChange(val) {
      console.log(val)
    },
    check(rowData, type) {
      this.$confirm(`您确定要${type}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleRoute(rowData, type)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },
    handleRoute(rowData, type) {
      if (type === "终止") {
        this.$loading();
        cancelinstance(rowData.instid)
          .then((rt) => {
            if (rt.status === "200") {
              this.$message.success('终止成功')
              localStorage.setItem("isReload", true);
              window.opener = null;
              window.open("", "_self");
              window.close();
              this.timer = setTimeout(() => {
                this.getData()
                this.$loading().close()
              }, 5000)
            }
          })
          .catch((er) => {
            this.$loading().close();
          });
      } else if (type === "暂停") {
        this.$loading();
        executeProcessInstance({
          handleType: "EHM-001",
          instanceId: rowData.instid,
        })
          .then((rt) => {

            if (rt.status === "200") {
              this.$message.success('暂停成功')
              localStorage.setItem("isReload", true);
              window.opener = null;
              window.open("", "_self");
              window.close();
              this.timer = setTimeout(() => {
                this.getData()
                this.$loading().close()
              }, 5000)
            }
          })
          .catch((er) => {
            this.$loading().close();
          });
      } else if (type === "启用") {
        this.$loading()
        executeProcessInstance({
          handleType: "EHM-002",
          instanceId: rowData.instid,
        })
          .then((rt) => {
            if (rt.status === "200") {
              this.$message.success('启用成功')
              localStorage.setItem("isReload", true);
              window.opener = null;
              window.open("", "_self");
              window.close();
              this.timer = setTimeout(() => {
                this.getData()
                this.$loading().close()
              }, 5000)
            }
          })
          .catch((er) => {
            this.$loading().close();
          });
      } else if (type === "路由") {
        let routeData = this.$router.resolve({
          name: "processRouting",
          query: {
            instanceId: rowData.instid,
          },
        });
        let a = document.createElement("a");
        // 给创建好的a标签赋值
        a.setAttribute("href", routeData.href);
        // 设置css 隐藏属性
        a.setAttribute("style", "display:none");
        // 设置 a标签为新窗口打开
        a.setAttribute("target", "_blank");
        // 将设置好的a标签，添加到 body 内
        document.body.appendChild(a);
        // 模拟点击
        a.click();
        // 移除a标签
        a.parentNode.removeChild(a);
        // window.open(routeData.href, "_blank");
      }
    },
    handleActivate (item) {
      this.$confirm(this.$t('hintText.areYouSureYouWantActivate'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          this.$loading()
          activate({ instid: item.instid, processNodeName: 'Start' }).then(rt => {
            if (rt.status === '200') {
              this.$message({
                message: this.$t('hintText.processActivatedSuccessfully'),
                type: 'success'
              })
              this.timer = setTimeout(() => {
                this.getData()
                this.$loading().close()
              }, 5000)

            } else {
              this.$message({
                message: this.$t('hintText.processActivationFailed'),
                type: 'error'
              })
            }
          })
        })
        .catch(_ => { })
    },
    quickQueryData() {
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
    saveSuccess(data) {
      if (data) {
        this.getData();
      }
    },
    toFlow(item) {
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
          this.getData()
        }
      });
    },
    getData() {
      this.loading = true;
      this.checkAll = false;
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
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSort(val) {
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
</style>
