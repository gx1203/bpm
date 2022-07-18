<template>
  <div id="operation" class="w100 operation">
    <div class="datePicker">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-date-picker
            v-model="yearValue"
            type="year"
            format="yyyy"
            value-format="yyyy"
            :placeholder="selectYear"
            :title="selectYear"
          />
        </el-col>
        <el-col :span="3">
          <select-month @getSeason="getMonthTime" />
        </el-col>
        <el-col :span="6" style="textAlign:center">
          <span>{{$t("businessDomain")}}</span> &nbsp;
          <el-cascader
            v-model="processValue"
            :options="operation"
            :placeholder="pleaseEnterBusinessDomain"
            :title="pleaseEnterBusinessDomain"
            collapse-tags
            :props="props"
            clearable
          />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="mini" @click="submitForm">
            {{$t("query")}}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20" style="padding-bottom:20px">
      <analysisHeader :header-list="headerList" />
    </el-row>
    <el-row :gutter="20" style="padding-bottom:20px">
      <el-col :span="19">
        <div class="chartsBg">
          <div class="flexBox">
            <h4 class=" pieTitle">
              <!-- 运行实例 -->
              {{$t("runningInstance")}}
            </h4>
            <div class="details processdetails" @click="getProcessList">
              <!-- 选择流程 -->
              {{$t("selectProcess")}}
            </div>
          </div>
          <div id="operationExample" class="operationEcharts1" />
          <div id="tip" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="5">
        <div class="chartsBg">
          <div class="flexBox">
            <h4 class=" pieTitle">
              {{$t("processInitiationNumberRanking")}}
            </h4>
            <div class="details">
              <a href="#/analyseWatchCenter/ProcessInitiationRanking">{{$t("toMore")}}</a>
            </div>
          </div>
          <div class="processNum">
            <el-row
              v-for="(item,index) in proseeRankData"
              :key="index"
              :gutter="20"
              style="line-height:36px;"
            >
              <el-col :span="4">
                <div class="goodDivTop goodDiv">
                  <span v-if="index==0">{{ index+1 }}</span>
                </div>
                <div class="goodDivTop1 goodDiv">
                  <span v-if="index==1">{{ index+1 }}</span>
                </div>
                <div class="goodDivTop2 goodDiv">
                  <span v-if="index==2">{{ index+1 }}</span>
                </div>
                <div class="goodDiv">
                  <span v-if="index>2">{{ index+1 }}</span>
                </div>
              </el-col>
              <el-col :span="14">
                <p :title="item.processnamecn" class="text_overflow_2">
                  {{ item.processnamecn }}
                </p>
              </el-col>
              <el-col :span="6">
                {{ item.applycount }}
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding-bottom:40px">
      <el-col :span="12">
        <div class="chartsBg chartsBg1">
          <h4 class="pieTitle processTitleH">
            {{$t("averageApprovalTime")}}
          </h4>
          <div id="approvalTime" ref="approvalTime" class="operationEcharts" />
          <div id="tip1" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chartsBg chartsBg1">
          <h4 class="pieTitle processTitleH">
            {{$t("averageFlowTimeOfSingleProcess")}}
          </h4>
          <div style="padding:10px 10px 0 40px;">
            <el-radio-group v-model="radio1" @change="getTop">
              <el-radio-button v-if="getProcessAverageData[0]" label="Top1" />
              <el-radio-button v-if="getProcessAverageData[1]" label="Top2" />
              <el-radio-button v-if="getProcessAverageData[2]" label="Top3" />
              <el-radio-button v-if="getProcessAverageData[3]" label="Top4" />
              <el-radio-button v-if="getProcessAverageData[4]" label="Top5" />
            </el-radio-group>
            <div style="margin-top:10px">
              {{ name }}
            </div>
          </div>
          <div ref="processNode" class="processNode" />
          <div id="tip3" class="tipname hide" />
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="800px" :title="selectProcess">
      <el-input
        v-model="processName"
        clearable
        :placeholder="pleaseEnterSearchContent"
        :title="pleaseEnterSearchContent"
        prefix-icon="el-icon-search"
        style="margin-bottom:10px;width:200px"
        @change="getSearch"
        @keyup.enter.native="getSearch"
      />
      <el-transfer
        v-model="processValueData"
        :data="processData"
        :titles="[processList, selectedProcess]"
        :filter-placeholder="pleaseEnterFlowPinyin"
      >
        <span slot-scope="{ option }" :title="option.label">{{ option.label }}</span>
        <el-button v-show="showMore" slot="left-footer" @click="loadMore">
          {{$t("toMore")}}
        </el-button>
      </el-transfer>
      <div style="text-align:right">
        <el-button type="primary" @click="remove">
          {{$t("cancel")}}
        </el-button>
        <el-button type="primary" @click="processQuit">
          {{$t("confirm")}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'
import $ from 'jquery'
import selectMonth from '../../../components/SelectMonth.vue'
import { getTreeData, getFormateDate } from '../../../utils/common.js'
import analysisHeader from '../../../components/AnalysisHeader.vue'
// 接口请求部分
import {
  getModel,
  getOperationList,
  getProcessList,
  getKeyList,
  getProcessRank,
  getProcessAverageTime,
  getTreeNodeWithoutAuthCopy
} from '@/bpa/api/analyseWatchCenter'

export default {
  components: {
    analysisHeader,
    selectMonth
  },
  data() {
    return {
      yearValue: getFormateDate(new Date(), 'yyyy'),
      monthValue: '',
      showMore: false,
      pages: '',
      name: '',
      processName: '',
      topList: [],
      getProcessAverageData: [],
      processNodeData: [],
      proseeRankData: [],
      processValue: '',
      startTime: '',
      endTime: '',
      operation: [],
      headerList: [
        {
          num: 110,
          name: this.$t("totalNumberOfRunningProcesses"),
          ico: 'el-icon-s-promotion',
          color: '#07aab9',
          title: this.$t("numberOfRunningProcesses")
        },
        {
          num: 0,
          name: this.$t("totalNumberOfOutstandingProcesses"),
          ico: 'el-icon-thumb',
          color: '#b45041',
          title: this.$t("numberOfRunningProcessesNodes")
        },
        {
          num: 0,
          name: this.$t("numberOfProcessingNodes"),
          ico: 'el-icon-document-copy',
          color: '#019774',
          title: this.$t("totalNumberOfProcessApplications")
        },
        {
          num: 0,
          name: this.$t("coverPerson"),
          ico: 'el-icon-s-custom',
          color: '#b37d11',
          title: this.$t("totalNumberOfParticipantsInTheRunningProcess")
        },
        {
          num: 0,
          name: this.$t("coverJobs"),
          ico: 'el-icon-set-up',
          color: '#3676c0',
          title: this.$t("numberOfJobsInvolvedInTheRunningProcess")
        }
      ],
      dialogVisible: false,
      processData: [],
      processValueData: [],
      processDataString: '',
      props: { multiple: true },
      radio1: 'Top1',
      optionsLsit: [],
      value: '',
      pageNum: '1',
      selectYear:this.$t("placeholderText.selectYear"),
      selectProcess:this.$t("selectProcess"),
      processList:this.$t("processList"),
      selectedProcess:this.$t("selectedProcess"),
      pleaseEnterSearchContent:this.$t("placeholderText.pleaseEnterSearchContent"),
      pleaseEnterFlowPinyin:this.$t("placeholderText.pleaseEnterFlowPinyin"),
      pleaseEnterBusinessDomain:this.$t("placeholderText.pleaseEnterBusinessDomain"),
      completed:this.$t("completed"),
      beingProcessed:this.$t("beingProcessed"),
      averageApprovalTime2:this.$t("averageApprovalTime2"),
      durationOfProcessApproval:this.$t("durationOfProcessApproval"),
      aMaximumOf10ProcessesCanBeSelected:this.$t("hintText.aMaximumOf10ProcessesCanBeSelected"),
    }
  },
  computed: {},
  mounted() {
    this.getModelTree() // 获取业务域
    this.getKeyData()
    this.getProcessRankList()
    this.setApprovalTime()
    this.getTreeNodeWithoutAuthCopy()
    if(this.$route.query.processname){
      console.log('页面跳转');
      //  this.processDataString=this.$route.query.processname
       this.processValueData.push(this.$route.query.processname)
       console.log('this.processValueData',this.processValueData);
       this.processQuit() 
    //  this.processName=this.$route.query.processNameCn
    }else{
    this.setOperationExample()

    }
  },
  methods: {
    getTreeNodeWithoutAuthCopy(){
      getTreeNodeWithoutAuthCopy({}).then(res=>{
        console.log('下拉类别业务域', res);
        res.forEach(item=>{
          this.operation.push({
            value:item.id,
            label:item.name
          })
        })
         console.log('this.',this.operation);
      })
    },
    getSearch() {
      this.getProcess()
    },
    getMonthTime(data) {
      this.monthValue = data
      let yearData
      const date = new Date()
      if (this.monthValue == 12) {
        yearData = getFormateDate(new Date((date.getFullYear() - 1).toString()), 'yyyy')
        this.yearValue = yearData
      }
    },
    remove() {
      this.dialogVisible = false
      this.showMore = false
      this.pages = '0'
      this.pageNum = '1'
    },
    // 获取Top
    getTop() {
      switch (this.radio1) {
        case 'Top1':
          this.setProcessNode(0)
          break
        case 'Top2':
          this.setProcessNode(1)
          break
        case 'Top3':
          this.setProcessNode(2)
          break
        case 'Top4':
          this.setProcessNode(3)
          break
        case 'Top5':
          this.setProcessNode(4)
          break
      }
    },
    // 获取关键指标
    getKeyData() {
       let processValue=this.processValue[this.processValue.length - 1]
                 let val
      if(processValue instanceof   Array&&processValue.length!==0){
             val =processValue[0]
      }else{
         val=processValue
      }
      const obj = {
        modelid: val,
        date: this.yearValue + '-' + this.monthValue
      }
      getKeyList(obj).then(res => {
        if (res.data == []) {
          return false
        }
        // res = !res.data ? [] : res.data.data
        console.log('res,res',res);
        this.headerList.forEach(item => {
          if (item.name === '运行流程总数') {
            this.$set(item, 'num', res.processamount)
          }
          if (item.name === '未完成流程总数') {
            this.$set(item, 'num', res.runingprocessamount)
          }
          if (item.name === '处理节点数') {
            this.$set(item, 'num', res.nodeamount)
          }
          if (item.name === '覆盖人数') {
            this.$set(item, 'num', parseInt(res.useramount || 0))
          }
          if (item.name === '覆盖岗位') {
            this.$set(item, 'num', parseInt(res.postamount || 0))
          }
        })
      })
    },
    // 获取流程数排名
    getProcessRankList() {  
       let processValue=this.processValue[this.processValue.length - 1]
         let val
      if(processValue instanceof   Array&&processValue.length!==0){
             val =processValue[0]
      }else{
         val=processValue
      }
      const obj = {
        attr: {
        modelid: val,
          date: this.yearValue + '-' + this.monthValue
        },
        filters: [],
        fullFilters: [],
        logic: '',
        orderby: 'applycount',
        pageNum:this.pageNum,
        pageSize: 10,
        sort: 'desc'
      }
      getProcessRank(obj).then(res => {
        if (!res) return false
        if (res.data == []) {
          return false
        }
        // res = !res.data ? [] : res.data.data
        this.proseeRankData = res.list
      })
    },
    // 选择时间确定
    submitForm(ele) {
      console.log(this.processValue);
      console.log(ele)
      this.setOperationExample()
      this.getKeyData()
      this.getProcessRankList()
      this.setApprovalTime()
    },
    // 更多流程列表
    loadMore() {
      if (this.pages <= 1 || this.pageNum === 0) {
        // 总页数小于1或者已经点击到最后一页
        this.showMore = false
        return
      }
      let processValue=this.processValue[this.processValue.length - 1]
      let val
      if(processValue instanceof   Array&&processValue.length!==0){
             val =processValue[0]
      }else{
         val=processValue
      }
      const obj = {
        attr: {
        modelid: val,
        },
        filters: [
          {
            key: 'processnamecn',
            opt: 'LIKE',
            type: 'S',
            value: this.processName
          }
        ],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum: this.pageNum,
        pageSize: 10,
        sort: ''
      }
      getProcessList(obj).then(res => {
        if (!res) return false
        if (res.data == []) {
          return false
        }
        console.log(res)
        // res = res.data.data
        this.pageNum = res.nextPage
        res.list.forEach(item => {
          this.processData.push({
            label: item.processnamecn,
            key: item.processname
          })
        })
      })
    },
    // 获取流程框架
    getModelTree() {
      getModel({}).then(res => {
        if (!res) return false
        if (res.status == '200') {
          res = res.data
          console.log(getTreeData(res))
        }
      })
    },
    getProcessList() {
      this.dialogVisible = true
      this.pageNum = '1'
      this.getProcess()
    },
    // 获取流程列表
    getProcess() {
       let processValue=this.processValue[this.processValue.length - 1]
        let val
      if(processValue instanceof   Array&&processValue.length!==0){
             val =processValue[0]
      }else{
         val=processValue
      }
      const obj = {
        attr: {
        modelid: val,
        },
        filters: [
          {
            key: 'processnamecn',
            opt: 'LIKE',
            type: 'S',
            value: this.processName
          }
        ],
        fullFilters: [],
        logic: '',
        orderby: '',
        pageNum:  this.pageNum,
        pageSize: this.$route.query.processname? 1000: 10,
        sort: ''
      }
      getProcessList(obj).then(res => {
        // res = res.data
        this.pageNum = res.nextPage
        this.pages = res.pages
        const backupData = []
        console.log('res.listres.list',res.list);
        res.list.forEach(item => {
          backupData.push({
            label: item.processnamecn,
            key: item.processname
          })
        })
                console.log('这是选择流程中右边的', this.processValueData);

        if (this.pages > 1) {
          this.showMore = true
        }
        this.processData = backupData
      })
    },
    // 确定选择流程
    processQuit() {
      if (this.processValueData.length > 10) {
        alert(aMaximumOf10ProcessesCanBeSelected+ '')
      } else {
        const s = this.processValueData.toString()
        this.processDataString = s
        this.setOperationExample()
        this.processName=''
        this.dialogVisible = false
      }
    },
    // 运行实例
    setOperationExample() {
       let processValue=this.processValue[this.processValue.length - 1]
            let val
      if(processValue instanceof   Array&&processValue.length!==0){
             val =processValue[0]
      }else{
         val=processValue
      }
      const obj = {
        modelid: val,
        date: this.yearValue + '-' + this.monthValue,
        processname: this.processDataString
      }
      getOperationList(obj).then(res => {
        if (!res) return false
        // res = res.data.data  
        this.operationList = res
        const nameList = this.operationList.map(item => {
          return item.processnamecn
        })
        const dataList = this.operationList.map(item => item.runingcount)
        const finishList = this.operationList.map(item => item.finishcount)
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
      
        var option = {
          color: ['#00f6ff', '#03989f'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: [this.completed, this.beingProcessed],
            textStyle: {
              color: '#ffffff' // 字体颜色
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
                  return value.length > 4 ? value.slice(0, 3) + '...' : value
                },
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 14
                }
              },
              triggerEvent: true,
              data: nameList
            }
          ],
          yAxis: [
            {
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
                  color: '#ffffff'
                }
              }
            }
          ],
          series: [
            {
              name: this.completed,
              type: 'bar',
              stack: '运行实例',
              barWidth: 30,
              data: finishList
            },
            {
              name: this.beingProcessed,
              type: 'bar',
              barWidth: 30,
              stack: '运行实例',
              data: dataList
            }
          ]
        }
        firstChild.setOption(option)
      })
    },
    // 平均审批时长Top5
    setApprovalTime() {
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
      let processValue=this.processValue[this.processValue.length - 1]
              let val
      if(processValue instanceof   Array&&processValue.length!==0){
             val =processValue[0]
      }else{
         val=processValue
      }
      const obj = {
        modelid: val,
        date: this.yearValue + '-' + this.monthValue
      }
      getProcessAverageTime(obj)
        .then(res => {
          if (!res ) return false
          // res = res.data.data
          this.getProcessAverageData = res
          console.log(this.getProcessAverageData)
          const nameList = res.map(item => item.processnamecn)
          this.topList = nameList
          const averagetimeList = res.map(item => item.averagetime)
          console.log(averagetimeList)
          const insaveragetimeList = res.map(item => item.insaveragetime)
          var option = {
            color: ['#00f6ff', '#03989f'],
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: [this.averageApprovalTime2, this.durationOfProcessApproval],
              textStyle: {
                // fontSize: 18, // 字体大小
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
              // feature: {
              //   saveAsImage: {}
              // }
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
              triggerEvent: true,
              data: nameList
            },
            yAxis: {
              type: 'value',
              name: '天',
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
                  color: '#ffffff'
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
                name: this.durationOfProcessApproval,
                type: 'line',
                data: averagetimeList
              }
            ]
          }
          firstChild.setOption(option)
        })
        .then(res => {
          this.getTop()
        })
    },
    // top5单个流程节点平均流转时间
    setProcessNode(num) {
      console.log('this.getProcessAverageData.length',this.getProcessAverageData.length)
      console.log(this.getProcessAverageData[num])
      if (
        this.getProcessAverageData.length <= 0
        // this.getProcessAverageData[this.getProcessAverageData.length - 1]
        //   .length <= 0
      ) {
        console.log('平均审批时长Top5');
        this.getProcessAverageData = []
        this.processNodeData = []
        this.getProcessAverageData[num] = []
        this.getProcessAverageData[num].processnamecn = ''
      } else {
        this.processNodeData = this.getProcessAverageData[num].processNodeAverageTime
        console.log(this.processNodeData)
                console.log('平均审批时长Top5');

      }
      this.name = this.getProcessAverageData[num].processnamecn
      console.log(this.name)
      const nameList = this.processNodeData.map(item => item.nodename)
      console.log(nameList)
      const maxapprovaltimeList = this.processNodeData.map(
        item => item.maxapprovaltime
      )
      const minapprovaltimeList = this.processNodeData.map(
        item => item.minapprovaltime
      )
      const averagetimeList = this.processNodeData.map(
        item => item.averagetime
      )
      averagetimeList.sort(function(a, b) {
        return a - b
      })
      maxapprovaltimeList.sort(function(a, b) {
        return a - b
      })
      console.log(maxapprovaltimeList)
      const maxList = averagetimeList[averagetimeList.length - 1]
      const listMax = maxapprovaltimeList[maxapprovaltimeList.length - 1]
      console.log(maxList, listMax, nameList, 1)
      const firstChild = echarts.init(this.$refs.processNode)
      firstChild.on('mouseover', function(params) {
        // 鼠标经过图表时候判断参数  ---请开始你的表演
        if (params.componentType === 'xAxis') {
          var tt = $('#tip3')
          tt.html(params.value)
          tt.css('left', params.event.event.clientX - 10)
          tt.css('top', params.event.event.layerY + 30)
          tt.show()
        }
      })
      firstChild.on('mouseout', function(params) {
        $('#tip3').hide()
      })
      var option = {
        color: ['#0598a2', '#03f8fd', '#4ca1fe'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['avg', 'min', 'max'],
          textStyle: {
            //   fontSize: 18, // 字体大小
            color: '#ffffff' // 字体颜色
          }
        },
        toolbox: {
          // feature 各工具配置项: dataZoom 数据区域缩放;restore 配置项还原;saveAsImage下载为图片;magicType动态类型切换
          feature: {}
        },
        xAxis: [
          {
            type: 'category',
            data: nameList,
            triggerEvent: true,
            axisPointer: {
              type: 'shadow'
            },
            scale: true,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#6EEBFF',
                width: '1'
              }
            },
            axisLabel: {
              interval: 0,
              rotate: 60,
              formatter: function(value) {
                return value.length > 4 ? value.slice(0, 3) + '...' : value
              },
              show: true,
              textStyle: {
                fontSize: 14,
                color: '#ffffff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '平均流转时间（h）',
            min: 0,
            max: Math.ceil(maxList),
            interval: Math.ceil(maxList) / 5,
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
                color: '#ffffff'
              },
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#1f4771'
              }
            }
          },
          {
            type: 'value',
            name: '流转时间（h）',
            min: 0,
            max: Math.ceil(listMax),
            interval: Math.ceil(listMax) / 5,
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
                color: '#ffffff'
              },
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#1f4771'
              }
            }
          }
        ],
        series: [
          {
            name: 'avg',
            type: 'bar',
            barWidth: '30',
            data: averagetimeList || ''
          },
          {
            name: 'min',
            type: 'line',
            yAxisIndex: 1,
            data: minapprovaltimeList || ''
          },
          {
            name: 'max',
            type: 'line',
            yAxisIndex: 1,
            data: maxapprovaltimeList || ''
          }
        ]
      }

      firstChild.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
