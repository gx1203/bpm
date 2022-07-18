<template>
  <div id="bpaAnalysis" class="w100 bpaAnalysis">
    <el-row :gutter="20" style="padding-bottom:20px;">
      <div class="process">
        <div>
          业务域
          <el-cascader collapse-tags clearable />
          <el-button type="primary">查询</el-button>
        </div>
      </div>
      <el-row :gutter="20" style="padding-bottom:20px">
        <analysisHeader :header-list="headerList" />
      </el-row>
    </el-row>
    <el-row :gutter="30" style="padding-bottom:20px;">
      <el-col :span="24">
        <div class="chartsBg1">
          <div class="flexBox">
            <h4 class="pieTitleH">流程发布情况</h4>
            <div class="processdetails details">
              <a href="#/analyseWatchCenter/bpa/Details">查看明细</a>
            </div>
          </div>
          <div style="height:40px" />
          <div class="operationEcharts">
            <div class="datePicker">
              <span>开始日期</span>
              <el-date-picker clearable
                v-model="processstartTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="开始日期"
              />
              <span>结束日期</span>
              <el-date-picker clearable
                v-model="processendTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="结束日期"
              />
              <el-button type="primary" size="mini">查询</el-button>
            </div>
            <div ref="operationExample" class="w100 h100 processBar" />
            <div id="tip" class="tipname hide" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding-bottom:40px;">
      <el-col :span="12">
        <div class="chartsBg">
          <div class="flexBox">
            <h4 class="pieTitle">岗位参与情况Top10</h4>
            <div class="details">
              <a href="#/analyseWatchCenter/bpaPostDetails">查看更多</a>
            </div>
          </div>
          <div style="height:40px" />
          <div class="operationEcharts">
            <div ref="approvalTime" class="w100 positionBar" />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chartsBg">
          <h4 class="pieTitle">流程阅读量</h4>
          <div class="operationEcharts">
            <div class>
              <div ref="processNode" class="w100 processBar1" />
              <div id="tip1" class="tipname hide" />
            </div>
            <div class="processNum">
              <div>
                <p class="processName">本周发布流程数</p>
                <p class="num"></p>
                <p>
                  周环比
                  <i class="el-icon-bottom dec" />
                  <i class="el-icon-top up" />
                </p>
              </div>
              <div>
                <p class="processName">本周更新流程数</p>
                <p class="num"></p>
                <p>
                  周环比
                  <i class="el-icon-bottom dec" />
                  <i class="el-icon-top up" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import $ from 'jquery'
import 'echarts-liquidfill'
import analysisHeader from '../../../components/AnalysisHeader'
import { formatDate, getMonthDays } from '@/bpa/utils/common.js'
// 接口请求部分
import {
  getBpaNum,
  getOneFrameworkList,
  getPositionParticipation,
  getProcessReadingDetail,
  getNewProcessNumRate,
  getUpdateProcessNumRate,
  getProcessFlow
} from '@/bpa/api/analyseWatchCenter'

