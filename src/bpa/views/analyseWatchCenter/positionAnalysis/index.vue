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
            :placeholder="selectYear"
            :title="selectYear"/>
        </el-col>
        <el-col :span="3">
          <select-month @getSeason="getMonthTime" />
        </el-col>
        <el-col :span="6" style="textAlign:center">
          <span>{{$t("businessDomain")}}</span>
          <el-cascader
            v-model="processValue"
            :placeholder="pleaseSelect"
            :title="pleaseSelect"
            :options="options"
            collapse-tags
            :props="props"
            clearable
          />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForm">{{$t("query")}}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" style="margin-bottom:20px">
      <el-col :span="19">
        <div class="chartsBg">
          <div class="pieTitle">
            <h4 class="pieTitleH text_overflow">{{$t("averageLengthOfApprovalForPosition")}}</h4>
            <div class="details" @click="dialogVisible=true">{{$t("chooseAPosition")}}</div>
          </div>
          <div id="operationExample" class="operationEcharts1" />
          <div id="tip" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="5">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4 class="pieTitleH">{{$t("rankOfTheNumberOfApprovalProcessesInvolvedInJobParticipation")}}</h4>
            <div class="details">
              <a href="#/analyseWatchCenter/bpmPostProcessRanking">{{$t("toMore")}}</a>
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
                <p :title="item.name" class="text_overflow">{{ item.name }}</p>
              </el-col>
              <el-col :span="6" class="text_overflow">{{ item.inscount }}</el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:40px">
      <el-col :span="19">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4 class="pieTitleH">{{$t("cumulativeNumberOfPositionsHandled")}}</h4>
            <div class="details">
              <span style="margin-right:10px;color:#768EC9">{{ postName }}</span>
              <span @click="openOrgSelect">{{$t("chooseAPosition")}}</span>
            </div>
          </div>
          <div id="approvalTime" ref="approvalTime" class="operationEcharts" />
          <div id="tip1" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="5">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4 class="pieTitleH">{{$t("averageProcessingTimeRanking")}}</h4>
            <div class="details">
              <a :href="`#/analyseWatchCenter/bpmAverageProcessRanking?postID=${postID}`">{{$t("toMore")}}</a>
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
                <p :title="item.processnamecn" class="text_overflow">{{ item.processnamecn }}</p>
              </el-col>
              <el-col :span="6" class="text_overflow">{{ item.averagetime }}</el-col>
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
import selectMonth from '../../../components/SelectMonth.vue'
import { getTreeData, getFormateDate } from '../../../utils/common.js'
import newOrganization from '../../../components/newOrganization/index.vue'
// 接口请求部分
import {
  getModel,
  getPostAverageTime,
  getPostProcessRank,
  getPostApprovalCount,
  getPostAverage
} from '@/bpa/api/analyseWatchCenter'

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
      props: { multiple: true },
      labelPosition: 'right',
      value1: '',
      options: [
        {
          value: '1级菜单',
          label: '1.0愿景与战略'
        },
        {
          value: '2级菜单',
          label: '2.0市场营销'
        },
        {
          value: '3级菜单',
          label: '3.0产品研发'
        },
        {
          value: '4级菜单',
          label: '4.0订单到交付'
        },
        {
          value: '5级菜单',
          label: '5.0采购管理'
        },
        {
          value: '6级菜单',
          label: '6.0生产管理'
        },
        {
          value: '7级菜单',
          label: '7.0质量管理'
        },
        {
          value: '8级菜单',
          label: '8.0产品服务'
        },
        {
          value: '9级菜单',
          label: '9.0财务管理'
        },
        {
          value: '10级菜单',
          label: '10.0人力资源管理'
        },
        {
          value: '11级菜单',
          label: '11.0投资管理'
        },
        {
          value: '12级菜单',
          label: '12.0企业风险与合规管理'
        },
        {
          value: '13级菜单',
          label: '13.0信息技术'
        },
        {
          value: '14级菜单',
          label: '14.0行政法务管理'
        },
        {
          value: '15级菜单',
          label: '15.0测试'
        }
      ],
      pageNum: '1',
      value: '',
      processValue: '',
      onlyOne: false, // 选人组件只能选择一个值的标识
      postNameList: [],
      selectYear:this.$t("placeholderText.selectYear"),
      pleaseSelect:this.$t("placeholderText.pleaseSelect"),
      averageApprovalTime2:this.$t("averageApprovalTime2"),
      postApprovalTime:this.$t("postApprovalTime"),
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
        if (!res || !res.data) return false
        res = res.data.data
        this.getRankData = res.list
      })
    },
    // 获取流程树
    getModelTree() {
      getModel({}).then(res => {
        if (res.status == '200') {
          // this.options = getTreeData(res)
        }
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
          if (!res || !res.data) return false
          if (res.data == []) {
            return false
          }
          res = res.data.data
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
              data: [this.averageApprovalTime2, this.postApprovalTime],
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
                name: this.averageApprovalTime2,
                type: 'line',
                data: insaveragetimeList
              },
              {
                name: this.postApprovalTime,
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
        if (!res || !res.data) return false
        res = res.data.data
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
        if (!res || !res.data) return false
        res = res.data.data
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
  /deep/ .el-input__inner {
    background-color: transparent;
  }
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
    background: url("../../../assets/img/qietu/bg_m.png") no-repeat;
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
    background: url("../../../assets/img/qietu/good1.png") no-repeat;
    background-position: center;
  }
  .goodDivTop1 {
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 30;
    background: url("../../../assets/img/qietu/good2.png") no-repeat;
    background-position: center;
  }
  .goodDivTop2 {
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 30;
    background: url("../../../assets/img/qietu/good3.png") no-repeat;
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
    /deep/ el-input {
      background-color: transparent;
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
  .text_overflow {
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
