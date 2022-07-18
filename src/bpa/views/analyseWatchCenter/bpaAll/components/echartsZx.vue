<template>
  <div class="wrapper">
    <div class="inner">
      <div :id="id" class="chart" />
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    zxList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      monList: []
    };
  },
  watch: {
    'zxList.percentumDto': function(val) {
      this.drawChart()
    }
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    // 时间排序
    dataSort(a, b) {
      var time = a.replace(/-/g, '')
      var times = b.replace(/-/g, '')
      // console.log(time, times, '000000')
      return time - times
    },
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let chart = echarts.init(document.getElementById(this.id));
      // 监听屏幕变化自动缩放图表
      window.addEventListener("resize", function() {
        chart.resize()
      });
      var currentMonth = []
      var lastMonth = []
      this.monList = []
      var reg = new RegExp("%", "g")
      // 处理折线图数据
      if (JSON.stringify(this.zxList) !== '{}') {
        var obj = this.zxList.percentumDto[0]
        var current = this.zxList.percentumDto[1]
        var obomonth = this.zxList.percentumDto[2]
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            this.monList.push(key)
          }
        }
        this.monList.sort(this.dataSort)
        this.monList.map(item => {
          var mon = item.split('-')
          lastMonth.push(current[mon[0] - 1 + '-' + mon[1]].replace(reg, ''))
          currentMonth.push({
            value: obj[item].replace(reg, ''),
            value1: obomonth[mon[1]].replace(reg, '')
          })
        })
      }
      // 绘制图表
      var fontColor = '#30eee9'
      chart.setOption({
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(0, 255, 233,0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(255, 255, 255,1)',
                }, {
                  offset: 1,
                  color: 'rgba(0, 255, 233,0)'
                }],
                global: false
              }
            }
          },
          formatter: function(params) {
            var res = '<div>' + params[0].name + '</div>' + '<div class="hover-bg"><div><span>本期：</span>' + params[0].data.value + '%</div>' +
                '<div><span>同期：</span>' + params[1].value + '%</div>' +
                '<div><span>环比增减率：</span>' + params[0].data.value1 + '%</div></div>'
            return res
          }
        },
        legend: {
          show: true,
          x: 'right',
          y: '15',
          icon: 'stack',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#1bb4f6'
          },
          data: ["本期", "同期"]
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLabel: {
              color: fontColor
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#397cbc"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#195384"
              }
            },
            data: this.monList
          }
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 100,
            axisLabel: {
              formatter: "{value}%",
              textStyle: {
                color: "#2ad1d2"
              }
            },
            axisLine: {
              lineStyle: {
                color: "#27b4c2"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#11366e"
              }
            }
          }
        ],
        series: [
          {
            name: "本期",
            type: "line",
            symbol: "circle",
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: "#0092f6",
                lineStyle: {
                  color: "#0092f6",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,146,246,0.9)"
                    }
                  ])
                }
              }
            },
            markPoint: {
              itemStyle: {
                normal: {
                  color: "red"
                }
              }
            },
            data: currentMonth
          },
          {
            name: "同期",
            type: "line",
            symbol: "circle",
            symbolSize: 8,

            itemStyle: {
              normal: {
                color: "#00d4c7",
                lineStyle: {
                  color: "#00d4c7",
                  width: 1
                },
                areaStyle: {
                  //color: '#94C9EC'
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "rgba(7,44,90,0.3)"
                    },
                    {
                      offset: 1,
                      color: "rgba(0,212,199,0.9)"
                    }
                  ])
                }
              }
            },
            data: lastMonth
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.wrapper {
  /* width: 100%; */
}
.wrapper .inner .chart {
  width: 100%;
  height: 482px;
}
</style>