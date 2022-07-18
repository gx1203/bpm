import {
    fetch
  } from '@/bpm/utils'

export function getAllRootTree () {
  return fetch({
    url: '/org/job/getAllRootTree',
    method: 'GET'
  })
}
export function getChildren (id) {
  return fetch({
    url: `/org/job/getChildren/${id}`,
    method: 'GET'
  })
}

export function queryTree (name) {
  return fetch({
    url: `/org/job/queryTree/${name}`,
    method: 'GET'
  })
}

export function deleteTree (id) {
  return fetch({
    url: `/org/job/deleteTree/${id}`,
    method: 'DELETE'
  })
}
export function deleteJob (id) {
  return fetch({
    url: `/org/job/delete/${id}`,
    method: 'DELETE'
  })
}
export function saveTree (data) {
  return fetch({
    url: `/org/job/save`,
    method: 'POST',
    data
  })
}
export function queryJob (data) {
  return fetch({
    url: `/org/job/query`,
    method: 'POST',
    data
  })
}

