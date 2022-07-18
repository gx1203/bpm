<template>
  <el-card id="solidColumnAnalysis" shadow="never">
    <el-form :model="searchForm" ref="searchForm" label-width="120px" size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item  v-if="!nodeShow" :label="$t('checkTheYear') + '：'">
              <el-date-picker
              @change="getData"
              v-model="searchForm.year"
              type="year"
              :placeholder="$t('placeholderText.selectYear')"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  v-if="!nodeShow" :label="$t('showTop') + '：'">
            <el-select clearable @change="getData" v-model="searchForm.top" class="w100" :placeholder="$t('placeholderText.pleaseSelect')">
              <el-option v-for="item in topList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="16" style="text-align:right;">
          <!-- <el-button type="primary" @click="treeShow = true">选择流程</el-button> -->
          <el-button type="primary" :disabled="!nodeShow" @click="back">{{ $t('return') }}</el-button>
          <el-button type="primary" @click="refreshData"> {{ $t('refresh') }}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <echar class="echar-line" @echartsClick="dataInfo" :option="option"/>
      </el-row>
    </el-form>
    <tree v-model="treeShow" @confirm="getProcessId" />
  </el-card>
</template>
<script>
import echar from '@/bpm/components/echarts/echarts'
import tree from './tree'
import { getExampleAnalysis } from '@/bpm/api/monitor/index.js'

export default {
  name: 'solidColumnAnalysis',
  components: {
    echar,
    tree
  },
  data () {
    return {
      treeShow: false,
      searchForm: {
        top: 10,
        year: new Date()
      },
      topList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      option: {},
      processIds: [],
      name: [],
      ing: [],
      over: [],
      nodeShow: false,
      nodeName: '',
      content: {}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      getExampleAnalysis({
        'num': this.searchForm.top,
        'processIds': this.processIds,
        'year': this.searchForm.year.toString().split(' ')[3]
      }).then(rt => {
        if (rt.data) {
          this.content = rt.data
          this.eachData()
        }
      })
    },
    eachData () {
      this.name = []
      this.ing = []
      this.over = []
      this.content.forEach(e => {
        if (this.nodeShow) {
          if (this.nodeName === e.processnamecn) {
            e.activitiList.forEach(element => {
              this.name.push(element.activityname)
              this.ing.push(element.ing)
              this.over.push(element.over)
            })
          }
        } else {
          this.name.push(e.processnamecn)
          this.ing.push(e.ing)
          this.over.push(e.over)
        }
      })
      this.initEchar()
    },
    back () {
      this.nodeName = ''
      this.nodeShow = false
      this.eachData()
    },
    getProcessId (data) {
      this.processIds = data
      this.getData()
    },
    dataInfo (params) {
      if (!this.nodeShow) {
        this.nodeShow = true
        this.nodeName = params.name
        this.eachData()
      }
    },
    initEchar () {
      this.option = {
        color: ['#2FC25B', '#1890FF'],
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '40',
          right: '40',
          bottom: '100'
        },
        legend: {
          data: [this.$t('beingProcessed'), this.$t('completed')]
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
              color: 'rgba(0,0,0,0.65)',
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
              color: 'rgba(0,0,0,0.65)'
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
            name: this.$t('beingProcessed'),
            type: 'bar',
            smooth: false,
            data: this.ing,
            stack: this.$t('state'),
            barMaxWidth: '50px'
          },
          {
            name: this.$t('completed'),
            type: 'bar',
            smooth: false,
            stack: this.$t('state'),
            data: this.over,
            barMaxWidth: '50px'
          }
        ]
      }
    },
    refreshData () {
      this.getData()
    }
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
#solidColumnAnalysis {
  .w100 {
    width: 100%;
  }
  .echar-line {
    width: 100%;
    height: 50vh;
  }
}
</style>
