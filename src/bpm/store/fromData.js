import { businessRoutes } from '@/bpm/router'

const fromData = {
  namespaced: true,
  state: {
    userInfo: {},
    bizData: {},
    nodeDataObj:{},
    temporaryBizData: {},
    errorsShow: false,
    customError: [],
    buttonDisabled: false,
    isEmptyBizData: false,
  },
  getters: {
    bizData: state => state.bizData,
    temporaryBizData: state => state.temporaryBizData,
    errorsShow: state => state.errorsShow,
    customError: state => state.customError,
    buttonDisabled: state => state.buttonDisabled,
    nodeDataObj: state => state.nodeDataObj,
    isEmptyBizData: state => state.isEmptyBizData,
  },
  mutations: {
    setNodeData (state, payload) {
      state.nodeDataObj = Object.assign({},state.nodeDataObj,payload)
    },
    setBizData (state, payload) {
      state.bizData = payload
    },
    setIsEmptyBizData (state, payload) {
      state.isEmptyBizData = payload
    },
    setTemporaryBizData (state, payload) {
      state.temporaryBizData = Object.assign({},state.temporaryBizData,payload)
    },
    setErrorsShow (state, payload) {
      state.errorsShow = payload
    },
    setCustomError(state, payload) {
      state.customError = payload
    },
    setButtonDisabled (state, payload) {
      state.buttonDisabled = payload
    },
    setUserInfo (state, data) {
      state.userInfo = data
    }
  },
  actions: {
   
  }
}
export default fromData
