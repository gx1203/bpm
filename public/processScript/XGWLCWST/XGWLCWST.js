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
      BKLAS: {
        showValue: item.评估类,
        value: item.评估类
      },
      PEINH: {
        showValue: item.价格单位,
        value: item.价格单位
      },
      STPRS: {
        showValue: item.标准价格,
        value: item.标准价格
      },
      VERPR: {
        showValue: item.移动平均价,
        value: item.移动平均价
      },
      EKALR: {
        showValue: item.用QS的成本估算,
        value: item.用QS的成本估算
      },
      HKMAT: {
        showValue: item.物料来源,
        value: item.物料来源
      },
      LOSGR: {
        showValue: item.成本核算批量,
        value: item.成本核算批量
      },
      PRCTR: {
        showValue: String(
          item[
            '利润中心（100001：HC1利润中心;200001：MC1利润中心;300001：新能源利润中心;400001：海外利润中心;999999：北汽重卡公共利润中心）'
          ]
        ),
        value: String(
          item[
            '利润中心（100001：HC1利润中心;200001：MC1利润中心;300001：新能源利润中心;400001：海外利润中心;999999：北汽重卡公共利润中心）'
          ]
        )
      },
      HRKFT: {
        showValue: item.原始组,
        value: item.原始组
      },
      MMSTA: {
        showValue: item.特定工厂的物料状态,
        value: item.特定工厂的物料状态
      },
      ZPLP1: {
        showValue: item.计划价格,
        value: item.计划价格
      },
      AWSLS: {
        showValue: item.差异码,
        value: item.差异码
      }
    })
  })
  bizData.ZBQY = list
  _this.$store.commit('app/setBizData', bizData)
  console.log(list, 'excel导入的数据')
}
