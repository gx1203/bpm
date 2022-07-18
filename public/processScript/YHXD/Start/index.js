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
// function submit (that, obj) {
  // return new Promise(function (resolve, reject) {
  //   // for (const key in obj) {
  //   if (obj.ZBQY) {
  //     let JEArr = obj.ZBQY.map(item => item.JE)
  //     let sum = JEArr.reduce((prev, curr) => prev + curr)
  //     console.log(sum)
  //     if (obj.SQJE && Number(obj.SQJE) > sum) {
  //       that.$message.error('申请金额要小于活动模块中的所有合计金额')
  //       resolve(false)
  //     }
  //   }
  //   resolve(true)
  // });
// }
