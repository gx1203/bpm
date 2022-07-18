<template>
  <div id="bpaAnalysis" class="w100 bpaAnalysis">
    <el-row :gutter="20" style="padding-bottom: 20px; margin-top: 20px">
      <div class="process">
        <div>
          {{ $t('businessDomain') }}
          <el-cascader
            v-model="processValue"
            :placeholder="pleaseEnterBusinessDomain"
            :title="pleaseEnterBusinessDomain"
            :options="options"
            :props="props"
            collapse-tags
            clearable
          />
          <el-button type="primary" @click="submitForm1">
            {{ $t('query') }}
          </el-button>
        </div>
      </div>
      <analysisHeader :header-list="headerList" />
    </el-row>
    <el-row :gutter="30" style="padding-bottom: 20px">
      <el-col :span="24">
        <div class="chartsBg1">
          <div class="flexBox">
            <h4 class="pieTitleH">
              {{ $t('processRelease') }}
            </h4>
            <div class="processdetails details">
              <router-link
                :to="{
                  path: '/analyseWatchCenter/bpa/Details',
                  query: { processValue: processValue }
                }"
              >
                {{ $t('checkDetails') }}
              </router-link>
              <!-- <a href="#/analyseWatchCenter/bpa/Details">查看明细</a> -->
            </div>
          </div>
          <div style="height: 40px" />
          <div class="operationEcharts">
            <div class="datePicker">
              <span>{{ $t('startDate2') }}</span>
              <el-date-picker
                v-model="processstartTime"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :placeholder="startDate"
              />
              <span>{{ $t('endDate2') }}</span>
              <el-date-picker
                v-model=        "processendTime"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="endDate"
              />
              <el-button type="primary" size="mini" @click="submitForm">
                {{ $t('query') }}
              </el-button>
            </div>
            <div ref="operationExample" class="w100 h100 processBar" />
            <div id="tip" class="tipname hide" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding-bottom: 40px">
      <el-col :span="12">
        <div class="chartsBg">
          <div class="flexBox">
            <h4 class="pieTitle">
              {{ $t('positionParticipation') }}
            </h4>
            <div class="details">
              <a href="#/analyseWatchCenter/bpaPostDetails">{{
                $t('toViewMore')
              }}</a>
            </div>
          </div>
          <div style="height: 40px" />
          <div class="operationEcharts">
            <div ref="approvalTime" class="w100 positionBar" />
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chartsBg">
          <h4 class="pieTitle">
            {{ $t('flowReadingVolume') }}
          </h4>
          <div class="operationEcharts">
            <!-- <div class="padding10">
              <el-radio-group v-model="getDateData" size="small" @change="getTop">
                <el-radio-button label="day">今日</el-radio-button>
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-model="readingDate"
                type="daterange"
                range-separator="——"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="getReadingDate"/>
            </div>-->
            <div class>
              <div ref="processNode" class="w100 processBar1" />
              <div id="tip1" class="tipname hide" />
            </div>
            <!-- <div class="processNum">
              <div>
                <p class="processName">
                  {{ $t('releaseProcesses') }}
                </p>
                <p class="num">
                  {{ weekAddData.weekReleaseTotal || '' }}
                </p>
                <p>
                  {{ $t('weeksFrom') }}
                  <i
                    v-if="weekAddData.rateStauts == false"
                    class="el-icon-bottom dec"
                  />
                  <i
                    v-if="weekAddData.rateStauts == true"
                    class="el-icon-top up"
                  />
                  {{ weekAddData.weekRate || '' }}
                </p>
              </div>
              <div>
                <p class="processName">
                  {{ $t('updateProcesses') }}
                </p>
                <p class="num">
                  {{ weekUpdateData.weekReleaseTotal || '' }}
                </p>
                <p>
                  {{ $t('weeksFrom') }}
                  <i
                    v-if="weekUpdateData.rateStauts == false"
                    class="el-icon-bottom dec"
                  />
                  <i
                    v-if="weekUpdateData.rateStauts == true"
                    class="el-icon-top up"
                  />
                  {{ weekUpdateData.weekRate || '' }}
                </p>
              </div>
            </div> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import $ from 'jquery'
import 'echarts-liquidfill'
import analysisHeader from '../../../components/AnalysisHeader.vue'
import { formatDate, getMonthDays } from '@/bpa/utils/common.js'
// 接口请求部分
import {
  getBpaNum,
  getOneFrameworkList,
  getPositionParticipation,
  getProcessReadingDetail,
  getNewProcessNumRate,
  getUpdateProcessNumRate,
  getProcessFlow
} from '@/bpa/api/analyseWatchCenter'

