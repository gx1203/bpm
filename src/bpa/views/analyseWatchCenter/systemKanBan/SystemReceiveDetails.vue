<template>
  <div id="bpaAnalysis" class="w100 bpaAnalysis">
    <div>
      <system-process></system-process>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chartsBg">
          <div>
            <h4 class="pieTitle flexBox">报表分析-流程发布情况</h4>
          </div>
          <div class="operationEcharts">
            <el-row class="bpaAnalysis-bottom">
              <el-col :span="24">
                <el-row>
                  <el-col :span="24">
                    <el-input
                      placeholder="请输入内容"
                      class="search_component"
                      v-model="keyWords"
                      clearable
                      @keyup.13.native="search('')"
                    >
                      <el-button type="primary" slot="append" @click="search('')">搜索</el-button>
                    </el-input>
                    <el-button class="high_search" @click="isHighSearch=!isHighSearch" type="primary">
                      高级查询
                      <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
                    </el-button>
                    <span class="float-r">
                        <el-button class="high_search systemBtn" type="primary">导出</el-button>
                        <el-button class="high_search systemBtn" type="primary" @click="$router.go(-1)">返回</el-button>
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
                        <el-form-item label="流程框架名称">
                          <el-input v-model="searchForm.classify" clearable></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="姓名">
                          <el-input v-model="searchForm.operatorname" clearable></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="工号">
                          <el-input v-model="searchForm.operator" clearable></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item label="操作类型">
                          <el-select v-model="searchForm.status" clearable>
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
                        <el-form-item label="操作时间">
                          <el-date-picker
                            clearable
                            v-model="searchForm.operatetime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择日期"
                          ></el-date-picker>
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
                  <el-table-column prop="releaseValue" label="公司" />
                  <el-table-column prop="updateValue" label="部门" />
                  <el-table-column prop="todolistNum" label="岗位" />
                  <el-table-column prop="unfinishedValue" label="查看人" />
                  <el-table-column prop="processNumValue" label="查看时间" />
                  <el-table-column prop="state" label="状态" />
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
// 默认时间
import { defaultTime, export_post_list, formatDate, getMonthDays } from '@/bpa/utils/common.js'
export default {
  components: {
    systemProcess,
    PortalExport
  },
  data() {
    return {
      modelid: '',
      processstartTime: '2019-01-01',
      processendTime: defaultTime.getToDay(),
      downloadLoading: false,
      exportList: [], // 导出列表list
      setTime: [],
      processValues: '',
      radio: '0',
      timeValue: [],
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
      props: { checkStrictly: true, label: 'name', value: 'id', multiple: true },
      tableData: [],
      headerList: [
        {
          num: '0',
          name: '发布流程总数',
          ico: 'el-icon-s-promotion',
          color: '#06abb9',
          title: 'BPA已发布的流程总数'
        },
        {
          num: '0',
          name: '流程节点总数',
          ico: 'el-icon-connection',
          color: '#b35141',
          title: 'BPA已发布流程的节点总数'
        },
        {
          num: '0',
          name: '覆盖岗位',
          ico: 'el-icon-s-custom',
          color: '#019874',
          title: 'BPA已发布流程中参与的岗位数'
        },
        {
          num: '0',
          name: '手工节点',
          ico: 'el-icon-copy-document',
          color: '#b37e11',
          title: 'BPA已发布流程的线下节点总数'
        },
        {
          num: '0',
          name: '线上节点',
          ico: 'el-icon-crop',
          color: '#3577c0',
          title: 'BPA已发布流程的线上节点总数'
        }
      ],
      isHighSearch: false,
      keyWords: '',
      searchForm: {},
      searchoptions: [
        {
          label: '新建',
          value: '2'
        },
        {
          label: '修改',
          value: '5'
        },
        {
          label: '作废',
          value: '8'
        }
      ],
    }
  },
  computed: {},
  mounted() {
    this.getTop()
    if (this.$route.query.processValue) {
      this.processValue = this.$route.query.processValue
      this.processValues = this.processValue.toString()
    }
    this.getBpaNumList('') // 获取头部基础数据
    this.getOneFrameworkList() // 获取业务域
    this.getList('')
  },
  methods: {
    // 获取年月日
    getTop() {
      var now = new Date() // 当前日期
      var nowMonth = now.getMonth() // 当前月
      var nowYear = now.getFullYear() // 当前年
      var monthStartDate = new Date(nowYear, nowMonth, 1)
      var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth))
      this.processstartTime = formatDate(new Date(monthStartDate))
      this.processendTime = formatDate(new Date(monthEndDate))
    },
    // 是否显示明细触发按钮
    search(ele) {
      this.getList()
    },
    reset() {
      this.searchForm = Object.assign({}, this.searchForm, {
        status: '',
        operator: '',
        classify: '',
        operatetime: '',
        operatorname: ''
      })
      this.filters = [
        {
          key: 'status',
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm.status
        },
        {
          key: 'operator',
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm.operator
        },
        {
          key: 'classify',
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm.classify
        },
        { key: 'operatetime', opt: 'BETWEEN', type: 'D', value: '' },
        {
          key: 'operatorname',
          opt: 'LIKE',
          type: 'S',
          value: this.searchForm.operatorname
        }
      ]
      this.getList()
    },
    // 导出excel
    Excelexport() {
      this.downloadLoading = true
      var obj = {
        startTime: this.processstartTime,
        endTime: this.processendTime,
        ids: this.processValues
      }
      const list = Object.entries(obj)
      let str = ''
      list.map(item => {
        str += item[0] + '=' + item[1] + '&'
      })
      exportProcessReleaseDetailData(str).then(res => {
        if (!res) return false
        export_post_list(res, '流程发布情况.xlsx')
        this.downloadLoading = false
      })
    },
    // 返回事件
    goBack() {
      this.$router.go(-1) // 返回上一层
    },
    // 选择业务域确定
    submitForm1(ele) {
      // const processValues = this.processValue.toString()
      this.processValues = this.processValue.toString()
      this.getList()
      this.getBpaNumList()
    },
    // 获取流程框架
    getOneFrameworkList() {
      getOneFrameworkList().then(res => {
        if (!res) return false
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
            (mapItem.children || (mapItem.children = [])).push(child) // 这里判断mapItem中是否存在child
          } else {
            // 不存在则是顶层数据
            treeData.push(child)
          }
        })
        this.options = treeData
      })
    },
    // 获取关键指标
    getBpaNumList() {
      const obj = 'id=' + this.processValues
      getBpaNum(obj).then(res => {
        if (!res) return false
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
        treeid: this.processValues || '',
        startdate: this.processstartTime,
        enddate: this.processendTime,
        pageNumber: this.pagesData.pageNum,
        pageSize: this.pagesData.pageSize
      }
      getProcessDetail(obj).then(res => {
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
