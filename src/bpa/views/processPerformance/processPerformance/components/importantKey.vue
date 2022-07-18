<template>
    <el-row class="w100 h100">
        <el-col :span="18" class="h100 leftpart">
            <div class="content w100 h100">
                <h6>关键指标</h6>
                <el-row class="charts">
                    <el-col :span="6" class="h100">
                        <div class="w100 h100" ref="orderRate"></div>
                    </el-col>
                    <el-col :span="6" class="h100">
                        <div class="w100 h100" ref="buyRate"></div>
                    </el-col>
                    <el-col :span="6" class="h100">
                        <div class="w100 h100" ref="qualityRate"></div>
                    </el-col>
                    <el-col :span="6" class="h100">
                        <div class="w100 h100" ref="sendRate"></div>
                    </el-col>
                </el-row>
                <el-row class="tables">
                    <el-col class="h100 left" :span="12">
                        <h6>红色警告(超过阈值)</h6>
                        <el-scrollbar class="tableHeight">
                            <el-table
                            :data="tableData"
                            stripe
                            style="width: 100%">
                            <el-table-column
                            prop="date"
                            label="指标名称"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="当前指标"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="阈值">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="超出百分比">
                            </el-table-column>
                            </el-table>
                        </el-scrollbar>
                    </el-col>
                    <el-col class="h100 right" :span="12">
                        <h6 class="yellow">黄色警告(超过计划值2)</h6>
                        <el-scrollbar class="tableHeight">
                            <el-table
                            :data="tableData"
                            stripe
                            style="width: 100%">
                            <el-table-column
                            prop="date"
                            label="指标名称"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="当前指标"
                            width="120">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="阈值">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="超出百分比">
                            </el-table-column>
                            </el-table>
                        </el-scrollbar>
                    </el-col>
                </el-row>
            </div>
        </el-col>
        <el-col :span="6" class="h100 rightpart">
            <div class="toppart h100">
                <h6>瓶颈分析-流程还原</h6>
                <div class="chartContent">
                    <div class="w100 h100" ref="processBack"></div>
                </div>
            </div>
            <div class="bottompart">
                <h6>瓶颈分析-流程还原</h6>
                <el-tabs v-model="activeName" @tab-click="handleClick" class="chartContent">
                    <el-tab-pane label="价值链" name="first">
                        <div class="processContent">
                            <p>
                                <span>平均审批效率最长:</span>
                                <span class="float-r">合同管理</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                        <div class="processContent">
                            <p>
                                <span>审批数量最多:</span>
                                <span class="float-r">原料入库</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                        <div class="processContent">
                            <p>
                                <span>综合审批效率最长:</span>
                                <span class="float-r">原料质量检验</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="流程" name="second">
                        <div class="processContent">
                            <p>
                                <span>平均审批效率最长:</span>
                                <span class="float-r">合同管理</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                        <div class="processContent">
                            <p>
                                <span>审批数量最多:</span>
                                <span class="float-r">原料入库</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                        <div class="processContent">
                            <p>
                                <span>综合审批效率最长:</span>
                                <span class="float-r">原料质量检验</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="节点3" name="third">
                        <div class="processContent">
                            <p>
                                <span>平均审批效率最长:</span>
                                <span class="float-r">合同管理</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                        <div class="processContent">
                            <p>
                                <span>审批数量最多:</span>
                                <span class="float-r">原料入库</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                        <div class="processContent">
                            <p>
                                <span>综合审批效率最长:</span>
                                <span class="float-r">原料质量检验</span>
                            </p>
                            <el-progress :percentage="50" :stroke-width="6" :color="'#019cec'" :show-text="false"></el-progress>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'importantKey',
  data() {
    return {
      activeName: 'first',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  computed: {
    leftoptions() {
      return {
        series: [
          {
            name: '',
            type: 'gauge',
            radius: '95%',
            center: ['50%', '50%'],
            title: {
              show: true,
              offsetCenter: [0, '95%'],
              color: '#fff'
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
              formatter: '{value}', 
              offsetCenter: [0, '60%'],
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold'
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 11,
                color: [
                  [0.3, '#314bb9'],
                  [0.7, '#c78f31'],
                  [1, '#d73145']
                ]
              }
            },
            axisLabel: {
              show: true,
              distance: 3,
              color: '#3dd5eb',
              fontSize: '13'
            },
            axisTick: {
              length: 15,
              lineStyle: {
                color: 'auto'
              }
            },
            splitLine: {           // 分隔线
              length: 20,         // 属性length控制线长
              lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
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
    },
    backOptions() {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: '70%',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
          textStyle: {
            color: '#2c91c4'
          }
        },
        color: ['#1f74f1', '#2da2fd', '#42cdfb', '#64eeee', '#01d3d0', '#3db776', '#521edb', '#00266b', '#0033a1', '#0149d1', '#1f47f1'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['30%', '60%'],
            center: ['50%', '35%'],
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: false
              }
            },
            labelLine: {
              show: true,
              length: 8,
              length2: 8
            },
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
            ]
          }
        ]
      }
    }
  },
  mounted () {
    this.getorderRate()
    this.getbuyRate()
    this.getqualityRate()
    this.getsendRate()
    this.getprocessback()
  },
  methods: {
    handleClick (data) {

    },
    getorderRate () {
      let orderRate = echarts.init(this.$refs.orderRate)
      orderRate.setOption(this.leftoptions, true)
    },
    getbuyRate () {
      let buyRate = echarts.init(this.$refs.buyRate)
      this.leftoptions.series[0].data[0].name = '采购付款及时率'
      buyRate.setOption(this.leftoptions, true)
    },
    getqualityRate () {
      let qualityRate = echarts.init(this.$refs.qualityRate)
      this.leftoptions.series[0].data[0].name = '质量检测及时率'
      qualityRate.setOption(this.leftoptions, true)
    },
    getsendRate () {
      let sendRate = echarts.init(this.$refs.sendRate)
      this.leftoptions.series[0].data[0].name = '送货及时率'
      sendRate.setOption(this.leftoptions, true)
    },
    getprocessback () {
      let processBack = echarts.init(this.$refs.processBack)
      processBack.setOption(this.backOptions, true)
    }
  }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.leftpart{
    padding-right: 9px;
    .content{
        padding: 0 29px;
        background: url('../../../../assets/img/bg-Img1.png') center center no-repeat;
        background-size: 100% 100%;
    }
    h6 {
        font-size: 16px;
        color: #a9ddee;
        font-weight: 100;
        line-height: 38px;
    }
    .charts {
        height: 40%;
        margin-bottom: 10px;
    }
    .tables{
        height: calc(60% - 48px);
        h6 {
            padding-left: 10px;
            font-size: 14px;
            margin-bottom: 15px;
            line-height: 14px;
            color: #d73145;
            border-left: 8px solid #d73145;
            font-weight: normal;
            &.yellow{
                color: #de9e33;
                border-left: 8px solid #de9e33;
            }
        }
        .tableHeight{
            height: calc(100% - 45px);
        }
        .left{
            padding-right: 9px;
        }
        .right{
            padding-left: 9px;
        }
        .el-table, /deep/ .el-table thead{
            color: #00aaff;
        }
        /deep/ .el-table .cell{
            text-align: center;
        }
        /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td,
        /deep/ .el-table, .el-table__expanded-cell,
        /deep/ .el-table th, /deep/ .el-table tr,
        /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td,
        /deep/ .el-table--border::after, /deep/ .el-table--group::after, /deep/ .el-table::before{
            background-color: transparent;
        }
        /deep/ .el-table__header-wrapper tr,
        /deep/ .el-table--striped .el-table__body tr.el-table__row--striped {
            background: linear-gradient(to right, #1e4667 0%,#0c163b 100%);
        }
        /deep/ .el-table td, /deep/ .el-table th.is-leaf{
            border-color: transparent;
        }
    }
}
.rightpart {
    height: 100%;
    padding-left: 9px;
    h6 {
        font-size: 16px;
        color: #a9ddee;
        font-weight: 100;
        line-height: 38px;
    }
    .toppart, & .bottompart {
        height: calc(50% - 9px);
        background: url('../../../../assets/img/bg-Img2.png') center center no-repeat;
        background-size: 100% 100%;
    }
    .toppart {
        margin-bottom: 18px;
        padding: 0 20px;
    }
    .bottompart{
        margin-bottom: 18px;
        padding: 0 20px; 
    }
    .chartContent {
        height: calc(100% - 50px);
        /deep/ .el-tabs__item {
            height: 30px;
            color: #597890;
            line-height: 30px;
        }
        /deep/ .el-tabs__item.is-active {
            color: #14c6cf;
        }
        /deep/ .el-tabs__active-bar{
            background-color: #14c6cf;
        }
        /deep/ .el-tabs__header{
            margin-bottom: 0;
        }
        /deep/ .el-tabs__nav-wrap::after{
            height: 1px;
            background-color: #0d3d5c;
        }
        /deep/ .el-tabs__content{
            height: calc(100% - 38px);
            .el-tab-pane {
                height: 100%;
                overflow: auto;
            }
        }
        /deep/ .el-progress-bar__outer {
            background-color: #063c69;
        }
        .processContent {
            p {
                line-height: 36px;
                margin-top: 10px;
                color: #597891;
                span:nth-of-type(2) {
                    color: #a9ddee;
                }
            }
        }
    }
}
</style>