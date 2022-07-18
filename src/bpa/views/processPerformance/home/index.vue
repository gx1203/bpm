<template>
    <div class="detail">
        <div class="showTitle">
            <el-row :gutter="256">
                <el-col :span="12">
                    <div class="float-r clear-fix inline-block">
                        <el-button type="primary">{{$t("thisMonth")}}</el-button>
                        <el-button class="margin-l20" type="primary">{{$t("thisQuarter")}}</el-button>
                        <el-button class="margin-l20 active" type="primary">{{$t("thisYear")}}</el-button>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="selector">
                        <el-select clearable v-model="value" :placeholder="selectArea" :title="selectArea">
                            <el-option
                            label="1"
                            value="1">
                            </el-option>
                        </el-select>
                        <el-select clearable v-model="value" :placeholder="selectSubsidiary" :title="selectSubsidiary">
                            <el-option
                            label="1"
                            value="1">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="content1">
            <common>
                <div class="w100 h100">
                    <div class="centerTitle">
                        <span>{{$t("procurementExecutionEfficiency")}}</span>
                    </div>
                    <ul class="showHour">
                        <li>0</li>
                        <li>0</li>
                        <li>3</li>
                        <li>,</li>
                        <li>6</li>
                        <li>9</li>
                        <li>8</li>
                        <li>.</li>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                    <div class="chartContent" ref="centerChart">

                    </div>
                </div>
            </common>
        </div>
    </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'
import common from './../components/common.vue'
export default {
  components: {
    common
  },
  data() {
    return {
      value: '',
      selectArea:this.$t("placeholderText.selectArea"),
      selectSubsidiary:this.$t("placeholderText.selectSubsidiary"),
    }
  },
  computed: {
    processPlan() {
      return {
        title: {
          text: ''
        },
        series: [
          {
            type: 'liquidFill',
            data: [0.4, 0.4, 0.4],
            center: ['50%', '30%'],
            radius: '33%',
            shape: 'circle',
            outline: {
              show: false
            },
            backgroundStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.7,
                colorStops: [{
                  offset: 0,
                  color: '#2d4490'
                }, {
                  offset: 1,
                  color: '#1667a7'
                }],
                globalCoord: false
              },
              shadowColor: '#1667a7',
              shadowBlur: 4
            },
            label: {
              show: true,
              color: '#00fff6',
              fontSize: '200%',
              formatter: (data) => {
                return '22\n\n' + this.$t("KPIIndex")
              }
            },
            color: ['rgba(33, 156, 168, .3)', 'rgba(33, 156, 168, .5)', 'rgba(33, 156, 168, 1)']
          },
          {
            type: 'liquidFill',
            data: [0.4, 0.4, 0.4],
            center: ['20%', '70%'],
            radius: '40%',
            shape: 'circle',
            outline: {
              show: false
            },
            backgroundStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.7,
                colorStops: [{
                  offset: 0,
                  color: '#12295f'
                }, {
                  offset: 1,
                  color: '#2a49b7'
                }],
                globalCoord: false
              },
              shadowColor: '#2a49b7',
              shadowBlur: 4
            },
            label: {
              show: true,
              color: '#7eafff',
              fontSize: '230%',
              formatter: (data) => {
                return '22\n\n' + this.$t("benchmarkingAnalyze")
              }
            },
            color: ['rgba(58, 138, 245, .3)', 'rgba(58, 138, 245, .5)', 'rgba(58, 138, 245, 1)']
          },
          {
            type: 'liquidFill',
            data: [0.4, 0.4, 0.4],
            center: ['80%', '80%'],
            radius: '40%',
            shape: 'circle',
            outline: {
              show: false
            },
            backgroundStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.7,
                colorStops: [{
                  offset: 0,
                  color: '#121d48'
                }, {
                  offset: 1,
                  color: '#167082'
                }],
                globalCoord: false
              },
              shadowColor: '#167082',
              shadowBlur: 4
            },
            label: {
              show: true,
              color: '#18d3d1',
              fontSize: '230%',
              formatter: (data) => {
                return '22\n\n' + this.$t("industryBenchmarking")
              }
            },
            color: ['rgba(2, 217, 235, .3)', 'rgba(2, 217, 235, .5)', 'rgba(2, 217, 235, 1)']
          }
        ]
      }
    }
  },
  mounted () {
    this.getCenter()
  },
  methods: {
    getCenter() {
      let centerChart = echarts.init(this.$refs.centerChart)
      centerChart.setOption(this.processPlan, true)
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
.detail {
    width: 100%;
    height: 100%;
    .showTitle{
        padding: 18px;
        .title{
            font-size: 16px;
            line-height: 18px;
            color: #43dbff;
            margin-right: 20px;
            display: inline-block;
            vertical-align: top;
        }
        .commonNum {
            width: 16px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            margin-right: 10px;
            display: inline-block;
            vertical-align: top;
            color: #3f8694;
            background-color: transparent;
            border: 1px solid #3f8694;
            &.active {
                color: #15c3cf;
                background-color: #346e7d;
                border: 1px solid #15c3cf;
            }
        }
        .selector {
            .el-select {
                width: 120px;
                margin-right: 20px;
                /deep/ .el-input__inner {
                    color: #4272c7;
                    border-radius: 0;
                    background-color: #111d56;
                    border-color: #4272c7;
                }
            }
        }
    }
    .content1 {
        padding:0 18px 18px;
        height: calc(100% - 150px);
    }
}
.el-button {
    background-color: #101f55;
    border-radius: 0;
    border-color: #4273c8;
    &.margin-l20 {
        margin-left: 20px;
    }
    &.active {
        background-color: #2041a3;
    }
}
.content1{
    .centerTitle {
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        margin-bottom: 32px;
        &::after {
            content: '';
            width: 150px;
            height: 2px;
            display: inline-block;
            vertical-align: middle;
            margin-left: 40px;
            background: linear-gradient(to right, #0e1443 0%,#2cb8d8 100%);
        }
        &::before {
            content: '';
            width: 150px;
            height: 2px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 40px;
            background: linear-gradient(to left, #0e1443 0%,#2cb8d8 100%);
        }
    }
    .showHour{
        text-align: center;
        li{
            display: inline-block;
            vertical-align: top;
            font-size: 35px;
            color: #19f1f9;
            width: 40px;
            height: 60px;
            font-weight: bold;
            line-height: 60px;
            text-align: center;
            background-color: #112058;
            border: 1px solid #4374ca;
            margin-right: 15px;
            &:nth-last-of-type(1),
            &:nth-of-type(3),
            &:nth-of-type(7){
                margin-right: 0;
            }
            &:nth-of-type(4),
            &:nth-of-type(8) {
                font-weight: normal;
                border-color: transparent;
                background-color: transparent;
                width: 30px;
                margin-right: 0;
            }
            &:nth-of-type(4){
                line-height: 80px;
            }
            &:nth-of-type(8){
                line-height: 90px;
            }
        }
    }
}
.chartContent {
    width: 100%;
    height: calc(100% - 120px);
}
</style>
