export function getDate (type = null, number = 0) {
  let nowdate = new Date()
  let y, m, d, retrundate
  switch (number) {
    case -1: // 取number月前、后的时间
      let date = new Date(nowdate.getTime() - 7 * 24 * 3600 * 1000);
      y= date.getFullYear();
      m= date.getMonth() + 1;
      d= date.getDate();
      retrundate = y + '-' + m + '-' + d
      break
    case -2: // 取number月前、后的时间
      nowdate.setMonth(nowdate.getMonth() - 1)
      y = nowdate.getFullYear()
      m = nowdate.getMonth() + 1
      d = nowdate.getDate()
      retrundate = y + '-' + m + '-' + d
      break
    case -3: // 取number月前、后的时间
      nowdate.setMonth(nowdate.getMonth() - 6)
      y = nowdate.getFullYear()
      m = nowdate.getMonth() + 1
      d = nowdate.getDate()
      retrundate = y + '-' + m + '-' + d
      break
    default: // 取当前时间
      y = nowdate.getFullYear()
      m = nowdate.getMonth() + 1
      d = nowdate.getDate()
      retrundate = y + '-' + m + '-' + d
  }
  return retrundate
}
