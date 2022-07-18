<template>
  <div id="processNumRanking" class="w100 bpaAnalysis">
    <div class="datePicker">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-date-picker clearable
            v-model="yearValue"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年"
          />
        </el-col>
        <el-col :span="3">
          <select-month @getSeason="getMonthTime" />
        </el-col>
        <el-col :span="6" style="textAlign:center">
          <span>业务域</span>
          <el-cascader
            v-model="processValue"
            :options="options"
            :props="props"
            clearable
            @change="submitForm1"
          />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForm">
            查询
          </el-button>
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
            <h4>流程发起数排名</h4>
          </div>
          <div class="operationEcharts">
            <el-row class="bpaPostDetails-bottom">
              <el-col :span="3">
                <el-input clearable
                  v-model="searchName"
                  placeholder="请输入内容"
                  suffix-icon="el-icon-search"
                  size="mini"
                  @change="submitFormInput"
                  @keyup.enter.native="submitFormInput"
                />
              </el-col>
              <el-col :span="21" class="search_buttons_wrap">
                <el-button type="primary" style="margin-left:10px;" @click="submitFormInput">
                  查询
                </el-button>
                <el-button :loading="downloadLoading" type="primary" @click="Excelexport">
                  导出
                </el-button>
                <el-button type="primary" @click="goBack">
                  返回
                </el-button>
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
                  <el-table-column prop="processnamecn" :label="$t('processName2')" />
                  <el-table-column prop="applycount" label="发起数量" sortable />
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
import {
  getKeyList,
  getModel,
  getProcessRank,
  getExportProcessApplyRanking
} from '@/bpa/api/analyseWatchCenter'
import PortalExport from '@/bpa/components/protal/PortalExport'
import {
  getTreeData,
  export_post_list,
  getFormateDate
} from '@/bpa/utils/common.js'
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
      props: { checkStrictly: true, label: 'modelname', value: 'id' },
      options: [],
      headerList: [
        {
          num: 110,
          name: '运行流程总数',
          ico: 'el-icon-s-promotion',
          color: '#07aab9',
          title: 'FBC中已运行的流程数量'
        },
        {
          num: 0,
          name: '未完成流程总数',
          ico: 'el-icon-thumb',
          color: '#b45041',
          title: 'FBC中已运行流程的节点总数'
        },
        {
          num: 0,
          name: '处理节点数',
          ico: 'el-icon-document-copy',
          color: '#019774',
          title: 'FBC中流程申请总数'
        },
        {
          num: 0,
          name: '覆盖人数',
          ico: 'el-icon-s-custom',
          color: '#b37d11',
          title: 'FBC中运行的流程参与总人数'
        },
        {
          num: 0,
          name: '覆盖岗位',
          ico: 'el-icon-set-up',
          color: '#3676c0',
          title: 'FBC中运行的流程参与的岗位数'
        }
      ]
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
        yearData = getFormateDate(
          new Date((date.getFullYear() - 1).toString()),
          'yyyy'
        )
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
        res = res.data.data
        this.headerList.map(item => {
          if (item.name === '运行流程总数') {
            this.$set(item, 'num', res.processamount)
          }
          if (item.name === '未完成流程总数') {
            this.$set(item, 'num', res.runingprocessamount)
          }
          if (item.name === '处理节点数') {
            this.$set(item, 'num', res.nodeamount)
          }
          if (item.name === '覆盖人数') {
            this.$set(item, 'num', parseInt(res.useramount))
          }
          if (item.name === '覆盖岗位') {
            this.$set(item, 'num', parseInt(res.postamount))
          }
        })
      })
    },
    // 返回事件
    goBack() {
      // this.$router.go(-1) // 返回上一层
      this.$router.push({ path: '/analyseWatchCenter/bpm/instance' })
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
      getModel({}).then(res => {
        this.options = getTreeData(res)
      })
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
        res = res.data.data
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
    background: url('../../../assets/img/qietu/bg_m.png') no-repeat;
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
