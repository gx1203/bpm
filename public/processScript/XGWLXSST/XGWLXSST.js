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
      VKORG: {
        showValue: String(item['销售组织(8800：北汽重型汽车销售组织)']),
        value: String(item['销售组织(8800：北汽重型汽车销售组织)'])
      },
      VTWEG: {
        showValue: String(
          item[
            '分销渠道(10：牵引;20：自卸;30：载货;40：中型车;50：专用车;60：战略大客户;70：其他;80：大委改)'
          ]
        ),
        value: String(
          item[
            '分销渠道(10：牵引;20：自卸;30：载货;40：中型车;50：专用车;60：战略大客户;70：其他;80：大委改)'
          ]
        )
      },
      SPART: {
        showValue: item.产品组,
        value: item.产品组
      },
      DWERK: {
        showValue: item.交货工厂,
        value: item.交货工厂
      },
      TAXM1: {
        showValue: item.税分类,
        value: item.税分类
      },
      KTGRM: {
        showValue: item.科目设置组,
        value: item.科目设置组
      },
      KONDM: {
        showValue: item.物料定价组,
        value: item.物料定价组
      },
      MTPOS: {
        showValue: item.项目类别组,
        value: item.项目类别组
      },
      TRAGR: {
        showValue: item.运输组,
        value: item.运输组
      },
      LADGR: {
        showValue: item.装载组,
        value: item.装载组
      },
      MTVFP: {
        showValue: item.可用性检查,
        value: item.可用性检查
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
      SERNP: {
        showValue: item.序列号参数文件,
        value: item.序列号参数文件
      },
      MFRGR: {
        showValue: item.物料运输组,
        value: item.物料运输组
      }
    })
  })
  bizData.ZBQY = list
  _this.$store.commit('app/setBizData', bizData)
  console.log(list, 'excel导入的数据')
}
