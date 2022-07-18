<template>
  <div id="position" class="w100 position">
    <div class="datePicker">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-date-picker clearable
            v-model="yearValue"
            type="year"
            format="yyyy"
            value-format="yyyy"
            :placeholder="$t('placeholderText.selectYear')"/>
        </el-col>
        <el-col :span="3">
          <select-month @getSeason="getMonthTime" />
        </el-col>
        <el-col :span="6" style="textAlign:center">
          <span>业务域</span>
          <el-cascader
            v-model="processValue"
            :options="options"
            :props="props"
            clearable
          />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForm">{{ $t('query') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" style="margin-bottom:20px">
      <el-col :span="19">
        <div class="chartsBg">
          <div class="pieTitle">
            <h4 class="pieTitleH text_overflow_2">岗位平均审批时长</h4>
            <div class="details" @click="dialogVisible=true">选择岗位</div>
          </div>
          <div id="operationExample" class="operationEcharts1" />
          <div id="tip" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="5">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4 class="pieTitleH">岗位参与审批的流程数排名</h4>
            <div class="details">
              <a href="#/analyseWatchCenter/bpmPostProcessRanking">更多</a>
            </div>
          </div>
          <div class="processNum">
            <el-row
              v-for="(item,index) in getRankData"
              :gutter="20"
              :key="index"
              style="line-height:36px"
            >
              <el-col :span="4">
                <div class="goodDivTop">
                  <span v-if="index==0">{{ index+1 }}</span>
                </div>
                <div class="goodDivTop1">
                  <span v-if="index==1">{{ index+1 }}</span>
                </div>
                <div class="goodDivTop2">
                  <span v-if="index==2">{{ index+1 }}</span>
                </div>
                <div class="goodDiv">
                  <span v-if="index>2">{{ index+1 }}</span>
                </div>
              </el-col>
              <el-col :span="14">
                <p :title="item.name" class="text_overflow_2">{{ item.name }}</p>
              </el-col>
              <el-col :span="6" class="text_overflow_2">{{ item.inscount }}</el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:40px">
      <el-col :span="19">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4 class="pieTitleH">岗位累计处理数量</h4>
            <div class="details">
              <span style="margin-right:10px;color:#768EC9">{{ postName }}</span>
              <span @click="openOrgSelect">选择岗位</span>
            </div>
          </div>
          <div id="approvalTime" ref="approvalTime" class="operationEcharts" />
          <div id="tip1" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="5">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4 class="pieTitleH">平均处理时长排名</h4>
            <div class="details">
              <a :href="`#/analyseWatchCenter/bpmAverageProcessRanking?postID=${postID}`">更多</a>
            </div>
          </div>
          <div class="processNum">
            <el-row
              v-for="(item,index) in getApprovalData"
              :gutter="20"
              :key="index"
              style="line-height:36px"
            >
              <el-col :span="4">
                <div class="goodDivTop">
                  <span v-if="index==0">{{ index+1 }}</span>
                </div>
                <div class="goodDivTop1">
                  <span v-if="index==1">{{ index+1 }}</span>
                </div>
                <div class="goodDivTop2">
                  <span v-if="index==2">{{ index+1 }}</span>
                </div>
                <div class="goodDiv">
                  <span v-if="index>2">{{ index+1 }}</span>
                </div>
              </el-col>
              <el-col :span="14">
                <p :title="item.processnamecn" class="text_overflow_2">{{ item.processnamecn }}</p>
              </el-col>
              <el-col :span="6" class="text_overflow_2">{{ item.averagetime }}</el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <newOrganization
      v-model="dialogVisible"
      :start-choice="startChoice"
      :only-one="onlyOne"
      @changeOnlyOne="changeOnlyOne"
      @getTransferData="getTransferData"
      @getTransferList="getTransferList"
    />
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'
import $ from 'jquery'
import selectMonth from '../components/SelectMonth.vue'
import { getTreeData, getFormateDate } from '@/bpm/utils/common.js'
import newOrganization from '../components/newOrganization/index.vue'
// 接口请求部分
import {
  getModel,
  getPostAverageTime,
  getPostProcessRank,
  getPostApprovalCount,
  getPostAverage
} from '@/bpm/api/analyseWatchCenter'

