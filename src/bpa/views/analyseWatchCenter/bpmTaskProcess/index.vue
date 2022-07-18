<template>
  <div id="bpmTaskDepartment" :style="{height:(screenHeight)+'px'}" class="w100 bpaAnalysis">
    <div :gutter="20" class="bpmTaskDepartment-top">
        {{$t("businessDomain")}}
        <el-cascader :props="props" :placeholder="pleaseSelect"
          :title="pleaseSelect" style="width: 130px" clearable collapse-tags />
        <span style="margin:0 5px 0 15px">{{$t("choiceDimension")}}</span>
        <el-select clearable :placeholder="pleaseSelect" :title="pleaseSelect" style="width:80px" value="selectValue" @change="submitFormStartChoice">
          <el-option label="公司" value="1" />
          <el-option label="部门" value="2" />
        </el-select>
        <el-input
          :placeholder="pleaseSelect"
          :title="pleaseSelect"
          prefix-icon="el-icon-thumb"
          style="width:150px"
          clearable
          @clear="clearCompanyStart()"
        />
        <span style="margin-left: 15px;">{{$t("nodeType")}}</span>
        <el-select clearable v-model="approvalValue" style="width: 90px;" :placeholder="pleaseSelect" :title="pleaseSelect" @change="approvalSubmit">
          <el-option
            v-for="item in approvalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="float-r">
        <el-date-picker
          v-model="yearValue"
          type="year"
          format="yyyy"
          value-format="yyyy"
          :placeholder="selectYear"
          :title="selectYear"
          style="width: 100px"
          class="inline-block"
        />
        <select-month style="width: 90px" class="w90px inline-block" @getSeason="getMonthTime" />
        <el-button type="primary" style="margin-left:10px;">{{$t("query")}}</el-button>
        </div>
    </div>
    <el-row :gutter="20">
      <analysis-header :header-list="headerList" />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4>{{$t("taskEfficiencyAnalysisTable2")}}</h4>
          </div>
          <div class="operationEcharts">
            <el-row :gutter="20" class="bpmTaskDepartment-bottom">
              <div style="textAlign:right">
                <router-link :to="{path: '/analyseWatchCenter/bpmTaskProcessDetails'}">
                  <el-button type="primary">{{$t("statementAnalysis")}}</el-button>
                </router-link>
              </div>
              <el-col :span="24" style="margin-top:20px;">
                <el-row
                  v-if="processStart"
                  class="bpmTaskDepartment-bottom-information"
                  style="margin-bottom:24px"
                >
                  <el-col :span="10">
                    <el-row>
                      <el-col
                        :span="8"
                        class="bpmTaskDepartment-bottom-information-title"
                        style="padding:14px"
                      >{{$t("companyName")}}</el-col>
                      <el-col :span="16" class="bpmTaskDepartment-bottom-information-title">
                        <div class="bpmTaskDepartment-bottom-information-title-top">{{$t("numberOfTasksProcessed")}}</div>
                        <div class="bpmTaskDepartment-bottom-information-title-box">
                          <div
                            class="bpmTaskDepartment-bottom-information-title-bottom"
                            @click="nodeSort('up','node')"
                          >
                            <i class="el-icon-caret-top" />
                          </div>
                          <div
                            class="bpmTaskDepartment-bottom-information-title-bottom"
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
                      <el-col :span="24" class="bpmTaskDepartment-bottom-information-title">
                        <div class="bpmTaskDepartment-bottom-information-title-top">{{$t("cumulativeTotalTime")}}</div>
                        <div class="bpmTaskDepartment-bottom-information-title-box">
                          <div
                            class="bpmTaskDepartment-bottom-information-title-bottom"
                            @click="nodeSort('up','time')"
                          >
                            <i class="el-icon-caret-top" />
                          </div>
                          <div
                            class="bpmTaskDepartment-bottom-information-title-bottom"
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
                      <el-col :span="24" class="bpmTaskDepartment-bottom-information-title">
                        <div
                          class="bpmTaskDepartment-bottom-information-title-top"
                          style="margin-left:24%"
                        >{{$t("monthOnMonthIncrease")}}</div>
                        <div class="bpmTaskDepartment-bottom-information-title-box">
                          <div
                            class="bpmTaskDepartment-bottom-information-title-bottom"
                            @click="nodeSort('up','Duration')"
                          >
                            <i class="el-icon-caret-top" />
                          </div>
                          <div
                            class="bpmTaskDepartment-bottom-information-title-bottom"
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
                  class="bpmTaskDepartment-bottom-information processBarKong"
                >
                  <el-col :span="3" class="bpmTaskDepartment-bottom-information-title">{{$t("departmentName")}}</el-col>
                  <el-col :span="7" class="bpmTaskDepartment-bottom-information-title">{{$t("numberOfTasksProcessed")}}</el-col>
                  <el-col :span="7" class="bpmTaskDepartment-bottom-information-title">{{$t("cumulativeTotalTime")}}</el-col>
                  <el-col :span="7" class="bpmTaskDepartment-bottom-information-title">{{$t("monthOnMonthIncrease")}}</el-col>
                  <el-col :span="24" class="bpmTaskDepartment-bottom-information-kong">
                    <i class="el-icon-warning-outline" />
                    {{$t("noData")}}
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
import $ from 'jquery'
import 'echarts-liquidfill'
// 默认时间
import { getFormateDate } from '@/bpa/utils/common.js'
// 公共头部
import selectMonth from '../../../components/SelectMonth.vue'
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
      selectValue: '',
      options: [{
        value: '一级',
        label: '1.0愿景与战略'
      }, {
        value: '二级',
        label: '2.0市场营销'
      }, {
        value: '三级',
        label: '3.0产品研发'
      }, {
        value: '一级',
        label: '一级菜单'
      }, {
        value: '四级',
        label: '4.0订单到交付'
      }, {
        value: '五级',
        label: '5.0采购与管理'
      }, {
        value: '六级',
        label: '6.0生产管理'
      }, {
        value: '七级',
        label: '7.0质量管理'
      }, {
        value: '八级',
        label: '8.0产品服务'
      }, {
        value: '九级',
        label: '9.0财务管理'
      }, {
        value: '十级',
        label: '10.0人力资源管理'
      }, {
        value: '十一级',
        label: '11.0投资管理'
      }, {
        value: '十二级',
        label: '12.0企业风险与合规管理'
      }, {
        value: '十三级',
        label: '13.0信息技术'
      }, {
        value: '十四级',
        label: '14.0行政法务管理'
      }, {
        value: '十五级',
        label: '15.0测试'
      } ],
      transferList: [],
      deptShow: false,
      // onlyOne: false, // 选人组件只能选择一个值的标识
      screenHeight: document.documentElement.clientHeight,
      props: { multiple: true },
      processStart: true,
      labelPosition: '',
      processList: [],
      deptnameList: [
        '默认部门',
        '默认部门',
        '默认部门',
        '默认部门',
        '默认部门',
        '默认部门',
        '默认部门',
        '默认部门'
      ],
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
      headerList: [
        {
          num: '19',
          name: this.$t("coverCompany"),
          ico: 'el-icon-copy-document',
          color: '#06abb9',
          title: 'FBC' + this.$t("numberOfCompaniesParticipatingInTheRunningProcess")
        },
        {
          num: '44',
          name: this.$t("coveringSector"),
          ico: 'el-icon-s-promotion',
          color: '#b35141',
          title: 'FBC' + this.$t("numberOfDepartmentParticipatingInTheRunningProcess")
        },
        {
          num: '149',
          name: this.$t("cumulativeNumberOfTasksProcessed"),
          ico: 'el-icon-s-data',
          color: '#019874',
          title: 'FBC' + this.$t("numberOfTimesProcessIsProcessed")
        },
        {
          num: '7',
          name: this.$t("averageProcessingTime"),
          ico: 'el-icon-alarm-clock',
          color: '#b37e11',
          title: 'FBC' + this.$t("averageProcessingTimeOfSingleNodeOfTheProcess")
        }
      ],
      pleaseSelect:this.$t("placeholderText.pleaseSelect"),
      selectYear:this.$t("placeholderText.selectYear"),
      beforeOctober:this.$t("beforeOctober"),
    }
  },
  watch: {
    screenHeight: function(val) {
      // 监听屏幕高度变化
      var oIframe = document.getElementById('bpmTaskDepartment')
      // alert(this.$store.getters.screenHeight)
      if (Number(val) < 700) {
        oIframe.style.height = Number(val) + 80 + 'px'
      } else {
        oIframe.style.height = Number(val) + 'px'
      }
    }
  },
  mounted() {
    var _this = this
    window.onresize = function() {
      // 定义窗口大小变更通知事件
      _this.screenHeight = document.documentElement.clientHeight // 窗口高度
    }
    this.setOperationExample()
  },
  methods: {
    // 挂载获取 筛选条件方法
    ...screenStart.mapActions(['getCurrentDepartment']),
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
      this.Department.approvalValue = this.approvalValue
    },
    // 选择业务域确定
    submitForm1(ele) {
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
      this.Department.companyId = ''
      this.Department.deptid = ''
      this.getCurrentDepartment(this.Department)
    },
    clearCompanyStart() {
      if (this.Department.startChoice === '1') {
        this.Department.companyId = ''
      } else {
        this.Department.deptid = ''
      }
      this.getCurrentDepartment(this.Department)
    },
    // 运行实例
    setOperationExample(val) {
      val = 'node'
      // 渲染条件判断
      // if (val === 'node') {
      var firstChild = echarts.init(this.$refs.operationExample)
      var firstChild1 = echarts.init(this.$refs.operationExample1)
      var firstChild2 = echarts.init(this.$refs.operationExample2)
      //   firstChild.on('mouseover', function(params) { // 鼠标经过图表时候判断参数  ---请开始你的表演
      //     if (params.componentType === 'yAxis') {
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
      //   var data = this.taskcountList.concat()
      // var colorList = []
      //   var _datamax = []
      //   data.map((item, index) => {
      //     // 判断数据正负 显示颜色
      //     if (item >= 0) {
      //       colorList.push('#00F6FF')
      //     } else {
      //       colorList.push('#b35141')
      //       data[index] = Math.abs(item)
      //     }
      //     if (Math.max(...data) < 100) {
      //       _datamax.push(100)
      //     } else {
      //       _datamax.push(Math.max(...data) + (Math.max(...data) / 3))
      //     }
      //   })
      // }

      // if (val === 'time') {
      //   var firstChild = echarts.init(this.$refs.operationExample1)
      //   var data = this.durationtotalList.concat()
      //   var colorList = []
      //   var _datamax = []
      //   data.map((item, index) => {
      //     // 判断数据正负 显示颜色
      //     if (item >= 0) {
      //       colorList.push('#00F6FF')
      //     } else {
      //       colorList.push('#b35141')
      //       data[index] = Math.abs(item)
      //     }
      //     if (Math.max(...data) < 100) {
      //       _datamax.push(100)
      //     } else {
      //       _datamax.push(Math.max(...data) + (Math.max(...data) / 3))
      //     }
      //   })
      // }

      // if (val === 'Duration') {
      //   var firstChild = echarts.init(this.$refs.operationExample2)
      // var data = this.averageincreaseList.concat()
      //   var colorList = []
      //   var _datamax = []
      //   data.map((item, index) => {
      //     // 判断数据正负 显示颜色
      //     if (item >= 0) {
      //       colorList.push('#00F6FF')
      //     } else {
      //       colorList.push('#b35141')
      //       data[index] = Math.abs(item)
      //     }
      //     if (Math.max(...data) < 99) {
      //       _datamax.push(100)
      //     } else {
      //       _datamax.push(Math.max(...data) + (Math.max(...data) / 3))
      //     }
      //   })
      // }
      var spNum = 5
      // var _max = Math.max(...data) + (Math.max(...data) / 50)
      var _max = 10
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
          extraCssText: 'box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)'
        },
        xAxis: {
          splitNumber: spNum,
          interval: _max / spNum,
          max: _max,
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
            data: this.deptnameList,
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
            data: this.deptnameList,
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
            itemStyle: {
              normal: {
                color: '#0A4662'
              },
              emphasis: {
                color: '#0A4662'
              }
            },
            data: [67, 37, 16, 5, 5, 1, 1]
          },
          {
            type: 'bar',
            name: this.beforeOctober,
            stack: '2',
            label: _label,
            legendHoverLink: false,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#00F6FF'
              }
            },
            data: [67, 37, 16, 5, 5, 1, 1]
          }
        ]
      }
      firstChild.setOption(option)
      option.grid.x = 10
      option.yAxis[0].show = false
      firstChild1.setOption(option)
      firstChild2.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
