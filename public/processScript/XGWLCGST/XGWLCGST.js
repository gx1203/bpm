var _this
var node
var nodeTabLists
//测试页面加载完成
function readyP() {
  _this = arguments[0]
  node = arguments[1]
  nodeTabLists = node.nodeTabLists
  console.log(nodeTabLists)
  console.log(node.bizData)
}

function excelS(e) {
  let list = []
  let bizData = JSON.parse(JSON.stringify(_this.$store.state.app.bizData))
  e.forEach(item => {
    list.push({
      WERKS: {
        showValue: String(item['工厂(生产工厂：8800;研发工厂：8801)']),
        value: String(item['工厂(生产工厂：8800;研发工厂：8801)'])
      },
      MATNR: {
        showValue: item.物料编号,
        value: item.物料编号
      },
      MAKTX: {
        showValue: item.物料描述,
        value: item.物料描述
      },
      EKGRP: {
        showValue: item.采购组,
        value: item.采购组
      },
      MMSTA: {
        showValue: item.特定工厂的物料状态,
        value: item.特定工厂的物料状态
      },
      BSTME: {
        showValue: item.订单单位,
        value: item.订单单位
      },
      UMREZ: {
        showValue: item.可选计量的单位的数量,
        value: item.可选计量的单位的数量
      },
      UMREN: {
        showValue: item.基本计量单位的数量,
        value: item.基本计量单位的数量
      },
      KAUTB: {
        showValue: item.自动采购订单,
        value: item.自动采购订单
      },
      WEBAZ: {
        showValue: item.收货处理时间,
        value: item.收货处理时间
      }
    })
  })
  bizData.ZBQY = list
  _this.$store.commit('app/setBizData', bizData)
  console.log(list, 'excel导入的数据')
}
