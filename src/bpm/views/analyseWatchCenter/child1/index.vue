<template>
  <div id="analyseWatchCenter" class="w100">
    <div>
      <h4>运行实例</h4>
      <div ref="operationExample" class="operation"/>
    </div>
    <div>
      <h4>平均审批时长Top5</h4>
      <div ref="approvalTime" class="operation"/>
    </div>
    <div>
      <h4>top5单个流程节点平均流转时间</h4>
      <div ref="processNode" class="operation"/>
    </div>
    <div>
      <h4>岗位平均审批时长</h4>
      <div ref="averageApproval" class="operation"/>
    </div>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'

// 接口请求部分
import {
// getTrained,
// exportTrained,
// getTrainedprocess,
// getExceed,
// exportExceed,
// getPblish,
// exportpblish,
// exportpblishnode,
// getRate,
// getRatedetail,
// exportRate
} from '@/bpm/api/analyseWatchCenter'
// import { export_post_list, getFormateDate } from "@/bpm/utils/common";

export default {
  data() {
    return {

    }
  },
  computed: {

  },
  mounted() {
    this.setOperationExample()
    this.setApprovalTime()
    this.setProcessNode()
    this.setAverageApproval()
  },
  methods: {
    // 运行实例
    setOperationExample() {
      const firstChild = echarts.init(this.$refs.operationExample)
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: [this.$t('completed'), this.$t('beingProcessed')]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['请假流程', '奖金申请', '供应商准入', '差旅报销', '借入备用金', '请示报告', '原料采购确认', '制定生成规划', '周报审批', '结算单审批']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.$t('completed'),
            type: 'bar',
            stack: '广告',
            barWidth: 40,
            data: [320, 332, 301, 334, 390, 330, 320, 240, 160, 120]
          },
          {
            name: this.$t('beingProcessed'),
            type: 'bar',
            stack: '广告',
            data: [120, 132, 101, 134, 90, 230, 210, 155, 125, 140]
          }
        ]
      }

      firstChild.setOption(option)
    },
    // 平均审批时长Top5
    setApprovalTime() {
      const firstChild = echarts.init(this.$refs.approvalTime)
      var option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290]
          }
        ]
      }

      firstChild.setOption(option)
    },
    // top5单个流程节点平均流转时间
    setProcessNode() {
      const firstChild = echarts.init(this.$refs.processNode)
      var option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['蒸发量', '平均温度', 'max']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '水量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            interval: 5,
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: '蒸发量',
            type: 'bar',
            barWidth: '40',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '平均温度',
            type: 'line',
            yAxisIndex: 1,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          },
          {
            name: 'max',
            type: 'line',
            yAxisIndex: 1,
            data: [1.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }

      firstChild.setOption(option)
    },
    setAverageApproval() {
      const firstChild = echarts.init(this.$refs.averageApproval)
      var option = {
        // title: {
        //   text: '折线图堆叠'
        // },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290]
          }
        ]
      }

      firstChild.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
#analyseWatchCenter {
  .operation{
    width: 80%;
    height: 600px;
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
