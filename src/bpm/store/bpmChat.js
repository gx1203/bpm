import store from '@/store'
const bpmChat = {
  namespaced: true,
  state: {
    talkUnread: 0,
    messageList: [],
    talkMessage: {},
    websocket: null
  },
  getters: {
    talkUnread: state => state.talkUnread,
    messageList: state => state.messageList,
    talkMessage: state => state.talkMessage,
    websocket: state => state.websocket
  },
  mutations: {
    setTalkUnread(state, payload) {
      state.talkUnread = payload;
    },
    setMessageList(state, payload) {
      state.messageList = payload;
    },
    setTalkMessage(state, payload) {
      state.talkMessage = payload;
    },
    setWebsocket(state, payload) {
      state.websocket = payload;
    }
  },
  actions: {
    initWebSocketTalkUnread({ commit }) {
      if ('WebSocket' in window) {
        let websocket = new WebSocket(
          `ws://test2.jiucaiyun.cn/bpabpmdev4api/ws/talkUnread/${store.state.basuser.user.id}`
        )
        websocket.onmessage = function (e) {
          // 数据接收
          if (e.data) {
            console.log(e.data)
            commit('setTalkUnread', e.data)
          }
        }
        websocket.onopen = function (event) {
          console.log('连接成功', event)
        }
        websocket.onerror = function () {
          // this.initWebSocket()
        }
        websocket.onclose = function (e) {
          console.log('断开连接', e)
        }
      } else {
        // 浏览器不支持 WebSocket
        alert('您的浏览器不支持 WebSocket!')
      }
    },
  }
};
export default bpmChat;
