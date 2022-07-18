<template>
  <div class="chat-talk" v-menus>
    <el-scrollbar>
      <ul class="talk-list">
        <li
          v-for="(item, index) in talkList"
          :key="index"
          :class="{ active: activeId === item.id }"
          @click="handleTalk(item)"
          @contextmenu.prevent="rightEvent(item, index)"
        >
					<div class="talk-content">
						<p class="name">{{ item.name }}</p>
						<p class="time">{{ item.sendTimeStr }}</p>
					</div>
					<el-badge :max="99" v-if="item.unreadNum && item.unreadNum !== '0'" :value="item.unreadNum || 0" />
        </li>
      </ul>
    </el-scrollbar>
    <ul ref="chatcontextmenu" class="chat-contextmenu" :style="{'left': menuLeft, 'top': menuTop}" v-show="menuShow">
      <li @click="clearTalk">删除</li>
    </ul>
  </div>
</template>
<script>
  import {clearTalk, queryTalk} from "@/bpm/api/bpmHome/bpmChat";

  export default {
  data() {
    return {
      websocket: null,
      lockReconnect: false, // 是否真正建立连接
      timeout: 28*1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null, // 断开 重连倒计时
      activeId: "",
      talkList: [],
      menuHeight: 0,
      menuShow: true,
      menuLeft: '100000px',
      menuTop: '100000px',
      rightClickData: {},
      rightClickIndex: 0
    };
  },
  directives: {
    menus: {
      inserted: function(el, binding, vnode) {
        // 获取vue实例对象
        let vm = vnode.context;
        let showFlag = true;
        vnode = vnode.elm;
        // 阻止默认浏览器的右键菜单
        el.oncontextmenu = event => {
          event.preventDefault();
        };
        el.onmouseup = event => {
          if (event.button === 2 && vm.talkList.length > 0) {
            setTimeout(() => {
              vm.menuShow = true;
              showFlag = false;
              let realTop = vm.getElementToPageTop(vnode);
              let realLeft = vm.getElementToPageLeft(vnode);
              let dialogScrollTop = document.getElementsByClassName('chat-dialog')[0].scrollTop
              vm.menuLeft = event.pageX - realLeft + 5 + 'px'
              if (vm.talkList.length < 4) {
                vm.menuTop = event.pageY - realTop + dialogScrollTop + 5 + 'px'
							} else {
                if (vm.talkList.length - vm.rightClickIndex > 3) {
                  vm.menuTop = event.pageY - realTop + dialogScrollTop + 5 + 'px'
                } else {
                  vm.menuTop = event.pageY - realTop + dialogScrollTop - vm.menuHeight - 5 + 'px'
                }
							}
						}, 1)
          }
        };
      }
    }
  },
  mounted() {
    this.menuHeight = this.$refs.chatcontextmenu.offsetHeight
    document.addEventListener("click", e => {
      this.menuShow = false;
    });
    this.lockReconnect = false
    this.getData();
  },
  methods: {
    rightEvent(data, index) {
      this.rightClickData = data;
      this.rightClickIndex = index;
    },
    getElementToPageTop(el) {
      if (el.offsetParent) {
        return this.getElementToPageTop(el.offsetParent) + el.offsetTop;
      }
      return el.offsetTop;
    },
    getElementToPageLeft(el) {
      if (el.offsetParent) {
        return this.getElementToPageLeft(el.offsetParent) + el.offsetLeft;
      }
      return el.offsetLeft;
    },
    clearTalk () {
      clearTalk(this.rightClickData.id).then(rt => {
        if (rt.status === "200") {
          // if (this.rightClickData.id === this.activeId) {
          //   this.activeId = "";
          // }
          // this.getData();
        }
      });
    },
    getData () {
      queryTalk({
        pageNum: 1,
        pageSize: 100000,
        talkMode: 'single' // single:单人：many:多人
      }).then(rt => {
        if (rt.data) {
          this.talkList = rt.data.list || [];
          if (this.talkList.length > 0 && !this.activeId) {
            this.handleTalk(this.talkList[0]);
          }
          if (this.talkList.length === 0) {
            this.handleTalk(null);
					}
        }
      });
    },
    handleTalk (item) {
      if (item) {
        this.$set(item, 'unreadNum', 0)
			}
      this.activeId = item ? item.id : '';
      this.$emit("confirm", item);
    },
    initWebSocket () {
      if ("WebSocket" in window) {
        this.websocket = new WebSocket(
          `${process.env.VUE_APP_SOCKET_HOST_URL}${process.env.VUE_APP_SOCKET_BASE_URL}/ws/talkList/${this.$store.state.basuser.user.id}`
        );
        this.websocket.onmessage = this.websocketMessage;
        this.websocket.onopen = this.websocketOpen;
        this.websocket.onclose = this.websocketClose;
      } else {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
      }
    },
    websocketOpen(event) {
      console.log('会话连接成功', event)
      this.start();
		},
    websocketMessage (e) {
      // 数据接收
      if (e.data) {
        if (e.data === 'heartCheck') {
          console.log(e.data)
					this.reset()
          return
        }
        let data = JSON.parse(e.data)
        console.log(data)
				if (Object.prototype.toString.call(data) === '[object Object]') {
				  let datadata = data.data
					if (data.operate && Object.prototype.toString.call(datadata) === '[object Object]') {
            if (data.operate === 'sendUnread') {
              for (let key in datadata) {
                let talkItem = this.talkList.find(item => item.id === key)
                if (talkItem) {
                  this.$set(talkItem, 'unreadNum', datadata[key].num)
                  this.$set(talkItem, 'sendTimeStr', datadata[key].sendTimeStr)
                }
              }
              if (data.talkId && this.talkList.map(item => item.id).includes(data.talkId)) {
                let talkIndex = this.talkList.findIndex(item => item.id === data.talkId)
                let talkItem = this.talkList.find(item => item.id === data.talkId)
                if (talkIndex >= 0) {
                  this.talkList.splice(talkIndex, 1)
                  this.talkList.unshift(talkItem)
                }
							}
            }
            if (data.operate === 'clearTalk') {
              if (this.rightClickData.id === this.activeId) {
                this.activeId = "";
              }
              let talkIndex = this.talkList.findIndex(item => item.id === datadata.id)
              if (talkIndex >= 0) {
                this.talkList.splice(talkIndex, 1)
              }
              if (this.talkList.length > 0 && !this.activeId) {
                this.handleTalk(this.talkList[0]);
              }
              if (this.talkList.length === 0) {
                this.handleTalk(null);
              }
            }
					} else {
            if (data.id && this.talkList.map(item => item.id).includes(data.id)) {
              let talkIndex = this.talkList.findIndex(item => item.id === data.id)
              if (talkIndex >= 0) {
                this.talkList.splice(talkIndex, 1)
              }
            }
            if (data.bpmTalkUserList && data.bpmTalkUserList.length > 0) {
              let name = data.bpmTalkUserList.filter(item => item.userId !== this.$store.state.basuser.user.id).map(item => item.userName).join()
              this.$set(data, 'name', name)
            }
            this.talkList.unshift(data)
					}
				}
      }
    },
    websocketClose (e) {
      console.log("会话断开连接", e);
    },
    reconnect () { //重新连接
      var that = this;
      if(that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        // 新连接
        that.initWebSocket();
        that.lockReconnect = false;
      },5000);
    },
    reset () { // 重置心跳
      var that = this;
      // 清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      // 重启心跳
      that.start();
    },
    start () { // 开启心跳
      var self = this;
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
      self.timeoutObj = setTimeout(function() {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        console.log(self.websocket)
        if (self.websocket.readyState === 1) { // 如果连接正常
          self.websocket.send("heartCheck");
        } else { // 否则重连
          self.reconnect();
        }
      }, self.timeout)
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
  beforeDestroy () {
    this.clearWebSocket();
  }
};
</script>

<style lang="scss" scoped>
.chat-talk {
  height: calc(100% - 55px);
  position: relative;
  .el-scrollbar {
    height: 100%;
    overflow-y: auto;
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    /deep/ .is-vertical {
      .el-scrollbar__thumb {
        background-color: #989ba3;
      }
    }
  }
  .talk-list {
    li {
			overflow: hidden;
      padding: 10px 15px;
      border-bottom: 1px solid #dadcdf;
      cursor: pointer;
      transition: background-color 0.1s;

      &:hover {
        background-color: #d7d9db;
      }
      &.active {
        background-color: #c3c5c7;
      }
    }
    .talk-content {
      float: left;
      color: #000000;
			width: calc(100% - 40px);
			.name {
				font-size: 13px;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.time {
				font-size: 12px;
				color: #999999;
			}
    }
		.el-badge {
			float: right;
			/deep/ .el-badge__content {
				border: none;
			}
		}
  }
}
.chat-contextmenu {
  margin: 0;
  background: #fff;
  width: 130px;
  z-index: 100;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  &:before {
    content: "";
    position: absolute;
    left: 6px;
    top: -12px;
  }
  &:after {
    content: "";
    position: absolute;
    left: 6px;
    top: -11px;
  }
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
