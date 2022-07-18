<template>
  <el-container id="dicenter" class="di__container">
    <el-main class="di__main">
      <el-row :span="24">
        <el-col :span="8" class="di__router-container">
          <router-link
            :to="{path: '/diCenter/home'}"
            class="di__router"
            active-class="active-router"
          >
            <img :src="route.includes('/diCenter/home')?routerActiveImg : routerImg" alt="图片" >
            <span class="absolute">DI首页</span>
          </router-link>
        </el-col>
        <el-col :span="8" class="di__router-container">
          <router-link :to="{name: 'home'}" class="di__router">
            <img :src="routerImg" alt="图片" />
            <span class="absolute">风险评估</span>
          </router-link>
        </el-col>
        <el-col :span="8" class="di__router-container">
          <router-link :to="{name: 'home'}" class="di__router">
            <img :src="routerImg" alt="图片" >
            <span class="absolute">指标库</span>
          </router-link>
        </el-col>
      </el-row>
      <el-row :span="24" class="relative di__routerlist-secondary">
        <img :src="earth" class="plant" alt="星球" >
        <canvas width="810" height="520" id="canvas"></canvas>
        <router-link
          :to="{path: '/diCenter/home'}"
          class="di__router-secondary preview absolute"
          active-class="active-router-secondary"
        >
          <img :src="route.includes('/diCenter/home')?liuchengdituActive : liuchengditu" alt="图片" >
          <span class="absolute">流程一览</span>
        </router-link>
        <router-link
          :to="{path: '/diCenter/map'}"
          class="di__router-secondary map absolute"
          active-class="active-router-secondary"
        >
          <img :src="route.includes('/diCenter/map')?liuchengdituActive : liuchengditu" alt="图片" >
          <span class="absolute">流程地图</span>
        </router-link>
        <router-link
          :to="{path: '/diCenter/performance'}"
          class="di__router-secondary performance absolute"
          active-class="active-router-secondary"
        >
          <img
            :src="route.includes('/diCenter/performance')?liuchengdituActive : liuchengditu"
            alt="图片"
          >
          <span class="absolute">流程绩效</span>
        </router-link>
        <router-link
          :to="{path: '/diCenter/control'}"
          class="di__router-secondary control absolute"
          active-class="active-router-secondary"
        >
          <img
            :src="route.includes('/diCenter/control ')?liuchengdituActive : liuchengditu"
            alt="图片"
          >
          <span class="absolute">内控体系</span>
        </router-link>
        <router-link
          :to="{path: '/diCenter/effect'}"
          class="di__router-secondary effect absolute"
          active-class="active-router"
        >
          <img :src="route.includes('/diCenter/effect')?liuchengdituActive : liuchengditu" alt="图片" >
          <span class="absolute">学习效果</span>
        </router-link>
      </el-row>
    </el-main>
    <el-aside class="di__right di__echart-container" width="500px">
      <el-row class="h25">
        <el-col :span="11" class="di__echart-item h100">
          <el-row class="h100">
            <el-col class="h18 title vertical-middle">
              已发布流程
            </el-col>
            <el-col class="h75 pos-relative">
              <div id="Child5" class="h100" />
              <div class="showCount fontYellow">
                <p>已发布流程</p>
                <p>452</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="11" :offset="1" class="di__echart-item h100">
          <el-col class="h18 title vertical-middle">{{$t()}}流程发布趋势</el-col>
          <el-col class="h75">
            <div id="Child6" class="h100" />
          </el-col>
        </el-col>
      </el-row>
      <el-row class="h25">
        <el-col :span="11" class="di__echart-item h100">
          <el-row class="h100">
            <el-col class="h18 title vertical-middle">流程规划</el-col>
            <el-col class="h75">
              <div id="Child1" class="h100" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="11" :offset="1" class="di__echart-item h100">
          <el-col class="h18 title vertical-middle">在建流程</el-col>
          <el-col class="h75 pos-relative">
            <div id="Child2" class="h100" />
            <div class="showCount">
              <p>待发布流程数据</p>
              <p>123</p>
            </div>
          </el-col>
        </el-col>
      </el-row>
      <el-row class="h25">
        <el-col :span="11" class="di__echart-item h100">
          <el-row class="h100">
            <el-col class="h18 title vertical-middle">流程评分TOP5</el-col>
            <el-col class="h75">
              <div id="Child3" class="h100" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="11" :offset="1" class="di__echart-item h100">
          <el-col class="h18 title vertical-middle">流程评分倒数TOP5</el-col>
          <el-col class="h75">
            <div id="Child4" class="h100" />
          </el-col>
        </el-col>
      </el-row>
      <el-row class="h25">
        <el-col :span="24">
          <div class="di__table">
            <div class="di__table-header">
              <el-row>
                <el-col :span="5">流程名称</el-col>
                <el-col :span="5">发布日期</el-col>
                <el-col :span="5">执行次数</el-col>
                <el-col :span="4">回退次数</el-col>
                <el-col :span="5">流程评分</el-col>
              </el-row>
            </div>
            <div class="di__table-body">
              <el-row v-for="(item, index) in processList" :key="index" :class="index === 1 ?'high-light' : ''">
                <el-col :span="5">{{ item.name }}</el-col>
                <el-col :span="5">{{ item.createDate }}</el-col>
                <el-col :span="5">{{ item.total }}</el-col>
                <el-col :span="4">{{ item.returnNum }}</el-col>
                <el-col :span="5">{{ item.rate }}</el-col>
              </el-row>
            </div>
          </div>
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
import earth from '@/bpa/assets/img/qietu/earth.png'
import liuchengditu from '@/bpa/assets/img/qietu/liuchengditu.png' // 流程一览
import liuchengdituActive from '@/bpa/assets/img/qietu/liuchengyilan_active.png' // 流程一览
import liuchengxuexixiaoguo from '@/bpa/assets/img/qietu/liuchengxuexixiaoguo.png'
import initCanvas from './initCanvas.js'
export default {
  name: 'BpaDi',
  data() {
    return {
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      earth,
      liuchengditu: liuchengditu,
      liuchengdituActive: liuchengdituActive,
      liuchengxuexixiaoguo: liuchengxuexixiaoguo
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
    processTrend() {
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
    processLine() {
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
          left: '5%',
          top: '-5%',
          right: '1%',
          bottom: '8%',
          containLabel: true
        },

        xAxis: {
          type: 'value',
          show: false,
          position: 'top',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false,
              alignWithLabel: false,
              length: 5
            },
            splitLine: {
              // 网格线
              show: false
            },
            inverse: 'true', // 排序
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            data: ['1.0战略管理', '2.0综合计划管理', '3.0预算管理', '4.0投资管理', '7.0财务管理']
          }
        ],
        series: [
          {
            name: '能耗值',
            type: 'bar',
            itemStyle: {
              normal: {
                show: true,
                color: function(params) {
                  const num = colorArray.length
                  return {
                    type: 'linear',
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
                },
                barBorderRadius: 70,
                borderWidth: 0,
                borderColor: '#333'
              }
            },
            barGap: '0%',
            barCategoryGap: '50%',
            data: [60, 132, 89, 134, 60]
          }
        ]
      }
    },
    route() {
      return this.$route.fullPath
    },
    processList() {
      return [
        {
          name: '1.0战略管理',
          createDate: '2019-09-04',
          total: '2',
          returnNum: '2',
          rate: '97'
        },
        {
          name: '19.0审计管理',
          createDate: '2019-09-04',
          total: '2',
          returnNum: '2',
          rate: '97'
        },
        {
          name: '3.0预算管理',
          createDate: '2019-09-04',
          total: '2',
          returnNum: '2',
          rate: '97'
        },
        {
          name: '4.0投资管理',
          createDate: '2019-09-04',
          total: '2',
          returnNum: '2',
          rate: '97'
        },
        {
          name: '7.0财务管理',
          createDate: '2019-09-04',
          total: '2',
          returnNum: '2',
          rate: '97'
        }
      ]
    }
  },
  mounted() {
    this.lineFun('Child1')
    this.lineFun('Child2')
    this.lineFun('Child3')
    this.lineFun('Child4')
    this.lineFun('Child5')
    this.lineFun('Child6')
    initCanvas()
  },
  methods: {
    // 曲线图形成
    lineFun(id) {
      const self = this
      const dom = document.getElementById(id)
      const firstChild = echarts.init(dom)
      this.$nextTick(() => {
        switch (true) {
          case id === 'Child1':
            firstChild.setOption(self.processPublished, true)
            break
          case id === 'Child6':
            firstChild.setOption(self.processTrend, true)
            break
          case id === 'Child5':
            firstChild.setOption(self.processPlan, true)
            break
          case id === 'Child2':
            firstChild.setOption(self.processTop, true)
            break
          default :
            firstChild.setOption(self.processLine, true)
            break
        }

      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .di {
    &__container {
      width: 100%;
      height: 100%;
      position: fixed;
      color: #fff;
      background: url("../../../assets/img/qietu/beijing.png") no-repeat 100% 100%;
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
        left: 128px;
        top: 18px;
      }
    }
    &__router {
      padding-left: 30px;
      /*background: url("") no-repeat;*/
      background-size: 100% 100%;
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
    &__table{
      text-align: center;
      font-size: 14px;
    }
    &__table-header{
      background-color: #10182D;
      color: #3ad1fc;
      padding: 5px 5px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    &__table-body{
      background-color: #0F2645;
      color: #38919f;
      opacity: .7;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      >div{
        padding:3px 5px;
      }
      .high-light{
        color: #f4706c;
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
</style>

