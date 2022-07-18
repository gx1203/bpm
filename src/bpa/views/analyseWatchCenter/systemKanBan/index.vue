<template>
  <div id="bpaAnalysis" class="w100 bpaAnalysis">
    <div>
      <system-process
        :system="
          $store.state.userInfo.systemId
            ? $store.state.userInfo.systemId
            : systemId
        "
        @systemId="getSystemId"
      />
    </div>
    <el-row :gutter="30" style="padding-bottom:20px;">
      <el-col :span="24">
        <div class="chartsBg1">
          <h4 class="pieTitle">
            制度运行情况
            <el-tooltip
              content="制度框架下在行制度数量和历史版本数量"
              placement="bottom"
            >
              <img
                src="../../../assets/img/systemKanBan/process_top_icon.png"
                alt
              />
            </el-tooltip>
          </h4>
          <div class="operationEcharts">
            <div ref="systemOperation" class="w100 h100 processBar"></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="30" style="padding-bottom:20px;">
      <el-col :span="24">
        <div class="chartsBg1">
          <h4 class="pieTitle">
            制度接收阅读情况
            <el-tooltip
              content="描述统计制度框架下制度可查看人数、已查看人数和查看百分比"
              placement="bottom"
            >
              <img
                src="../../../assets/img/systemKanBan/process_top_icon.png"
                alt
              />
            </el-tooltip>
            <span class="details">
              <a @click="toDetails('read')">查看更多></a>
            </span>
          </h4>
          <div class="operationEcharts">
            <div ref="systemAcceptReading" class="w100 h100 processBar"></div>
          </div>
        </div>
      </el-col>
    </el-row> -->
    <el-row :gutter="20" style="padding-bottom:40px;">
      <!-- <el-col :span="12">
        <div class="chartsBg">
          <h4 class="pieTitle">
            组织阅读情况
            <el-tooltip
              content="累计统计各条线下组织阅读情况"
              placement="bottom"
            >
              <img
                src="../../../assets/img/systemKanBan/process_top_icon.png"
                alt
              />
            </el-tooltip>
            <span class="details">
              <a @click="toDetails('Lines')">查看更多></a>
            </span>
          </h4>
          <div class="operationEcharts">
            <div ref="systemReading" class="w100 positionBar"></div>
          </div>
        </div>
      </el-col> -->
      <el-col :span="12">
        <div class="chartsBg">
          <h4 class="pieTitle">
            制度未匹配到流程情况
            <el-tooltip content="制度未匹配到流程分布情况" placement="bottom">
              <img
                src="../../../assets/img/systemKanBan/process_top_icon.png"
                alt
              />
            </el-tooltip>
            <span class="details">
              <a @click="toDetails('Unmatched')">查看更多></a>
            </span>
          </h4>
          <div class="operationEcharts">
            <div class>
              <div ref="systemNotMatchProcess" class="w100 processBar1"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import $ from 'jquery'
import 'echarts-liquidfill'
import systemProcess from './systemProcess.vue'
import { formatDate, getMonthDays } from '@/bpa/utils/common.js'
// 接口请求部分
import {
  queryRegulationReceivedAndReadCondition,
  queryRegulationRunCondition,
  // queryRegulationLineReadCondition,
  queryRegulationNotMatchModelCondition
} from '@/bpa/api/systemKanBan'

