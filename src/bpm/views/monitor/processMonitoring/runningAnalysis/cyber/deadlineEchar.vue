<template>
  <el-card id="twistingNumber" shadow="never" style="background: transparent">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <!--        <el-button type="primary" v-if="isRun" @click="runHandle">-->
        <!--            {{ $t('viewRunningTasks') }}-->
        <!--            &lt;!&ndash;<i class="el-icon-sort"/>&ndash;&gt;-->
        <!--        </el-button>-->
        <!--         <el-button v-else type="primary" @click="runHandle">-->
        <!--             {{ $t('viewCompletedTasks') }}-->
        <!--             &lt;!&ndash;<i class="el-icon-sort"/>&ndash;&gt;-->
        <!--        </el-button>-->
      </div>
    </div>
    <div>
      <echar class="echar-line" :option="option"/>
    </div>
  </el-card>
</template>
<script>
import echar from '@/bpm/components/echarts/echarts'
import {getProcessCirculationDead} from '@/bpm/api/monitor/index.js'

export default {
  components: {
    echar
  },
  data() {
    return {
      option: {},
      name: [],
      list: [],
      list1: [],
      isRun: false,
      isapproval: 'T'
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
      this.name = []
      this.list = []
      this.list1 = []
      getProcessCirculationDead(this.item.id, this.isapproval).then(rt => {
        if (rt.data.circulationDeads && rt.data.circulationDeads.length > 0) {
          rt.data.circulationDeads.forEach(e => {
            this.name.push(e.nodenameen)
            this.list.push(e.expirednum)
            this.list1.push(e.notexpirednum)
          })
        }
        this.initEchar()
      })
    },
    runHandle() {
      this.isRun = !this.isRun
      if (this.isRun) {
        this.isapproval = 'F'
      } else {
        this.isapproval = 'T'
      }
      this.getData()
    },
    initEchar() {
      this.option = {
        color: ['#2FC25B', '#1890FF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '60',
          right: '50',
          bottom: '100'
        },
        legend: {
          data: [this.$t('exceedTime'), this.$t('notExceedTime')],
          textStyle: {//图例文字的样式
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
              interval: 0,
              rotate: "45"
            }
          }
        ],
        yAxis: [
          {
            name: this.$t('overdueProcessStatisticsPieces'),
            nameTextStyle: {
              color: '#2ad1d2',
            },
            type: 'value',
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
          }
        ],
        series: [
          {
            name: this.$t('notExceedTime'),
            nameTextStyle: {
              color: '#2ad1d2',
            },
            type: 'bar',
            smooth: false,
            data: this.list1,
            barMaxWidth: '50px'
          },
          {
            name: this.$t('exceedTime'),
            type: 'bar',
            smooth: false,
            data: this.list,
            barMaxWidth: '50px'
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
    min-height: 50vh;
  }
}

/deep/ .el-card__body {
  padding: 0;
}
</style>
