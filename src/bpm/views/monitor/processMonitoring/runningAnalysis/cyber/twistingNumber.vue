<template>

  <el-card id="twistingNumber" shadow="never" style="background: transparent">
    <div>
      <echar class="echar-line" :option="option"/>
    </div>
  </el-card>

</template>
<script>
import echar from '@/bpm/components/echarts/echarts'
import {getProcessCirculation} from '@/bpm/api/monitor/index.js'
import echarts from "_echarts@4.9.0@echarts";

export default {
  components: {
    echar
  },
  data() {
    return {
      option: {},
      name: [],
      list: [],
      backgroundColor: ''
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
      handler(newVal, oldVal) {
        this.getData()
      }
    }
  },
  methods: {
    getData() {
      console.log('this.item.id', this.item.id);
      this.name = []
      this.list = []
      getProcessCirculation(this.item.id).then(rt => {
        if (rt.data.circulations && rt.data.circulations.length > 0) {
          rt.data.circulations.forEach(e => {
            this.name.push(e.nodenameen)
            this.list.push(e.num)
          })
        }
        this.initEchar()
      })
    },
    initEchar() {

      if (this.item.backgroundColor) {
        this.backgroundColor = this.item.backgroundColor
      }
      this.option = {
        color: ['#2FC25B'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '40',
          right: '40',
          bottpm: '100',
          containLabel: true
        },
        legend: {
          data: [this.$t('transferNumber')],
          textStyle: {//图例文字的样式
            color: '#1bb4f6',
          }
        },
        toolbox: {
          show: true,
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.name,
            axisLine: {
              show:true,
              lineStyle: {
                color: '#397cbc'
              }
            },
            axisLabel: {
              width: 100,
              height: 50,
              color: '#30eee9',
              interval: 0,
              rotate: 45,
              overflow: 'truncate',
              ellipsis: '...'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color:'#2ad1d2'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#27b4c2'
              }
            }
          }
        ],
        series: [
          {
            name: this.$t('transferNumber'),
            type: 'bar',
            smooth: false,
            data: this.list,
            barMaxWidth: '50px',
            itemStyle: {
              normal: {
                color: "#00d4c7",
                lineStyle: {
                  color: "#00d4c7",
                  opacity: 1
                }
              }
            },
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#twistingNumber {
  .echar-line {
    width: 100%;
    height: 50vh;
  }
}

/deep/ .el-card__body {
  padding: 0;
}
</style>
