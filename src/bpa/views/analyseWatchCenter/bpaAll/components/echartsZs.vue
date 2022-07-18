<template>
  <div class="wrapper">
    <div class="inner">
      <div :id="id" class="chart" />
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
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  watch: {
    dataList: function(val) {
      this.drawChart()
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    // 图表实例化
    drawChart() {
      if (this.dataList.length > 0) {
        var stateList = this.dataList.map(item => item.foldername); // 展示名字
        var nowMatchedPercentum = []; // 本月
        var lastMonthMatchedPercentum = []; // 上月
        var reg = new RegExp("%", "g"); // 手动去百分号
        this.dataList.map(item => {
          nowMatchedPercentum.push(item.nowMatchedPercentum);
          if(item.lastMonthMatchedPercentum&&item.nowAndLastMonthContrastPercentum){
             lastMonthMatchedPercentum.push({
              value: item.lastMonthMatchedPercentum.replace(reg, ""),
              value1: item.nowAndLastMonthContrastPercentum.replace(reg, "")
            })
          }
        })
        // 将数据 处理未分钟格式
        var nowTime = []
        nowMatchedPercentum.map(item => {
          var time = item.split(':')
          time = parseFloat(time[1]) + parseFloat(time[0]) * 60
          nowTime.push(time)
        })
        var lastTime = []
        lastMonthMatchedPercentum.map(item => {
          var time = item.value.split(':')
          time = parseFloat(time[1]) + parseFloat(time[0]) * 60
          lastTime.push({
            value: time,
            value1: item.value1
          })
        })
      }
      // 基于准备好的dom，初始化echarts实例
      const chart = echarts.init(document.getElementById(this.id));
      // 监听屏幕变化自动缩放图表
      window.addEventListener("resize", function() {
        chart.resize();
      });
      // 时间格式转变方法
      function fomartTime(value) {
        let unit = ["", ":", "0:"],
          hour = 0,
          min = 0,
          second = 0,
          returnStr = 0,
          arrVal = value.toString().split('.')
        if (arrVal.length > 1) {
          second = parseFloat('0.' + arrVal[1])
          second *= 60
          value = parseInt(arrVal[0])
        }
        returnStr = value + unit[0]
        if (value >= 60) {
          hour = parseInt(value / 60)
          min = value % 60
        } else {
          returnStr = unit[2] + value
        }
        if (hour) {
          returnStr = hour + unit[1]
          if (min) {
            returnStr += min + unit[0]
          } else {
            returnStr += '00'
          }
        }
        return returnStr
      }
      // 绘制图表
      chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: function(params) {
            var res = '<div>' + params[0].name + '</div>' +
              "<div><span>本月：</span>" +
              fomartTime(params[0].data) +
              "</div>" +
              "<div><span>上月：</span>" +
              fomartTime(params[1].data.value) +
              "</div>" +
              "<div><span>环比增减率：</span>" +
              params[1].data.value1 +
              "%</div>"
            return res
          }
        },
        legend: {
          data: ["本月", "上月"],
          show: true,
          x: 'right',
          y: '2',
          icon: 'stack',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#1bb4f6'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          top: '10%',
          bottom: '1%',
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: stateList,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#063374",
                width: 1,
                type: "solid"
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#00c7ff"
              },
              interval: 0,
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位：时:分',
            axisLabel: {
              formatter: function(value, index) {
                return fomartTime(value)
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#00c7ff",
                width: 1,
                type: "solid"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#063374"
              }
            }
          }
        ],
        series: [
          {
            name: "本月",
            type: "bar",
            data: nowTime,
            barWidth: 18, // 柱子宽度
            barGap: 0.4, // 柱子之间间距
            itemStyle: {
              normal: {
                color: "#09EEF5",
                opacity: 1
              }
            }
          },
          {
            name: "上月",
            type: "bar",
            data: lastTime,
            barWidth: 18,
            barGap: 0.4,
            itemStyle: {
              normal: {
                color: "#196EFF",
                opacity: 1
              }
            }
          }
        ]
      })
    }
  }
};
</script>

<style scoped>
.wrapper .inner .chart {
  width: 100%;
  height: 364px;
}
</style>
