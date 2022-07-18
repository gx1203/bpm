<template>
  <el-container id="dicenter" class="di__container">
    <el-main class="mainChart">
      <!-- <el-row :span="24">
        <el-col :span="6" class="di__router-container">
          <router-link
            :to="{path: '/diCenter/home'}"
            class="di__router"
            active-class="active-router"
          >
            <img :src="route.includes('/diCenter/home')?routerActiveImg : routerImg" class="w100" alt="图片" >
            <span class="absolute header-database">运营监控</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'databaselist'}" class="di__router">
            <img :src="routerImg" alt="图片" class="w100">
            <span class="absolute header-database1">指标库</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'home'}" class="di__router">
            <img :src="routerImg" alt="图片" class="w100" />
            <span class="absolute header-database">风控</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'doorCenter'}" class="di__router">
            <img :src="routerImg" alt="图片" class="w100">
            <span class="absolute header-database2">门户</span>
          </router-link>
        </el-col>
      </el-row> -->
      <el-row :span="24" class="targetChart">
        <el-col :span="12" class="button-base">
          <el-button :class="{'active': month ==='LastMonth'}" @click="lastMonth">上月</el-button>
          <el-button :class="{'active': month ==='ThisMonth'}" @click="newMonth">本月</el-button>
          <el-button :class="{'active': month ==='ThisSeason'}" @click="seasonFilter">本季度</el-button>
          <el-button :class="{'active': month ==='ThisYear'}" @click="yearFilter">本年</el-button>
        </el-col>
      </el-row>
      <el-row :span="24" class="dashboard">
        <el-col :span="6" class="h100">
          <ul class="w100 h100">
            <li class="w100 h33 cursor-pointer relative" @mouseover.stop="showvaries.child1 = true" @mouseout.stop="showvaries.child1 = false">
              <div class="w100 h100" ref="firstChart"></div>
              <ul class="showContent" v-show="showvaries.child1">
                <li class="fontplan1"><span>计划值1:</span>{{!!childrenChartId[0] ? childrenChartId[0].pvalue1:''}}</li>
                <li class="fontplan2"><span>计划值2:</span>{{!!childrenChartId[0] ? childrenChartId[0].pvalue2:''}}</li>
                <li class="fontthreshold"><span>阈值:</span>{{!!childrenChartId[0] ? childrenChartId[0].threshold:''}}</li>
              </ul>
            </li>
            <li class="w100 h33 cursor-pointer relative" @mouseover.stop="showvaries.child3 = true" @mouseout.stop="showvaries.child3 = false">
              <div class="w100 h100" ref="thirdChart"></div>
              <ul class="showContent" v-show="showvaries.child3">
                <li class="fontplan1"><span>计划值1:</span>{{!!childrenChartId[2] ? childrenChartId[2].pvalue1:''}}</li>
                <li class="fontplan2"><span>计划值2:</span>{{!!childrenChartId[2] ? childrenChartId[2].pvalue2:''}}</li>
                <li class="fontthreshold"><span>阈值:</span>{{!!childrenChartId[2] ? childrenChartId[2].threshold:''}}</li>
              </ul>
            </li>
            <li class="w100 h34 cursor-pointer relative" @mouseover.stop="showvaries.child5 = true" @mouseout.stop="showvaries.child5 = false">
              <div class="w100 h100" ref="fifthChart"></div>
              <ul class="showContent" v-show="showvaries.child5">
                <li class="fontplan1"><span>计划值1:</span>{{!!childrenChartId[4] ? childrenChartId[4].pvalue1:''}}</li>
                <li class="fontplan2"><span>计划值2:</span>{{!!childrenChartId[4] ? childrenChartId[4].pvalue2:''}}</li>
                <li class="fontthreshold"><span>阈值:</span>{{!!childrenChartId[4] ? childrenChartId[4].threshold:''}}</li>
              </ul>
            </li>
          </ul>
        </el-col>
        <el-col :span="12" class="h100 relative">
          <div ref="centerChart" class="h100" @mouseover.stop="showvaries.centerChild = true" @mouseout.stop="showvaries.centerChild = false"  />
          <ul class="showContent centerpos" v-show="showvaries.centerChild">
            <li class="fontplan1"><span>计划值1:</span>{{profitChartdata.pvalue1}}</li>
            <li class="fontplan2"><span>计划值2:</span>{{profitChartdata.pvalue2}}</li>
            <li class="fontthreshold"><span>阈值:</span>{{profitChartdata.threshold}}</li>
          </ul>
        </el-col>
        <el-col :span="6" class="h100">
          <ul class="h100">
            <li class="w100 h33 cursor-pointer relative" @mouseover.stop="showvaries.child2 = true" @mouseout.stop="showvaries.child2 = false">
              <div class="w100 h100" ref="secondChart"></div>
              <ul class="showContent" v-show="showvaries.child2">
                <li class="fontplan1"><span>计划值1:</span>{{!!childrenChartId[1] ? childrenChartId[1].pvalue1:''}}</li>
                <li class="fontplan2"><span>计划值2:</span>{{!!childrenChartId[1] ? childrenChartId[1].pvalue2:''}}</li>
                <li class="fontthreshold"><span>阈值:</span>{{!!childrenChartId[1] ? childrenChartId[1].threshold:''}}</li>
              </ul>
            </li>
            <li class="w100 h33 cursor-pointer relative" @mouseover.stop="showvaries.child4 = true" @mouseout.stop="showvaries.child4 = false">
              <div class="w100 h100" ref="fourthChart"></div>
              <ul class="showContent" v-show="showvaries.child4">
                <li class="fontplan1"><span>计划值1:</span>{{!!childrenChartId[3] ? childrenChartId[3].pvalue1:''}}</li>
                <li class="fontplan2"><span>计划值2:</span>{{!!childrenChartId[3] ? childrenChartId[3].pvalue2:''}}</li>
                <li class="fontthreshold"><span>阈值:</span>{{!!childrenChartId[3] ? childrenChartId[3].threshold:''}}</li>
              </ul>
            </li>
            <li class="w100 h34 cursor-pointer relative" @mouseover.stop="showvaries.child6 = true" @mouseout.stop="showvaries.child6 = false">
              <div class="w100 h100" ref="sixthChart"></div>
              <ul class="showContent" v-show="showvaries.child6">
                <li class="fontplan1"><span>计划值1:</span>{{!!childrenChartId[5] ? childrenChartId[5].pvalue1:''}}</li>
                <li class="fontplan2"><span>计划值2:</span>{{!!childrenChartId[5] ? childrenChartId[5].pvalue2:''}}</li>
                <li class="fontthreshold"><span>阈值:</span>{{!!childrenChartId[5] ? childrenChartId[5].threshold:''}}</li>
              </ul>
            </li>
          </ul>
        </el-col>
      </el-row>
    </el-main>
    <el-aside class="di_right di_echart-container" width="500px">
      <el-row class="h25">
        <el-col :span="11" :offset="1" class="di__echart-item h100">
          <el-row class="h100">
            <el-col class="h18 title vertical-middle">
              KPI指标数
            </el-col>
            <el-col class="h75 pos-relative">
              <div ref="Child5" class="h100" />
              <div class="showCount fontYellow">
                <p>KPI指标数</p>
                <p>{{KPI}}</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="11" :offset="1" class="di__echart-item h100">
          <el-col class="h18 title vertical-middle">风险控制点</el-col>
          <el-col class="h75 pos-relative">
            <div ref="Child2" class="h100" />
            <div class="showCount">
              <p>风险控制点</p>
              <p>123</p>
            </div>
          </el-col>
        </el-col>
      </el-row>
      <el-row class="h37">
        <el-col :span="23" :offset="1" class="di__echart-item h100">
          <el-col class="h18 title vertical-middle">
            <span class="order-item">{{$t()}}流程效率(天)</span>
            <span class="order-item1" @click="orderClick" v-if="orderPD">前5<i class="el-icon-sort-up"></i></span>
            <span class="order-item1" @click="orderClick" v-if="!orderPD">后5<i class="el-icon-sort-down"></i></span>
          </el-col>
          <el-col class="h75">
            <div ref="Child6" class="h100" />
          </el-col>
        </el-col>
      </el-row>
      <el-row class="h37">
        <el-col :span="23" :offset="1" class="di__echart-item h100">
          <el-col class="h18 title vertical-middle">
            <span class="order-item">{{$t()}}流程使用率(次)</span>
            <span class="order-item1" @click="orderClick1" v-if="orderPD1">前5<i class="el-icon-sort-up"></i></span>
            <span class="order-item1" @click="orderClick1" v-if="!orderPD1">后5<i class="el-icon-sort-down"></i></span>
          </el-col>
          <el-col class="h75">
            <div ref="Child7" class="h100" />
          </el-col>
        </el-col>
      </el-row>
    </el-aside>
  </el-container>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'

