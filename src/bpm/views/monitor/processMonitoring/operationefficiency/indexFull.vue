<template>
  <el-card id="operationefficiency" shadow="never" style="background: transparent;height: 80vh">
    <!--    <div class="item-left">-->
    <!--      &lt;!&ndash; <treeProcessFlow ref="tree" type="1" @confirm="handleNodeClick"/> &ndash;&gt;-->
    <!--      <BasProcessTree showView="1" @confirm="handleNodeClick" />-->
    <!--    </div>-->

    <div class="item-right">
      <!-- v-if="treeData.type === '1' || treeData.type === '2'" -->
      <el-form ref="searchForm" label-width="120px" size="mini" style="float: right">

        <div style="display: inline-block">
          <el-form-item :label="$t('startTime') + '：'" style="display: inline-block;">
            <el-date-picker
              @change="getData"
              v-model="startyear"
              type="year"
              :placeholder="$t('placeholderText.selectYear')"
              :picker-options="startpickerOptions"
            />
          </el-form-item>
          <el-form-item label="~" label-width="35px" style="display: inline-block">
            <el-date-picker
              @change="getData"
              v-model="endyear"
              type="year"
              :placeholder="$t('placeholderText.selectYear')"
              :picker-options="endpickerOptions"
            />
          </el-form-item>
        </div>
        <div style="display: inline-block;margin-left: 20px">
<!--          <span class="choose-process-title">{{ $t('selectProcess') }}</span>-->

<!--          <el-popover >-->
<!--            <BasProcessTree showView="3" @confirm="handleNodeClick" />-->
<!--            <div slot="reference" class="choose-process" @click="isViewDialog=true">-->
<!--              {{ treeData.modelname? treeData.modelname:'点击选择'}}-->
<!--            </div>-->
<!--          </el-popover>-->

          <el-button type="primary" @click="getProcessEfficiencyList()">
            {{ $t("refresh") }}
            <!---->
          </el-button>
        </div>

      </el-form>
      <el-card id="twistingNumber" shadow="never"  style="background: transparent;clear: right">
