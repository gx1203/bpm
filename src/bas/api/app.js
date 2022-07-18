import { fetch } from '@/bpm/utils'

export function getLoginMessage(data) {
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

// captcha/render获取验证码
export function getCookis(data) {
  return fetch({
    url: '/persionBasic/getCookis',
    method: 'GET'
  })
}

export function logout() {
  return fetch({
    url: `/logout`,
    method: 'POST'
  })
}

// 获取登录次数
export function getLoginCount(accountId) {
  return fetch({
    url: `/portal/account/unlock/${accountId}`,
    method: 'POST'
  })
}


// 调用接口
export function getUser(code) {
  return fetch({
    url: `/authentication/form`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'BAS-PRIVATE-TOKEN': code
    },
    toast: false,
  })

  
  
}

export function getToken(code) {
  return fetch({
    url: `/getToken?code=${code}`,
    method: 'GET',
    
    toast: false,
  })

  
  
}
