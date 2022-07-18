<template>
  
    <el-card id="twistingNumber" shadow="never"  v-bind:style="{ backgroundColor:this.item.backgroundColor}">
       <div>
          <echar class="echar-line" :option="option"/>
       </div>
    </el-card>
 
</template>
<script>
import echar from '@/bpm/components/echarts/echarts'
import { getProcessCirculation } from '@/bpm/api/monitor/index.js'
export default {
  components: {
    echar
  },
  data () {
    return {
      option: {},
      name: [],
      list: [],
      backgroundColor:''
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
      console.log('this.item.id',this.item.id);
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
    initEchar () {

      if(this.item.backgroundColor){
        this.backgroundColor=this.item.backgroundColor
      }
      this.option = {
        color: ['#2FC25B'],
        backgroundColor: this.backgroundColor,
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '40',
          right: '40',
          bottpm: '100'
        },
        legend: {
          data: [this.$t('transferNumber')],
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
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: this.item.backgroundColor ? '#fff':'rgba(0,0,0,0.65)'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#E9E9E9'
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
  /deep/    .el-card__body {
    padding:0 ;
    }
</style>
