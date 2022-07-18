<template>
  <div id="bpmTaskProcessDetails" class="w100 bpaAnalysis">
    <el-row :gutter="20" class="bpmTaskDepartment-top">
      <el-col :span="14">
        {{$t("businessDomain")}}
        <el-cascader
          v-model="Department.processValue"
          :placeholder="pleaseSelect"
          :title="pleaseSelect"
          :options="options"
          collapse-tags
          :props="props"
          clearable
          @change="submitForm1"
        />
        <span style="margin:0 5px">{{$t("choiceDimension")}}</span>
        <el-select clearable
          v-model="Department.startChoice"
          :placeholder="pleaseSelect"
          :title="pleaseSelect"
          style="width:148px"
          @change="submitFormStartChoice"
        >
          <el-option label="公司" value="1" />
          <el-option label="部门" value="2" />
        </el-select>
        <el-input clearable
          v-model="Department.companyName"
          :title="pleaseSelect"
          :placeholder="pleaseSelect"
          prefix-icon="el-icon-thumb"
          style="width:148px"
          @focus="getDepartment(Department.startChoice)"
          @clear="clearCompanyStart()"
        />
        <span>{{$t("nodeType")}}</span>
        <el-select clearable v-model="Department.approvalValue" placeholder="pleaseSelect" :title="pleaseSelect" @change="approvalSubmit">
          <el-option
            v-for="item in approvalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="3" class="search_buttons_wrap">
        <el-date-picker clearable
          v-model="Department.yearValue"
          type="year"
          format="yyyy"
          value-format="yyyy"
          :placeholder="selectYear"
          :title="selectYear"
          @change="submitForm"
        />
      </el-col>
      <el-col :span="4">
        <select-month @getSeason="getMonthTime" />
      </el-col>
      <el-col :span="3">
        <el-button type="primary" style="margin-left:10px;" @click="submitForms">{{$t("query")}}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <analysis-header :header-list="headerList" />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4>{{$t("reportAnalysisTaskEfficiencyAnalysisTableByDepartment")}}</h4>
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
                  <el-table-column type="index" :label="$t('number')" />
                  <el-table-column
                    v-if="Department.startChoice === '1'"
                    prop="compname"
                    :label="companyName"
                  />
                  <el-table-column
                    v-if="Department.startChoice === '2'"
                    prop="deptname"
                    :label="departmentName"
                  />
                  <el-table-column prop="taskcount" :label="numberOfInitiatedProcesses" />
                  <el-table-column prop="mobiletaskcount" :label="numberOfProcessingNodes" />
                  <el-table-column prop="durationtotal" :label="moveTheNumberOfProcessingNodes" />
                  <el-table-column prop="durationtotal" :label="cumulativeTotalTime" />
                  <el-table-column prop="averageduration" :label="theAverageTime" />
                  <el-table-column prop="prevaverageduration" :label="averageLengthOfPreviousPeriod" />
                  <el-table-column prop="averageincrease" :label="averageDurationMonthOnMonthImprovement" />
                  <el-table-column prop="reportcount" :label="numberOfReports" />
                  <el-table-column prop="reportproportion" :label="numberOfReports2" />
                  <el-table-column prop="prevreportcount" :label="pleaseReferToTheNumberOfTheLastReport" />
                  <el-table-column prop="reportloopcompare" :label="requestInstructionReportSequential" />
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
    <newOrganization
      v-model="dialogVisible"
      :start-choice="Department.startChoice"
      :only-one="onlyOne"
      @changeOnlyOne="changeOnlyOne"
      @getTransferList="getTransferList"
      @getTransferNameList="getTransferNameList"
    />
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'
import selectMonth from '../../../components/SelectMonth.vue'
import newOrganization from '../../../components/newOrganization/index.vue'
// 默认时间
import {
  getTreeData,
  export_post_list,
  getFormateDate
} from '@/bpa/utils/common.js'
// 接口请求部分
import {
  getTaskEfficiencyDept,
  getModel,
  queryTaskEfficiencyDeptTable,
  getExportTaskEfficiencyDeptTable
} from '@/bpa/api/analyseWatchCenter'
// 应用vuex筛选条件
import { createNamespacedHelpers } from 'vuex'
import AnalysisHeader from '../../../components/AnalysisHeader'
const screenStart = createNamespacedHelpers('screenStart')
export default {
  components: {
    AnalysisHeader,
    newOrganization,
    selectMonth
  },
  data() {
    return {
      orgtype: '',
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
      yearValue: getFormateDate(new Date(), 'yyyy'),
      monthValue: '',
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
      downloadLoading: false,
      onlyOne: false, // 选人组件只能选择一个值的标识
      dialogVisible: false,
      props: { checkStrictly: true },
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
        // orderby: 'sort',
        // sort: 'asc' // orderby有值时生效
      },
      tableData: [],
      headerList: [
        {
          num: '0',
          name: this.$t("coverCompany"),
          ico: 'el-icon-copy-document',
          color: '#06abb9',
          title: 'FBC' + this.$t("numberOfCompaniesParticipatingInTheRunningProcess")
        },
        {
          num: '0',
          name: this.$t("coveringSector"),
          ico: 'el-icon-s-promotion',
          color: '#b35141',
          title: 'FBC' + this.$t("numberOfDepartmentParticipatingInTheRunningProcess")
        },
        {
          num: '0',
          name: this.$t("cumulativeNumberOfTasksProcessed"),
          ico: 'el-icon-s-data',
          color: '#019874',
          title: 'FBC' + this.$t("numberOfTimesProcessIsProcessed")
        },
        {
          num: '0',
          name: this.$t("theAverageTime"),
          ico: 'el-icon-alarm-clock',
          color: '#b37e11',
          title: 'FBC' + this.$t("averageProcessingTimeOfSingleNodeOfTheProcess")
        }
      ],
      pleaseSelect:this.$t("placeholderText.pleaseSelect"),
      companyName:this.$t("companyName"),
      departmentName:this.$t("departmentName"),
      numberOfInitiatedProcesses:this.$t("numberOfInitiatedProcesses"),
      numberOfProcessingNodes:this.$t("numberOfProcessingNodes"),
      moveTheNumberOfProcessingNodes:this.$t("moveTheNumberOfProcessingNodes"),
      cumulativeTotalTime:this.$t("cumulativeTotalTime"),
      theAverageTime:this.$t("theAverageTime"),
      averageLengthOfPreviousPeriod:this.$t("averageLengthOfPreviousPeriod"),
      averageDurationMonthOnMonthImprovement:this.$t("averageDurationMonthOnMonthImprovement"),
      numberOfReports:this.$t("numberOfReports"),
      numberOfReports2:this.$t("numberOfReports2"),
      pleaseReferToTheNumberOfTheLastReport:this.$t("pleaseReferToTheNumberOfTheLastReport"),
      requestInstructionReportSequential:this.$t("requestInstructionReportSequential"),
    }
  },
  computed: {
    // 获取任务效率分析按部门筛选条件
    ...screenStart.mapState(['Department'])
  },
  mounted() {
    this.getTaskEfficiencyDept() // 获取任务效率分析基本数据(按部门)
    this.getModelTree() // 获取业务域
    this.queryTaskEfficiencyDeptTable() // 请求列表
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
    // 选择节点类型确定
    approvalSubmit() {
      this.Process.approvalValue = this.approvalValue
    },
    // 导出excel
    Excelexport() {
      this.downloadLoading = true
      const data = {
        attr: {
          modelid: this.Department.modelid,
          date: this.Department.yearValue + '-' + this.monthValue,
          nodetype: this.Department.approvalValue,
          orgtype: this.Department.startChoice,
          orgid: this.Department.deptid
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        sort: ''
      }
      getExportTaskEfficiencyDeptTable(data).then(res => {
        export_post_list(res, '报表分析-任务效率分析表（按部门）.xlsx')
        this.downloadLoading = false
      })
    },
    // 挂载获取 筛选条件方法
    ...screenStart.mapActions(['getCurrentDepartment']),
    // 通过公司查部门
    getDepartment(ele) {
      if (ele === '1') {
        this.Department.startChoice = '1'
      } else {
        this.Department.startChoice = '2'
      }
      // this.getCurrentDepartment(this.Department)
      this.dialogVisible = true
    },
    openOrgSelect() {
      this.dialogVisible = true
      this.onlyOne = true
    },
    changeOnlyOne(val) {
      this.onlyOne = val
    },
    clearCompanyStart() {
      if (this.Department.startChoice === '1') {
        this.Department.companyId = ''
      } else {
        this.Department.deptid = ''
      }
      this.getCurrentDepartment(this.Department)
      this.queryTaskEfficiencyDeptTable()
    },
    // 选择多个岗位
    getTransferList(transferList) {
      this.Department.deptid = transferList
      // this.getCurrentDepartment(this.Department)
    },
    // 选择时间组件回调事件
    submitForm(ele) {
      this.getCurrentDepartment(this.Department)
    },
    // 获取选择的公司部门名称
    getTransferNameList(name) {
      this.Department.companyName = name
      this.getCurrentDepartment(this.Department)
    },
    // 选择业务域确定
    submitForm1(ele) {
      if (ele.length === 0) {
        this.Department.modelid = ''
      } else {
        this.Department.modelid = ele[ele.length - 1]
      }
      this.getCurrentDepartment(this.Department)
    },
    //
    goBack() {
      // this.$router.go(-1)// 返回上一层
      this.$router.push({ path: '/analyseWatchCenter/bpm/TaskDepartment' })
    },
    // 查询
    submitForms() {
      this.getTaskEfficiencyDept()
      this.queryTaskEfficiencyDeptTable()
    },
    submitFormStartChoice() {
      this.Department.companyName = ''
      this.Department.companyId = ''
      this.Department.deptid = ''
      this.getCurrentDepartment(this.Department)
    },
    // 获取任务效率分析基本数据(按部门)
    getTaskEfficiencyDept() {
      const obj = {
        date: this.Department.yearValue + '-' + this.monthValue,
        modelid: this.Department.modelid,
        nodetype: this.Department.approvalValue,
        orgtype: this.Department.startChoice,
        orgid: this.Department.deptid
      }
      getTaskEfficiencyDept(obj).then(res => {
        res = res.data.data
        this.headerList.map(item => {
          if (item.name === '覆盖公司') {
            this.$set(item, 'num', res.compcount)
          }
          if (item.name === '覆盖部门') {
            this.$set(item, 'num', res.deptcount)
          }
          if (item.name === '累计处理任务数量') {
            this.$set(item, 'num', res.taskcount)
          }
          if (item.name === '平均时长') {
            this.$set(item, 'num', parseInt(res.averageduration))
          }
        })
      })
    },
    // 获取部门框架
    getModelTree() {
      // getModel({}).then((res) => {
      //   this.options = getTreeData(res)
      // })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 分页执行方法
    handleCurrentChange(val) {
      this.pagesData.pageNum = val
      this.queryTaskEfficiencyDeptTable()
    },
    // 获取table 数据
    queryTaskEfficiencyDeptTable() {
      // this.getCurrentDepartment(this.Department)
      const data = {
        attr: {
          modelid: this.Department.modelid,
          date: this.Department.yearValue + '-' + this.monthValue,
          nodetype: this.Department.approvalValue,
          orgtype: this.Department.startChoice,
          orgid: this.Department.deptid
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        sort: ''
      }
      queryTaskEfficiencyDeptTable(data).then(res => {
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
  .padding10 {
    padding: 10px;
  }
  .bpmTaskDepartment-top {
    margin-bottom: 20px;
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
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
    font-size: 16px;
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
