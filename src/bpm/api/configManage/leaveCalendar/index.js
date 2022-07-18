import { fetch } from '@/bpm/utils'

// 获取假期日历列表
export function getHolidayCalendar(data) {
  return fetch({
    url: '/holidayCalendar/queryList',
    method: 'POST',
    data
  })
}
// 修改保存假期日历
export function saveHolidayCalendar(data) {
    return fetch({
      url: '/holidayCalendar/save',
      method: 'POST',
      data
    })
  }
// 删除假期日历
export function deleteHolidayCalendar(id) {
    return fetch({
      url: `/holidayCalendar/delete/${id}`,
      method: 'DELETE'
    })
  }
  


