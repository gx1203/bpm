<template>
  <div id="database">
    <el-main class="di__main">
      <el-row>
        <el-button style="margin-bottom: 10px" @click="$router.push('/analyseWatchCenter/bpmProcessBack')">返回上一级</el-button>
      </el-row>
      <el-row>
        <el-col style="text-align:center">
          <el-button :class="{'active':!showlist }" type="primary" plain @click="clickshow('chart')">图</el-button>
          <el-button :class="{'active':showlist }" type="primary" plain @click="clickshow('list')">表</el-button>
        </el-col>
      </el-row>
      <div v-show="!showlist" id="myChart" class="showContent"/>
      <div v-show="showlist" class="showContent">
        <el-table :data="tableData2" size="small">
          <el-table-column type="index" :label="$t('number')" align= "center"/>
          <el-table-column prop="weather" label="程度" align="center" width="80">
            <template slot-scope="scope">
              <span :class="scope.row.weather" class="iconfont" style="transform:scale(1.5)"/>
            </template>
          </el-table-column>
          <el-table-column prop="ValueChainName" label="价值链阶段名称" align= "center"/>
          <el-table-column prop="setTime" label="规定时间" align= "center"/>
          <el-table-column prop="actualTime" label="实际时间" align= "center"/>
          <el-table-column prop="beyondlTime" label="超期时间" align= "center"/>
          <el-table-column prop="beyondPercentage" label="超期百分比" align= "center"/>
          <el-table-column prop="operation" :label="$t('operation')" width="240" align= "center">
            <template slot-scope="scope">
              <a @click="jump2">查看</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :total="8" small layout="total, prev, pager, next, jumper"/>
      </div>
    </el-main>
  </div>