export default {
  components: {
    analysisHeader
  },
  data() {
    return {
      getProcessAddData: [],
      weekUpdateData: {},
      weekAddData: {},
      readingDate: [],
      endTime: '',
      startTime: '',
      processendTime: '',
      processstartTime: '',
      props: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        multiple: true
      },
      headerList: [
        {
          num: '0',
          name: this.$t('totalNumberOfReleaseProcesses'),
          ico: 'el-icon-s-promotion',
          color: '#06abb9',
          title: 'BPA' + this.$t('totalNumberOfPublishedProcesses')
        },
        {
          num: '0',
          name: this.$t('totalNumberOfProcessNodes'),
          ico: 'el-icon-connection',
          color: '#b35141',
          title: 'BPA' + this.$t('totalNumberOfNodesPublishedProcess')
        },
        // {
        //   num: "0",
        //   name: this.$t("businessObject"),
        //   ico: "el-icon-date",
        //   color: "#544fcd",
        //   title:
        //     "BPA" +
        //     this.$t(
        //       "Totalnumberofbusinessobjectsassociatedwithpublishedprocessnodes"
        //     ),
        // },
        {
          num: '0',
          name: this.$t('coverJobs'),
          ico: 'el-icon-s-custom',
          color: '#019874',
          title: 'BPA' + this.$t('numberOfJobsInvolvedPublishedProcess')
        },
        {
          num: '0',
          name: this.$t('manualNode'),
          ico: 'el-icon-copy-document',
          color: '#b37e11',
          title: 'BPA' + this.$t('totalNumberOfOfflineNodesInPublishedProcess')
        },
        {
          num: '0',
          name: this.$t('onlineNode'),
          ico: 'el-icon-crop',
          color: '#3577c0',
          title: 'BPA' + this.$t('totalNumberOfOnlineNodesInPublishedProcess')
        }
      ],
      getDateData: 'year',
      processValue: [],
      value1: '',
      options: [],
      processValues: '',
      value: '',
      startDate: this.$t('placeholderText.startDate'),
      endDate: this.$t('placeholderText.endDate'),
      pleaseEnterBusinessDomain: this.$t(
        'placeholderText.pleaseEnterBusinessDomain'
      ),
      published: this.$t('published'),
      hasBeenUpdated: this.$t('hasBeenUpdated'),
      unfinished: this.$t('unfinished')
    }
  },
  computed: {},

  mounted() {
    this.setApprovalTime('')
    this.getBpaNumList('')
    this.getModelTree()
    this.getTop()
    this.getAddNum('')
    this.getUpdateNum('')
  },
  methods: {
    // 获取年月日
    getTop() {
      var now = new Date() // 当前日期
      var nowDayOfWeek = now.getDay() - 1 // 今天本周的第几天
      var nowDay = now.getDate() // 当前日
      var nowMonth = now.getMonth() // 当前月
      var nowYear = now.getFullYear() // 当前年
      var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
      var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
      this.processstartTime = formatDate(new Date(monthStartDate))
      this.processendTime = formatDate(new Date(monthEndDate))
      this.setOperationExample('')
      switch (this.getDateData) {
        case 'day': {
          this.endTime = nowYear + '-' + nowMonth + '-' + nowDay
          this.startTime = nowYear + '-' + nowMonth + '-' + nowDay
          this.setProcessNode('')
          break
        }
        case 'week': {
          this.startTime = formatDate(weekStartDate)
          this.endTime = formatDate(weekEndDate)
          this.setProcessNode('')
          break
        }
        case 'month': {
          this.startTime = formatDate(monthStartDate)
          this.endTime = formatDate(monthEndDate)
          this.setProcessNode('')
          break
        }
        case 'year': {
          this.startTime = '2019-01-01'
          this.endTime = formatDate(new Date())
          this.setProcessNode('')
          break
        }
      }
    },
    // 时间格式转换
    formatDateTime(date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      // d = d < 10 ? ('0' + d) : d
      // var h = date.getHours()
      // var minute = date.getMinutes()
      // minute = minute < 10 ? ('0' + minute) : minute
      return y + '-' + m + '-' + d
    },
    getReadingDate(ele) {
      if (ele == null) {
        this.readingDate = []
      } else {
        this.startTime = this.formatDateTime(this.readingDate[0])
        this.endTime = this.formatDateTime(this.readingDate[1])
      }
      this.setProcessNode()
    },
    submitForm(ele) {
      this.setOperationExample()
    },
    // 选择业务域确定
    submitForm1() {
      this.processValues = this.processValue.toString()
      this.setOperationExample()
      this.setApprovalTime()
      this.getBpaNumList()
      this.setProcessNode()
      this.getAddNum()
      this.getUpdateNum()
    },
    // 获取流程框架
    getModelTree() {
      getOneFrameworkList({}).then(res => {
        const arr = res
        arr.forEach(function(item) {
          delete item.children
        })
        const map = {} // 构建map
        arr.forEach(i => {
          map[i.id] = i // 构建以area_id为键 当前数据为值
        })
        const treeData = []
        arr.forEach(child => {
          const mapItem = map[child.pid] // 判断当前数据的parent_id是否存在map中
          if (mapItem) {
            // 存在则表示当前数据不是最顶层的数据
            // 注意： 这里的map中的数据是引用了arr的它的指向还是arr,当mapItem改变时arr也会改变，踩坑点
            ;(mapItem.children || (mapItem.children = [])).push(child) // 这里判断mapItem中是否存在child
          } else {
            // 不存在则是顶层数据
            treeData.push(child)
          }
        })
        this.options = treeData
      })
    },

    // 流程发布情况
    setOperationExample() {
      const firstChild = echarts.init(this.$refs.operationExample)
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
      const obj =
        'time=' +
        this.processstartTime +
        ',' +
        this.processendTime +
        '&' +
        'id=' +
        this.processValues

      getProcessFlow(obj).then(res => {
        const nameList = res.map(item => item.name)
        const releaseValueList = res.map(item => item.releaseValue)
        const updateValueList = res.map(item => item.updateValue)
        const unfinishedValueList = res.map(item => item.unfinishedValue)
        var option = {
          color: ['#00f6ff', '#03989f', '#4aa4ff'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: [this.published, this.hasBeenUpdated, this.unfinished],
            textStyle: {
              //   fontSize: 18, // 字体大小
              color: '#ffffff' // 字体颜色
            }
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                show: true,
                rotate: 60,
                formatter: function(value) {
                  return value.length > 6 ? value.slice(0, 6) + '...' : value
                },
                textStyle: {
                  fontSize: 12,
                  color: '#fff'
                }
              },
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#6EEBFF',
                  width: '1'
                }
              },
              data: nameList,
              triggerEvent: true
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
              name: this.published,
              type: 'bar',
              stack: '广告',
              barWidth: 15,
              data: releaseValueList
            },
            {
              name: this.hasBeenUpdated,
              type: 'bar',
              stack: '广告',
              barWidth: 15,
              data: updateValueList
            },
            {
              name: this.unfinished,
              type: 'bar',
              barWidth: 15,
              data: unfinishedValueList
              // markLine: {
              //   // lineStyle: {
              //   //   normal: {
              //   //     type: 'dashed'
              //   //   }
              //   // },
              //   data: [
              //     [{ type: 'min' }, { type: 'max' }]
              //   ]
              // }
            }
          ]
        }
        firstChild.setOption(option)
      })
    },
    // 岗位参与情况Top10
    setApprovalTime() {
      const firstChild = echarts.init(this.$refs.approvalTime)
      const obj = 'ids=' + this.processValues
      getPositionParticipation(obj).then(res => {
        const nameList = res.map(item => item.detpName)
        const countList = res.map(item => item.count)
        var option = {
          color: ['#08eff4'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            // data: ['2011年']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                type: 'none'
                // color: '#6EEBFF',
                // width: '1'
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#1f4771'
              }
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: '#fff'
              }
            },
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            inverse: true, // 倒叙
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
                fontSize: 14,
                color: '#fff'
              }
            },
            data: nameList
          },
          series: [
            {
              // name: '2011年',
              type: 'bar',
              barWidth: 30,
              label: {
                normal: {
                  position: 'right',
                  show: true,
                  textStyle: {
                    fontWeight: 'bolder',
                    fontSize: '12',
                    fontFamily: '微软雅黑',
                    color: '#fff'
                  }
                }
              },
              data: countList
            }
          ]
        }
        firstChild.setOption(option)
      })
    },
    // 流程阅读量
    setProcessNode() {
      const firstChild = echarts.init(this.$refs.processNode)
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
        $('#tip').hide()
      })
      const obj =
        'startTime=' +
        this.startTime +
        '&endTime=' +
        this.endTime +
        '&ids=' +
        this.processValues
      getProcessReadingDetail(obj).then(res => {
        if (!res || res.list == []) {
          return false
        }
        if (res == null) {
          return
        }
        const nameList = res.map(item => item.name)
        const browserNumList = res.map(item => item.browserNum)
        var option = {
          color: ['#00dfc8'],
          // dataZoom: [{
          //   type: 'inside'
          // }, {
          //   type: 'slider'
          // }],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
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
              show: true,
              formatter: function(value) {
                return value.length > 4 ? value.slice(0, 3) + '...' : value
              },
              textStyle: {
                fontSize: 14,
                color: '#fff'
              }
            },
            triggerEvent: true,
            data: nameList
          },
          yAxis: {
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
                fontSize: 14,
                color: '#fff'
              }
            }
          },
          series: [
            {
              smooth: true,
              data: browserNumList,
              type: 'line',
              areaStyle: {
                color: ['#05253b']
              }
            }
          ]
        }
        firstChild.setOption(option)
      })
    },
    // 获取关键指标
    getBpaNumList() {
      const obj = 'id=' + this.processValues
      getBpaNum(obj).then(res => {
        console.log(res)
        this.headerList.map(item => {
          if (item.name === '发布流程总数') {
            this.$set(item, 'num', res.totalNum)
          }
          if (item.name === '流程节点总数') {
            this.$set(item, 'num', res.nodeNum)
          }
          if (item.name === '业务对象') {
            this.$set(item, 'num', res.boNum)
          }
          if (item.name === '覆盖岗位') {
            this.$set(item, 'num', res.jobNum)
          }
          if (item.name === '手工节点') {
            this.$set(item, 'num', parseInt(res.offlineNodeNum))
          }
          if (item.name === '线上节点') {
            this.$set(item, 'num', parseInt(res.taskNodeNum))
          }
        })
      })
    },
    // 获取本周发布流程数
    getAddNum() {
      const obj = 'ids=' + this.processValues
      getNewProcessNumRate(obj).then(res => {
        if (!res || !res.data) {
          return false
        }
        this.weekAddData = res.data
      })
    },
    // 获取本周更新发布流程数
    getUpdateNum() {
      const obj = 'ids=' + this.processValues
      getUpdateProcessNumRate(obj).then(res => {
        if (!res || !res.data) {
          return false
        }
        this.weekUpdateData = res
      })
    }
  }
}
</script>

