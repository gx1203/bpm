<template>
  <div class="analyseWatchCenter">
    <div id="analyseWatchCenter" class="di__container">
      <div class="topMenu">
        <div class="borderBg"/>
      </div>
      <div class="content">

        <bpa-details />
      </div>
    </div>
  </div>
</template>

<script>
import 'echarts-liquidfill'
import operationExample from '../operationExample/index'
import bpaAnalysis from '../bpaAnalysis/index'
import bpaDetails from '../bpmTaskDepartment/index'

export default {
  name: 'BpaDi',
  components: {
    operationExample,
    bpaAnalysis,
    bpaDetails
  },
  data() {
    return {
      echartShow: false,
      activeName: 'first'
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
        echartShow: false,
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
          data: [
            '1.0战略管理',
            '2.0综合计划管理',
            '3.0预算管理',
            '4.0投资管理',
            '7.0财务管理'
          ]
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
        series: [
          {
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
            color: [
              'rgba(82,82,76, .3)',
              'rgba(82,82,76, .5)',
              'rgba(82,82,76, 1)'
            ]
          }
        ]
      }
    },
    processTop() {
      return {
        title: {
          text: ''
        },
        series: [
          {
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
            color: [
              'rgba(12,90,120, .3)',
              'rgba(12,90,120, .5)',
              'rgba(12,90,120, 1)'
            ]
          }
        ]
      }
    },
    route() {
      return this.$route.fullPath
    }
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      this.echartShow = true
      console.log(tab, event)
    }
  }
}
</script>
<style lang="scss" scoped>
.h33 {
  height: 33%;
}
.h34 {
  height: 34%;
}
.analyseWatchCenter {
  width: 100%;
  background: #030b2a;
}
.borderBg {
    width: 100%;
    height: 100px;
    background: url('../../../assets/img/qietu/titleBorder.png') no-repeat;
    background-position: center;
}

#analyseWatchCenter {
  .topMenu {
    position: relative;
    width: 100%;
  }
}
.fontYellow {
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
.h18 {
  height: 18%;
}
.h75 {
  height: 75%;
}
.h120 {
  height: 130px;
  width: 100%;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.h37 {
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
.button-base {
  padding-top: 10px;
  padding-left: 31px;
  .el-button {
    background: #0a1729;
    border: 1px solid #2e77bb;
    color: #2e77bb;
    &:hover,
    &:focus {
      color: #8cc7ff;
      background-color: #2e77bb;
    }
  }
  .active {
    color: #8cc7ff;
    background-color: #2e77bb;
  }
}

.showContent {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.85);
  li {
    line-height: 18px;
    span {
      display: inline-block;
      vertical-align: top;
      width: 50px;
      text-align: right;
      margin-right: 5px;
    }
  }
}
.centerpos {
  top: 16%;
  right: 8%;
}
.fontplan1 {
  color: #feff00;
}
.fontplan2 {
  color: #e7402c;
}
.fontthreshold {
  color: #ccc;
}
</style>
