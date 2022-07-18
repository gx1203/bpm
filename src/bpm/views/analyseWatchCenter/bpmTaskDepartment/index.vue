<template>
  <div id="bpmTaskDepartment" :style="{height:(screenHeight)+'px'}" class="w100 bpaAnalysis">
    <el-row :gutter="20" class="bpmTaskDepartment-top">
      <el-col :span="14">
        业务域
        <el-cascader
          v-model="Department.processValue"
          :options="options"
          :props="props"
          clearable
          @change="submitForm1"/>
        <span style="margin:0 5px">选择维度</span>
        <el-select clearable v-model="Department.startChoice" :placeholder="$t('placeholderText.pleaseSelect')" style="width:148px" @change="submitFormStartChoice">
          <el-option
            label="公司"
            value="1"/>
          <el-option
            :label="$t('department')"
            value="2"/>
        </el-select>
        <el-input clearable
          v-model="Department.companyName"
          :title="Department.companyName"
          :placeholder="$t('placeholderText.pleaseSelect')"
          prefix-icon="el-icon-thumb"
          style="width:148px"
          clearable
          @focus="getDepartment(Department.startChoice)"
          @clear="clearCompanyStart()"/>
        <span>节点类型</span>
        <el-select clearable v-model="approvalValue" :placeholder="$t('placeholderText.pleaseSelect')" @change="approvalSubmit">
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
          v-model="yearValue"
          type="year"
          format="yyyy"
          value-format="yyyy"
          :placeholder="$t('placeholderText.selectYear')"
          @change="submitForm"
        />
      </el-col>
      <el-col :span="4">
        <select-month @getSeason="getMonthTime" />
      </el-col>
      <el-col :span="3">
        <el-button type="primary" style="margin-left:10px;" @click="submitForms">{{ $t('query') }}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <analysis-header :header-list="headerList"/>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4>任务效率分析表（按部门）</h4>
          </div>
          <div class="operationEcharts">
            <el-row :gutter="20" class="bpmTaskDepartment-bottom">
              <div style="textAlign:right">
                <router-link :to="{path: '/analyseWatchCenter/bpmTaskDepartmentDetails'}">
                  <el-button type="primary">报表分析</el-button>
                </router-link>
              </div>
              <el-col :span="24" style="margin-top:20px;">
                <el-row v-if="processStart" class="bpmTaskDepartment-bottom-information" style="margin-bottom:24px">
                  <el-col :span="10">
                    <el-row>
                      <el-col :span="8" class="bpmTaskDepartment-bottom-information-title" style="padding:14px">
                        {{ Department.startChoice === '1'?'公司名称' :'部门名称' }}
                      </el-col>
                      <el-col :span="16" class="bpmTaskDepartment-bottom-information-title">
                        <div class="bpmTaskDepartment-bottom-information-title-top">处理任务数量</div>
                        <div class="bpmTaskDepartment-bottom-information-title-box">
                          <div class="bpmTaskDepartment-bottom-information-title-bottom" @click="nodeSort('up','node')"><i class="el-icon-caret-top"/></div>
                          <div class="bpmTaskDepartment-bottom-information-title-bottom" @click="nodeSort('down','node')"><i class="el-icon-caret-bottom"/></div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div ref="operationExample" class="w100 h100 processBar"/>
                        <div id="tip" class="tipname hide"/>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="7">
                    <el-row>
                      <el-col :span="24" class="bpmTaskDepartment-bottom-information-title">
                        <div class="bpmTaskDepartment-bottom-information-title-top">累计总时长</div>
                        <div class="bpmTaskDepartment-bottom-information-title-box">
                          <div class="bpmTaskDepartment-bottom-information-title-bottom" @click="nodeSort('up','time')"><i class="el-icon-caret-top"/></div>
                          <div class="bpmTaskDepartment-bottom-information-title-bottom" @click="nodeSort('down','time')"><i class="el-icon-caret-bottom"/></div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div ref="operationExample1" class="w100 h100 processBar"/>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="7">
                    <el-row>
                      <el-col :span="24" class="bpmTaskDepartment-bottom-information-title">
                        <div class="bpmTaskDepartment-bottom-information-title-top" style="margin-left:24%">环比增效（百分比）</div>
                        <div class="bpmTaskDepartment-bottom-information-title-box">
                          <div class="bpmTaskDepartment-bottom-information-title-bottom" @click="nodeSort('up','Duration')"><i class="el-icon-caret-top"/></div>
                          <div class="bpmTaskDepartment-bottom-information-title-bottom" @click="nodeSort('down','Duration')"><i class="el-icon-caret-bottom"/></div>
                        </div>
                      </el-col>
                      <el-col :span="24">
                        <div ref="operationExample2" class="w100 h100 processBar"/>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>

                <el-row v-if="!processStart" class="bpmTaskDepartment-bottom-information processBarKong">
                  <el-col :span="3" class="bpmTaskDepartment-bottom-information-title">部门名称</el-col>
                  <el-col :span="7" class="bpmTaskDepartment-bottom-information-title">处理任务数量</el-col>
                  <el-col :span="7" class="bpmTaskDepartment-bottom-information-title">累计总时长</el-col>
                  <el-col :span="7" class="bpmTaskDepartment-bottom-information-title">环比增效（百分比）</el-col>
                  <el-col :span="24" class="bpmTaskDepartment-bottom-information-kong">
                    <i class="el-icon-warning-outline"/>
                     {{ $t('noData') }}
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <newOrganization v-model="dialogVisible" :start-choice="Department.startChoice" :only-one="onlyOne" @changeOnlyOne="changeOnlyOne" @getTransferList="getTransferList" @getTransferNameList="getTransferNameList"/>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import $ from 'jquery'
import 'echarts-liquidfill'
// 获取公司部门
import newOrganization from '../components/newOrganization/index.vue'
// 接口请求部分
import { getTaskEfficiencyDept, getModel, queryTaskEfficiencyDeptTable, getAllDepartment } from '@/bpm/api/analyseWatchCenter'
// 默认时间
import { getTreeData, getFormateDate } from '@/bpm/utils/common.js'
// 公共头部
import selectMonth from '../components/SelectMonth.vue'
import AnalysisHeader from '../components/AnalysisHeader'
// 应用vuex筛选条件
import { createNamespacedHelpers } from 'vuex'
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
      approvalOptions: [{
        value: '1',
        label: '审批类'
      }, {
        value: '2',
        label: '处理类'
      }],
      yearValue: getFormateDate(new Date(), 'yyyy'),
      monthValue: '',
      options: [],
      transferList: [],
      deptShow: false,
      dialogVisible: false,
      onlyOne: false, // 选人组件只能选择一个值的标识
      screenHeight: document.documentElement.clientHeight,
      props: { checkStrictly: true, label: 'modelname', value: 'id' },
      processStart: true,
      labelPosition: '',
      processList: [],
      deptnameList: [],
      taskcountList: [],
      durationtotalList: [],
      averageincreaseList: [],
      pagesData: {
        pageNum: 1,
        pageSize: 1000
        // orderby: 'sort',
        // sort: 'asc' // orderby有值时生效
      },
      value: '',
      headerList: [{
        num: '0',
        name: '覆盖公司',
        ico: 'el-icon-copy-document',
        color: '#06abb9',
        title: 'FBC中运行的流程参与的公司数'
      }, {
        num: '0',
        name: '覆盖部门',
        ico: 'el-icon-s-promotion',
        color: '#b35141',
        title: 'FBC中运行的流程参与的部门数'
      }, {
        num: '0',
        name: '累计处理任务数量',
        ico: 'el-icon-s-data',
        color: '#019874',
        title: 'FBC中流程的处理次数'
      }, {
        num: '0',
        name: '平均处理时长',
        ico: 'el-icon-alarm-clock',
        color: '#b37e11',
        title: 'FBC中流程单个节点的平均处理时长'
      }]
    }
  },
  computed: {
    // 获取任务效率分析按部门筛选条件
    ...screenStart.mapState(['Department'])
  },
  watch: {
    'screenHeight': function(val) { // 监听屏幕高度变化
      var oIframe = document.getElementById('bpmTaskDepartment')
      // alert(this.$store.getters.screenHeight)
      if (Number(val) < 700) {
        oIframe.style.height = (Number(val) + 80) + 'px'
      } else {
        oIframe.style.height = (Number(val)) + 'px'
      }
    }
  },
  mounted() {
    this.getTaskEfficiencyDept() // 获取任务效率分析基本数据(按部门)
    this.getModelTree() // 获取业务域
    this.queryTaskEfficiencyDeptTable() // 获取图表数据
    var _this = this
    window.onresize = function() { // 定义窗口大小变更通知事件
      _this.screenHeight = document.documentElement.clientHeight // 窗口高度
    }
  },
  methods: {
    // 挂载获取 筛选条件方法
    ...screenStart.mapActions(['getCurrentDepartment']),
    getMonthTime(data) {
      this.monthValue = data
      let yearData
      const date = new Date()
      if (this.monthValue == 12) {
        yearData = getFormateDate(new Date((date.getFullYear() - 1).toString()), 'yyyy')
        this.yearValue = yearData
      }
      this.Department.yearValue = this.yearValue
    },
    // 选择节点类型确定
    approvalSubmit() {
      this.Department.approvalValue = this.approvalValue
    },
    // 选择时间组件回调事件
    submitForm(ele) {
      this.Department.yearValue = this.yearValue
      this.getCurrentDepartment(this.Department)
    },
    openOrgSelect() {
      this.dialogVisible = true
      this.onlyOne = true
    },
    changeOnlyOne(val) {
      this.onlyOne = val
    },
    // 选择多个岗位
    getTransferList(transferList) {
      this.Department.deptid = transferList
      this.getCurrentDepartment(this.Department)
    },
    // 获取选择的公司部门名称
    getTransferNameList(name) {
      this.Department.companyName = name
      this.getCurrentDepartment(this.Department)
    },
    // 选择业务域确定
    submitForm1(ele) {
      console.log(this.Department.processValue, 111111)
      if (ele.length === 0 || ele.length === null) {
        this.Department.modelid = ''
        this.getCurrentDepartment(this.Department)
      } else {
        this.Department.modelid = ele[ele.length - 1]
        this.getCurrentDepartment(this.Department)
      }
    },
    // 筛选维度改变
    submitFormStartChoice() {
      this.Department.companyName = ''
      this.Department.companyId = ''
      this.Department.deptid = ''
      this.getCurrentDepartment(this.Department)
    },
    submitForms() {
      this.getTaskEfficiencyDept()
      this.queryTaskEfficiencyDeptTable()
    },
    // 通过公司查部门
    getDepartment(ele) {
      this.Department.startChoice = ele
      // if (ele === '1') {
      //   this.Department.startChoice = '1'
      // } else {
      //   this.Department.startChoice = '2'
      // }
      this.getCurrentDepartment(this.Department)
      this.dialogVisible = true
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
    // 节点排序
    nodeSort(ele, val) {
      const compare = function(obj1, obj2) {
        const val1 = parseFloat(val === 'node' ? obj1.taskcount : val === 'time' ? obj1.durationtotal : obj1.averageincrease)
        const val2 = parseFloat(val === 'node' ? obj2.taskcount : val === 'time' ? obj2.durationtotal : obj2.averageincrease)
        console.log(val1, val2, 22222)
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
      const deptnameList = [] // 部门名称
      const taskcountList = [] // 节点数量
      const durationtotalList = [] // 累计总时长
      const averageincreaseList = [] // 平均时长环比增效（百分比)
      this.processList.map(item => {
        if (item.deptname == undefined) {
          deptnameList.push('默认部门')
        } else {
          if (this.Department.startChoice === '1') {
            deptnameList.push(item.compname)
          } else {
            deptnameList.push(item.deptname)
          }
        }
        taskcountList.push(item.taskcount)
        durationtotalList.push(item.durationtotal)
        averageincreaseList.push(item.averageincrease)
      })
      this.deptnameList = deptnameList
      console.log(this.deptnameList, 11111111111)
      this.taskcountList = taskcountList
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
    getTaskEfficiencyDept() {
      const obj = {
        date: this.yearValue + '-' + this.monthValue,
        modelid: this.Department.modelid,
        nodetype: this.approvalValue,
        orgtype: this.Department.startChoice,
        orgid: this.Department.deptid
      }
      console.log(obj, 123456)
      getTaskEfficiencyDept(obj).then((res) => {
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
          if (item.name === '平均处理时长') {
            this.$set(item, 'num', parseInt(res.averageduration))
          }
        })
      })
    },
    // 获取部门框架
    getModelTree() {
      getModel({}).then((res) => {
        this.options = getTreeData(res)
      })
    },
    // 查询任务效率分析图表数据(按部门)
    queryTaskEfficiencyDeptTable() {
      this.getCurrentDepartment(this.Department)
      const obj = {
        'attr': {
          'modelid': this.Department.modelid,
          'date': this.yearValue + '-' + this.monthValue,
          nodetype: this.approvalValue,
          orgtype: this.Department.startChoice,
          orgid: this.Department.deptid
        },
        'filters': [
        ],
        'fullFilters': [
        ],
        'logic': '',
        'orderby': '',
        'pageNum': 1,
        'pageSize': 10,
        'sort': ''
      }
      queryTaskEfficiencyDeptTable(obj).then(res => {
        this.processList = res.list
        if (res.list.length !== 0) {
          this.processStart = true
          // 遍历数据  获取不同图标需要的数据
          const deptnameList = [] // 部门名称
          const taskcountList = [] // 处理任务数量
          const durationtotalList = [] // 累计总时长
          const averageincreaseList = [] // 环比增效（百分比)
          this.processList.map(item => {
            if (item.deptname == undefined) {
              deptnameList.push('暂无数据')
            } else {
              deptnameList.push(item.deptname)
            }
            taskcountList.push(item.taskcount)
            durationtotalList.push(item.durationtotal)
            averageincreaseList.push(item.averageincrease)
          })
          this.deptnameList = deptnameList
          this.taskcountList = taskcountList
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
        firstChild.on('mouseover', function(params) { // 鼠标经过图表时候判断参数  ---请开始你的表演
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
        var data = this.taskcountList.concat()
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
            _datamax.push(Math.max(...data) + (Math.max(...data) / 3))
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
            _datamax.push(Math.max(...data) + (Math.max(...data) / 3))
          }
        })
      }

      if (val === 'Duration') {
        var firstChild = echarts.init(this.$refs.operationExample2)
        var data = this.averageincreaseList.concat()
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
          if (Math.max(...data) < 99) {
            _datamax.push(100)
          } else {
            _datamax.push(Math.max(...data) + (Math.max(...data) / 3))
          }
        })
      }
      var spNum = 5, _max = Math.max(...data) + (Math.max(...data) / 50)
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
        grid: { // 绘图区调整
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
              idx = p.seriesIndex// 1，2，3
            var num = colorList.length
            var colorNum = colorList[p.dataIndex % num]
            return '名称：' + p.name + '<br>' + (val === 'node' ? '数量：' : val === 'time' ? '时长：' : '环比增效：') + (colorNum === '#00F6FF' ? '' : '-') + p.value + (val === 'node' ? '/个' : val === 'time' ? '/小时' : '%')
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
              var _v = (v / _max * 100).toFixed(0)
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
        yAxis: [{
          data: this.deptnameList,
          triggerEvent: true,
          show: val === 'node',
          inverse: true,
          axisLabel: {
            formatter: function(name) {
              return (name.length > 8 ? (name.slice(0, 8) + '...') : name)
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
        }, {
          show: false,
          data: this.deptnameList,
          axisLine: {
            show: false
          }
        }],
        series: [{
          type: 'bar',
          silent: true,
          yAxisIndex: 1,
          barWidth: 20,
          itemStyle: {
            normal: {
              color: '#0A4662'
            },
            emphasis: {
              color: '#0A4662'
            }
          },
          data: _datamax
        }, {
          type: 'bar',
          name: '10月前',
          stack: '2',
          label: _label,
          legendHoverLink: false,
          barWidth: 20,
          itemStyle: {
            normal: {
              color: function(params) {
                var num = colorList.length
                return colorList[params.dataIndex % num]
              }
            }
          },
          data: data
        }]
      }
      firstChild.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
#bpmTaskDepartment {
     color: #fff;
  .operationEcharts{
    width:100%;
    // height: 540px;
  }
  .bpmTaskDepartment-top{
    margin-bottom: 20px;
  }
    .hide{ display: none; }
    .tipname {
        position: absolute;
        background: rgba(0,0,0,0.5);
        border-radius: 5px;
        max-width: 400px;
        padding: 5px;
        z-index: 1;
        color: #fff;
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
  .processBarKong{
      height: 400px;
      margin-bottom: 24px
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
    font-size:16px;
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
    height: 600px;
    }
   .operationEcharts{
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    margin-bottom: 24px;
    .bpmTaskDepartment-bottom{
      padding: 24px 24px 0px 24px;
      .el-col{
        .bpmTaskDepartment-bottom-information{
          background: #0C193B;
          .bpmTaskDepartment-bottom-information-title{
            padding: 10px;
            background: #09265E;
            text-align: center;
            font-size: 14px;
          }
          .bpmTaskDepartment-bottom-information-kong{
            text-align: center;
            font-size: 24px;
            line-height: 340px;
          }
          .el-col{
            .el-row{
              .bpmTaskDepartment-bottom-information-title{
                padding: 10px;
                background: #09265E;
                text-align: center;
                font-size: 14px;
                .bpmTaskDepartment-bottom-information-title-top{
                  margin-left: 40%;
                  float: left;
                  line-height: 28px;
                }
                .bpmTaskDepartment-bottom-information-title-box{
                  width: 18px;
                  float: left;
                  font-size: 12px;
                  margin-left: 4px;
                }
                .bpmTaskDepartment-bottom-information-title-bottom{
                  float: left;
                  height: 50%;
                }
              }
              .bpmTaskDepartment-bottom-information-word{
                div{
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
}
</style>
