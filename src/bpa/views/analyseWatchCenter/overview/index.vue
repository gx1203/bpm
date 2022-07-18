<template>
  <div id="bpaAll" class="w100 bpaAll">
    <div style="width:100%">
      <!-- class="bg-more" -->
      <el-row :gutter="50">
        <el-col :span="12" class="bpaAll-lczd">
          <div class="bpaAll-lczd-bottom">
            <div class="bpaAll-zdlcbzh-zx">
              <div class="bpaAll-title">
                | 岗位
                <el-tooltip placement="bottom">
                  <!-- <div slot="content">已发布的制度和流程<br>公式：环比增减率：（系统现在已发布的制度流程-上月系统已发布的制度流程）/上月系统运行的制度流程*100%</div> -->
                  <i class="el-icon-question bpaAll-icon" />
                </el-tooltip>
              </div>
              <div class="falRight">实际岗位（个）</div>
              <el-row class="falRight">
                <el-col :span="24" class="bpaAll-lczd-boder">
                  <div>匹配到流程：15（环比：15.38%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="15.38" color="#4387C5"></el-progress>
                  <div>未匹配到流程：274（环比：89.38%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="89.38" color="#4387C5"></el-progress>
                  <div>匹配流程节点数：14（环比：16.67%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="16.67" color="#4387C5"></el-progress>
                </el-col>
                <div class="bpaAll-lczd-lines" />
              </el-row>
              <div class='wrapper'>
                <div class="inner">
                  <div class='chartRight' id='liquidfill1'></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="bpaAll-lczd">
          <div class="bpaAll-lczd-bottom">
            <div class="bpaAll-zdlcbzh-zx">
              <div class="bpaAll-title">
                | 制度
                <el-tooltip placement="bottom">
                  <!-- <div slot="content">已发布的制度和流程<br>公式：环比增减率：（系统现在已发布的制度流程-上月系统已发布的制度流程）/上月系统运行的制度流程*100%</div> -->
                  <i class="el-icon-question bpaAll-icon" />
                </el-tooltip>
              </div>
              <div class="falRight">已发布制度（支）</div>
              <el-row class="falRight">
                <el-col :span="24" class="bpaAll-lczd-boder">
                  <div>匹配到流程：18（环比：100%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="100" color="#4387C5"></el-progress>
                  <div>未匹配到流程：2（环比：2%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="2" color="#4387C5"></el-progress>
                  <div>失效制度：24（环比：71.34%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="71.34" color="#4387C5"></el-progress>
                </el-col>
                <div class="bpaAll-lczd-lines" />
              </el-row>
              <div class='wrapper'>
                <div class="inner">
                  <div class='chartRight' id='liquidfill2'></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12" class="bpaAll-lczd">
          <div class="bpaAll-lczd-bottom">
            <div class="bpaAll-zdlcbzh-zx">
              <div class="bpaAll-title">
                | 流程
                <el-tooltip placement="bottom">
                  <!-- <div slot="content">已发布的制度和流程<br>公式：环比增减率：（系统现在已发布的制度流程-上月系统已发布的制度流程）/上月系统运行的制度流程*100%</div> -->
                  <i class="el-icon-question bpaAll-icon" />
                </el-tooltip>
              </div>
              <div class="falRight">已发布流程（支）</div>
              <el-row class="falRight">
                <el-col :span="24" class="bpaAll-lczd-boder">
                  <div>匹配到制度：18（环比：100%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="100" color="#4387C5"></el-progress>
                  <div>未匹配到制度：2（环比：15.38%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="15.38" color="#4387C5"></el-progress>
                  <div>作废流程：24（环比：71.43%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="71.43" color="#4387C5"></el-progress>
                </el-col>
                <div class="bpaAll-lczd-lines" />
              </el-row>
              <div class='wrapper'>
                <div class="inner">
                  <div class='chartRight' id='liquidfill3'></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="bpaAll-lczd">
          <div class="bpaAll-lczd-bottom">
            <div class="bpaAll-zdlcbzh-zx">
              <div class="bpaAll-title">
                | KPL
                <el-tooltip placement="bottom">
                  <!-- <div slot="content">已发布的制度和流程<br>公式：环比增减率：（系统现在已发布的制度流程-上月系统已发布的制度流程）/上月系统运行的制度流程*100%</div> -->
                  <i class="el-icon-question bpaAll-icon" />
                </el-tooltip>
              </div>
              <div class="falRight">KPL总数（个）</div>
              <el-row class="falRight">
                <el-col :span="24" class="bpaAll-lczd-boder">
                  <div>总体KPL：18（环比：99%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="99" color="#4387C5"></el-progress>
                  <div>价值链KPL：15（环比：15.45%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="15.45" color="#4387C5"></el-progress>
                  <div>流程KPL：24（环比：77.38%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="77.38" color="#4387C5"></el-progress>
                </el-col>
                <div class="bpaAll-lczd-lines" />
              </el-row>
              <div class='wrapper'>
                <div class="inner">
                  <div class='chartRight' id='liquidfill4'></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="12" class="bpaAll-lczd">
          <div class="bpaAll-lczd-bottom">
            <div class="bpaAll-zdlcbzh-zx">
              <div class="bpaAll-title">
                | 风险
                <el-tooltip placement="bottom">
                  <!-- <div slot="content">已发布的制度和流程<br>公式：环比增减率：（系统现在已发布的制度流程-上月系统已发布的制度流程）/上月系统运行的制度流程*100%</div> -->
                  <i class="el-icon-question bpaAll-icon" />
                </el-tooltip>
              </div>
              <div class="falRight">风险总数（个）</div>
              <el-row class="falRight">
                <el-col :span="24" class="bpaAll-lczd-boder">
                  <div>匹配流程：30（环比：78%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="78" color="#4387C5"></el-progress>
                  <div>未匹配到流程：2（环比：15.18%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="15.18" color="#4387C5"></el-progress>
                </el-col>
                <div class="bpaAll-lczd-lines" />
              </el-row>
              <div class='wrapper'>
                <div class="inner">
                  <div class='chartRight' id='liquidfill5'></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="bpaAll-lczd">
          <div class="bpaAll-lczd-bottom">
            <div class="bpaAll-zdlcbzh-zx">
              <div class="bpaAll-title">
                | 企业标准
                <el-tooltip placement="bottom">
                  <!-- <div slot="content">已发布的制度和流程<br>公式：环比增减率：（系统现在已发布的制度流程-上月系统已发布的制度流程）/上月系统运行的制度流程*100%</div> -->
                  <i class="el-icon-question bpaAll-icon" />
                </el-tooltip>
              </div>
              <div class="falRight">企业标准总数（个）</div>
              <el-row class="falRight">
                <el-col :span="24" class="bpaAll-lczd-boder">
                  <div>匹配到流程：35（环比：55.67%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="55.67" color="#4387C5"></el-progress>
                  <div>未匹配到流程：15（环比：25.36%）</div>
                  <el-progress :text-inside="true" :stroke-width="15" :percentage="25.36" color="#4387C5"></el-progress>
                </el-col>
                <div class="bpaAll-lczd-lines" />
              </el-row>
              <div class='wrapper'>
                <div class="inner">
                  <div class='chartRight' id='liquidfill6'></div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'
