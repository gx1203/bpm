<template>
  <div class="item-list flex ">
    <div class="flex">
      <div class="flex">
        <div :class="{'level2': getList.folderlevel == '2', 'level3': getList.folderlevel == '3', 'level4': getList.folderlevel == '4', 'level5': getList.folderlevel == '5', 'level6': getList.folderlevel == '6'}" :title="getList.area" class="text-name" @click="topage(getList)">
          <p :style="{ lineHeight: getList.charts ? '' : '42px' }">
            <img v-if="getList.tagss" src="../../../../../src/assets/img/liuchen.png" style="float:left;padding: 10px 6px 0px 10px;width:18px" alt="">
            <span :style="getList.tagss ? 'float:left;width: 172px;text-align: left;' : ''">{{ getList.area }}</span>
          </p>
        </div>
        <p
          class="node node-margin"
          v-show="getList.childList !== null && getList.childList.length > 0"
          @click="handleClick(getList, 'parant', '2')"
          :class="{'level2border': getList.folderlevel == '2', 'level3border': getList.folderlevel == '3', 'level4border': getList.folderlevel == '4', 'level5border': getList.folderlevel == '5', 'level6border': getList.folderlevel == '6'}"
          v-if="!list.tables"
        >
          {{ getList.show === 0 ? '+' : '-' }}
        </p>
        <!-- <item-tab :tab="list.tables" v-show="getList.tableShow" :tabColor="color" /> -->
        <p
          class="node margins"
          @click="handleClick(getList, 'child', '3')"
          v-show="getList.tableShow && list.tables && getList.childList !== null && getList.childList.length > 0"
          :class="{'level2border': getList.folderlevel == '2', 'level3border': getList.folderlevel == '3', 'level4border': getList.folderlevel == '4', 'level5border': getList.folderlevel == '5', 'level6border': getList.folderlevel == '6'}"
        >
          {{ getList.show ? '-' : '+' }}
        </p>
      </div>
    </div>
    <div v-show="getList.show === 1" class="flex">
      <div class="borders" v-if="getList.childList !== null && getList.childList.length > 0">
        <div v-for="(item, index) in getList.childList" :key="index" class="margins">
          <dg-page :list="item" :color="color" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ItemTab from './index.vue'
