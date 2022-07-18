<template>
  <div class="wrapper">
    <div class="inner">
      <div :id="id" class="chart"/>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { queryProcessExecutionEfficiency } from '@/bpa/api/analyseWatchCenter'

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
    return {
    }
  },
  watch: {
    dataList: function(val) {
      if(val.length > 0){
        this.drawChart()
      }
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    // 图表实例化
    drawChart() {
      if (this.dataList.length > 0) {
        var stateList = this.dataList.map(item => item.foldername)
        // console.log("图表实例化---stateList", stateList)
        if (this.id === 'XXH' || this.id === 'ZXXL' || this.id === 'GWFG') {
          var reg = new RegExp("%", "g")
          var nowMatchedPercentum = []
          this.dataList.map(item => {
            if(item.nowMatchedPercentum){
              nowMatchedPercentum.push(item.nowMatchedPercentum.replace(reg, ""))
            }
          })

          var lastMonthMatchedPercentum = []
          this.dataList.map(item => {
            if(item.lastMonthMatchedPercentum && item.nowAndLastMonthContrastPercentum){
              lastMonthMatchedPercentum.push({
                value: item.lastMonthMatchedPercentum.replace(reg, ""),
                value1: item.nowAndLastMonthContrastPercentum.replace(reg, "")
              })
            }
          })
        }
        if (this.id === 'Z') {
          var reg = new RegExp("%", "g")
          var nowMatchedPercentum = []
          this.dataList.map(item => {
            if(item.lNowMatchedPercentums){
              nowMatchedPercentum.push(item.lNowMatchedPercentums.replace(reg, ""))
            }
          })
          var lastMonthMatchedPercentum = []
          this.dataList.map(item => {
            if(item.lLastMonthMatchedPercentum&&item.lNowAndLastMonthContrastPercentum){
               lastMonthMatchedPercentum.push({
                value: item.lLastMonthMatchedPercentum.replace(reg, ""),
                value1: item.lNowAndLastMonthContrastPercentum.replace(reg, "")
              })  
            }      
          })
        }
      }
      // 基于准备好的dom，初始化echarts实例
      const chart = echarts.init(document.getElementById(this.id))
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function() {
        chart.resize()
      })
      // 绘制图表
      chart.setOption(
        {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function(params) {
              var res = '<div>' + params[0].name + '</div>' +
                '<div>' + '<span>本月：</span>' + params[0].data + '%</></div>' +
                '<div><span>上月：</span>' + params[1].data.value + '%</div>' +
                '<div><span>环比增减率：</span>' + params[1].data.value1 + '%</div>'
              return res
            }
          },
          legend: {
            data: ['本月', '上月'],
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
          xAxis: [{
            type: 'category',
            data: stateList,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#063374',
                width: 1,
                type: 'solid'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#00c7ff'
              },
              interval: 0,
              rotate: 40
            }
          }],
          yAxis: [{
            type: 'value',
            axisLabel: {
              formatter: '{value} %'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#00c7ff',
                width: 1,
                type: 'solid'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#063374'
              }
            }
          }],
          series: [{
            name: '本月',
            type: 'bar',
            data: nowMatchedPercentum,
            barWidth: 18, // 柱子宽度
            barGap: 0.4, // 柱子之间间距
            itemStyle: {
              normal: {
                color: '#09EEF5',
                opacity: 1
              }
            }
          }, {
            name: '上月',
            type: 'bar',
            data: lastMonthMatchedPercentum,
            barWidth: 18,
            barGap: 0.4,
            itemStyle: {
              normal: {
                color: '#196EFF',
                opacity: 1
              }
            }
          }]
        }
      )
    }
  }
}
</script>

<style scoped>
  .wrapper .inner .chart {
    width: 100%;
    height: 364px;
  }
</style>