export default {
  name: 'systemKanBan',
  components: {
    systemProcess
  },
  data() {
    return {
      searchForm: {
        systemFramework: '1',
        systemId: ''
      },
      systemId: '',
      getProcessAddData: [],
      weekUpdateData: {},
      weekAddData: {},
      readingDate: [],
      startTime: '',
      processendTime: '',
      processstartTime: '',
      props: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        multiple: true
      },
      headerList: [
        {
          num: '0',
          name: '已发布制度',
          ico: 'el-icon-s-promotion',
          color: '#06abb9',
          title: '已发布制度'
        },
        {
          num: '0',
          name: '审批中制度',
          ico: 'el-icon-connection',
          color: '#b35141',
          title: '审批中制度'
        },
        {
          num: '0',
          name: '失效制度',
          ico: 'el-icon-s-custom',
          color: '#019874',
          title: '失效制度'
        },
        {
          num: '0',
          name: '未匹配到流程',
          ico: 'el-icon-copy-document',
          color: '#b37e11',
          title: '未匹配到流程'
        },
        {
          num: '0',
          name: '匹配到流程',
          ico: 'el-icon-crop',
          color: '#3577c0',
          title: 'BPA已发布流程的线上节点总数'
        }
      ],
      getDateData: 'year',
      processValue: [],
      value1: '',
      options: [],
      processValues: '',
      value: ''
    }
  },
  computed: {
    pId() {
      // return process.env.NODE_ENV !== 'production' ? '10603' : '10561'
      return '5'
    }
  },
  mounted() {
    this.queryRegulationRunCondition()
    this.queryRegulationReceivedAndReadCondition()
    // this.queryRegulationLineReadCondition() // 制度条线阅读情况
    this.queryRegulationNotMatchModelCondition()
  },
  methods: {
    toDetails(type) {
      var routerList = {
        read: '/analyseWatchCenter/bpa/systemKanBan/SystemDetails',
        Lines: '/analyseWatchCenter/bpa/systemKanBan/SystemLinesDetails',
        Unmatched: '/analyseWatchCenter/bpa/systemKanBan/SystemUnmatchedDetails'
      }
      this.$router.push({
        path: routerList[type],
        query: {
          id: this.$store.state.userInfo.systemId
            ? this.$store.state.userInfo.systemId
            : this.systemId === ''
            ? this.pId
            : this.systemId
        }
      })
    },
    // 选择的制度框架id
    getSystemId(val) {
      this.systemId = val
      this.queryRegulationRunCondition()
      this.queryRegulationReceivedAndReadCondition()
      // this.queryRegulationLineReadCondition() // 制度条线阅读情况
      this.queryRegulationNotMatchModelCondition()
    },
    // 制度运行情况
    queryRegulationRunCondition() {
      queryRegulationRunCondition(
        this.$store.state.userInfo.systemId
          ? this.$store.state.userInfo.systemId
          : this.systemId === ''
          ? this.pId
          : this.systemId
      ).then(res => {
        if (!res) return false
        const stateList = res.map(item => item.name)
        const goodValueList = res.map(item => item.goodVersionNums)
        const revisionValueList = res.map(item => item.revisionNums)
        const processTrend = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            show: true,
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            right: 10,
            data: [
              {
                name: '在行版本',
                textStyle: {
                  fontSize: 12, // 字体大小
                  color: '#09EEF5'
                }
              },
              {
                name: '历史版本',
                textStyle: {
                  fontSize: 12, // 字体大小
                  color: '#196EFF'
                }
              }
            ]
          },
          grid: {
            left: '5%',
            // top: '-5%',
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
              color: '#00c7ff'
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
              show: true,
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
              color: '#00c7ff',
              interval: 0,
              rotate: 40
            },
            data: stateList
          },
          series: [
            {
              name: '在行版本',
              type: 'bar',
              stack: '条',
              barWidth: '20%',
              label: {
                show: false,
                position: 'insideRight'
              },
              itemStyle: {
                normal: {
                  color: '#09EEF5'
                }
              },
              data: goodValueList
            },
            {
              name: '历史版本',
              type: 'bar',
              stack: '条',
              barWidth: '20%',
              label: {
                show: false,
                position: 'insideRight'
              },
              itemStyle: {
                normal: {
                  color: '#196EFF'
                }
              },
              data: revisionValueList
            }
          ]
        }
        let firstChild = echarts.init(this.$refs.systemOperation)
        firstChild.setOption(processTrend)
        firstChild.resize()
      })
    },
    // 制度接收阅读情况
    queryRegulationReceivedAndReadCondition() {
      queryRegulationReceivedAndReadCondition(
        this.$store.state.userInfo.systemId
          ? this.$store.state.userInfo.systemId
          : this.systemId === ''
          ? this.pId
          : this.systemId
      ).then(res => {
        if (!res) return false
        var reg = new RegExp('%', 'g')
        const stateList = res.map(item => item.name)
        const goodValueList = res.map((item, index) => {
          return {
            value1: item.canViewUser,
            value: 100 - item.viewRate.replace(reg, '')
          }
        })
        const revisionValueList = res.map((item, index) => {
          return {
            value2: item.canViewUser,
            value3: 100 - item.viewRate.replace(reg, ''),
            value1: item.viewedUser,
            value: item.viewRate.replace(reg, '')
          }
        })
        const processTrend = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            show: true,
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function(params) {
              var res =
                '<div>' +
                params[0].name +
                '</div>' +
                '<div>' +
                '<span>可查看人：</span>' +
                params[0].data.value2 +
                '</div>' +
                '<div><span>已查看人：</span>' +
                params[0].data.value1 +
                '(' +
                params[0].data.value +
                '%)' +
                '</div>'
              return res
            }
          },
          legend: {
            right: 10,
            data: [
              {
                name: '可查看人',
                textStyle: {
                  fontSize: 12, // 字体大小
                  color: '#09EEF5'
                }
              },
              {
                name: '阅读率',
                textStyle: {
                  fontSize: 12, // 字体大小
                  color: '#196EFF'
                }
              }
            ]
          },
          grid: {
            left: '5%',
            // top: '-5%',
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
              color: '#00c7ff',
              formatter: '{value} %'
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
              show: true,
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
              color: '#00c7ff',
              interval: 0,
              rotate: 40
            },
            data: stateList
          },
          series: [
            // {
            //   name: '可查看人',
            //   type: 'bar',
            //   stack: '条',
            //   barWidth: '20%',
            //   label: {
            //     show: false,
            //     position: 'insideRight'
            //   },
            //   itemStyle: {
            //     normal: {
            //       color: '#09EEF5'
            //     }
            //   },
            //   data: goodValueList
            // },
            {
              name: '阅读率',
              type: 'bar',
              stack: '条',
              barWidth: '20%',
              label: {
                show: true,
                position: 'top',
                color: '#fff',
                formatter: function(params) {
                  return params.data.value + '%'
                }
              },
              itemStyle: {
                normal: {
                  color: '#196EFF'
                }
              },
              data: revisionValueList
            }
          ]
        }
        let firstChild = echarts.init(this.$refs.systemAcceptReading)
        firstChild.setOption(processTrend)
        firstChild.resize()
      })
    },
    // 制度条线阅读情况
    queryRegulationLineReadCondition() {
      const firstChild = echarts.init(this.$refs.systemReading)
      queryRegulationLineReadCondition(
        this.$store.state.userInfo.systemId
          ? this.$store.state.userInfo.systemId
          : this.systemId === ''
          ? this.pId
          : this.systemId
      ).then(res => {
        if (!res) return false
        res.sort(this.applicationStort)
        res.splice(10)
        const nameList = res.map(item => item.line)
        const countList = res.map(item => item.lineViewedUser)
        var option = {
          color: ['#08eff4'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            // data: ['2011年']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '6%',
            top: '2%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                type: 'none'
                // color: '#6EEBFF',
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#1f4771'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#00c7ff'
              }
            },
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            inverse: true, // 倒叙
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#1f4771'
              }
            },
            axisLine: {
              lineStyle: {
                type: 'none'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 14,
                color: '#00c7ff'
              }
            },
            data: nameList
          },
          series: [
            {
              // name: '2011年',
              type: 'bar',
              barWidth: 14,
              label: {
                normal: {
                  position: 'right',
                  show: true,
                  textStyle: {
                    fontWeight: 'bolder',
                    fontSize: '12',
                    fontFamily: '微软雅黑',
                    color: '#00c7ff'
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: '#0A87C4'
                }
              },
              data: countList
            }
          ]
        }
        firstChild.on('click', param => {
          const routes = this.$router.resolve({
            path: '/analyseWatchCenter/bpa/systemKanBan/SystemLinesDetails',
            query: {
              id: this.$store.state.userInfo.systemId
                ? this.$store.state.userInfo.systemId
                : this.systemId === ''
                ? this.pId
                : this.systemId,
              word: param.name
            }
          })
          window.open(routes.href, '_self')
        })
        firstChild.setOption(option)
      })
    },
    // 制度未匹配到流程情况
    queryRegulationNotMatchModelCondition() {
      console.log(111)
      const firstChild = echarts.init(this.$refs.systemNotMatchProcess)
      queryRegulationNotMatchModelCondition(
        this.$store.state.userInfo.systemId
          ? this.$store.state.userInfo.systemId
          : this.systemId === ''
          ? this.pId
          : this.systemId
      ).then(res => {
        console.log('你好', res)
        if (!res.length) return false
        let numAll = 0
        const resData = [] // 展示
        const resDataCenter = []
        const colorData = [
          '#45FFF8',
          '#0BEBBE',
          '#00C9FF',
          '#0BEBBE',
          '#0086FF',
          '#0E5BD1',
          '#0E3CD1',
          '#2513CC',
          '#a1c4fd',
          '#c2e9fb',
          '#84fab0',
          '#8fd3f4',
          '#8fd3f4',
          '#6e45e2',
          '#8ec5fc',
          '#4facfe',
          '#00f2fe',
          '#64b3f4',
          '#330867',
          '#89f7fe',
          '#66a6ff',
          '#9890e3',
          '#b1f4cf',
          '#009efd',
          '#fff1eb',
          '#accbee',
          '#e7f0fd'
        ]
        res.forEach((item, index) => {
          if (item.notMatchCount) {
            numAll += item.notMatchCount
          }
          if (item.notMatchCount !== 0) {
            resData.push({
              name: item.name,
              value: item.notMatchCount,
              itemStyle: {
                color: colorData[index],
                borderWidth: 4,
                borderColor: colorData[index]
              }
            })
          }
          resDataCenter.push({
            name: item.name,
            value: item.notMatchCount,
            itemStyle: {
              color: colorData[index],
              borderWidth: 2,
              borderColor: colorData[index]
            }
          })
        })
        const nameList = res.map(item => item.name)
        var option = {
          title: {
            text: numAll + '\n合计',
            left: 'center',
            top: '43%',
            textStyle: {
              color: '#FFFFFF',
              fontSize: 16,
              lineHeight: 24
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: function(param) {
              if (!param.name) {
                return param.seriesName + ': ' + param.value
              } else {
                return param.name + ': ' + param.value
              }
            }
          },
          legend: {
            show: false,
            orient: 'vertical',
            left: 10,
            data: nameList
          },
          series: [
            {
              name: '合计',
              type: 'pie',
              selectedMode: false,
              radius: [0, '30%'],
              center: ['50%', '52%'],
              label: {
                position: 'inner'
              },
              labelLine: {
                show: false
              },
              data: [
                { value: numAll, name: '', itemStyle: { color: '#0E5BD1' } }
              ]
            },
            {
              name: '未匹配占比',
              type: 'pie',
              clockWise: false, // 顺时加载
              hoverAnimation: false, // 鼠标移入变大
              center: ['50%', '52%'],
              radius: ['52%', '52%'],
              minAngle: 30,
              avoidLabelOverlap: true,
              label: {
                formatter: '{b|{b}：}{c} {abg|}\n{hr|}\n   占比： {per|{d}%}  ',
                rich: {
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 1,
                    height: 1
                  },
                  abg: {
                    color: '#09E4ED',
                    fontSize: 18
                  },
                  b: {
                    color: '#FFFFFF',
                    fontSize: 14,
                    lineHeight: 16
                  },
                  per: {
                    color: '#09EEF5',
                    // backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2,
                    fontSize: 12
                  }
                }
              },
              // data: [{
              //   value: 9,
              //   name: '',
              //   itemStyle: {
              //     normal: {
              //       borderWidth: 2,
              //       borderColor: '#0b5263'
              //     }
              //   }
              // }]
              data: resData
            },
            {
              name: '未匹配数量',
              type: 'pie',
              radius: ['35%', '45%'],
              center: ['50%', '52%'],
              label: {
                show: false
              },
              data: resDataCenter
            }
          ]
        }
        firstChild.setOption(option)
      })
    },
    // 排序倒序
    applicationStort(a, b) {
      return b.lineViewedUser - a.lineViewedUser
    },
    getRandomColor() {
      var r = Math.floor(Math.random() * 256)
      var g = Math.floor(Math.random() * 256)
      var b = Math.floor(Math.random() * 256)
      var rgb = '(' + r + ',' + g + ',' + b + ')'
      return rgb
    }
  }
}
</script>

