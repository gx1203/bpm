<template>
  <el-card shadow="never">
    <div class="tool-common-wrap margin-b10">
      <div class="btn-wrap" v-show="!isPrint">
        <el-button type="primary" @click="excelFile" :disabled="chartList.length === 0">
          {{ $t('exportToExcel') }}
        </el-button>
        <el-button type="primary" @click="handlePrint" :disabled="chartList.length === 0">
          {{ $t('print') }}
        </el-button>
        <el-button type="primary" @click="getInstanceImage">
          {{ $t('flowChart') }}
        </el-button>
        <el-button type="primary" @click="getCharData">
          {{ $t('refresh') }}
        </el-button>
      </div>
    </div>
    <div id="chartWrap" ref="chartWrap" v-if="chartList.length > 0">
      <div :id="item.id" v-for="(item, index) in chartList" :key="index" style="height: 500px; margin-bottom: 10px;"></div>
    </div>
    <div v-else class="data-empty"> {{ $t('noData') }}</div>
    <InstanceImageDialog v-model="dialogVisible" :instanceId="processName" />
  </el-card>
</template>
<script>
import echarts from 'echarts'
import {
  getCharData
} from '@/bpm/api/process/processModeling/chart_config'
import axios from "axios";
import InstanceImageDialog from "@/bpm/components/startInstanceImage/InstanceImageDialog";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("app");
export default {
  components: {
    InstanceImageDialog
  },
  data() {
    return {
      dialogVisible: false,
      filters: [],
      loading: false,
      editItem: {},
      nodes: {},
      isPrint: false,
      processName: '',
      chartList: [
        // {
        //   "id": "7125870623182233601",
        //   "name": "name",
        //   "dimension": "DEPT",
        //   "dimensionName": "部门",
        //   "dimension2": "",
        //   "type": "Bar",
        //   "quota": "MONEY",
        //   "quotaName": "销售额",
        //   "dataFlag": "",
        //   "dataSize": 0,
        //   "tableName": "TM_LCPXCYG",
        //   "process": true,
        //   "data": [
        //     {
        //       "data": "23.447",
        //       "title": "开发"
        //     },
        //     {
        //       "data": "55.678",
        //       "title": "开发2"
        //     },
        //     {
        //       "data": "33",
        //       "title": "开发3"
        //     }
        //   ],
        //   "yname": "销售额"
        // },
        // {
        //   "id": "7122034651239751682",
        //   "name": "name",
        //   "dimension": "DEPT",
        //   "dimensionName": "部门",
        //   "dimension2": "PRODUCT",
        //   "dimensionName2": "产品",
        //   "type": "Bar",
        //   "quota": "MONEY",
        //   "quotaName": "销售额",
        //   "dataFlag": "",
        //   "dataSize": 0,
        //   "tableName": "TM_LCPXCYG",
        //   "process": true,
        //   "data": [
        //     {
        //       "data": [
        //         {
        //           "data": 83.447,
        //           "title": "总计"
        //         },
        //         {
        //           "data": "18.447",
        //           "title": "A"
        //         },
        //         {
        //           "data": "65",
        //           "title": "C"
        //         }
        //       ],
        //       "title": "开发"
        //     },
        //     {
        //       "data": [
        //         {
        //           "data": 611.678,
        //           "title": "总计"
        //         },
        //         {
        //           "data": "55.678",
        //           "title": "A"
        //         },
        //         {
        //           "data": "556",
        //           "title": "B"
        //         }
        //       ],
        //       "title": "开发2"
        //     },
        //     {
        //       "data": [
        //         {
        //           "data": 99,
        //           "title": "总计"
        //         },
        //         {
        //           "data": "33",
        //           "title": "A"
        //         },
        //         {
        //           "data": "66",
        //           "title": "C"
        //         }
        //       ],
        //       "title": "开发3"
        //     }
        //   ],
        //   "yname": "销售额"
        // },
        // {
        //   "id": "7125870623182233603",
        //   "name": "name",
        //   "dimension": "DEPT",
        //   "dimensionName": "部门",
        //   "dimension2": "",
        //   "type": "Line",
        //   "quota": "MONEY",
        //   "quotaName": "销售额",
        //   "dataFlag": "",
        //   "dataSize": 0,
        //   "tableName": "TM_LCPXCYG",
        //   "process": true,
        //   "data": [
        //     {
        //       "data": "23.447",
        //       "title": "开发"
        //     },
        //     {
        //       "data": "55.678",
        //       "title": "开发2"
        //     },
        //     {
        //       "data": "33",
        //       "title": "开发3"
        //     }
        //   ],
        //   "yname": "销售额"
        // },
        // {
        //   "id": "7122034651239751684",
        //   "name": "name",
        //   "dimension": "DEPT",
        //   "dimensionName": "部门",
        //   "dimension2": "PRODUCT",
        //   "dimensionName2": "产品",
        //   "type": "Line",
        //   "quota": "MONEY",
        //   "quotaName": "销售额",
        //   "dataFlag": "",
        //   "dataSize": 0,
        //   "tableName": "TM_LCPXCYG",
        //   "process": true,
        //   "data": [
        //     {
        //       "data": [
        //         {
        //           "data": 83.447,
        //           "title": "总计"
        //         },
        //         {
        //           "data": "18.447",
        //           "title": "A"
        //         },
        //         {
        //           "data": "65",
        //           "title": "C"
        //         }
        //       ],
        //       "title": "开发"
        //     },
        //     {
        //       "data": [
        //         {
        //           "data": 611.678,
        //           "title": "总计"
        //         },
        //         {
        //           "data": "55.678",
        //           "title": "A"
        //         },
        //         {
        //           "data": "556",
        //           "title": "B"
        //         }
        //       ],
        //       "title": "开发2"
        //     },
        //     {
        //       "data": [
        //         {
        //           "data": 99,
        //           "title": "总计"
        //         },
        //         {
        //           "data": "33",
        //           "title": "A"
        //         },
        //         {
        //           "data": "66",
        //           "title": "C"
        //         }
        //       ],
        //       "title": "开发3"
        //     }
        //   ],
        //   "yname": "销售额"
        // },
        // {
        //   "id": "7125870623182233605",
        //   "name": "name",
        //   "dimension": "DEPT",
        //   "dimensionName": "部门",
        //   "dimension2": "",
        //   "type": "Pie",
        //   "quota": "MONEY",
        //   "quotaName": "销售额",
        //   "dataFlag": "",
        //   "dataSize": 0,
        //   "tableName": "TM_LCPXCYG",
        //   "process": true,
        //   "data": [
        //     {
        //       "data": "23.447",
        //       "title": "开发"
        //     },
        //     {
        //       "data": "55.678",
        //       "title": "开发2"
        //     },
        //     {
        //       "data": "33",
        //       "title": "开发3"
        //     }
        //   ],
        //   "yname": "销售额"
        // },
        // {
        //   "id": "7125870623182233606",
        //   "name": "name",
        //   "dimension": "DEPT",
        //   "dimensionName": "部门",
        //   "dimension2": "",
        //   "type": "Funnel",
        //   "quota": "MONEY",
        //   "quotaName": "销售额",
        //   "dataFlag": "",
        //   "dataSize": 0,
        //   "tableName": "TM_LCPXCYG",
        //   "process": true,
        //   "data": [
        //     {
        //       "data": "23.447",
        //       "title": "开发"
        //     },
        //     {
        //       "data": "55.678",
        //       "title": "开发2"
        //     },
        //     {
        //       "data": "33",
        //       "title": "开发3"
        //     }
        //   ],
        //   "yname": "销售额"
        // }
      ]
    };
  },
  computed: {
    ...mapGetters(["curModule"])
  },
  mounted() {
    let subNodes = []
    this.getPath(this.curModule.subNodes, subNodes)
    this.nodes = subNodes.find(item => item.url === `customChart?id=${this.$route.query.id}`)
    this.getCharData()
  },
  methods: {
    getPath (list, subNodes) {
      for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i]
        subNodes.push(item)
        if (item.subNodes && item.subNodes.length > 0) {
          this.getPath(item.subNodes, subNodes)
        }
      }
    },
    getCharData() {
      getCharData(this.$route.query.id).then(rt => {
        if (rt.data) {
          this.chartList = rt.data.charDataList || []
          this.processName = rt.data.processName
          this.$nextTick(() => {
            this.chartList.forEach(item => {
              if (item.type === 'Bar') {
                this.drawChartBar(item)
              } else if (item.type === 'Line') {
                this.drawChartLine(item)
              } else if (item.type === 'Pie') {
                this.drawChartPie(item)
              } else if (item.type === 'Funnel') {
                this.drawChartFunnel(item)
              }
            })
          })
        }
      })
    },
    handleMultidimensional (item) {
      let list = item.data || []
      let dimensions = ['product']
      let source = []
      list.forEach(val => {
        let sourceItem = {
          product: val.title
        }
        if (Object.prototype.toString.call(val.data) === '[object Array]') {
          val.data.forEach(element => {
            sourceItem[element.title] = Number(element.data)
            if (!dimensions.includes(element.title)) {
              dimensions.push(element.title)
            }
          })
        } else {
          dimensions = ['product', '']
          sourceItem[''] = Number(val.data)
        }
        source.push(sourceItem)
      })
      return { dimensions, source }
    },
    drawChartBar (item) {
      let series = []
      let { dimensions, source } = this.handleMultidimensional(item)

      for (let i = 0, len = dimensions.length - 1; i < len; i++) {
        series.push({
          type: 'bar',
          barMaxWidth: 40,
          // stack: 'overlap',
          // itemStyle: {
          //   normal: {
          //     color: function(params) {
          //       var colorList = [
          //         '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
          //         '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
          //         '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
          //       ];
          //       return colorList[params.dataIndex]
          //     }
          //   }
          // }
        })
      }

      let bar_div = document.getElementById(item.id)
      if (bar_div) {
        let myChart = echarts.init(document.getElementById(item.id))
        let option;
        option = {
          // color: ['#749ee3', '#67d1de', '#72dcbb', '#c4efb5', '#d2f4cc', '#f6e5b5', '#fbf59f'],
          title: {
            left: 'center',
            text: item.name,
          },
          legend: {
            left: 'center',
            top: 40
          },
          grid: {
            top: 100
          },
          tooltip: {},
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          dataset: {
            dimensions: dimensions,
            source: source,
          },
          dataZoom: [
            {
              type: 'slider',
              height: 20,
              bottom: 5,
              endValue: 12 / dimensions.length
            }
          ],
          xAxis: {
            type: 'category',
            name: item.dimensionName,
            nameTextStyle: {
              color: '#000000'
            },
            nameGap: 20,
            axisLabel: {
              color: '#999999',
              margin: 12
            },
            axisLine: {
              lineStyle: {
                color: '#999999',
              }
            }
          },
          yAxis: {
            name: item.yname,
            nameTextStyle: {
              color: '#000000'
            },
            nameGap: 20,
            axisLabel: {
              color: '#999999',
              margin: 12
            },
            axisLine: {
              lineStyle: {
                color: '#999999',
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#dbdbdb',
                type: 'dashed'
              }
            }
          },
          series: series
        };
        option && myChart.setOption(option);
      }
    },
    drawChartLine (item) {
      let series = []
      let { dimensions, source } = this.handleMultidimensional(item)
      for (let i = 0, len = dimensions.length - 1; i < len; i++) {
        series.push({
          type: 'line',
          connectNulls: true,
          symbolSize: 8
        })
      }

      let bar_div = document.getElementById(item.id)
      if (bar_div) {
        let myChart = echarts.init(bar_div)
        let option;
        option = {
          title: {
            left: 'center',
            text: item.name,
          },
          legend: {
            left: 'center',
            top: 40
          },
          grid: {
            top: 100
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              if (params && params.length > 0) {
                let str = `${params[0].name}`
                params.forEach(item => {
                  if (item.data && item.seriesName && item.data[item.seriesName]) {
                    str += `<br/> ${item.marker} ${item.seriesName}：${item.data[item.seriesName]}`
                  }
                  if (item.data[''])  {
                    str += `：${item.data['']}`
                  }
                })
                return (params.length === 1 ? params[0].marker : '') + str
              }
            },
            axisPointer: {
              lineStyle: {}
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          dataset: {
            dimensions: dimensions,
            source: source,
          },
          dataZoom: [
            {
              type: 'slider',
              height: 20,
              bottom: 5,
              endValue: 6
            }
          ],
          xAxis: {
            type: 'category',
            name: item.dimensionName,
            nameTextStyle: {
              color: '#000000'
            },
            nameGap: 20,
            axisLabel: {
              color: '#999999',
              margin: 12
            },
            axisLine: {
              lineStyle: {
                color: '#999999',
              }
            }
          },
          yAxis: {
            name: item.yname,
            nameTextStyle: {
              color: '#000000'
            },
            nameGap: 20,
            axisLabel: {
              color: '#999999',
              margin: 12
            },
            axisLine: {
              lineStyle: {
                color: '#999999',
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#dbdbdb',
                type: 'dashed'
              }
            }
          },
          series: series
        };
        option && myChart.setOption(option);
      }
    },
    drawChartPie (item) {
      let list = item.data || []
      let data = list.map(val => {
        return {
          value: val.data.toString(),
          name: val.title
        }
      })
      let bar_div = document.getElementById(item.id)
      if (bar_div) {
        let myChart = echarts.init(bar_div)
        let option;
        option = {
          title: {
            left: 'center',
            text: item.name,
          },
          tooltip: {
            trigger: 'item',
            formatter: `${item.quotaName} <br> {b} : {c} ({d}%)`
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          series: [
            {
              name: item.quotaName,
              type: 'pie',
              radius: '50%',
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        option && myChart.setOption(option);
      }
    },
    drawChartFunnel (item) {
      let list = item.data || []
      let data = list.map(val => {
        return {
          value: val.data.toString(),
          name: val.title
        }
      })
      let bar_div = document.getElementById(item.id)
      if (bar_div) {
        let myChart = echarts.init(bar_div)
        let option;
        option = {
          title: {
            left: 'center',
            text: item.name,
          },
          tooltip: {
            trigger: 'item',
            formatter: `${item.quotaName} <br> {b} : {c} ({d}%)`
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          series: [
            {
              name: item.quotaName,
              type: 'funnel',
              label: {
                show: true,
                position: 'inside'
              },
              emphasis: {
                label: {
                  fontSize: 20
                }
              },
              data: data
            }
          ]
        };
        option && myChart.setOption(option);
      }
    },
    handlePrint () {
      this.isPrint = true;
      document.getElementsByClassName('parent-header')[0].style.display = "none";
      document.getElementsByClassName('left-aside')[0].style.display = "none";
      document.getElementsByClassName('app-content')[0].style.height = "100%";
      document.getElementsByClassName('breadcrumb')[0].style.display = "none";
      this.$nextTick(() => {
        window.print();
        this.isPrint = false;
        document.getElementsByClassName('parent-header')[0].style.display = "block";
        document.getElementsByClassName('left-aside')[0].style.display = "block";
        document.getElementsByClassName('app-content')[0].style.height = "calc(100vh - 90px)";
        document.getElementsByClassName('breadcrumb')[0].style.display = "block";
      });
    },
    excelFile() {
      axios({
        method: "post",
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/chart/exportCharData/${this.$route.query.id}`,
        data: {},
        responseType: "blob"
      })
        .then(res => {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // 兼容TMD IE
            navigator.msSaveBlob(blob, this.downloadName);
          } else {
            // 其他浏览器
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", `${this.nodes.name || '图表'}.xls`);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        })
        .catch(() => {});
    },
    getInstanceImage(id) {
      if (this.processName) {
        this.dialogVisible = true;
      }
    }
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
/deep/ .el-main {
  margin: 10px;
}
.data-empty {
  line-height: 40px;
  text-align: center;
  color: #999999;
  font-size: 13px;
}
</style>
