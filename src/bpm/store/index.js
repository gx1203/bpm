import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import app from './app'
import fromData from './fromData'
import custom from './custom'
import icon from './icon'
import processDesign from './processDesign'
import bpmChat from './bpmChat'

Vue.use(Vuex)

// const store = new Vuex.Store({
//   modules: {
//     app,
//     fromData,
//     custom,
//     processDesign,
//     icon
//   },
//   plugins: [createPersistedState({
//     key: 'db',
//     storage: window.localStorage,
//     reducer(state) {
//       return {
//         app: {
//           userInfo: state.app.userInfo,
//           themeColor: state.app.themeColor
//         }
//       }
//     }
//   }), createPersistedState({
//     key: 'bpm_pc_nav_records',
//     storage: window.localStorage,
//     reducer(state) {
//       return {
//         app: {
//           navRecords: state.app.navRecords,
//           tabList: state.app.tabList,
//         }
//       }
//     }
//   })]
// })

export default {
  app,
  fromData,
  custom,
  processDesign,
  bpmChat,
  icon
}
