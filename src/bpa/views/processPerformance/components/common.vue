<template>
    <el-row class="w100 h100">
        <el-col :span="6" class="h100 leftpart">
            <div class="content w100">
                <h6>{{$t("procurementPlanningEfficiency")}}</h6>
                <div class="h100 text-center chartHeight">
                    <div class="charts inline-block" ref="purchaseChart"></div>
                    <div class="pos-relative w80px inline-block h100">
                        <el-progress class="inline-block" type="circle" :stroke-width="12" :percentage="80" :width="80"></el-progress>
                    </div>
                </div>
            </div>
            <div class="content w100">
                <h6>{{$t("unloadingEfficiency")}}</h6>
                <div class="h100 text-center chartHeight">
                    <div class="charts inline-block" ref="goodsChart"></div>
                    <div class="pos-relative w80px inline-block h100">
                        <el-progress class="inline-block" type="circle" :stroke-width="12" :percentage="80" :width="80"></el-progress>
                    </div>
                </div>
            </div>
            <div class="content w100">
                <h6>{{$t("qualityInspectionEfficiency")}}</h6>
                <div class="h100 text-center chartHeight">
                    <div class="charts inline-block" ref="qualityChart"></div>
                    <div class="pos-relative w80px inline-block h100">
                        <el-progress class="inline-block" type="circle" :stroke-width="12" :percentage="80" :width="80"></el-progress>
                    </div>
                </div>
            </div>
        </el-col>
        <el-col :span="12" class="h100">
            <slot></slot>
        </el-col>
        <el-col :span="6" class="h100 rightpart">
            <div class="content w100">
                <h6>{{$t("storageEfficiency")}}</h6>
                <div class="h100 text-center chartHeight">
                    <div class="charts inline-block" ref="storeChart"></div>
                    <div class="pos-relative w80px inline-block h100">
                        <el-progress class="inline-block" type="circle" :stroke-width="12" :percentage="80" :width="80"></el-progress>
                    </div>
                </div>
            </div>
            <div class="content w100">
                <h6>{{$t("efficiencyOfPurchaseSettlement")}}</h6>
                <div class="h100 text-center chartHeight">
                    <div class="charts inline-block" ref="sumChart"></div>
                    <div class="pos-relative w80px inline-block h100">
                        <el-progress class="inline-block" type="circle" :stroke-width="12" :percentage="80" :width="80"></el-progress>
                    </div>
                </div>
            </div>
            <div class="content w100">
                <h6>{{$t("financialPaymentEfficiency")}}</h6>
                <div class="h100 text-center chartHeight">
                    <div class="charts inline-block" ref="profitChart"></div>
                    <div class="pos-relative w80px inline-block h100">
                        <el-progress class="inline-block" type="circle" :stroke-width="12" :percentage="80" :width="80"></el-progress>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import textGradient from '@/bpa/components/textGradient.vue'
import thirdpart from '../processPerformance/components/thirdpart'
import echarts from 'echarts'
import $ from 'jquery'
export default {
  name: 'common',
  components: {
    textGradient,
    thirdpart
  },
  data() {
    return {
    }
  },
  computed: {
    options() {
      return {
        series: [
          {
            name: '',
            type: 'gauge',
            radius: '98%',
            center: ['50%', '50%'],
            title: {
              show: false
            },
            pointer: {
              length: '65%',
              width: 6,
              color: '#fff'
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#08112e'
                  },
                  {
                    offset: 1,
                    color: '#3386d8'
                  }
                ]
              )
            },
            detail: {
              formatter: '{value}h',
              offsetCenter: [0, '60%'],
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold'
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 6,
                color: [
                  [0.3, '#42cdfb'],
                  [0.7, '#314bb9'],
                  [1, '#d73145']
                ]
              }
            },
            axisLabel: {
              show: true,
              distance: 0,
              color: '#3dd5eb',
              fontSize: '12'
            },
            axisTick: {
              length: 9,
              lineStyle: {
                color: 'auto'
              }
            },
            splitLine: {
              length: 12,
              lineStyle: {
                color: 'auto'
              }
            },
            data: [{
              value: 50,
              name: '订单及时率'
            }]
          }
        ]
      }
    }
  },
  mounted () {
    this.getBar()
    this.modifyBar()
  },
  methods: {
    // 修改element-ui中的进度条成渐变色
    modifyBar () {
      let aaa = `<defs>
            <linearGradient id="greenGradient">
                <stop offset="0" stop-color="#18e3f4" />
                <stop offset="100%" stop-color="#0f67c6" />
            </linearGradient>
        </defs>`
      $('.el-progress-circle svg').html(aaa + $('.el-progress-circle svg').html())
    },
    getBar () {
      let purchaseChart = echarts.init(this.$refs.purchaseChart)
      purchaseChart.setOption(this.options, true)
      let goodsChart = echarts.init(this.$refs.goodsChart)
      goodsChart.setOption(this.options, true)
      let qualityChart = echarts.init(this.$refs.qualityChart)
      qualityChart.setOption(this.options, true)
      let storeChart = echarts.init(this.$refs.storeChart)
      storeChart.setOption(this.options, true)
      let sumChart = echarts.init(this.$refs.sumChart)
      sumChart.setOption(this.options, true)
      let profitChart = echarts.init(this.$refs.profitChart)
      profitChart.setOption(this.options, true)
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
.content{
    height: calc(33% - 9px);
    margin-bottom: 18px;
    padding: 0 29px;
    background: url('../../../assets/img/bg-Img3.png') center center no-repeat;
    background-size: 100% 100%;
    .chartHeight {
        height: calc(100% - 40px);
        /deep/ .el-progress{
            position: absolute;
            bottom: 15%;
            left: 0;
            path:nth-of-type(1) {
                stroke: #1a4a70;
            }
            path:nth-of-type(2) {
                stroke: url(#greenGradient);
            }
            .el-progress__text {
                font-size: 18px!important;
                color: #fff;
            }
        }
    }
    .w80px {
        width: 80px;
    }
    .charts {
      width: 60%;
      max-width: 160px;
      height: 100%;
    }
}
</style>
