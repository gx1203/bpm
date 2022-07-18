import moment from 'moment-mini'

const filter = {
  formatMoney(value) {
    if (value) {
      value = Number(value)
      return value.toFixed(2)
    }
  },
  formatDateTime(val) {
    if (val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  formatDateTimess(val) {
    if (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  formatDate(val) {
    if (val) {
      return moment(val).format('YYYY-MM-DD')
    }
  },

  /** 
   * 将数值四舍五入后格式化. 
   * 
   * @param num 数值(Number或者String) 
   * @param cent 要保留的小数位(Number) 
   * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型); 
   * @return 格式的字符串,如'1,234,567.45' 
   * @type String 
   */

  formatNumber(num, cent, isThousand) {
    num = num + ''.toString().replace(/\$|\,/g, '');
    // 检查传入数值为数值类型  
    if (isNaN(num))
      num = "0";

    // 获取符号(正/负数)  
    let sign = (num == (num = Math.abs(num)));

    num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入  
    let cents = num % Math.pow(10, cent); // 求出小数位数值  
    num = Math.floor(num / Math.pow(10, cent)).toString(); // 求出整数位数值  
    cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度  

    // 补足小数位到指定的位数  
    while (cents.length < cent)
      cents = "0" + cents;

    if (isThousand) {
      // 对整数部分进行千分位格式化.  
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }

    if (cent > 0)
      return (((sign) ? '' : '-') + num + '.' + cents);
    else
      return (((sign) ? '' : '-') + num);
  },
  delcommafy(num) {
    if (num && typeof(num)=='string') {
      return parseFloat(num.replace(/[^\d\.-]/g, ""));
    }else{
      return num
    }
  },
  digitUppercase(n) {
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
  
    for (var i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor((n * 10 * Math.pow(10, i)).toFixed(2)) % 10] + fraction[i]).replace(/零./, '');
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
}
export default filter
