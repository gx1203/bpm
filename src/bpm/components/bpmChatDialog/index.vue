<template>
  <el-dialog
    v-if="dialogVisible"
		ref="chat-dialog"
		class="chat-dialog"
    :visible.sync="dialogVisible"
    width="1000px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div id="chat">
      <div class="sidebar">
        <search @confirm="addTalk" />
        <talk ref="talk" @confirm="handleTalk" />
      </div>
      <div class="main" v-if="talkItem">
        <message ref="message" :talkItem="talkItem" />
        <send :talkItem="talkItem" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Search from "./Search";
import Talk from "./Talk";
import Send from "./Send";
import Message from "./Message";
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("bpmChat");
export default {
  components: {
    Search,
    Talk,
    Send,
    Message
  },
  data() {
    return {
      dialogVisible: false,
      talkItem: {}
    };
  },
  props: {
    value: {
      type: Boolean
    }
  },
  computed: {},
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.$nextTick(() => {
          this.$refs.talk.initWebSocket();
        });
      } else {
        this.setMessageList([]);
        this.setTalkMessage({})
        this.talkItem = {}
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    ...mapMutations(["setMessageList", "setTalkMessage"]),
    addTalk (data) {
      console.log(this.$refs.talk.talkList)
      if (!this.$refs.talk.talkList.map(item => item.id).includes(data.id)) {
        this.$refs.talk.activeId = "";
        this.$refs.talk.getData();
      }
    },
    handleTalk(data) {
      this.talkItem = data;
    }
  }
};
</script>


<style lang="scss" scoped >
.el-dialog__wrapper {
  /deep/ .el-dialog {
    height: 680px;
		margin-top: 5vh !important;
    .el-dialog__header,
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__body {
      height: 100%;
    }
  }
}
#chat {
  overflow: hidden;
  height: 100%;

  .sidebar,
  .main {
    height: 100%;
  }
  .sidebar {
    float: left;
    width: 240px;
    color: #333333;
    background-color: #e6e8eb;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background-color: #dcdee0;
    }
  }
  .main {
		overflow: hidden;
    position: relative;
    background-color: #f2f3f5;
  }
}
</style>
