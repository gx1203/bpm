<template>
  <div id="bpmTaskProcessDetails" class="w100 bpaAnalysis">
    <div class="datePicker">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker clearable
            v-model="Process.yearValue"
            type="year"
            format="yyyy"
            value-format="yyyy"
            :placeholder="pleaseSelect"
            :title="pleaseSelect"
          />
        </el-col>
        <el-col :span="3">
          <select-month @getSeason="getMonthTime" />
        </el-col>
        <el-col :span="6" style="textAlign:center">
          <span>{{$t("choiceDimension")}}</span>
          <el-cascader
            v-model="Process.processValue"
            :options="options"
            :placeholder="pleaseSelect"
            :title="pleaseSelect"
            collapse-tags
            :props="props"
            clearable
            @change="submitForm1"
          />
        </el-col>
        <el-col :span="6">
          <span>{{$t("nodeType")}}</span>
          <el-select clearable v-model="Process.approvalValue" :placeholder="pleaseSelect" :title="pleaseSelect">
            <el-option
              v-for="item in approvalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForms">{{$t("query")}}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <analysis-header :header-list="headerList" />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4>{{$t("reportAnalysisTaskEfficiencyAnalysisTableByProcess")}}</h4>
          </div>
          <div class="operationEcharts">
            <el-row class="bpmTaskProcessDetails-bottom">
              <el-col :span="24" class="search_buttons_wrap">
                <el-button :loading="downloadLoading" type="primary" @click="Excelexport">{{$t("export")}}</el-button>
                <el-button type="primary" @click="goBack">{{$t("return")}}</el-button>
              </el-col>
              <el-col :span="24" style="margin-top:20px;">
                <el-table
                  :data="tableData"
                  :default-sort="{prop: 'date', order: 'descending'}"
                  :header-cell-style="{background:'#09275E' ,color:'#fff','border-bottom':'1px solid #10347C'}"
                  :cell-style="{background:'#030b2a',color:'#67748F','border-bottom':'1px solid #10347C',height:'46px'}"
                  style="width: 100%"
                >
                  <el-table-column prop="businessname" :label="businessTypes" />
                  <el-table-column prop="modelname" :label="categories" />
                  <el-table-column prop="processnamecn" :label="processName2" />
                  <el-table-column prop="processnodecount" :label="numberOfNodesInThisProcess" />
                  <el-table-column prop="processnodecount" :label="numberOfProcesses" />
                  <el-table-column prop="processnodecount" :label="numberOfProcessingNodes" />
                  <el-table-column prop="durationtotal" :label="cumulativeTotalTime" />
                  <el-table-column prop="prevdurationtotal" :label="lastCumulativeTotalTime" />
                  <el-table-column prop="loopcompare" :label="sequentialTotalDuration" />
                  <el-table-column prop="averageduration" :label="theAverageTime" />
                  <el-table-column prop="prevaverageduration" :label="averageLengthOfPreviousPeriod" />
                  <el-table-column prop="averageincrease" :label="averageDurationMonthOnMonthImprovement" />
                  <el-table-column prop="averagerank" :label="ranking" />
                </el-table>

                <el-pagination
                  :current-page="pagesData.pageNum"
                  :page-sizes="[10]"
                  :page-size="pagesData.pageSize"
                  :total="pagesData.total"
                  background
                  layout="prev, pager, next, jumper, total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入echarts
