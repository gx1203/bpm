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
            collapse-tags
            :props="props"
            clearable
          />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForm">查询</el-button>
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
                  @keyup.enter.native="submitFormInput"
                />
              </el-col>
              <el-col :span="21" class="search_buttons_wrap">
                <el-button type="primary" style="margin-left:10px;" @click="submitFormInput">查询</el-button>
                <el-button :loading="downloadLoading" type="primary" @click="Excelexport">导出</el-button>
                <el-button type="primary" @click="goBack">返回</el-button>
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
                  <el-table-column prop="name" label="岗位名称" />
                  <el-table-column prop="inscount" label="审批数量" sortable />
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
// import { getPostProcessRank, getModel, getExportPostProcessRanking } from '@/bpa/api/analyseWatchCenter'
import selectMonth from '../../../components/SelectMonth.vue'
import { export_post_list, getFormateDate } from '@/bpa/utils/common.js'
import AnalysisHeader from '../../../components/AnalysisHeader'
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
      tableData: [
        {
          name: '总部财务部部长',
          inscount: 30
        },
        {
          name: '系统管理员',
          inscount: 25
        },
        {
          name: '成都水产科技水产养殖水产养殖二部场长',
          inscount: 18
        },
        {
          name: '通威农业担保业务部区域经理',
          inscount: 12
        },
        {
          name: '通威农业担保总经理',
          inscount: 12
        },
        {
          name: '总部信息部部长',
          inscount: 8
        },
        {
          name: '总部原料部部长',
          inscount: 8
        },
        {
          name: '董事',
          inscount: 5
        },
        {
          name: '资金结算组资金出纳',
          inscount: 4
        },
        {
          name: '总部财务部资金管理经理',
          inscount: 3
        }
      ],
      processValue: '',
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      props: { multiple: true },
      timeValue: [new Date(), new Date()],
      options: [
        {
          value: '一级',
          label: '1.0愿景与战略'
        },
        {
          value: '二级',
          label: '2.0市场营销'
        },
        {
          value: '三级',
          label: '3.0产品研发'
        },
        {
          value: '一级',
          label: '一级菜单'
        },
        {
          value: '四级',
          label: '4.0订单到交付'
        },
        {
          value: '五级',
          label: '5.0采购与管理'
        },
        {
          value: '六级',
          label: '6.0生产管理'
        },
        {
          value: '七级',
          label: '7.0质量管理'
        },
        {
          value: '八级',
          label: '8.0产品服务'
        },
        {
          value: '九级',
          label: '9.0财务管理'
        },
        {
          value: '十级',
          label: '10.0人力资源管理'
        },
        {
          value: '十一级',
          label: '11.0投资管理'
        },
        {
          value: '十二级',
          label: '12.0企业风险与合规管理'
        },
        {
          value: '十三级',
          label: '13.0信息技术'
        },
        {
          value: '十四级',
          label: '14.0行政法务管理'
        },
        {
          value: '十五级',
          label: '15.0测试'
        }
      ],
      downloadLoading: false
    }
  },
  computed: {},
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
        fullFilters: [],
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
      this.$router.go(-1) // 返回上一层
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
      getModel({}).then(res => {
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
        fullFilters: [],
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
    font-size: 14px;
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
    //  background-size:cover;
    background-size: 100% 100%;
    height: 700px;
  }
  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
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
}
</style>