export default {
  components: {
    newOrganization,
    selectMonth
  },
  data() {
    return {
      yearValue: getFormateDate(new Date(), 'yyyy'),
      monthValue: '',
      startChoice: '3',
      postID: '',
      postName: '',
      transferList: [],
      getApprovalData: [],
      getRankData: [],
      dialogVisible: false,
      value3: [],
      defaultID: '',
      props: { checkStrictly: true, label: 'modelname', value: 'id' },
      labelPosition: 'right',
      value1: '',
      options: [],
      pageNum: '1',
      value: '',
      processValue: '',
      onlyOne: false, // 选人组件只能选择一个值的标识
      postNameList: []
    }
  },
  computed: {},
  mounted() {
    this.getModelTree()
    this.getPostProcessRankList()
    this.setPostAverageTime()
    this.getPostAverageList()
  },
  methods: {
    getMonthTime(data) {
      this.monthValue = data
      let yearData
      const date = new Date()
      if (this.monthValue == 12) {
        yearData = getFormateDate(new Date((date.getFullYear() - 1).toString()), 'yyyy')
        this.yearValue = yearData
      }
    },
    // 选择时间确定
    submitForm(ele) {
      this.setPostAverageTime()
      this.getPostProcessRankList()
    },
    // 选择多个岗位
    getTransferList(transferList) {
      this.transferList = transferList
      this.setPostAverageTime()
    },
    // 选择单个岗位
    getTransferData(val) {
      this.postName = val.label
      this.postID = val.id
      this.setApprovalTime(this.postID)
      this.getPostAverageList(this.postID)
    },
    // 获取岗位参与审批的流程数排名
    getPostProcessRankList() {
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1],
          date: this.yearValue + '-' + this.monthValue
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: 'inscount',
        pageNum: this.pageNum,
        pageSize: 10,
        sort: 'desc'
      }
      getPostProcessRank(obj).then(res => {
        this.getRankData = res.list
      })
    },
    // 获取流程树
    getModelTree() {
      getModel({}).then(res => {
        this.options = getTreeData(res)
      })
    },
    // 获取岗位平均审批时长
    setPostAverageTime() {
      const operationExample = document.getElementById('operationExample')
      const firstChild = echarts.init(operationExample)
      firstChild.on('mouseover', function(params) {
        // 鼠标经过图表时候判断参数  ---请开始你的表演
        if (params.componentType === 'xAxis') {
          var tt = $('#tip')
          tt.html(params.value)
          tt.css('left', params.event.event.layerX + 10)
          tt.css('top', params.event.event.layerY + 20)
          tt.show()
        }
      })
      firstChild.on('mouseout', function(params) {
        $('#tip').hide()
      })
      const idList = this.transferList
      const obj = {
        modelid: this.processValue[this.processValue.length - 1] || '',
        date: this.yearValue + '-' + this.monthValue,
        postid: idList.toString()
      }

      getPostAverageTime(obj)
        .then(res => {
          const nameList = res.map(item => item.name)
          const averagetimeList = res.map(item => item.averagetime)
          const insaveragetimeList = res.map(item => item.insaveragetime)
          if (res.length === 0) {
            this.defaultID = '' // 报错
            this.postName = ''
          } else {
            this.postName = res[0].name
            this.defaultID = res[0].postid // 报错
            console.log(this.defaultID, 4789)
          }

          var option = {
            color: ['#00f6ff', '#03989f'],
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['平均审批时长', '岗位审批时长'],
              textStyle: {
                //   fontSize: 18, // 字体大小
                color: '#ffffff' // 字体颜色
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                // saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: true,
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              axisLabel: {
                rotate: 60,
                formatter: function(value) {
                  return value.length > 6 ? value.slice(0, 6) + '...' : value
                },
                textStyle: {
                  fontSize: 14,
                  color: '#ffffff'
                },
                show: true
              },
              triggerEvent: true,
              data: nameList
            },
            yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#1f4771'
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  fontSize: 14,
                  color: '#fff'
                }
              }
            },
            series: [
              {
                name: '平均审批时长',
                type: 'line',
                data: insaveragetimeList
              },
              {
                name: '岗位审批时长',
                type: 'line',
                data: averagetimeList
              }
            ]
          }

          firstChild.setOption(option)
        })
        .then(res => {
          this.postID = this.defaultID
          this.setApprovalTime(this.defaultID)
          this.getPostAverageList(this.defaultID)
        })
    },
    // 岗位累计处理数量
    setApprovalTime(id_) {
      const approvalTime = document.getElementById('approvalTime')
      const firstChild = echarts.init(approvalTime)
      firstChild.on('mouseover', function(params) {
        // 鼠标经过图表时候判断参数  ---请开始你的表演
        if (params.componentType === 'xAxis') {
          var tt = $('#tip1')
          tt.html(params.value)
          tt.css('left', params.event.event.layerX + 10)
          tt.css('top', params.event.event.layerY + 20)
          tt.show()
        }
      })
      firstChild.on('mouseout', function(params) {
        $('#tip1').hide()
      })
      const obj = {
        attr: {
          postid: id_,
          modelid: this.processValue[this.processValue.length - 1],
          date: this.yearValue + '-' + this.monthValue
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: 'inscount',
        pageNum: this.pageNum,
        pageSize: 10,
        sort: 'desc'
      }
      getPostApprovalCount(obj).then(res => {
        const nameList = res.list.map(item => item.processnamecn)
        const inscountList = res.list.map(item => item.inscount)
        var option = {
          color: ['#08eff4'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
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
              data: nameList,
              triggerEvent: true,
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              axisLabel: {
                show: true,
                rotate: 60,
                formatter: function(value) {
                  return value.length > 4 ? value.slice(0, 4) + '...' : value
                },
                textStyle: {
                  fontSize: 14,
                  color: '#ffffff'
                }
              },
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: '#1f4771'
                }
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              }
            }
          ],
          series: [
            {
              name: '数量',
              type: 'bar',
              barWidth: '40px',
              data: inscountList
            }
          ]
        }

        firstChild.setOption(option)
      })
    },
    // 指定岗位流程的平均处理时长排名
    getPostAverageList(postID) {
      const obj = {
        attr: {
          postid: postID,
          modelid: this.processValue[this.processValue.length - 1],
          date: this.yearValue + '-' + this.monthValue
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: 'averagetime',
        pageNum: this.pageNum,
        pageSize: 10,
        sort: 'desc'
      }
      getPostAverage(obj).then(res => {
        this.getApprovalData = res.list
      })
    },
    openOrgSelect() {
      this.dialogVisible = true
      this.onlyOne = true
    },
    changeOnlyOne(val) {
      console.log(val)
      this.onlyOne = val
    }
  }
}
</script>