export default {
  components: {
    analysisHeader
  },
  data() {
    return {
      getProcessAddData: [],
      weekUpdateData: {},
      weekAddData: {},
      readingDate: [],
      endTime: '',
      startTime: '',
      processendTime: formatDate(new Date()),
      processstartTime: '2019-01-01',
      // props: { checkStrictly: true, label: 'name', value: 'id', multiple: true },
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
      ],
      getDateData: 'year',
      processValue: [],
      value1: '',
      options: [],
      value: ''
    }
  },
  computed: {},

  mounted() {
    // this.setOperationExample('')
    // this.setApprovalTime('')
    // this.getBpaNumList('')
    // this.getModelTree()
    // this.getTop()
    // this.getAddNum('')
    // this.getUpdateNum('')
  },
  methods: {
    // 获取年月日
    getTop() {
      var now = new Date() // 当前日期
      var nowDayOfWeek = now.getDay() - 1 // 今天本周的第几天
      var nowDay = now.getDate() // 当前日
      var nowMonth = now.getMonth() // 当前月
      var nowYear = now.getFullYear() // 当前年
      var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
      var weekEndDate = new Date(
        nowYear,
        nowMonth,
        nowDay + (6 - nowDayOfWeek)
      )
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
      switch (this.getDateData) {
        case 'day': {
          this.endTime = nowYear + '-' + nowMonth + '-' + nowDay
          this.startTime = nowYear + '-' + nowMonth + '-' + nowDay
          this.setProcessNode('')
          break
        }
        case 'week': {
          this.startTime = formatDate(weekStartDate)
          this.endTime = formatDate(weekEndDate)
          this.setProcessNode('')
          break
        }
        case 'month': {
          this.startTime = formatDate(monthStartDate)
          this.endTime = formatDate(monthEndDate)
          this.setProcessNode('')
          break
        }
        case 'year': {
          this.startTime = '2019-01-01'
          this.endTime = formatDate(new Date())
          this.setProcessNode('')
          break
        }
      }
    },
    // 时间格式转换
    formatDateTime(date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      // d = d < 10 ? ('0' + d) : d
      // var h = date.getHours()
      // var minute = date.getMinutes()
      // minute = minute < 10 ? ('0' + minute) : minute
      return y + '-' + m + '-' + d
    },
    getReadingDate(ele) {
      if (ele == null) {
        this.readingDate = []
      } else {
        this.startTime = this.formatDateTime(this.readingDate[0])
        this.endTime = this.formatDateTime(this.readingDate[1])
      }
      this.setProcessNode()
    },
    submitForm(ele) {
      this.setOperationExample()
    }
    // 选择业务域确定
    // submitForm1() {
    //   // const processValues = this.processValue.toString()
    //   // this.setOperationExample(processValues)
    //   // this.setApprovalTime(processValues)
    //   // this.getBpaNumList(processValues)
    //   // this.setProcessNode(processValues)
    //   // this.getAddNum(processValues)
    //   // this.getUpdateNum(processValues)
    // },
    // 获取流程框架
    // getModelTree() {
    //   // getOneFrameworkList({}).then(res => {
    //   //   const arr = res
    //   //   arr.forEach(function(item) {
    //   //     delete item.children
    //   //   })
    //   //   const map = {} // 构建map
    //   //   arr.forEach(i => {
    //   //     map[i.id] = i // 构建以area_id为键 当前数据为值
    //   //   })
    //   //   const treeData = []
    //   //   arr.forEach(child => {
    //   //     const mapItem = map[child.pid] // 判断当前数据的parent_id是否存在map中
    //   //     if (mapItem) {
    //   //       // 存在则表示当前数据不是最顶层的数据
    //   //       // 注意： 这里的map中的数据是引用了arr的它的指向还是arr,当mapItem改变时arr也会改变，踩坑点
    //   //       (mapItem.children || (mapItem.children = [])).push(child) // 这里判断mapItem中是否存在child
    //   //     } else {
    //   //       // 不存在则是顶层数据
    //   //       treeData.push(child)
    //   //     }
    //   //   })
    //   //   this.options = treeData
    //   //   console.log(treeData, 55555)
    //   // })
    // },

    // 流程发布情况
    // setOperationExample(processValues) {
    //   const firstChild = echarts.init(this.$refs.operationExample)
    //   firstChild.on('mouseover', function(params) {
    //     // 鼠标经过图表时候判断参数  ---请开始你的表演
    //     if (params.componentType === 'xAxis') {
    //       var tt = $('#tip')
    //       tt.html(params.value)
    //       tt.css('left', params.event.event.layerX + 10)
    //       tt.css('top', params.event.event.layerY + 20)
    //       tt.show()
    //     }
    //   })
    //   firstChild.on('mouseout', function(params) {
    //     $('#tip').hide()
    //   })
    //   const obj = 'time=' + this.processstartTime + ',' + this.processendTime + '&' + 'id=' + processValues

    //   getProcessFlow(obj).then(res => {
    //     const nameList = res.map(item => item.name)
    //     const releaseValueList = res.map(item => item.releaseValue)
    //     const updateValueList = res.map(item => item.updateValue)
    //     const unfinishedValueList = res.map(item => item.unfinishedValue)
    //     var option = {
    //       color: ['#00f6ff', '#03989f', '#4aa4ff'],
    //       tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //           // 坐标轴指示器，坐标轴触发有效
    //           type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    //         }
    //       },
    //       legend: {
    //         data: ['已发布', '已更新', '未完成'],
    //         textStyle: {
    //           //   fontSize: 18, // 字体大小
    //           color: '#ffffff' // 字体颜色
    //         }
    //       },
    //       grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //       },
    //       xAxis: [
    //         {
    //           type: 'category',
    //           axisLabel: {
    //             show: true,
    //             rotate: 60,
    //             formatter: function(value) {
    //               return value.length > 6 ? value.slice(0, 6) + '...' : value
    //             },
    //             textStyle: {
    //               fontSize: 14,
    //               color: '#fff'
    //             }
    //           },
    //           axisLine: {
    //             lineStyle: {
    //               type: 'solid',
    //               color: '#6EEBFF',
    //               width: '1'
    //             }
    //           },
    //           data: nameList,
    //           triggerEvent: true
    //         }
    //       ],
    //       yAxis: [
    //         {
    //           type: 'value',
    //           splitLine: {
    //             lineStyle: {
    //               type: 'dashed',
    //               color: '#1f4771'
    //             }
    //           },
    //           axisLine: {
    //             lineStyle: {
    //               type: 'solid',
    //               color: '#6EEBFF',
    //               width: '1'
    //             }
    //           },
    //           axisLabel: {
    //             show: true,
    //             textStyle: {
    //               color: '#fff'
    //             }
    //           }
    //         }
    //       ],
    //       series: [
    //         {
    //           name: '已发布',
    //           type: 'bar',
    //           stack: '广告',
    //           barWidth: 30,
    //           data: releaseValueList
    //         },
    //         {
    //           name: '已更新',
    //           type: 'bar',
    //           stack: '广告',
    //           barWidth: 30,
    //           data: updateValueList
    //         },
    //         {
    //           name: '未完成',
    //           type: 'bar',
    //           barWidth: 30,
    //           data: unfinishedValueList
    //           // markLine: {
    //           //   // lineStyle: {
    //           //   //   normal: {
    //           //   //     type: 'dashed'
    //           //   //   }
    //           //   // },
    //           //   data: [
    //           //     [{ type: 'min' }, { type: 'max' }]
    //           //   ]
    //           // }
    //         }
    //       ]
    //     }
    //     firstChild.setOption(option)
    //   })
    // },
    // 岗位参与情况Top10
    // setApprovalTime(processValues) {
    //   const firstChild = echarts.init(this.$refs.approvalTime)
    //   const obj = 'ids=' + processValues
    //   getPositionParticipation(obj).then(res => {
    //     const nameList = res.map(item => item.detpName)
    //     const countList = res.map(item => item.count)
    //     var option = {
    //       color: ['#08eff4'],
    //       tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //           type: 'shadow'
    //         }
    //       },
    //       legend: {
    //         // data: ['2011年']
    //       },
    //       grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '3%',
    //         containLabel: true
    //       },
    //       xAxis: {
    //         type: 'value',
    //         axisLine: {
    //           lineStyle: {
    //             type: 'none'
    //             // color: '#6EEBFF',
    //             // width: '1'
    //           }
    //         },
    //         splitLine: {
    //           lineStyle: {
    //             type: 'dashed',
    //             color: '#1f4771'
    //           }
    //         },
    //         axisLabel: {
    //           show: false,
    //           textStyle: {
    //             color: '#fff'
    //           }
    //         },
    //         boundaryGap: [0, 0.01]
    //       },
    //       yAxis: {
    //         type: 'category',
    //         inverse: true, // 倒叙
    //         splitLine: {
    //           lineStyle: {
    //             type: 'dashed',
    //             color: '#1f4771'
    //           }
    //         },
    //         axisLine: {
    //           lineStyle: {
    //             type: 'solid',
    //             color: '#6EEBFF',
    //             width: '1'
    //           }
    //         },
    //         axisLabel: {
    //           show: true,
    //           textStyle: {
    //             fontSize: 14,
    //             color: '#fff'
    //           }
    //         },
    //         data: nameList
    //       },
    //       series: [
    //         {
    //           // name: '2011年',
    //           type: 'bar',
    //           barWidth: 30,
    //           label: {
    //             normal: {
    //               position: 'right',
    //               show: true,
    //               textStyle: {
    //                 fontWeight: 'bolder',
    //                 fontSize: '12',
    //                 fontFamily: '微软雅黑',
    //                 color: '#fff'
    //               }
    //             }
    //           },
    //           data: countList
    //         }
    //       ]
    //     }
    //     firstChild.setOption(option)
    //   })
    // },
    // 流程阅读量
    // setProcessNode(processValues) {
    //   const firstChild = echarts.init(this.$refs.processNode)
    //   firstChild.on('mouseover', function(params) {
    //     // 鼠标经过图表时候判断参数  ---请开始你的表演
    //     if (params.componentType === 'xAxis') {
    //       var tt = $('#tip1')
    //       tt.html(params.value)
    //       tt.css('left', params.event.event.layerX + 10)
    //       tt.css('top', params.event.event.layerY + 20)
    //       tt.show()
    //     }
    //   })
    //   firstChild.on('mouseout', function(params) {
    //     $('#tip').hide()
    //   })
    //   const obj = 'startTime=' + this.startTime + '&endTime=' + this.endTime + '&ids=' + processValues
    //   console.log(obj,123)
    //   getProcessReadingDetail(obj).then(res => {
    //     if (res == null) {
    //       return
    //     }
    //     const nameList = res.map(item => item.name)
    //     const browserNumList = res.map(item => item.browserNum)
    //     var option = {
    //       color: ['#00dfc8'],
    //       tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //           type: 'shadow'
    //         }
    //       },
    //       xAxis: {
    //         type: 'category',
    //         boundaryGap: true,
    //         axisLine: {
    //           lineStyle: {
    //             type: 'solid',
    //             color: '#6EEBFF',
    //             width: '1'
    //           }
    //         },
    //         axisLabel: {
    //           rotate: 60,
    //           show: true,
    //           formatter: function(value) {
    //             return value.length > 4 ? value.slice(0, 3) + '...' : value
    //           },
    //           textStyle: {
    //             fontSize: 14,
    //             color: '#fff'
    //           }
    //         },
    //         triggerEvent: true,
    //         data: nameList
    //       },
    //       yAxis: {
    //         type: 'value',
    //         splitLine: {
    //           lineStyle: {
    //             type: 'dashed',
    //             color: '#1f4771'
    //           }
    //         },
    //         axisLine: {
    //           lineStyle: {
    //             type: 'solid',
    //             color: '#6EEBFF',
    //             width: '1'
    //           }
    //         },
    //         axisLabel: {
    //           show: true,
    //           textStyle: {
    //             fontSize: 14,
    //             color: '#fff'
    //           }
    //         }
    //       },
    //       series: [
    //         {
    //           smooth: true,
    //           data: browserNumList,
    //           type: 'line',
    //           areaStyle: {
    //             color: ['#05253b']
    //           }
    //         }
    //       ]
    //     }
    //     firstChild.setOption(option)
    //   })
    // },
    // 获取关键指标
    // getBpaNumList(processValues) {
    //   const obj = 'id=' + processValues
    //   getBpaNum(obj).then(res => {
    //     console.log(res, 55555)
    //     this.headerList.map(item => {
    //       if (item.name === '发布流程总数') {
    //         this.$set(item, 'num', res.totalNum)
    //       }
    //       if (item.name === '流程节点总数') {
    //         this.$set(item, 'num', res.nodeNum)
    //       }
    //       if (item.name === '覆盖岗位') {
    //         this.$set(item, 'num', res.jobNum)
    //       }
    //       if (item.name === '手工节点') {
    //         this.$set(item, 'num', parseInt(res.offlineNodeNum))
    //       }
    //       if (item.name === '线上节点') {
    //         this.$set(item, 'num', parseInt(res.taskNodeNum))
    //       }
    //     })
    //   })
    // }
    // 获取本周发布流程数
    // getAddNum(processValues) {
    //   const obj = 'ids=' + processValues
    //   getNewProcessNumRate(obj).then(res => {
    //     this.weekAddData = res
    //   })
    // },
    // 获取本周更新发布流程数
    // getUpdateNum(processValues) {
    //   const obj = 'ids=' + processValues
    //   getUpdateProcessNumRate(obj).then(res => {
    //     this.weekUpdateData = res
    //   })
    // }
  }
}
</script>

