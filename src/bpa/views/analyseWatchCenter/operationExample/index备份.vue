<template>
  <div id="operation" class="w100 operation">
    <div class="datePicker">
      <el-row :gutter="20" type="flex" justify="end" style="margin-right:20px">
        <el-col :span="13">
          <el-date-picker
            v-model="yearValue"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年"/>
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
          <el-button type="primary" size="mini" @click="submitForm">查询</el-button>
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
            <h4 class=" pieTitle">运行实例</h4>
            <div class="details processdetails" @click="getProcessList">选择流程</div>
          </div>
          <div ref="operationExample" id="operationExample" class="operationEcharts1" />
          <div id="tip" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="5">
        <div class="chartsBg">
          <div class="flexBox">
            <h4 class=" pieTitle">流程发起数排名</h4>
            <div class="details">
              <a href="#/analyseWatchCenter/ProcessInitiationRanking">更多</a>
            </div>
          </div>
          <div class="processNum">
            <el-row
              v-for="(item,index) in proseeRankData"
              :gutter="20"
              :key="index"
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
                <p :title="item.processnamecn" class="text_overflow_2">{{ item.processnamecn }}</p>
              </el-col>
              <el-col :span="6">{{ item.applycount }}</el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding-bottom:40px">
      <el-col :span="12">
        <div class="chartsBg chartsBg1">
          <h4 class="pieTitle processTitleH">平均审批时长Top5</h4>
          <div id="approvalTime" ref="approvalTime" class="operationEcharts" />
          <div id="tip1" class="tipname hide" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chartsBg chartsBg1">
          <h4 class="pieTitle processTitleH">单个流程节点平均流转时间top5</h4>
          <div style="padding:10px 10px 0 40px;">
            <el-radio-group v-model="radio1" @change="getTop">
              <el-radio-button v-if="getProcessAverageData[0]" label="Top1" />
              <el-radio-button v-if="getProcessAverageData[1]" label="Top2" />
              <el-radio-button v-if="getProcessAverageData[2]" label="Top3" />
              <el-radio-button v-if="getProcessAverageData[3]" label="Top4" />
              <el-radio-button v-if="getProcessAverageData[4]" label="Top5" />
            </el-radio-group>
            <div style="margin-top:10px">{{ name }}</div>
          </div>
          <div ref="processNode" class="processNode" />
          <div id="tip3" class="tipname hide" />
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="800px" title="选择流程">
      <el-input clearable
        v-model="processName"
        placeholder="请输入搜索内容"
        prefix-icon="el-icon-search"
        style="margin-bottom:10px;width:200px"
        @change="getSearch"
        @keyup.enter.native="getSearch"
      />
      <el-transfer
        v-model="processValueData"
        :data="processData"
        :titles="['流程列表', '已选择流程']"
        filter-placeholder="请输入流程拼音"
      >
        <span slot-scope="{ option }" :title="option.label">{{ option.label }}</span>
        <el-button v-show="showMore" slot="left-footer" @click="loadMore">更多</el-button>
      </el-transfer>
      <div style="text-align:right">
        <el-button type="primary" @click="remove">取消</el-button>
        <el-button type="primary" @click="processQuit">确定</el-button>
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
import { getFormateDate } from '../../../utils/common.js'
import analysisHeader from '../../../components/AnalysisHeader.vue'
import axios from 'axios'
// 接口请求部分
// import {
//   getModel,
//   getOperationList,
//   getProcessList,
//   getKeyList,
//   getProcessRank,
//   getProcessAverageTime
// } from '@/bpa/api/analyseWatchCenter'

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
      operationList: [],
      headerList: [
        {
          num: 13722,
          name: '运行流程总数',
          ico: 'el-icon-s-promotion',
          color: '#07aab9',
          title: 'FBC中已运行的流程数量'
        },
        {
          num: 13644,
          name: '未完成流程总数',
          ico: 'el-icon-thumb',
          color: '#b45041',
          title: 'FBC中已运行流程的节点总数'
        },
        {
          num: 203,
          name: '处理节点数',
          ico: 'el-icon-document-copy',
          color: '#019774',
          title: 'FBC中流程申请总数'
        },
        {
          num: 53,
          name: '覆盖人数',
          ico: 'el-icon-s-custom',
          color: '#b37d11',
          title: 'FBC中运行的流程参与总人数'
        },
        {
          num: 49,
          name: '覆盖岗位',
          ico: 'el-icon-set-up',
          color: '#3676c0',
          title: 'FBC中运行的流程参与的岗位数'
        }
      ],
      dialogVisible: false,
      processData: [],
      processValueData: [],
      processDataString: '',
      props: { multiple: true },
      radio1: 'Top1',
      options: [{
        value: '一级',
        label: '1.0愿景与战略'
      }, {
        value: '二级',
        label: '2.0市场营销'
      }, {
        value: '三级',
        label: '3.0产品研发'
      }, {
        value: '一级',
        label: '一级菜单'
      }, {
        value: '四级',
        label: '4.0订单到交付'
      }, {
        value: '五级',
        label: '5.0采购与管理'
      }, {
        value: '六级',
        label: '6.0生产管理'
      }, {
        value: '七级',
        label: '7.0质量管理'
      }, {
        value: '八级',
        label: '8.0产品服务'
      }, {
        value: '九级',
        label: '9.0财务管理'
      }, {
        value: '十级',
        label: '10.0人力资源管理'
      }, {
        value: '十一级',
        label: '11.0投资管理'
      }, {
        value: '十二级',
        label: '12.0企业风险与合规管理'
      }, {
        value: '十三级',
        label: '13.0信息技术'
      }, {
        value: '十四级',
        label: '14.0行政法务管理'
      }, {
        value: '十五级',
        label: '15.0测试'
      } ],
      value: '',
      pageNum: '1'
    }
  },
  computed: {},
  mounted() {
    this.setOperationExample() // 运行实例
    this.setApprovalTime()
    this.setProcessNode()
    this.getList()
  },
  methods: {
    getList() {
      axios.post('http://180.101.123.121:8050/bpmapi/process/analysis/instanceStatistical?username=test02', {'date': '2020-1', 'processname': ''}).then(res => {
        console.log(res.data.data)
        this.proseeRankData = res.data.data
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
      this.processValueData = []
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
      const obj = {
        modelid: this.processValue[this.processValue.length - 1],
        date: this.yearValue + '-' + this.monthValue
      }
      getKeyList(obj).then(res => {
        this.headerList.map(item => {
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
            this.$set(item, 'num', parseInt(res.useramount))
          }
          if (item.name === '覆盖岗位') {
            this.$set(item, 'num', parseInt(res.postamount))
          }
        })
      })
    },
    // 选择时间确定
    submitForm(ele) {
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
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1]
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
        this.pageNum = res.nextPage
        res.list.forEach(item => {
          this.processData.push({
            label: item.processnamecn,
            key: item.processname
          })
        })
      })
    },
    getProcessList() {
      this.dialogVisible = true
      this.processValueData = []
      this.pageNum = '1'
      this.getProcess()
    },
    // 获取流程列表
    getProcess() {
      const obj = {
        attr: {
          modelid: this.processValue[this.processValue.length - 1]
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
        this.pageNum = res.nextPage
        this.pages = res.pages
        const backupData = []
        res.list.forEach(item => {
          backupData.push({
            label: item.processnamecn,
            key: item.processname
          })
        })
        if (this.pages > 1) {
          this.showMore = true
        }
        this.processData = backupData
      })
    },
    // 确定选择流程
    processQuit() {
      if (this.processValueData.length > 10) {
        alert('最多只能选择10个流程')
      } else {
        const s = this.processValueData.toString()
        this.processDataString = s
        this.setOperationExample()
        this.dialogVisible = false
      }
    },
    // 运行实例
    setOperationExample(processValues) {
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
      // =============================================
      var posList = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
      ]

      app.configParameters = {
        rotate: {
          min: -90,
          max: 90
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right'
          }
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
          }
        },
        position: {
          options: echarts.util.reduce(
            posList,
            function(map, pos) {
              map[pos] = pos
              return map
            },
            {}
          )
        },
        distance: {
          min: 0,
          max: 100
        }
      }

      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function() {
          var labelOption = {
            normal: {
              rotate: app.config.rotate,
              align: app.config.align,
              verticalAlign: app.config.verticalAlign,
              position: app.config.position,
              distance: app.config.distance
            }
          }
          myChart.setOption({
            series: [
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              }
            ]
          })
        }
      }
      var labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
          name: {
            textBorderColor: '#fff'
          }
        }
      }
      var option = {
        color: ['#00f6ff', '#03989f'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['已完成', '审批中'],
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
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              show: true,
              rotate: 60,
              textStyle: {
                fontSize: 14,
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
            data: [
              '愿景与战略',
              '市场营销',
              '产品研发',
              '订单到交付',
              '采购管理',
              '生产管理',
              '质量管理',
              '财务管理'
            ],
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
            name: '已完成',
            type: 'bar',
            stack: '广告',
            barWidth: 30,
            label: labelOption,
            data: [320, 332, 301, 334, 390, 200, 250]
          },
          {
            name: '审批中',
            type: 'bar',
            stack: '广告',
            barWidth: 30,
            label: labelOption,
            data: [220, 182, 191, 234, 290, 332, 301, 334]
          }
        ]
      }
      firstChild.setOption(option)
    },
    // 平均审批时长Top5
    setApprovalTime() {
      const firstChild = echarts.init(this.$refs.approvalTime)
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
      var option = {
        color: ['#00f6ff', '#03989f'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['平均审批时长', '流程审批时长'],
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
          data: [
            '银行授信申请',
            '请示报告',
            '信用项目方框申请',
            '一卡通申请',
            '加班申请'
          ]
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
            name: '平均审批时长',
            type: 'line',
            data: [0.2, 0.4, 0.5, 0.3, 0.7]
          },
          {
            name: '流程审批时长',
            type: 'line',
            data: [0.6, 0.4, 0.7, 0.3, 0.4]
          }
        ]
      }
      firstChild.setOption(option)
    },
    // top5单个流程节点平均流转时间
    setProcessNode(num) {
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
        $('#tip1').hide()
      })
      var option = {
        color: ['#00f6ff', '#03989f'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['平均审批时长', '流程审批时长'],
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
          data: [
            '银行授信申请',
            '请示报告',
            '信用项目方框申请',
            '一卡通申请',
            '加班申请'
          ]
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
            name: '平均审批时长',
            type: 'line',
            data: [0.2, 0.4, 0.5, 0.3, 0.7]
          },
          {
            name: '流程审批时长',
            type: 'line',
            data: [0.6, 0.4, 0.7, 0.3, 0.4]
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
    /deep/ .el-input__inner {
    background-color: transparent;
  }
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
