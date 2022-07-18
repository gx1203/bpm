let payInfoList = []
function digitUppercase(n) {
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  var head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  var s = '';

  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }

  s = s || '整';
  n = Math.floor(n);

  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = '';

    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }

    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}
/** 
 * 将数值四舍五入后格式化. 
 * 
 * @param num 数值(Number或者String) 
 * @param cent 要保留的小数位(Number) 
 * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型); 
 * @return 格式的字符串,如'1,234,567.45' 
 * @type String 
 */
function formatNumber(num, cent, isThousand) {
  num = num + ''.toString().replace(/\$|\,/g, ''); // 检查传入数值为数值类型  

  if (isNaN(num)) num = "0"; // 获取符号(正/负数)  

  sign = num == (num = Math.abs(num));
  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入  

  cents = num % Math.pow(10, cent); // 求出小数位数值  

  num = Math.floor(num / Math.pow(10, cent)).toString(); // 求出整数位数值  

  cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度  
  // 补足小数位到指定的位数  

  while (cents.length < cent) {
    cents = "0" + cents;
  }

  if (isThousand) {
    // 对整数部分进行千分位格式化.  
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }
  }

  if (cent > 0) return (sign ? '' : '-') + num + '.' + cents;else return (sign ? '' : '-') + num;
}
/** 
 * 去除千分位
 * *@param{Object}num
 */


