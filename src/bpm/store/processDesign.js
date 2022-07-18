

const processDesign = {
    namespaced: true,
    state: {
        active: 0,
        processData: {},
        isCount: 0
    },
    getters: {
        active: state => state.active,
        isCount: state => state.isCount,
        processData: state => state.processData
    },
    mutations: {
      setActive (state, payload) {
        state.active = payload
      },
      setProcessData (state, payload) {
        state.processData= payload
      },
      setIsCount(state, payload) {
        state.isCount= payload
      }
    },
  }
  export default processDesign
  