<template>
  <el-card id="twistingNumber" shadow="never"  style="background: transparent">
    <div>
        <echar class="echar-line" :option="option"/>
    </div>
  </el-card>
</template>
<script>
import echar from '@/bpm/components/echarts/echarts'
import { getProcessCirculationDate } from '@/bpm/api/monitor/index.js'

export default {
  components: {
    echar
  },
  data () {
    return {
      option: {},
      name: [],
      avg: [],
      min: [],
      max: []
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    'item': {
      immediate: true,
      handler (newVal, oldVal) {
        this.getData()
      }
    }
  },
  methods: {
    getData () {
      this.name = []
      this.avg = []
      this.min = []
      this.max = []
      getProcessCirculationDate(this.item.id).then(rt => {
        if (rt.data.circulationDates && rt.data.circulationDates.length > 0) {
          rt.data.circulationDates.forEach(e => {
            this.name.push(e.nodenameen)
            this.avg.push(e.avgdate)
            this.min.push(e.mindate)
            this.max.push(e.maxdate)
          })
        }
        this.initEchar()
      })
    },
    initEchar () {

      this.option = {
        color: ['#2FC25B', '#1890FF', '#004C96'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '50',
          right: '40',
          bottom: '100'
        },
        legend: {
          data: ['Min', 'Max', 'Avg'],
           textStyle:{//图例文字的样式
            color: '#1bb4f6',
        }
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.name,
            axisLine: {
              lineStyle: {
                color: '#397cbc'
              }
            },
            axisLabel: {
               color: '#30eee9',
              interval:0,
              rotate:"45"
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('averageCirculationTime'),
            nameTextStyle:{
            color: '#2ad1d2',
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#2ad1d2',
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#27b4c2'
              }
            }
          },
          {
            type: 'value',
            name: this.$t('circulationTime') + '(h)',
            nameTextStyle:{
              color: '#2ad1d2',
                 },
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
               color: '#2ad1d2',
            }
          }
        ],
        series: [
          {
            name: 'Min',
            type: 'line',
            smooth: false,
            data: this.min,
            barMaxWidth: '50px'
          },
          {
            name: 'Max',
            type: 'line',
            smooth: false,
            data: this.max,
            barMaxWidth: '50px'
          },
          {
            name: 'Avg',
            type: 'bar',
            yAxisIndex: 1,
            data: this.avg,
            barMaxWidth: '50px'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#twistingNumber{
    .echar-line{
        width: 100%;
        height: 50vh;
    }
}
/deep/  .el-card__body {
    padding:0 ;
    }
</style>
