import businessRoutes from '@/bpm/router'
import { getUserNav } from '../api/app'
import cookie from 'js-cookie'
import { getUserRoleName } from '@/bpa/api/user'
import { getApproveCount } from '@/bpm/api/staging/personal/approve_list'
let navPath = []
function getPath(list) {
  list.forEach(item => {
    if (item.subNodes && item.subNodes.length > 0) {
      getPath(item.subNodes)
    }
    if (item.url) {
      let index = item.url.indexOf('?')
      let url = item.url
      if (index >= 0) {
        url = item.url.slice(0, index)
      }
      if (!navPath.includes(url)) {
        navPath.push(url)
      }
    }
  })
}
const app = {
  namespaced: true,
  state: {
    language: localStorage.getItem('language') || 'cn',
    userInfo: {},
    tabList: [],
    navPath: [],
    curModule: {},
    pageConfig: {
      showBreadCrumb: true,
      pageStyle: {}
    },
    activeIndex: '/',
    navRecords: [],
    bizData: {},
    nodeData: {},
    temporaryBizData: {},
    errorsShow: false,
    customError: [],
    buttonDisabled: false,
    themeColor: '',
    // themeColorId:'',
    // customThemeColor:"",
    activeAppHeader: '',
    keepAliveList: '', // 保存缓存的列表
    isTest: false,
    userAuthority: [],
    carouselShow: true,
    loginExpiredShow: false,
    approveCount: null, // 待办数量
    printCardKeyArray: ['出门证','外借物资出门证']
  },
  getters: {
    language: state => state.language,
    showBreadCrumb: state => state.pageConfig.showBreadCrumb,
    tabList: state => {
      if (!state.tabList) {
        state.tabList = businessRoutes.filter(item => {
          const isNav = item.meta.isNav
          if (isNav) {
            item.children = item.children.filter(child => child.meta.isNav)
            item.children.forEach(c => {
              c.children = c.children.filter(child => child.meta.isNav)
            })
          }
          return isNav
        })
      }
      return state.tabList
    },
    navPath: state => state.navPath,
    curModule: state => state.curModule,
    navRecords: state => state.navRecords,
    activeIndex: state => state.activeIndex,
    bizData: state => state.bizData,
    temporaryBizData: state => state.temporaryBizData,
    errorsShow: state => state.errorsShow,
    customError: state => state.customError,
    buttonDisabled: state => state.buttonDisabled,
    activeAppHeader: state => state.activeAppHeader,
    nodeData: state => state.nodeData,
    isTest: state => state.isTest,
    themeColor: state => state.themeColor,
    // themeColorId: state => state.themeColorId,
    // customThemeColor: state => state.customThemeColor,
    getUserAuthor: state => state.userAuthority,
    carouselShow: state => state.carouselShow,
    loginExpiredShow: state => state.loginExpiredShow,
    approveCount: state => state.approveCount,
    printCardKeyArray: state => state.printCardKeyArray,
  },
  mutations: {
    setLanguage: (state, language) => {
      state.language = language
      localStorage.setItem('language', language)
      const millisecond = new Date().getTime()
      const expiresTime = new Date(millisecond + 60 * 1000 * 24 * 60 * 30)
      cookie.set('lan-local', language, { expires: expiresTime })
    },
    setTabList(state, payload) {
      // console.log(state)
      // console.log(payload)
      state.tabList = payload
    },
    setNavPath(state, navPath) {
      state.navPath = navPath
    },
    setCurModule(state, payload) {
      state.curModule = payload
    },
    setThemeColor(state, payload) {
      state.themeColor = payload
    },
    // setThemeColorId(state, payload) {
    //   state.id = payload
    // },
    // setCustomThemeColor(state, payload) {
    //   state.customThemeColor = payload
    // },

    setNavRecords(state, payload) {
      // localStorage.setItem('navRecords', JSON.stringify(payload))
      state.navRecords = payload
    },
    setKeepAliveLists(state, arrListString) {
      state.keepAliveList = arrListString
    },
    setNodeData(state, payload) {
      // localStorage.setItem('navRecords', JSON.stringify(payload))
      state.nodeData = Object.assign({}, state.nodeData, payload)
    },

    setIsTest(state, payload) {
      state.isTest = payload
    },

    setActiveIndex(state, payload) {
      state.activeIndex = payload
    },
    setBizData(state, payload) {
      // state.temporaryBizData = Object.assign({},state.temporaryBizData,payload)
      state.bizData = payload
    },
    setTemporaryBizData(state, payload) {
      state.temporaryBizData = Object.assign(
        {},
        state.temporaryBizData,
        payload
      )
    },
    setErrorsShow(state, payload) {
      state.errorsShow = payload
    },
    setCustomError(state, payload) {
      state.customError = payload
    },
    setButtonDisabled(state, payload) {
      state.buttonDisabled = payload
    },
    setActiveAppHeader(state, payload) {
      // console.log(state)
      // console.log(payload)
      state.activeAppHeader = payload
    },
    setUserInfo(state, data) {
      state.userInfo = data
      // state.userInfo.userid = data.id
    },
    setUserAuthority(state, userAuthority) {
      state.userAuthority = !userAuthority ? [] : userAuthority.name.split(',')
    },
    setCarouselShow(state, payload) {
      state.carouselShow = payload
    },
    setLoginExpiredShow(state, payload) {
      state.loginExpiredShow = payload
    },
    setApproveCount(state, payload) {
      state.approveCount = payload
    }
  },
  actions: {
    async refreshModuleList({ commit }) {
      const rt = await getUserNav(1).catch(e => {
        return Promise.reject(e)
      })

      if (rt) {
        // console.log('🍓app获取用户导航信息setTabList', rt.data)
        commit('setTabList', rt.data)
        navPath = []
        getPath(rt.data)
        // console.log('🍓app获取用户导航信息setNavPath', navPath)
        commit('setNavPath', navPath)
        return Promise.resolve(rt)
      }
    },
    async requireAuthoriy({ commit }) {
      const result = await getUserRoleName()
      console.log(result)
      return new Promise((resolve, reject) => {
        commit('setUserAuthority', result)
        resolve()
      })
    },
    async requireApproveCount({ commit }) {
      const rt = await getApproveCount()
      if (rt) {
        commit('setApproveCount', rt.data)
      }
    }
  }
}
export default app
