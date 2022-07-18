<template>
  <div id="main">
    <!-- 头部展示 -->
    <div>
      <div class="topMenu">
        <div class="bgImg">
          <img src="../../assets/img/qietu/bg.png" alt />
        </div>
        <!-- 横向菜单 -->
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          router
        >
          <el-menu-item
            v-for="(item, i) in AnalyseWatchCenterRouter"
            :key="item.id"
            :index="item.url"
            @click="handleSelect(i)"
          >
            {{ item.name }}
            <!-- <span v-if="item.url!='/analyseWatchCenter/databaseList'" class="titleBorder">\</span> -->
          </el-menu-item>
        </el-menu>
        <div class="out">
          <!-- <a href="#/doorCenter">退出</a> -->
          <el-button @click="exit">{{ $t('return') }}</el-button>
        </div>
        <!-- <div class="dropdownNav">
          <p class="currentNav" @click.stop="menuShow = !menuShow">
            {{ curPlatform.name }} <i class="iconfont icon-web-icon-" />
          </p>
          <transition name="el-fade-in-linear">
            <div v-show="menuShow" class="transition-box">
              <platform-menu is-login popover-placement="left-start" popover-class="headerNavPopover" @fnJumpSuccessful="fnJumpSuccessful" />
            </div>
          </transition>
        </div> -->
      </div>
      <!-- 纵向菜单 -->
      <div
        v-if="childRoute && childRoute.length > 0"
        style="margin-left: 30px;margin-bottom: 30px"
      >
        <el-menu
          :default-active="activeSubIndex"
          class="el-menu-vertical-demo"
          style="text-align:left"
          mode="horizontal"
          active-text-color="#fff"
          router
        >
          <el-menu-item
            v-for="item in childRoute"
            :key="item.id"
            :index="item.url"
            style="margin-right: 20px;"
            class="notching"
          >
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </el-menu>
        <!-- <el-tooltip class="item" effect="dark" content="导航" placement="top-end">
          <i class="el-icon-menu" style="font-size: 20px" @click="toggle" />
        </el-tooltip>-->
      </div>
    </div>
    <div class="view_wrap">
      <router-view :key="key" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import PlatformMenu from '@/bas/components/PlatformMenu'
import { mapState, createNamespacedHelpers } from 'vuex'