export default {
  data () {
    return {
      number: 80
    }
  },
  computed: {
  },
  mounted () {
    this.drawChart('liquidfill1', 303)
    this.drawChart('liquidfill2', 20)
    this.drawChart('liquidfill3', 20)
    this.drawChart('liquidfill4', 57)
    this.drawChart('liquidfill5', 32)
    this.drawChart('liquidfill6', 50)
  },
  methods: {
    drawChart (eid, num) {
      // 基于准备好的dom，初始化echarts实例
      let chart = echarts.init(document.getElementById(eid))
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
            return ''
            // return '已发布流程' + ': ' + value.name
          }
        },
        series: [{
          type: 'liquidFill',
          name: '', // 系列名称，用于tooltip的显示，legend 的图例筛选
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
                  color: 'rgba(55, 121, 214, 0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(55, 121, 214, .3)'
                }, {
                  offset: 0,
                  color: 'rgba(55, 121, 214, 1)'
                }],
                globalCoord: false
              } // 边框颜色
            }
          },
          // 图形样式
          itemStyle: {
            color: 'rgba(55, 121, 214, 1)', // 水球显示的背景颜色
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
                color: 'rgba(55, 121, 214, 0)'
              }, {
                offset: 0.5,
                color: 'rgba(55, 121, 214, .3)'
              }, {
                offset: 0,
                color: 'rgba(55, 121, 214, 1)'
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
            formatter: function (value) {
              return value.name
            }
          },
          data: [
            { value: 0.5, name: (num + '') }
          ] // 系列中的数据内容数组
        }]
      })
    }
  }
}
</script>

