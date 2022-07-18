<template>
  <div id="bpaAnalysis" class="w100 bpaAnalysis">
    <div>
      <system-process :system="$route.query.id" :state="true"/>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div>
            <h4 class="pieTitle flexBox">制度接收阅读情况-查看明细</h4>
          </div>
          <div class="operationEcharts">
            <el-row class="bpaAnalysis-bottom">
              <el-col :span="24">
                <el-row>
                  <el-col :span="24">
                    <el-input
                      v-model="keyWords"
                      placeholder="请输入内容"
                      class="search_component"
                      clearable
                      @keyup.13.native="search('')"
                    >
                      <el-button type="primary" slot="append" @click="search('')">搜索</el-button>
                    </el-input>
                    <el-button class="high_search" @click="isHighSearch=!isHighSearch" type="primary">
                      高级查询
                      <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"/>
                    </el-button>
                    <span class="float-r">
                      <el-button :loading="downloadLoading" class="high_search systemBtn" type="primary" @click="Excelexport()">导出</el-button>
                    </span>
                  </el-col>
                </el-row>
                <el-collapse-transition>
                  <!-- 高级搜索表格 -->
                  <el-form
                    v-show="isHighSearch"
                    class="search_options_wrap"
                    :model="searchForm"
                    label-width="120px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="公司">
                          <el-input v-model="searchForm.companyname" clearable></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="部门">
                          <el-input v-model="searchForm.deptname" clearable></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="岗位">
                          <el-input v-model="searchForm.defaultposname" clearable></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="查看时间">
                          <el-date-picker
                            clearable
                            v-model="searchForm.viewtime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择日期"
                          ></el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="状态">
                          <el-select v-model="searchForm.viewstatus" clearable>
                            <el-option
                              v-for="item in searchoptions"
                              :key="item.label"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <div class="search_buttons_wrap">
                          <el-button class="systemBtn" type="primary" @click="search('high')">确定</el-button>
                          <el-button class="" type="primary" @click="reset()">重置</el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-transition>
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
                  <el-table-column prop="companyname" label="公司" />
                  <el-table-column prop="deptname" label="部门" />
                  <el-table-column prop="defaultposname" label="岗位" />
                  <el-table-column prop="cnname" label="查看人" />
                  <el-table-column prop="viewtime" label="查看时间" />
                  <el-table-column prop="viewstatus" label="状态" />
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
import {
  queryRegulationReceivedAndReadConditionDetail
} from '@/bpa/api/systemKanBan'
// 默认时间
import { defaultTime, export_post_list, formatDate, getMonthDays } from '@/bpa/utils/common.js'
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
      searchoptions: [
        {
          label: '未读',
          value: '未读'
        },
        {
          label: '已读',
          value: '已读'
        }
      ],
      labelPosition: '',
      value1: '',
      value: '',
      pagesData: {
        pageNum: 1,
        pageSize: 10,
        total: 0
        // orderby: 'sort',
        // sort: 'desc' // orderby有值时生效
      },
      options: [],
      processValue: '',
      tableData: [],
      isHighSearch: false,
      keyWords: '',
      searchForm: {}
    }
  },
  computed: {},
  mounted() {
    this.getList()
  },
  methods: {
    // 是否显示明细触发按钮
    search(ele) {
      this.getList()
    },
    reset() {
      this.searchForm = Object.assign({}, this.searchForm, {
        deptname: '',
        viewstatus: '',
        defaultposname: '',
        viewtime: '',
        companyname: ''
      })
      this.getList()
    },
    // 导出excel
    Excelexport() {
      this.downloadLoading = true
      const obj = {
        'pageNum': 1,
        'pageSize': this.pagesData.total,
        'sort': 'desc',
        'orderby': 'viewtime',
        'attr': {
          'docId': this.$route.query.docId
        },
        'filters': [
          {
            'key': 'cnname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.keyWords
          },
          {
            'key': 'companyname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.companyname
          },
          {
            'key': 'defaultposname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.defaultposname
          },
          {
            'key': 'deptname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.deptname
          },
          {
            'key': 'viewstatus',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.viewstatus
          },
          {
            'key': 'viewtime',
            'opt': 'LE',
            'type': 'D',
            'value': this.searchForm.viewtime
          }
        ],
        'logic': 'and'
      }
      queryRegulationReceivedAndReadConditionDetail(obj).then(res => {
        if (!res) return false
        var content = res.list
        const { export_json_to_excel } = require('@/bpa/Excel/Export2Excel')
        const tHeader = ['公司', '部门', '岗位', '查看人', '查看时间', '状态']
        const filterVal = ['companyname', 'deptname', 'defaultposname', 'cnname', 'viewtime', 'viewstatus']
        const list = content // 把要导出的数据tableData存到list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '制度接收阅读情况-查看明细')// 最后一个是表名字
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 返回事件
    goBack() {
      this.$router.go(-1) // 返回上一层
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
        'pageNum': this.pagesData.pageNum,
        'pageSize': 10,
        'sort': 'desc',
        'orderby': 'viewtime',
        'attr': {
          'docId': this.$route.query.docId
        },
        'filters': [
          {
            'key': 'cnname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.keyWords
          },
          {
            'key': 'companyname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.companyname
          },
          {
            'key': 'defaultposname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.defaultposname
          },
          {
            'key': 'deptname',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.deptname
          },
          {
            'key': 'viewstatus',
            'opt': 'LIKE',
            'type': 'S',
            'value': this.searchForm.viewstatus
          },
          {
            'key': 'viewtime',
            'opt': 'LE',
            'type': 'D',
            'value': this.searchForm.viewtime
          }
        ],
        'logic': 'and'
      }
      queryRegulationReceivedAndReadConditionDetail(obj).then(res => {
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
