import { getUserRoleName } from '../../api/user'
import { getUserMenulist } from '../../api/user'
import { getUserNav } from '@/bpa/api/common'
import { businessRoutes } from '../../router'
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
const userInfo = {
  namespaced: true,
  state: {
    userAuthority: [],
    userMenu: [],
    curModule: {},
    navPath: [],
    systemId: ''
  },
  getters: {
    getUserAuthor(state) {
      return state.userAuthority
    },
    getUserMenu(state) {
      state.userMenu.forEach(item => {
        businessRoutes.forEach(item2 => {
          if (item.url === item2.path) {
            item.meta = item2.meta
          }
          if (
            item.subNodes &&
            item2.children &&
            item.subNodes.length > 0 &&
            item2.children.length > 0
          ) {
            item.subNodes.forEach(itemChild => {
              item2.children.forEach(itemChild2 => {
                if (itemChild.url === itemChild2.path) {
                  itemChild.meta = itemChild2.meta
                }
                if (
                  itemChild.subNodes &&
                  itemChild2.children &&
                  itemChild.subNodes.length > 0 &&
                  itemChild2.children.length > 0
                ) {
                  itemChild.subNodes.forEach(itemChild_child => {
                    itemChild2.children.forEach(itemChild_child2 => {
                      if (itemChild_child.url === itemChild_child2.path) {
                        itemChild_child.meta = itemChild_child2.meta
                      }
                    })
                  })
                }
              })
            })
          }
        })
      })
      return state.userMenu
    },
    navPath(state) {
      return state.navPath
    },
    curModule: state => state.curModule,
    getSystemId(state) {
      return state.systemId
    }
  },
  mutations: {
    setUserAuthority(state, userAuthority) {
      state.userAuthority = !userAuthority ? [] : userAuthority.name.split(',')
    },
    setUserMenu(state, userMenu) {
      state.userMenu = userMenu
    },
    setCurModule(state, curModule) {
      state.curModule = curModule
    },
    setNavPath(state, navPath) {
      state.navPath = navPath
    },
    setSystemId(state, systemId) {
      state.systemId = systemId
    }
  },
  actions: {
    async requireAuthoriy({ commit }) {
      let result = await getUserRoleName()
      console.log(result)
      return new Promise((resolve, reject) => {
        commit('setUserAuthority', result)
        resolve()
      })
    },
    async requireMenu({ commit }) {
      let result = await getUserNav(1)
      console.log(result)
      return new Promise((resolve, reject) => {
        // console.log('🍓userInfo-setUserMenu', result)
        commit('setUserMenu', result)
        navPath = []
        getPath(result)
        // console.log('🍓userInfo-setNavPath', navPath)
        commit('setNavPath', navPath)
        resolve()
      })
    },
    async getCurrentSystemId({ commit }, val) {
      const result = val
      commit('setSystemId', result)
    }
  }
}
export default userInfo
