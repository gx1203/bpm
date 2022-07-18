import { fetch } from '@/bpm/utils'
import store from '@/bpm/store'

// export async function login (data) {
//   const res = await fetch({
//     url: '/sso/locallogin',
//     method: 'POST',
//     data,
//     loading: true
//   }).catch(e => {
//     localStorage.removeItem('token')
//     store.commit('app/setUserInfo', {})
//     router.push({name: '/login'})
//     Promise.reject(e)
//   })
//   if (res.status === '200' && res.data) {
//     localStorage.setItem('token', rt.data.id)
//     res.data.userid = res.data.id
//     store.commit('app/setUserInfo', res.data)
//   } else {
//     localStorage.removeItem('token')
//     store.commit('app/setUserInfo', {})
//     router.push({name: '/login'})
//   }
//   return Promise.resolve(res)
// }

// export function login (token) {
//   return new Promise((resolve, reject) => {
//     fetch({
//       url: `/sso/loginpwd/${token}`,
//       method: 'GET',
//       headers: {
//         'token': token
//       },
//       toast: false,
//       params: {
//         cache: new Date().getTime()
//       }
//     }).then(rt => {
//       if (rt.status === '200') {
//         rt.data.userid = rt.data.id
//         store.commit('app/setUserInfo', rt.data)
//       } else {
//         localStorage.removeItem('token')
//         store.commit('app/setUserInfo', {})
//         router.push({name: '/login'})
//       }
//       resolve(rt)
//     }).catch(e => {
//       localStorage.removeItem('token')
//       store.commit('app/setUserInfo', {})
//       router.push({name: '/login'})
//       reject(e)
//     })
//   })
// }

// 获取流程图
export function getInstanceImage (instanceId) {
  return fetch({
    url: `/bpm/process/instanceImage/${instanceId}`,
    method: 'GET',
    responseType: 'arraybuffer',
    headers: {
      token: localStorage.getItem('token')
    }
  })
}

// export function getToken (params) {
//   return fetch({
//     url: 'http://demosso.jiucaiyun.cn/cas/oauth2.0/accessToken',
//     method: 'POST',
//     toast: false,
//     params
//   })
// }



export function getInstanceNodeInfo (instanceId) {
  return fetch({
    url: `/bpm/process/getInstanceNodeInfo/${instanceId}`,
    method: 'POST'
  })
}

export function getFlowType (instanceId) {
  return fetch({
    url: `/bpm/process/getFlowType/${instanceId}`,
    method: 'POST'
  })
}


export function getOrgTree (data) {
  return fetch({
    url: `/org/tree/query`,
    method: 'POST',
    data
  })
}


export function getApprovalRecord (instanceId) {
  return fetch({
    url: `/bpm/process/getApprovalRecord/${instanceId}`,
    method: 'POST'
  })
}
export function getProcessImgType () {
  return fetch({
    url: `/businessrule/ruleconfig/diagram-show-type`,
    method: 'GET'
  })
}

export function getLoginMessage (data) {
  return fetch({
    url: '/authentication/form',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    toast: false,
    data: data
  })
}

// export async function getTokenSX (data) {
//   return fetch({
//     url: '/sso/locallogin',
//     method: 'POST',
//     toast: false,
//     data
//   })
// }
// 根据ID获取当前用户有权限访问的导航组
export function getUserNav (id) {
  return fetch({
    url: `/navigation/getCurrentUserNav/${id}/default`,
    method: 'GET'
  })
}
export function loginSX (params) {
  return new Promise((resolve, reject) => {
    fetch({
      url: `/sso/login`,
      method: 'GET',
      toast: false,
      params
    }).then(rt => {
      if (rt.status === '200') {
        rt.data.userid = rt.data.id
        store.commit('app/setUserInfo', rt.data)
      } else {
        localStorage.removeItem('token')
        store.commit('app/setUserInfo', {})
        window.location.href = `${process.env.SSO_URL}?redirect_uri=${process.env.REDIRECT_URI}&state=${new Date().getTime()}&client_id=process&response_type=code`
      }
      resolve(rt)
    }).catch(e => {
      localStorage.removeItem('token')
      store.commit('app/setUserInfo', {})
      window.location.href = `${process.env.SSO_URL}?redirect_uri=${process.env.REDIRECT_URI}&state=${new Date().getTime()}&client_id=process&response_type=code`
      reject(e)
    })
  })
}

export function logout() {
  return fetch({
    url: `/logout`,
    method: 'POST'
  })
}
export function resetInterface(data) {
  return fetch({
    url: '/portal/security/pwd/reset',
    method: 'PUT',
    data
  })
}

// 上传图片
export function imgUpload(data) {
  return fetch({
    url: '/attach/upload?attachmentType=bpm',
    method: 'post',
    data
  })
}


// export function getThemeColorInfo () {
//   return fetch({
//     url: `/userThemeColor/get`,
//     method: 'GET'
//   })
// }

// export function setThemeColorInfo(data) {
//   return fetch({
//     url: '/userThemeColor/save',
//     method: 'post',
//     data
//   })
// }