</template>
<script>
import routerImg from '@/bpm/assets/img/analyseWatchCenter/router.png'
import routerActiveImg from '@/bpm/assets/img/analyseWatchCenter/router_active.png'
import '@/bpm/assets/fonts/font_weather/iconfont.css'
import '@/bpm/assets/fonts/font_weather/iconfont.eot'
import '@/bpm/assets/fonts/font_weather/iconfont.ttf'
import '@/bpm/assets/fonts/font_weather/iconfont.svg'
// 引入echarts
import echarts from 'echarts'
export default {
  data() {
    return {
      showlist: false,
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      processList: [],
      grandParentId: '',
      treeKey: 0,
      props: {
        label: 'name',
        isLeaf: function(data, node) {
          if (data.isparent === true) {
            return false
          } else {
            return true
          }
        }
      },
      updateForm: {
        id: '',
        kpicode: '',
        kpiname: '',
        description: '',
        exname: '',
        pvalue1: '',
        pvalue2: '',
        threshold: '',
        vcid: ''
      },
      updateForm1: {
        code: '',
        name: '',
        lastname: ''
      },
      node: '',
      resolve: '',
      nodeCode: '',
      defaultExpand: false,
      childrenlist: [],
      formList: [],
      // 树形控件的数据
      data: [{
        label: '运行实例',
        children: [{
          label: '职位分析'
        },
        {
          label: '效率任务分析'
        }]
      }, {
        label: '流程瓶颈分析',
        children: [{
          label: '价值链'
        }, {
          label: '流程'
        }, {
          label: '节点'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表格的数据
      tableData: [{
        weather: 'iconfont icon-tianqi',
        ValueChainName: '项目全周期',
        compatibility: '27%',
        mismatchedKey: ' 开发建设',
        operation: ''
      }, {
        weather: 'iconfont icon-tianqi',
        ValueChainName: 'OTD',
        compatibility: '65%',
        mismatchedKey: ' 订单交付',
        operation: ''
      }],
      // 表格的数据2
      tableData2: [{
        weather: 'iconfont icon-tianqi',
        ValueChainName: '投资拓展',
        setTime: 10,
        actualTime: 8,
        beyondlTime: -2,
        beyondPercentage: '-20%',
        operation: ''
      }, {
        weather: 'iconfont icon-dayu-',
        ValueChainName: '投资规划',
        setTime: 5,
        actualTime: 8,
        beyondlTime: 3,
        beyondPercentage: '10%',
        operation: ''
      },
      {
        weather: 'iconfont icon-xiaoyu',
        ValueChainName: '项目策划',
        setTime: '80',
        actualTime: '100',
        beyondlTime: ' 20',
        beyondPercentage: '25%',
        operation: ''
      },
      {
        weather: 'iconfont icon-tianqi',
        ValueChainName: '工程建设',
        setTime: '80',
        actualTime: '100',
        beyondlTime: ' 20',
        beyondPercentage: '25%',
        operation: ''
      },
      {
        weather: 'iconfont icon-leiyu',
        ValueChainName: '成本控制',
        setTime: '80',
        actualTime: '100',
        beyondlTime: ' 20',
        beyondPercentage: '25%',
        operation: ''
      },
      {
        weather: 'iconfont icon-tianqi',
        ValueChainName: '项目销售',
        setTime: '80',
        actualTime: '100',
        beyondlTime: ' 20',
        beyondPercentage: '25%',
        operation: ''
      },
      {
        weather: 'iconfont icon-tianqi',
        ValueChainName: '售后服务',
        setTime: '80',
        actualTime: '100',
        beyondlTime: ' 20',
        beyondPercentage: '25%',
        operation: ''
      },
      {
        weather: 'iconfont icon-tianqi',
        ValueChainName: '物业管理',
        setTime: '80',
        actualTime: '100',
        beyondlTime: ' 20',
        beyondPercentage: '25%',
        operation: ''
      }],
      // 单选框
      radio: '1'
    }
  },
  mounted() {
    this.SetEchart()
  },
  methods: {
    clickshow(type) {
      if (type === 'chart') {
        this.showlist = false
        this.SetEchart()
      } else {
        this.showlist = true
      }
    },
    jump() {
      this.$router.push('/diCenter/valueChain')
    },
    handleNodeClick(data) {
      console.log(data)
    },
    jump2() {
      // this.$router.push('/diCenter/lineChart')
    },
    SetEchart() {
      const myChart = echarts.init(document.getElementById('myChart'))
      var option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['规定时间', '实际时间'],
          textStyle: {
            color: '#fff'
          },
          bottom: '0'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#fff'
          },
          data: ['投资拓展', '规划设计', '项目策划', '工程建设', '成本管控', '项目销售', '售后服务', '物业管理']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '规定时间',
            type: 'line',
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#6db9e7'
              }
            },
            lineStyle: {
              color: '#6db9e7'
            },
            data: [120, 132, 101, 134, 90, 230, 210, 220]
          },
          {
            name: '实际时间',
            type: 'line',
            symbol: 'none',
            lineStyle: {
              color: '#e7df6d',
              width: 5
            },
            itemStyle: {
              normal: {
                color: '#e7df6d'
              }
            },
            data: [220, 182, 191, 234, 290, 330, 310, 320]
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
  #database {
    width: 100%;
    background-size: 100% 100%;
    .di__router-container {
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
    .di__router {
      padding-left: 30px;
      // background: url("") no-repeat;
      background-size: 100% 100%;
    }
    .absolute {
      position: absolute;
      z-index: 2;
    }
    .base_router {
      span {
        color: #39cdfb;
      }
    }
    .header-database {
      left: 125px!important;
    }
    .header-database.left143px{
      left: 143px!important;
    }
    .header-database1 {
      left: 135px!important;
    }
    .header-database2 {
      left: 146px!important;
    }
    .base-content {
      border: 1px solid #1d4f7e;
      border-radius: 3px;
      margin: 0 22px !important;
      /*box-shadow: 5px 5px 10px #1d4f7e;*/
      box-shadow: #1d4f7e 0px 0px 15px 5px inset;
      .base-content-item {
        padding: 20px;
        .base-button {
          color: #00d6e6;
        }
      }
    }
    .left_tree_wrapper1.el-scrollbar {
      height: calc(100vh - 210px) !important;
      /*background: #23356d;*/
      .el-scrollbar__wrap {
        overflow: auto!important;
      }
    }
    .button-base {
      .el-button {
        background: #169bd5;
        border: 1px solid #3378b9;
        color: #00d6e6;
        &:hover,&:focus {
          color: #39cdfb;
        }
      }
    }
    .base-title {
      color: #3276b5;
      font-size: 19px;
    }
  }
  .targetSign{
    width: 318px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  }
  .bg-lightGreen {
      background-color: rgba(208, 225, 125, 1);
  }
  .bg-yellow{
    background-color: rgba(255, 255, 0, 1);
  }
  .bg-red {
    background-color: rgba(255, 0, 0, 1);
  }
  .bg-lightGray {
    background-color: rgba(204, 204, 204, 1);
  }
  /deep/.el-table {
    color: #FFF;
    background-color: transparent;
    thead {
      color: #fff;
      font-weight: 700;
    }
    & td, & th.is-leaf{
      border-bottom: 1px solid #4d576f;
    }
    & th, & tr{
      background-color: transparent;
    }
    &:before {
      background-color: #4d576f;
    }
    & td a {
      color: #FFF;
    }
    & td {
      a:hover{
        color: skyblue;
        text-decoration:underline;
        cursor: pointer;
      }
    }
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
     background-color: rgba(13,45,74 , .5);
  }
   a, a:link, a:visited, a:hover, a:active {
    // color: #333;
    text-decoration: none;
    cursor: pointer;
  }
  .showContent{
    width: 100%;
    height: calc(100vh - 245px);
  }
  /deep/ .active.el-button--primary.is-plain{
    background-color: #409EFF;
    color: #fff;
    border-color: #409EFF;
  }
  /deep/.el-pagination button:disabled {
  background-color: transparent;
}
</style>