<!--        <div class="tool-common-wrap">-->
<!--          <div class="btn-wrap">-->
<!--            <el-button type="primary" @click="getProcessEfficiencyList()">-->
<!--              {{ $t("refresh") }}-->
<!--              &lt;!&ndash;&ndash;&gt;-->
<!--            </el-button>-->
<!--          </div>-->
<!--        </div>-->
        <div class="analyse-content">
        <div class="tree-list">
          <el-scrollbar style="height: 100%;">
            <BasProcessTree style="margin:0 10px" showView="3" @confirm="handleNodeClick" />
          </el-scrollbar>
        </div>
        <div class="chartsBg1" v-if="showitem" >
          <echar
            class="echar-suk"
            :option="option"
            @echartsClick="echartsClick"
          />
        </div>
        </div>
      </el-card>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="80%">
      <div class="tool-common-wrap">
        <div class="search-wrap">
          <quick-query
            ref="quick"
            :isDate="false"
            :placeholder="$t('placeholderText.toDoTasksPlaceholder')"
            @quickSearch="quickSearch"
          />
        </div>
        <div class="btn-wrap">
          <!-- <el-button
          :disabled="selections.length === 0"
          type="primary"
          @click="commentVisible = true"
        >
          {{ $t("batchApproval") }}
        </el-button> -->
          <!-- <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
          {{ $t("advancedQuery") }}
          <i
            :class="
              isPowerSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
            "
          />
        </el-button> -->
          <el-button type="primary" @click="rest">
            {{ $t("refresh") }}
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
            <el-form-item :label="$t('processName') + '：'">
              <el-input
                v-model="searchForm.processCnname"
                clearable
                type="text"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('applicationNumber') + '：'">
              <el-input v-model="searchForm.reqNo" clearable type="text"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('subject') + '：'">
              <el-input v-model="searchForm.subject" clearable type="text"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('applicant') + '：'">
              <el-input v-model="searchForm.drafter" clearable type="text"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item :label="$t('receiptTime') + '：'">
              <el-date-picker
                v-model="searchForm.assignedDate"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                :range-separator="$t('placeholderText.to')"
                :start-placeholder="$t('placeholderText.startDate')"
                :end-placeholder="$t('placeholderText.endDate')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('agenttype') + '：'">
              <el-select v-model="searchForm.category" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="text-r">
            <el-button type="primary" @click="powerSearch">
              {{ $t("query") }}
            </el-button>
            <el-button type="primary" @click="rest">
              {{ $t("reset") }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        :data="content.list"
        class="margin-t10"
        stripe
        :header-cell-style="{ background: '#E1EAFD !important' }"
        highlight-current-row
        @sort-change="elHandleSort"
        current-row-key="taskId"
      >
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-checkbox
              :disabled="scope.row.isbatchapproval === 'N'"
              v-model="scope.row.checked"
            />
          </template>
          <template slot="header">
            <el-checkbox v-model="checkAll"/>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('applicationNumber')"
          show-overflow-tooltip
          sortable
          prop="reqNo"
        >
          <template slot-scope="scope">
            <div class="link" @click="toFlow(scope.row)">
              {{ scope.row.reqNo }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('subject')"
          show-overflow-tooltip
          sortable
          prop="subject"
        >
          <template slot-scope="scope">
            <div
              class="link"
              :class="scope.row.urge === 'Y' ? 'urge' : ''"
              @click="toFlow(scope.row)"
            >
              {{ scope.row.subject }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('applicant')"
          show-overflow-tooltip
          sortable
          prop="drafter"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.drafter }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('applicationDate')"
          show-overflow-tooltip
          sortable
          prop="reqDate"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.reqDate | formatDateTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('approvalNode')"
          show-overflow-tooltip
          prop="activityName"
        >
          <template slot-scope="scope">
            <div>{{ checknam }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('agenttype')"
          show-overflow-tooltip
          prop="category"
        >
          <template slot-scope="scope">
            <div>{{ showname }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('receiptTime')"
          show-overflow-tooltip
          sortable
          prop="assignedDate"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.assignedDate | formatDateTime }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('processName')"
          show-overflow-tooltip
          sortable
          prop="processCnname"
        >
          <template slot-scope="scope">
            <div class="link" @click="toFlow(scope.row)">
              {{ scope.row.processCnname }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('flowChart')" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getInstanceImage(scope.row.instanceId)"
            >
              <el-tooltip :content="$t('view')" placement="top">
                <i
                  class="iconfont icon-liuchengtu item-liuchengtu"
                  style="font-size: 20px"
                />
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="content.total"
        class="margin-t15"
        :page-size="page.pageSize"
        :current-page.sync="page.pageNum"
        background
        :total="content.total"
        @current-change="
          searchType === 'power' ? getProcessEfficiencyList() : quickQueryData()
        "
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
        >确 定</el-button
        >
      </span>
      <!-- <approvalComment
      v-model="commentVisible"
      :item="selections"
      @confirm="getData"
    /> -->
    </el-dialog>
    <InstanceImageDialog v-model="show" :instance-id="instanceId"/>
<!--    <el-dialog :visible.sync="isViewDialog" :title="$t('selectProcess')">-->
<!--      <BasProcessTree showView="3" @confirm="handleNodeClick"/>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--      <el-button type="primary" @click="isViewDialog=false">{{ $t('confirm') }}</el-button>-->
<!--    </span>-->
<!--    </el-dialog>-->
  </el-card>
</template>
<script>
import Vue from "vue";
import BasProcessTree from "bas-component";
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import {checkProcessDefaultPage} from "@/bpm/api/flow/index";
import InstanceImageDialog from "@/bpm/components/instanceimage/InstanceImageDialog";
import {
  getApproveList,
  quickQueryApproveList,
  taskExists,
} from "@/bpm/api/staging/personal/approve_list";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";

Vue.use(BasProcessTree);
import echar from "@/bpm/components/echarts/echarts";
import approvalComment from "./approvalComment";
// import treeProcessFlow from '@/bpm/components/treeProcessFlow'
import {
  getProcessEfficiency,
  getProcessEfficiencyList,
} from "@/bpm/api/monitor/index.js";
import {createNamespacedHelpers} from "vuex";

const {mapGetters, mapActions} = createNamespacedHelpers("app");
export default {
  name: "correspondingPeriod",
  components: {
    QuickQuery,
    InstanceImageDialog,
    echar,
    approvalComment,
    // treeProcessFlow
  },
  mixins: [SearchListMixin],
  data() {
    return {
      isViewDialog: false,
      selections: [],
      options: [
        {
          value: "TODO",
          label: this.$t("normaltodo"),
        },
        {
          value: "TRANSFER",
          label: this.$t("administrativetodo"),
        },
        {
          value: "MORE_APPROVE",
          label: this.$t("communicationtodo"),
        },
      ],
      showname: "",
      showitem: false,
      instanceId: "",
      show: false,
      checkAll: false,
      page: {
        pageSize: 10,
        pageNum: 1,
        total: "",
      },
      checkname: "",
      checknam: "",
      checktype: "",
      content: {},
      dialogVisible: false,
      startyear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endyear: new Date(new Date().setFullYear(new Date().getFullYear())),
      treeData: {},
      option: {},
      zcData: [],
      jqData: [],
      zbData: [],
      bhData: [],
      typelist: [],
      startpickerOptions: "",
      endpickerOptions: "",
    };
  },
  watch: {
    "content.list": {
      handler(val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i]);
            }
          }
        }
      },
      deep: true,
    },
    checkAll(val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach((item) => {
            item.checked = val;
          });
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach((item) => {
            item.checked = val;
          });
        }
      }
    },
  },
  mounted() {
    // this.endpickerOptions = time.getTime() > Date.parse(this.startyear);
    // this.startpickerOptions = time.getTime() < Date.parse(this.endyear);
    this.changeOptions();
  },
  methods: {
    changeOptions() {
      let sy = this.startyear;
      let ey = this.endyear;
      this.startpickerOptions = {
        disabledDate(time) {
          return time.getTime() > Date.parse(ey);
        },
      };
      this.endpickerOptions = {
        disabledDate(time) {
          return time.getTime() < Date.parse(sy);
        },
      };
    },
    ...mapActions(["requireApproveCount"]),
    // 快速获取数据
    quickQueryData() {
      console.log(123132);
      this.loading = true;
      this.checkAll = false;
      let id = "";
      let name = "";
      if (this.treeData.type === "1") {
        id = this.treeData.id;
        name = this.treeData.modelname;
      } else if (this.treeData.type === "2") {
        id = this.treeData.pid;
        name = this.treeData.name;
      }
      getProcessEfficiencyList({
        activityName: this.checknam,
        processId: id,
        type: this.checktype,
        logic: "or",
        attr: {
          platform: "PC",
        },
        filters: this.filters,
        queryFilter: [
          "reqno",
          "subject",
          "drafter",
          "activityName",
          "processCnname",
        ],
        query: {
          ...this.quickData,
          ...this.sort,
          ...this.page,
          queryFilter: [
            "reqno",
            "subject",
            "drafter",
            "activityName",
            "processCnname",
          ],
        },
      })
        .then((rt) => {
          rt.data.list.forEach((item) => {
            item.checked = false;
            if (item.category) {
              if (item.category === "MORE_APPLY") {
                item.activityName = "退回修改";
              } else if (item.category === "MORE_APPROVE") {
                item.activityName = item.activityName + "-加签";
              }
            }
          });
          this.content = rt.data;
          this.requireApproveCount();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getInstanceImage(id) {
      this.instanceId = id;
      this.show = true;
    },
    toFlow(item) {
      let routeData = {};
      taskExists(item.taskId, item.index).then((rt) => {
        if (!rt.data) {
          this.$message.error(this.$t("hintText.taskDoesNotExist"));
          return;
        }
        checkProcessDefaultPage({
          processName: item.processId,
          instanceId: item.instanceId,
        }).then((rt) => {
          if (rt.status === "200") {
            if (rt.data.isDefaultPage === "Y") {
              routeData = this.$router.resolve({
                name: item.processId + "Approve",
                query: {
                  name: item.processCnname,
                  taskId: item.taskId,
                  category: item.category,
                  // processName: item.taskdefinitionId,
                  processName: item.processId,
                  index: item.index,
                },
              });
            } else {
              // routeData = this.$router.resolve({
              //   path: item.linkUrl,
              //   query: {
              //     name: item.processCnname,
              //     category: item.category,
              //     processName:item.taskdefinitionId,
              //     taskId: item.taskId
              //   }
              // })
              if (item.linkUrl.startsWith("http")) {
                routeData.href = `${item.linkUrl}?name=${item.processCnname}&category=${item.category}&processName=${item.processId}&taskId=${item.taskId}&index=${item.index}`;
              } else {
                routeData.href = `${
                  window.location.origin +
                  window.location.pathname +
                  item.linkUrl
                }?name=${item.processCnname}&category=${
                  item.category
                }&processName=${item.processId}&taskId=${item.taskId}&index=${
                  item.index
                }`;
              }
            }
            // window.open(routeData.href, "_blank");
            const a = document.createElement("a");
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
          }
        });
      });
    },
    getProcessEfficiencyList() {
      let id = "";
      let name = "";
      if (this.treeData.type === "1") {
        id = this.treeData.id;
        name = this.treeData.modelname;
      } else if (this.treeData.type === "2") {
        id = this.treeData.pid;
        name = this.treeData.name;
      }
      getProcessEfficiencyList({
        activityName: this.checknam,
        beginYear: this.startyear.toString().split(" ")[3],
        endYear: this.endyear.toString().split(" ")[3],
        processId: id,
        type: this.checktype,
        query: {
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize,
          ...this.quickData,
          queryFilter: [
            "reqno",
            "subject",
            "drafter",
            "activityName",
            "processCnname",
          ],
        },
      }).then((rt) => {
        this.content = rt.data;
        this.page.total = rt.data.total;
        console.log(this.page);
      });
    },
    echartsClick(param) {
      this.checknam = param.name;
      this.showname = param.seriesName;
      this.page.pageNum = 1;
      if (param.seriesName == "正常") {
        this.checktype = "tongguo";
      }
      if (param.seriesName == "加签") {
        this.checktype = "jiaqian";
      }
      if (param.seriesName == "转办") {
        this.checktype = "zhuanban";
      }
      if (param.seriesName == "驳回") {
        this.checktype = "bohui";
      }
      this.$nextTick(() => {
        this.getProcessEfficiencyList();
        this.dialogVisible = true;
      });
    },
    getData() {
      this.showitem = true;
      this.changeOptions()
      let id = "";
      let name = "";
      if (this.treeData.type === "1") {
        id = this.treeData.id;
        name = this.treeData.modelname;
      } else if (this.treeData.type === "2") {
        id = this.treeData.pid;
        name = this.treeData.name;
      }
      getProcessEfficiency({
        activityName: name,
        beginYear: this.startyear.toString().split(" ")[3],
        endYear: this.endyear.toString().split(" ")[3],
        processId: id,
        type: "",
      }).then((rt) => {
        this.typelist = [];
        this.zcData = [];
        this.jqData = [];
        this.zbData = [];
        this.bhData = [];
        let data = rt.data.activitiList;
        if (data.length === 0) {
          this.typelist = [];
          this.zcData = [];
          this.jqData = [];
          this.zbData = [];
          this.bhData = [];
        } else {
          data.forEach((e) => {
            this.typelist.push(e.activityname);
            this.zcData.push(e.tongguo);
            this.jqData.push(e.jiaqian);
            this.zbData.push(e.zhuanban);
            this.bhData.push(e.bohui);
          });
        }
        this.initEchar();
      });
    },
    refreshData() {
    },
    initEchar() {
      this.option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
          formatter: function (params, ticket, callback) {
            let allcount =
              params[0].value +
              params[1].value +
              params[2].value +
              params[3].value;
            let obj = params.map((item, index) => {
              if (item.value == undefined || item.value !== item.value) {
                item.value = 0;
              }
              let percent = ((item.value / allcount) * 100).toFixed(0);
              // 小圆点显示
              let dotColor =
                '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
                item.color +
                '"></span>';
              return (
                dotColor +
                item.seriesName +
                ":" +
                item.value +
                "(" +
                percent +
                "%" +
                ")" +
                "</br>"
              );
            });
            return obj.join(""); // 去除','
          },
        },
        legend: {
          data: [
            this.$t("normal"),
            this.$t("communicationtodo"),
            this.$t("administrativetodo"),
            this.$t("rejected"),
          ],
          textStyle: {//图例文字的样式
            color: '#1bb4f6',
          }
        },
        grid: {
          left: "60",
          right: "50",
          bottom: "100",
        },
        xAxis: [
          {
            type: "category",
            data: this.typelist,
            axisLine: {
              lineStyle: {
                color: "#397cbc",
              },
            },
            axisLabel: {
              color: "#30eee9",
              interval: 0,
              rotate: "45",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: false,
            },
            axisLabel: {
              color:'#2ad1d2'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#27b4c2'
              }
            }
          },
        ],
        series: [
          {
            name: this.$t("normal"),
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: this.zcData,
            itemStyle: {
              color: "#9ecf8e",
            },
            barMaxWidth: "50px",
          },
          {
            name: this.$t("communicationtodo"),
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: this.jqData,
            itemStyle: {
              color: "#6d86ce",
            },
            barMaxWidth: "50px",
          },
          {
            name: this.$t("administrativetodo"),
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: this.zbData,
            itemStyle: {
              color: "#f2cc76",
            },
            barMaxWidth: "50px",
          },
          {
            name: this.$t("rejected"),
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: this.bhData,
            itemStyle: {
              color: "#999",
            },
            barMaxWidth: "50px",
          },
        ],
      };
    },
    handleNodeClick(data) {
      this.treeData = data;
      if (data.type === "1" || data.type === "2") {
        this.getData();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#operationefficiency {
  .item-left {
    float: left;
    width: 20%;
  }

  .box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .choose-process-title {
    color: #0de8f7;
    font-size: 14px;
  }

  .choose-process {
    display: inline-block;
    margin: 0 10px 0 5px;
    border: #0de8f7 1px solid;
    color: #fff;
    padding: 0 10px;
    cursor: pointer;
  }

  .chartsBg1 {
    height: 540px;
    position: relative;
    background: url("../../../../../bpa/assets/img/qietu/zdlcbzh-cd.png") no-repeat;
    background-size: 100% 100%;
    padding: 24px 36px;
    flex:1;

    .operationEcharts {
      padding: 10px 32px;
    }
  }

  .item-right {
    //float: right;
    //width: 78%;
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
    /deep/ .el-form-item__label{
      color: #0de8f7;
    }
  }

  .echar-suk {
    width: 100%;
    height: 50vh;
  }

  .analyse-content {
    display: flex;
    flex-direction: row;
    min-height: 50vh;
    justify-content: space-between;
    .tree-list {
      //background: #2e2e2e;
      padding: 10px;
      border-radius: 3px;
      height: 70vh;
      margin-right: 10px;

      /deep/.el-tree {
        background: none !important;

        .is-current {
          &>.el-tree-node__content {
            background: none !important;
            //border: #80bae8 1px solid;
            border-radius: 4px;
            box-shadow: 0px 0px 10px #aacae7 inset;
          }
        }
        .el-tree-node__content {
          &:hover, &:focus{
            background: none !important;
            //border: #80bae8 1px solid;
            border-radius: 4px;
            box-shadow: 0px 0px 10px #98c8ef inset;
          }

        }
        .el-tree-node:focus > .el-tree-node__content {
          background: none;
        }
      }


      /deep/.el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
  }
}
</style>
