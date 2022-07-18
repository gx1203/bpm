<template>
  <div id="database">
    <el-main class="di__main">
      <!-- <el-row>
        <el-col :span="4">
          <el-button @click="goBack">返回上一级</el-button>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <el-input
            placeholder="请输入内容"
            class="search_component search_input"
            v-model="keyWords"
            clearable
            @keyup.13.native="search('')"
          >
            <el-button
              type="primary"
              icon="iconfont_search icon-sousuo2"
              slot="append"
              style="backgroundcolor:transparent"
              class="search_button"
            ></el-button>
          </el-input>
          <!-- <el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">
            高级
            <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
          </el-button> -->
          <el-radio v-model="radio" label="1" style="color: #fff; margin-left:280px;">流程匹配程度</el-radio>
          <el-radio v-model="radio" label="2" style="color: #fff;">超期时间</el-radio>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <!-- 高级搜索表格 -->
        <el-form
          v-show="isHighSearch"
          class="search_options_wrap"
          :model="searchForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="申请单号">
                <el-input clearable v-model="searchForm.orderNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('processName2')">
                <el-input clearable v-model="searchForm.processName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('subject')">
                <el-input clearable v-model="searchForm.theme"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="操作时间">
                <el-date-picker
                  value-format="yyyy-MM-dd"
                  v-model="searchForm.time"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请人">
                <el-input clearable v-model="searchForm.people"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请状态">
                <el-input clearable v-model="searchForm.application"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="search_buttons_wrap">
            <el-button type="primary" @click="search('high')">搜索</el-button>
            <el-button type="primary">重置</el-button>
          </div>
        </el-form>
      </el-collapse-transition>
      <div class="showContent">
        <el-table :data="tableData" size="small" v-show="radio == 1">
          <el-table-column prop="state" label="状态" align="center" width="50">
            <template slot-scope="scope">
              <div class="parents">
                <div class="stateRound"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderNumber" label="申请单号" align="center"></el-table-column>
          <el-table-column prop="processName" :label="$t('processName2')" align="center"></el-table-column>
          <el-table-column prop="theme" :label="$t('subject')" align="center"></el-table-column>
          <el-table-column prop="time" label="申请日期" align="center"></el-table-column>
          <el-table-column prop="people" label="申请人" align="center"></el-table-column>
          <el-table-column prop="application" label="审批状态" align="center"></el-table-column>
          <el-table-column prop="operation" :label="$t('operation')" align="center">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="jump">查看价值链</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableDatapro" size="small" v-show="radio == 2">
          <el-table-column prop="state" label="状态" align="center" width="50">
            <template slot-scope="scope">
              <div class="parents">
                <div class="stateRound"></div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="weather" label="程度" align="center" width="80">
            <template slot-scope="scope">
              <span class="iconfont" :class="scope.row.weather" style="transform:scale(1.5)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="ValueChainName" label="价值链名称" align="center"></el-table-column>
          <el-table-column prop="compatibility" label="规定时间" align="center"></el-table-column>
          <el-table-column prop="mismatchedKey" label="实际时间" align="center"></el-table-column>
          <el-table-column prop="exceedTime" label="超期时间" align="center"></el-table-column>
          <el-table-column prop="exceedPercent" label="超期百分比" align="center"></el-table-column>
          <el-table-column prop="operation" :label="$t('operation')" width="240" align="center">
            <template slot-scope="scope">
              <a @click="jump1">查看</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination small background layout="prev, pager, next, jumper, total" :total="10"></el-pagination>
      </div>
    </el-main>
  </div>
