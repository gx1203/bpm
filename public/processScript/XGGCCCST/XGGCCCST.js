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
      LGORT: {
        showValue:String(
          item[
            '库存地点（中心库：5000）'
          ]
        ),
        value:String( 
          item[
            '库存地点（中心库：5000）'
        ]
        )
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
      ZTRKCLS: {
        showValue: item.一件一码大类,
        value: item.一件一码大类
      },
      ZYJYMBS: {
        showValue: item.一件一码标识,
        value: item.一件一码标识
      },
      ZDVPPS: {
        showValue: item.VPPS,
        value: item.VPPS
      },
      ZDJGFZM: {
        showValue: item.结构分组码,
        value: item.结构分组码
      }
    })
  })
  bizData.ZBQY = list
  _this.$store.commit('app/setBizData', bizData)
  console.log(list, 'excel导入的数据')
}