function delcommafy(num) {
  if (num && typeof(num)=='string') {
    return parseFloat(num.replace(/[^\d\.-]/g, ""));
  } 
}
function searchSwitch () {
  let _this = arguments[0]
  let dataHandle = arguments[1]
  if(dataHandle[0].switch){
    dataHandle[1].rows.forEach(function(item){
      _this.$set(item,'isShow', false)
      item.nodeTableLists.forEach(function(val){
        if(val.fieldName === 'BOQNAME'){
          if(dataHandle[0].applyvalue){
            if(val.applyvalue.indexOf(dataHandle[0].applyvalue) !== -1 ){
              _this.$set(item,'isShow', false)
            }else{
              _this.$set(item,'isShow', true)
            }
          }else{
            _this.$set(item,'isShow', false)
          }
        }
      })
    })
  } else {
    dataHandle[1].rows.forEach(function(item){
      let isNum = false
      let isMoney = false
      item.nodeTableLists.forEach(function(val){
        if(val.fieldName === 'PARTANUM' && val.applyvalue && val.applyvalue != 0){
          isNum = true
        }
        if(val.fieldName === 'PARTAMONEY' && val.applyvalue && val.applyvalue != 0){
          isMoney = true
        }
      })
      _this.$set(item,'isShow', false)
      item.nodeTableLists.forEach(function(val){
        if(val.fieldName === 'BOQNAME'){
          if(isNum && isMoney){
            if(dataHandle[0].applyvalue){
              if(val.applyvalue.indexOf(dataHandle[0].applyvalue) !== -1){
                _this.$set(item,'isShow', false)
              }else{
                _this.$set(item,'isShow', true)
              }
            }else{
              _this.$set(item,'isShow', false)
            }
          }else{
            _this.$set(item,'isShow', true)
          }
        }
      })
    })
  }
}
function readyP() {
  var _this = arguments[0];
  var nodeTabLists = arguments[1].nodeTabLists;
  var _bizData = arguments[1].bizData;

  if (!_bizData || !_bizData.CHILDTYPE) return;
  _this.$store.commit('app/setBizData', {
    'CHILDTYPE': {
      showValue: _bizData.CHILDTYPE.showValue,
      value: _bizData.CHILDTYPE.value
    },
    "CONTRACTTOTAL": {
      showValue: _bizData.CONTRACTTOTAL.showValue,
      value: formatNumber(_bizData.CONTRACTTOTAL.value, 2, 1)
    },
    "FINALMONEY": {
      showValue: _bizData.FINALMONEY.showValue,
      value: formatNumber(_bizData.FINALMONEY.value, 2, 1)
    },
    "AMOUNTPAID": {
      showValue: _bizData.AMOUNTPAID.showValue,
      value: formatNumber(Number(_bizData.AMOUNTPAID.value), 2, 1)
    },
    "TPAYMENTMONEYS": {
      showValue: Number(_bizData.TPAYMENTMONEYS.showValue).toFixed(2),
      value: formatNumber(Number(_bizData.TPAYMENTMONEYS.value), 2, 1)
    },
    "ACTUALMONETS": {
      showValue: Number(_bizData.ACTUALMONETS.showValue).toFixed(2),
      value: formatNumber(Number(_bizData.ACTUALMONETS.value), 2, 1)
    },
    // "RESERVEMONEY": {
    //   showValue: Number(_bizData.RESERVEMONEY.showValue).toFixed(2),
    //   value: formatNumber(Number(_bizData.RESERVEMONEY.value), 2, 1)
    // },
    // "WITHHOLDINGTAX": {
    //   showValue: Number(_bizData.WITHHOLDINGTAX.showValue).toFixed(2),
    //   value: formatNumber(Number(_bizData.WITHHOLDINGTAX.value), 2, 1)
    // },
    // "OTHERDEDUCTIONS": {
    //   showValue: Number(_bizData.OTHERDEDUCTIONS.showValue).toFixed(2),
    //   value: formatNumber(Number(_bizData.OTHERDEDUCTIONS.value), 2, 1)
    // },
    // "ADVANCEMONEY": {
    //   showValue: Number(_bizData.ADVANCEMONEY.showValue).toFixed(2),
    //   value: formatNumber(Number(_bizData.ADVANCEMONEY.value), 2, 1)
    // },
    // 'VATINPUTTAX' :{
    //   showValue: Number(_bizData.VATINPUTTAX.showValue).toFixed(2),
    //   value: formatNumber(Number(_bizData.VATINPUTTAX.value), 2, 1)
    // }
  });
  nodeTabLists.forEach(function (val) {
    val.nodeTableLists.forEach(function (item) {
      if (item.fieldName === 'PREPAYMENT' || item.fieldName === 'PAYMENTRETENTIONMONEY' || item.fieldName === 'ADVANCEMONEY' || item.fieldName === 'OTHERDEDUCTIONS' || item.fieldName === 'RESERVEMONEY' || item.fieldName === 'WITHHOLDINGTAX') {
        item.inputType = "double";
      }
    });
  });
  if (_bizData.CHILDTYPE.value === "预付款支付单") {
    nodeTabLists.forEach(function (val) {
      val.nodeTableLists.forEach(function (item) {
        if (item.fieldName === 'PAYMENTRETENTIONMONEY' || item.fieldName === 'ADVANCEMONEY' || item.fieldName === 'OTHERDEDUCTIONS' || item.fieldName === 'RESERVEMONEY' || item.fieldName === 'WITHHOLDINGTAX') {
          item.inputType = 'hidden';
          item.value = '';
          item.showValue = '';
        }

        if (item.fieldName === 'PREPAYMENT') {
          item.inputcolspan = 4;
        }
      });
    });
  } else if (_bizData.CHILDTYPE.value === "进度款支付单") {
    nodeTabLists.forEach(function (val) {
      val.nodeTableLists.forEach(function (item) {
        if (item.fieldName === 'PREPAYMENT' || item.fieldName === 'PAYMENTRETENTIONMONEY') {
          item.value = '';
          item.inputType = 'hidden';
          item.showValue = '';
        }

        if (item.fieldName === 'PREPAYMENT') {
          item.inputcolspan = 2;
        }
      });
    });
  } else if (_bizData.CHILDTYPE.value === "保留金（其他扣款）支付单") {
    nodeTabLists.forEach(function (val) {
      val.nodeTableLists.forEach(function (item) {
        if (item.fieldName === 'PREPAYMENT' || item.fieldName === 'ADVANCEMONEY' || item.fieldName === 'OTHERDEDUCTIONS' || item.fieldName === 'RESERVEMONEY' || item.fieldName === 'WITHHOLDINGTAX') {
          item.inputType = 'hidden';
          item.value = '';
          item.showValue = '';
        }
        if (item.fieldName === 'PAYMENTRETENTIONMONEY') {
          item.inputcolspan = 4;
        }
      });
    });
  }

} //提交验证
function submit(_this, obj,isDraft) {
  return new Promise(function (resolve, reject) {
    obj.TPAYMENTMONEYS = delcommafy(obj.TPAYMENTMONEYS);
    obj.CONTRACTTOTAL = delcommafy(obj.CONTRACTTOTAL);
    obj.FINALMONEY = delcommafy(obj.FINALMONEY);
    obj.AMOUNTPAID = delcommafy(obj.AMOUNTPAID);
    obj.ACTUALMONETS = delcommafy(obj.ACTUALMONETS);
    // obj.ADVANCEMONEY = delcommafy(obj.ADVANCEMONEY);
    // obj.WITHHOLDINGTAX = delcommafy(obj.WITHHOLDINGTAX);
    // obj.OTHERDEDUCTIONS = delcommafy(obj.OTHERDEDUCTIONS);
    // obj.RESERVEMONEY = delcommafy(obj.RESERVEMONEY);
    // obj.VATINPUTTAX = delcommafy(obj.VATINPUTTAX);
    
    obj.RECEIPTDATE = obj.RECEIPTDATE.substr(0, 10);
    if (obj.CHILDTYPE === "预付款支付单" || obj.CHILDTYPE === "保留金（其他扣款）支付单") {
      obj.PAYMENTDETAIL = [];
    } else {
      payInfoList = JSON.parse(JSON.stringify(obj.PAYMENTDETAIL))
      obj.PAYMENTDETAIL = []
      payInfoList.forEach(function (item) {
        // item.PARTAMONEY = Number(item.PARTAMONEY).toFixed(2)
        if(isDraft){
          obj.PAYMENTDETAIL.push(item)
        }else{
          if (item.PARTANUM && item.PARTAMONEY && item.PARTANUM !=0 && item.PARTAMONEY != 0) {
            obj.PAYMENTDETAIL.push(item)
          }
        }
      });
    }
    resolve(true);
  });
}