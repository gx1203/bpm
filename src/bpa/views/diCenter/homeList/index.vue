<template>
  <div id="detaillist">
    <el-main class="di__main">
      <el-row :span="24" class="margin-b15">
        <el-col :span="6" class="di__router-container">
          <router-link
            :to="{path: '/diCenter/home'}"
            class="di__router base_router"
          >
            <img :src="routerImg" class="w80" alt="图片" >
            <span class="absolute header-database">运营监控</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'databaselist'}" class="di__router">
            <img :src="routerImg" alt="图片" class="w80">
            <span class="absolute header-database1">指标库</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'home'}" class="di__router">
            <img :src="routerImg" alt="图片" class="w80" />
            <span class="absolute header-database2">风控</span>
          </router-link>
        </el-col>
        <el-col :span="6" class="di__router-container">
          <router-link :to="{name: 'doorCenter'}" class="di__router">
            <img :src="routerImg" alt="图片" class="w80">
            <span class="absolute header-database2">门户</span>
          </router-link>
        </el-col>
      </el-row>
      <div>
        <el-row :span="24" class="targetChart margin-b15">
          <el-col :span="12" class="button-base">
            <el-button :class="{'active': month ==='LastMonth'}" @click="lastMonth">上月</el-button>
            <el-button :class="{'active': month ==='ThisMonth'}" @click="newMonth">本月</el-button>
            <el-button :class="{'active': month ==='ThisSeason'}" @click="seasonFilter">本季度</el-button>
          <el-button :class="{'active': month ==='ThisYear'}" @click="yearFilter">本年</el-button>
          </el-col>
        </el-row>
        <div class="detailChart">
          <el-row>
            <el-col :span="4" class="h200px relative" v-for="(item, index) in chartsData" :key="item.id">
              <div class="w100 h200px" ref="detailCharts"  @mouseover.stop="showDetail(index)" @mouseout.stop="showDetail(index)"></div>
              <ul class="showContent" v-show="chartsData[index].show">
                <li class="fontplan1"><span>计划值1:</span>{{!!item ? item.pvalue1:''}}</li>
                <li class="fontplan2"><span>计划值2:</span>{{!!item ? item.pvalue2:''}}</li>
                <li class="fontthreshold"><span>阈值:</span>{{!!item ? item.threshold:''}}</li>
              </ul>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-main>
  </div>
</template>
<script>
// 引入echarts
import echarts from 'echarts'

