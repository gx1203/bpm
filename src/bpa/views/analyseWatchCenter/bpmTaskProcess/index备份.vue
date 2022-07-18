<template>
  <div id="bpmTaskProcess" :style="{height:(screenHeight)+'px'}" class="w100 bpaAnalysis">
    <div class="datePicker">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-date-picker
            v-model="yearValue"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年"
            @change="submitForm"
          />
        </el-col>
        <el-col :span="3">
          <select-month @getSeason="getMonthTime" />
        </el-col>
        <el-col :span="6">
          <span>业务域</span>
          <el-cascader
            v-model="processValue"
            :options="options"
            :props="props"
            clearable
            @change="submitForm1"
          />
        </el-col>
        <el-col :span="6">
          <span>节点类型</span>
          <el-select clearable v-model="approvalValue" :placeholder="$t('pleaseSelect')" @change="approvalSubmit">
            <el-option
              v-for="item in approvalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"

            />
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForms">查询</el-button>
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
            <h4>任务效率分析表（按流程）</h4>
          </div>
          <div class="details">
            <router-link :to="{path: '/analyseWatchCenter/bpmTaskProcessDetails'}">
              <el-button type="primary">报表分析</el-button>
            </router-link>
          </div>
          <div class="operationEcharts">
            <el-row class="bpmTaskProcess-bottom">
              <el-col :span="24" style="margin-top:20px">
                <el-row
                  v-if="processStart"
                  class="bpmTaskProcess-bottom-information"
                  style="margin-bottom:24px"
                >
                  <el-col :span="10">
                    <el-row>
                      <el-col
                        :span="8"
                        class="bpmTaskProcess-bottom-information-title"
                        style="padding:14px"
                      >流程发起</el-col>
                      <el-col :span="16" class="bpmTaskProcess-bottom-information-title">
                        <div class="bpmTaskProcess-bottom-information-title-top">节点数量</div>
                        <div class="bpmTaskProcess-bottom-information-title-box">
                          <div
                            class="bpmTaskProcess-bottom-information-title-bottom"
                            @click="nodeSort('up','node')"
                          >
                            <i class="el-icon-caret-top" />
                          </div>
                          <div
                            class="bpmTaskProcess-bottom-information-title-bottom"
                            @click="nodeSort('down','node')"
                          >
                            <i class="el-icon-caret-bottom" />
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div ref="operationExample" class="w100 h100 processBar" />
                        <div id="tip" class="tipname hide" />
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="7">
                    <el-row>
                      <el-col :span="24" class="bpmTaskProcess-bottom-information-title">
                        <div class="bpmTaskProcess-bottom-information-title-top">累计总时长</div>
                        <div class="bpmTaskProcess-bottom-information-title-box">
                          <div
                            class="bpmTaskProcess-bottom-information-title-bottom"
                            @click="nodeSort('up','time')"
                          >
                            <i class="el-icon-caret-top" />
                          </div>
                          <div
                            class="bpmTaskProcess-bottom-information-title-bottom"
                            @click="nodeSort('down','time')"
                          >
                            <i class="el-icon-caret-bottom" />
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div ref="operationExample1" class="w100 h100 processBar" />
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="7">
                    <el-row>
                      <el-col :span="24" class="bpmTaskProcess-bottom-information-title">
                        <div
                          class="bpmTaskProcess-bottom-information-title-top"
                          style="margin-left:24%"
                        >平均时长环比增效（百分比）</div>
                        <div class="bpmTaskProcess-bottom-information-title-box">
                          <div
                            class="bpmTaskProcess-bottom-information-title-bottom"
                            @click="nodeSort('up','Duration')"
                          >
                            <i class="el-icon-caret-top" />
                          </div>
                          <div
                            class="bpmTaskProcess-bottom-information-title-bottom"
                            @click="nodeSort('down','Duration')"
                          >
                            <i class="el-icon-caret-bottom" />
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div ref="operationExample2" class="w100 h100 processBar" />
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row
                  v-if="!processStart"
                  class="bpmTaskProcess-bottom-information processBarKong"
                >
                  <el-col :span="3" class="bpmTaskProcess-bottom-information-title">部门名称</el-col>
                  <el-col :span="7" class="bpmTaskProcess-bottom-information-title">处理任务数量</el-col>
                  <el-col :span="7" class="bpmTaskProcess-bottom-information-title">累计总时长</el-col>
                  <el-col :span="7" class="bpmTaskProcess-bottom-information-title">环比增效（百分比）</el-col>
                  <el-col :span="24" class="bpmTaskProcess-bottom-information-kong">
                    <i class="el-icon-warning-outline" />
                    暂无数据
                  </el-col>
                </el-row>
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
import echarts from 'echarts'
import 'echarts-liquidfill'
import selectMonth from '../../../components/SelectMonth.vue'
// 默认时间
import { getTreeData, getFormateDate } from '@/bpa/utils/common.js'
import $ from 'jquery'
// 接口请求部分
import {
  getTaskEfficiencyProcess,
  getModel,
  queryTaskEfficiencyProcessTable
} from '@/bpa/api/analyseWatchCenter'
import AnalysisHeader from '../../../components/AnalysisHeader'
// 应用vuex筛选条件
import { createNamespacedHelpers } from 'vuex'
const screenStart = createNamespacedHelpers('screenStart')
export default {
  components: {
    AnalysisHeader,
    selectMonth
  },
  data() {
    return {
      approvalValue: '',
      approvalOptions: [{
        value: '1',
        label: '审批类'
      }, {
        value: '2',
        label: '处理类'
      }],
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
      processValue: '',
      props: { checkStrictly: true },
      labelPosition: '',
      screenHeight: document.documentElement.clientHeight,
      processList: [],
      processStart: true,
      processnamecnList: [],
      processnodecountList: [],
      durationtotalList: [],
      averageincreaseList: [],
      value: '',
      headerList: [
        {
          num: '0',
          name: '覆盖业务类型',
          ico: 'el-icon-share',
          color: '#06abb9',
          title: 'FBC中流程涉及的业务类型总数'
        },
        {
          num: '0',
          name: '覆盖大类',
          ico: 'el-icon-document-copy',
          color: '#b35141',
          title: 'FBC中流程涉及的业务类型下属大类总数'
        },
        {
          num: '0',
          name: '流程数量',
          ico: 'el-icon-s-data',
          color: '#019874',
          title: 'FBC中全部流程的节点累计数'
        },
        {
          num: '0',
          name: '平均时长',
          ico: 'el-icon-alarm-clock',
          color: '#b37e11',
          title: 'FBC中流程单个节点的平均处理时长'
        }
      ]
    }
  },
  computed: {
    // 获取任务效率分析按流程筛选条件
    ...screenStart.mapState(['Process'])
  },
  watch: {
    screenHeight: function(val) {
      // 监听屏幕高度变化
      var oIframe = document.getElementById('bpmTaskProcess')
      // alert(this.$store.getters.screenHeight)
      if (Number(val) < 700) {
        // alert(val)
        oIframe.style.height = Number(val) + 80 + 'px'
      } else {
        oIframe.style.height = Number(val) + 'px'
      }
    }
  },
  mounted() {
    // console.log(this.Process, 1111)
    this.getTaskEfficiencyProcess() // 获取任务效率分析基本数据(按流程)
    this.getModelTree() // 获取业务域
    this.queryTaskEfficiencyProcessTable() // 获取图表数据
    var _this = this
    window.onresize = function() {
      // 定义窗口大小变更通知事件
      _this.screenHeight = document.documentElement.clientHeight // 窗口高度
    }
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
      this.Process.yearValue = this.yearValue
      // this.Process.monthValue = this.monthValue
      localStorage.setItem('monthValue', this.monthValue)
      this.Process.approvalValue = this.approvalValue
      this.Process.processValue = this.processValue[this.processValue.length - 1]
    },
    // 挂载获取 筛选条件方法
    ...screenStart.mapActions(['getCurrentProcess']),
    // 选择时间组件回调事件
    submitForm() {
      this.Process.yearValue = this.yearValue
    },
    // 选择节点类型确定
    approvalSubmit() {
      this.Process.approvalValue = this.approvalValue
    },
    // 选择业务域确定
    submitForm1() {
      this.Process.processValue = this.processValue[this.processValue.length - 1]
    },
    // 查询
    submitForms() {
      this.getTaskEfficiencyProcess()
      this.queryTaskEfficiencyProcessTable()
    },
    // 节点排序
    nodeSort(ele, val) {
      console.log(ele, val, 11111)
      const compare = function(obj1, obj2) {
        const val1 = parseFloat(
          val === 'node'
            ? obj1.processnodecount
            : val === 'time'
              ? obj1.durationtotal
              : obj1.averageincrease
        )
        const val2 = parseFloat(
          val === 'node'
            ? obj2.processnodecount
            : val === 'time'
              ? obj2.durationtotal
              : obj2.averageincrease
        )
        if (val1 < val2) {
          if (ele === 'up') {
            return 1
          } else {
            return -1
          }
        } else if (val1 > val2) {
          if (ele === 'up') {
            return -1
          } else {
            return 1
          }
        } else {
          return 0
        }
      }
      this.processList = this.processList.sort(compare)
      const processnamecnList = [] // 流程名称
      const processnodecountList = [] // 节点数量
      const durationtotalList = [] // 累计总时长
      const averageincreaseList = [] // 平均时长环比增效（百分比)
      this.processList.map(item => {
        if (item.processnamecn == undefined) {
          processnamecnList.push('默认流程')
        } else {
          processnamecnList.push(item.processnamecn)
        }
        processnodecountList.push(parseFloat(item.processnodecount))
        durationtotalList.push(parseFloat(item.durationtotal))
        averageincreaseList.push(parseFloat(item.averageincrease))
      })
      this.processnamecnList = processnamecnList
      this.processnodecountList = processnodecountList
      setTimeout(() => {
        this.setOperationExample('node')
      }, 200)
      this.durationtotalList = durationtotalList
      setTimeout(() => {
        this.setOperationExample('time')
      }, 200)
      this.averageincreaseList = averageincreaseList
      setTimeout(() => {
        this.setOperationExample('Duration')
      }, 200)
    },
    // 获取任务效率分析基本数据(按部门)
    getTaskEfficiencyProcess() {
      const obj = {
        date: this.yearValue + '-' + this.monthValue,
        modelid: this.processValue[this.processValue.length - 1],
        nodetype: this.approvalValue
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
    // 查询任务效率分析图表数据(按流程)
    queryTaskEfficiencyProcessTable() {
      const obj = {
        'attr': {
          'modelid': this.processValue[this.processValue.length - 1],
          'date': this.yearValue + '-' + this.monthValue,
          nodetype: this.approvalValue
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum: 1,
        pageSize: 10,
        sort: ''
      }
      queryTaskEfficiencyProcessTable(obj).then(res => {
        res = res.data.data
        this.processList = res.list
        if (this.processList.length !== 0) {
          this.processStart = true
          // 遍历数据  获取不同图标需要的数据
          const processnamecnList = [] // 流程名称
          const processnodecountList = [] // 节点数量
          const durationtotalList = [] // 累计总时长
          const averageincreaseList = [] // 平均时长环比增效（百分比)
          this.processList.map(item => {
            if (item.processnamecn == undefined) {
              processnamecnList.push('默认流程')
            } else {
              processnamecnList.push(item.processnamecn)
            }
            processnodecountList.push(item.processnodecount)
            durationtotalList.push(item.durationtotal)
            averageincreaseList.push(item.averageincrease)
          })
          this.processnamecnList = processnamecnList
          this.processnodecountList = processnodecountList
          setTimeout(() => {
            this.setOperationExample('node')
          }, 200)
          this.durationtotalList = durationtotalList
          setTimeout(() => {
            this.setOperationExample('time')
          }, 200)
          this.averageincreaseList = averageincreaseList
          setTimeout(() => {
            this.setOperationExample('Duration')
          }, 200)
          this.nodeSort('up', 'node')
        } else {
          this.processStart = false
        }
      })
    },
    // 运行实例
    setOperationExample(val) {
      // 渲染条件判断
      if (val === 'node') {
        var firstChild = echarts.init(this.$refs.operationExample)
        firstChild.on('mouseover', function(params) {
          // 鼠标经过图表时候判断参数  ---请开始你的表演
          if (params.componentType === 'yAxis') {
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
        var data = this.processnodecountList.concat()
        var colorList = []
        var _datamax = []
        data.map((item, index) => {
          // 判断数据正负 显示颜色
          if (item >= 0) {
            colorList.push('#00F6FF')
          } else {
            colorList.push('#b35141')
            data[index] = Math.abs(item)
          }
          if (Math.max(...data) < 100) {
            _datamax.push(100)
          } else {
            _datamax.push(Math.max(...data) + Math.max(...data) / 3)
          }
        })
      }

      if (val === 'time') {
        var firstChild = echarts.init(this.$refs.operationExample1)
        var data = this.durationtotalList.concat()
        var colorList = []
        var _datamax = []
        data.map((item, index) => {
          // 判断数据正负 显示颜色
          if (item >= 0) {
            colorList.push('#00F6FF')
          } else {
            colorList.push('#b35141')
            data[index] = Math.abs(item)
          }
          if (Math.max(...data) < 100) {
            _datamax.push(100)
          } else {
            _datamax.push(Math.max(...data) + Math.max(...data) / 3)
          }
        })
      }

      if (val === 'Duration') {
        var firstChild = echarts.init(this.$refs.operationExample2)
        var data = this.averageincreaseList.concat()
        var colorList = []
        var _datamax = []
        console.log(data)
        data.map((item, index) => {
          // 判断数据正负 显示颜色
          if (item >= 0) {
            colorList.push('#00F6FF')
          } else {
            data[index] = Math.abs(item)
            colorList.push('#b35141')
          }
          if (Math.max(...data) < 99) {
            _datamax.push(100)
          } else {
            _datamax.push(Math.max(...data) + Math.max(...data) / 3)
          }
        })
        console.log(colorList)
      }

      var spNum = 5,
        _max = Math.max(...data) + Math.max(...data) / 50
      var fomatter_fn = function(v) {
        if (v.color === '#00F6FF') {
          return v.value
        } else {
          return '-' + v.value
        }
      }
      var _label = {
        normal: {
          show: true,
          position: 'right',
          formatter: fomatter_fn,
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        }
      }
      var option = {
        backgroundColor: '#0C193B',
        grid: {
          // 绘图区调整
          x: val === 'node' ? 180 : 10, // 左留白
          y: 10, // 上留白
          x2: 10, // 右留白
          y2: 10 // 下留白
        },
        tooltip: {
          show: true,
          backgroundColor: '#fff',
          borderColor: '#ddd',
          borderWidth: 1,
          textStyle: {
            color: '#3c3c3c',
            fontSize: 16
          },
          formatter: function(p) {
            var _arr = p.seriesName.split('/'),
              idx = p.seriesIndex // 1，2，3
            var num = colorList.length
            var colorNum = colorList[p.dataIndex % num]
            return (
              '名称：' +
              p.name +
              '<br>' +
              (val === 'node'
                ? '数量：'
                : val === 'time'
                  ? '时长：'
                  : '环比增效：') +
              (colorNum === '#00F6FF' ? '' : '-') +
              p.value +
              (val === 'node' ? '/个' : val === 'time' ? '/小时' : '%')
            )
          },
          extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)'
        },
        xAxis: {
          splitNumber: spNum,
          interval: _max / spNum,
          // max: _max,
          axisLabel: {
            show: false,
            formatter: function(v) {
              var _v = ((v / _max) * 100).toFixed(0)
              return _v == 0 ? _v : _v + '%'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: [
          {
            data: this.processnamecnList,
            triggerEvent: true,
            show: val === 'node',
            inverse: true,
            axisLabel: {
              formatter: function(name) {
                return name.length > 8 ? name.slice(0, 8) + '...' : name
              },
              color: '#5F6F89',
              fontSize: 14,
              interval: 0,
              margin: 40,
              textStyle: {
                align: 'right',
                baseline: 'middle'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          {
            show: false,
            data: this.processnamecnList,
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'bar',
            silent: true,
            yAxisIndex: 1,
            barWidth: 20,
            min: 100,
            itemStyle: {
              normal: {
                color: '#0A4662'
              },
              emphasis: {
                color: '#0A4662'
              }
            },
            data: _datamax
          },
          {
            type: 'bar',
            name: '10月前',
            stack: '2',
            label: _label,
            legendHoverLink: false,
            barWidth: 20,
            itemStyle: {
              normal: {
                // color: '#00F6FF'
                color: function(params) {
                  var num = colorList.length
                  return colorList[params.dataIndex % num]
                }
              }
            },
            data: data
          }
        ]
      }
      firstChild.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
#bpmTaskProcess {
  color: #fff;
  /deep/ .el-input__inner {
    background-color: transparent;
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
    padding: 10px;
  }
    .datePicker {
    text-align: right;
    margin-bottom: 20px;
    span {
      margin-left: 20px;
    }
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .processBar {
    height: 400px;
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
    background: url("../../../assets/img/qietu/bg_m.png") no-repeat;
    background-size: 100% 100%;
    height: 600px;
  }
  .processBarKong {
    height: 400px;
    margin-bottom: 24px;
  }
  .positionBar {
    height: 400px;
  }
  .details {
    padding-right: 40px;
    text-align: right;
    a {
      color: #fff;
    }
  }
  .process {
    display: flex;
    justify-content: space-between;
  }

  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    margin-bottom: 24px;
    .bpmTaskProcess-bottom {
      padding: 24px 24px 0px 24px;
      .bpmTaskProcess-bottom-information-title {
        padding: 10px;
        background: #09265e;
        text-align: center;
        font-size: 14px;
      }
      .bpmTaskProcess-bottom-information-kong {
        text-align: center;
        font-size: 24px;
        line-height: 340px;
      }
      .el-col {
        .bpmTaskProcess-bottom-information {
          background: #0c193b;
          .el-col {
            .el-row {
              .bpmTaskProcess-bottom-information-title {
                padding: 10px;
                background: #09265e;
                text-align: center;
                font-size: 14px;
                .bpmTaskProcess-bottom-information-title-top {
                  margin-left: 40%;
                  float: left;
                  line-height: 28px;
                }
                .bpmTaskProcess-bottom-information-title-box {
                  width: 18px;
                  float: left;
                  font-size: 12px;
                  margin-left: 4px;
                }
                .bpmTaskProcess-bottom-information-title-bottom {
                  float: left;
                  height: 50%;
                }
              }
              .bpmTaskProcess-bottom-information-word {
                div {
                  padding-top: 22px;
                  text-align: center;
                }
              }
            }
          }
        }
      }
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
