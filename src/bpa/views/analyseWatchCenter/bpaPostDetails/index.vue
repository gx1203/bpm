<template>
  <div id="bpaPostDetails" class="w100 bpaAnalysis">
    <div class="process">
      <div>
        {{$t("businessDomain")}}
        <el-cascader
          v-model="processValue"
          :placeholder="pleaseSelect"
          :title="pleaseSelect"
          :options="options"
          :props="props"
          collapse-tags
          clearable
        />
        <el-button type="primary" @click="submitForm1">
          {{$t("query")}}
        </el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <analysis-header :header-list="headerList" />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div class="pieTitle flexBox">
            <h4>{{$t("reportAnalysisPositionParticipationStatus")}}</h4>
          </div>
          <div class="operationEcharts">
            <el-row class="bpaPostDetails-bottom">
              <el-col :span="3">
                {{$t("accordingToTheDetail")}}
                <el-radio-group v-model="radio1" @change="submitFormInput">
                  <el-radio-button :label="yes" />
                  <el-radio-button :label="no" />
                </el-radio-group>
              </el-col>
              <el-col :span="3">
                <el-input
                  v-model="searchName"
                  clearable
                  :placeholder="pleaseEnterTheContent"
                  :title="pleaseEnterTheContent"
                  suffix-icon="el-icon-search"
                  size="mini"
                  @change="submitFormInput"
                  @keyup.enter.native="submitFormInput"
                />
              </el-col>
              <el-col :span="3">
                <el-button type="primary" style="margin-left:10px;" @click="submitFormInput">
                  {{$t("query")}}
                </el-button>
              </el-col>
              <el-col :span="15" class="search_buttons_wrap">
                <el-button :loading="downloadLoading" type="primary" @click="Excelexport">
                  {{$t("export")}}
                </el-button>
                <el-button type="primary" @click="goBack">
                  {{$t("return")}}
                </el-button>
              </el-col>
              <el-col :span="24" style="margin-top:20px;">
                <el-table
                  :data="tableData"
                  :default-sort="{prop: 'date', order: 'descending'}"
                  :header-cell-style="{background:'#09275E' ,color:'#fff','border-bottom':'1px solid #10347C'}"
                  :cell-style="{background:'#030b2a',color:'#67748F','border-bottom':'1px solid #10347C',height:'46px'}"
                  style="width: 100%"
                >
                  <el-table-column type="index" :label="number" />
                  <el-table-column prop="detpName" :label="postName" />
                  <el-table-column prop="count" :label="numberOfProcesses" sortable />
                  <el-table-column v-if="radio1 == '是'" prop="processName" :label="processName2" />
                  <el-table-column v-if="radio1 == '是'" prop="activeNodeName" :label="processActivityNode" />
                </el-table>
                <el-pagination
                  v-if="tableData.length > 0"
                  :current-page="pagesData.pageNum"
                  :page-sizes="[10]"
                  :page-size="pagesData.pageSize"
                  :total="pagesData.total"
                  background
                  layout="prev, pager, next, jumper, total"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 接口请求部分
import {
  getBpaNum,
  getPositionParticipationDetail,
  exportPositionParticipationDetailData,
  getOneFrameworkList
} from '@/bpa/api/analyseWatchCenter'
import PortalExport from '@/bpa/components/protal/PortalExport'
import { defaultTime, export_post_list } from '@/bpa/utils/common.js'

