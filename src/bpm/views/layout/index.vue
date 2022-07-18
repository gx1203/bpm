<template>
  <div class="app-content display-flex">
    <mid-bread-crumb />
    <right-float />
    <left-menu />
    <el-main class="main-content">
      <app-main />
    </el-main>
  </div>
</template>

<script>
import LeftMenu from './LeftMenu'
import AppMain from './AppMain'
import NavHeader from './NavHeader'

export default {
  components: {
    LeftMenu,
    AppMain,
    NavHeader
  }
}
</script>

<style lang="scss" scoped>
.nav-header {
  padding: 0;
  height: 40px;
  background: $bc1;
}
.app-content {
  box-sizing: border-box;
  padding-top: 44px;
  overflow: hidden;
  background-color: #f8f8f8;
  height: calc(100vh - 50px);
  box-sizing: border-box;
  .main-content {
    padding: 0;
    margin-left: 10px;
    flex: 1;
    overflow-x: hidden;
    height: calc(100% - 10px);
    background-color: #ffffff;
    > div {
      height: 100%;
      > .el-card {
        box-shadow: 0 0 10px #ccc;
      }
    }
  }
}
</style>
