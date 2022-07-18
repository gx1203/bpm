import Vue from 'vue'
import Vuex from 'vuex'
import bpmStore from '@/bpm/store'
import bpaStore from '@/bpa/store'
import basStore from '@/bas/store'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    ...bpmStore,
    ...bpaStore,
    ...basStore
  },
  plugins: [createPersistedState({ // bpm相关存储
    key: 'db',
    storage: window.localStorage,
    reducer(state) {
      return {
        app: {
          themeColor: state.app.themeColor
        },
        basuser: {
          user: state.basuser.user
        },
        header: {
          curPlatform: state.header.curPlatform
        },
        userInfo: {
          userMenu: state.userInfo.userMenu,
          navPath: state.userInfo.navPath
        }
      }
    }
  }), createPersistedState({ // bpm相关存储
    key: 'bpm_pc_nav_records',
    storage: window.localStorage,
    reducer(state) {
      return {
        app: {
          navRecords: state.app.navRecords,
          tabList: state.app.tabList,
          navPath: state.app.navPath
        }
      }
    }
  }), createPersistedState({
    key: 'bpm_pc_product_intro',
    storage: window.sessionStorage,
    reducer(state) {
      return {
        app: {
          carouselShow: state.app.carouselShow
        }
      }
    }
  })]
})
export default store