const userInfo = createNamespacedHelpers('userInfo')
const headetStore = createNamespacedHelpers('header')
export default {
  components: {
    PlatformMenu
  },
  data() {
    return {
      AnalyseWatchCenterRouter: [],
      // activeIndex: '/analyseWatchCenter/bpa/Analysis',
      // activeSubIndex: '/analyseWatchCenter/bpm/instance',
      // activeIndex: this.$route.path,
      activeSubIndex: '/analyseWatchCenter/bpm/instance',
      childRoute: [],
      showNavbar: false,
      menuShow: false,
      currentMenu: []
    }
  },
  computed: {
    ...userInfo.mapGetters(['getUserMenu']),
    ...headetStore.mapGetters(['curPlatform']),
    key() {
      return this.$route.fullPath
    },
    activeIndex() {
      return this.$route.path
    },
    currentParentRoutePath() {
      return this.$route.path.split('/').length - 1
    },
    ...mapState({
      userMenu: state => state.userInfo.userMenu
    })
    // activeSubIndex () {
    //   return this.$route.path
    // }
  },
  watch: {
    $route: {
      handler(route) {
        for (let i = 0, len = this.userMenu.length; i < len; i++) {
          const item = this.userMenu[i]
          const subNodes = [{
            url: item.url
          }]
          this.getPath(item.subNodes, subNodes)
          if (subNodes.map(el => el.url && el.url.split('?')[0]).includes(route.fullPath)) {
            this.setCurPlatform(item)
          }
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
    this.childRoute = []
    if (this.currentParentRoutePath >= 4) {
      this.activeIndex = this.$route.path.slice(
        0,
        this.$route.path.lastIndexOf('/')
      )
    }
    this.getAnalyseWatchCenterRoute()
    this.getRelashNavList()
    console.log(this.key, this.activeIndex)
    let that = this
    $('body').click(function(e) {
      if ($(e.target).parents('.dropdownNav').length === 0) {
        that.menuShow = false
      }
    })
  },
  methods: {
    ...headetStore.mapMutations(['setCurPlatform']),
    getRelashNavList() {
      const active_url = this.$route.fullPath
      if (active_url.includes('/bpm/')) {
        // this.activeIndex = '/analyseWatchCenter/bpm/instance'
        if (this.currentParentRoutePath >= 4) {
          this.activeSubIndex = this.$route.path.slice(
            0,
            this.$route.path.lastIndexOf('/')
          )
        } else {
          this.activeSubIndex = this.$route.path
        }
        console.log(this.AnalyseWatchCenterRouter)
        if (!this.AnalyseWatchCenterRouter.children) {
          return
        }
        for (
          let i = 0;
          i < this.AnalyseWatchCenterRouter.children.length;
          i++
        ) {
          if (
            this.AnalyseWatchCenterRouter.children[i].custom.includes('/bpm/')
          ) {
            this.handleSelect(i)
          }
        }
      }
      return false
    },
    /*处理刷新后，子路由菜单消失问题*/
    afterRefreshPager() {
      let showIndex = 0
      let resDo = this.AnalyseWatchCenterRouter.some((item, index) => {
        if (item.subNodes.length > 0) {
          let childDo = item.subNodes.some(citem => {
            return citem.url === this.activeIndex
          })
          if (childDo) {
            showIndex = index
          }
          return childDo
        }
        return false
      })
      if (resDo) {
        this.childRoute = this.AnalyseWatchCenterRouter[showIndex].subNodes
      }
    },
    getAnalyseWatchCenterRoute() {
      for (let i = 0; i < this.getUserMenu.length; i++) {
        if (this.getUserMenu[i].url.includes('analyseWatchCenter')) {
          this.AnalyseWatchCenterRouter = this.getUserMenu[i].subNodes
          console.log(this.AnalyseWatchCenterRouter)
          this.childRoute = this.AnalyseWatchCenterRouter[0].subNodes
          this.afterRefreshPager()
          return
        }
      }
    },
    handleSelect(index) {
      this.childRoute = this.AnalyseWatchCenterRouter[index].subNodes
      if (this.childRoute.length > 0) {
        this.activeSubIndex = this.childRoute[0].url
      }
      console.log(this.AnalyseWatchCenterRouter[index], this.childRoute)
    },
    toggle() {
      if (this.showNavbar) {
        this.showNavbar = false
        return
      }
      this.showNavbar = true
    },
    exit() {
      this.$router.push({
        path: '/doorCenter'
      })
    },
    fnJumpSuccessful(data) {
      this.menuShow = false
      let route = this.AnalyseWatchCenterRouter.find(item => item.url === data.url)
      if (route) this.childRoute = route.subNodes
    },
    getCurrentMenu(list) {
      list.forEach(item => {
        if (item.subNodes && item.subNodes.length > 0) {
          this.getCurrentMenu(item.subNodes)
        }
        if (item.url) {
          if (this.$route.path === item.url) {
            this.currentMenu.push(item)
          }
        }
      })
    },
    getPath(list, subNodes) {
      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i]
        subNodes.push(item)
        if (item.subNodes && item.subNodes.length > 0) {
          this.getPath(item.subNodes, subNodes)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
 {
  opacity: 0;
}

#main {
  background: url('../../assets/img/qietu/beijing.png') no-repeat;
  background-size: cover;
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

    &.is-active {
      color: #00f6ff !important;
      border-bottom: none !important;

      border-bottom: 2px solid #00f6ff !important;
    }
  }

  /deep/ .topMenu .el-menu-item .is-active span {
    color: #fff !important;
    background-color: #00f6ff !important;
  }

  .topMenu {
    margin-bottom: 15px;
    position: relative;

    .bgImg {
      width: 811px;
      position: absolute;
      right: 0;
      left: 0;
      margin: 0 auto;

      img {
        width: 100%;
        height: 60px;
      }
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
      background: url('../../assets/img/qietu/out.png') no-repeat;
      background-size: cover;
      top: 10px;
      position: absolute;
      right: 30px;

      button {
        width: 80px;
        height: 30px;
        color: #ffffff;
        background-color: transparent;
        border: none;
      }
    }
  }

  .titleBorder {
    color: #3455a5;
    font-size: 30px;
    margin-left: 30px;
  }

  .view_wrap {
    width: 94%;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0 auto;
    // height: 100vh;
    // min-height: 100vh;
  }

  .el-menu {
    padding-top: 10px;
    background: rgba(29, 77, 125, 0.9);
    color: #ffffff;
  }

  .el-menu-vertical-demo {
    // .el-menu-item {
    //   background: url("../../assets/img/qietu/out.png") no-repeat;
    // }
  }

  .el-menu-item .is-active {
    color: #00f6ff !important;
  }

  .el-menu-item:focus,
  .el-menu-item:hover {
    // background: #1d4d7d;
    color: #00f6ff !important;
    background: none;
  }

  .notching {
    // background:
    //   linear-gradient(135deg, transparent 8px, #153578 0) top left,
    //   linear-gradient(-135deg, transparent 8px, #153578 0) top right,
    //   linear-gradient(-45deg, transparent 8px, #153578 0) bottom right,
    //   linear-gradient(45deg, transparent 8px, #153578 0) bottom left;
    background-size: 51% 50%;
    background-repeat: no-repeat;
  }
}

.custom-4ba2ef .el-menu--horizontal .is-active {
  background: url('../../assets/img/header-bg.png') no-repeat !important;
  background-size: cover !important;
}

.custom-4ba2ef .el-menu--horizontal .is-active span {
  // color: #00f6ff !important;
  // border-bottom:2px solid #00f6ff!important;
  color: #fff !important;
  border-bottom: 2px solid #00f6ff !important;
}

.dropdownNav {
  margin-top: 30px;
  position: absolute;
  right: 26px;
  top: -20px;
  z-index: 10;
  .currentNav {
    width: 130px;
    height: 26px;
    line-height: 26px;
    padding: 0 10px;
    color: $active-color;
    font-size: 14px;
    cursor: pointer;
    font-weight: 700;
    border: 1px solid #fff;
    background-color: #ffffff;
    border-radius: 4px;
    text-align: center;
    i {
      vertical-align: middle;
      font-size: 13px;
    }
  }
  /deep/ .el-input {
    input {
      height: 32px;
    }
  }
  /deep/ .transition-box {
    position: absolute;
    top: 35px;
    right: 0;
    width: 200px;
    height: 415px;
    padding: 10px;
    background-color: #dde4ef;
    box-shadow: -3px 3px 10px #cccccc;
    .platform-menu {
      .el-menu-item {
        margin-bottom: 10px;
        .menu-item-content {
          padding-top: 6px;
          padding-bottom: 6px;
        }
        .left-img {
          width: 40px;
        }
        .right-content {
          margin-top: 4px;
          h3 {
            margin-bottom: 6px;
            font-size: 13px;
          }
          p {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.headerNavPopover {
  left: auto !important;
  right: 253px !important;
  transform: translate(14px, 0);
}
</style>
