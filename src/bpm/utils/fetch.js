import store from '@/store'
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import main from '@/main'

axios.defaults.withCredentials = true

const service = axios.create({
  // baseURL: window.location.origin + process.env.VUE_APP_BASE_URL,
  // baseURL: process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL,
  baseURL: process.env.VUE_APP_BPA_BASE_URL,
  // baseURL: 'http://localhost/jcydev',
  // baseURL: 'http://localhost/jcypoc',
  // baseURL: 'http://jiucaiyunbpm.jiucaiyun.cn/bpabpmapi',
  // baseURL: 'http://test5.jiucaiyun.cn/bpabpmapi',
  // baseURL: '/api' + process.env.VUE_APP_BPA_BASE_URL,
  timeout: 50000
})

const isArray = data => Object.prototype.toString.call(data) === '[object Array]'

const showToast = (toast, data, msg) => {
  if (toast) {
    const { status, message } = data
    const isToastArray = isArray(toast)
    const needToast = (isToastArray && toast.indexOf(status) === -1) || (!isToastArray && toast)
    if (needToast) {
      if (status === '200' || data.data === 0) {
        if (message) {
          Message.success(message === 'success' ? this.$t('hintText.operateSuccessfully') : message)
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
  let lang = store.state.app.language
  const id = sessionStorage.getItem('userid')
  request.headers['language'] = lang === 'cn' ? 'zh-CN' : lang === 'en' ? 'en-US' : lang === 'tw' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : lang === 'de' ? 'de-DE' : lang === 'it' ? 'it_IT':''
  request.headers.token = id
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
    const { data, config } = response
    const { loading, toast = loading } = config
    if (response.status == '200' && response.config.url == process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL + '/logout') {
      return response
    } else if (data.status === '200' || data.status === '500' || response.status == '200') {
      return data
    } else if (data.status === '50000') {
      store.commit('app/setUserInfo', {})
      store.commit('app/setTabList', [])
    } else {
      return Promise.reject(new Error(data.message))
    }
  },
  (err) => {
    let data = {}
    if (err.code === 'ECONNABORTED') {
      showToast(true, data, '接口超时,请重新请求!!')
      return
    }
    if (process.env.VUE_APP_ROUTER_URL === 'tongweiSSO') {
    } else {
      if (!err.response && err.config.url.indexOf('/logout')) {
        localStorage.removeItem('user')
        localStorage.removeItem('userid')
        store.dispatch('basuser/saveUser', {})
        store.commit('app/setTabList', [])
        location.href = window.location.origin + window.location.pathname + '#/login'
      }
      if (err.response.status == '401' && err.response.config.url == '/authentication/form') {
        err.response.data.message = '用户名密码错误'
      } else if (err.response.status == '401') {
        store.commit('app/setLoginExpiredShow', true)
        // main.$alert(main.$t('hintText.loginExpired'), main.$t('hintText.hint'), {
        //   confirmButtonText: main.$t('confirm'),
        //   type: 'warning',
        //   showClose: false
        // }).then(() => {
        //   localStorage.removeItem('user')
        //   localStorage.removeItem('userid')
        //   store.dispatch('basuser/saveUser', {})
        //   store.commit('app/setTabList', [])
        //   window.location.replace('#/login')
        //   // main.$router.replace('/login')
        // }).catch(() => {
        // })
        return false
      }
    }
    if (err.response.status == '500' && err.response.data.path == '/bpm/amodeler/import') {
      return err.response.data
    } 
    else if (err.response.status == '500' && err.response.data.status === '530') {
      data = { status: '500', message: err.response.data.data && err.response.data.data.length > 0 ? '重复撤单' : '', data: { message: err.response.data.message} }
    } else {
      data = { status: '500', message: err.response.data.message, data: { message: '内部错误' } }
    }
    err.data = data
    showToast(true, data, data.data.message)
    return Promise.reject(err)
  }
)

const fetch = options => service.request(options)
export { fetch }
