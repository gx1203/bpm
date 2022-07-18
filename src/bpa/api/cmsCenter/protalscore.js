import { fetch } from '@/bpa/utils'
/**
 * 获取评论数据
 */
export function getComments() {
  return fetch({
    url: '/static/JSON/protalscore.json',
    method: 'gat'
  })
}
