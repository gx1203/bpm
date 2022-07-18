export function getDate(type = null, number = 0) {
  const nowdate = new Date()
  let y, m, d, retrundate
  switch (type) {
    case 'month': // 取number月前、后的时间
      nowdate.setMonth(nowdate.getMonth() + number)
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