.w90px {
  /deep/ .el-input {
    width: 90px;
  }
}
.inline-block {
  display: inline-block;
  vertical-align: top;
}
#bpmTaskDepartment {
  color: #fff;
  /deep/ .el-input__inner {
    background-color: transparent;
  }
  .operationEcharts {
    width: 100%;
    // height: 540px;
  }
  .bpmTaskDepartment-top {
    margin-bottom: 20px;
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
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .processBar {
    height: 400px;
  }
  .processBarKong {
    height: 400px;
    margin-bottom: 24px;
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
    background: url("../../../assets/img/qietu/bg_m.png") no-repeat;
    //  background-size:cover;
    background-size: 100% 100%;
    height: 600px;
  }
  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    margin-bottom: 24px;
    .bpmTaskDepartment-bottom {
      padding: 24px 24px 0px 24px;
      .el-col {
        .bpmTaskDepartment-bottom-information {
          background: #0c193b;
          .bpmTaskDepartment-bottom-information-title {
            padding: 10px;
            background: #09265e;
            text-align: center;
            font-size: 14px;
          }
          .bpmTaskDepartment-bottom-information-kong {
            text-align: center;
            font-size: 24px;
            line-height: 340px;
          }
          .el-col {
            .el-row {
              .bpmTaskDepartment-bottom-information-title {
                padding: 10px;
                background: #09265e;
                text-align: center;
                font-size: 14px;
                .bpmTaskDepartment-bottom-information-title-top {
                  margin-left: 40%;
                  float: left;
                  line-height: 28px;
                }
                .bpmTaskDepartment-bottom-information-title-box {
                  width: 18px;
                  float: left;
                  font-size: 12px;
                  margin-left: 4px;
                }
                .bpmTaskDepartment-bottom-information-title-bottom {
                  float: left;
                  height: 50%;
                }
              }
              .bpmTaskDepartment-bottom-information-word {
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
}
</style>
