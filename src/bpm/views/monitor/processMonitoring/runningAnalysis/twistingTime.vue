<template>
  <el-card id="twistingNumber" shadow="never"  v-bind:style="{ backgroundColor:this.item.backgroundColor}">
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
        backgroundColor:this.item.backgroundColor?this.item.backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '50',
          right: '40',
          bottom: '100'
        },
        legend: {
          data: ['Min', 'Max', 'Avg'],
           textStyle:{//图例文字的样式
            color: this.item.backgroundColor ? '#fff':'#000',
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
                color: '#E9E9E9'
              }
            },
            axisLabel: {
               color: this.item.backgroundColor ? '#fff':'rgba(0,0,0,0.65)',
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
            color: this.item.backgroundColor ? '#fff':'#000',
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: this.item.backgroundColor ? '#fff':'rgba(0,0,0,0.65)',
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#E9E9E9'
              }
            }
          },
          {
            type: 'value',
            name: this.$t('circulationTime') + '(h)',
            nameTextStyle:{
              color: this.item.backgroundColor ? '#fff':'#000',
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
               color: this.item.backgroundColor ? '#fff':'rgba(0,0,0,0.65)',
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
