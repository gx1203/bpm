<template>
  <div id="main">
    <!-- 头部展示 -->
    <div>
      <div class="topMenu">
        <div class="bgImg">
          <img src="../../assets/img/qietu/bg.png" alt >
        </div>
        <!-- 横向菜单 -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
          <el-menu-item
            v-for="(item, i) in AnalyseWatchCenterRouter.children"
            :key="item.code"
            :index="item.custom"
            @click="handleSelect(i)"
          >
            {{ item.name }}
            <span v-if="item.name=='流程分析'" class="titleBorder">\</span>
          </el-menu-item>
        </el-menu>
        <div class="out">
          <a href="#/doorCenter">退出</a>
        </div>
      </div>
      <!-- 纵向菜单 -->
      <div v-if="childRoute.length > 0">
        <i class="el-icon-menu" @click="toggle" />
      </div>
      <transition name="fade">
        <el-menu
          v-if="showNavbar"
          default-active="/analyseWatchCenter/bpaPostDetails"
          class="el-menu-vertical-demo"
          router
        >
          <el-menu-item v-for="item in childRoute" :key="item.code" :index="item.custom">
            <i class="el-icon-menu" />
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </transition>
    </div>
    <div class="view_wrap">
      <router-view :key="key" />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const userInfo = createNamespacedHelpers('userInfo')
export default {
  components: {},
  data() {
    return {
      AnalyseWatchCenterRouter: [],
      activeIndex: '/analyseWatchCenter/bpa/Analysis',
      childRoute: [],
      showNavbar: false
    }
  },
  computed: {
    ...userInfo.mapGetters(['getUserMenu']),
    key() {
      return this.$route.fullPath
    }
  },
  created() {},
  mounted() {
    console.log(this.AnalyseWatchCenterRouter.children)
    this.getAnalyseWatchCenterRoute()
  },
  methods: {
    getAnalyseWatchCenterRoute() {
      console.log(this.getUserMenu)
      for (let i = 0; i < this.getUserMenu.length; i++) {
        if (this.getUserMenu[i].custom.includes('analyseWatchCenter')) {
          this.AnalyseWatchCenterRouter = this.getUserMenu[i]
          this.childRoute = this.AnalyseWatchCenterRouter.children[1].children
          console.log(this.AnalyseWatchCenterRouter.children[1].children)
          console.log(this.childRoute)
          return
        }
      }
    },
    handleSelect(index) {
      this.$router.push({path: '/analyseWatchCenter/bpm/instance'})
    },
    toggle() {
      if (this.showNavbar) {
        this.showNavbar = false
        return
      }
      this.showNavbar = true
    }
  }
}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#main {
  background: url("../../assets/img/qietu/bgAll.png") no-repeat;
  background-size: cover;
  height: 100%;
  padding: 30px 0;
  box-sizing: border-box;
  .el-menu.el-menu--horizontal {
    background: transparent;
    text-align: center;
    margin: 0 auto;
  }
  .el-icon-menu {
    position: relative;
    color: white;
  }
  .el-menu-item {
    font-size: 16px;
    color: #ffffff;
  }
  /deep/ .topMenu  .el-menu-item .is-active{
    color: #00f6ff;
  }
  .topMenu {
    margin-bottom: 15px;
    position: relative;
    .bgImg {
      width: 616px;
      position: absolute;
      right: 0;
      left: 0;
      margin: 0 auto;
    }
    .el-menu-item:focus,
    .el-menu-item:hover {
      background: none;
      color: none;
    }
    .out {
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: url("../../assets/img/qietu/out.png") no-repeat;
      background-size: cover;
      top: 10px;
      position: absolute;
      right: 30px;
      a {
        color: #ffffff;
      }
    }
  }
  .titleBorder {
    color: #3455A5;
    font-size: 30px;
    margin-left: 30px;
  }
  .view_wrap {
    width: 94%;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .el-menu {
    padding-top: 10px;
    background: rgba(29, 77, 125, 0.9);
    color: #ffffff;
  }
  .el-menu-vertical-demo {
    position: absolute;
    z-index: 60;
    left: 20px;
    top: 60px;
  }
  .el-menu-item .is-active {
    color: #00f6ff !important;
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
    background: #1d4d7d;
    color: #00f6ff;
  }
}
</style>