#operation {
  color: #768ec9;
    /deep/ .el-input__inner {
    background-color: transparent;
  }
  .operationEcharts1 {
    width: 100%;
    height: 420px;
    box-sizing: border-box;
    overflow: hidden;
    // border: 1px solid rgba(0, 69, 125, 1);
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
  .processNum {
    padding-top: 40px;
  }
  .processdetails {
    right: 10%;
  }

  .chartsBg {
    padding-top: 20px;
    box-sizing: border-box;
    background: url("../../../assets/img/qietu/borderImg.png") no-repeat;
    background-size: 100% 100%;
    height: 480px;
  }
  .chartsBg1 {
    height: 600px;
  }
  .goodDiv {
    width: 100%;
    position: relative;
    color: #fff;
    text-align: center;
    z-index: 30;
  }
  .goodDivTop {
    background: url("../../../assets/img/qietu/good1.png") no-repeat;
    background-position: center;
  }
  .goodDivTop1 {
    background: url("../../../assets/img/qietu/good2.png") no-repeat;
    background-position: center;
  }
  .goodDivTop2 {
    background: url("../../../assets/img/qietu/good3.png") no-repeat;
    background-position: center;
  }
  .goodImg {
    position: absolute;
    top: 0px;
    left: 0px;
  }
  .processTitleH{
    margin-left: 5%;
  }
  .flexBox {
    width: 90%;
    margin-top: 20px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .details {
    line-height: 36px;
    font-size: 16px;
    color: #fff;
    a {
      color: #fff;
    }
  }
  .details:hover {
    cursor: pointer;
  }
  .processNode {
    width: 100%;
    height: 470px;
  }
  .process {
    display: flex;
    justify-content: space-between;
  }
  .datePicker {
    text-align: right;
    margin-bottom: 20px;
    span {
      margin-left: 20px;
    }
  }
  .pieTitle {
    color: #ffffff;
    height: 36px;
    font-size: 16px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
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
    height: 540px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // border: 1px solid rgba(0, 69, 125, 1);
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