<style scoped lang="scss">
#bpaAll {
  /deep/ .el-select .el-input__inner {
    color: #426193;
    border-radius: 0;
    background-color: #082c62;
    border-color: #009499;
  }
  // .wrapper .inner {
  //   position: absolute;
  //   top: 34%;
  //   left: 16%;
  //   height: 250px;
  //   background-size: 100% 100%;
  // }
  // @media screen and (max-width: 1540px) {
  //   .wrapper .inner {
  //     position: absolute;
  //     top: 20%;
  //     left: 14%;
  //   }
  // }
  // @media screen and (max-width: 1400px) {

  // }
  .wrapper .inner {
    position: absolute;
    top: 0;
    left: 0;
  }
  .wrapper .inner .chartRight {
    width: 250px;
    height: 250px;
    background-size: 80% 80%;
    margin: 10px auto 0;
    // background: url(../../../assets/img/qietu/yuan.gif) no-repeat center bottom;
    // background-size: 80% 80%;
  }
  .add-color {
    color: #00cf8a;
  }
  .red-color {
    color: #f93598;
  }
  .bg-more {
    background: url(../../../assets/img/qietu/bgIndexs.jpg) no-repeat;
    background-size: 100% 100%;
  }
  .bpaAll-title {
    font-weight: bold;
    color: #09eef5;
    font-size: 16px;
  }
  .bpaAll-icon {
    width: 16px;
    height: 16px;
    color: #23aaae;
  }
  .add-float-l {
    float: left;
  }
  .bpaAll-lczd {
    .bpaAll-lczd-bottom {
      .falRight {
        width: 60%;
        float: right;
      }
      .bpaAll-zdlcbzh-zx {
        color: #fff;
        background: url(../../../assets/img/qietu/zdlcbzh-cd.png) no-repeat
          center bottom;
        background-size: 100% 100%;
        height: 230px;
        margin-top: 24px;
        padding: 30px 24px 24px 36px;
        position: relative;
      }
      .bpaAll-lczd-boder {
        border: 1px solid #397ad9;
        padding: 10px;
        margin: 12px 0px;
        height: 163px;
        /deep/ .el-progress {
          margin: 5px 0;
        }
      }
      .bpaAll-lczd-lines {
        width: 28%;
        border-top: 1px solid #397ad9;
        transform: rotate(338deg);
        -webkit-transform: rotate(338deg);
        -moz-transform: rotate(338deg);
        position: absolute;
        top: 16%;
        left: -27%;
      }
      // @media screen and (max-width: 1540px) {
      //   .bpaAll-lczd-lines {
      //     width: 28%;
      //     position: absolute;
      //     top: 59.5%;
      //     left: -26.5%;
      //   }
      // }
      // @media screen and (min-width: 1930px) {
      //   .bpaAll-lczd-lines {
      //     position: absolute;
      //     top: 71%;
      //     left: -26%;
      //   }
      // }
      // @media screen and (max-width: 1400px) {
      //   .bpaAll-lczd-lines {
      //     transform: rotate(325deg);
      //     -webkit-transform: rotate(325deg);
      //     -moz-transform: rotate(325deg);
      //     width: 28%;
      //     position: absolute;
      //     top: 55%;
      //     left: -25%;
      //   }
      // }
    }
  }
}
</style>
<style>
#bpaAll .el-progress-bar .el-progress-bar__outer {
  background-color: #054f8c !important;
}
</style>

