import Vue from 'vue'
import VueRouter from 'vue-router'
import bpmRoutes from '@/bpm/router'
import bpaRoutes from '@/bpa/router'
import basRoutes from '@/bas/router'
import store from '@/store'
import cookie from 'js-cookie'
import { getCurrentUser } from '@/bpa/api/user'
import { getToken } from '@/bas/api/app';
// 解决同一个路由多次点击报错-控制台
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

export const redirectRoutes = [
  {
    path: '/',
    // redirect: '/bpmHome'
    redirect: '/login'
   //redirect: '/doorCenter'
  }
]
export const routes = [
  ...redirectRoutes,
  ...basRoutes,
  ...bpaRoutes,
  ...bpmRoutes
]
// 路由创建
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

const initMenu = (routers, menus) => {
  const result = routers.filter(router => {
    const title = router.meta.title
    for (let i = 0; i < menus.length; i++) {
      if (title === menus[i].meta.title) {
        return true
      }
    }
  })
  // 给第二级加上component属性
  router.addRoutes(
    result.concat([
      {
        path: '/*',
        component: resolve => require(['@/bpm/views/error_page/404'], resolve)
      }
    ])
  )
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// 全局前置路由守卫，可做登录验证
router.beforeEach((to, form, next) => {
  document.title = '九彩云BPM极速版'
  // 登录验证
  let  isLogin = cookie.get('isLogin')
  //单点登录验证开始
  // const urlCode = getQueryVariable("code"); 
  // // 如果地址栏中有code,则清空登录状态
  // if (
  //   urlCode!=false
  // ) {
  //   isLogin = ''
  // }
  // if (!isLogin) {
  //   if (
  //     !urlCode
  //   ) {  
  //    let ssoUrl = `http://idmtest.loxa.com.cn/oauth2.0/authorize?client_id=app_bpm&redirect_uri=${window.location.href}&response_type=code`;
  //     localStorage.setItem("redirectUrl",window.location.href); 
  //    // let ssoUrl = "http://idmtest.loxa.com.cn/oauth2.0/authorize?client_id=app_bpm&redirect_uri=http://127.0.0.1&response_type=code"
  //     window.location.href = ssoUrl;
  //     // if (to.path === '/login') {
  //     //   next()
  //     // } else {
  //     //   next('/login')
  //     // }
  //   } else { 
  //       getToken(urlCode).then(result=>{
  //         store
  //         .dispatch('basuser/getUser', result.data)
  //         .then(res1 => {
           
  //           getCurrentUser(res1.data.name)
  //           .then(res => {
  //             if (res.message === 'null') {
  //               next('/login')
  //             } else { 
  //               //token的值需要进行验证 
  //               cookie.set('token', result.data)
  //               cookie.set('isLogin', 'isLoquerygin', 0)
  //               // ------------------------
  //               const data = {
  //                 id: res.id,
  //                 //password: res.data.password,
  //                 empuid: res.empuid,
  //                 cnname: res.cnname,
  //                 displayname: res.displayname,
  //                 res: res
  //               }
  //               localStorage.setItem(
  //                 'language',
  //                 localStorage.getItem('language') || 'cn'
  //               )
  //               localStorage.setItem(
  //                 'portalCurrentUserInfo',
  //                 JSON.stringify(data)
  //               )
  //               localStorage.setItem('userInfo', JSON.stringify(data))
  //               localStorage.setItem('portalCurrentUserInfo', JSON.stringify(data))
  //               const millisecond = new Date().getTime()
  //               const expiresTime = new Date(millisecond + 60 * 1000 * 24 * 60 * 3)
  //               // 3天过期
  //               cookie.set('username', res.empid, {
  //                 expires: expiresTime
  //               })
  //               if (!cookie.get('lan-local')) {
  //                 const millisecond = new Date().getTime()
  //                 const expiresTime = new Date(
  //                   millisecond + 60 * 1000 * 24 * 60 * 30
  //                 )
  //                 cookie.set('lan-local', localStorage.getItem('language'), {
  //                   expires: expiresTime
  //                 })
  //               }
  //               store.dispatch('basuser/saveUser', data)
  //               store
  //                 .dispatch('app/refreshModuleList')
  //                 .then(res => {
  //                   return store.dispatch('userInfo/requireMenu')
  //                 })
  //                 .then(res => {
  //                   // const userMenu = JSON.parse(localStorage.getItem('db')).userInfo
  //                   //   .userMenu
  //                   // const path = userMenu[0].url
  //                   // router.push({
  //                   //   path
  //                   // })
  //                   console.log(res)
  //                 })
  //                 .catch(error => console.log(error))
  //               // =======================
  //               window.location.href = localStorage.getItem("redirectUrl");
                
  //             }
  //           }) 
  //           })
  //       })
      
  //       .catch(error => console.log(error))
  //   }
  // } else {
  //   const navpath = [
  //     ...store.state.userInfo.navPath,
  //     ...store.state.app.navPath
  //   ]
  //   if (navpath.includes(to.path) || navpath.includes(to.name)) {
  //     next()
  //   } else if (!to.meta.isNav) {
  //     next()
  //   } else {
  //     next('/404')
  //   }
  // }
   //单点登录验证结束
   //注释之前的写法
  if (!isLogin && to.path !== '/login' && form.path !== '/login') {
    next('/login')
  } else {
    const navpath = [
      ...store.state.userInfo.navPath,
      ...store.state.app.navPath
    ]
    if (
      to.meta.isNav &&
      !(navpath.includes(to.path) || navpath.includes(to.name))
    ) {
      next('/404')
    }
    next()
  }
})
export default router