</template>
<script>
import routerImg from '@/bpa/assets/img/qietu/router.png'
import routerActiveImg from '@/bpa/assets/img/qietu/router_active.png'
import '@/bpa/assets/fonts/font_weather/iconfont.css'
import '@/bpa/assets/fonts/font_weather/iconfont.eot'
import '@/bpa/assets/fonts/font_weather/iconfont.ttf'
import '@/bpa/assets/fonts/font_weather/iconfont.svg'
// 引入echarts
import echarts from 'echarts'
export default {
  data() {
    return {
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      // 下拉菜单的数据
      options: [
        {
          value: '选项1',
          label: '状态1'
        },
        {
          value: '选项2',
          label: '状态2'
        },
        {
          value: '选项3',
          label: '状态3'
        },
        {
          value: '选项4',
          label: '状态4'
        },
        {
          value: '选项5',
          label: '状态5'
        }
      ],
      value: '全部',
      // 表格的数据
      tableData: [
        {
          state: '',
          orderNumber: 37720598,
          processName: '定义客户服务政策和程序',
          theme: '定义客户服务政策和程序',
          time: '2020-1-7',
          people: '刘洋',
          application: '已完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37722301,
          processName: '工艺申请更改',
          theme: '办公设备采购',
          time: '2020-1-9',
          people: '包悦',
          application: '已完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37729945,
          processName: '购物申请流程',
          theme: '电源线',
          time: '2020-1-4',
          people: '朱元华',
          application: '已完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37726725,
          processName: '加班申请流程',
          theme: '刘长鑫请假',
          time: '2020-1-9',
          people: '刘长鑫',
          application: '审批中',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37728812,
          processName: '工艺申请更改',
          theme: '制造223034',
          time: '2020-1-3',
          people: '闫军华',
          application: '已完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37720012,
          processName: 'IT权限变更申请',
          theme: 'SPA权限',
          time: '2020-1-14',
          people: '赵超',
          application: '审批中',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37720038,
          processName: '加班申请流程',
          theme: '李龙请假',
          time: '2020-1-3',
          people: '李龙',
          application: '已完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37720982,
          processName: 'QES申请',
          theme: 'QES申请',
          time: '2020-1-4',
          people: '王常颖',
          application: '已完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37729012,
          processName: '采购清单',
          theme: '办公设备购买',
          time: '2020-1-4',
          people: '张杰',
          application: '审批中',
          operation: ''
        }
        // {
        //   state: '',
        //   orderNumber: 37722020,
        //   processName: '购物申请流程',
        //   theme: '电源线',
        //   time: '2020-1-7',
        //   people: '王林',
        //   application: '审批中',
        //   operation: ''
        // }
      ],
      // 高级搜索
      isHighSearch: false,
      searchForm: {
        orderNumber: '',
        processName: '',
        theme: '',
        time: '',
        people: '',
        application: ''
      },
      // 搜索关键词
      keyWords: '',
      // 单选按钮
      radio: '1',
      // 表格2的数据
      tableDatapro: [
        {
          weather: 'iconfont icon-ziyuan',
          ValueChainName: '资产全周期',
          compatibility: '50',
          mismatchedKey: '55',
          operation: '',
          exceedTime: '20',
          exceedPercent: '25%'
        },
        {
          weather: 'iconfont icon-ziyuan',
          ValueChainName: 'OTD',
          compatibility: '50',
          mismatchedKey: ' 55',
          operation: '',
          exceedTime: '5',
          exceedPercent: '10%'
        },
        {
          weather: 'iconfont icon-ziyuan',
          ValueChainName: '销售一体化',
          compatibility: '50',
          mismatchedKey: ' 55',
          operation: '',
          exceedTime: '5',
          exceedPercent: '10%'
        },
        {
          weather: 'iconfont icon-ziyuan',
          ValueChainName: '采购业务一体化',
          compatibility: '50',
          mismatchedKey: ' 55',
          operation: '',
          exceedTime: '5',
          exceedPercent: '10%'
        },
        {
          weather: 'iconfont icon-leiyu',
          ValueChainName: '财务业务一体化',
          compatibility: '50',
          mismatchedKey: ' 55',
          operation: '',
          exceedTime: '5',
          exceedPercent: '10%'
        },
        {
          weather: 'iconfont icon-leiyu',
          ValueChainName: '资产全周期',
          compatibility: '50',
          mismatchedKey: ' 55',
          operation: '',
          exceedTime: '5',
          exceedPercent: '10%'
        },
        {
          weather: 'iconfont icon-leiyu',
          ValueChainName: '全质量管理',
          compatibility: '50',
          mismatchedKey: ' 55',
          operation: '',
          exceedTime: '5',
          exceedPercent: '10%'
        }
      ]
    }
  },
  methods: {
    // 查看价值链
    jump() {
      this.$router.push('/analyseWatchCenter/valueChain')
    },
    // 返回上一级
    // goBack() {
    //   this.$router.push('/doorCenter')
    // },
    // 查看折线图
    jump1() {
      this.$router.push('/analyseWatchCenter/lineChart')
    }
  }
}
</script>

<style lang="scss" scoped>
#database {
  width: 100%;
  background-size: 100% 100%;
  .el-button {
    background-color: transparent;
    color: #fff;
  }
  .di__main {
    .search_input {
      margin-top: 10px;
      .search_button {
        background-color: transparent !important;
      }
    }
    .search_options_wrap {
      background-color: transparent;
    }
    /deep/ .search_component .el-input-group__append {
      background-color: transparent;
    }
  }
}
/deep/ .el-table {
  color: #fff;
  background-color: transparent;
  thead {
    color: #fff;
    font-weight: 700;
  }
  & td,
  & th.is-leaf {
    border-bottom: 1px solid #4d576f;
  }
  & th,
  & tr {
    background-color: transparent;
  }
  &:before {
    background-color: #4d576f;
  }
  & td a {
    color: #fff;
  }
  & td {
    a:hover {
      color: skyblue;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: rgba(13, 45, 74, 0.5);
}
a,
a:link,
a:visited,
a:hover,
a:active {
  // color: #333;
  text-decoration: none;
  cursor: pointer;
}
.showContent {
  width: 100%;
  height: calc(100vh - 160px);
  .el-button {
    background-color: transparent;
    color: #fff;
  }
  .parents {
    height: 20px;
    position: relative;
    .stateRound {
      width: 10px;
      height: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: red;
      border-radius: 10px;
    }
  }
}
/deep/ .active.el-button--primary.is-plain {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}
/deep/.el-pagination button:disabled {
  background-color: transparent;
}
</style>
