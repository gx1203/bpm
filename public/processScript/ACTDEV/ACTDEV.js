
//对应流程的公共方法、页面加载成功后调用
function readyP() {
  var _this = arguments[0];
  var nodeTabLists = arguments[1].nodeTabLists;
  nodeTabLists[1].isShow = false
  _this.$forceUpdate()
  _this.$message.error('公共加载成功')
}

//提交验证
function submit() {
  let _this = arguments[0]
  let obj = arguments[1]
  return new Promise(function (resolve, reject) {
    var isVerify = true
    let reg = /^[0-9]+.?[0-9]*$/
    if (!reg.test(obj.AAA)) {
      _this.$message.error('请输入数字')
      isVerify = false
      this.commit('app/setButtonDisabled',true)
      return resolve(isVerify)
    }
    resolve(isVerify)
  });
}
