var _this
var nodeTabList
//测试页面加载完成
function readyP () {
  _this = arguments[0]
  nodeTabLists = arguments[1].nodeTabLists
  HDLXChange()
}

function HDLXChange () {
  _this.$nextTick(() => {
    let isMoreF = false
    nodeTabLists[0].nodeTableLists.forEach(function (item) {
      if (item.fieldName === 'HDLX') {
        if (item.applyvalue === '网络媒体') {
          isMoreF = true
        } else {
          isMoreF = false
        }
      }
      if (item.fieldName === 'ZBQY') {
        if (isMoreF) {
          item.inputType = 'subtable'
        } else {
          item.inputType = 'hidden'
          item.applyvalue = ''
          item.showValue = ''
        }
      }
    })
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