// import BaseChart from '../../../../components/echart/BaseChart'
// import EChart from '../../../../components/echart/index'
function format(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (typeof date === 'number') {
    date = new Date(date)
  } else if (typeof date === 'string') {
    date = new Date(Number(date))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length))
    }
  }
  return fmt
}
export default {
  name: 'DgPage',
  // components: { ItemTab, EChart }, // EChart,
  props: {
    list: {
      type: Object,
      default: () => {
        return {}
      }
    },
    color: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      getList: JSON.parse(JSON.stringify(this.list)),
      dialogVisible: false,
      time: [], // 选择时间
      parentData: {},
      dateType: 3,
      activeName: 'first',
      charrtList: [], // echarts图形
      allCharts: [],
      checkedCities: [], // 所有数组
      detailLinecheck: [], // 选中项
      loading: true
    }
  },
  // 监听数据
  watch: {
    list: {
      handler: function(val, oldval) {
        console.log('list-我变化了', val)
        this.getList = val
        this.$set(this.getList, 'changeTime', Date.parse(new Date())) // 刷新数据
      },
      deep: true
    }
  },
  mounted() {
    this.$set(this.getList, 'tableShow', true)
  },

  methods: {
    getMychart(param) {
      this.allCharts.push(param)
      this.$echarts.connect([...this.allCharts])
    },
    topage(item) {
      console.log(item, '1111')
      if (item.tags) {
        var url = '#/rulesAbolishDetail/' + item.id + '/null'
        window.open(url, '_blank')
        return false
      } else if (item.tagss) {
        var urls = '#/processDetails/' + item.id
        window.open(urls, '_blank')
      } else {
        const { href } = this.$router.resolve({
          path: '/rulesCenter/ruleView',
          query: {
            parent: item.parents
          }})
        window.open(href, '_blank')
      }
    },
    handleClick(data, flag, bb) {
      if (flag === 'child') {
        this.getList.tableShow = true
        this.getList.show = this.getList.show === 0 ? 1 : 0
      } else {
        if (this.getList.tableShow) {
          this.getList.tableShow = false
          this.getList.show = this.getList.show === 0 ? 1 : 0
        } else {
          this.getList.tableShow = true
          this.getList.show = this.getList.show === 0 ? 1 : 0
        }
      }
    },
    // 是否展示
    change() {
      this.charrtList.forEach(item => {
        item.isShow = this.detailLinecheck.indexOf(item.chartval.name) !== -1
      })
    },
    compare(a, b) {
      let adate = a.time
      let bdate = b.time
      if (adate < bdate) {
        return -1
      } else if (adate > bdate) {
        return 1
      } else {
        return 0
      }
    },
    // 初始化数据
    chooseChart(data) {
      this.dialogVisible = true
      this.parentData = data
      let arr = []
      let params = []
      let legend = []
      arr.push(data.tagName ? data.tagName : null)
      legend.push(data.area)
      data.children.map(i => {
        if (i.tagName) {
          arr.push(i.tagName)
          legend.push(i.area)
        }
      })
      let startTime = new Date(format(new Date().getTime(), 'yyyy-MM-dd 00:00:00')).getTime() - 24 * 60 * 60 * 7000
      let endTime = new Date().getTime()
      arr.map(i => {
        if (i) {
          params.push({
            datetype: data.area.indexOf('检测值') !== -1 ? 10 : this.dateType,
            startTime: startTime,
            endTime: endTime,
            name: i,
            statistics: []
          })
        }
      })
      this.$axios({
        method: 'post',
        url: 'report/indicator/area/charts',
        data: params
      }).then(res => {
        this.loading = false
        let result = JSON.parse(JSON.stringify(res.data))
        let getListData = []
        let time = []
        let resData = []
        let allxdata = []
        result.forEach(item => {
          if (item.list.length > 0) {
            item.list.forEach(listItem => {
              listItem.time = new Date(listItem.time).getTime()
              allxdata.push(listItem)
            })
          }
        })
        allxdata.sort(this.compare)
        let obj = {}
        allxdata = allxdata.reduce(function(prev, item) {
          obj[item.time] ? '' : (obj[item.time] = 1 && prev.push(item))
          return prev
        }, [])
        result.forEach(item => {
          let data = []
          if (item.list.length > 0) {
            allxdata.forEach((its, index) => {
              let flag = 1
              let curitem = {}
              item.list.forEach(listItem => {
                curitem = listItem
                if (listItem.time === its.time) flag = 0
              })
              if (flag) {
                data.push({ date: its.time, value: null })
              } else {
                data.push({ date: its.time, value: curitem.value ? curitem.value.toFixed(2) : curitem.value })
              }
            })
            data.sort(this.compare)
            resData.push({
              data: data,
              name: item.list[0].name,
              type: 'line'
            })
          }
        })
        allxdata.forEach(item => {
          time.push(format(new Date(item.time).getTime(), 'yyyy-MM-dd'))
        })
        time = Array.from(new Set(time))
        getListData = JSON.parse(JSON.stringify(resData))
        let title = []
        getListData.map(i => {
          if (data.children.length > 0) {
            data.children.map(j => {
              if (i.name === j.tagName) {
                i.name = j.area
              }
              if (i.name === data.tagName) {
                i.name = data.area
                title.push(data.area)
              }
            })
          } else {
            i.name = data.area
            title.push(data.area)
          }
          delete i.list
          if (!i.data) {
            delete i.data
          }
        })
        let chartArr = []
        getListData.map((i, key) => {
          chartArr.push({
            isShow: true,
            chartval: {
              chartEle: null,
              index: this.key,
              name: i.name
            },
            option: {
              tooltip: { trigger: 'axis' },
              title: {
                text: i.name,
                textStyle: {
                  fontStyle: 'normal',
                  fontSize: 15
                },
                right: 0,
                top: 5
              },
              grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
              xAxis: { type: 'category', boundaryGap: false, data: time },
              yAxis: { type: 'value' },
              series: [i]
            }
          })
        })
        this.charrtList = chartArr
      })
    },
    // 按条件查询
    chooseCell() {
      this.loading = true
      let startTime = ''
      let endTime = ''
      /* 时间戳 */
      if (this.time.length > 0) {
        startTime = new Date(this.time[0]).getTime()
        endTime = new Date(this.time[1]).getTime()
      }
      if (this.time.length === 0) {
        if (this.activeName === 'first') {
          startTime = new Date(format(new Date().getTime(), 'yyyy-MM-dd 00:00:00')).getTime() - 24 * 60 * 60 * 1000 * 7
          endTime = new Date().getTime()
        } else if (this.activeName === 'second') {
          startTime = new Date(format(new Date().getTime(), 'yyyy-MM-dd 00:00:00')).getTime() - 24 * 60 * 60 * 1000 * 15
          endTime = new Date().getTime()
        } else if (this.activeName === 'third') {
          startTime = new Date(format(new Date().getTime(), 'yyyy-MM-dd 00:00:00')).getTime() - 24 * 60 * 60 * 1000 * 30
          endTime = new Date().getTime()
        } else if (this.activeName === 'fourth') {
          startTime =
            new Date(format(new Date().getTime(), 'yyyy-MM-dd 00:00:00')).getTime() - 24 * 60 * 60 * 1000 * 365
          endTime = new Date().getTime()
        }
      }
      /* 处理参数 */
      let arr = []
      let params = []
      arr.push(this.parentData.tagName ? this.parentData.tagName : null)
      this.parentData.children.map(i => {
        if (i.tagName) {
          arr.push(i.tagName)
        }
      })
      arr.map(i => {
        if (i) {
          params.push({
            datetype: this.dateType,
            startTime: startTime,
            endTime: endTime,
            name: i,
            statistics: []
          })
        }
      })
      this.$axios({
        method: 'post',
        url: 'report/indicator/area/charts',
        data: params
      }).then(res => {
        this.loading = false
        let result = JSON.parse(JSON.stringify(res.data))
        let getListData = []
        let time = []
        let legend = []
        let resData = []
        result.map(i => {
          let data = []
          if (i.list.length > 0) {
            i.list.forEach(j => {
              time.push(format(new Date(j.time).getTime(), 'yyyy-MM-dd'))
              data.push(j.value ? j.value.toFixed(2) : j.value)
            })
            resData.push({
              data: data,
              name: i.list[0].name,
              type: 'line'
            })
          }
        })
        time = Array.from(new Set(time))
        getListData = JSON.parse(JSON.stringify(resData))
        getListData.map(i => {
          if (this.parentData.children.length > 0) {
            this.parentData.children.map(j => {
              if (i.name === j.tagName) {
                i.name = j.area
              }
              if (i.name === this.parentData.tagName) {
                i.name = this.parentData.area
              }
            })
          } else {
            i.name = this.parentData.area
          }

          delete i.list
          if (!i.data) {
            delete i.data
          }
          legend.push(i.name)
          this.checkedCities = legend
        })
        let chartArr = []
        getListData.map((i, key) => {
          chartArr.push({
            isShow: true,
            chartval: {
              chartEle: null,
              index: this.key,
              name: i.name
            },
            option: {
              tooltip: { trigger: 'axis' },
              grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
              xAxis: { type: 'category', boundaryGap: false, data: time },
              yAxis: { type: 'value' },
              series: [i]
            }
          })
        })
        this.charrtList = chartArr
      })
    },
    // 时间选择
    timeChange(data) {
      this.time = data
      this.activeName = ''
    },
    tanChange(data) {
      this.time = []
    },

    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false
      /*this.detailLinecheck = []
      this.checkedCities = []
      this.charrtList = []*/
      this.detailLinecheck = []
      this.charrtList = []
    }
  }
}
</script>
<style>
.item-list {
  .el-tabs__item {
    font-size: 13px;
  }
}
</style>
<style scoped lang="scss">
.titles {
  display: flex;
  justify-content: space-between;
  .right {
    font-size: 13px;
    color: #ccc;
    cursor: pointer;
  }
}
.charts-wrap {
  .pick-wrap {
    .choose-wrap {
      display: flex;
      justify-content: flex-start;
    }
  }
  .el-date-editor {
    margin-top: 7px;
  }
}
.active {
  color: red;
}
.node-margin {
  margin-top: 12px;
  margin-left: 10px;
  margin-right: 10px;
}
.margins {
  margin-top: 12px;
  margin-left: 10px;
  margin-right: 10px;
}
.borders {
  margin-top: 5px;
  border-left: 1px dotted #ddd;
  border-image: -webkit-linear-gradient(#2d42af, #2d42af) 20 20;
  border-image: -moz-linear-gradient(#2d42af, #2d42af) 20 20;
  border-image: -o-linear-gradient(#2d42af, #2d42af) 20 20;
  border-image: linear-gradient(#2d42af, #2d42af) 20 20;
  position: relative;
  min-height: 42px;
}
.borders:after {
  position: absolute;
  top: -1px;
  height: 100%;
  left: 0;
  width: 20px;
  content: '';
  border-top: solid #2d42af 1px;
  border-bottom: solid #2d42af 1px;
  border-radius: 1px;
}
.borders > div:first-child {
  margin-top: 0;
}
.el-wrap-flex {
  display: flex;
  justify-content: flex-start;
}
.flex {
  display: flex;
  justify-content: flex-start;
}
.node {
  width: 18px;
  height: 18px;
  text-align: center;
  line-height: 18px;
  border: 1px solid #222222;
  border-radius: 50%;
  cursor: pointer;
}
.text-name {
  box-shadow: 2px 2px 12px 0px rgba(147, 163, 198, 0.45);
  width: 210px;
  height: 42px;
  text-align: center;
  background: #00b0f0;
  color: #fff;
  word-wrap: break-word;
  white-space: pre-wrap;
  p {
    line-height: 30px;
  }
  a {
    color: white;
  }
}
.item-list {
  margin-left: 30px;
}
.level2 {
  background-color: #1bc5c7;
  cursor: pointer;
}
.level3{
  background-color:  #2d42af;
  cursor: pointer;
}
.level4{
  background-color: #5264bf;
  cursor: pointer;
}
.level5{
  background-color: #7084cc;
  cursor: pointer;
}
.level6{
  background-color: #9aaad9;
  cursor: pointer;
}
.level2border {
  color: #1bc5c7;
  border-color: #1bc5c7;
}
.level3border{
  color:  #2d42af;
  border-color: #2d42af;
}
.level4border{
  color: #5264bf;
  border-color: #5264bf;
}
.level5border{
  color: #7084cc;
  border-color: #7084cc;
}
.level6border{
  color: #9aaad9;
  border-color: #9aaad9;
}
</style>
