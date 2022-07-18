<template>
  <div id="database">
    <el-main class="di__main">
      <el-row>
        <el-col :span="4">
          <el-button @click="jump2">返回上一级</el-button>
        </el-col>
      </el-row>
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
              slot="append"
              style="backgroundcolor:transparent"
              class="search_button"
            >搜索</el-button>
          </el-input>
          <el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">
            高级查询
            <i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
          </el-button>
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
                  clearable
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
        <el-table :data="tableData" size="small">
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
          <el-table-column prop="time" label="申请日期" align="center" width="100"></el-table-column>
          <el-table-column prop="people" label="申请人" align="center" width="100"></el-table-column>
          <el-table-column prop="application" label="审批状态" align="center" width="150"></el-table-column>
          <el-table-column prop="operation" :label="$t('operation')" width="100" align="center">
            <template slot-scope="scope">
              <el-button plain size="mini" @click="jump">流程图</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination small background layout="prev, pager, next, jumper, total" :total="9"></el-pagination>
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
          processName: '采购申请单',
          theme: '办公设备采购',
          time: '2020-1-7',
          people: '张三',
          application: '已经完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37720598,
          processName: '采购申请单',
          theme: '办公设备采购',
          time: '2020-1-7',
          people: '张三',
          application: '已经完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37720598,
          processName: '采购申请单',
          theme: '办公设备采购',
          time: '2020-1-7',
          people: '张三',
          application: '已经完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37720598,
          processName: '采购申请单',
          theme: '办公设备采购',
          time: '2020-1-7',
          people: '张三',
          application: '已经完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37720598,
          processName: '采购申请单',
          theme: '办公设备采购',
          time: '2020-1-7',
          people: '张三',
          application: '已经完成',
          operation: ''
        },
        {
          state: '',
          orderNumber: 37720598,
          processName: '采购申请单',
          theme: '办公设备采购',
          time: '2020-1-7',
          people: '张三',
          application: '已经完成',
          operation: ''
        }
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
      keyWords: ''
    }
  },
  methods: {
    jump() {
      this.$router.push('/processChart')
    },
    jump2() {
      this.$router.push('/analyseWatchCenter/bpaPostDetails')
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
  height: calc(100vh - 245px);
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
