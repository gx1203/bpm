import { fetch } from '@/bpa/utils'
export function getRecordsList (user, data) {
  return fetch({
    url: '/regulation/querybpmOperateLogCopy?username=' + user,
    method: 'post',
    data
  })
}
