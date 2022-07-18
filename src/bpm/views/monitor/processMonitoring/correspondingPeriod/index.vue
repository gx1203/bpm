<template>
  <el-card id="correspondingPeriod" shadow="never">
    <div class="item-left">
      <!-- <treeProcessFlow ref="tree" type="1" @confirm="handleNodeClick"/> -->
      <BasProcessTree showView="1" @confirm="handleNodeClick" />
    </div>
    <div class="item-right" v-if="treeData.type === '1' || treeData.type === '2'">
      <el-form ref="searchForm" label-width="120px" size="mini">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('comparingTheYear') + '：'">
              <el-date-picker @change="getData" v-model="year" type="year" :picker-options="pickerOptions"
                :placeholder="$t('placeholderText.selectYear')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-card id="twistingNumber" shadow="never">
        <div class="tool-common-wrap">
          <div class="btn-wrap">
            <el-button type="primary" @click="getData">
              {{ $t('refresh') }}
              <!---->
            </el-button>
          </div>
        </div>
        <div>
          <echar class="echar-line" :option="option" />
        </div>
      </el-card>
    </div>
  </el-card>
</template>
<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import echar from '@/bpm/components/echarts/echarts'
// import treeProcessFlow from '@/bpm/components/treeProcessFlow'
import { getSyncAnalysis } from '@/bpm/api/monitor/index.js'
export default {
  name: 'correspondingPeriod',
  components: {
    echar,
    // treeProcessFlow
  },
  data () {
    return {
      year: new Date(new Date().setFullYear((new Date().getFullYear() - 1))),
      treeData: {},
      option: {},
      newData: [],
      oldData: [],
      proData: [],
      monthList: [
        '01月',
        '02月',
        '03月',
        '04月',
        '06月',
        '06月',
        '07月',
        '08月',
        '09月',
        '10月',
        '11月',
        '12月'
      ],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > new Date().setFullYear((new Date().getFullYear() - 1))
        }
      }
    }
  },
  methods: {
    getData () {
      this.newData = []
      this.oldData = []
      this.proData = []
      let id = ''
      let name = ''
      if (this.treeData.type === '1') {
        id = this.treeData.id
        name = ''
      } else if (this.treeData.type === '2') {
        id = this.treeData.pid
        name = this.treeData.name
      }
      getSyncAnalysis({
        'activitiname': name,
        'nowYear': new Date().toString().split(' ')[3],
        'oldYear': this.year.toString().split(' ')[3],
        'processId': id
      }).then(rt => {
        let data = rt.data
        this.monthList.forEach(e => {
          this.newData.push(data.newData[e] ? data.newData[e] : 0)
          this.oldData.push(data.oldData[e] ? data.oldData[e] : 0)
          this.proData.push(data.proData[e] ? data.proData[e] : 0)
        })
        this.initEchar()
      })
    },
    refreshData () { },
    initEchar () {
      this.option = {
        color: ['#2FC25B', '#1890FF', '#004C96'],
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '50',
          right: '50'
        },
        legend: {
          data: [this.year.toString().split(' ')[3], new Date().toString().split(' ')[3], '增长百分比(%)']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.monthList,
            axisLine: {
              lineStyle: {
                color: '#E9E9E9'
              }
            },
            axisLabel: {
              color: 'rgba(0,0,0,0.65)'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('numberOfProcessInitiates'),
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: 'rgba(0,0,0,0.65)'
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
            name: this.$t('percentageIncreaseOverTheSamePeriod'),
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
              color: 'rgba(0,0,0,0.65)'
            }
          }
        ],
        series: [
          {
            name: this.year.toString().split(' ')[3],
            type: 'bar',
            smooth: false,
            barMaxWidth: '50px',
            data: this.oldData
          },
          {
            name: new Date().toString().split(' ')[3],
            type: 'bar',
            smooth: false,
            barMaxWidth: '50px',
            data: this.newData
          },
          {
            name: this.$t('percentageIncrease'),
            type: 'line',
            yAxisIndex: 1,
            data: this.proData
          }
        ]
      }
    },
    handleNodeClick (data) {
      this.treeData = data
      if (data.type === '1' || data.type === '2') {
        this.getData()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#correspondingPeriod {
  .item-left {
    float: left;
    width: 20%;
  }
  .item-right {
    float: right;
    width: 78%;
    .table-header {
      position: relative;
      background: $bc2;
      display: flex;
      align-items: center;
      .all-check {
        position: absolute;
        left: 20px;
      }
    }
  }
  .echar-line {
    width: 100%;
    height: 50vh;
  }
}
</style>
