<template>
  <div id="layout-full">
    <!-- 头部展示 -->
    <div>
      <div class="topMenu">
        <div class="bgImg">
          <img src="../../assets/img/analyseWatchCenter/bg.png" alt >
        </div>
        <!-- 横向菜单 -->
        <el-menu :default-active="activeIndex" class="el-menu-demo center" mode="horizontal" router>
          <el-menu-item
            v-for="(item, i) in AnalyseWatchCenterRouter.children"
            :key="item.code"
            :index="item.custom"
            @click="handleSelect(i)"
          >
            <span v-if="item.custom=='/analyseWatchCenter/bpm/instance'" class="titleBorder">\</span>
            <el-tooltip v-if="item.custom=='/analyseWatchCenter/bpa/Analysis'" content="BPA中流程设计与阅读的情况" class="item" effect="dark" placement="top-end">
              <span> {{ item.name }}</span>
            </el-tooltip>
            <el-tooltip v-else content="FBC流程运行的情况" class="item" effect="dark" placement="top-end">
              <span> {{ item.name }}</span>
            </el-tooltip>
          </el-menu-item>
        </el-menu>
        <div class="out">
          <a href="#/staging/personal/approveList">退出</a>
        </div>
      </div>
      <!-- 纵向菜单 -->
      <div v-if="childRoute.length > 0" style="margin-left: 30px;margin-bottom: 30px">
        <el-menu
          :default-active="activeSubIndex"
          class="el-menu-vertical-demo"
          mode="horizontal"
          active-text-color="#00F6FF"
          router
        >
          <el-menu-item
            v-for="item in childRoute"
            :key="item.code"
            :index="item.custom"
            style="margin-right: 20px;"
            class="notching">
            <!-- <i class="el-icon-menu" /> -->
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
        <!-- <el-tooltip class="item" effect="dark" content="导航" placement="top-end">
          <i class="el-icon-menu" style="font-size: 20px" @click="toggle" />
        </el-tooltip> -->
      </div>
      <!-- <transition name="fade">
        <el-menu
          v-if="showNavbar"
          default-active="/analyseWatchCenter/bpm/instance"
          class="el-menu-vertical-demo"
          mode="horizontal"
          router
        >
          <el-menu-item v-for="item in childRoute" :key="item.code" :index="item.custom">
            <i class="el-icon-menu" />
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
      </transition> -->
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
      activeSubIndex: '/analyseWatchCenter/bpm/instance',
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
  created() {
  },
  mounted() {

    this.getAnalyseWatchCenterRoute()
    this.getRelashNavList()
  },
  methods: {
    getAnalyseWatchCenterRoute() {
      for (let i = 0; i < this.getUserMenu.length; i++) {
        if (this.getUserMenu[i].custom.includes('analyseWatchCenter')) {
          this.AnalyseWatchCenterRouter = this.getUserMenu[i]
          return
        }
      }
    },
    // 兼容处理F5的处理，暂时没有更好的方法
    getRelashNavList() {
      const active_url = this.$route.fullPath
      console.log(active_url)
      if (active_url.includes('/bpm/')) {
        this.activeIndex = '/analyseWatchCenter/bpm/instance'
        this.activeSubIndex = active_url
        for (let i = 0; i < this.AnalyseWatchCenterRouter.children.length; i++) {
          if (this.AnalyseWatchCenterRouter.children[i].custom.includes('/bpm/')) {
            this.handleSelect(i)
          }
        }
      }
      return false
    },
    handleSelect(index) {
      console.log(this.AnalyseWatchCenterRouter.children)
      this.childRoute = this.AnalyseWatchCenterRouter.children[index].children
      console.log(this.childRoute)
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
<style lang="scss">
@import "@/assets/styles/analyseWatchCenter.scss";
#layout-full{
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 220px !important
  }
}
</style>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#layout-full {
  background: url("../../assets/img/analyseWatchCenter/bgAll.png") no-repeat;
  background-size: cover;
  height: 100%;
  padding: 30px 0;
  box-sizing: border-box;
  .el-menu.el-menu--horizontal.center {
    background: transparent;
    text-align: center;
    margin: 0 auto;
  }
  .el-menu--horizontal .is-active span{
    color: #00f6ff;
  }
  .el-icon-menu {
    position: relative;
    color: white;
  }
  .el-menu-item {
    font-size: 16px;
    color: #ffffff;
  }
  .topMenu {
    margin-bottom: 30px;
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
      background: url("../../assets/img/analyseWatchCenter/out.png") no-repeat;
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
    margin-right: 25px;
  }
  .view_wrap {
    width: 94%;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .el-menu {
    padding-top: 10px;
    // background: rgba(29, 77, 125, 0.9);
    background: transparent;
    color: #ffffff;
  }
  .el-menu-vertical-demo {
    // position: absolute;
    // z-index: 60;
    // left: 50px;
    // top: 60px;
  }
  .el-menu-item .is-active span{
    color: #00f6ff !important;
  }
  .el-menu-item:focus,
  .el-menu-item:hover {
    background: linear-gradient(135deg, transparent 8px, #153578 0) top left,
        linear-gradient(-135deg, transparent 8px, #153578 0) top right,
        linear-gradient(-45deg, transparent 8px, #153578 0) bottom right,
        linear-gradient(45deg, transparent 8px, #153578 0) bottom left;
    background-size: 51% 50%;
    background-repeat: no-repeat;
    color: #00f6ff;
  }
}
// .sub_nav{
//   border: 1px solid #fff;
//   border-radius: 10px;
//   background-color: #3455A5;
// }
.notching {
    background:
      linear-gradient(135deg, transparent 8px, #153578 0) top left,
      linear-gradient(-135deg, transparent 8px, #153578 0) top right,
      linear-gradient(-45deg, transparent 8px, #153578 0) bottom right,
      linear-gradient(45deg, transparent 8px, #153578 0) bottom left;
    background-size: 51% 50%;
    background-repeat: no-repeat;
}
</style>
