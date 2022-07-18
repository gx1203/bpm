<template>
  <div class="wrapper">
    <div class="inner">
      <div :id="id + '1'" class="chart"/>
      <div :id="id + '2'" class="chart1"/>
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
    },
    id: {
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
      const chart = echarts.init(document.getElementById(this.id + '1'))
      const chart1 = echarts.init(document.getElementById(this.id + '2'))
      let angle = 0 // 角度，用来做简单的动画效果的
      // 监听屏幕变化自动缩放图表
      window.addEventListener('resize', function() {
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
          formatter: function(value) {
            return '已发布制度' + ': ' + value.name
          }
        },
        series: [
          {
            type: 'liquidFill',
            name: '全国就业率', // 系列名称，用于tooltip的显示，legend 的图例筛选
            radius: '68%', // 水球图的半径
            center: ['50%', '50%'], // 水球图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
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
                    color: 'rgba(68, 145, 253, 0)'
                  }, {
                    offset: 0.5,
                    color: 'rgba(68, 145, 253, .25)'
                  }, {
                    offset: 0,
                    color: 'rgba(68, 145, 253, 1)'
                  }],
                  globalCoord: false
                } // 边框颜色
              }
            },
            // 图形样式
            itemStyle: {
              color: 'rgba(68, 145, 253, 1)', // 水球显示的背景颜色
              opacity: 0.8, // 波浪的透明度
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
                  color: 'rgba(68, 145, 253, 0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(68, 145, 253, .25)'
                }, {
                  offset: 0,
                  color: 'rgba(68, 145, 253, 1)'
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
              fontWeight: 400,
              color: '#fff',
              formatter: function(value) {
                return value.name
              }
            },
            data: [
              { value: 0.5, name: (this.number + '') }
            ] // 系列中的数据内容数组
          }
        ]
      })
      var option = {
        title: {
          show: false
        },
        legend: {
          show: false
        },
        series: [
          {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function(params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.81,
                  startAngle: (0 + angle) * Math.PI / 180,
                  endAngle: (90 + angle) * Math.PI / 180
                },
                style: {
                  stroke: '#4870B1',
                  fill: 'transparent',
                  lineWidth: 1.5
                },
                silent: true
              }
            },
            data: [0]
          }, {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function(params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.81,
                  startAngle: (180 + angle) * Math.PI / 180,
                  endAngle: (270 + angle) * Math.PI / 180
                },
                style: {
                  stroke: '#4870B1',
                  fill: 'transparent',
                  lineWidth: 1.5
                },
                silent: true
              }
            },
            data: [0]
          }, {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function(params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.91,
                  startAngle: (270 + -angle) * Math.PI / 180,
                  endAngle: (40 + -angle) * Math.PI / 180
                },
                style: {
                  stroke: '#4870B1',
                  fill: 'transparent',
                  lineWidth: 1.5
                },
                silent: true
              }
            },
            data: [0]
          }, {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function(params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.91,
                  startAngle: (90 + -angle) * Math.PI / 180,
                  endAngle: (220 + -angle) * Math.PI / 180
                },
                style: {
                  stroke: '#4870B1',
                  fill: 'transparent',
                  lineWidth: 1.5
                },
                silent: true
              }
            },
            data: [0]
          }, {
            name: 'ring5',
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function(params, api) {
              const x0 = api.getWidth() / 2
              const y0 = api.getHeight() / 2
              const r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.91
              const point = getCirlPoint(x0, y0, r, (90 + -angle))
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 4
                },
                style: {
                  stroke: '#4870B1', // 粉
                  fill: '#4870B1'
                },
                silent: true
              }
            },
            data: [0]
          }, {
            name: 'ring5', // 绿点
            type: 'custom',
            coordinateSystem: 'none',
            renderItem: function(params, api) {
              const x0 = api.getWidth() / 2
              const y0 = api.getHeight() / 2
              const r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.91
              const point = getCirlPoint(x0, y0, r, (270 + -angle))
              return {
                type: 'circle',
                shape: {
                  cx: point.x,
                  cy: point.y,
                  r: 4
                },
                style: {
                  stroke: '#4870B1', // 绿
                  fill: '#4870B1'
                },
                silent: true
              }
            },
            data: [0]
          }
        ]
      }
      // 获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
      function getCirlPoint(x0, y0, r, angle) {
        const x1 = x0 + r * Math.cos(angle * Math.PI / 180)
        const y1 = y0 + r * Math.sin(angle * Math.PI / 180)
        return {
          x: x1,
          y: y1
        }
      }
      function draw() {
        angle = angle + 3
        chart1.setOption(option, true)
      }
      setInterval(function() {
        draw()
      }, 100)
    }
  }
}
</script>

<style scoped>
  .wrapper {
    /* width: 100%; */
  }
  .wrapper .inner {
    height: 260px;
    background-size: 100% 100%;
  }
  .wrapper .inner .chart {
    width: 262px;
    height: 262px;
  }
  .wrapper .inner .chart1 {
    width: 262px;
    height: 262px;
    position: absolute;
    top: 0%;
  }
</style>