<template>
  <el-card id="correspondingPeriod" shadow="never" style="background: transparent;height: 80vh">
    <el-form ref="searchForm" label-width="120px" size="mini" style="float: right">
      <el-form-item :label="$t('comparingTheYear') + '：'" style="display: inline-block;margin-right: 20px">
        <el-date-picker @change="getData" v-model="year" type="year" :picker-options="pickerOptions"
                        :placeholder="$t('placeholderText.selectYear')"/>
      </el-form-item>
<!--      <span class="choose-process-title">{{ $t('selectProcess') }}</span>-->
<!--      <el-popover >-->
<!--        <BasProcessTree showView="3" @confirm="handleNodeClick" />-->
<!--        <div slot="reference" class="choose-process" @click="isViewDialog=true">-->
<!--          {{ treeData.modelname? treeData.modelname:'点击选择'}}-->
<!--        </div>-->
<!--      </el-popover>-->

      <el-button type="primary" @click="getData">
        {{ $t('refresh') }}
        <!---->
      </el-button>
    </el-form>
    <div class="item-right" style="clear: right" >

<!--      <el-card id="twistingNumber" shadow="never" style="background: transparent;">-->
<!--        <div class="tool-common-wrap">-->
<!--          <div class="btn-wrap">-->
<!--            -->
<!--          </div>-->
<!--        </div>-->
        <div class="analyse-content">
        <div class="tree-list">
          <el-scrollbar style="height: 100%;">
            <BasProcessTree style="margin:0 10px" showView="3" @confirm="handleNodeClick" />
          </el-scrollbar>
        </div>
          <div class="chartsBg1" v-if="treeData.type === '1' || treeData.type === '2'">
            <echar class="echar-line" :option="option"/>
          </div>
  <!--      </el-card>-->
      </div>
    </div>
<!--    <el-dialog :visible.sync="isViewDialog" :title="$t('selectProcess')">-->
<!--      <BasProcessTree showView="3" @confirm="handleNodeClick"/>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--      <el-button type="primary" @click="isViewDialog=false">{{ $t('confirm') }}</el-button>-->
<!--    </span>-->
<!--    </el-dialog>-->
  </el-card>
</template>
<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'

Vue.use(BasProcessTree)
import echar from '@/bpm/components/echarts/echarts'
// import treeProcessFlow from '@/bpm/components/treeProcessFlow'
import {getSyncAnalysis} from '@/bpm/api/monitor/index.js'

export default {
  name: 'correspondingPeriod',
  components: {
    echar,
    // treeProcessFlow
  },
  data() {
    return {
      isViewDialog: false,
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
        disabledDate(time) {
          return time.getTime() > new Date().setFullYear((new Date().getFullYear() - 1))
        }
      }
    }
  },
  methods: {
    getData() {
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
    refreshData() {
    },
    initEchar() {
      this.option = {
        color: ['#2FC25B', '#09EEF5', '#0092f6'],
        // backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '50',
          right: '50'
        },
        legend: {
          data: [this.year.toString().split(' ')[3], new Date().toString().split(' ')[3], '增长百分比(%)'],
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
            data: this.monthList,
            axisLine: {
              lineStyle: {
                color: '#397cbc'
              }
            },
            axisLabel: {
              color: '#30eee9'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.$t('numberOfProcessInitiates'),
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
              color: '#2ad1d2'
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
            name: this.$t('percentageIncreaseOverTheSamePeriod'),
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
              color: '#2ad1d2'
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
    handleNodeClick(data) {
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

  .choose-process-title {
    color: #0de8f7;
    font-size: 14px;
  }

  .choose-process {
    display: inline-block;
    margin: 0 10px 0 5px;
    border: #0de8f7 1px solid;
    color: #fff;
    padding: 0 10px;
    cursor: pointer;
  }

  .analyse-content {
    display: flex;
    flex-direction: row;
    min-height: 50vh;
    justify-content: space-between;
    .tree-list {
      //background: #2e2e2e;
      padding: 10px;
      border-radius: 3px;
      height: 70vh;
      margin-right: 10px;

      /deep/.el-tree {
        background: none !important;

        .is-current {
          &>.el-tree-node__content {
            background: none !important;
            //border: #80bae8 1px solid;
            border-radius: 4px;
            box-shadow: 0px 0px 10px #aacae7 inset;
          }
        }
        .el-tree-node__content {
          &:hover, &:focus{
            background: none !important;
            //border: #80bae8 1px solid;
            border-radius: 4px;
            box-shadow: 0px 0px 10px #98c8ef inset;
          }

        }
        .el-tree-node:focus > .el-tree-node__content {
          background: none;
        }
      }


      /deep/.el-scrollbar__wrap{
        overflow-x: hidden;
      }
    }
  }

  .chartsBg1 {
    height: 540px;
    position: relative;
    background: url("../../../../../bpa/assets/img/qietu/zdlcbzh-cd.png") no-repeat;
    background-size: 100% 100%;
    padding: 24px 36px;
    flex:1;

    .operationEcharts {
      padding: 10px 32px;
    }
  }

  /deep/ .el-form-item__label{
    color: #0de8f7;
  }

  .item-right {
    //float: right;
    //width: 78%;
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
