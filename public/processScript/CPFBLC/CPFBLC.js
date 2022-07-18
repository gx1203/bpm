var _this
var node
//测试页面加载完成
function readyP () {
  _this = arguments[0];
  node = arguments[1];
  console.log(_this.$route.query)
  let VSTATUS = ''
  
  if (_this.$route.query.type === 'edit') {
    VSTATUS = '修改'
    _this.$store.commit('app/setBizData', {
      VSTATUS: {
        showValue: VSTATUS,
        value: VSTATUS
      }
    })
    return
  }
  if (!node.bizData.VSTATUS) {
    VSTATUS = '新增'
    _this.$store.commit('app/setBizData', {
      VSTATUS: {
        showValue: VSTATUS,
        value: VSTATUS
      }
    })
  }
  
}