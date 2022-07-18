//测试
/*
_this指向vue实例，可调用其相关方法
obj为触发input事件传递过来的相关参数
_this.$store.commit('app/setBizData',{})
*/
var _this;
function test () {
  // _this.$store.commit('app/setBizData', {
  //     WBK1: {showValue: "文本框1", value: "文本框1"},
  //     WBK2: {showValue: "文本框2", value: "文本框3"}
  // })
}
//公共加载方法
function readyP (_this, obj) {
  console.log(obj)
  getRecodes(_this)
  // if (obj && obj.bizData && obj.bizData.QJLX && obj.bizData.QJLX.value) {
  //   this.getPersionRecodeNum(_this, obj.bizData.QJLX.value)
  // }
}
// 计算本次请假天数
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
  console.log(day)
  bizData.QJTS = {
    showValue: day,
    value: day
  }
  _this.$store.commit('app/setBizData', bizData)
}
// 获取历史记录
function getRecodes (_this) {
  const loading = _this.$loading();
  let _list = []
  let userid = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
  let bizData = JSON.parse(JSON.stringify(_this.$store.state.app.bizData))
  myAjax({
    url: '/qjsqlc/getRecodesByUser/' + userid,
    method: 'GET'
  }).then(function (rt) {
    loading.close();
    if (rt.status === '200') {
      console.log(rt)
      rt.data.forEach(function (item) {
        _list.push({
          'SQDH': {
            showValue: item.REQNO,
            value: item.REQNO,
          },
          'SQSJ': {
            showValue: item.REQDATE,
            value: item.REQDATE,
          },
          'LCZT': {
            showValue: item.SUBJECT,
            value: item.SUBJECT,
          },
          'DQZT': {
            showValue: item.STATUS,
            value: item.STATUS,
          },
          'SPWCSJ': {
            showValue: item.ENDDATE,
            value: item.ENDDATE,
          },
          'QJLX': {
            showValue: item.QJLXCN,
            value: item.QJLXCN,
          },
          'KSSJ': {
            showValue: item.SJQ,
            value: item.SJQ,
          },
          'JSSJ': {
            showValue: item.SJZ,
            value: item.SJZ,
          },
          'QJTS': {
            showValue: item.QJTS,
            value: item.QJTS,
          },
          'LJCS': {
            showValue: item.LJCS,
            value: item.LJCS,
          },
          'LJTS': {
            showValue: item.LJTS,
            value: item.LJTS,
          }
        })
      });
      console.log(_list)
      bizData.QJJL = _list
      _this.$store.commit('app/setBizData', bizData)
    }
  })
}
// 切换请假类型获已请假数据
function getPersionRecodeNum (_this, obj) {
  console.log(obj)
  const loading = _this.$loading();
  let userid = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
  let bizData = JSON.parse(JSON.stringify(_this.$store.state.app.bizData))
  myAjax({
    url: '/qjsqlc/getPersionRecodeNum',
    method: 'GET',
    params: {
      userId: userid,
      qjlx: obj.QJLX
    }
  }).then(function (rt) {
    loading.close();
    if (rt.status === '200') {
      console.log(rt)
      bizData.YQJCS = {
        showValue: rt.data.NUM,
        value: rt.data.NUM
      }
      bizData.YQJTS = {
        showValue: rt.data.DATENUM,
        value: rt.data.DATENUM
      }
      bizData.NDQJCS = {
        showValue: rt.data.NUM_ND,
        value: rt.data.NUM_ND
      }
      bizData.NDQJTS = {
        showValue: rt.data.DATENUM_ND,
        value: rt.data.DATENUM_ND
      }
      _this.$store.commit('app/setBizData', bizData)
    }
  })
}
// 计算时间差
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
//提交验证
function submit (_this, obj) {
  return new Promise(function (resolve, reject) {
    //可修改start
    var isVerify = true
    let reg = /^[0-9]+.?[0-9]*$/
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