<template>
  <div id="processNumRanking" class="w100 bpaAnalysis">
    <div class="datePicker">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-date-picker
            v-model="yearValue"
            type="year"
            format="yyyy"
            value-format="yyyy"
            :placeholder="selectYear"
            :title="selectYear"/>
        </el-col>
        <el-col :span="3">
          <select-month @getSeason="getMonthTime" />
        </el-col>
        <el-col :span="6" style="textAlign:center">
          <span>{{$t("businessDomain")}}</span>
          <el-cascader
            v-model="processValue"
            :placeholder="pleaseSelect"
            :title="pleaseSelect"
            :options="options"
            collapse-tags
            :props="props"
            clearable
            @change="submitForm1"
          />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForm">{{$t("query")}}</el-button>
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
            <h4>{{$t("processInitiationNumberRanking")}}</h4>
          </div>
          <div class="operationEcharts">
            <el-row class="bpaPostDetails-bottom">
              <el-col :span="3">
                <el-input clearable
                  v-model="searchName"
                  :placeholder="pleaseEnterTheContent"
                  :title="pleaseEnterTheContent"
                  suffix-icon="el-icon-search"
                  size="mini"
                  @change="submitFormInput"
                  @keyup.enter.native="submitFormInput"
                />
              </el-col>
              <el-col :span="21" class="search_buttons_wrap">
                <el-button type="primary" style="margin-left:10px;" @click="submitFormInput">{{$t("query")}}</el-button>
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
                  <el-table-column type="index" :label="number" />
                  <el-table-column prop="processnamecn" :label="processName2"  align="center" />
                  <el-table-column prop="applycount" :label="initiateNumber" sortable  align="center" />
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
// 接口请求部分
import { getKeyList, getModel, getProcessRank, getExportProcessApplyRanking } from '@/bpa/api/analyseWatchCenter'
import PortalExport from '@/bpa/components/protal/PortalExport'
import { getTreeData, export_post_list, getFormateDate } from '@/bpa/utils/common.js'
import AnalysisHeader from '../../../components/AnalysisHeader'
import selectMonth from '../../../components/SelectMonth.vue'
export default {
  components: {
    AnalysisHeader,
    PortalExport,
    selectMonth
  },
  data() {
    return {
      yearValue: getFormateDate(new Date(), 'yyyy'),
      monthValue: '',
      downloadLoading: false,
      searchName: '',
      exportdata: {
        tHeader: ['流程名称', '发起数量'],
        filterVal: ['processnamecn', 'applycount'],
        exportdata: [],
        filename: '流程发起数排名'
      },
      tableData: [],
      processValue: '',
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      props: { multiple: true },
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
      headerList: [
        {
          num: 110,
          type: 'totalNumberOfRunningProcesses',
          name: this.$t("totalNumberOfRunningProcesses"),
          ico: 'el-icon-s-promotion',
          color: '#07aab9',
          title: 'FBC' + this.$t("numberOfRunningProcesses")
        },
        {
          num: 0,
          type: 'totalNumberOfOutstandingProcesses',
          name: this.$t("totalNumberOfOutstandingProcesses"),
          ico: 'el-icon-thumb',
          color: '#b45041',
          title: 'FBC' + this.$t("numberOfRunningProcessesNodes")
        },
        {
          num: 0,
          type: 'numberOfProcessingNodes',
          name: this.$t("numberOfProcessingNodes"),
          ico: 'el-icon-document-copy',
          color: '#019774',
          title: 'FBC' + this.$t("totalNumberOfProcessApplications")
        },
        {
          num: 0,
          type: 'coverPerson',
          name: this.$t("coverPerson"),
          ico: 'el-icon-s-custom',
          color: '#b37d11',
          title: 'FBC' + this.$t("totalNumberOfParticipantsInTheRunningProcess")
        },
        {
          num: 0,
          type: 'coverJobs',
          name: this.$t("coverJobs"),
          ico: 'el-icon-set-up',
          color: '#3676c0',
          title: 'FBC' + this.$t("numberOfJobsInvolvedInTheRunningProcess")
        }
      ],
      selectYear:this.$t("placeholderText.selectYear"),
      pleaseSelect:this.$t("placeholderText.pleaseSelect"),
      pleaseEnterTheContent:this.$t("placeholderText.pleaseEnterTheContent"),
      number:this.$t("number"),
      processName2:this.$t("processName2"),
      initiateNumber:this.$t("initiateNumber"),
    }
  },
  computed: {},
  mounted() {
    this.getKeyData() // 获取头部基础数据
    this.getProcessRankList()
    this.getModelTree()
  },
  methods: {
    // 导出excel
    Excelexport() {
      this.downloadLoading = true
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1],
          date: this.yearValue + '-' + this.monthValue
        },
        filters: [
          {
            key: 'processnamecn',
            opt: 'LIKE',
            type: 'S',
            value: this.searchName
          }
        ],
        fullFilters: [],
        logic: '',
        orderby: 'applycount',
        pageNum: this.pagesData.pageNum,
        pageSize: 10,
        sort: 'desc'
      }
      getExportProcessApplyRanking(obj).then(res => {
        export_post_list(res, '流程发起数排名.xlsx')
        this.downloadLoading = false
      })
    },
    // 获取月份季度时间
    getMonthTime(data) {
      this.monthValue = data
      let yearData
      const date = new Date()
      if (this.monthValue == 12) {
        yearData = getFormateDate(new Date((date.getFullYear() - 1).toString()), 'yyyy')
        this.yearValue = yearData
      }
    },
    // 获取关键指标
    getKeyData() {
      const obj = {
        modelid: this.processValue[this.processValue.length - 1],
        date: this.yearValue + '-' + this.monthValue
      }
      getKeyList(obj).then(res => {
        // res = res.data.data
        console.log(res);
        this.headerList.map(item => {
          if (item.type === 'totalNumberOfRunningProcesses') {
            this.$set(item, 'num', res.processamount)
          }
          if (item.type === 'totalNumberOfOutstandingProcesses') {
            this.$set(item, 'num', res.runingprocessamount)
          }
          if (item.type === 'numberOfProcessingNodes') {
            this.$set(item, 'num', res.nodeamount)
          }
          if (item.type === 'coverPerson') {
            this.$set(item, 'num', parseInt(res.useramount))
          }
          if (item.type === 'coverJobs') {
            this.$set(item, 'num', parseInt(res.postamount))
          }
        })
        console.log(this.headerList)
      })
    },
    // 返回事件
    goBack() {
      this.$router.go(-1) // 返回上一层
      // this.$router.push({path:''})
    },
    // 选择业务域确定
    submitForm1() {
      this.getKeyData()
      this.getProcessRankList()
    },
    // 选择时间确定
    submitForm(ele) {
      this.getKeyData()
      this.getProcessRankList()
    },
    submitFormInput(ele) {
      this.getProcessRankList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pagesData.pageNum = val
      this.getProcessRankList()
    },
    // 获取流程树
    getModelTree() {
      // getModel({}).then(res => {
      //   this.options = getTreeData(res)
      // })
    },
    // 获取流程数排名
    getProcessRankList() {
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1],
          date: this.yearValue + '-' + this.monthValue
        },
        filters: [
          {
            key: 'processnamecn',
            opt: 'LIKE',
            type: 'S',
            value: this.searchName
          }
        ],
        fullFilters: [],
        logic: '',
        orderby: 'applycount',
        pageNum: this.pagesData.pageNum,
        pageSize: 10,
        sort: 'desc'
      }
      getProcessRank(obj).then(res => {
        console.log(res);
        // res = res.data.data
        this.tableData = res.list
        this.pagesData.total = res.total
      })
    }
  }
}
</script>

<style scoped lang="scss">
#processNumRanking {
  color: #fff;
  /deep/ .el-input__inner {
    background-color: transparent;
  }
  .operationEcharts {
    width: 100%;
    height: 674px;
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
  .chartsBg {
    position: relative;
    margin-top: 20px;
    background: url("../../../assets/img/qietu/bg_m.png") no-repeat;
    //  background-size:cover;
    background-size: 100% 100%;
    height: 700px;
  }
  .datePicker {
    text-align: right;
    margin-bottom: 20px;
    span {
      margin-left: 20px;
    }
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
  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // border:1px solid rgba(0,69,125,1);
    margin-bottom: 24px;
    .bpaPostDetails-bottom {
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
