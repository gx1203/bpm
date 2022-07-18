<template>
  <div class="chat-message">
    <div class="message-header">
      <span class="title"
        ><b>{{ talkItem.name }}</b><span v-if="talkMessage.orgInfo">（{{talkMessage.orgInfo}}）</span></span
      >
    </div>
    <el-scrollbar ref="scrollbar" class="message-content">
      <ul>
        <li v-for="(item, index) in messageList" :key="index">
          <p class="time">
            <span>{{ item.sendTimeStr }}</span>
          </p>
          <div class="main" :class="{ self: $store.state.basuser.user.id === item.sendUserId }">
            <div class="text" v-html="item.content"></div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>
<script>
import { getTalkMessage } from "@/bpm/api/bpmHome/bpmChat";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapMutations } = createNamespacedHelpers("bpmChat");
export default {
  data() {
    return {
      upFinished: false,
      messageSize: 20,
      scrollHeight: 0
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
    ...mapGetters(["messageList", "talkMessage"])
  },
  watch: {
    'talkItem.id': {
      handler: function(val) {
        this.setMessageList([])
        this.setTalkMessage({})
        this.upFinished = false
        this.getData('1')
      },
      deep: true
    },
    messageList: {
      handler: function(val) {
        this.$nextTick(() => {
          val.forEach(item => {
            item.content = item.content.replace(/\n/g,"<br/>")
					})
					let scrollTop = this.$refs["scrollbar"].wrap.scrollTop
					let offsetHeight = this.$refs["scrollbar"].wrap.offsetHeight
					let scrollHeight = this.$refs["scrollbar"].wrap.scrollHeight
					if (scrollHeight - scrollTop - offsetHeight < 160) {
            this.$refs["scrollbar"].wrap.scrollTop = this.$refs[
              "scrollbar"
              ].wrap.scrollHeight;
					}
        })
      },
      deep: true
    }
  },
  mounted() {
    this.handleScroll()
	},
  methods: {
    ...mapMutations(["setMessageList", "setTalkMessage"]),
    handleScroll() {
      let scrollbarEl = this.$refs["scrollbar"].wrap
      scrollbarEl.onscroll = () => {
				if (this.messageList.length > 0 && scrollbarEl.scrollTop === 0) {
				  this.scrollHeight = scrollbarEl.scrollHeight
				  if (!this.upFinished) {
            this.getData()
					}
				}
      }
    },
    getData (type) {
      getTalkMessage({
        id: this.talkItem.id,
        messageSize: this.messageSize,
        preMessageId: this.messageList.length > 0 ? this.messageList[0].id : ''
      }).then(rt => {
        if (rt.data) {
					if (this.talkMessage.id !== rt.data.id) {
            this.setTalkMessage(rt.data)
					}
          let messageList = JSON.parse(JSON.stringify(this.messageList))
					if (rt.data.messageList && rt.data.messageList.length > 0) {
            messageList = [].concat(rt.data.messageList, messageList)
            this.setMessageList(messageList)
            if (rt.data.messageList.length < this.messageSize) {
              this.upFinished = true;
            }
          }
					if (type === '1') {
            this.$nextTick(() => {
              this.$refs["scrollbar"].wrap.scrollTop = this.$refs[
                "scrollbar"
                ].wrap.scrollHeight;
            });
					} else {
            this.$nextTick(() => {
              this.$refs["scrollbar"].wrap.scrollTop = this.$refs[
                "scrollbar"
                ].wrap.scrollHeight - this.scrollHeight
            });
					}
				}
      });
    }
	}
};
</script>

<style lang="scss" scoped>
.chat-message {
  height: calc(100% - 160px);
  overflow: hidden;
  .message-header {
    height: 55px;
    padding: 16px;
    border-bottom: 1px solid #dcdee0;
    box-sizing: border-box;
    .title {
			b {
				font-size: 18px;
				color: #000000;
			}
			span {
				font-size: 14px;
				color: #999999;
			}
    }
  }
  .message-content {
    height: calc(100% - 55px);
    overflow-y: auto;
    ul {
      padding: 10px 20px;
      box-sizing: border-box;
			li {
				margin-bottom: 15px;
				.time {
					margin: 7px 0;
					text-align: center;

					> span {
						display: inline-block;
						padding: 0 18px;
						font-size: 12px;
						color: #fff;
						border-radius: 2px;
						background-color: #dcdcdc;
					}
				}
				.text {
					display: inline-block;
					position: relative;
					padding: 0 10px;
					max-width: calc(100% - 40px);
					min-height: 30px;
					line-height: 30px;
					font-size: 14px;
					text-align: left;
					color: #000000;
					background-color: #dee0e3;
					border-radius: 3px;
					word-break: break-all;

					&:before {
						content: " ";
						position: absolute;
						top: 9px;
						right: 100%;
						border: 6px solid transparent;
						border-right-color: #dee0e3;
					}
				}
				.self {
					text-align: right;

					.text {
						background-color: #cce4fc;

						&:before {
							right: inherit;
							left: 100%;
							border-right-color: transparent;
							/*#C6DEFF*/
							border-left-color: #cce4fc;
						}
					}
				}
			}
    }
  }
  .el-scrollbar {
    /deep/ .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    /deep/ .is-vertical {
      .el-scrollbar__thumb {
        background-color: #989ba3;
      }
    }
  }
}
</style>
