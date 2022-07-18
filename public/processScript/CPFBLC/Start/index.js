var _this
var nodeTabList
//测试页面加载完成
function ready() {
  _this = arguments[0];
  nodeTabLists = arguments[1].nodeTabLists;
  _this.$store.commit('app/setBizData', {
    JXSMC: {
      showValue: arguments[1].bizData.JXSNAME,
      value: arguments[1].bizData.JXSNAME
    },
    PUBLISHER: {
      showValue:  arguments[1].bizData.PUBLISHER ? arguments[1].bizData.PUBLISHER.showValue : _this.$store.state.basuser.user.cnname,
      value: arguments[1].bizData.PUBLISHER ? arguments[1].bizData.PUBLISHER.value : _this.$store.state.basuser.user.id
    },
    RTIME: {
      showValue: arguments[1].bizData.RTIME ? arguments[1].RTIME.PUBLISHER.showValue : currentTime(),
      value: arguments[1].bizData.RTIME ? arguments[1].RTIME.PUBLISHER.value : currentTime()
    }
  })
}

function currentTime () {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

function submit (that, obj) {
  return new Promise(function (resolve, reject) {
    // let time = currentTime()
    // nodeTabLists[0].nodeTableLists.forEach(function (item) {
    //   if (item.fieldName === 'RTIME') {
    //     _this.$set(item, 'applyvalue', time)
    //     _this.$set(item, 'showValue', time)
    //   }
    // })
    // for (const key in obj) {
    // let time = currentTime()
    // console.log(time)
    // that.$store.commit('app/setBizData', {
    //   RTIME: {
    //     showValue: time,
    //     value: time
    //   }
    // })
    // resolve(false)
    resolve(true)
  });
}




