<template>
  <div class="wrapper">
    <div class="inner">
      <div :id="id" class="chart"/>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    number: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  watch: {
    number: function(val) {
      this.drawChart()
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      var reg = new RegExp("%", "g")
      var dataArr = this.number.replace(reg, "")
      const chart = echarts.init(document.getElementById(this.id))
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function() {
        chart.resize()
      })
      // 绘制图表
      var colorSet = {
        color: '#09EEF5'
      }
      chart.setOption(
        {
          tooltip: {
            formatter: '{a} : {c}%'
          },
          series: [{
            name: '制度流程标准化程度',
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '88%',
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [dataArr / 100, colorSet.color],
                  [1, '#1c3a7e']
                ],
                width: 12
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false

            },
            splitLine: {
              show: false
            },
            itemStyle: {
              color: '#3488DB'
            },
            detail: {
              formatter: function(value) {
                if (value !== 0) {
                  var num = Math.round(value)
                  return parseInt(num).toFixed(0) + '%'
                } else {
                  return 0
                }
              },
              offsetCenter: [0, '62%'],
              textStyle: {
                padding: [0, 0, 0, 0],
                fontSize: 24,
                fontWeight: '700',
                color: '#fff'
              }
            },
            title: { // 标题
              show: false,
              offsetCenter: [0, 46], // x, y，单位px
              textStyle: {
                color: '#fff',
                fontSize: 14, // 表盘上的标题文字大小
                fontWeight: 400,
                fontFamily: 'PingFangSC'
              }
            },
            data: [{
              value: dataArr
            }],
            pointer: {
              show: true,
              length: '72%',
              radius: '100%',
              width: 4 // 指针粗细
            },
            markPoint: {
              symbol: 'circle',
              symbolSize: 5,
              itemStyle: {
                color: "#0054A6"
              },
              tooltip: {
                show: false
              },
              data: [
                {
                  x: "50%",
                  y: "60%"
                }
              ]
            },
            animationDuration: 4000
          },
          {
            name: '外部刻度',
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '66%',
            min: 0, // 最小刻度
            max: 100, // 最大刻度
            splitNumber: 10, // 刻度数量
            startAngle: 225,
            endAngle: -45,
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: [
                  [1, 'rgba(0,0,0,0)']
                ]
              }
            }, // 仪表盘轴线
            axisLabel: {
              show: true,
              color: '#42E4FB',
              distance: 15,
              formatter: function(v) {
                switch (v + '') {
                  case '0':
                    return '0'
                  case '10':
                    return '10'
                  case '20':
                    return '20'
                  case '30':
                    return '30'
                  case '40':
                    return '40'
                  case '50':
                    return '50'
                  case '60':
                    return '60'
                  case '70':
                    return '70'
                  case '80':
                    return '80'
                  case '90':
                    return '90'
                  case '100':
                    return '100'
                }
              }
            }, // 刻度标签。
            axisTick: {
              show: true,
              splitNumber: 5,
              lineStyle: {
                color: '#42E5FB', // 用颜色渐变函数不起作用
                width: 1
              },
              length: -9
            }, // 刻度样式
            splitLine: {
              show: true,
              length: -12,
              lineStyle: {
                color: '#42E5FB' // 用颜色渐变函数不起作用
              }
            }, // 分隔线样式
            detail: {
              show: false
            },
            pointer: {
              show: false
            }
          }
          ]
        }
      )
    }
  }
}
</script>

<style scoped>
  .wrapper {
    /* width: 100%; */
  }
  .wrapper .inner .chart {
    width: 240px;
    height: 240px;
    margin: 0 auto;
  }
</style>