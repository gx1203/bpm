export default {
  namespaced: true,
  state: {
    currentHeader: {},
    headerSkin: 'blue', // 头部皮肤
    curPlatform: {}
  },
  getters: {
    getHeader(state) {
      return state.currentHeader
    },
    getHeaderSkin(state) {
      return state.headerSkin
    },
    curPlatform: state => state.curPlatform
  },
  mutations: {
    /**
     * 设置头部当前选中
     * @date 2021-08-02
     * @param {object} header 头部信息。只保存id 和 name
     */
    setHeader(state, header) {
      state.currentHeader = {
        id: header.id,
        name: header.name
      }
    },
    /**
     * 选中头部风格
     * @date 2021-08-02
     * @param {string} skin
     */
    setHeaderSkin(state, skin) {
      state.headerSkin = skin
    },
    setCurPlatform(state, curPlatform) {
      state.curPlatform = curPlatform
    }
  },
  actions: {
    // 保存用户信息
    // saveUser({ commit }, params) {
    //   commit(SET_USER, params)
    // }
  }
}
