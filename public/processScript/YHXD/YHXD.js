var _this
var nodeTabList
var node
//测试页面加载完成
function readyP () {
  _this = arguments[0]
  node = arguments[1]
  nodeTabLists = arguments[1].nodeTabLists
}

function GLLCChange () {
  let tableId = ''
  nodeTabLists[0].nodeTableLists.forEach(function (item) {
    if (item.fieldName === 'ZBQY') {
      tableId = item.id
    }
  })
  let _data = arguments[1]
  _this.$http({
    url: `/yhxd/getProcessBizData?instid=${_data.GLLC}&tableId=${tableId}`,
    method: 'GET',
  }).then(function (rt) {
    if (rt.status === '200' && rt.data && rt.data.lbizData) {
      let ZBQY = rt.data.lbizData.ZBQY || []
      let JEArr = ZBQY.map(item => Number(item.JE) || 0)
      let sum = JEArr.length > 0 ? JEArr.reduce((prev, curr) => prev + curr) : 0
      nodeTabLists[0].nodeTableLists.forEach(function (item) {
        if (item.fieldName === 'HJJE') {
          _this.$set(item, 'applyvalue', sum)
          _this.$set(item, 'showValue', sum)
        }
        if (item.fieldName === 'SPJE') {
          _this.$set(item, 'applyvalue', rt.data.lbizData.SPJE)
          _this.$set(item, 'showValue', rt.data.lbizData.SPJE)
        }
        if (item.fieldName === 'SYB') {
          _this.$set(item, 'applyvalue', rt.data.lbizData.SYB)
          _this.$set(item, 'showValue', rt.data.lbizData.SYB)
        }
        if (item.fieldName === 'JXSMC') {
          _this.$set(item, 'applyvalue', rt.data.lbizData.WBK)
          _this.$set(item, 'showValue', rt.data.lbizData.WBK)
        }
      })
      _this.$nextTick(() => {
        let bizData = JSON.parse(JSON.stringify(_this.$store.state.app.bizData))
        let _list = []
        ZBQY.forEach(function (element) {
          _list.push({
            HDMC: {
              showVaue: element.HDMC,
              value: element.HDMC
            },
            KSSJ: {
              showVaue: element.KSSJ,
              value: element.KSSJ
            },
            JSSJ: {
              showVaue: element.JSSJ,
              value: element.JSSJ
            },
            SL: {
              showVaue: element.SL,
              value: element.SL
            },
            DJ: {
              showVaue: element.DJ,
              value: element.DJ
            },
            ZK: {
              showVaue: element.ZK,
              value: element.ZK
            },
            JE: {
              showVaue: element.JE,
              value: element.JE
            }
          })
        })
        bizData.ZBQY = _list
        _this.$store.commit('app/setBizData', bizData)
      })
    }
  })
}

function calculationAmount () {
  _this.$nextTick(() => {
    let _this = arguments[0]
    let _data = arguments[1]
    let _index = arguments[2]
    let _rows = arguments[4]
    _rows[_index].nodeTableLists.forEach(item => {
      if (item.fieldName === 'JE') {
        let JE = Number(_data.ZBQY[_index].SL || 0) * Number(_data.ZBQY[_index].DJ || 0) * Number(_data.ZBQY[_index].ZK || 0)
        _this.$set(item, 'applyvalue', JE)
        _this.$set(item, 'showValue', JE)
      }
    })
    _this.$forceUpdate()
    let JEArr = _data.ZBQY.map(item => Number(item.SL || 0) * Number(item.DJ || 0) * Number(item.ZK || 0))
    let sum = JEArr.reduce((prev,curr) => prev + curr)
    nodeTabLists[0].nodeTableLists.forEach(function (item) {
      if (item.fieldName === 'HJJE') {
        _this.$set(item, 'applyvalue', sum)
        _this.$set(item, 'showValue', sum)
      }
    })
  })
}

function deleteTableZBQY () {
  let _data = arguments[1]
  console.log(_data)
  let JEArr = _data.ZBQY.map(item => Number(item.SL || 0) * Number(item.DJ || 0) * Number(item.ZK || 0))
  let sum = JEArr.reduce((prev,curr) => prev + curr)
  nodeTabLists[0].nodeTableLists.forEach(function (item) {
    if (item.fieldName === 'HJJE') {
      _this.$set(item, 'applyvalue', sum)
      _this.$set(item, 'showValue', sum)
    }
  })
}
