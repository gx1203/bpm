<template>
  <div id="operation" class="w100 operation">
    <div class="datePicker">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-date-picker clearable
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
    <el-row :gutter="20" style="padding-bottom:20px">
      <analysisHeader :header-list="headerList" />
    </el-row>
    <el-row :gutter="20" style="padding-bottom:20px">
      <el-col :span="19">
        <div class="chartsBg">
          <div class="flexBox">
            <h4 class=" pieTitle">运行实例</h4>
            <div class="details processdetails" @click="getProcessList">选择流程</div>
          </div>
          <div id="operationExample" class="operationEcharts1" />
          <div id="tip" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="5">
        <div class="chartsBg">
          <div class="flexBox">
            <h4 class=" pieTitle">流程发起数排名</h4>
            <div class="details">
              <a href="#/analyseWatchCenter/ProcessInitiationRanking">更多</a>
            </div>
          </div>
          <div class="processNum">
            <el-row
              v-for="(item,index) in proseeRankData"
              :gutter="20"
              :key="index"
              style="line-height:36px;"
            >
              <el-col :span="4">
                <div class="goodDivTop goodDiv">
                  <span v-if="index==0">{{ index+1 }}</span>
                </div>
                <div class="goodDivTop1 goodDiv">
                  <span v-if="index==1">{{ index+1 }}</span>
                </div>
                <div class="goodDivTop2 goodDiv">
                  <span v-if="index==2">{{ index+1 }}</span>
                </div>
                <div class="goodDiv">
                  <span v-if="index>2">{{ index+1 }}</span>
                </div>
              </el-col>
              <el-col :span="14">
                <p :title="item.processnamecn" class="text_overflow_2">{{ item.processnamecn }}</p>
              </el-col>
              <el-col :span="6">{{ item.applycount }}</el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding-bottom:40px">
      <el-col :span="12">
        <div class="chartsBg chartsBg1">
          <h4 class="pieTitle processTitleH">平均审批时长Top5</h4>
          <div id="approvalTime" ref="approvalTime" class="operationEcharts" />
          <div id="tip1" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chartsBg chartsBg1">
          <h4 class="pieTitle processTitleH">单个流程节点平均流转时间top5</h4>
          <div style="padding:10px 10px 0 40px;">
            <el-radio-group v-model="radio1" @change="getTop">
              <el-radio-button v-if="getProcessAverageData[0]" label="Top1" />
              <el-radio-button v-if="getProcessAverageData[1]" label="Top2" />
              <el-radio-button v-if="getProcessAverageData[2]" label="Top3" />
              <el-radio-button v-if="getProcessAverageData[3]" label="Top4" />
              <el-radio-button v-if="getProcessAverageData[4]" label="Top5" />
            </el-radio-group>
            <div style="margin-top:10px">{{ name }}</div>
          </div>
          <div ref="processNode" class="processNode" />
          <div id="tip3" class="tipname hide" />
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="800px" :title="$t('selectProcess')">
      <el-input clearable
        v-model="processName"
        placeholder="请输入搜索内容"
        prefix-icon="el-icon-search"
        style="margin-bottom:10px;width:200px"
        @change="getSearch"
        @keyup.enter.native="getSearch"
      />
      <el-transfer
        v-model="processValueData"
        :data="processData"
        :titles="['流程列表', '已选择流程']"
        filter-placeholder="请输入流程拼音"
      >
        <span slot-scope="{ option }" :title="option.label">{{ option.label }}</span>
        <el-button v-show="showMore" slot="left-footer" @click="loadMore">更多</el-button>
      </el-transfer>
      <div style="text-align:right">
        <el-button type="primary" @click="remove">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="processQuit">{{ $t('confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'
import $ from 'jquery'
import selectMonth from '../components/SelectMonth.vue'
import { getTreeData, getFormateDate } from '@/bpm/utils/common.js'
import analysisHeader from '../components/AnalysisHeader.vue'
// 接口请求部分
import {
  getModel,
  getOperationList,
  getProcessList,
  getKeyList,
  getProcessRank,
  getProcessAverageTime
} from '@/bpm/api/analyseWatchCenter'

export default {
  components: {
    analysisHeader,
    selectMonth
  },
  data() {
    return {
      yearValue: getFormateDate(new Date(), 'yyyy'),
      monthValue: '',
      showMore: false,
      pages: '',
      name: '',
      processName: '',
      topList: [],
      getProcessAverageData: [],
      processNodeData: [],
      proseeRankData: [],
      processValue: '',
      startTime: '',
      endTime: '',
      operationList: [],
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
      ],
      dialogVisible: false,
      processData: [],
      processValueData: [],
      processDataString: '',
      props: { checkStrictly: true, label: 'modelname', value: 'id' },
      radio1: 'Top1',
      options: [],
      value: '',
      pageNum: '1'
    }
  },
  computed: {},
  mounted() {
    this.getModelTree() // 获取业务域
    this.getKeyData()
    this.getProcessRankList()
    this.setOperationExample()
    this.setApprovalTime()
  },
  methods: {
    getSearch() {
      this.getProcess()
    },
    getMonthTime(data) {
      this.monthValue = data
      let yearData
      const date = new Date()
      if (this.monthValue == 12) {
        yearData = getFormateDate(new Date((date.getFullYear() - 1).toString()), 'yyyy')
        this.yearValue = yearData
      }
    },
    remove() {
      this.dialogVisible = false
      this.showMore = false
      this.processValueData = []
      this.pages = '0'
      this.pageNum = '1'
    },
    // 获取Top
    getTop() {
      switch (this.radio1) {
        case 'Top1':
          this.setProcessNode(0)
          break
        case 'Top2':
          this.setProcessNode(1)
          break
        case 'Top3':
          this.setProcessNode(2)
          break
        case 'Top4':
          this.setProcessNode(3)
          break
        case 'Top5':
          this.setProcessNode(4)
          break
      }
    },
    // 获取关键指标
    getKeyData() {
      const obj = {
        modelid: this.processValue[this.processValue.length - 1],
        date: this.yearValue + '-' + this.monthValue
      }
      getKeyList(obj).then(res => {
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
    // 获取流程数排名
    getProcessRankList() {
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1],
          date: this.yearValue + '-' + this.monthValue
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: 'applycount',
        pageNum: this.pageNum,
        pageSize: 10,
        sort: 'desc'
      }
      getProcessRank(obj).then(res => {
        this.proseeRankData = res.list
      })
    },
    // 选择时间确定
    submitForm(ele) {
      this.setOperationExample()
      this.getKeyData()
      this.getProcessRankList()
      this.setApprovalTime()
    },
    // 更多流程列表
    loadMore() {
      if (this.pages <= 1 || this.pageNum === 0) {
        // 总页数小于1或者已经点击到最后一页
        this.showMore = false
        return
      }
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1]
        },
        filters: [
          {
            key: 'processnamecn',
            opt: 'LIKE',
            type: 'S',
            value: this.processName
          }
        ],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum: this.pageNum,
        pageSize: 10,
        sort: ''
      }
      getProcessList(obj).then(res => {
        this.pageNum = res.nextPage
        res.list.forEach(item => {
          this.processData.push({
            label: item.processnamecn,
            key: item.processname
          })
        })
      })
    },
    // 获取流程框架
    getModelTree() {
      getModel({}).then(res => {
        this.options = getTreeData(res)
      })
    },
    getProcessList() {
      this.dialogVisible = true
      this.processValueData = []
      this.pageNum = '1'
      this.getProcess()
    },
    // 获取流程列表
    getProcess() {
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1]
        },
        filters: [
          {
            key: 'processnamecn',
            opt: 'LIKE',
            type: 'S',
            value: this.processName
          }
        ],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum: this.pageNum,
        pageSize: 10,
        sort: ''
      }
      getProcessList(obj).then(res => {
        this.pageNum = res.nextPage
        this.pages = res.pages
        const backupData = []
        res.list.forEach(item => {
          backupData.push({
            label: item.processnamecn,
            key: item.processname
          })
        })
        if (this.pages > 1) {
          this.showMore = true
        }
        this.processData = backupData
      })
    },
    // 确定选择流程
    processQuit() {
      if (this.processValueData.length > 10) {
        alert('最多只能选择10个流程')
      } else {
        const s = this.processValueData.toString()
        this.processDataString = s
        this.setOperationExample()
        this.dialogVisible = false
      }
    },
    // 运行实例
    setOperationExample() {
      const obj = {
        modelid: this.processValue[this.processValue.length - 1],
        date: this.yearValue + '-' + this.monthValue,
        processname: this.processDataString
      }
      getOperationList(obj).then(res => {
        this.operationList = res
        const nameList = this.operationList.map(item => {
          return item.processnamecn
        })
        const dataList = this.operationList.map(item => item.runingcount)
        const finishList = this.operationList.map(item => item.finishcount)
        const operationExample = document.getElementById('operationExample')
        const firstChild = echarts.init(operationExample)
        firstChild.on('mouseover', function(params) {
          // 鼠标经过图表时候判断参数  ---请开始你的表演
          if (params.componentType === 'xAxis') {
            var tt = $('#tip')
            tt.html(params.value)
            tt.css('left', params.event.event.layerX + 10)
            tt.css('top', params.event.event.layerY + 20)
            tt.show()
          }
        })
        firstChild.on('mouseout', function(params) {
          $('#tip').hide()
        })
        var option = {
          color: ['#00f6ff', '#03989f'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: [this.$t('completed'), this.$t('beingProcessed')],
            textStyle: {
              color: '#ffffff' // 字体颜色
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              axisLabel: {
                rotate: 60,
                formatter: function(value) {
                  return value.length > 4 ? value.slice(0, 3) + '...' : value
                },
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 14
                }
              },
              triggerEvent: true,
              data: nameList
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#1f4771'
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  fontSize: 14,
                  color: '#ffffff'
                }
              }
            }
          ],
          series: [
            {
              name: this.$t('completed'),
              type: 'bar',
              stack: '运行实例',
              barWidth: 30,
              data: finishList
            },
            {
              name: this.$t('beingProcessed'),
              type: 'bar',
              barWidth: 30,
              stack: '运行实例',
              data: dataList
            }
          ]
        }

        firstChild.setOption(option)
      })
    },
    // 平均审批时长Top5
    setApprovalTime() {
      const approvalTime = document.getElementById('approvalTime')
      const firstChild = echarts.init(approvalTime)
      firstChild.on('mouseover', function(params) {
        // 鼠标经过图表时候判断参数  ---请开始你的表演
        if (params.componentType === 'xAxis') {
          var tt = $('#tip1')
          tt.html(params.value)
          tt.css('left', params.event.event.layerX + 10)
          tt.css('top', params.event.event.layerY + 20)
          tt.show()
        }
      })
      firstChild.on('mouseout', function(params) {
        $('#tip1').hide()
      })
      const obj = {
        modelid: this.processValue[this.processValue.length - 1],
        date: this.yearValue + '-' + this.monthValue
      }
      getProcessAverageTime(obj)
        .then(res => {
          console.log(res)
          this.getProcessAverageData = res
          const nameList = res.map(item => item.processnamecn)
          this.topList = nameList
          const averagetimeList = res.map(item => item.averagetime)
          const insaveragetimeList = res.map(item => item.insaveragetime)
          var option = {
            color: ['#00f6ff', '#03989f'],
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['平均审批时长', '流程审批时长'],
              textStyle: {
                // fontSize: 18, // 字体大小
                color: '#ffffff' // 字体颜色
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              // feature: {
              //   saveAsImage: {}
              // }
            },
            xAxis: {
              type: 'category',
              boundaryGap: true,
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              axisLabel: {
                show: true,
                rotate: 60,
                formatter: function(value) {
                  return value.length > 4 ? value.slice(0, 4) + '...' : value
                },
                textStyle: {
                  fontSize: 14,
                  color: '#ffffff'
                }
              },
              triggerEvent: true,
              data: nameList
            },
            yAxis: {
              type: 'value',
              name: '天',
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#1f4771'
                }
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  fontSize: 14,
                  color: '#ffffff'
                }
              }
            },
            series: [
              {
                name: '平均审批时长',
                type: 'line',
                data: insaveragetimeList
              },
              {
                name: '流程审批时长',
                type: 'line',
                data: averagetimeList
              }
            ]
          }
          firstChild.setOption(option)
        })
        .then(res => {
          this.getTop()
        })
    },
    // top5单个流程节点平均流转时间
    setProcessNode(num) {
      if (
        this.getProcessAverageData.length <= 0 ||
        this.getProcessAverageData[this.getProcessAverageData.length - 1]
          .length <= 0
      ) {
        this.getProcessAverageData = []
        this.processNodeData = []
        this.getProcessAverageData[num] = []
        this.getProcessAverageData[num].processnamecn = ''
      } else {
        // this.name = this.getProcessAverageData[num].processnamecn
        this.processNodeData = this.getProcessAverageData[num].processNodeAverageTime
      }
      this.name = this.getProcessAverageData[num].processnamecn
      const nameList = this.processNodeData.map(item => item.nodename)
      const maxapprovaltimeList = this.processNodeData.map(
        item => item.maxapprovaltime
      )
      const minapprovaltimeList = this.processNodeData.map(
        item => item.minapprovaltime
      )
      const averagetimeList = this.processNodeData.map(
        item => item.averagetime
      )
      averagetimeList.sort(function(a, b) {
        return a - b
      })
      maxapprovaltimeList.sort(function(a, b) {
        return a - b
      })
      const maxList = averagetimeList[averagetimeList.length - 1]
      const listMax = maxapprovaltimeList[maxapprovaltimeList.length - 1]
      console.log(maxList, listMax, nameList, 1)
      const firstChild = echarts.init(this.$refs.processNode)
      firstChild.on('mouseover', function(params) {
        // 鼠标经过图表时候判断参数  ---请开始你的表演
        if (params.componentType === 'xAxis') {
          var tt = $('#tip3')
          tt.html(params.value)
          tt.css('left', params.event.event.clientX - 10)
          tt.css('top', params.event.event.layerY + 30)
          tt.show()
        }
      })
      firstChild.on('mouseout', function(params) {
        $('#tip3').hide()
      })
      var option = {
        color: ['#0598a2', '#03f8fd', '#4ca1fe'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['avg', 'min', 'max'],
          textStyle: {
            //   fontSize: 18, // 字体大小
            color: '#ffffff' // 字体颜色
          }
        },
        toolbox: {
          // feature 各工具配置项: dataZoom 数据区域缩放;restore 配置项还原;saveAsImage下载为图片;magicType动态类型切换
          feature: {}
        },
        xAxis: [
          {
            type: 'category',
            data: nameList,
            triggerEvent: true,
            axisPointer: {
              type: 'shadow'
            },
            scale: true,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#6EEBFF',
                width: '1'
              }
            },
            axisLabel: {
              interval: 0,
              rotate: 60,
              formatter: function(value) {
                return value.length > 4 ? value.slice(0, 3) + '...' : value
              },
              show: true,
              textStyle: {
                fontSize: 14,
                color: '#ffffff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '平均流转时间（h）',
            min: 0,
            max: Math.ceil(maxList),
            interval: Math.ceil(maxList) / 5,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#6EEBFF',
                width: '1'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 14,
                color: '#ffffff'
              },
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#1f4771'
              }
            }
          },
          {
            type: 'value',
            name: '流转时间（h）',
            min: 0,
            max: Math.ceil(listMax),
            interval: Math.ceil(listMax) / 5,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#6EEBFF',
                width: '1'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 14,
                color: '#ffffff'
              },
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#1f4771'
              }
            }
          }
        ],
        series: [
          {
            name: 'avg',
            type: 'bar',
            barWidth: '30',
            data: averagetimeList || ''
          },
          {
            name: 'min',
            type: 'line',
            yAxisIndex: 1,
            data: minapprovaltimeList || ''
          },
          {
            name: 'max',
            type: 'line',
            yAxisIndex: 1,
            data: maxapprovaltimeList || ''
          }
        ]
      }

      firstChild.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
