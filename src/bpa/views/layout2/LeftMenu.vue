<template>
  <!-- 旧 -->
  <!-- <el-scrollbar class="left_menu">
    <i :class="['isCollpase', isCollpase ? 'el-icon-s-unfold' : 'el-icon-s-fold']" @click="handlerCollpase" />
    <div v-show="!isCollpase">
      <el-menu :default-active="$route.path" :collapse="isCollpase" unique-opened router>
        <div v-for="item in menuList" :key="item.id" class="menu_item">
          <el-submenu v-if="!!item.subNodes && item.subNodes.length" :index="item.url">
            <template slot="title">
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="child in item.subNodes" :key="child.id" :index="child.url">
              <i class="iconfont third_iconfont" :class="child.ico" v-if="child.ico" />
              <span class="thirdMenu overflow-els-ver" :title="child.name">{{ child.name }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="item.url">
            <i class="iconfont" :class="item.ico" v-if="item.ico" />
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </div>
  </el-scrollbar> -->
  <!-- 新 -->
  <div class="left-aside">
    <h3 class="tool-bal">
      <span @click="isCollpase = !isCollpase">
        <i :class="isCollpase ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        {{isCollpase ? $t("unfold") : $t("putAway")}}
      </span>
      <!-- <span class="setting" @click="handlerCollpase" v-if="!isCollpase">
        <i class="el-icon-setting"></i>
      </span> -->
    </h3>
    <el-menu v-if="curModule && curModule.subNodes" class="left-menu" :class="[isCollpase ? 'left-menuCol' : 'left-menu']" unique-opened
      :default-active="$route.path" :collapse-transition="false" router>
      <div v-for="item in curModule.subNodes" :key="item.id">
        <el-submenu v-if="!!item.subNodes && item.subNodes.length" :index="item.url" :collapse-transition="false">
          <template slot="title">
            <span slot="title">{{isCollpase ? item.name.substring(0, 2) : item.name}}</span>
          </template>
          <el-menu-item v-for="(sub, index1) in item.subNodes" :title="sub.name" :key="index1" :index="sub.url">
            <template slot="title">
              <i class="iconfont" :class="sub.ico"></i>
              <span slot="title" v-if="!isCollpase">{{sub.name}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="item.url">
          <i class="iconfont" :class="item.ico" v-if="item.ico" />
          <span slot="title" v-if="!isCollpase">{{isCollpase ? item.name.substring(0, 2) : item.name}}</span>
        </el-menu-item>
      </div> 
    </el-menu>
    
  </div>
</template>

<script>
  import {businessRoutes} from '../../router'
  import {getUserNav} from '@/bpa/api/common'
  import {generateMenu} from '@/bpa/utils/i18n'
  import {createNamespacedHelpers} from 'vuex'

  const userInfo = createNamespacedHelpers('userInfo')

export default {
  data () {
    return {
      isCollpase: false,
      defaultActive: '',
      menuList: [],
      currentRoute: '',
      activeIndex: ''
    }
  },
  computed: {
    ...userInfo.mapState(['userMenu']),
    ...userInfo.mapGetters(['curModule']),
    currentParentRoutePath () {
      return this.$route.path.match(/^\/(\w+)\//)[1]
    }
  },
  watch: {
    // $route: {
    //   handler: function (route) {
    //     console.log(this.userMenu)
    //     this.currentRoute = route.path
    //     this.menuList = this.userMenu.filter((item, index) => {
    //       const str = item.url.substring(item.url.lastIndexOf('/') + 1)
    //       return str === this.currentParentRoutePath
    //     })[0].subNodes
    //   },
    //   immediate: true
    // }
  },
  mounted () {
    // this.routesFilter()
  },
  methods: {
    generateMenu,
    handlerCollpase () {
      this.isCollpase = !this.isCollpase
      console.log(this.isCollpase)
    },
    routesFilter () {
      let busRoutes
      getUserNav(1).then(res => {
        if (!res) return false
        busRoutes = res
        console.log(busRoutes)
        busRoutes.forEach(item => {
          businessRoutes.forEach(item2 => {
            if (item.url === item2.path) {
              item.meta = item2.meta
            }
            if (
              item.subNodes &&
              item2.children &&
              item.subNodes.length > 0 &&
              item2.children.length > 0
            ) {
              item.subNodes.forEach(itemChild => {
                item2.children.forEach(itemChild2 => {
                  if (itemChild.url === itemChild2.path) {
                    itemChild.meta = itemChild2.meta
                  }
                  if (
                    itemChild.subNodes &&
                    itemChild2.children &&
                    itemChild.subNodes.length > 0 &&
                    itemChild2.children.length > 0
                  ) {
                    itemChild.subNodes.forEach(itemChild_child => {
                      itemChild2.children.forEach(itemChild_child2 => {
                        if (itemChild_child.url === itemChild_child2.path) {
                          itemChild_child.meta = itemChild_child2.meta
                        }
                      })
                    })
                  }
                })
              })
            }
          })
        })
        this.menuList = busRoutes.filter((item, index) => {
          const str = item.url.substring(item.url.lastIndexOf('/') + 1)
          return str === this.currentParentRoutePath
        })[0].subNodes
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.left-aside {
  min-width: 40px;
  .tool-bal {
    padding: 6px 0;
    background-color: #ffffff;
    border-bottom: 1px solid #f5f5f5;
    overflow: hidden;
    font-weight: normal;
    .el-dropdown {
      width: 100%;
    }
    span {
      float: right;
      text-align: center;
      color: #ffffff;
      padding-left: 10px;
      border-bottom-left-radius: 20px;
      border-top-left-radius: 20px;
      padding-right: 8px;
      height: 28px;
      line-height: 28px !important;
      background-color: $active-color;
      cursor: pointer;
    }
    span.setting {
      float: left;
      border-radius: 0;
      padding-right: 10px;
      border-bottom-right-radius: 20px;
      border-top-right-radius: 20px;
      padding-left: 8px;
    }
    i {
      font-size: 22px;
      position: relative;
      top: 3px;
    }
  }
}
.left-menu {
  height: calc(100% - 41px);
  padding-top: 12px;
  border: none !important;
  box-sizing: border-box;
  // overflow-y: auto;
  h3 {
    text-align: right;
    padding: 2px 6px;
    border-bottom: 1px solid #f5f5f5;
    span {
      display: inline-block;
      width: 28px;
      height: 28px;
      line-height: 28px;
      font-size: 20px;
      text-align: center;
      cursor: pointer;
    }
  }
  .el-submenu__title {
    // white-space: normal;
    display: flex;
    align-items: center;
    line-height: 20px !important;
  }
  .el-menu-item {
    white-space: normal;
    display: flex;
    align-items: center;
    height: auto !important;
    min-height: 39px !important;
    line-height: 20px !important;
    padding: 0 0 0 20px !important;
    position: relative;
    font-size: 15px;
    /*&:before {*/
    /*content: '';*/
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*width: 2px;*/
    /*background-color: $active-color;*/
    /*display: none;*/
    /*}*/
    /deep/ .el-tooltip {
      padding: 0 16px !important;
    }
    i {
      font-size: 18px;
      margin-right: 6px;
      color: $tc1;
    }
  }
  .el-menu-item.is-active,
  .el-menu-item:hover {
    color: $active-color;
    background-color: transparent;
    i {
      color: $active-color;
    }
    /*&:before {*/
    /*display: block;*/
    /*}*/
  }
}
.left-menu.el-menu--collapse {
  width: 110px;
}
.left-menu::-webkit-scrollbar {
  width: 3px;
  background-color: transparent;
}

.left-menu::-webkit-scrollbar-track {
  width: 3px;
  background-color: transparent;
}

.left-menu::-webkit-scrollbar-thumb {
  border-radius: 3px;
  width: 0;
  background-color: #aaaaaa;
}
.left-menu:not(.el-menu--collapse) {
  transition: all 0.2s;
  width: 200px;
  .el-submenu__title {
    padding: 0 !important;
    span {
      // margin-left: 40px;
    }
    i {
      margin-left: 12px;
    }
  }
  .el-menu {
    margin-left: 12px;
  }
}
.left-menuCol:not(.el-menu--collapse) {
  transition: all 0.2s;
  width: 72px;
  .el-submenu__title {
    padding: 0 10px 0 29px !important;
    height: 48px !important;
    span {
      margin-left: 0;
    }
    i {
      margin-left: 0;
    }
  }
  .el-menu {
    margin-left: 0;
  }
}
/deep/ .el-submenu__title {
  white-space: unset;
  display: flex;
  align-items: center;
  line-height: 20px !important;
  padding: 0 19px 0 35px !important;
  height: 50px !important;
  i {
    left: 10px;
    right: inherit;
    color: #2d42af !important;
    font-weight: 600;
    font-size: 16px;
  }
  span {
    font-weight: 700;
    color: #000;
    font-family: Arial, 微软雅黑, "Microsoft Sans Serif";
    font-size: 14px;
  }
}
/deep/ .el-menu {
  .menu_item {
    .el-submenu {
      span {
        line-height: 16px;
        min-width: 56px;
      }
      .el-menu-item {
        white-space: normal;
        line-height: 20px !important;
        display: flex;
        align-items: center;
        padding: 0 10px 0 30px !important;
        min-width: 177.6px !important;
        min-height: 39px !important;
        height: auto !important;
        max-height: inherit !important;
        &:hover {
          background-color: transparent;
          color: #2d42af;
          i {
            color: #2d42af;
          }
        }
        .third_iconfont {
          font-size: 18px;
          &:hover {
            color: #2d42af;
          }
        }
        .thirdMenu {
          font-size: 15px;
          line-height: 22px !important;
          max-width: 125px;
          overflow: auto;
        }
      }
    }
  }
}
/deep/ .el-submenu {
  .el-menu-item {
    min-height: 39px !important;
    max-height: 65px !important;
  }
  .el-submenu__title {
    .el-submenu__icon-arrow {
      transform: rotateZ(-90deg);
    }
  }
}
/deep/ .el-submenu.is-opened {
  .el-submenu__title {
    .el-submenu__icon-arrow {
      transform: rotateZ(0deg) !important;
    }
  }
}
</style>
