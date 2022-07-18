<template>
    <el-row class="w100 h100">
        <el-col :span="18" class="h100 leftpart">
            <div class="content w100 h100">
                <h6>采购人效分析</h6>
                <div class="clear-fix margin-b20">
                  <el-button class="float-r active margin-l15" type="primary">报表分析</el-button>
                  <el-button class="float-r margin-l15" type="primary">结算文员执行效率排名</el-button>
                  <el-button class="float-r remove-margin-l" type="primary">采购员执行效率排名</el-button>
                </div>
                <div class="charts" ref="barChart"></div>
            </div>
        </el-col>
        <el-col :span="6" class="h100 rightpart">
          <div class="content w100 h100">
            <h6>岗位参与度排名</h6>
            <div class="commonContent">
              <div class="common" v-for="(item, index) in 10" :key="index">
                <div class="text inline-block">
                  <span class="inline-block">{{index + 1}}</span>
                  <p :title="'人事经理'">人事经理</p>
                </div>
                <p class="inline-block number" :title="changeShow(7778888)">{{changeShow(7778888)}}</p>
              </div>
            </div>
            <div class="clear-fix more">
               <router-link :to="''" class="float-r">查看更多 > </router-link>
            </div>
          </div>
        </el-col>
    </el-row>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'forth',
  data() {
    return {
    }
  },
  computed: {
    options() {
      return {
        grid: {
          top: '22%',
          bottom: '4%',
          left: '3%',
          right: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          }
        },
        legend: {
          data: ['采购数量', '采购入库数量', '采购金额'],
          top: 0,
          left: 'right',
          itemGap: 60,
          textStyle: {
            color: '#ffffff'
          }
        },
        xAxis: {
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#10266b'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '采购数量',
            nameTextStyle: {
              color: '#fff'
            },
            splitLine: {
              lineStyle: {
                color: '#10266b'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#10266b'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          },
          {
            type: 'value',
            name: '采购入库数量',
            nameTextStyle: {
              color: '#fff'
            },
            position: 'right',
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#10266b'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '采购金额',
            type: 'line',
            yAxisIndex: 1,
            symbol: 'emptyCircle',
            legendHoverLink: false,
            symbolSize: 10,
            itemStyle: {
              color: '#15c0ce'
            },
            lineStyle: {
              color: '#15c0ce'
            },
            data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5, 5, 8, 9, 6]
          },
          {
            name: '采购数量',
            type: 'bar',
            yAxisIndex: 0,
            barGap: '50%',
            barWidth: 15,
            itemStyle: {
              normal: {
                color: '#17cdda',
                barBorderRadius: 2
              }
            },
            data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5, 9, 8, 10, 11]
          },
          {
            name: '采购入库数量',
            type: 'bar',
            yAxisIndex: 0,
            barWidth: 15,
            barGap: '50%',
            itemStyle: {
              normal: {
                color: '#2941a2',
                barBorderRadius: 2
              }
            },
            data: [4.2, 3.8, 4.8, 3.5, 2.9, 2.8, 3, 5, 10, 29, 18, 11]
          }
        ]
      }
    }
  },
  mounted () {
    this.getBar()
  },
  methods: {
    getBar () {
      let barChart = echarts.init(this.$refs.barChart)
      barChart.setOption(this.options, true)
    },
    changeShow (num) {
      if ((num.toString()).indexOf('.') === -1) {
        return (num.toString()).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
      }
      return (num.toFixed(2).toString()).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    }
  }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.inline-block{
  display: inline-block;
  vertical-align: top;
}
h6 {
    font-size: 16px;
    color: #a9ddee;
    font-weight: 100;
    line-height: 38px;
}
.leftpart{
    padding-right: 9px;
    .content{
        padding: 0 29px;
        background: url('../../../../assets/img/bg-Img1.png') center center no-repeat;
        background-size: 100% 100%;
    }
    .margin-l15 {
      margin-left: 15px;
    }
    .el-button {
      background-color: #101f55;
      border-radius: 0;
      border-color: #4273c8;
      &.active {
        background-color: #2041a3;
      }
    }
    .charts {
      height: calc(100% - 115px);
    }
}
.rightpart {
  padding-left: 9px;
  .content{
    padding: 0 29px;
    background: url('../../../../assets/img/singleRight.png') center center no-repeat;
    background-size: 100% 100%;
    .commonContent {
      margin-top: 5px;
      width: 100%;
      height: calc(100% - 80px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      justify-content: space-between;
    }
    .common {
      width: 100%;
      overflow: hidden;
      height: 8%;
      color: #299dff;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      border: 1px solid #3d4c6b;
      background: linear-gradient(to right, #1e4667 0%,#0c163b 100%);
      .text {
        flex: 1;
        position: relative;
        overflow: hidden;
        padding-left: 35px;
        span {
          position: absolute;
          left: 10px;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background-color: #047fd4;
          color: #fff;
          text-align: center;
          line-height: 19px;
        }
        p {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .number {
        padding-right: 15px;
        width: 100px;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .more {
      margin-top: 8px;
      /deep/ a {
        color: #19f1f9;
      }
    }
  }
}
</style>
