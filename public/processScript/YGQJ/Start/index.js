var _this
var nodeTabList
//测试页面加载完成
function ready() {
  _this = arguments[0];
  nodeTabLists = arguments[1].nodeTabLists;
  console.log(123)
  _this.$store.commit('app/setBizData', {
    SGYTCL: {
      showValue: "10000",
      value: "10000"
    },
    JXSMC: {
      showValue: arguments[1].bizData.JXSNAME,
      value: arguments[1].bizData.JXSNAME
    }
  })
}
//提交验证
function submit (that, obj) {
  return new Promise(function (resolve, reject) {
    console.log(obj)
    if (obj.QJJSSJ && obj.QJKSSJ) {
      let dateS = new Date(obj.QJKSSJ)
      let dateE = new Date(obj.QJJSSJ)
      console.log(dateS.getTime())
      console.log(dateE.getTime())
      if (dateS.getTime() === dateE.getTime()) {
        that.$message.error('结束时间不能等于开始时间!')
        resolve(false)
      } else if (dateS.getTime() > dateE.getTime()) {
        that.$message.error('结束时间要大于开始时间!')
        resolve(false)
      } else {
        resolve(true)
      }
    }
    resolve(true)
  });
}
