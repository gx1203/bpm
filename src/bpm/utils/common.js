import { Message } from 'element-ui'
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
  return process.env.HOST_URL + process.env.BASE_URL + '/attach/download/' + fileid + '?username=' + userId
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

/**
 * BAse64编码
 */
export function BASE64CODE () {
  let BASE64_MAPPING = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '+', '/'
  ];
  var URLSAFE_BASE64_MAPPING = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '-', '_'
  ];

  var _toBinary = function (ascii) {
    var binary = [];
    while (ascii > 0) {
      var b = ascii % 2;
      ascii = Math.floor(ascii / 2);
      binary.push(b);
    }
    binary.reverse();
    return binary;
  };

  var _toDecimal = function (binary) {
    var dec = 0;
    var p = 0;
    for (var i = binary.length - 1; i >= 0; --i) {
      var b = binary[i];
      if (b == 1) {
        dec += Math.pow(2, p);
      }
      ++p;
    }
    return dec;
  };

  var _toUTF8Binary = function (c, binaryArray) {
    var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
    var fatLen = binaryArray.length;
    var diff = mustLen - fatLen;
    while (--diff >= 0) {
      binaryArray.unshift(0);
    }
    var binary = [];
    var _c = c;
    while (--_c >= 0) {
      binary.push(1);
    }
    binary.push(0);
    var i = 0, len = 8 - (c + 1);
    for (; i < len; ++i) {
      binary.push(binaryArray[i]);
    }

    for (var j = 0; j < c - 1; ++j) {
      binary.push(1);
      binary.push(0);
      var sum = 6;
      while (--sum >= 0) {
        binary.push(binaryArray[i++]);
      }
    }
    return binary;
  };

  var _toBinaryArray = function (str) {
    var binaryArray = [];
    for (var i = 0, len = str.length; i < len; ++i) {
      var unicode = str.charCodeAt(i);
      var _tmpBinary = _toBinary(unicode);
      if (unicode < 0x80) {
        var _tmpdiff = 8 - _tmpBinary.length;
        while (--_tmpdiff >= 0) {
          _tmpBinary.unshift(0);
        }
        binaryArray = binaryArray.concat(_tmpBinary);
      } else if (unicode >= 0x80 && unicode <= 0x7FF) {
        binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
      } else if (unicode >= 0x800 && unicode <= 0xFFFF) {//UTF-8 3byte
        binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
      } else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {//UTF-8 4byte
        binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
      } else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {//UTF-8 5byte
        binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
      } else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {//UTF-8 6byte
        binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
      }
    }
    return binaryArray;
  };

  var _toUnicodeStr = function (binaryArray) {
    var unicode;
    var unicodeBinary = [];
    var str = "";
    for (var i = 0, len = binaryArray.length; i < len;) {
      if (binaryArray[i] == 0) {
        unicode = _toDecimal(binaryArray.slice(i, i + 8));
        str += String.fromCharCode(unicode);
        i += 8;
      } else {
        var sum = 0;
        while (i < len) {
          if (binaryArray[i] == 1) {
            ++sum;
          } else {
            break;
          }
          ++i;
        }
        unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
        i += 8 - sum;
        while (sum > 1) {
          unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
          i += 8;
          --sum;
        }
        unicode = _toDecimal(unicodeBinary);
        str += String.fromCharCode(unicode);
        unicodeBinary = [];
      }
    }
    return str;
  };

  var _encode = function (str, url_safe) {
    var base64_Index = [];
    var binaryArray = _toBinaryArray(str);
    var dictionary = url_safe ? URLSAFE_BASE64_MAPPING : BASE64_MAPPING;

    var extra_Zero_Count = 0;
    for (var i = 0, len = binaryArray.length; i < len; i += 6) {
      var diff = (i + 6) - len;
      if (diff == 2) {
        extra_Zero_Count = 2;
      } else if (diff == 4) {
        extra_Zero_Count = 4;
      }
      var _tmpExtra_Zero_Count = extra_Zero_Count;
      while (--_tmpExtra_Zero_Count >= 0) {
        binaryArray.push(0);
      }
      base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
    }

    var base64 = '';
    for (var i = 0, len = base64_Index.length; i < len; ++i) {
      base64 += dictionary[base64_Index[i]];
    }

    for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
      base64 += '=';
    }
    return base64;
  };

  var _decode = function (_base64Str, url_safe) {
    var _len = _base64Str.length;
    var extra_Zero_Count = 0;
    var dictionary = url_safe ? URLSAFE_BASE64_MAPPING : BASE64_MAPPING;

    if (_base64Str.charAt(_len - 1) == '=') {
      if (_base64Str.charAt(_len - 2) == '=') {//两个等号说明补了4个0
        extra_Zero_Count = 4;
        _base64Str = _base64Str.substring(0, _len - 2);
      } else {//一个等号说明补了2个0
        extra_Zero_Count = 2;
        _base64Str = _base64Str.substring(0, _len - 1);
      }
    }

    var binaryArray = [];
    for (var i = 0, len = _base64Str.length; i < len; ++i) {
      var c = _base64Str.charAt(i);
      for (var j = 0, size = dictionary.length; j < size; ++j) {
        if (c == dictionary[j]) {
          var _tmp = _toBinary(j);
          /*不足6位的补0*/
          var _tmpLen = _tmp.length;
          if (6 - _tmpLen > 0) {
            for (var k = 6 - _tmpLen; k > 0; --k) {
              _tmp.unshift(0);
            }
          }
          binaryArray = binaryArray.concat(_tmp);
          break;
        }
      }
    }
    if (extra_Zero_Count > 0) {
      binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
    }
    return _toUnicodeStr(binaryArray);
  };

  return {
    encode: function (str) {
      return _encode(str, false);
    },
    decode: function (base64Str) {
      return _decode(base64Str, false);
    },
    urlsafe_encode: function (str) {
      return _encode(str, true);
    },
    urlsafe_decode: function (base64Str) {
      return _decode(base64Str, true);
    }
  };
}

export function verifyEmail (val) {
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  if (val && !reg.test(val)) {
    Message.error("邮箱格式不正确")
    return false
  }
  return true
}