<style scoped lang="scss">
#position {
  color: #768ec9;
  .operationEcharts1 {
    width: 100%;
    height: 440px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .details {
    position: absolute;
    right: 7%;
    top: 10px;
    a {
      color: #fff;
    }
  }
  .processNum {
    padding-top: 40px;
  }
  .pieTitleH {
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
    position: absolute;
    top: 10px;
    left: 3%;
  }
  .processdetails {
    right: 10%;
  }
  .chartsBg {
    position: relative;
    background: url("../../../assets/img/analyseWatchCenter/bg_m.png") no-repeat;
    background-size: 100% 100%;
    height: 500px;
  }

  .hide {
    display: none;
  }
  .tipname {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    max-width: 400px;
    padding: 5px;
    z-index: 1;
    color: #fff;
  }

  .goodDiv {
    width: 100%;
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 30;
    background-position: center;
  }
  .goodDivTop {
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 30;
    background: url("../../../assets/img/analyseWatchCenter/good1.png") no-repeat;
    background-position: center;
  }
  .goodDivTop1 {
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 30;
    background: url("../../../assets/img/analyseWatchCenter/good2.png") no-repeat;
    background-position: center;
  }
  .goodDivTop2 {
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 30;
    background: url("../../../assets/img/analyseWatchCenter/good3.png") no-repeat;
    background-position: center;
  }
  .goodImg {
    position: absolute;
    top: 8px;
    left: 20px;
  }
  .details:hover {
    cursor: pointer;
  }
  .processNode {
    width: 100%;
    height: 350px;
  }
  .process {
    display: flex;
    justify-content: space-between;
  }
  .datePicker {
    margin-bottom: 20px;
    text-align: right;
    span {
      margin-left: 20px;
    }
  }
  .pieTitle {
    color: #ffffff;
    width: 100%;
    height: 36px;
    font-size: 16px;
    padding-left: 10px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
  }
  .run {
    display: flex;
    text-align: center;
    justify-content: space-around;
    .runItem {
      width: 18%;
    }
  }
  .operationEcharts {
    height: 440px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
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