<style scoped lang="scss">
#bpaAnalysis {
  color: #09eef5;
  .operationEcharts {
    width: 100%;
    // height: 500px;
  }
  .hide {
    display: none;
  }
  .tipname {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    max-width: 400px;
    padding: 5px;
    z-index: 1;
    color: #fff;
  }
  .padding10 {
    padding-top: 60px;
    margin-left: 50px;
  }
  .up {
    color: #019774;
    font-size: 14px;
    margin: 0 2px;
  }
  .dec {
    font-size: 14px;
    color: #fe6d4c;
    margin: 0 2px;
  }
  .processNum {
    display: flex;
    justify-content: space-around;
  }
  .num {
    font-size: 30px;
    color: #0de8f7;
  }
  .processName {
    font-size: 16px;
  }
  .processBar {
    width: 100%;
    height: 500px;
  }
  .processBar1 {
    height: 382px;
    margin-bottom: 10px;
  }
  .positionBar {
    // padding-top: 40px;
    height: 370px;
  }
  .process {
    text-align: right;
    margin-bottom: 14px;
    margin-right: 14px;
  }
  .datePicker {
    padding: 10px;
    margin-left: 80px;
  }
  .chartsBg {
    position: relative;
    background: url('../../../assets/img/qietu/gangwei.png') no-repeat;
    background-size: 100% 100%;
    height: 372px;
    padding: 26px 36px 24px 36px;
  }
  .chartsBg1 {
    height: 540px;
    position: relative;
    background: url('../../../assets/img/qietu/zdlcbzh-cd.png') no-repeat;
    background-size: 100% 100%;
    padding: 24px 36px;
    .operationEcharts {
      padding: 10px 32px;
    }
  }
  .pieTitle {
    color: #09eef5 !important ;
    border-left: 3px solid #09eef5;
    font-size: 16px;
    padding-left: 10px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
    .details {
      float: right;
      a {
        width: auto;
        line-height: 20px;
        display: inline-block;
        color: #23aaae;
        font-size: 14px;
        text-decoration: underline;
      }
    }
  }
  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  p.common-part {
    padding: 15px 10px;
    width: 60%;
    margin: 0 auto;
    span:nth-of-type(1) {
      line-height: 40px;
    }
    span {
      display: block;
      text-align: center;
    }
    span:nth-of-type(2) {
      cursor: pointer;
    }
    span:nth-of-type(2):hover {
      color: #4a9bfb;
    }
  }
  .border-bottom1 {
    border-bottom: 1px solid #e6e6e6;
  }
  .fontRed {
    color: #f8704c;
  }
  .fontBlue {
    color: #6aaeff;
  }
  .fontLightBlue {
    color: #4cd6a0;
  }
  .pblish-i {
    position: absolute;
    top: 11px;
    right: 0;
    padding-right: 2px;
    padding-left: 60px;
  }
  .pblish-i1 {
    top: 5px;
  }
  .colorC {
    color: #ccc;
  }
  .titlehover {
    cursor: pointer;
    color: #4a9bfb;
  }
  .titlehover:hover {
    color: #3e7dca;
  }
}
</style>