<style scoped lang="scss">
#bpaAnalysis {
  color: #fff;
  .operationEcharts {
    width: 100%;
    // height: 500px;
  }
  .hide {
    display: none;
  }
  .tipname {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    max-width: 400px;
    padding: 5px;
    z-index: 1;
    color: #fff;
  }
  .padding10 {
    padding-top: 60px;
    margin-left: 50px;
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .pieTitleH {
    color: #ffffff;
    height: 36px;
    position: absolute;
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
    top: 10px;
    z-index: 30;
    font-size: 16px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
    left: 3%;
  }
  .up {
    color: #019774;
    font-size: 14px;
    margin: 0 2px;
  }
  .dec {
    font-size: 14px;
    color: #fe6d4c;
    margin: 0 2px;
  }
  .processNum {
    display: flex;
    justify-content: space-around;
  }
  .num {
    font-size: 30px;
    color: #0de8f7;
  }
  .processName {
    font-size: 16px;
  }
  .processBar {
    width: 100%;
    height: 500px;
  }
  .processBar1 {
    height: 400px;
    margin-bottom: 10px;
  }
  .positionBar {
    // padding-top: 40px;
    height: 400px;
  }
  .details {
    position: absolute;
    right: 7%;
    top: 20px;
    font-size: 16px;
    a {
      width: 100%;
      height: 36px;
      display: inline-block;
      color: #fff;
    }
  }
  .processdetails {
    right: 3%;
  }
  .process {
    text-align: right;
    margin-bottom: 14px;
    margin-right: 14px;
  }
  .datePicker {
    padding: 10px;
    margin-left: 80px;
  }
  .chartsBg {
    position: relative;
    background: url("../../../assets/img/qietu/borderImg.png") no-repeat;
    background-size: 100% 100%;
    height: 500px;
  }
  .chartsBg1 {
    height: 620px;
    position: relative;
    background-size: cover;
    background: url("../../../assets/img/qietu/bg_m.png") no-repeat;
  }
  .pieTitle {
    color: #ffffff;
    height: 36px;
    position: absolute;
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
    top: 10px;
    left: 7%;
    z-index: 30;
    font-size: 16px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
  }
  .run {
    display: flex;
    text-align: center;
    justify-content: space-around;
    .runItem {
      width: 18%;
    }
  }
  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
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
u
