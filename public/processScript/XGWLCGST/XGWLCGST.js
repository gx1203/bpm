
var _this;
var node;
var nodeTabLists;
//测试页面加载完成
function readyP() {
  _this = arguments[0];
  node = arguments[1];
  nodeTabLists = node.nodeTabLists;
  console.log(nodeTabLists)
  console.log(node.bizData)
}

function excelS(e){
  let list = []
  let bizData = JSON.parse(JSON.stringify(_this.$store.state.app.bizData))
  e.forEach(item=>{
    list.push({
      "WERKS":{
        showValue:item.工厂,
        value:item.工厂
      },
      "MATNR":{
        showValue: item.物料编号,
        value: item.物料编号
      },
      "MAKTX":{
        showValue:item.物料名称,
        value:item.物料名称
      }
    })
  })
  bizData.ZBQY = list
  _this.$store.commit('app/setBizData', bizData)
  console.log(list)
  console.log(list,'excel导入的数据')
}
