<template>
  <div class='wrapper'>
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
    },
    color: {
      type: String,
      default: 'add-color'
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
      var number = this.number.replace(reg, "")
      // console.log(number, '11111')
      let chart = echarts.init(document.getElementById(this.id))
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function () {
        chart.resize()
      })
      // 绘制图表
      var pieInnerData = []
      for (var i = 0; i < 25; i++) {
        pieInnerData.push({
          value: 1
        },
        {
          value: 1,
          itemStyle: {
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 20
          }
        })
      }
      chart.setOption(
        {
          color: ['#5DA6D5'],
          textStyle: {
            fontSize: 18,
            color: '#F5F5F5'   
          },
          series: [
            {
              type: 'pie',
              name: '外圈辅助圆环',
              radius: ['71%', '77%'],
              center: ["50%", "50%"],
              startAngle: 90,
              hoverAnimation: false,
              cursor: 'default',
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              itemStyle: {
                color: '#2e6189'
              },
              splitLine: {
                show: true,
                length: 17,
                lineStyle: {
                  color: '#051F54',
                  width: 30
                }
              },
              data: pieInnerData
            },
            {
              type: 'pie',
              name: '航班正常率',
              radius: ['69%', '79%'],
              center: ["50%", "50%"],
              startAngle: 90,
              hoverAnimation: false,
              cursor: 'default',
              label: {
                normal: {
                  position: "center",
                  show: true,
                  color: this.color === 'up' ? '#0DDE87' : '#F93598',
                  formatter: number + '%',
                  fontWeight: '700',
                  fontSize: 14
                }
              },
              itemStyle: {
                normal: {
                  color: this.color === 'up' ? '#0DDE87' : '#F93598'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                {
                  value: number
                },
                {
                  value: 100 - number,
                  itemStyle: {
                    color: 'transparent'
                  }
                }
              ]
            },
            {
            type: 'pie',
            radius: ['0', '55%'],
            center: ["50%", "50%"],
            z: 4,
            hoverAnimation: false,
            cursor: 'default',
            data: [{
                name: '积分',
                value: 1,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(23,161,255,0)'
                    }, {
                        offset: 1,
                        color: 'rgba(17,90,233,.3) '
                    }])
                }

                },
                label: {
                    normal: {
                        color: this.color === 'up' ? '#0DDE87' : '#F93598',
                        align: 'center',
                        fontSize: 30,
                        formatter: function(params) {
                            return 1 + "%" ;
                        },
                        position: 'center',
                        show: false
                    }
                },
                labelLine: {
                    show: false
                }
            }],
        },
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
    width: 96px;
    height: 96px;
    margin: 0 auto;
  }
</style>