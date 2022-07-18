/* eslint-disable */
<template>
  <div id="app" class="bpa" :class="themeColor">
    <remote-script v-if="isloadJs" :src="href"></remote-script>
    <router-view />
  </div>
</template>
<script>
import importJs from './utils/importJs'
export default {
  name: "App",
  data() {
    return {
      themeColor: "",
      href: "",
      isloadJs: false
    };
  },
  mounted() {
    this.href =
      window.location.origin +
      window.location.pathname +
      "/nokt/officecontrol/ntkobackground.min.js";
    this.themeColor = this.$store.state.app.themeColor;
    document.getElementsByTagName("body")[0].className = this.themeColor;

    //  this.customThemeColor = this.$store.state.app.customThemeColor;
    //  document.getElementsByTagName('body')[0].style.setProperty('--primary', this.customThemeColor)

    this.$nextTick(() => {
      this.isloadJs = true;
    });
    window.addEventListener(
      "hashchange",
      () => {
        let currentPath = window.location.hash.slice(1);
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath);
        }
      },
      false
    );
  }
};
</script>
<style lang="scss">
html,
body {
  width: 100%;
  min-height: 100vh;
  background: $bc2;
}
#app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  min-width: 1200px;
}
.elTree /deep/ .el-tree-node.is-current > .el-tree-node__content {
  background-color: #eff4f9;
  color: #2d42af;
  font-weight: 600;
}
.elTree .el-tree-node.is-current > .el-tree-node__content {
  background-color: #eff4f9;
  color: #2d42af;
  font-weight: 600;
}
.el-message {
  max-width: 960px;
}
.link {
  color: #327ab7;
  cursor: pointer;
}
.urge {
  color: red;
  cursor: pointer;
}
.textHide {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tooltip {
  opacity: 0.8;
}

.mt-10 {
  margin-top: 10px;
}
.mt-15 {
  margin-top: 15px;
}
.mt-20 {
  margin-top: 20px;
}

.mb-10 {
  margin-bottom: 10px;
}
.mb-15 {
  margin-bottom: 15px;
}
.mb-20 {
  margin-bottom: 20px;
}

.ml-10 {
  margin-left: 10px;
}
.ml-15 {
  margin-left: 15px;
}
.ml-20 {
  margin-left: 20px;
}

.mr-10 {
  margin-right: 10px;
}
.mr-15 {
  margin-right: 15px;
}
.mr-20 {
  margin-right: 20px;
}

// border 1px
.border-1px {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
    box-sizing: border-box;
    border: 0px solid #eee;
  }
}

.border-bottom {
  @extend .border-1px;
  &::before {
    border-bottom-width: 1px;
  }
}

.border-top {
  @extend .border-1px;
  &::before {
    border-top-width: 1px;
  }
}

</style>
