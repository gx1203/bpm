<template>
  <div class='wrapper'>
    <div class="inner">
      <div class='chart' id='chart'></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    number: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  watch: {
    number: function(val) {
      this.drawChart()
    }
  },
  mounted() {
  },
  methods: {
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let chart = echarts.init(document.getElementById('chart'))
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function () {
        chart.resize()
      })
      // 绘制图表
      chart.setOption({
        // 图表主标题
        title: {
        },
        // 提示框组件
        tooltip: {
          trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
          textStyle: {
            color: '#fff' // 文字颜色
          },
          // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
          // 水球图: {a}（系列名称），{b}（无），{c}（数值）
          // 使用函数模板   传入的数据值 -> value: number|Array,
          formatter: function (value) {
            return '已发布制度' + ': ' + value.name
          }
        },
        series: [{
          type: 'liquidFill',
          name: '全国就业率', // 系列名称，用于tooltip的显示，legend 的图例筛选
          radius: '58%', // 水球图的半径
          center: ['50%', '60%'], // 水球图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
          // 水填充图的形状 circle 默认圆形  rect 圆角矩形  triangle 三角形  
          // diamond 菱形  pin 水滴状 arrow 箭头状  还可以是svg的path
          shape: 'circle',
          phase: 0, // 波的相位弧度 不设置  默认自动
          direction: 'right', // 波浪移动的速度  两个参数  left 从右往左 right 从左往右
          outline: {
            show: true,
            borderDistance: 0, // 边框线与图表的距离 数字
            itemStyle: {
              opacity: 1, // 边框的透明度   默认为 1
              borderWidth: 1, // 边框的宽度
              shadowBlur: 1, // 边框的阴影范围 一旦设置了内外都有阴影
              shadowColor: '#fff', // 边框的阴影颜色,
              borderColor: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 0.5,
                y2: 1,
                colorStops: [{
                  offset: 1,
                  color: 'rgba(15, 200, 206, 0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(15, 200, 206, .25)'
                }, {
                  offset: 0,
                  color: 'rgba(15, 200, 206, 1)'
                }],
                globalCoord: false
              } // 边框颜色
            }
          },
          // 图形样式
          itemStyle: {
            color: 'rgba(15, 200, 206, 1)', // 水球显示的背景颜色
            opacity: 0.9, // 波浪的透明度
            shadowBlur: 10 // 波浪的阴影范围
          },
          backgroundStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0.5,
              y2: 1,
              colorStops: [{
                offset: 1,
                color: 'rgba(15, 200, 206, 0)'
              }, {
                offset: 0.5,
                color: 'rgba(15, 200, 206, .25)'
              }, {
                offset: 0,
                color: 'rgba(15, 200, 206, 1)'
              }],
              globalCoord: false
            }
          },
          // 图形的高亮样式
          emphasis: {
            itemStyle: {
              opacity: 0.8 // 鼠标经过波浪颜色的透明度
            }
          },
          // 图形上的文本标签
          label: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#fff',
            formatter: function (value) {
              return value.name
            }
          },
          data: [
            { value: 0.5, name: (this.number + '') }
          ] // 系列中的数据内容数组
        }]
      })
    }
  }
}
</script>

<style scoped>
  .wrapper {
    /* width: 100%; */
  }
  .wrapper .inner {
    position: absolute;
    top: 34%;
    right: 18%;
    height: 200px;
    background-size: 100% 100%;
  }
  @media screen and (max-width: 1540px) {
    .wrapper .inner{
      position: absolute;
      top: 20%;
      right: 16%;
    }
  }
  @media screen and (max-width: 1400px) {
    .wrapper .inner{
      position: absolute;
      top: 6%;
      right: 15%;
    }
  }
  .wrapper .inner .chart {
    width: 200px;
    height: 200px;
    background-size: 80% 80%;
    margin: 10px auto 0;
    background: url(../../../../assets/img/qietu/yuan.gif) no-repeat center bottom;
    background-size: 80% 80%;
  }
</style>