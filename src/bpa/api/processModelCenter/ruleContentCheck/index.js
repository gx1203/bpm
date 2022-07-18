import { fetch } from '@/bpa/utils'

export function getContentQuickQuery(data) {
  return fetch({
    url: '/modelListTag/queryAllModeList',
    method: 'POST',
    data
  })
}

export function getFieldQuickQuery(data) {
  return fetch({
    url: '/modelListTag/queryAllModeSearch/' + data,
    method: 'post'
  })
}

export function getLabel(data) {
  return fetch({
    url: '/modelListTag/queryAllTag',
    method: 'post'
  })
}

export function getLabelLetters(data) {
  return fetch({
    url: '/modelListTag/queryAllModeLocation',
    method: 'POST',
    data
  })
}
