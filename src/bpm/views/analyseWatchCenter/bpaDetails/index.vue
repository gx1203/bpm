<template>
  <div id="bpaAnalysis" class="w100 bpaAnalysis">
    <div class="process">
      <div>
        业务域
        <el-cascader
          v-model="processValue"
          :options="options"
          :props="props"
          collapse-tags
          clearable
        />
        <el-button type="primary" @click="submitForm1">{{ $t('query') }}</el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <analysis-header :header-list="headerList" />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div>
            <h4 class="pieTitle flexBox">报表分析-流程发布情况</h4>
          </div>
          <div class="operationEcharts">
            <el-row class="bpaAnalysis-bottom">
              <el-col :span="9">
                显示明细
                <el-radio-group v-model="radio1" @change="submitFormRadio">
                  <el-radio-button label="是" />
                  <el-radio-button label="否" />
                </el-radio-group>
              </el-col>
              <el-col :span="15" class="search_buttons_wrap">
                <div class="datePicker">
                  <span>开始日期</span>
                  <el-date-picker
                    v-model="processstartTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="开始日期"/>
                  <span>结束日期</span>
                  <el-date-picker
                    v-model="processendTime"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="结束日期"/>
                  <el-button type="primary" style="margin-left:10px;" @click="submitFormRadio">{{ $t('query') }}</el-button>
                  <el-button :loading="downloadLoading" type="primary" @click="Excelexport">{{ $t('export') }}</el-button>
                  <el-button type="primary" @click="goBack">{{ $t('return') }}</el-button>
                </div>
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
                  <el-table-column v-if="radio1 == '是'" prop="name" label="一级框架" sortable />
                  <el-table-column v-if="radio1 == '否'" prop="name" label="一级框架" sortable />
                  <el-table-column prop="releaseValue" label="已发布" sortable />
                  <el-table-column prop="updateValue" label="已更新" sortable />
                  <el-table-column prop="todolistNum" label="审批中" sortable />
                  <el-table-column prop="unfinishedValue" label="未完成" sortable />
                  <el-table-column prop="processNumValue" label="流程总数" sortable />
                  <el-table-column
                    v-if="radio1 == '是'"
                    prop="processNodeName"
                    :label="$t('processName2')"
                    sortable
                  />
                  <el-table-column
                    v-if="radio1 == '是'"
                    prop="processNodeNum"
                    label="节点总数"
                    sortable
                  />
                  <el-table-column
                    v-if="radio1 == '是'"
                    prop="processNodeUpNum"
                    label="线上节点总数"
                    sortable
                  />
                  <el-table-column
                    v-if="radio1 == '是'"
                    prop="processNodeDownNum"
                    label="手工节点数"
                    sortable
                  />
                </el-table>
                <el-pagination
                  :current-page="pagesData.pageNum"
                  :page-sizes="[10]"
                  :page-size="pagesData.pageSize"
                  :total="pagesData.total"
                  layout="total, sizes, prev, pager, next, jumper"
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
// import PortalExport from '../components/protal/PortalExport'
// 接口请求部分
import {
  getOneFrameworkList,
  getBpaNum,
  getProcessDetail,
  exportProcessReleaseDetailData
} from '@/bpm/api/analyseWatchCenter'
// 默认时间
import { defaultTime, export_post_list } from '@/bpm/utils/common.js'
import AnalysisHeader from '../components/AnalysisHeader'
export default {
  components: {
    AnalysisHeader,
    // PortalExport
  },
  data() {
    return {
      modelid: '',
      processstartTime: '2019-01-01',
      processendTime: defaultTime.getToDay(),
      downloadLoading: false,
      exportList: [], // 导出列表list
      setTime: [],
      radio1: '是',
      processValues:'',
      radio: '0',
      timeValue: [],
      labelPosition: '',
      value1: '',
      value: '',
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
        // orderby: 'sort',
        // sort: 'asc' // orderby有值时生效
      },
      options: [],
      processValue: '',
      props: { checkStrictly: true, label: 'name', value: 'id', multiple: true },
      tableData: [],
      headerList: [
        {
          num: '0',
          name: '发布流程总数',
          ico: 'el-icon-s-promotion',
          color: '#06abb9',
          title: 'BPA已发布的流程总数'
        },
        {
          num: '0',
          name: '流程节点总数',
          ico: 'el-icon-connection',
          color: '#b35141',
          title: 'BPA已发布流程的节点总数'
        },
        {
          num: '0',
          name: '覆盖岗位',
          ico: 'el-icon-s-custom',
          color: '#019874',
          title: 'BPA已发布流程中参与的岗位数'
        },
        {
          num: '0',
          name: '手工节点',
          ico: 'el-icon-copy-document',
          color: '#b37e11',
          title: 'BPA已发布流程的线下节点总数'
        },
        {
          num: '0',
          name: '线上节点',
          ico: 'el-icon-crop',
          color: '#3577c0',
          title: 'BPA已发布流程的线上节点总数'
        }
      ]
    }
  },
  computed: {},
  mounted() {
    this.getBpaNumList('') // 获取头部基础数据
    this.getOneFrameworkList() // 获取业务域
    this.getFlowInfo('')
  },
  methods: {
    // 是否显示明细触发按钮
    submitFormRadio(ele) {
      this.getFlowInfo()
    },
    // 导出excel
    Excelexport() {
      this.downloadLoading = true
      var obj = {
        startTime: this.processstartTime,
        endTime: this.processendTime,
        ids:this.processValues,
        stauts: this.radio1 === '是' ? '1' : '0'
      }
      const list = Object.entries(obj)
      let str = ''
      list.map(item => {
        str += item[0] + '=' + item[1] + '&'
      })
      exportProcessReleaseDetailData(str).then(res => {
        export_post_list(res, '流程发布情况.xlsx')
        this.downloadLoading = false
      })
    },
    // 返回事件
    goBack() {
      this.$router.go(-1) // {{ $t('return') }}上一层
    },
    // 选择业务域确定
    submitForm1(ele) {
      const processValues = this.processValue.toString()
      this.processValues=this.processValue.toString()
      this.getFlowInfo(processValues)
      this.getBpaNumList(processValues)
    },
    // 获取流程框架
    getOneFrameworkList() {
      getOneFrameworkList().then(res => {
        const arr = res
        arr.forEach(function(item) {
          delete item.children
        })
        const map = {} // 构建map
        arr.forEach(i => {
          map[i.id] = i // 构建以area_id为键 当前数据为值
        })
        const treeData = []
        arr.forEach(child => {
          const mapItem = map[child.pid] // 判断当前数据的parent_id是否存在map中
          if (mapItem) {
            // 存在则表示当前数据不是最顶层的数据
            // 注意： 这里的map中的数据是引用了arr的它的指向还是arr,当mapItem改变时arr也会改变，踩坑点
            (mapItem.children || (mapItem.children = [])).push(child) // 这里判断mapItem中是否存在child
          } else {
            // 不存在则是顶层数据
            treeData.push(child)
          }
        })
        this.options = treeData
      })
    },
    // 获取关键指标
    getBpaNumList(processValues) {
      const obj = 'id=' + processValues
      getBpaNum(obj).then(res => {
        this.headerList.map(item => {
          if (item.name === '发布流程总数') {
            this.$set(item, 'num', res.totalNum)
          }
          if (item.name === '流程节点总数') {
            this.$set(item, 'num', res.nodeNum)
          }
          if (item.name === '覆盖岗位') {
            this.$set(item, 'num', res.jobNum)
          }
          if (item.name === '手工节点') {
            this.$set(item, 'num', parseInt(res.offlineNodeNum))
          }
          if (item.name === '线上节点') {
            this.$set(item, 'num', parseInt(res.taskNodeNum))
          }
        })
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 表格分页
    handleCurrentChange(val) {
      this.pagesData.pageNum = val
      this.getFlowInfo()
    },
    // 获取表格数据
    getFlowInfo(processValues) {
      const obj = {
        treeid: processValues || '',
        startdate: this.processstartTime,
        enddate: this.processendTime,
        pageNumber: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        stauts: this.radio1 === '是' ? '1' : '0'
      }
      getProcessDetail(obj).then(res => {
        this.pagesData.total = res.total
        this.tableData = res.list
      })
    }
  }
}
</script>

<style scoped lang="scss">
#bpaAnalysis {
  color: #fff;
  .operationEcharts {
    width: 100%;
    height: 674px;
  }
  .padding10 {
    padding: 10px;
  }
   .process {
    text-align: right;
    margin-bottom: 14px;
    margin-right: 14px;
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .chartsBg {
    position: relative;
    margin-top: 20px;
    background: url("../../../assets/img/analyseWatchCenter/bg_m.png") no-repeat;
    background-size: 100% 100%;
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
  .pieTitle {
    color: #ffffff;
    margin-left: 40px;
    margin-top: 20px;
    border-left: 3px solid #00f6ff;
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
    .bpaAnalysis-bottom {
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