// 引入图片
import routerImg from '@/bpa/assets/img/qietu/router.png'
import routerActiveImg from '@/bpa/assets/img/qietu/router_active.png'
import liuchengxuexixiaoguo from '@/bpa/assets/img/qietu/liuchengxuexixiaoguo.png'
import {
  getKPI,
  getEFFiciency,
  dashboardChart,
  getUseRate,
  profitDashboard
} from '@/bpa/api/diCenter'
// import initCanvas from './initCanvas.js'
export default {
  name: 'BpaDi',
  data() {
    return {
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      liuchengxuexixiaoguo: liuchengxuexixiaoguo,
      KPI: '',
      pages: {
        pageNum: 1,
        pageSize: 10
      },
      month: 'ThisMonth',
      sort: '',
      processTrend: {},
      orderPD: true,
      orderPD1: true,
      childrenChartId: [],
      commonObj: {},
      setTime: null,
      commonChart: {
        type: 'gauge',
        min: 0,
        axisLabel: {
          textStyle: {
            fontWeight: 'bolder',
            color: '#fff',
            shadowBlur: 10
          },
          formatter: function (value) {
            return value / 10000
          }
        },
        itemStyle: {
          color: '#1e90ff'
        },
        pointer: {
          length: '60%'
        }
      },
      profitChart: {
        name: '税前利润',
        center: ['50%', '50%'],
        radius: '80%',
        max: 100,
        axisLine: {
          lineStyle: {
            color: [[0.25, '#ccc'], [0.5, '#ff4500'], [0.75, '#feff00'], [1, 'lime']],
            width: 5,
            shadowColor: '#fff',
            shadowBlur: 10
          }
        },
        axisTick: {
          length: 15,
          lineStyle: {
            color: 'auto',
            width: 3,
            shadowBlur: 10
          }
        },
        splitLine: {
          length: 25,
          lineStyle: {
            width: 3,
            color: '#FCD209'
          }
        },
        detail: {
          fontSize: '18',
          lineHeight: 24,
          offsetCenter: [0, '72%'],
          formatter: (data) => {
            return '5539.80\n税前利润'
          }
        },
        data: [{value: '100'}]
      },
      firstarchiture: {
        name: '税前利润',
        max: 100,
        center: ['50%', '50%'],
        radius: '90%',
        silent: true,
        axisLine: {
          lineStyle: {
            color: [[0.25, '#cccccc'], [0.5, '#ff4500'], [0.75, '#feff00'], [1, 'lime']],
            width: 2,
            shadowColor: '#fff',
            shadowBlur: 10
          }
        },
        axisTick: {
          length: 5,
          lineStyle: {
            color: 'auto',
            width: 1,
            shadowBlur: 10
          }
        },
        splitLine: {
          length: 7,
          lineStyle: {
            width: 2,
            color: '#FCD209'
          }
        },
        detail: {
          show: true,
          fontSize: '12',
          lineHeight: 14,
          color: '#fff',
          offsetCenter: [0, '60%']
        },
        data: [{value: '100'}]
      },
      // 税前利润
      profitChartdata: {},
      // 显示值
      showvaries: {
        child1: false,
        child2: false,
        child3: false,
        child4: false,
        child5: false,
        child6: false,
        centerChild: false
      }
    }
  },
  computed: {
    processPublished() {
      var colorArray = [
        {
          top: '#4bf3ff', // 蓝
          bottom: 'rgba(11,42,84,.3)'
        }
      ]
      return {
        backgroundColor: '#0E243D',
        tooltip: {
          show: true,
          formatter: '{b}:{c}'
        },
        grid: {
          left: '1%',
          top: '-5%',
          right: '1%',
          bottom: '8%',
          containLabel: true
        },

        yAxis: {
          type: 'value',
          show: true,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            show: true,
            color: '#fff'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#0f4560'],
              width: 1,
              type: 'dashed'
            }
          }
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
            alignWithLabel: false,
            length: 5
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#11314b'
            }
          },
          axisLabel: {
            color: '#ffffff'
          },
          data: ['1.0战略管理', '2.0综合计划管理', '3.0预算管理', '4.0投资管理', '7.0财务管理']
        },
        series: [
          {
            name: '能耗值',
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
              normal: {
                show: true,
                color: colorArray[0].top,
                barBorderRadius: 5,
                shadowColor: 'rgba(255, 255, 255, .5)',
                shadowBlur: 10
              }
            },
            data: [60, 132, 89, 134, 60]
          }
        ]
      }
    },
    processPlan() {
      return {
        title: {
          text: ''
        },
        series: [{
          type: 'liquidFill',
          data: [0.4, 0.3, 0.2, 0.1],
          shape: 'container',
          outline: {
            show: false
          },
          label: {
            show: false
          },
          backgroundStyle: {
            color: '#0E243D'
          },
          color: ['rgba(82,82,76, .3)', 'rgba(82,82,76, .5)', 'rgba(82,82,76, 1)']
        }]
      }
    },
    processTop() {
      return {
        title: {
          text: ''
        },
        series: [{
          type: 'liquidFill',
          data: [0.4, 0.3, 0.2, 0.1],
          shape: 'container',
          outline: {
            show: false
          },
          label: {
            show: false
          },
          backgroundStyle: {
            color: '#0E243D'
          },
          color: ['rgba(12,90,120, .3)', 'rgba(12,90,120, .5)', 'rgba(12,90,120, 1)']
        }]
      }
    },
    route() {
      return this.$route.fullPath
    }
  },
  mounted() {
    this.getKpi()
    this.getEfficiency()
    this.getEfficiency1()
    this.getDashboard()
    this.lineFun('Child5')
    this.lineFun('Child2')
    // initCanvas()
  },
  methods: {
    // 曲线图形成
    lineFun(id) {
      let self = this
      let firstChild = echarts.init(self.$refs[id])
      this.$nextTick(() => {
        switch (true) {
          case id === 'Child5':
            firstChild.setOption(self.processPlan, true)
            break
          case id === 'Child2':
            firstChild.setOption(self.processTop, true)
            break
          case id === 'Child9':
            firstChild.setOption(self.processCircle1, true)
            break
          case id === 'Child10':
            firstChild.setOption(self.processCircle2, true)
            break
          case id === 'Child11':
            firstChild.setOption(self.processCircle3, true)
            break
          case id === 'Child12':
            firstChild.setOption(self.processCircle4, true)
            break
        }
      })
    },
    // 获取KPI
    getKpi() {
      getKPI().then(res => {
        if (!res) return false
        this.KPI = res
      })
    },
    // 获取流程效率
    getEfficiency() {
      getEFFiciency({
        attr: {},
        orderby: 'value',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: this.sort,
        logic: 'or',
        filters: [
          { key: 'month', opt: 'EQ', type: 'string', value: this.month }
        ]
      }).then(res => {
        console.log(res)
        if (!res) return false
        let stateList = res.map(item => item.name)
        let valueList = res.map(item => item.value)
        let colorArray = [
          {
            top: '#3ffeea', // 蓝
            bottom: 'rgba(11,42,84,1)'
          }
        ]
        console.log(stateList)
        let processTrend = {
          backgroundColor: '#0E243D',
          tooltip: {
            show: true,
            formatter: '{b}:{c}'
          },
          grid: {
            left: '1%',
            top: '-5%',
            right: '1%',
            bottom: '8%',
            containLabel: true
          },

          yAxis: {
            type: 'value',
            show: true,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            axisLabel: {
              show: true,
              color: '#fff'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#0f4560'],
                width: 1,
                type: 'dashed'
              }
            }
          },
          xAxis: {
            type: 'category',
            axisTick: {
              show: false,
              alignWithLabel: false,
              length: 5
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#11314b'
              }
            },
            axisLabel: {
              color: '#ffffff'
            },
            data: stateList
          },
          series: [
            {
              name: '能耗值',
              type: 'bar',
              barWidth: '50%',
              itemStyle: {
                normal: {
                  show: true,
                  color: function(params) {
                    const num = colorArray.length
                    return {
                      type: 'linear',
                      x: 0,
                      y: 1,
                      x2: 0,
                      y2: 0,
                      colorStops: [
                        {
                          offset: 0,
                          color: colorArray[0].bottom
                        },
                        {
                          offset: 1,
                          color: colorArray[0].top
                        }
                      ]
                    }
                  }
                }
              },
              data: valueList
            }
          ]
        }
        let firstChild = echarts.init(this.$refs.Child6)
        firstChild.setOption(processTrend)
        firstChild.resize()
      })
    },
    getEfficiency1() {
      getUseRate({
        attr: {},
        orderby: 'value',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: this.sort,
        logic: 'or',
        filters: [
          { key: 'month', opt: 'EQ', type: 'string', value: this.month }
        ]
      }).then(res => {
        if (!res) return false
        let stateList = res.map(item => item.name)
        let valueList = res.map(item => item.value)
        let colorArray = [
          {
            top: '#61b3ff',
            bottom: 'rgba(11,42,84,1)'
          }
        ]
        let processTrend = {
          backgroundColor: '#0E243D',
          tooltip: {
            show: true,
            formatter: '{b}:{c}'
          },
          grid: {
            left: '1%',
            top: '-5%',
            right: '1%',
            bottom: '8%',
            containLabel: true
          },

          yAxis: {
            type: 'value',
            show: true,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            axisLabel: {
              show: true,
              color: '#fff'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#0f4560'],
                width: 1,
                type: 'dashed'
              }
            }
          },
          xAxis: {
            type: 'category',
            axisTick: {
              show: false,
              alignWithLabel: false,
              length: 5
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#11314b'
              }
            },
            axisLabel: {
              color: '#ffffff'
            },
            data: stateList
          },
          series: [
            {
              name: '能耗值',
              type: 'bar',
              barWidth: '50%',
              itemStyle: {
                normal: {
                  show: true,
                  color: function(params) {
                    const num = colorArray.length
                    return {
                      type: 'linear',
                      x: 0,
                      y: 1,
                      x2: 0,
                      y2: 0,
                      colorStops: [
                        {
                          offset: 0,
                          color: colorArray[0].bottom
                        },
                        {
                          offset: 1,
                          color: colorArray[0].top
                        }
                      ]
                    }
                  }
                }
              },
              data: valueList
            }
          ]
        }
        let firstChild = echarts.init(this.$refs.Child7)
        firstChild.setOption(processTrend)
        firstChild.resize()
      })
    },
    orderClick() {
      this.orderPD = !this.orderPD
      if (this.orderPD === true) {
        this.sort = 'ASC'
        this.getEfficiency()
      } else {
        this.sort = 'DESC'
        this.getEfficiency()
      }
    },
    lastMonth() {
      this.month = 'LastMonth'
      this.getEfficiency()
      this.getEfficiency1()
      this.getDashboard()
    },
    newMonth() {
      this.month = 'ThisMonth'
      this.getEfficiency()
      this.getEfficiency1()
      this.getDashboard()
    },
    seasonFilter() {
      this.month = 'ThisSeason'
      this.getEfficiency()
      this.getEfficiency1()
      this.getDashboard()
    },
    yearFilter() {
      this.month = 'ThisYear'
      this.getEfficiency()
      this.getEfficiency1()
      this.getDashboard()
    },
    orderClick1() {
      this.orderPD1 = !this.orderPD1
      if (this.orderPD1 === true) {
        this.sort = 'ASC'
        this.getEfficiency1()
      } else {
        this.sort = 'DESC'
        this.getEfficiency1()
      }
    },
    async getDashboard () {
      let self = this
      console.log(this.month)
      let res = [[
        {
          'kpiname': '采购结余',
          'pvalue1': 90,
          'pvalue2': 70,
          'threshold': 40,
          'kpivalue': parseInt(Math.random() * 90)
        },
        {
          'kpiname': '财务结余',
          'pvalue1': 70,
          'pvalue2': 50,
          'threshold': 20,
          'kpivalue': parseInt(Math.random() * 70)
        },
        {
          'kpiname': '销售利润',
          'pvalue1': 80,
          'pvalue2': 60,
          'threshold': 40,
          'kpivalue': parseInt(Math.random() * 80)
        },
        {
          'kpiname': '全厂人均销售额',
          'pvalue1': 70,
          'pvalue2': 50,
          'threshold': 30,
          'kpivalue': parseInt(Math.random() * 70)
        },
        {
          'kpiname': '招标',
          'pvalue1': 60,
          'pvalue2': 30,
          'threshold': 20,
          'kpivalue': parseInt(Math.random() * 60)
        },
        {
          'kpiname': '资产生命',
          'pvalue1': 70,
          'pvalue2': 40,
          'threshold': 20,
          'kpivalue': parseInt(Math.random() * 70)
        }
      ], {
        'pvalue1': 80,
        'pvalue2': 50,
        'threshold': 40,
        'kpiValue': parseInt(Math.random() * 80)
      }]
      this.childrenChartId = res[0]
      this.profitChartdata = res[1]
      let profitMax = res[1].pvalue1 > res[1].kpiValue ? (res[1].pvalue1) : (res[1].kpiValue)
      console.log(profitMax)
      self.profitChart.startAngle = 225
      self.profitChart.endAngle = -45
      self.profitChart.axisLine.lineStyle.color = [[(res[1].threshold / profitMax).toFixed(2), '#cccccc'], [(res[1].pvalue2 / profitMax).toFixed(2), '#ff4500'], [(res[1].pvalue1 / profitMax).toFixed(2), '#feff00'], [1, 'lime']]
      self.profitChart.data = [{'value': (res[1].kpiValue).toFixed(2)}]
      self.profitChart.detail.formatter = res[1].kpiValue + '\n税前利润 ' + ' (万)'
      self.profitChart.max = profitMax
      self.profitChartdata.pvalue1 = (profitMax + '').length < 4 ? this.profitChartdata.pvalue1 : this.profitChartdata.pvalue1 / 10000
      self.profitChartdata.pvalue2 = (profitMax + '').length < 4 ? this.profitChartdata.pvalue2 : this.profitChartdata.pvalue2 / 10000
      self.profitChartdata.threshold = (profitMax + '').length < 4 ? this.profitChartdata.threshold : this.profitChartdata.threshold / 10000

      let series = []
      series.push(Object.assign({}, this.commonChart, self.profitChart))
      series[0].axisLabel.formatter = (value) => {
        let showValue = (profitMax + '').length < 4 ? value : (value / 10000)
        let maxVal = (profitMax + '').length < 4 ? parseFloat(profitMax) : (parseFloat(profitMax) / 10000)
        if (
          showValue == 0 ||
          showValue == maxVal / 5 ||
          showValue == maxVal / 2 ||
          showValue == maxVal * 4 / 5 ||
          showValue == maxVal
        ) {
          return showValue
        }
        return ''
      }
      let arr = []
      let maxArr = []
      for (let i = 0; i < res[0].length; i++) {
        let item = res[0][i]
        let index = i
        let obj = JSON.parse(JSON.stringify(self.firstarchiture))
        let commonObj = JSON.parse(JSON.stringify(self.commonChart))
        let profitMax = item.pvalue1 > parseFloat(item.kpivalue) ? (item.pvalue1) : (parseFloat(item.kpivalue))
        maxArr.push(profitMax + '')
        obj.center = ['50%', '50%']
        let name = res[0][index].kpiname
        let value = res[0][index].kpivalue
        obj.name = name
        obj.max = profitMax
        obj.silent = false
        obj.detail.formatter = value + '\n' + name + ' (万)'
        obj.data = [{'value': parseInt(item.kpivalue).toFixed(2), 'id': item.id}]
        obj.axisLine.lineStyle.color = [[(item.threshold / profitMax).toFixed(2), '#cccccc'], [(item.pvalue2 / profitMax).toFixed(2), '#ff4500'], [(item.pvalue1 / profitMax).toFixed(2), '#feff00'], [1, 'lime']]
        arr.push(JSON.parse(JSON.stringify(Object.assign({}, commonObj, obj))))
        self.childrenChartId[i].pvalue1 = (profitMax + '').length < 4 ? self.childrenChartId[i].pvalue1 : self.childrenChartId[i].pvalue1 / 10000
        self.childrenChartId[i].pvalue2 = (profitMax + '').length < 4 ? self.childrenChartId[i].pvalue2 : self.childrenChartId[i].pvalue2 / 10000
        self.childrenChartId[i].threshold = (profitMax + '').length < 4 ? self.childrenChartId[i].threshold : self.childrenChartId[i].threshold / 10000
      }

      for (let i = 0; i < arr.length; i++) {
        arr[i].axisLabel.formatter = (value) => {
          let showValue = maxArr[i].length < 4 ? value : (value / 10000)
          let maxVal = maxArr[i].length < 4 ? parseFloat(maxArr[i]) : (parseFloat(maxArr[i]) / 10000)
          if (
            showValue == 0 ||
            showValue == maxVal / 5 ||
            showValue == maxVal / 2 ||
            showValue == maxVal * 4 / 5 ||
            showValue == maxVal
          ) {
            return showValue
          }
          return ''
        }
      }
      console.log(series)
      // self.$nextTick(() => {
      let firstChild = echarts.init(self.$refs.centerChart)
      firstChild.setOption({'series': series}, true)
      firstChild.resize()
      if (self.commonObj.firstChild) {
        self.commonObj.firstChild.dispose()
      }
      if (arr[0]) {
        self.commonObj.firstChild = echarts.init(self.$refs.firstChart)
        self.commonObj.firstChild.setOption({'series': [arr[0]]}, true)
        self.commonObj.firstChild.resize()
      }
      if (self.commonObj.secondChild) {
        self.commonObj.secondChild.dispose()
      }
      if (arr[1]) {
        self.commonObj.secondChild = echarts.init(self.$refs.secondChart)
        self.commonObj.secondChild.setOption({'series': [arr[1]]}, true)
        self.commonObj.secondChild.resize()
      }
      if (self.commonObj.thirdChild) {
        self.commonObj.thirdChild.dispose()
      }
      if (arr[2]) {
        self.commonObj.thirdChild = echarts.init(self.$refs.thirdChart)
        self.commonObj.thirdChild.setOption({'series': [arr[2]]}, true)
        self.commonObj.thirdChild.resize()
      }
      if (self.commonObj.fourthChild) {
        self.commonObj.fourthChild.dispose()
      }
      if (arr[3]) {
        self.commonObj.fourthChild = echarts.init(self.$refs.fourthChart)
        self.commonObj.fourthChild.setOption({'series': [arr[3]]}, true)
        self.commonObj.fourthChild.resize()
      }
      if (self.commonObj.fifthChild) {
        self.commonObj.fifthChild.dispose()
      }
      if (arr[4]) {
        self.commonObj.fifthChild = echarts.init(self.$refs.fifthChart)
        self.commonObj.fifthChild.setOption({'series': [arr[4]]}, true)
        self.commonObj.fifthChild.resize()
      }
      if (self.commonObj.sixthChild) {
        self.commonObj.sixthChild.dispose()
      }
      if (arr[5]) {
        self.commonObj.sixthChild = echarts.init(self.$refs.sixthChart)
        self.commonObj.sixthChild.setOption({'series': [arr[5]]}, true)
        self.commonObj.sixthChild.resize()
      }

      this.setTime = setInterval(function () {
        series[0].data[0].value = parseInt(Math.random() * 70)
        series[0].detail.formatter = series[0].data[0].value + '\n税前利润 ' + ' (万)'
        firstChild.setOption({'series': series}, true)
        arr[0].data[0].value = parseInt(Math.random() * 90)
        arr[0].detail.formatter = arr[0].data[0].value + '\n ' + arr[0].name + ' (万)'
        self.commonObj.firstChild.setOption({'series': [arr[0]]}, true)
        arr[1].data[0].value = parseInt(Math.random() * 80)
        arr[1].detail.formatter = arr[1].data[0].value + '\n ' + arr[1].name + ' (万)'
        self.commonObj.secondChild.setOption({'series': [arr[1]]}, true)
        arr[2].data[0].value = parseInt(Math.random() * 60)
        arr[2].detail.formatter = arr[2].data[0].value + '\n ' + arr[2].name + ' (万)'
        self.commonObj.thirdChild.setOption({'series': [arr[2]]}, true)
        arr[3].data[0].value = parseInt(Math.random() * 70)
        arr[3].detail.formatter = arr[3].data[0].value + '\n ' + arr[3].name + ' (万)'
        self.commonObj.fourthChild.setOption({'series': [arr[3]]}, true)
        arr[4].data[0].value = parseInt(Math.random() * 70)
        arr[4].detail.formatter = arr[4].data[0].value + '\n ' + arr[4].name + ' (万)'
        self.commonObj.fifthChild.setOption({'series': [arr[4]]}, true)
        arr[5].data[0].value = parseInt(Math.random() * 70)
        arr[5].detail.formatter = arr[5].data[0].value + '\n ' + arr[5].name + ' (万)'
        self.commonObj.sixthChild.setOption({'series': [arr[5]]}, true)
      }, 2000)

      // })
    },
    toDetail (child) {
      if (child) {
        console.log(child)
        console.log(this.childrenChartId)
        // this.$router.push({'path': '/diCenter/detailList', query: {id: child.id}})
        this.$router.push({'path': '/diCenter/bpaPostDetails'})
      }
    }
  },
  beforeDestroy () {
    if (this.setTime) {
      clearInterval(this.setTime)
    }
  }
}
</script>
<style lang="scss" scoped>
.h33{
  height: 33%;
}
.h34{
  height: 34%;
}
.di {
  &__container {
    width: 100%;
    height: 100%;
    color: #fff;
    // background: url("../../../assets/img/qietu/beijing.png") no-repeat center center;
    height: calc(100vh);
    width: 100%;
    overflow: hidden;
    background-size: cover;
  }
  &__router-container {
    :hover {
      span {
        color: #39cdfb;
      }
    }
    span {
      color: #2e77bb;
      font-size: 22px;
    }
    position: relative;
    span {
      top: 18px;
      width: 38%;
      display: block;
      right: 13%;
      text-align: center
    }
  }
  &__router {
    display: block;
    width: 80%;
    margin: 0 auto;
    img{
      display: block;
      margin: 0 auto;
    }
  }
  &__routerlist-secondary {
    :hover {
      span {
        color: #39cdfb;
      }
    }
    a img {
      width: 150px;
    }
    span {
      color: #3077b9;
      font-size: 18px;
      top: 10px;
      left: 57px;
    }
    .preview {
      top: 30px;
      left: 220px;
    }
    .map {
      top: 200px;
      right: -10px;
    }
    .performance {
      top: 150px;
      left: 18px;
    }
    .control {
      top: 380px;
      left: 103px;
    }
    .effect {
      top: 465px;
      left: 480px;
    }
  }
  &__echart-container{
    padding: 20px 20px 0 0;
  }
  &__echart-item{
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      color: #3ad1fc;
      // box-shadow: 3px 3px 2px #3077b9;
      .showCount{
        position: absolute;
        top: 8px;
        left: 8px;
        p:nth-of-type(2){
          font-size: 30px;
          font-weight: bold;
          margin-top: 6px;
        }
      }
      .title{
        padding-left: 15px;
        background-color: #10182D;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        &:after {
          content: '';
          display: inline-block;
          height: 100%;
          vertical-align: middle;
        }
      }
  }
}
.fontYellow{
  color: #b3a508;
}
.relative {
  position: relative;
  .plant {
    position: absolute;
    top: 120px;
    left: 0;
    right: 0;
    margin: auto;
  }
  #canvas {
    position: absolute;
    z-index: 1;
  }
}
.absolute {
  position: absolute;
  z-index: 2;
}
.active-router,
.active-router-secondary {
  span {
    color: #39cdfb;
  }
}
.h18{
  height: 18%;
}
.h75{
  height: 75%;
}
.h120 {
  height: 130px;
  width: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.h37{
  height: 37.5%;
}
.w80 {
  width: 80%;
}
.header-database {
    font-size: 19px !important;
    display: block;
    width: 80%;
}
// .header-database1 {
//   left: 118px!important;
//   font-size: 19px!important;
// }
// .header-database2 {
//   font-size: 19px!important;
// }
.button-base {
  padding-top: 10px;
  padding-left: 31px;
  .el-button {
    background: #0a1729;
    border: 1px solid #2e77bb;
    color: #2e77bb;
    &:hover,&:focus {
      color: #8cc7ff;
      background-color: #2e77bb;
    }
  }
  .active{
    color: #8cc7ff;
    background-color: #2e77bb;
  }
}
#dicenter{
  .mainChart{
    .dashboard{
      height: calc(100vh - 140px)
    }
  }
}
.showContent{
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  padding: 5px;
  background-color: rgba(0,0,0,.85);
  li{
    line-height: 18px;
    span{
      display: inline-block;
      vertical-align: top;
      width: 50px;
      text-align: right;
      margin-right: 5px;
    }
  }
}
.centerpos{
  top: 16%;
  right: 8%;
}
.fontplan1{
  color: #feff00;
}
.fontplan2{
  color: #e7402c;
}
.fontthreshold{
  color: #ccc;
}
</style>
<style lang="scss">
  .order-item {
    width: 88%;
    display: inline-block;
  }
  .order-item1 {
    cursor: pointer;
  }
</style>
