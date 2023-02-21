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

function insertWjwz(e) {
  let list = []
  let bizData = JSON.parse(JSON.stringify(_this.$store.state.app.bizData))
  e.forEach(item => {
    list.push({
      MATERIALNO: {
        showValue: item.materialNo,
        value: item.materialNo
      },
      MATERIALNAME: {
        showValue: item.materialName,
        value: item.materialName
      },
      LEND_NO: {
        showValue: item.lendNo,
        value: item.lendNo
      },
      FACTORYNO: {
        showValue: item.factoryNo,
        value: item.factoryNo
      },
      LENDMATERIALTYPE: {
        showValue: item.lendMaterialType,
        value: item.lendMaterialType
      },
      UNITS: {
        showValue: item.units,
        value: item.units
      },
      QTY: {
        showValue: item.qty,
        value: item.qty
      },
      PERMITUNITS: {
        showValue: item.permitUnits,
        value: item.permitUnits
      },
      PERMITQTY: {
        showValue: item.permitQty,
        value: item.permitQty
      },
      OPERATEUSER: {
        showValue: item.operateUser,
        value: item.operateUser
      },
      OUTTIME: {
        showValue: item.outTime,
        value: item.outTime
      },
      PREPAYMENTTIME: {
        showValue: item.prepaymentTime,
        value: item.prepaymentTime
      },
      DELAYTIME: {
        showValue: item.delayTime,
        value: item.delayTime
      },
      DELAYREASON: {
        showValue: item.delayReason,
        value: item.delayReason
      },
      DELAYCOMMENTS: {
        showValue: item.delayComments,
        value: item.delayComments
      },
      CORPORATION: {
        showValue: item.corporation,
        value: item.corporation
      },
      OUTREASON: {
        showValue: item.outReason,
        value: item.outReason
      },
      PLATENUMBER: {
        showValue: item.plateNumber,
        value: item.plateNumber
      },
      EXAMINEUSER: {
        showValue: item.examineUser,
        value: item.examineUser
      },
      EXAMINECORPORATION: {
        showValue: item.examineCorporation,
        value: item.examineCorporation
      },
      EXAMINEDATE: {
        showValue: item.examineDate,
        value: item.examineDate
      },
      STATUS: {
        showValue: item.status,
        value: item.status
      },
      OPERATEDATE: {
        showValue: item.operateDate,
        value: item.operateDate
      },
      COMMENTS: {
        showValue: item.comments,
        value: item.comments
      },
      CREATEUSER: {
        showValue: item.createUser,
        value: item.createUser
      },
      CREATEDATE: {
        showValue: item.createDate,
        value: item.createDate
      },
      UPDATEUSER: {
        showValue: item.updateUser,
        value: item.updateUser
      },
      UPDATEDATE: {
        showValue: item.updateDate,
        value: item.updateDate
      },
      ORIGINNO: {
        showValue: item.originNo,
        value: item.originNo
      },
      ORIGINTYPE: {
        showValue: item.originType,
        value: item.originType
      }
      
    })
  })
  bizData.ZBQY = list
  _this.$store.commit('app/setBizData', bizData)
  console.log(list, '外借物资导入的数据')
}
