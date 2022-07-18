<template>
  <el-card id="twistingNumber" shadow="never">
    <div class="tool-common-wrap">
      <div class="btn-wrap">
        <el-button type="primary" @click="getData">
           {{ $t('refresh') }}
          <!--<i class="el-icon-refresh"/>-->
        </el-button>
      </div>
    </div>
    <div>
        <echar class="echar-line" :option="option"/>
    </div>
  </el-card>
</template>
<script>
import echar from '@/bpm/components/echarts/echarts'
import { getMonitorWiAnalysis } from '@/bpm/api/monitor/index.js'
export default {
  components: {
    echar
  },
  data () {
    return {
      option: {},
      name: [],
      list: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.name = []
      this.list = []
      getMonitorWiAnalysis().then(rt => {
        rt.data.forEach(e => {
          this.name.push(e.processnamecn)
          this.list.push({
            name: e.processnamecn,
            value: e.quantity
          })
        })
        this.initEchar()
      })
    },
    initEchar () {
      this.option = {
        title: {
          text: this.$t('abnormalFlowStatistics')
        },
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          bottom: 'bottom',
          data: this.name
        },
        series: [
          {
            name: this.$t('referer'),
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            label: {
              normal: {
                formatter: '{b|{b}：}{c} 个 {per|( {d} )%}  ',
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    padding: [2, 4]
                  }
                }
              }
            },
            data: this.list,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
</style>