<style scoped lang="scss">
#bpaAnalysis {
  color: #fff;
  .operationEcharts {
    width: 100%;
    // height: 500px;
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
  .padding10 {
    padding-top: 60px;
    margin-left: 50px;
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .pieTitleH {
    color: #ffffff;
    height: 36px;
    position: absolute;
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
    top: 10px;
    z-index: 30;
    font-size: 16px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
    left: 3%;
  }
  .up {
    color: #019774;
    font-size: 14px;
    margin: 0 2px;
  }
  .dec {
    font-size: 14px;
    color: #fe6d4c;
    margin: 0 2px;
  }
  .processNum {
    display: flex;
    justify-content: space-around;
  }
  .num {
    font-size: 30px;
    color: #0de8f7;
  }
  .processName {
    font-size: 16px;
  }
  .processBar {
    width: 100%;
    height: 500px;
  }
  .processBar1 {
    height: 400px;
    margin-bottom: 10px;
  }
  .positionBar {
    // padding-top: 40px;
    height: 400px;
  }
  .details {
    position: absolute;
    right: 7%;
    top: 20px;
    font-size: 16px;
    a {
      width: 100%;
      height: 36px;
      display: inline-block;
      color: #fff;
    }
  }
  .processdetails {
    right: 3%;
  }
  .process {
    text-align: right;
    margin-bottom: 14px;
    margin-right: 14px;
  }
  .datePicker {
    padding: 10px;
    margin-left: 80px;
  }
  .chartsBg {
    position: relative;
    background: url('../../../assets/img/qietu/borderImg.png') no-repeat;
    background-size: 100% 100%;
    height: 500px;
  }
  .chartsBg1 {
    height: 620px;
    position: relative;
    background-size: cover;
    background: url('../../../assets/img/qietu/bg_m.png') no-repeat;
  }
  .pieTitle {
    color: #ffffff;
    height: 36px;
    position: absolute;
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
    top: 10px;
    left: 7%;
    z-index: 30;
    font-size: 16px;
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
