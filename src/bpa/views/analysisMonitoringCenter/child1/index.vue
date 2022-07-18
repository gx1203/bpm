<template>
  <div id="analyseWatchCenter" class="w100">
    <el-row class="w100 remove-margin-l remove-margin-r" :gutter="10">
      <el-col :span="9" class="remove-padding-l">
        <el-card class="box-card pos-relative">
          <div slot="header" class="clear-fix">
            <span class="line-height28">培训统计</span>
            <el-tooltip class="float-r" effect="dark" content="导出" placement="top">
              <el-button
                class="font16"
                type="text"
                size="large"
                @click="exportList('trained')"
                icon="el-icon-download"
                circle
              ></el-button>
            </el-tooltip>
          </div>
          <el-row class="w100 remove-margin-l remove-margin-r">
            <el-col :span="10" class="remove-padding-l">
              <div class="h300px" ref="trainCount"></div>
            </el-col>
            <el-col :span="14" class="remove-padding-l">
              <p class="border-bottom1 common-part">
                <span class="font20">{{trainShow.trainTotal | number}}</span>
                <span class="font16 fontBlue fontBold" @click="trainedprocess('released')">已发布流程</span>
              </p>
              <p class="border-bottom1 common-part">
                <span class="font20">{{trainShow.trained | number}}</span>
                <span class="font16 fontLightBlue fontBold" @click="trainedprocess('trained')">已培训流程</span>
              </p>
              <p class="common-part">
                <span class="font20">{{trainShow.needTrain | number}}</span>
                <span class="font16 fontRed fontBold" @click="trainedprocess('untrained')">未培训流程</span>
              </p>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="15" class="remove-padding-r">
        <el-card class="box-card">
          <div slot="header" class="clear-fix">
            <span class="line-height28">超期审批时长分布</span>
            <el-tooltip class="float-r" effect="dark" content="切换" placement="top">
              <el-button
                class="font16"
                type="text"
                size="large"
                icon="el-icon-menu"
                circle
                @click="showExFilter = !showExFilter;paintExceed()"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="float-r margin-r10" effect="dark" content="导出" placement="top">
              <el-button
                class="font16"
                type="text"
                size="large"
                @click="exportList('exceed')"
                icon="el-icon-download"
                circle
              ></el-button>
            </el-tooltip>
            <el-button type="text" class="float-r margin-r10" @click="paintExceed">确定</el-button>
            <span class="float-r">
              <el-date-picker clearable
                v-model="startYear"
                type="month"
                class="w110px bg-datepick"
                format="yyyy-MM"
                value-format="yyyy-MM"
              ></el-date-picker>-
              <el-date-picker clearable
                v-model="endYear"
                type="month"
                class="w110px bg-datepick"
                format="yyyy-MM"
                value-format="yyyy-MM"
              ></el-date-picker>
            </span>
            <el-button
              type="text"
              class="float-r margin-r10"
              v-show="showExFilter"
              @click="exHighSelect = !exHighSelect;exHeight = exHighSelect ? '229':'300'"
            >高级筛选</el-button>
          </div>
          <template>
            <div class="h300px" ref="exTime" v-show="!showExFilter"></div>
            <div v-show="showExFilter">
              <el-collapse-transition>
                <el-form
                  v-show="exHighSelect"
                  class="search_options_wrap margin-b10"
                  label-width="100px"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item :label="$t('subject')" class="remove-margin-b">
                        <el-input clearable v-model="exSubject"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="$t('approver')" class="remove-margin-b">
                        <el-input clearable v-model="exappoval"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <div class="search_buttons_wrap">
                        <el-button type="primary" @click="paintExceed">搜索</el-button>
                        <el-button type="primary" @click="resetExceed">重置</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-transition>
              <el-table
                :data="exData"
                :height="exHeight"
                border
                class="main_tab"
                @sort-change="exparam_sortchange"
              >
                <el-table-column :label="$t('approvalTime1')" width="100px" prop="createdate" show-overflow-tooltip></el-table-column>
                <el-table-column prop="subject" :label="$t('subject')" show-overflow-tooltip></el-table-column>
                <el-table-column prop="fitter" width="80px" label="发起人" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="processnodename"
                  width="80px"
                  :label="$t('approvalNodeName')"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="appover" width="80px" :label="$t('approver')" show-overflow-tooltip></el-table-column>
                <el-table-column prop="settime" width="90px" label="规定节点审批时长" show-overflow-tooltip></el-table-column>
                <el-table-column
                  prop="apptime"
                  width="90px"
                  label="实际节点审批时长"
                  sortable="custom"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="exceedtime"
                  width="70px"
                  label="超期时长"
                  sortable="custom"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="w100 remove-margin-l remove-margin-r margin-t10" :gutter="10">
      <el-col :span="12" class="remove-padding-l">
        <el-card class="box-card">
          <div slot="header" class="clear-fix">
            <span class="line-height28">最近审批通过流程审批时长</span>
            <el-tooltip class="float-r" effect="dark" content="切换" placement="top">
              <el-button
                class="font16"
                type="text"
                size="large"
                icon="el-icon-menu"
                circle
                @click="showPblishFilter = !showPblishFilter;resetpblish()"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="float-r margin-r10" effect="dark" content="导出流程列表" placement="top">
              <el-button
                class="font16"
                type="text"
                size="large"
                @click="exportList('pblishlist')"
                icon="el-icon-download"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip class="float-r" effect="dark" content="导出流程节点列表" placement="top">
              <el-button
                class="font16"
                type="text"
                size="large"
                @click="exportList('pblishnodelist')"
                icon="el-icon-download"
                circle
              ></el-button>
            </el-tooltip>
            <el-button type="text" class="float-r margin-r10" @click="paintPblish">确定</el-button>
            <span class="float-r">
              <el-form class="w150px">
                <el-form-item label="显示条数:" label-width="80px" class="remove-margin-b">
                  <el-input clearable v-model="pblishCount"></el-input>
                </el-form-item>
              </el-form>
            </span>
            <el-button
              type="text"
              class="float-r margin-r10"
              v-show="showPblishFilter"
              @click="pblishHighSelect = !pblishHighSelect; pblishHeight = pblishHighSelect ? '229':'333'"
            >高级筛选</el-button>
          </div>
          <template>
            <div v-show="!showPblishFilter">
              <el-radio-group v-model="pblishtype" @change="pblishtypechange()">
                <el-radio-button label="1">{{$t('releaseTime')}}</el-radio-button>
                <el-radio-button label="2">
                  实际时长
                  <i
                    :class="pblishsorttype==='asc'?'el-icon-caret-top pblish-i pblish-i1':'el-icon-caret-top pblish-i pblish-i1 colorC'"
                    @click="pblishsortchange()"
                  ></i>
                  <i
                    :class="pblishsorttype==='desc'?'el-icon-caret-bottom pblish-i':'el-icon-caret-bottom pblish-i colorC'"
                    @click="pblishsortchange()"
                  ></i>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="h333px" ref="pblish" v-show="!showPblishFilter"></div>
            <div v-show="showPblishFilter">
              <el-collapse-transition>
                <el-form
                  v-show="pblishHighSelect"
                  class="search_options_wrap margin-b10 pblishChart"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="主题:" label-width="60px" class="remove-margin-b">
                        <el-input clearable v-model="pblishname"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="14" :offset="2">
                      <el-form-item label="审批通过时间" label-width="100px" class="remove-margin-b">
                        <el-date-picker clearable
                          v-model="startpblishTime"
                          type="month"
                          class="w120px"
                          placeholder
                        ></el-date-picker>-
                        <el-date-picker clearable
                          v-model="endpblishTime"
                          type="month"
                          class="w120px"
                          placeholder
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div class="search_buttons_wrap">
                    <el-button type="primary" @click="paintPblish">搜索</el-button>
                    <el-button type="primary" @click="resetpblish">重置</el-button>
                  </div>
                </el-form>
              </el-collapse-transition>
              <el-table
                :data="pblishData"
                :height="pblishHeight"
                border
                class="main_tab"
                @sort-change="pblish_sortchange"
              >
                <el-table-column :label="$t('number')" width="50px" type="index"></el-table-column>
                <el-table-column prop="processname" :label="$t('subject')">
                  <template slot-scope="scope">
                    <span
                      class="titlehover"
                      @click="pblishdetail(scope.row)"
                    >{{scope.row.processname}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="time" width="80px" label="审批通过时间"></el-table-column>
                <el-table-column prop="actualtime" width="80px" label="实际审批时长" sortable="custom"></el-table-column>
                <el-table-column
                  prop="actualavetime"
                  width="100px"
                  label="实际平均审批时长"
                  sortable="custom"
                ></el-table-column>
              </el-table>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="12" class="remove-padding-r">
        <el-card class="box-card">
          <div slot="header" class="clear-fix">
            <span class="line-height28">审批效率</span>
            <el-tooltip class="float-r" effect="dark" content="切换" placement="top">
              <el-button
                class="font16"
                type="text"
                size="large"
                icon="el-icon-menu"
                circle
                @click="showRateFilter = !showRateFilter;resetrate()"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="float-r margin-r10" effect="dark" content="导出列表" placement="top">
              <el-button
                class="font16"
                type="text"
                size="large"
                @click="exportList('ratelist')"
                icon="el-icon-download"
                circle
              ></el-button>
            </el-tooltip>
            <el-button type="text" class="float-r margin-r10" @click="paintRate">确定</el-button>
            <span class="float-r">
              <el-form class="w150px">
                <el-form-item label="显示条数:" label-width="80px" class="remove-margin-b">
                  <el-input clearable v-model="rateCount"></el-input>
                </el-form-item>
              </el-form>
            </span>
          </div>
          <template>
            <div v-show="!showRateFilter">
              <el-radio-group v-model="ratetype" @change="ratetypechange()">
                <el-radio-button label="1">审批个数</el-radio-button>
                <el-radio-button label="2">
                  实际平均审批时长
                  <i
                    :class="ratesorttype==='asc'?'el-icon-caret-top pblish-i pblish-i1':'el-icon-caret-top pblish-i pblish-i1 colorC'"
                    @click="ratesortchange()"
                  ></i>
                  <i
                    :class="ratesorttype==='desc'?'el-icon-caret-bottom pblish-i':'el-icon-caret-bottom pblish-i colorC'"
                    @click="ratesortchange()"
                  ></i>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="h333px" ref="rate" v-show="!showRateFilter"></div>
            <div v-show="showRateFilter">
              <el-collapse-transition>
                <el-input clearable placeholder="请输入主题" class="search_component" v-model="ratename">
                  <el-button type="primary"  slot="append" @click="paintRate"> {{$t('search')}}</el-button>
                </el-input>
              </el-collapse-transition>
              <el-table
                :data="rateData"
                height="290"
                border
                class="main_tab"
                @sort-change="rate_sortchange"
              >
                <el-table-column :label="$t('number')" width="50px" type="index"></el-table-column>
                <el-table-column prop="name" label="姓名">
                  <template slot-scope="scope">
                    <span class="titlehover" @click="ratedetail(scope.row)">{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="actualavetime"
                  width="98px"
                  label="实际平均审批时长"
                  sortable="custom"
                ></el-table-column>
                <el-table-column prop="appvoalcount" width="87px" label="审批个数" sortable="custom"></el-table-column>
                <el-table-column prop="exceedcount" width="87px" label="超期个数" sortable="custom"></el-table-column>
                <el-table-column prop="exceedrate" width="90px" label="超期率(%)" sortable="custom"></el-table-column>
              </el-table>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="trainproc" :visible.sync="dialogTableVisible" width="70%">
      <el-table :data="trainprocesslist">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="code" :label="$t('processCoding')" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column property="name" :label="$t('processName2')" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="version" :label="$t('version')" width="50" show-overflow-tooltip></el-table-column>
        <el-table-column property="name" label="状态" width="80">
          <template slot-scope="scope">
            <div>{{scope.row.status ==='2'?'已培训':'未培训'}}</div>
          </template>
        </el-table-column>
        <el-table-column property="bponame" label="流程负责人" show-overflow-tooltip></el-table-column>
        <el-table-column property="upbponame" label="上级流程负责人" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="effectivetime" :label="$t('releaseTime')" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('uploadTime')" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.doclist.length > 0">{{scope.row.doclist[0].createon}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pages.pageNum"
        background
        layout="prev, pager, next, jumper, total"
        :total="pages.total"
      ></el-pagination>
    </el-dialog>
    <el-dialog :title="pblishdetailtit+' 详情'" :visible.sync="dialogpblishVisible" width="70%">
      <el-table :data="pblishdetails">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column :label="$t('subject')" show-overflow-tooltip>
          <template>
            <span>{{pblishdetailtit}}</span>
          </template>
        </el-table-column>
        <el-table-column property="nodename" :label="$t('approvalNodeName')" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="owner" :label="$t('approver')" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="settime" label="规定节点审批时长" show-overflow-tooltip></el-table-column>
        <el-table-column property="actualtime" label="实际节点审批时长" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column property="overdueday" label="超期天数" width="100" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="详情" :visible.sync="dialograteVisible" width="70%">
      <el-table :data="ratedetails">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column property="timerange" label="审批时间范围" show-overflow-tooltip></el-table-column>
        <el-table-column property="name" label="姓名" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column property="setavetime" label="规定平均审批时长" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column
          property="actualavetime"
          label="实际平均审批时长"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column property="appvoalcount" label="审批个数" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column property="exceedcount" label="超期个数" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column property="exceedrate" label="超期率" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.exceedrate}}%</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import 'echarts-liquidfill'

// 接口请求部分
import {
  getTrained,
  exportTrained,
  getTrainedprocess,
  getExceed,
  exportExceed,
  getPblish,
  exportpblish,
  exportpblishnode,
  getRate,
  getRatedetail,
  exportRate
} from '@/bpa/api/analysisMonitoringCenter'
import { export_post_list, getFormateDate } from '@/bpa/utils/common'

export default {
  data() {
    return {
      // 培训记录的数据
      trainData: [0.9],
      trainShow: {
        needTrain: '',
        trainTotal: '',
        trained: ''
      },
      dialogTableVisible: false,
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      trainproc: '',
      trainprocessparam: {
        attr: {},
        filters: [
          {
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: ''
          }
        ],
        logic: 'or',
        orderby: 'createon',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      },
      trainprocesslist: [],
      // 超期的数据
      exData: [],
      exSubject: '',
      exappoval: '',
      exHeight: '300',
      exHighSelect: false,
      exparam: {
        attr: {
          starttime: '',
          endtime: ''
        },
        filters: [
          { key: 'subject', opt: 'LIKE', type: 'S', value: '' },
          { key: 'appover', opt: 'LIKE', type: 'S', value: '' }
        ],
        logic: 'and',
        orderby: '',
        pageNum: 1,
        pageSize: 10,
        sort: ''
      },
      startYear: getFormateDate(new Date(), 'yyyy-MM'),
      endYear: getFormateDate(new Date(), 'yyyy-MM'),
      showExFilter: false,
      // 最近发布流程
      pblishData: [],
      // 显示某个节点
      showNodeIndex: 0,
      pblishHighSelect: false,
      showPblishFilter: false,
      pblishHeight: '333',
      pblishparam: {
        attr: {},
        filters: [
          {
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: ''
          },
          {
            key: 'time',
            opt: 'GE',
            type: 'D',
            value: ''
          },
          {
            key: 'time',
            opt: 'LE',
            type: 'D',
            value: ''
          }
        ],
        logic: 'and',
        orderby: 'time',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      },
      startpblishTime: '',
      endpblishTime: '',
      pblishname: '',
      pblishCount: 10,
      pblishtype: '1',
      pblishsorttype: 'desc',
      dialogpblishVisible: false,
      pblishdetails: [],
      pblishdetailtit: '',
      // 审批效率
      rateData: [],
      // 显示某个节点
      showrateNodeIndex: 0,
      showRateFilter: false,
      rateparam: {
        attr: {},
        filters: [
          {
            key: 'name',
            opt: 'LIKE',
            type: 'S',
            value: ''
          }
        ],
        logic: 'and',
        orderby: 'appvoalcount',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      },
      ratename: '',
      rateCount: 10,
      ratetype: '1',
      ratesorttype: 'desc',
      dialograteVisible: false,
      ratedetails: [],
      // 定时器
      timer: null
    }
  },
  computed: {
    trainedOptions() {
      let self = this
      return {
        title: {
          text: ''
        },
        series: [
          {
            type: 'liquidFill',
            data: self.trainData,
            label: {
              normal: {
                fontSize: 16,
                formatter: function(data) {
                  return `已培训占比 : ${(data.value * 100).toFixed(2)}%`
                }
              }
            },
            outline: {
              borderDistance: 0,
              itemStyle: {
                borderWidth: 0
              }
            },
            backgroundStyle: {
              color: '#E2EBF3',
              itemStyle: {
                shadowBlur: 100,
                shadowColor: '#4DA2FF',
                opacity: 1
              }
            },
            itemStyle: {
              opacity: 0.5,
              shadowBlur: 10,
              shadowColor: '#4DA2FF'
            },
            emphasis: {
              itemStyle: {
                opacity: 1
              }
            },
            color: [
              'rgba(77,162,255,1)',
              'rgba(77,162,255,1)',
              'rgba(77,162,255,1)'
            ],
            shape: 'circle',
            center: ['48%', '50%'],
            radius: '80%',
            amplitude: 3,
            waveLength: '35%',
            phase: 0,
            period: (value, index) => {
              return index * 2000
            },
            direction: 'left',
            animation: false,
            waveAnimation: false,
            animationEasing: 'linear',
            animationEasingUpdate: 'quarticInOut',
            animationDuration: 3000,
            animationDurationUpdate: 300
          }
        ]
      }
    },
    exOptions() {
      if (!this.exData && !this.exData.length) {
        return false
      }
      let self = this
      let xdata = []
      let ydataBar = []
      let ydataLine = []
      for (let i = 0; i < self.exData.length; i++) {
        xdata.push(
          self.exData[i].processnodename + '-' + self.exData[i].subject
        )
        ydataBar.push(self.exData[i].apptime)
        ydataLine.push(parseFloat(self.exData[i].settime))
      }
      return {
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          },
          formatter(tooltipData) {
            return ` ${tooltipData[0].name}<br/>
                   审批人 : ${
                     self.exData[tooltipData[0].dataIndex].appover
                   }<br/>
                   发起人 : ${self.exData[tooltipData[0].dataIndex].fitter}<br/>
                   超期天数 : ${
                     self.exData[tooltipData[0].dataIndex].exceedtime
                   }天<br/>
                   ${tooltipData[1].marker}实际节点审批时长 : ${
              tooltipData[1].value
            }天<br/>
                   ${tooltipData[0].marker}规定节点审批时长 : ${
              tooltipData[0].value
            }天`
          }
        },
        grid: {
          left: '4%',
          right: '3%',
          top: '10%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          x: 'center',
          top: '0',
          textStyle: {
            color: '#90979c'
          },
          data: ['规定时长', '实际时长']
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              color: '#4F4F4F'
            },
            axisLine: {
              lineStyle: {
                color: '#9B9B9B'
              }
            },
            data: xdata
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#9B9B9B'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: '#4F4F4F'
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '规定时长',
            type: 'line',
            symbolSize: 10,
            symbol: 'emptyCircle',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#5AA3FB',
                barBorderRadius: 0,
                label: {
                  show: false
                }
              }
            },
            areaStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#87BCFE' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#ffffff' // 100% 处的颜色
                    }
                  ]
                },
                barBorderRadius: 0,
                label: {
                  show: false
                }
              }
            },
            data: ydataLine
          },
          {
            name: '实际时长',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#B3D6FF',
                barBorderRadius: 0,
                label: {
                  show: false
                }
              }
            },
            data: ydataBar
          }
        ]
      }
    },
    pblishOptions() {
      if (!this.pblishData.length) {
        return false
      }
      let self = this
      let data = self.pblishData
      let index = self.showNodeIndex
      let xdata = []
      let xRoseData = []
      let ydataBar = []
      let ydataLine = []
      let yRoseData = []
      let maxValue = 0
      for (let i = 0; i < data.length; i++) {
        xdata.push(
          !data[i].processname
            ? ''
            : data[i].processname.substr(
                0,
                data[i].processname.lastIndexOf(
                  '-',
                  data[i].processname.lastIndexOf('-') - 1
                )
              )
        )
        xdata[xdata.length - 1] =
          xdata[xdata.length - 1].length > 10
            ? xdata[xdata.length - 1].substring(0, 10) + '...'
            : xdata[xdata.length - 1]
        ydataBar.push({
          value: data[i].actualtime,
          itemStyle:
            i === index
              ? {
                  normal: {
                    color: '#9bcafc'
                  }
                }
              : {
                  normal: {
                    color: '#4CA2FF'
                  }
                }
        })
        ydataLine.push(data[i].settime)
        if (maxValue < data[i].actualtime) {
          maxValue = data[i].actualtime
        }
      }
      if (!!data[index].details) {
        for (let i = 0; i < data[index].details.length; i++) {
          xRoseData.push(data[index].details[i].owner)
          yRoseData.push({
            value: !data[index].details[i].actualtime
              ? 0
              : data[index].details[i].actualtime,
            name: data[index].details[i].nodename,
            owner: data[index].details[i].owner,
            setTime: !data[index].details[i].settime
              ? 0
              : data[index].details[i].settime,
            exTime: !data[index].details[i].overdueday
              ? 0
              : data[index].details[i].overdueday
          })
        }
      } else {
        xRoseData = []
        yRoseData = []
      }

      return {
        animation: false,
        title: [
          {
            text: '流程节点',
            x: '73%',
            y: '1%',
            textStyle: {
              color: '#333',
              fontSize: '14'
            }
          }
        ],
        legend: {
          x: '3%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['实际审批时长']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          },
          padding: 10,
          backgroundColor: '#222',
          borderColor: '#777',
          borderWidth: 1,
          formatter: tooltipData => {
            // let aversetTime = 0
            const sum = {
              setTime: 0,
              actualTime: 0
            }
            for (let i = 0; i < ydataLine.length; i++) {
              sum.setTime += parseFloat(ydataLine[i])
            }
            // aversetTime = Math.round(sum.setTime / ydataLine.length)
            return ` ${
              !data[tooltipData[0].dataIndex].processname
                ? ''
                : data[tooltipData[0].dataIndex].processname
            }<br/>
                   审批通过时间 : ${
                     !!data[tooltipData[0].dataIndex].time
                       ? data[tooltipData[0].dataIndex].time
                       : ''
                   }<br/>
                   ${tooltipData[0].marker}实际审批时长 : ${
              !!tooltipData[0].value ? tooltipData[0].value : 0
            }天<br/>
                   实际平均审批时长 : ${
                     !!data[tooltipData[0].dataIndex]
                       ? data[tooltipData[0].dataIndex].actualavetime
                       : 0
                   }天`
          }
        },
        grid: {
          left: '2%',
          right: '7%',
          top: '20%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xdata,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#dddddd'
              }
            },
            axisLabel: {
              interval: 'auto',
              rotate: -45,
              color: function(value, idx) {
                return idx === index ? '#9bcafc' : '#333333'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
              color: '#333333'
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#dddddd'
              }
            },
            max: parseFloat(maxValue) + 25
          }
        ],
        series: [
          {
            name: '实际审批时长',
            type: 'bar',
            label: {
              show: false
            },
            itemStyle: {
              normal: {
                color: '#00A3FF'
              }
            },
            markLine: {
              lineStyle: {
                color: '#4CA2FF'
              },
              data: [{ type: 'average', name: '平均值' }]
            },
            data: ydataBar
          },
          {
            tooltip: {
              trigger: 'item',
              formatter: tooltipData => {
                // let averageValue = 0
                // let averageSetTime = 0
                const sum = {
                  value: 0,
                  setTime: 0
                }
                for (let i = 0; i < yRoseData.length; i++) {
                  sum.value += parseFloat(yRoseData[i].value)
                  sum.setTime += parseFloat(yRoseData[i].setTime)
                }
                // averageValue = Math.round(sum.value / yRoseData.length)
                // averageSetTime = Math.round(sum.setTime / yRoseData.length)
                return `${tooltipData.marker + tooltipData.data.name}<br/>
                   负责人 : ${tooltipData.data.owner}<br/>
                   规定节点审批时长 : ${tooltipData.data.setTime}天<br/>
                   实际节点审批时长 : ${tooltipData.data.value}天<br/>
                   超期天数 : ${tooltipData.data.exTime}天<br/>`
              }
            },
            legend: {
              x: 'center',
              y: 'bottom',
              data: xRoseData
            },
            calculable: true,
            name: '面积模式',
            type: 'pie',
            radius: [20, 40],
            center: ['78%', '20%'],
            // roseType : 'area',
            label: {
              normal: {
                show: false,
                color: '#333',
                fontSize: '12'
              }
            },
            labelLine: {
              normal: {
                length: 3,
                length2: 5
              },
              ellipsis: {
                length: 3,
                length2: 5
              }
            },
            color: [
              '#4DA2FF',
              '#81C149',
              '#5CD9AD',
              '#FFCA2D',
              '#4FC5E9',
              '#F87352'
            ],
            data: yRoseData
          }
        ]
      }
    },
    rateOptions() {
      if (!this.rateData.length) {
        return false
      }
      let self = this
      let data = self.rateData
      let index = self.showrateNodeIndex
      let xdata = []
      let xRoseData = { appvoalcount: 0, exceedcount: 0 }
      const ydataBar1 = []
      const ydataBar2 = []
      const ydataLine1 = []
      const ydataLine2 = []
      let barMaxValue = 0
      let lineMaxValue = 0
      for (let i = 0; i < data.length; i++) {
        xdata.push(data[i].name)
        ydataBar1.push({
          value: data[i].appvoalcount - data[i].exceedcount,
          itemStyle:
            i === index
              ? {
                  normal: {
                    color: '#9bcafc'
                  }
                }
              : {
                  normal: {
                    color: '#4CA2FF'
                  }
                }
        })
        ydataBar2.push({
          value: data[i].exceedcount,
          itemStyle:
            i === index
              ? {
                  normal: {
                    color: '#FFA894'
                  }
                }
              : {
                  normal: {
                    color: '#FF6946'
                  }
                }
        })
        ydataLine1.push(data[i].setavetime)
        ydataLine2.push(data[i].actualavetime)
        if (parseFloat(barMaxValue) < parseFloat(data[i].appvoalcount)) {
          barMaxValue = data[i].appvoalcount
        }
        if (parseFloat(lineMaxValue) < parseFloat(data[i].actualavetime)) {
          lineMaxValue = data[i].actualavetime
        }
        if (lineMaxValue < data[i].setavetime) {
          lineMaxValue = data[i].setavetime
        }
      }
      xRoseData = data[index]
      let exRate = 0
      if (!!xRoseData.exceedcount && !!xRoseData.appvoalcount) {
        exRate = (
          (xRoseData.exceedcount * 100) /
          xRoseData.appvoalcount
        ).toFixed(2)
      }
      barMaxValue =
        barMaxValue.length >= 3
          ? parseFloat(barMaxValue) + 100
          : barMaxValue.length < 3 && barMaxValue.length > 2
          ? parseFloat(barMaxValue) + 10
          : parseFloat(barMaxValue) + 5
      lineMaxValue =
        lineMaxValue.length >= 3
          ? parseFloat(lineMaxValue) + 100
          : lineMaxValue.length < 3 && lineMaxValue.length > 2
          ? parseFloat(lineMaxValue) + 10
          : parseFloat(lineMaxValue) + 5
      return {
        title: [
          {
            text: '超期率',
            subtext: exRate + '%',
            x: '78%',
            y: '8%',
            textAlign: 'center',
            textStyle: {
              color: '#333',
              fontSize: '15'
            },
            subtextStyle: {
              color: '#F87352',
              fontSize: '26',
              fontWeight: '700'
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            },
            triggerOn: 'click'
          },
          padding: 10,
          backgroundColor: '#222',
          borderColor: '#777',
          borderWidth: 1,
          formatter: tooltipData => {
            let exRate = (
              (tooltipData[1].value * 100) /
              data[tooltipData[0].dataIndex].appvoalcount
            ).toFixed(2)
            return ` ${tooltipData[0].name}<br/>
                   当年审批个数 : ${
                     data[tooltipData[0].dataIndex].appvoalcount
                   }<br/>
                   ${
                     !tooltipData[0] ? '' : tooltipData[0].marker
                   }当年审批未超期个数 : ${
              !tooltipData[0] ? 0 : tooltipData[0].value
            }<br/>
                   ${
                     !tooltipData[1] ? '' : tooltipData[1].marker
                   }当年审批超期个数 : ${
              !tooltipData[1] ? 0 : tooltipData[1].value
            }<br/>
                   ${
                     !tooltipData[2] ? '' : tooltipData[2].marker
                   }实际平均审批时长 : ${
              !tooltipData[2] ? 0 : tooltipData[2].value
            }天<br/>
                   超期率 : ${exRate}%`
          }
        },
        grid: {
          left: '2%',
          right: '3%',
          top: '20%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          x: '3%',
          y: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['实际平均审批时长', '审批未超期个数', '审批超期个数']
        },
        xAxis: [
          {
            type: 'category',
            data: xdata,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#dddddd'
              }
            },
            axisLabel: {
              interval: 0,
              rotate: -45,
              color: function(value, idx) {
                return idx === index ? '#9bcafc' : '#333333'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
              color: '#333333'
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#dddddd'
              }
            },
            max: parseFloat(barMaxValue) + 8
          },
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}',
              color: '#333333'
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#dddddd'
              }
            },
            max: parseFloat(lineMaxValue) + 5
          }
        ],
        series: [
          {
            name: '审批未超期个数',
            type: 'bar',
            yAxisIndex: 0,
            stack: '总量',
            label: {
              show: false
            },
            itemStyle: {
              normal: {
                color: '#4DA2FF'
              }
            },
            data: ydataBar1
          },
          {
            name: '审批超期个数',
            type: 'bar',
            yAxisIndex: 0,
            stack: '总量',
            label: {
              show: false
            },
            itemStyle: {
              normal: {
                color: '#F87352'
              }
            },
            data: ydataBar2
          },
          {
            name: '实际平均审批时长',
            type: 'line',
            yAxisIndex: 1,
            symbolSize: 10,
            symbol: 'emptyCircle',
            smooth: true,
            itemStyle: {
              normal: {
                color: '#4DA2FF'
              }
            },
            data: ydataLine2
          }
        ]
      }
    }
  },
  mounted() {
    // 培训数据
    this.paintTrain()
    // 超期数据
    this.paintExceed()
    // 最近发布流程
    this.paintPblish()
    // 审批效率
    this.paintRate()
    // 定时器
    if (this.timer) {
      clearInterval(this.timer)
    }
    this.setTimer()
  },
  methods: {
    // 培训数据
    paintTrain() {
      let self = this
      let trainCount = echarts.init(self.$refs.trainCount)
      getTrained().then(res => {
        self.trainShow = res
        self.trainData = [
          (self.trainShow.trained / self.trainShow.trainTotal).toFixed(4)
        ]
        trainCount.setOption(self.trainedOptions, true)
      })
    },
    // 培训统计-流程列表
    trainedprocessdata() {
      getTrainedprocess(this.trainprocessparam).then(res => {
        this.trainprocesslist = res.list
        this.pages.total = res.total
        console.log(res)
      })
    },
    trainedprocess(type) {
      this.dialogTableVisible = true
      if (type === 'released') {
        this.trainproc = '已发布流程'
        this.trainprocessparam.filters[0].value = ''
      } else if (type === 'trained') {
        this.trainproc = '已培训流程'
        this.trainprocessparam.filters[0].value = '2'
      } else if (type === 'untrained') {
        this.trainproc = '未培训流程'
        this.trainprocessparam.filters[0].value = '1'
      }
      this.trainedprocessdata()
    },
    handleSizeChange(val) {
      this.trainprocessparam.pageNum = val
      this.trainedprocessdata()
    },
    handleCurrentChange(val) {
      this.trainprocessparam.pageNum = val
      this.trainedprocessdata()
    },
    // 超期数据
    paintExceed() {
      let self = this
      let exTime = echarts.init(self.$refs.exTime)
      self.startYear = !self.startYear
        ? getFormateDate(new Date(), 'yyyy-MM')
        : self.startYear
      self.endYear = !self.endYear
        ? getFormateDate(new Date(), 'yyyy-MM')
        : self.endYear
      self.exparam.attr.starttime = `${self.startYear}-01`
      self.exparam.attr.endtime = `${self.endYear}-${new Date(
        self.endYear.split('-')[0],
        self.endYear.split('-')[1],
        0
      ).getDate()}`
      self.exparam.filters[0].value = self.exSubject
      self.exparam.filters[1].value = self.exappoval
      getExceed(self.exparam).then(res => {
        self.exData = res
        if (self.exOptions) {
          exTime.setOption(self.exOptions, true)
        }
      })
    },
    resetExceed() {
      let self = this
      self.exSubject = ''
      self.exappoval = ''
      self.exparam.filters[0].value = self.exSubject
      self.exparam.filters[1].value = self.exappoval
      self.paintExceed()
    },
    exparam_sortchange({ column, prop, order }) {
      this.exparam.orderby = prop
      if (order === 'ascending' || order === 'descending') {
        this.exparam.sort = order.slice(0, 3)
      } else {
        this.exparam.sort = ''
        this.exparam.orderby = ''
      }
      this.paintExceed()
    },
    // 最近发布流程数据
    paintPblish() {
      let self = this
      let pblish = echarts.init(self.$refs.pblish)
      self.pblishCount = !self.pblishCount ? 10 : self.pblishCount
      self.pblishparam.pageSize = self.pblishCount
      self.pblishparam.filters[0].value = self.pblishname
      self.pblishparam.filters[1].value = self.startpblishTime
      self.pblishparam.filters[2].value = self.endpblishTime
      getPblish(self.pblishparam).then(res => {
        self.pblishData = res
        if (self.pblishOptions) {
          pblish.setOption(self.pblishOptions, true)
        }
      })
    },
    resetpblish() {
      let self = this
      self.pblishname = ''
      self.startpblishTime = ''
      self.endpblishTime = ''
      self.pblishparam.filters[0].value = self.pblishname
      self.pblishparam.filters[1].value = self.startpblishTime
      self.pblishparam.filters[2].value = self.endpblishTime
      if (self.pblishtype === '1') {
        self.pblishparam.orderby = 'time'
        self.pblishsorttype = 'desc'
        self.pblishparam.sort = self.pblishsorttype
      } else if (self.pblishtype === '2') {
        self.pblishparam.orderby = 'actualtime'
      }
      self.paintPblish()
    },
    pblishtypechange() {
      if (this.pblishtype === '1') {
        this.pblishparam.orderby = 'time'
        this.pblishsorttype = 'desc'
        this.pblishparam.sort = this.pblishsorttype
      } else if (this.pblishtype === '2') {
        this.pblishparam.orderby = 'actualtime'
      }
      this.paintPblish()
    },
    pblishsortchange() {
      if (this.pblishsorttype === 'asc') {
        this.pblishsorttype = 'desc'
      } else {
        this.pblishsorttype = 'asc'
      }
      this.pblishparam.sort = this.pblishsorttype
      this.paintPblish()
    },
    // 最近发布流程明细
    pblishdetail(data) {
      this.dialogpblishVisible = true
      this.pblishdetails = data.details
      this.pblishdetailtit = data.processname
    },
    pblish_sortchange({ column, prop, order }) {
      this.pblishparam.orderby = prop
      if (order === 'ascending' || order === 'descending') {
        this.pblishparam.sort = order.slice(0, 3)
      } else {
        this.pblishparam.sort = 'des'
        this.pblishparam.orderby = 'time'
      }
      this.paintPblish()
    },
    // 审批效率
    paintRate() {
      let self = this
      let rate = echarts.init(self.$refs.rate)
      self.rateCount = !self.rateCount ? 10 : self.rateCount
      self.rateparam.pageSize = self.rateCount
      self.rateparam.filters[0].value = self.ratename
      getRate(self.rateparam).then(res => {
        self.rateData = res
        if (self.rateOptions) {
          rate.setOption(self.rateOptions, true)
        }
      })
    },
    resetrate() {
      let self = this
      self.ratename = ''
      if (this.ratetype === '1') {
        this.rateparam.orderby = 'appvoalcount'
        this.ratesorttype = 'desc'
        this.rateparam.sort = this.pblishsorttype
      } else if (this.ratetype === '2') {
        this.rateparam.orderby = 'actualavetime'
      }
      self.paintRate()
    },
    ratetypechange() {
      if (this.ratetype === '1') {
        this.rateparam.orderby = 'appvoalcount'
        this.ratesorttype = 'desc'
        this.rateparam.sort = this.pblishsorttype
      } else if (this.ratetype === '2') {
        this.rateparam.orderby = 'actualavetime'
      }
      this.paintRate()
    },
    ratesortchange() {
      if (this.ratesorttype === 'asc') {
        this.ratesorttype = 'desc'
      } else {
        this.ratesorttype = 'asc'
      }
      this.rateparam.sort = this.ratesorttype
      this.paintRate()
    },
    ratedetail(data) {
      this.dialograteVisible = true
      getRatedetail({
        attr: {
          userid: data.userid
        }
      }).then(res => {
        this.ratedetails = res
      })
    },
    rate_sortchange({ column, prop, order }) {
      this.rateparam.orderby = prop
      if (order === 'ascending' || order === 'descending') {
        this.rateparam.sort = order.slice(0, 3)
      } else {
        this.rateparam.sort = 'des'
        this.rateparam.orderby = 'actualavetime'
      }
      this.paintRate()
    },
    // 导出列表
    exportList(type) {
      let self = this
      switch (true) {
        case type === 'trained':
          exportTrained().then(res => {
            export_post_list(res, '培训统计列表.xlsx')
          })
          break
        case type === 'exceed':
          exportExceed(self.exparam).then(res => {
            export_post_list(res, '超期流程列表.xlsx')
          })
          break
        case type === 'pblishlist':
          exportpblish(self.pblishparam).then(res => {
            export_post_list(res, '最近发布流程列表.xlsx')
          })
          break
        case type === 'pblishnodelist':
          exportpblishnode().then(res => {
            export_post_list(res, '最近发布流程节点列表.xlsx')
          })
          break
        case type === 'ratelist':
          let userids_temp = []
          let userids = ''
          self.rateData.forEach(el => {
            userids_temp.push(el.userid)
          })
          userids = userids_temp.toString()
          exportRate({ attr: { userids } }).then(res => {
            export_post_list(res, '审批效率列表.xlsx')
          })
          break
      }
    },
    // 定时器
    setTimer() {
      this.timer = setInterval(() => {
        this.raterendering()
        this.pblishrendering()
      }, 5000)
    },
    // 审批效率重新渲染
    raterendering() {
      if (this.showrateNodeIndex === this.rateData.length - 1) {
        this.showrateNodeIndex = 0
      } else {
        this.showrateNodeIndex++
      }
      let rate = echarts.init(this.$refs.rate)
      rate.setOption(this.rateOptions, true)
      this.addrateClick()
    },
    // 给echatrs添加点击事件,改变当前点击柱状图的背景色
    addrateClick() {
      let eChart = echarts.init(this.$refs.rate)
      eChart.getZr().on('click', data => {
        let pointInPixel = [data.offsetX, data.offsetY]
        if (eChart.containPixel('grid', pointInPixel)) {
          let xIndex = eChart.convertFromPixel({ seriesIndex: 0 }, [
            data.offsetX,
            data.offsetY
          ])[0]
          // 事件处理代码书写位置 // this.showrateNodeIndex用来保存当前点击项的index,用来修改当前点击项的背景色
          this.showrateNodeIndex = xIndex
          eChart.setOption(this.rateOptions, true)
        }
      })
    },
    // 审批时长重新渲染
    pblishrendering() {
      if (this.showNodeIndex === this.pblishData.length - 1) {
        this.showNodeIndex = 0
      } else {
        this.showNodeIndex++
      }
      let pblish = echarts.init(this.$refs.pblish)
      pblish.setOption(this.pblishOptions, true)
      this.addpblishClick()
    },
    // 给echatrs添加点击事件,改变当前点击柱状图的背景色
    addpblishClick() {
      let eChart = echarts.init(this.$refs.pblish)
      eChart.getZr().on('click', data => {
        let pointInPixel = [data.offsetX, data.offsetY]
        if (eChart.containPixel('grid', pointInPixel)) {
          let xIndex = eChart.convertFromPixel({ seriesIndex: 0 }, [
            data.offsetX,
            data.offsetY
          ])[0]
          // 事件处理代码书写位置 // this.showNodeIndex用来保存当前点击项的index,用来修改当前点击项的背景色
          this.showNodeIndex = xIndex
          eChart.setOption(this.pblishOptions, true)
        }
      })
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped lang="scss">
#analyseWatchCenter {
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
