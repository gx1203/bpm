import { SET_USER } from '@/bas/store/BasConstant'
import{getUser} from '@/bas/api/app.js';
export default {
  namespaced: true,
  state: {
    user: {}, // 用户信息
    userid: ''
  },
  getters: {
  },
  mutations: {
    // 保存用户信息
    [SET_USER](state, params) {
      state.user = params
      state.userid = params.empuid
      sessionStorage.setItem('userid', params.empuid)
      sessionStorage.setItem('token', params.empuid)
      sessionStorage.setItem('user', params)
    }
  },
  actions: {
    // 保存用户信息
    saveUser({ commit }, params) {
      commit(SET_USER, params)
    },
    // getUser({commit},params){
    //     return getUser(params);
    // }
    async getUser(state,params){
      const res = await getUser(params)
      return res
    }
  }
}
