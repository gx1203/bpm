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
            :placeholder="$t('placeholderText.selectYear')"/>
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
          />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForm">{{ $t('query') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4>岗位参与审批的流程数排名</h4>
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
                  @keyup.enter.native="submitFormInput"/>
              </el-col>
              <el-col :span="21" class="search_buttons_wrap">
                <el-button type="primary" style="margin-left:10px;" @click="submitFormInput">{{ $t('query') }}</el-button>
                <el-button :loading="downloadLoading" type="primary" @click="Excelexport">{{ $t('export') }}</el-button>
                <el-button type="primary" @click="goBack">{{ $t('return') }}</el-button>
              </el-col>
              <el-col :span="24" style="margin-top:20px;">
                <el-table
                  :data="tableData"
                  :default-sort = "{prop: 'date', order: 'descending'}"
                  :header-cell-style="{background:'#09275E' ,color:'#fff','border-bottom':'1px solid #10347C'}"
                  :cell-style="{background:'#030b2a',color:'#67748F','border-bottom':'1px solid #10347C',height:'46px'}"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    :label="$t('number')"/>
                  <el-table-column
                    prop="name"
                    label="岗位名称"/>
                  <el-table-column
                    prop="inscount"
                    label="审批数量"
                    sortable/>
                </el-table>
                <el-pagination
                  :current-page="pagesData.pageNum"
                  :page-sizes="[10]"
                  :page-size="pagesData.pageSize"
                  :total="pagesData.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"/>
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
import { getPostProcessRank, getModel, getExportPostProcessRanking } from '@/bpm/api/analyseWatchCenter'
import selectMonth from '../components/SelectMonth.vue'
import { getTreeData, export_post_list,getFormateDate } from '@/bpm/utils/common.js'
import AnalysisHeader from '../components/AnalysisHeader'
export default {
  components: {
    AnalysisHeader,
    selectMonth
  },
  data() {
    return {
      yearValue: getFormateDate(new Date(), 'yyyy'),
      monthValue: '',
      searchName: '',
      tableData: [],
      processValue: '',
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      props: { checkStrictly: true, label: 'modelname', value: 'id' },
      timeValue: [new Date(), new Date()],
      options: [],
      downloadLoading: false
    }
  },
  computed: {

  },
  mounted() {
    this.getModelTree()
    this.getPostProcessRankList()
  },
  methods: {
    getMonthTime(data) {
      this.monthValue = data
      let yearData
      const date = new Date()
      if (this.monthValue == 12) {
        yearData = getFormateDate(new Date((date.getFullYear() - 1).toString()), 'yyyy')
        this.yearValue = yearData
      }
    },
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
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: this.searchName
          }
        ],
        fullFilters: [
        ],
        logic: '',
        orderby: 'inscount',
        pageNum: this.pagesData.pageNum,
        // pageSize: 10,
        pageSize: this.pagesData.pageSize,
        sort: 'desc'
      }
      getExportPostProcessRanking(obj).then(res => {
        export_post_list(res, '岗位参与审批的流程数排名.xlsx')
        this.downloadLoading = false
      })
    },
    // 返回事件
    goBack() {
      this.$router.go(-1)// 返回上一层
    },
    // 选择时间确定
    submitForm(ele) {
      this.getPostProcessRankList()
    },
    submitFormInput(ele) {
      this.getPostProcessRankList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pagesData.pageNum = val
      this.getPostProcessRankList()
    },
    // 获取流程树
    getModelTree() {
      getModel({}).then((res) => {
        this.options = getTreeData(res)
      })
    },
    // 获取岗位参与审批的流程数排名
    getPostProcessRankList() {
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1],
          date: this.yearValue + '-' + this.monthValue
        },
        filters: [
          {
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: this.searchName
          }
        ],
        fullFilters: [
        ],
        logic: '',
        orderby: 'inscount',
        pageNum: this.pagesData.pageNum,
        // pageSize: 10,
        pageSize: this.pagesData.pageSize,
        sort: 'desc'
      }
      getPostProcessRank(obj).then(res => {
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
  .operationEcharts{
    width:100%;
    height: 674px;
  }
  .padding10{
      padding: 10px;
  }
  .flexBox{
      display: flex;
      justify-content: space-between
  }
  .processBar{
      height: 400px
  }
    .datePicker {
    text-align: right;
    margin-bottom: 20px;
    span {
      margin-left: 20px;
    }
  }
  .positionBar{
      height: 400px;
  }
  .details{
      padding-right: 10px;
      a{
          color: #fff;
      }
  }
  .process{
    display: flex;
    justify-content: space-between;
  }
  .pieTitle{
    color: #FFFFFF;
    margin-left: 40px;
    border-left: 3px solid #00F6FF;
     padding-left: 10px;
    font-size:14px;
    padding-left: 10px;
    box-sizing: border-box;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:36px;
  }
  .chartsBg{
    position: relative;
    margin-top: 20px;
    background: url('../../../assets/img/analyseWatchCenter/bg_m.png') no-repeat;
    //  background-size:cover;
    background-size: 100% 100%;
    height: 700px;
    }
   .operationEcharts{
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    margin-bottom: 24px;
    .bpaPostDetails-bottom{
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
}
</style>
