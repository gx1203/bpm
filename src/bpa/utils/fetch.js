import store from '@/store'
import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import {
  Message,
  Loading,
  MessageBox
} from 'element-ui'
Vue.use(Router)
import main from '@/main'
axios.defaults.withCredentials = true

const service = axios.create({
  // baseURL: window.location.origin + process.env.VUE_APP_BPA_BASE_URL,
  // baseURL: process.env.VUE_APP_BPA_HOST_URL + process.env.VUE_APP_BPA_BASE_URL,
  baseURL: process.env.VUE_APP_BPA_BASE_URL,
  // baseURL: 'http://localhost/jcypoc',
  // baseURL: 'http://jiucaiyunbpmpoc.jiucaiyun.cn/bpabpmpocapi',
  // baseURL: 'http://jiucaiyunbpm.jiucaiyun.cn/bpabpmapi',
  // baseURL: '/api' + process.env.VUE_APP_BPA_BASE_URL,
  // baseURL: 'http://test5.jiucaiyun.cn/bpabpmapi',
  timeout: 600000000
})

const service2 = axios.create({
  // baseURL: process.env.VUE_APP_BPA_HOST_URL2 + process.env.VUE_APP_BPA_BASE_URL2,
  baseURL: process.env.VUE_APP_BPA_BASE_URL,
  timeout: 600000000
})

const service3 = axios.create({
  baseURL: process.env.HOST_URL3 + process.env.BASE_URL3,
  timeout: 600000000
})

// const isArray = data => Object.prototype.toString.call(data) === '[object Array]'
const showToast = (type, msg, msg2) => {
  if (type === 'success') {
    Message.success(msg || msg2)
  } else {
    if (msg === '失败') {
      msg = main.$t('hintText.operationFailure')
    }
    Message.error(msg || msg2)
  }
}
// 默认展示loading，如果不需要loading，将api里面的loading设置为false即可
service.interceptors.request.use((request) => {
  // console.log(request)
  const {
    loading = true
  } = request
  if (loading) {
    service.loading && service.loading.close()
    let customClass = main.$route.name === 'doorCenter' ? 'bpa_loading paddingtop60' : 'bpa_loading'
    service.loading = Loading.service({
      fullscreen: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.5)',
      customClass: customClass,
      target: '.view_wrap'
    })
  }
  const username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
  request.url = request.url.indexOf('?') === -1 ? (request.url + '?username=' + username) : request.url
  let lang = localStorage.getItem("language")
  request.headers['language'] = lang === 'cn' ? 'zh-CN' : lang === 'en' ? 'en-US' : lang === 'tw' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : lang === 'de' ? 'de-DE' : lang === 'it' ? 'it_IT' : ''
  return request
})

service.interceptors.response.use(
  (response) => {
    const {
      data,
      config,
      headers
    } = response
    const {
      loading
    } = config
    if (loading === undefined || loading === true) {
      service.loading.close()
    }
    if(response.data.code == 500){
      showToast('error', data.data, response.data.data)
    }
    // 判断返回的是文件流
    if (headers['content-type'].indexOf('application/octet-stream') > -1) {
      return response.data
    } else if ((data.code || parseInt(data.status)) !== 200) {
      if(data.message){
        showToast('error', data.message)
      }
      // return data.data
    } else {
      return data.data
    }

    if ((data.code || parseInt(data.status)) === 401) {
      MessageBox.alert(main.$t('hintText.loginExpired'), main.$t('hintText.hint'), {
        confirmButtonText: main.$t('confirm'),
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$router.replace('/login')
      }).catch(() => {})
      return false
    }
  },
  (err) => {
    console.log(err, err.response.status)
    if ((err.response.code || parseInt(err.response.status)) === 401) {
      service.loading.close()
      store.commit('app/setLoginExpiredShow', true)
      // main.$alert(main.$t('hintText.loginExpired'), main.$t('hintText.hint'), {
      //   confirmButtonText: main.$t('confirm'),
      //   type: 'warning',
      //   showClose: false
      // }).then(() => {
      //   window.location.replace('#/login')
      //   service.loading.close()
      //   store.commit('app/setCarouselShow', true)
      // }).catch(() => {
      // })
      return false
    }
    const data = {
      code: 1000,
      message: main.$t('hintText.networkAnomaly'),
      data: {}
    }
    err.data = data
    if (service.loading) {
      service.loading.close()
    }
    if (err.response.data.message) {
      showToast('error', '', err.response.data.message)
    } else {
      showToast('error', data, main.$t('hintText.networkAnomaly'))
    }
    console.log('error', data);
    return Promise.reject(err)


  }
)


// ===================
service2.interceptors.request.use((request) => {
  console.log(request)
  const {
    loading = true
  } = request
  if (loading) {
    service2.loading = Loading.service({
      fullscreen: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.5)'
    })
  }
  const username = JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
  request.url = request.url.indexOf('?') === -1 ? (request.url + '?username=' + username) : request.url
  let lang = localStorage.getItem("language")
  request.headers['language'] = lang === 'cn' ? 'zh-CN' : lang === 'en' ? 'en-US' : lang === 'tw' ? 'zh-TW' : lang === 'ja' ? 'ja-JP' : lang === 'de' ? 'de-DE' : lang === 'it' ? 'it_IT' : ''
  return request
})

service2.interceptors.response.use(
  (response) => {
    console.log(response)
    const {
      data,
      config,
      headers
    } = response
    const {
      loading
    } = config
    if (loading === undefined || loading === true) {
      service2.loading.close()
    }
    // 判断返回的是文件流
    if (headers['content-type'].indexOf('application/octet-stream') > -1) {
      return response.data
    } else if ((data.code || parseInt(data.status)) !== 200) {
      showToast('error', data.msg, main.$t('hintText.networkAnomaly'))
      // return data.data
    } else {
      return data.data
    }
    if ((data.code || parseInt(data.status)) === 401) {
      MessageBox.alert(main.$t('hintText.loginExpired'), main.$t('hintText.hint'), {
        confirmButtonText: main.$t('confirm'),
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$router.replace('/login')
        store.commit('app/setCarouselShow', true)
      }).catch(() => {})
      return false
    }
  },
  (err) => {
    console.log(err, err.response.status)
    if ((err.response.code || parseInt(err.response.status)) === 401) {
      MessageBox.alert(main.$t('hintText.loginExpired'), main.$t('hintText.hint'), {
        confirmButtonText: main.$t('confirm'),
        type: 'warning',
        showClose: false
      }).then(() => {
        location.href = '#/login'
        // this.$router.replace('/login')
        service2.loading.close()
        store.commit('app/setCarouselShow', true)
      }).catch(() => {})
      return false
    }
    const data = {
      code: 1000,
      message: main.$t('hintText.networkAnomaly'),
      data: {}
    }
    err.data = data
    if (service2.loading) {
      service2.loading.close()
    }
    showToast('error', data, main.$t('hintText.networkAnomaly'))
    return Promise.reject(err)
  }
)

const fetch = options => service.request(options)
const fetch2 = options => service2.request(options)
const fetch3 = options => service3.request(options)

// export default fetch
export {
  fetch,
  fetch2,
  fetch3
}