import 'echarts-liquidfill'
// 导出插件
import PortalExport from '@/bpa/components/protal/PortalExport'
// 应用vuex筛选条件
import { createNamespacedHelpers } from 'vuex'
import selectMonth from '../../../components/SelectMonth.vue'
// 接口请求部分
import {
  getTaskEfficiencyProcess,
  getModel,
  queryTaskEfficiencyProcessTable,
  getExportTaskEfficiencyProcessTable
} from '@/bpa/api/analyseWatchCenter'
// 默认时间
import {
  getTreeData,
  export_post_list,
  getFormateDate
} from '@/bpa/utils/common.js'
import AnalysisHeader from '../../../components/AnalysisHeader'
const screenStart = createNamespacedHelpers('screenStart')
export default {
  components: {
    AnalysisHeader,
    PortalExport,
    selectMonth
  },
  data() {
    return {
      approvalValue: '',
      approvalOptions: [
        {
          value: '1',
          label: '审批类'
        },
        {
          value: '2',
          label: '处理类'
        }
      ],
      monthValue: '',
      downloadLoading: false,
      options: [
        {
          value: '1级菜单',
          label: '1.0愿景与战略'
        },
        {
          value: '2级菜单',
          label: '2.0市场营销'
        },
        {
          value: '3级菜单',
          label: '3.0产品研发'
        },
        {
          value: '4级菜单',
          label: '4.0订单到交付'
        },
        {
          value: '5级菜单',
          label: '5.0采购管理'
        },
        {
          value: '6级菜单',
          label: '6.0生产管理'
        },
        {
          value: '7级菜单',
          label: '7.0质量管理'
        },
        {
          value: '8级菜单',
          label: '8.0产品服务'
        },
        {
          value: '9级菜单',
          label: '9.0财务管理'
        },
        {
          value: '10级菜单',
          label: '10.0人力资源管理'
        },
        {
          value: '11级菜单',
          label: '11.0投资管理'
        },
        {
          value: '12级菜单',
          label: '12.0企业风险与合规管理'
        },
        {
          value: '13级菜单',
          label: '13.0信息技术'
        },
        {
          value: '14级菜单',
          label: '14.0行政法务管理'
        },
        {
          value: '15级菜单',
          label: '15.0测试'
        }
      ],
      exportList: [], // 导出列表list
      props: { checkStrictly: true },
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      headerList: [
        {
          num: '0',
          name: this.$t("coveredServiceType"),
          ico: 'el-icon-share',
          color: '#06abb9',
          title: 'FBC' + this.$t("coveredServiceType2")
        },
        {
          num: '0',
          name: this.$t("coveredServiceType3"),
          ico: 'el-icon-document-copy',
          color: '#b35141',
          title: 'FBC' + this.$t("coveredServiceType4")
        },
        {
          num: '0',
          name: this.$t("numberOfProcesses"),
          ico: 'el-icon-s-data',
          color: '#019874',
          title: 'FBC' + this.$t("coveredServiceType5")
        },
        {
          num: '0',
          name: this.$t("theAverageTime"),
          ico: 'el-icon-alarm-clock',
          color: '#b37e11',
          title: 'FBC' + this.$t("coveredServiceType6")
        }
      ],
      pleaseSelect:this.$t("placeholderText.pleaseSelect"),
      businessTypes:this.$t("businessTypes"),
      categories:this.$t("categories"),
      processName2:this.$t("processName2"),
      numberOfNodesInThisProcess:this.$t("numberOfNodesInThisProcess"),
      numberOfProcesses:this.$t("numberOfProcesses"),
      numberOfProcessingNodes:this.$t("numberOfProcessingNodes"),
      cumulativeTotalTime:this.$t("cumulativeTotalTime"),
      lastCumulativeTotalTime:this.$t("lastCumulativeTotalTime"),
      sequentialTotalDuration:this.$t("sequentialTotalDuration"),
      theAverageTime:this.$t("theAverageTime"),
      averageLengthOfPreviousPeriod:this.$t("averageLengthOfPreviousPeriod"),
      averageDurationMonthOnMonthImprovement:this.$t("averageDurationMonthOnMonthImprovement"),
      ranking:this.$t("ranking"),
    }
  },
  computed: {
    // 获取任务效率分析按流程筛选条件
    ...screenStart.mapState(['Process'])
  },
  mounted() {
    console.log(this.Process, 666666)
    this.getTaskEfficiencyProcess() // 获取任务效率分析基本数据(按流程)
    this.getModelTree() // 获取业务域
    this.queryTaskEfficiencyProcessTable()
  },
  destroyed() {
    window.localStorage.removeItem('monthValue')
  },
  methods: {
    getMonthTime(data) {
      this.monthValue = data
      let yearData
      const date = new Date()
      if (this.monthValue == 12) {
        yearData = getFormateDate(
          new Date((date.getFullYear() - 1).toString()),
          'yyyy'
        )
        this.yearValue = yearData
      }
    },
    // 导出excel
    Excelexport() {
      this.downloadLoading = true
      const data = {
        attr: {
          date: this.Process.yearValue + '-' + this.monthValue,
          modelid: this.Process.processValue,
          nodetype: this.Process.approvalValue
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        sort: ''
      }
      getExportTaskEfficiencyProcessTable(data).then(res => {
        export_post_list(res, '报表分析-任务效率分析表（按流程）.xlsx')
        this.downloadLoading = false
      })
    },
    // 挂载获取 筛选条件方法
    ...screenStart.mapActions(['getCurrentProcess']),
    // 选择业务域确定
    submitForm1(ele) {
      this.Process.processValue = this.Process.processValue[
        this.Process.processValue.length - 1
      ]
    },
    goBack() {
      // this.$router.go(-1) // 返回上一层
      this.$router.push({ path: '/analyseWatchCenter/bpm/TaskProcess' })
    },
    // 查询
    submitForms() {
      this.getTaskEfficiencyProcess()
      this.queryTaskEfficiencyProcessTable()
    },
    // 获取任务效率分析基本数据(按部门)
    getTaskEfficiencyProcess() {
      const obj = {
        date: this.Process.yearValue + '-' + this.monthValue,
        modelid: this.Process.processValue,
        nodetype: this.Process.approvalValue
      }
      getTaskEfficiencyProcess(obj).then(res => {
        res = res.data.data
        this.headerList.map(item => {
          if (item.name === '覆盖业务类型') {
            this.$set(item, 'num', res.businesscount)
          }
          if (item.name === '覆盖大类') {
            this.$set(item, 'num', res.modelcount)
          }
          if (item.name === '流程数量') {
            this.$set(item, 'num', res.finishinscount)
          }
          if (item.name === '平均时长') {
            this.$set(item, 'num', parseInt(res.averageduration))
          }
        })
      })
    },
    // 获取流程框架
    getModelTree() {
      // getModel({}).then(res => {
      //   this.options = getTreeData(res)
      // })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pagesData.pageNum = val
      this.queryTaskEfficiencyProcessTable()
    },
    // 获取table数据
    queryTaskEfficiencyProcessTable() {
      const data = {
        attr: {
          modelid: this.Process.processValue,
          date: this.Process.yearValue + '-' + this.monthValue,
          nodetype: this.Process.approvalValue
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        sort: ''
      }
      queryTaskEfficiencyProcessTable(data).then(res => {
        res = res.data.data
        this.tableData = res.list
        this.pagesData.total = res.total
      })
    }
  }
}
</script>

<style scoped lang="scss">
#bpmTaskProcessDetails {
  color: #fff;
  /deep/ .el-input__inner {
    background-color: transparent;
  }
  .operationEcharts {
    width: 100%;
    min-height: 674px;
  }
  .search_buttons_wrap {
    text-align: right;
  }
  .datePicker {
    text-align: right;
    margin-bottom: 20px;
    span {
      margin-left: 20px;
    }
  }
  .padding10 {
    padding: 10px;
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .processBar {
    height: 400px;
  }
  .positionBar {
    height: 400px;
  }
  .details {
    padding-right: 10px;
    a {
      color: #fff;
    }
  }
  .process {
    display: flex;
    justify-content: space-between;
  }
  .pieTitle {
    color: #ffffff;
    margin-left: 40px;
    font-size: 16px;
    padding-left: 10px;
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
  }
  .chartsBg {
    position: relative;
    margin-top: 20px;
    background: url('../../../assets/img/qietu/bg_m.png') no-repeat;
    background-size: 100% 100%;
    // height: 720px;
  }
  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    margin-bottom: 24px;
    .bpmTaskProcessDetails-bottom {
      padding: 24px 24px 0px 24px;
    }
  }
  p.common-part {
    padding: 15px 10px;
    width: 60%;
    margin: 0 auto;
    span:nth-of-type(1) {
      line-height: 40px;
    }
    span {
      display: block;
      text-align: center;
    }
    span:nth-of-type(2) {
      cursor: pointer;
    }
    span:nth-of-type(2):hover {
      color: #4a9bfb;
    }
  }
  .border-bottom1 {
    border-bottom: 1px solid #e6e6e6;
  }
  .fontRed {
    color: #f8704c;
  }
  .fontBlue {
    color: #6aaeff;
  }
  .fontLightBlue {
    color: #4cd6a0;
  }
  .pblish-i {
    position: absolute;
    top: 11px;
    right: 0;
    padding-right: 2px;
    padding-left: 60px;
  }
  .pblish-i1 {
    top: 5px;
  }
  .colorC {
    color: #ccc;
  }
  .titlehover {
    cursor: pointer;
    color: #4a9bfb;
  }
  .titlehover:hover {
    color: #3e7dca;
  }
  .el-pagination {
    /deep/ .btn-prev {
      background-color: transparent;
      color: #fff;
    }
    /deep/ .number {
      background-color: transparent;
      color: #fff;
    }
    /deep/ .btn-next {
      background-color: transparent;
      color: #fff;
    }
  }
}
</style>
