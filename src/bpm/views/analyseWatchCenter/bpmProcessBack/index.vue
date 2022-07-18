<template>
  <div id="database">
    <el-main class="di__main">
      <el-row class="margin-b15">
        <el-col style="text-align:center">
          <el-radio v-model="radio" label="1" style="color: #fff;">流程匹配程度</el-radio>
          <el-radio v-model="radio" label="2" style="color: #fff;">超期时间</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="base-content">
        <div class="base-content-item clear-fix">
          <el-col :span="24">
            <el-table v-show="radio == 1" :data="tableData" size="small">
              <!-- <el-table-column type="index" :label="$t('number')" align= "center"></el-table-column> -->
              <el-table-column prop="state" :label="$t('state')" align="center" width="50">
                <template slot-scope="scope">
                  <div class="parents">
                    <div class="stateRound"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="weather" label="程度" align="center" width="80">
                <template slot-scope="scope">
                  <span :class="scope.row.weather" class="iconfont" style="transform:scale(1.5)"/>
                </template>
              </el-table-column>
              <el-table-column prop="ValueChainName" label="价值链阶段名称" align="center"/>
              <el-table-column prop="compatibility" label="匹配度" align="center"/>
              <el-table-column prop="mismatchedKey" label="不匹配关键点" align="center"/>
              <el-table-column prop="operation" :label="$t('operation')" width="240" align="center">
                <template slot-scope="scope">
                  <el-button plain size="mini" @click="jump1">价值链&nbsp;</el-button>
                  <el-button plain size="mini" @click="jump2">流程清单</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-show="radio == 2" :data="tableDatapro" size="small">
              <!-- <el-table-column type="index" :label="$t('number')" align= "center"></el-table-column> -->
              <el-table-column prop="state" :label="$t('state')" align="center" width="50">
                <template slot-scope="scope">
                  <div class="parents">
                    <div class="stateRound"/>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="weather" label="程度" align="center" width="80">
                <template slot-scope="scope">
                  <span :class="scope.row.weather" class="iconfont" style="transform:scale(1.5)"/>
                </template>
              </el-table-column>
              <el-table-column prop="ValueChainName" label="价值链阶段名称" align="center"/>
              <el-table-column prop="compatibility" label="规定时间" align="center"/>
              <el-table-column prop="mismatchedKey" label="实际时间" align="center"/>
              <el-table-column prop="exceedTime" label="超期时间" align="center"/>
              <el-table-column prop="exceedPercent" label="超期百分比" align="center"/>
              <el-table-column prop="operation" :label="$t('operation')" width="240" align="center">
                <template slot-scope="scope">
                  <!-- <el-button plain size="mini" @click="jump1">价值链&nbsp;</el-button>
                  <el-button plain size="mini" @click="jump2">流程清单</el-button> -->
                  <a @click="jump1">查看</a>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :total="7" small layout="total, prev, pager, next, jumper"/>
          </el-col>
        </div>
      </el-row>
    </el-main>
  </div>
