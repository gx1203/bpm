import store from '@/store'
import axios from 'axios'
import {
  Message
} from 'element-ui'
axios.defaults.withCredentials = true

const service = axios.create({
  baseURL: process.env.VUE_APP_BPA_HOST_URL + process.env.VUE_APP_BPA_BASE_URL,
  timeout: 50000
})

const isArray = data => Object.prototype.toString.call(data) === '[object Array]'

const showToast = (toast, data, msg) => {
  if (toast) {
    const {
      status,
      message
    } = data
    const isToastArray = isArray(toast)
    const needToast = (isToastArray && toast.indexOf(status) === -1) || (!isToastArray && toast)
    if (needToast) {
      if (status === '200' || data.data === 0) {
        if (message) {
          Message.success(message === 'success' ? '操作成功' : message)
        }
      } else {
        Message.error({
          message: message || msg,
          showClose: true
        })
      }
    }
  }
}

service.interceptors.request.use((request) => {
  localStorage.setItem('baseURL', process.env.VUE_APP_BASE_URL)
  const {
    id
  } = store.state.app.userInfo
  const token = localStorage.getItem('sxToken')
  if (token) {
    request.headers.token = token
  }
  if (id) {
    request.headers.Pragma = 'no-cache'
    request.headers['Cache-Control'] = 'no-cache, no-store'
    if (request.method !== 'post') {
      if (!request.params) {
        request.params = {}
      }
    } else {
      if (request.toast === undefined) {
        request.toast = true
      }
      if (!request.data) {
        request.data = {}
      }
    }
  }
  return request
})

service.interceptors.response.use(
  (response) => {
    const {
      data,
      config
    } = response
    const {
      loading,
      toast = loading
    } = config
    if (response.status == '200' && response.config.url == process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL + '/logout') {
      return response
    } else if (data.status === '200' || data.status === '500' || response.status == '200') {
      return data
    } else if (data.status === '50000') {
      store.dispatch('basuser/saveUser', {})
      store.commit('app/setTabList', [])
    } else {
      return Promise.reject(new Error(data.message))
    }
    console.log(response)
  },
  (err) => {
    let data = {}
    if (err.code === 'ECONNABORTED') {
      showToast(true, data, '接口超时,请重新请求!!')
      return
    }
    if (!err.response && err.config.url.indexOf('/logout')) {
      localStorage.removeItem('userInfo')
      store.commit('app/setUserInfo', {})
      store.commit('app/setTabList', [])
      location.href = window.location.origin + window.location.pathname + '#/login'
    }
    if (err.response.status == '401') {
      service.loading.close()
      if (err.response.data.message == 'Bad credentials') {
        Message.error({
          message: '用户名密码错误',
          showClose: true
        })
      } else if (err.response.data.message) {
        Message.error({
          message: err.response.data.message,
          showClose: true
        })
      } else {
        Message.error({
          message: '请重新登录',
          showClose: true
        })
      }
      localStorage.removeItem('userInfo')
      store.dispatch('basuser/saveUser', {})
      store.commit('app/setTabList', [])
      location.href = window.location.origin + window.location.pathname + '#/login'
    }
    if (err.response.status == '500' && err.response.data.path == '/amodeler/import') {
      return err.response.data
    } else {
      data = {
        status: '500',
        message: err.response.data.message,
        data: {
          message: '内部错误'
        }
      }
    }
    err.data = data
    showToast(true, data, data.data.message)
    return Promise.reject(err)
  }
)

const fetch = options => service.request(options)
export {
  fetch
}
