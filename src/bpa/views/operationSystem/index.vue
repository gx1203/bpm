<template>
  <div id="operationSystem">
    <el-row class="header">
      <span class="title">{{ $t("operationSystemManagement") }}</span>
      <!-- <div class="cursor-pointer top_item" @click="close1">
        <i class="el-icon el-icon-switch-button" style="color: #fff" />
        <span>{{ $t("close1") }}</span>
      </div> -->
    </el-row>
    <iframe class="w100  iframeProcess" id="iframeUrlId" :src="iframeSrc"></iframe>
  </div>
</template>

<script>

export default {

  data () {
    return {
      iframeSrc: "",
    }
  },
  created () {
    let self = this;
    // 全屏
    window.onFullScreen = () => {
      if (self.$refs.iFrame.getAttribute("class").indexOf("fullEditor") > -1) {
        self.$refs.iFrame.classList.remove("fullEditor");
      } else {
        self.$refs.iFrame.classList.add("fullEditor");
      }
    };
  },
  computed: {

  },


  mounted () {
    this.iframesrcNmae()
  },
  methods: {
    close1() {
      window.opener = null;
      window.close();
    },
    iframesrcNmae () {
      let username = localStorage.getItem("portalCurrentUserInfo")
        ? JSON.parse(localStorage.getItem("portalCurrentUserInfo")).cnname
        : "";
      this.iframeSrc = `./operationSystem/designer/BaseNewPage.html?id=${process.env.VUE_APP_OPERATION_ID}&listid=${process.env.VUE_APP_OPERATION_LISTID}`;
      console.log(this.iframeSrc);
    }
  }

}
</script>
<style lang="scss" scoped>
#operationSystem {
  width: 100%;
  .header {
    background: #2d42af;
    color: #fff;
    padding: 0 20px;
    line-height: 30px;
    text-align: center;
    .title {
      font-size: 14px;
      font-weight: bold;
    }
    .top_item {
      height: 100%;
      float: right;
      margin-left: 20px;
      &:after {
        content: "";
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
      .el-icon {
        font-size: 17px;
        color: $active-color;
        margin-right: 5px;
      }
    }
    .cursor-pointer {
      cursor: pointer;
    }
  }
  iframe {
    height: calc(100vh - 37px) !important;
  }
}
/*流程设计器全屏*/
.fullEditor {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
.iframeProcess {
  /*height: calc(100% - 46px);*/
  height: calc(100vh - 100px);
}
</style>