</template>
<script>
import routerImg from '@/bpm/assets/img/analyseWatchCenter/router.png'
import routerActiveImg from '@/bpm/assets/img/analyseWatchCenter/router_active.png'
// import { getTreelist, getDataBaseList, getFormList } from '@/bpm/api/diCenter'
import '@/bpm/assets/fonts/font_weather/iconfont.css'
import '@/bpm/assets/fonts/font_weather/iconfont.eot'
import '@/bpm/assets/fonts/font_weather/iconfont.ttf'
import '@/bpm/assets/fonts/font_weather/iconfont.svg'
export default {
  data() {
    return {
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      processList: [],
      grandParentId: '',
      treeKey: 0,
      props: {
        label: 'name',
        isLeaf: function(data, node) {
          if (data.isparent === true) {
            return false
          } else {
            return true
          }
        }
      },
      updateForm: {
        id: '',
        kpicode: '',
        kpiname: '',
        description: '',
        exname: '',
        pvalue1: '',
        pvalue2: '',
        threshold: '',
        vcid: ''
      },
      updateForm1: {
        code: '',
        name: '',
        lastname: ''
      },
      node: '',
      resolve: '',
      nodeCode: '',
      defaultExpand: false,
      childrenlist: [],
      formList: [],
      // 树形控件的数据
      data: [
        {
          label: '运行实例',
          children: [
            {
              label: '职位分析'
            },
            {
              label: '效率任务分析'
            }
          ]
        },
        {
          label: '流程瓶颈分析',
          children: [
            {
              label: '价值链'
            },
            {
              label: '流程'
            },
            {
              label: '节点'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表格的数据
      tableData: [
        {
          weather: 'iconfont icon-ziyuan',
          ValueChainName: '项目全周期',
          compatibility: '27%',
          mismatchedKey: ' 开发建设',
          operation: ''
        },
        {
          weather: 'iconfont icon-xiaoyu',
          ValueChainName: 'OTD',
          compatibility: '65%',
          mismatchedKey: ' 订单交付',
          operation: ''
        },
        {
          weather: 'iconfont icon-leiyu',
          ValueChainName: '销售一体化',
          compatibility: '35%',
          mismatchedKey: ' 采购供应',
          operation: ''
        },
        {
          weather: 'iconfont icon-ziyuan',
          ValueChainName: '采购业务一体化',
          compatibility: '14%',
          mismatchedKey: ' 战略寻源',
          operation: ''
        },
        {
          weather: 'iconfont icon-xiaoyu',
          ValueChainName: '财务业务一体化',
          compatibility: '18%',
          mismatchedKey: ' 获利能力分析',
          operation: ''
        },
        {
          weather: 'iconfont icon-xiaoyu',
          ValueChainName: '资产全周期',
          compatibility: '21%',
          mismatchedKey: ' 规划预算',
          operation: ''
        },
        {
          weather: 'iconfont icon-ziyuan',
          ValueChainName: '全质量管理',
          compatibility: '32%',
          mismatchedKey: '安全环保质量',
          operation: ''
        }
      ],
      // 表格的数据
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
      ],
      // 单选框
      radio: '1'
    }
  },
  methods: {
    jump1() {

      if (this.radio == 1) {
        const { href } = this.$router.resolve('/analyseWatchCenter/valueChain')
        window.open(href, '_blank')
        console.log({ href },3333)
      } else {
        const { href } = this.$router.resolve('/analyseWatchCenter/lineChart')
        window.open(href, '_blank')
      }
    },
    jump2() {
      if (this.radio === 1) {
        const { href } = this.$router.resolve('/analyseWatchCenter/processList')
        window.open(href, '_blank')
      } else {
        const { href } = this.$router.resolve('/analyseWatchCenter/processList')
        window.open(href, '_blank')
      }
    },
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  width: calc(100% - 24px);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .grow {
    max-width: 100%;
    min-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 70px;
  }
  .add {
    color: $tc5;
    padding: 5px;
    display: none;
  }
  &:hover,
  &:focus {
    .add {
      display: inherit;
      color: #39cdfb;
    }
  }
}
#database {
  width: 100%;
  height: calc(100vh);
  background-size: 100% 100%;
  .di__router-container {
    :hover {
      span {
        color: #39cdfb;
      }
    }
    span {
      color: #2e77bb;
      font-size: 22px;
    }
    position: relative;
    span {
      left: 128px;
      top: 18px;
    }
  }
  .di__router {
    padding-left: 30px;
    // background: url("") no-repeat;
    background-size: 100% 100%;
  }
  .absolute {
    position: absolute;
    z-index: 2;
  }
  .base_router {
    span {
      color: #39cdfb;
    }
  }
  .header-database {
    left: 125px !important;
  }
  .header-database.left143px {
    left: 143px !important;
  }
  .header-database1 {
    left: 135px !important;
  }
  .header-database2 {
    left: 146px !important;
  }
  .base-content {
    border: 1px solid #1d4f7e;
    border-radius: 3px;
    margin: 0 22px !important;
    /*box-shadow: 5px 5px 10px #1d4f7e;*/
    box-shadow: #1d4f7e 0px 0px 15px 5px inset;
    .base-content-item {
      padding: 20px;
      .base-button {
        color: #00d6e6;
      }
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
          transform: translate(-50%);
          background-color: red;
          border-radius: 10px;
        }
      }
    }
  }
  .left_tree_wrapper1.el-scrollbar {
    height: calc(100vh - 210px) !important;
    /*background: #23356d;*/
    .el-scrollbar__wrap {
      overflow: auto !important;
    }
  }
  .button-base {
    .el-button {
      background: #169bd5;
      border: 1px solid #3378b9;
      color: #00d6e6;
      &:hover,
      &:focus {
        color: #39cdfb;
      }
    }
  }
  .base-title {
    color: #3276b5;
    font-size: 19px;
  }
}
.targetSign {
  width: 318px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
}
.bg-lightGreen {
  background-color: rgba(208, 225, 125, 1);
}
.bg-yellow {
  background-color: rgba(255, 255, 0, 1);
}
.bg-red {
  background-color: rgba(255, 0, 0, 1);
}
.bg-lightGray {
  background-color: rgba(204, 204, 204, 1);
}
/deep/.el-table {
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
/deep/.el-pagination button:disabled {
  background-color: transparent;
}
</style>