import AnalysisHeader from '../../../components/AnalysisHeader'
export default {
  components: {
    AnalysisHeader,
    PortalExport
  },
  data() {
    return {
      downloadLoading: false,
      exportList: [], // 导出列表list
      radio1: this.$t("no"),
      processValues: '',
      options: [],
      processValue: '',
      props: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        multiple: true
      },
      searchName: '',
      tableData: [],
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      headerList: [
        {
          num: '0',
          name: this.$t("totalNumberOfReleaseProcesses"),
          ico: 'el-icon-s-promotion',
          color: '#06abb9',
          title: 'BPA' + this.$t("totalNumberOfPublishedProcesses")
        },
        {
          num: '0',
          name: this.$t("totalNumberOfProcessNodes"),
          ico: 'el-icon-connection',
          color: '#b35141',
          title: 'BPA' + this.$t("totalNumberOfNodesPublishedProcess")
        },
        {
          num: '0',
          name: this.$t("coverJobs"),
          ico: 'el-icon-s-custom',
          color: '#019874',
          title: 'BPA' + this.$t("numberOfJobsInvolvedPublishedProcess")
        },
        {
          num: '0',
          name: this.$t("manualNode"),
          ico: 'el-icon-copy-document',
          color: '#b37e11',
          title: 'BPA' + this.$t("totalNumberOfOfflineNodesInPublishedProcess")
        },
        {
          num: '0',
          name: this.$t("onlineNode"),
          ico: 'el-icon-crop',
          color: '#3577c0',
          title: 'BPA' + this.$t("totalNumberOfOnlineNodesInPublishedProcess")
        }
      ],
      pleaseSelect:this.$t("placeholderText.pleaseSelect"),
      pleaseEnterTheContent:this.$t("placeholderText.pleaseEnterTheContent"),
      number:this.$t("number"),
      postName:this.$t("postName"),
      numberOfProcesses:this.$t("numberOfProcesses"),
      processName2:this.$t("processName2"),
      processActivityNode:this.$t("processActivityNode"),
      yes:this.$t("yes"),
      no:this.$t("no"),
    }
  },
  computed: {},
  mounted() {
    this.getBpaNumList() // 获取头部基础数据
    this.getOneFrameworkList() // 获取业务域
    this.getPositionParticipationDetail() // 获取详情数据
  },
  methods: {
    // 导出excel 岗位参与情况
    Excelexport() {
      this.downloadLoading = true
      var obj = {
        ids: this.processValues,
        stauts: this.radio1 === '是' ? 1 : 0
      }
      exportPositionParticipationDetailData(obj).then(res => {
        export_post_list(res, '岗位参与情况.xlsx')
        this.downloadLoading = false
      })
    },
    // 选择业务域确定
    submitForm1() {
      this.processValues = this.processValue.toString()
      this.getPositionParticipationDetail()
      this.getBpaNumList()
    },
    // 获取流程框架
    getOneFrameworkList() {
      getOneFrameworkList().then(res => {
        this.options = res
      })
    },
    // 获取关键指标
    getBpaNumList() {
      const obj = 'id=' + this.processValues
      getBpaNum(obj).then(res => {
        this.headerList.map(item => {
          if (item.name === '发布流程总数') {
            this.$set(item, 'num', res.totalNum)
          }
          if (item.name === '流程节点总数') {
            this.$set(item, 'num', res.nodeNum)
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
    // 返回事件
    goBack() {
      this.$router.go(-1) // 返回上一层
    },
    submitFormInput(ele) {
      this.getPositionParticipationDetail()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pagesData.pageNum = val
      this.getPositionParticipationDetail()
    },
    // 获取数据
    getPositionParticipationDetail() {
      const obj = {
        pageNumber: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize,
        stauts: this.radio1 === this.yes ? '1' : '0',
        name: this.searchName,
        ids: this.processValues
      }
      const list = Object.entries(obj)
      let str = ''
      list.map(item => {
        str += item[0] + '=' + item[1] + '&'
      })
      getPositionParticipationDetail(str).then(res => {
        this.tableData = res.list
        this.pagesData.total = res.total
      })
    }
  }
}
</script>

<style scoped lang="scss">
#bpaPostDetails {
  color: #fff;
  .operationEcharts {
    width: 100%;
    height: 674px;
  }
  .padding10 {
    padding: 10px;
  }
  .process {
    text-align: right;
    margin-bottom: 14px;
    margin-right: 14px;
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .processBar {
    height: 400px;
  }
  .positionBar {
    height: 400px;
  }
  .details {
    padding-right: 10px;
    a {
      color: #fff;
    }
  }
  .chartsBg {
    position: relative;
    margin-top: 20px;
    background: url('../../../assets/img/qietu/bg_m.png') no-repeat;
    background-size: 100% 100%;
  }
  .pieTitle {
    color: #ffffff;
    margin-left: 40px;
    font-size: 16px;
    padding-left: 10px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 36px;
    border-left: 3px solid #00f6ff;
    padding-left: 10px;
  }
  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // border:1px solid rgba(0,69,125,1);
    margin-bottom: 24px;
    .bpaPostDetails-bottom {
      padding: 24px 24px 0px 24px;
    }
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
