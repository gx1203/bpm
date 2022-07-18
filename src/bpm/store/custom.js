

const custom = {
  namespaced: true,
  state: {
    isLRShow: true
  },
  getters: {
    isLRShow: state => state.isLRShow,
  },
  mutations: {
    setIsLRShow (state, payload) {
      state.isLRShow = payload
    }
  },
}
export default custom
