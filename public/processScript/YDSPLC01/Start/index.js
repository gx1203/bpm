

//测试
/*
_this指向vue实例，可调用其相关方法
obj为触发input事件传递过来的相关参数
_this.$store.commit('app/setBizData',{})
*/
function test () {
  // _this.$store.commit('app/setBizData', {
  //     WBK1: {showValue: "文本框1", value: "文本框1"},
  //     WBK2: {showValue: "文本框2", value: "文本框3"}
  // })
}
//测试页面加载完成
function ready (_this, obj) {
  console.log(obj)
  // _this.$message.error('页面加载完成！！')
  getList(_this)
  _this.$store.commit('app/setBizData', {
    'MS': {
      showValue: 0,
      value: 0,
    }
  })
}
function DateDiff (d1, d2) {
  var day = 24 * 60 * 60 * 1000;
  try {
    var dateArr = d1.split("-");
    var checkDate = new Date();
    checkDate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
    var checkTime = checkDate.getTime();

    var dateArr2 = d2.split("-");
    var checkDate2 = new Date();
    checkDate2.setFullYear(dateArr2[0], dateArr2[1] - 1, dateArr2[2]);
    var checkTime2 = checkDate2.getTime();

    var cha = (checkTime - checkTime2) / day;
    return cha;
  } catch (e) {
    return false;
  }
}
function changeType (_this, obj) {
  console.log(arguments)
  console.log(obj)
  // getList(_this, obj.DZ)
}
function changeTime (_this, obj) {
  console.log(arguments)
  console.log(obj)
  let bizData = JSON.parse(JSON.stringify(_this.$store.state.app.bizData))
  if (!obj.SJQ || !obj.SJZ) return
  let day = DateDiff(obj.SJZ, obj.SJQ) + 1
  if (day <= 0) {
    _this.$message.error('本次请假时间不能小于0天')
    day = ''
  }
  bizData.MS = {
    showValue: day,
    value: day
  }
  _this.$store.commit('app/setBizData', bizData)
}
function getList (_this, type) {
  const loading = _this.$loading();
  let arr = []
  myAjax({
    url: '/bpm/createnav/query',
    method: 'POST',
    data: {
      aa: type
    }
  }).then(function (rt) {
    loading.close();
    if (rt.status === '200') {
      console.log(rt)
      rt.data.forEach(function (item) {
        arr.push({
          'ZWM': {
            showValue: item.processnamecn,
            value: item.processnamecn,
          },
          'YWM': {
            showValue: item.processname,
            value: item.processname,
          }
        })
      });
      console.log(arr)
      _this.$store.commit('app/setBizData', {
        'QJJL': arr
      })
    }
  })
}
//提交验证
function submit (_this, obj) {
  return new Promise(function (resolve, reject) {
    //可修改start
    var isVerify = true
    let reg = /^[0-9]+.?[0-9]*$/
    console.log(obj)
    // for (const key in obj) {
    // if (!reg.test(obj.AAA)) {
    //     _this.$message.error('请输入数字')
    //     isVerify = false
    //     return resolve(isVerify)
    // }
    //可修改end
    // }
    resolve(isVerify)
  });
}