import routerImg from '@/bpa/assets/img/qietu/router.png'
import routerActiveImg from '@/bpa/assets/img/qietu/router_active.png'
import {
  detailChart
} from '@/bpa/api/diCenter'
export default {
  data() {
    return {
      routerImg: routerImg,
      routerActiveImg: routerActiveImg,
      queryId: '',
      month: 'ThisMonth',
      commonChart: {
        type:'gauge',
        min:0,
        axisLabel: {
          textStyle: {
            fontWeight: 'bolder',
            color: '#fff',
            shadowBlur: 10
          }
        },
        itemStyle:{
          color:'#1e90ff'
        },
        pointer:{
          length: '60%'
        }
      },
      firstarchiture: {
        name:'税前利润',
        max: 100,
        center: ['50%', '50%'],
        radius: '90%',
        axisLine: {
          lineStyle: {
            color: [[0.25, '#cccccc'],[0.5, '#ff4500'],[0.75, '#feff00'],[1, 'lime']],
            width: 2,
            shadowColor : '#fff',
            shadowBlur: 10
          }
        },
        axisTick: {
          length : 5,
          lineStyle: {
            color: 'auto',
            width: 1,
            shadowBlur: 10
          }
        },
        splitLine:{
          length: 7,
          lineStyle:{
            width: 2,
            color:'#FCD209'
          }
        },
        detail: {
          show: true,
          fontSize: '12',
          lineHeight: 14,
          color: '#fff',
          offsetCenter: [0, '60%']
        },
        data:[{value: '100'}]
      },
      chartsData: []
    }
  },
  mounted() {
    this.queryId = this.$route.query.id
    this.getChart()
  },
  methods: {
    getChart () {
      let self = this
      detailChart({
        "attr": {
          "time": self.month == 'LastMonth' ? '上月': (self.month == 'ThisMonth' ? '本月':(self.month == 'season' ? '本季度':'本年')),
          "id": this.queryId
        }
      }).then(res => {
        console.log(res)
        if (!res) return false
        self.chartsData = JSON.parse(JSON.stringify(res))
        let arr = []
        for (let i = 0; i < res.length; i++) {
          self.chartsData[i].show = false
          let item = res[i]
          let index = i
          let obj = JSON.parse(JSON.stringify(self.firstarchiture))
          let commonObj = JSON.parse(JSON.stringify(self.commonChart))
          let profitMax = item.pvalue1 > parseFloat(item.kpivalue) ? (item.pvalue1 + Math.pow(10, (item.pvalue1 + '').length - 1)) : (parseFloat(item.kpivalue) + Math.pow(10, (item.kpivalue + '').length - 1))
          obj.center = ['50%', '50%']
          let name = res[index].kpiname
          let value = res[index].kpivalue
          obj.name = name
          obj.max = !profitMax ? '':profitMax
          obj.silent = false
          obj.detail.formatter = !profitMax ? '':(value/((profitMax + '').length < 4 ? 1:10000) + '\n' + name + (!profitMax ? '':((profitMax + '').length < 4 ? '' : ' (万)')))
          obj.data = [{"value": !item.kpivalue ? 0 : parseFloat(item.kpivalue).toFixed(2), 'id': item.id}]
          obj.axisLine.lineStyle.color = [[!profitMax ? 0.2:(item.threshold / profitMax).toFixed(2), '#cccccc'],[!profitMax ? 0.45:(item.pvalue2 / profitMax).toFixed(2), '#ff4500'],[!profitMax ? 0.75:(item.pvalue1 / profitMax).toFixed(2), '#feff00'] , [1, 'lime']]
          arr.push(JSON.parse(JSON.stringify(Object.assign({}, commonObj, obj))))
          self.chartsData[i].pvalue1 = (profitMax + '').length < 4 ? self.chartsData[i].pvalue1 : self.chartsData[i].pvalue1 / 10000
          self.chartsData[i].pvalue2 = (profitMax + '').length < 4 ? self.chartsData[i].pvalue2 : self.chartsData[i].pvalue2 / 10000
          self.chartsData[i].threshold = (profitMax + '').length < 4 ? self.chartsData[i].threshold : self.chartsData[i].threshold / 10000
        }
        for (let i = 0; i < arr.length; i++) {
          arr[i].axisLabel.formatter = (value) => {
            return (value+'').length < 4 ? value : (value / 10000);
          }
        }
        this.$nextTick(() => {
          for (let i = 0; i < arr.length; i++) {
            let firstChild = echarts.init(this.$refs.detailCharts[i])
            firstChild.setOption({'series': arr[i]}, true)
          }
        })
      })
    },
    showDetail (index) {
      let show = !this.chartsData[index].show
      let newItem = this.chartsData[index]
      newItem.show= show
      this.$set(this.chartsData, index, newItem)
    },
    lastMonth () {
      this.month = 'LastMonth'
      this.getChart()
    },
    newMonth () {
      this.month = 'ThisMonth'
      this.getChart()
    },
    seasonFilter() {
      this.month = 'ThisSeason'
      this.getChart()
    },
    yearFilter() {
      this.month = 'ThisYear'
      this.getChart()
    },
  },
  computed: {
    route() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
  #detaillist {
    width: 100%;
    height: 100%;
    background: url("../../../assets/img/qietu/beijing.png") no-repeat center center;
    background-size: cover;
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
      /*background: url("") no-repeat;*/
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
      left: 125px!important;
    }
    .header-database1 {
      left: 135px!important;
    }
    .header-database2 {
      left: 146px!important;
    }
    .left_tree_wrapper1.el-scrollbar {
      height: calc(100vh - 208px) !important;
      /*background: #23356d;*/
      .el-scrollbar__wrap {
        overflow: auto!important;
      }
    }
    .button-base {
      padding-top: 10px;
      padding-left: 31px;
      .el-button {
        background: #0a1729;
        border: 1px solid #2e77bb;
        color: #2e77bb;
        &:hover,&:focus {
          color: #8cc7ff;
          background-color: #2e77bb;
        }
      }
      .active{
        color: #8cc7ff;
        background-color: #2e77bb;
      }
    }
    .base-title {
      color: #3276b5;
      font-size: 19px;
    }
    .detailChart{
      height: calc(100vh - 165px)
    }
    .h200px{
      height: 200px;
    }
    .showContent{
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 12px;
      padding: 5px;
      background-color: rgba(0,0,0,.85);
      li{
        line-height: 18px;
        span{
          display: inline-block;
          vertical-align: top;
          width: 50px;
          text-align: right;
          margin-right: 5px;
        }
      }
    }
    .fontplan1{
      color: #feff00;
    }
    .fontplan2{
      color: #e7402c;
    }
    .fontthreshold{
      color: #ccc;
    }
  }
</style>

<style lang="scss">
#detaillist {
  .relative{
    position: relative;
  }
  .button-base {
      .el-button {
        background: #169bd5;
        border: 1px solid #3378b9;
        color: #00d6e6;
        &:hover,&:focus {
          color: #39cdfb;
        }
      }
    }
    .base-content {
      border: 1px solid #1d4f7e;
      border-radius: 3px;
      margin: 30px 22px !important;
      /*box-shadow: 5px 5px 10px #1d4f7e;*/
      box-shadow: #1d4f7e 0px 0px 15px 5px inset;
      .base-content-item {
        padding: 20px;
        .base-button {
          color: #00d6e6;
        }
      }
    }
}
</style>