#operation {
  color: #768ec9;
  .operationEcharts1 {
    width: 100%;
    height: 420px;
    box-sizing: border-box;
    overflow: hidden;
    // border: 1px solid rgba(0, 69, 125, 1);
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
  .processNum {
    padding-top: 40px;
  }
  .processdetails {
    right: 10%;
  }

  .chartsBg {
    padding-top: 20px;
    box-sizing: border-box;
    background: url("../../../assets/img/analyseWatchCenter/borderImg.png") no-repeat;
    background-size: 100% 100%;
    height: 480px;
  }
  .chartsBg1 {
    height: 600px;
  }
  .goodDiv {
    width: 100%;
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 30;
  }
  .goodDivTop {
    background: url("../../../assets/img/analyseWatchCenter/good1.png") no-repeat;
    background-position: center;
  }
  .goodDivTop1 {
    background: url("../../../assets/img/analyseWatchCenter/good2.png") no-repeat;
    background-position: center;
  }
  .goodDivTop2 {
    background: url("../../../assets/img/analyseWatchCenter/good3.png") no-repeat;
    background-position: center;
  }
  .goodImg {
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .processTitleH{
    margin-left: 5%;
  }
  .flexBox {
    width: 90%;
    margin-top: 20px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .details {
    line-height: 36px;
    font-size: 16px;
    color: #fff;
    a {
      color: #fff;
    }
  }
  .details:hover {
    cursor: pointer;
  }
  .processNode {
    width: 100%;
    height: 470px;
  }
  .process {
    display: flex;
    justify-content: space-between;
  }
  .datePicker {
    text-align: right;
    margin-bottom: 20px;
    span {
      margin-left: 20px;
    }
  }
  .pieTitle {
    color: #ffffff;
    height: 36px;
    font-size: 16px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
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
    height: 540px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // border: 1px solid rgba(0, 69, 125, 1);
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
