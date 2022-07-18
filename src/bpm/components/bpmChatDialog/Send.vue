<template>
  <div class="chat-text">
    <div class="el-textarea">
      <!--			<textarea-->
      <!--				@keyup.enter.prevent="websocketSend"-->
      <!--				@keyup.ctrl.enter="lineFeed()"-->
      <!--				v-model="content"-->
      <!--			/>-->
      <textarea @keydown.enter="keyDown" v-model="content" />
    </div>
    <el-row class="send-bar">
      <el-tooltip
        :disabled="content !== '' && content !== null && content !== undefined"
        content="不能发送空白信息"
        placement="top-end"
        effect="light"
        popper-class="tooltip"
      >
        <el-button type="text" @click="websocketSend">发送(S)</el-button>
      </el-tooltip>
    </el-row>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapMutations } = createNamespacedHelpers("bpmChat");
export default {
  data() {
    return {
      content: "",
      websocket: null,
      lockReconnect: false, // 是否真正建立连接
      timeout: 28 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null // 断开 重连倒计时
    };
  },
  props: {
    talkItem: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapGetters(["messageList"])
  },
  watch: {
    "talkItem.id": {
      handler: function(val) {
        this.lockReconnect = false
        this.content = "";
        this.setMessageList([]);
        this.setTalkMessage({});
        this.clearWebSocket();
        if (val) {
          this.initWebSocket();
        }
      }
    }
  },
  methods: {
    ...mapMutations(["setMessageList", "setTalkMessage"]),
    keyDown(e) {
      if (e) {
      	if (e.ctrlKey && e.keyCode === 13) {
					//用户点击了ctrl+enter触发
					this.content = this.content + '\n';
      	} else {
        if (e.shiftKey) return;
          e.preventDefault(); // 阻止浏览器默认的敲击回车换行的方法
					this.websocketSend()
        }
      }
    },
    // 换行
    lineFeed() {
      this.content = this.content + "\n";
    },
    initWebSocket() {
      console.log(1)
      if ("WebSocket" in window) {
        this.websocket = new WebSocket(
          `${process.env.VUE_APP_SOCKET_HOST_URL}${process.env.VUE_APP_SOCKET_BASE_URL}/ws/talk/${this.talkItem.id}`
        );
        this.websocket.onmessage = this.websocketMessage;
        this.websocket.onopen = this.websocketOpen;
        this.websocket.onerror = this.websocketError;
        this.websocket.onclose = this.websocketClose;
      } else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
      }
    },
    websocketOpen(event) {
      console.log("信息连接成功", event);
      this.websocket.send(
        JSON.stringify({
          sendUserId: this.$store.state.basuser.user.id,
          sendUserName:
            this.$store.state.basuser.user.cnname ||
            this.$store.state.basuser.user.displayname,
          talkId: this.talkItem.id,
          type: "user"
        })
      );
      this.start();
    },
    websocketError() {
      // 连接建立失败重连
      // this.initWebSocket()
    },
    websocketMessage(e) {
      // 数据接收
      if (e.data) {
        if (e.data === "heartCheck") {
          console.log(e.data);
          this.reset();
          return;
        }
        let data = JSON.parse(e.data);
        console.log(data);
        let messageList = JSON.parse(JSON.stringify(this.messageList));
        if (this.talkItem.id === data.talkId && !messageList.map(item => item.id).includes(data.id)) {
          messageList.push(data);
          this.setMessageList(messageList);
        }
      }
      this.reset();
    },
    websocketSend() {
      // 数据发送
      if (
        this.content !== "" &&
        this.content !== null &&
        this.content !== undefined
      ) {
        console.log(this.websocket)
        if (!this.websocket || this.websocket.readyState !== 1) {
          this.$message({
            message: '网络异常，连接失败',
            type: 'error'
          })
					return
        }
        this.websocket.send(
          JSON.stringify({
            content: this.content,
            sendUserId: this.$store.state.basuser.user.id,
            sendUserName:
              this.$store.state.basuser.user.cnname ||
              this.$store.state.basuser.user.displayname,
            talkId: this.talkItem.id,
            type: "text"
          })
        );
        this.content = "";
      }
    },
    websocketClose(e) {
      console.log("信息断开连接", e);
    },
    reconnect() {
      //重新连接
      var that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function() {
        // 新连接
        that.initWebSocket();
        that.lockReconnect = false;
      }, 5000);
    },
    reset() {
      //重置心跳
      var that = this;
      // 清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      // 重启心跳
      that.start();
    },
    start() {
      // 开启心跳
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      self.timeoutObj = setTimeout(function() {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        console.log(self.websocket);
        if (self.websocket.readyState === 1) {
          // 如果连接正常
          self.websocket.send("heartCheck");
        } else {
          // 否则重连
          self.reconnect();
        }
      }, self.timeout);
    },
    clearWebSocket () {
      if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
      }
    }
  },
  beforeDestroy() {
    this.clearWebSocket();
  }
};
</script>

<style lang="scss" scoped>
.chat-text {
  height: 160px;
  border-top: solid 1px #dcdee0;
  .el-textarea {
    height: calc(100% - 40px);
    /deep/ textarea {
      padding: 10px;
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
      resize: none;
      color: #000000;
      background-color: transparent;
      font-size: 16px;
      font-family: "Micrsofot Yahei";
    }
  }
  .send-bar {
    line-height: 40px;
    text-align: right;
    padding: 0 20px;
  }
  .el-button--text {
    color: #8e9399;
    font-size: 14px;
  }
}
</style>
