/**
 * 改变时间样式
 * 传参格式：Mon Jan 01 2018 00:00:00 GMT+0800 (中国标准时间)
 * 返回类型 2018-01-01
 */
export const getFormateDate = (time, fmt) => {
  if (Object.prototype.toString.call(time) !== '[object Date]') return
  const o = {
    'y+': time.getFullYear(),
    'M+': time.getMonth() + 1,
    'd+': time.getDate(),
    'h+': time.getHours(),
    'm+': time.getMinutes(),
    's+': time.getSeconds(),
    'q+': Math.floor((time.getMonth() + 3) / 3),
    'S': time.getMilliseconds()
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, o[k].toString().length === 1 ? ('0' + o[k]) : o[k])
    }
  }
  return fmt
}
// 获取默认时间
export const defaultTime = {
  getDay(day) {
    var today = new Date()
    today.setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    var tYear = today.getFullYear()
    var tMonth = today.getMonth()
    var tDate = today.getDate()
    tMonth = this.doHandleMonth(tMonth + 1)
    tDate = this.doHandleMonth(tDate)
    return tYear + '-' + tMonth + '-' + tDate
  },
  getToDay(day) {
    var today = new Date()
    var tYear = today.getFullYear()
    var tMonth = today.getMonth()
    var tDate = today.getDate()
    tMonth = this.doHandleMonth(tMonth + 1)
    tDate = this.doHandleMonth(tDate)
    return tYear + '-' + tMonth + '-' + tDate
  },
  doHandleMonth(month) {
    var m = month
    if (month.toString().length === 1) {
      m = '0' + month
    }
    return m
  }
}
/**
 * 改变时间样式
 * 传参格式：Mon Jan 01 2018 00:00:00 GMT+0800 (中国标准时间)
 * 返回类型 2018-01-01
 */

export const formatDate = (date) => {
  var myyear = date.getFullYear()
  var mymonth = date.getMonth() + 1
  var myweekday = date.getDate()
  if (mymonth < 10) {
    mymonth = '0' + mymonth
  }
  if (myweekday < 10) {
    myweekday = '0' + myweekday
  }
  return (myyear + '-' + mymonth + '-' + myweekday)
}
// 获得本周的开始日期
export const getWeekStartDate = () => {
  var now = new Date() // 当前日期
  var nowDayOfWeek = now.getDay() - 1 // 今天本周的第几天
  var nowDay = now.getDate() // 当前日
  var nowMonth = now.getMonth() // 当前月
  var nowYear = now.getYear() // 当前年
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
  return this.formatDate(weekStartDate)
}
// 获取本月
export const getMonthDays = (myMonth) => {
  var now = new Date() // 当前日期
  var nowYear = now.getFullYear() // 当前年
  var monthStartDate = new Date(nowYear, myMonth, 1)
  var monthEndDate = new Date(nowYear, myMonth + 1, 1)
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
  return days
}
/**
 * 级联选择器最末级为空不显示
 *
 */
export const getTreeData = (data) => {
  // 循环遍历json数据
  for (var i = 0; i < data.length; i++) {
    if (data[i].children.length < 1) {
      // children若为空数组，则将children设为undefined
      data[i].children = undefined
    } else {
      // children若不为空数组，则继续 递归调用 本方法
      getTreeData(data[i].children)
    }
  }
  return data
}
/**
 *  post请求导出列表
 */
export const export_post_list = (data, str) => {
  const blob = new Blob([data])
  if (window.navigator.msSaveOrOpenBlob) {
    try {
      window.navigator.msSaveOrOpenBlob(blob, str)
    } catch (e) {
      console.log(e)
    }
  } else {
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.download = str
    a.href = blobUrl
    a.click()
    URL.revokeObjectURL(blobUrl)
  }
}

/**
 * BAse64编码
 */
export const Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode(input) {
    let output = ''
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0
    input = this._utf8_encode(input)
    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)
      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
    }
    return output
  },
  decode(input) {
    let output = ''
    let chr1, chr2, chr3
    let enc1, enc2, enc3, enc4
    let i = 0
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++))
      enc2 = this._keyStr.indexOf(input.charAt(i++))
      enc3 = this._keyStr.indexOf(input.charAt(i++))
      enc4 = this._keyStr.indexOf(input.charAt(i++))
      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4
      output = output + String.fromCharCode(chr1)
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3)
      }
    }
    output = this._utf8_decode(output)
    return output
  },
  _utf8_encode(string) {
    string = string.replace(/\r\n/g, '\n')
    let utftext = ''
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  },

  // private method for UTF-8 decoding
  _utf8_decode(utftext) {
    let string = ''
    let i = 0
    let [c, c3, c2] = [0, 0, 0]
    while (i < utftext.length) {
      c = utftext.charCodeAt(i)
      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }
    return string
  }
}
/**
 * 获取userid
 */
export const userId = localStorage.getItem('portalCurrentUserInfo') ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid : ''

/**
 * 清楚客户端所有的cookie
 */
export function clearCookies() {
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()
      document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString()
      document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString()
    }
  }
}
/** 清除登录信息 */
export function clearCurrentUserInfo() {
  localStorage.clear()
  const timer = setTimeout(function () {
    window.open(process.env.LOGINOUT_URL, '_self')
    clearTimeout(timer)
  }, 500)
}
/**
 * 预览文件
 */
export function viewFile(fileid) {
  const userId = localStorage.getItem('portalCurrentUserInfo') ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid : ''
  return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL + '/document/print/' + fileid
}

/**
 * 下载文件
 */
export function downloadFile(fileid) {
  const userId = localStorage.getItem('portalCurrentUserInfo') ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid : ''
  return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL + '/attach/download/' + fileid + '?username=' + userId
}

/**
 * 体系下载文件
 */
 export function txdownloadFile(fileid) {
  const userId = localStorage.getItem('portalCurrentUserInfo') ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid : ''
  return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL + '/regulation/download/' + fileid + '?username=' + userId
}

/**
 * 规章制度预览文件
 */
export function viewFile2(fileid,fileName) {
  const userId = localStorage.getItem('portalCurrentUserInfo') ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid : ''
  return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL + '/document/printnew/' + fileid +'/' + fileName + '?username=' + userId
}

/**
 * 规章制度下载文件
 */
export function downloadFile2(fileid) {
  const userId = localStorage.getItem('portalCurrentUserInfo') ? JSON.parse(localStorage.getItem('portalCurrentUserInfo')).empuid : ''
  return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL + '/regulation/download/' + fileid + '?username=' + userId
  // return 'http://test5.jiucaiyun.cn/bpabpmapi/document/print/regulation/download/' + fileid + '?username=' + userId
}

/**
 * 生成id
 *
 */
export function createId(len, radix) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  let i
  radix = radix || chars.length

  if (len) {
    // Compact form_initResize
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data. At i==19 set the high bits of clock sequence
    // as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}
