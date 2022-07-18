export default {
  websocket: null,
  lockReconnect: false, // 是否真正建立连接
  timeout: 28 * 1000, // 30秒一次心跳
  timeoutObj: null, // 心跳心跳倒计时
  serverTimeoutObj: null, // 心跳倒计时
  timeoutNum: null, // 断开 重连倒计时
  initWebSocket: function(
    url,
    messageCallback,
    openCallback,
    errorCallback,
    closeCallback
  ) {
    let that = this;
    if ("WebSocket" in window) {
      that.websocket = new WebSocket(
        `${process.env.VUE_APP_SOCKET_HOST_URL}${process.env.VUE_APP_SOCKET_BASE_URL}${url}`
      );
      that.websocket.onmessage = function(e) {
        // 数据接收
        if (e.data) {
          if (e.data === "heartCheck") {
            console.log(e.data);
            that.reset();
            return;
          }
          messageCallback && messageCallback(e);
        }
      };
      that.websocket.onopen = function(e) {
        console.log("会话连接成功", e);
        that.start();
        openCallback && openCallback();
      };
      that.websocket.onerror = function(e) {
        // 连接建立失败重连
        // initWebSocket()
        closeCallback && closeCallback(e);
      };
      that.websocket.onclose = function(e) {
        console.log("会话断开连接", e);
        errorCallback && errorCallback(e);
      };
    } else {
      // 浏览器不支持 WebSocket
      alert("您的浏览器不支持 WebSocket!");
    }
  },
  reconnect: function() {
    //重新连接
    let that = this;
    if (that.lockReconnect) {
      return;
    }
    that.lockReconnect = true;
    // 没连接上会一直重连，设置延迟避免请求过多
    that.timeoutNum && clearTimeout(that.timeoutNum);
    that.timeoutNum = setTimeout(function() {
      // 新连接
      that.initWebSocket();
      that.lockReconnect = false;
    }, 5000);
  },
  reset: function() {
    // 重置心跳
    let that = this;
    // 清除时间
    clearTimeout(that.timeoutObj);
    clearTimeout(that.serverTimeoutObj);
    // 重启心跳
    that.start();
  },
  start: function() {
    // 开启心跳
    let that = this;
    that.timeoutObj && clearTimeout(that.timeoutObj);
    that.serverTimeoutObj && clearTimeout(that.serverTimeoutObj);
    that.timeoutObj = setTimeout(function() {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      console.log(that.websocket);
      if (that.websocket.readyState === 1) {
        // 如果连接正常
        that.websocket.send("heartCheck");
      } else {
        // 否则重连
        that.reconnect();
      }
    }, that.timeout);
  },
  websocketSend: function() {
    this.websocket.send(data);
  },
  clearWebSocket: function() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      clearTimeout(this.timeoutObj);
      clearTimeout(this.serverTimeoutObj);
    }
  }
};
// let websocket = null,
//   lockReconnect = false, // 是否真正建立连接
//   timeout = 28 * 1000, // 30秒一次心跳
//   timeoutObj = null, // 心跳心跳倒计时
//   serverTimeoutObj = null, // 心跳倒计时
//   timeoutNum = null; // 断开 重连倒计时
//
// export function initWebSocket(url, messageCallback, openCallback, errorCallback, closeCallback) {
//   if ("WebSocket" in window) {
//     websocket = new WebSocket(
//       `${process.env.VUE_APP_SOCKET_HOST_URL}${process.env.VUE_APP_SOCKET_BASE_URL}${url}`
//     );
//     websocket.onmessage = function(e) {
//       // 数据接收
//       if (e.data) {
//         if (e.data === "heartCheck") {
//           console.log(e.data);
//           reset();
//           return;
//         }
//         messageCallback && messageCallback(e)
//       }
//     };
//     websocket.onopen = function(event) {
//       console.log("会话连接成功", event);
//       start();
//       openCallback && openCallback();
//     };
//     websocket.onerror = function() {
//       // 连接建立失败重连
//       // initWebSocket()
//       closeCallback && closeCallback()
//     };
//     websocket.onclose = function(e) {
//       console.log("会话断开连接", e);
//       errorCallback && errorCallback()
//     };
//   } else {
//     // 浏览器不支持 WebSocket
//     alert("您的浏览器不支持 WebSocket!");
//   }
// }
//
// function reconnect() {
//   //重新连接
//   if (lockReconnect) {
//     return;
//   }
//   lockReconnect = true;
//   // 没连接上会一直重连，设置延迟避免请求过多
//   timeoutNum && clearTimeout(timeoutNum);
//   timeoutNum = setTimeout(function() {
//     // 新连接
//     initWebSocket();
//     lockReconnect = false;
//   }, 5000);
// }
// function reset() {
//   // 重置心跳
//   // 清除时间
//   clearTimeout(timeoutObj);
//   clearTimeout(serverTimeoutObj);
//   // 重启心跳
//   start();
// }
//
// function start() {
//   // 开启心跳
//   timeoutObj && clearTimeout(timeoutObj);
//   serverTimeoutObj && clearTimeout(serverTimeoutObj);
//   timeoutObj = setTimeout(function() {
//     // 这里发送一个心跳，后端收到后，返回一个心跳消息，
//     console.log(websocket);
//     if (websocket.readyState === 1) {
//       // 如果连接正常
//       websocket.send("heartCheck");
//     } else {
//       // 否则重连
//       reconnect();
//     }
//   }, timeout);
// }
//
// export function websocketSend(data) {
//   websocket.send(data)
// }
//
// export function clearWebSocket() {
//   if (websocket) {
//     websocket.close();
//     websocket = null;
//     clearTimeout(timeoutObj);
//     clearTimeout(serverTimeoutObj);
//   }
// }
