<template>
  <div id="bpaAnalysis" class="w100 bpaAnalysis">
    <div>
      <system-process :system="systemId === '' ? $route.query.id : systemId" @systemId="getSystemId"/>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div>
            <h4 class="pieTitle flexBox">制度接收阅读情况</h4>
          </div>
          <div class="operationEcharts">
            <el-row class="bpaAnalysis-bottom">
              <el-col :span="24">
                <el-row>
                  <el-col :span="24">
                    <el-input
                      placeholder="请输入文件标题"
                      class="search_component"
                      v-model="keyWords"
                      clearable
                      @keyup.13.native="search('')"
                    >
                      <el-button type="primary" slot="append" @click="search('')">搜索</el-button>
                    </el-input>
                    <span class="float-r">
                      <el-button :loading="downloadLoading" class="high_search systemBtn" type="primary" @click="Excelexport()">导出</el-button>
                      <el-button class="high_search systemBtn" type="primary" @click="goBack()">返回</el-button>
                    </span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="24" style="margin-top:20px;">
                <el-table
                  border
                  :data="tableData"
                  :header-cell-style="{background:'#09275E' ,color:'#9FCEFF','border':'1px solid #10347C'}"
                  :cell-style="{ background:'#082C62', color:'#c0d0eb','border':'1px solid #10347C',height:'46px'}"
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号" />
                  <el-table-column prop="foldertype" label="制度框架" />
                  <el-table-column prop="title" label="文件标题" width="420">
                    <template slot-scope="scope">
                      <span :title="scope.row.title">{{ scope.row.title }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="canViewUser" label="可查看人" />
                  <el-table-column prop="viewedUser" label="已查看人" />
                  <el-table-column prop="viewRate" label="查看百分比" />
                  <el-table-column prop="address" label="操作">
                    <template slot-scope="scope">
                      <span style="cursor: pointer;text-decoration:underline" @click="opendetails(scope.row)">查看明细</span>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination background
                  :current-page="pagesData.pageNum"
                  :page-sizes="[10]"
                  :page-size="pagesData.pageSize"
                  :total="pagesData.total"
                  layout="total, sizes, prev, pager, next, jumper"
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
// 引入echarts

import 'echarts-liquidfill'
import systemProcess from './systemProcess.vue'
import PortalExport from '@/bpa/components/protal/PortalExport'
// 接口请求部分
import {
  getOneFrameworkList,
  getBpaNum,
  getProcessDetail,
  exportProcessReleaseDetailData
} from '@/bpa/api/analyseWatchCenter'
import {
  queryMoreRegulationReceivedAndReadCondition
} from '@/bpa/api/systemKanBan'
// 默认时间
import { defaultTime, export_post_list, formatDate, getMonthDays } from '@/bpa/utils/common.js'
import { createNamespacedHelpers } from 'vuex'
const userInfo = createNamespacedHelpers('userInfo')
export default {
  components: {
    systemProcess,
    PortalExport
  },
  data() {
    return {
      downloadLoading: false,
      radio: '0',
      timeValue: [],
      systemId: '',
      labelPosition: '',
      value1: '',
      value: '',
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
        // orderby: 'sort',
        // sort: 'asc' // orderby有值时生效
      },
      options: [],
      processValue: '',
      tableData: [],
      isHighSearch: false,
      keyWords: ''
    }
  },
  computed: {},
  mounted() {
    this.getList()
  },
  methods: {
    ...userInfo.mapActions(['getCurrentSystemId']),
    // 是否显示明细触发按钮
    search(ele) {
      this.getList()
    },
    // 返回事件
    goBack() {
      this.getCurrentSystemId(this.systemId === '' ? this.$route.query.id : this.systemId) // 回传数据
      this.$router.go(-1)
    },
    // 导出excel
    Excelexport() {
      this.downloadLoading = true
      const obj = {
        'orderby': 'viewRate',
        'pageNum': 1,
        'pageSize': this.pagesData.total,
        'sort': 'desc',
        'attr': {
          'folderid': this.systemId === '' ? this.$route.query.id : this.systemId
        },
        'filters': [
          {
            'key': 'title',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.keyWords
          }
        ],
        'logic': 'and'
      }
      queryMoreRegulationReceivedAndReadCondition(obj).then(res => {
        if (!res) return false
        var content = res.list
        const { export_json_to_excel } = require('@/bpa/Excel/Export2Excel')
        const tHeader = ['制度框架', '文件标题', '可查看人', '已查看人', '查看百分比']
        const filterVal = ['foldertype', 'title', 'canViewUser', 'viewedUser', 'viewRate']
        const list = content // 把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '制度接收阅读情况')// 最后一个是表名字
        this.downloadLoading = false
      })
    },
    getSystemId(val) {
      this.systemId = val
      this.getList()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 详情跳转
    opendetails(item) {
      const routes = this.$router.resolve({
        path: '/analyseWatchCenter/bpa/systemKanBan/SystemDetails/systemKanBanReadDetails',
        query: { docId: item.docId, id: this.systemId === '' ? this.$route.query.id : this.systemId }
      })
      window.open(routes.href, '_blank')
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 表格分页
    handleCurrentChange(val) {
      this.pagesData.pageNum = val
      this.getList()
    },
    // 获取表格数据
    getList() {
      const obj = {
        'orderby': 'viewRate',
        'pageNum': this.pagesData.pageNum,
        'pageSize': 10,
        'sort': 'desc',
        'attr': {
          'folderid': this.systemId === '' ? this.$route.query.id : this.systemId
        },
        'filters': [
          {
            'key': 'title',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.keyWords
          }
        ],
        'logic': 'and'
      }
      queryMoreRegulationReceivedAndReadCondition(obj).then(res => {
        if (!res) return false
        this.pagesData.total = res.total
        this.tableData = res.list
      })
    }
  }
}
</script>

<style scoped lang="scss">
#bpaAnalysis {
  color: #9FCEFF;
  .operationEcharts {
    width: 100%;
    // min-height: 592px;
  }
  .padding10 {
    padding: 10px;
  }
  .flexBox {
    display: flex;
    justify-content: space-between;
  }
  .chartsBg {
    position: relative;
    margin-top: 20px;
    padding: 10px;
    background: url("../../../assets/img/qietu/zdlcbzh-cd.png") no-repeat;
    background-size: 100% 100%;
    /deep/ .el-form-item__label {
      color: #9FCEFF;
    }
    /deep/ .el-input__inner {
        color: #426193;
        border-radius: 0;
        background-color: #082C62;
        border-color: #009499;
    }
    .el-scrollbar {
      ::-webkit-scrollbar {
        background-color: transparent;
      }
    }
    .search_options_wrap {
      background: transparent;
      border: transparent;
    }
  }
  @media screen and (max-width: 1400px) {
    .chartsBg{
      background: url("../../../assets/img/systemKanBan/bg_m.png") no-repeat;
      background-size: 100% 100%;
    }
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
  .pieTitle {
    color: #09EEF5;
    margin-left: 40px;
    margin-top: 20px;
    border-left: 3px solid #09EEF5;
    font-size: 16px;
    padding-left: 10px;
    box-sizing: border-box;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
  }
  .operationEcharts {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // border:1px solid rgba(0,69,125,1);
    margin-bottom: 24px;
    .bpaAnalysis-bottom {
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
  .systemBtn {
    background-color: #009499;
    /*background: url("../../../../../assets/img/systemKanBan/button.png") no-repeat;*/
    color: #FFFFFF;
  }
}
</style>
