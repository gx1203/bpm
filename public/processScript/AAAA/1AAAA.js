//测试事件
function test(_this, obj) {
    // _this.$message.error('事件测试')
    _this.$store.commit('app/setBizData', {
        WBK1: {showValue: "文本框1", value: "文本框1"},
        WBK2: {showValue: "文本框2", value: "文本框3"}
    })
    // _this.$forceUpdate()
    // return new Promise(function (resolve, reject) {
    // });
}

//测试页面加载完成
function ready(_this, obj) {
    console.log(obj)
    _this.$message.error('页面加载完成！！')
}

//提交验证
function submit(_this, obj) {
    return new Promise(function (resolve, reject) {
        //可修改start
        var isVerify = true
        let reg = /^[0-9]+.?[0-9]*$/
        // for (const key in obj) {
        if (!reg.test(obj.AAA)) {
            _this.$message.error('请输入数字')
            isVerify = false
            return resolve(isVerify)
        }
        //可修改end
        // }
        resolve(isVerify)
    });
}