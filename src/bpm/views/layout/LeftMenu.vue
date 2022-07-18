<template>
  <div class="left-aside" :title="activeIndex" :key="key">
    <h3 class="tool-bal">
      <span @click="isCollapse = !isCollapse">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        {{ isCollapse ? $t('unfold') : $t('putAway') }}
      </span>
      <!-- <span class="setting" @click="handleConfig" v-if="!isCollapse">
        <i class="el-icon-setting"></i>
      </span> -->
    </h3>
    <el-menu
      v-if="curModule && curModule.subNodes"
      class="left-menu"
      :class="[isCollapse ? 'left-menuCol' : 'left-menu']"
      unique-opened
      :default-active="activeIndex"
      :collapse-transition="false"
    >
      <el-submenu
        v-for="(item, index) in curModule.subNodes"
        :key="index"
        :index="item.name"
        :title="item.name"
        :collapse-transition="false"
      >
        <template slot="title">
          <span slot="title">{{
            isCollapse ? item.name.substring(0, 2) : item.name
          }}</span>
        </template>
        <el-menu-item
          v-for="(sub, index1) in item.subNodes"
          :title="sub.name"
          :key="index1"
          :index="sub.name"
          @click="toPath(sub, item)"
        >
          <template slot="title">
            <i class="iconfont" :class="sub.ico"></i>
            <span slot="title" v-if="!isCollapse">{{ sub.name }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <drawer v-model="recordsVisible" />
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import drawer from '@/bpm/components/drawer'
const { mapGetters, mapMutations } = createNamespacedHelpers('app')

export default {
  name: 'LeftMenu',
  components: {
    drawer
  },
  data() {
    return {
      isCollapse: false,
      recordsVisible: false,
      pathUrl: {},
      routeUrl: '',
      routeName: ''
    }
  },
  computed: {
    ...mapGetters(['tabList', 'navRecords', 'activeIndex', 'curModule']),
    userInfo() {
      return this.$store.state.basuser.user
    },
    // curModule () {
    //   const arr = this.$route.matched;
    //   console.log(arr)
    //   console.log(this.tabList.find(item => item.url === arr[1].name))
    //   return this.tabList.find(item => item.url === arr[1].name);
    // },
    keepAliveList() {
      return this.$store.state.app.keepAliveList
    },
    key() {
      return this.curModule.id
    }
  },
  watch: {
    curModule: {
      handler: function(val) {
        if (val.subNodes) {
          if (this.$route.name === 'projectApproval') {
            this.routeUrl = this.$route.path + '?' + this.convertObj(this.$route.query)
            this.routeName = this.$route.name + '?' + this.convertObj(this.$route.query)
          } else {
            this.routeUrl = this.$route.path
            this.routeName = this.$route.name
          }
          console.log(this.curModule, 'curModule')
          this.pathUrl = {}
          this.getPathUrl(this.curModule)
          console.log(this.pathUrl)
          this.navRecordsData(this.pathUrl)
          this.configRoute()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.setKeepAliveLists(this.navRecords.map(item => item.name).join())
  },
  methods: {
    getPathUrl(curModule) { // 查询当前URL的数据
      if ((curModule.url === this.routeUrl || curModule.url === this.routeName) && (!curModule.subNodes || curModule.subNodes.length === 0)) {
        this.pathUrl = curModule
      } else if (!!curModule.subNodes && curModule.subNodes.length > 0) {
        curModule.subNodes.forEach(ele => {
          this.getPathUrl(ele)
        })
      }
    },
    getPath(list, subNodes) {
      for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i]
        subNodes.push(item)
        if (item.subNodes && item.subNodes.length > 0) {
          this.getPath(item.subNodes, subNodes)
        }
      }
    },
    convertObj(data) {
      var _result = []
      for (var key in data) {
        var value = data[key]
        if (value.constructor == Array) {
          value.forEach(function(_value) {
            _result.push(key + '=' + _value)
          })
        } else {
          _result.push(key + '=' + value)
        }
      }
      return _result.join('&')
    },
    configRoute() {
      if (!this.curModule || this.curModule.subNodes.length === 0) return
      this.curModule.subNodes.forEach(item => {
        item.subNodes.forEach(val => {
          if (val.name === this.activeIndex) {
            this.setActiveAppHeader(item.pid)
          }
        })
      })
    },
    ...mapMutations([
      'setNavRecords',
      'setActiveIndex',
      'setActiveAppHeader',
      'setKeepAliveLists'
    ]),
    getQueryString(item) {
      let str = item.split('?')[1]
      let arr1 = str.split('&')
      let obj = {}
      for (let i = 0; i < arr1.length; i++) {
        obj[arr1[i].split('=')[0]] = arr1[i].split('=')[1]
      }
      return obj
    },
    toPath(item, val) {
      // console.log(item)
      // console.log(this.$route.path)
      if (this.keepAliveList.split(',').indexOf(item.url) !== -1) {
        // console.log('1111')
        //如果当前点击的路由已经在缓存列表中，则先清除缓存列表，再添加；
        this.resetKeepAive(this.$route.path, this.keepAliveList) //删除缓存路由
        if (this.$route.path !== item.url) {
          if (item.url.indexOf('?') === -1) {
            this.$router.push({
              name: item.url
            })
            // console.log('222222')
            this.navRecordsData(item)
          } else {
            if (window.location.href.indexOf(item.url) === -1) {
              this.$router.push({
                name: item.url.split('?')[0],
                query: this.getQueryString(item.url)
              })
              this.navRecordsData(item)
            }
          }

          // this.$router.push({
          //   name: item.url
          // });
        }
      } else {
        console.log('22222')
        this.setKeepAliveLists(this.keepAliveList + ',' + item.url)
        if (this.$route.path !== item.url) {
          if (item.url.indexOf('?') === -1) {
            this.$router.push({
              name: item.url
            })
            this.navRecordsData(item)
          } else {
            if (window.location.href.indexOf(item.url) === -1) {
              this.$router.push({
                name: item.url.split('?')[0],
                query: this.getQueryString(item.url)
              })
              this.navRecordsData(item)
            }
          }
          // this.$router.push({
          //   name: item.url
          // });
        }
      }
    },
    // 更新要缓存的路由列表
    resetKeepAive(name, cacheList) {
      const conf = this.keepAliveList
      let arr = cacheList.split(',')
      if (name && typeof name === 'string') {
        let i = arr.indexOf(name)
        if (i > -1) {
          arr.splice(i, 1)
          this.setKeepAliveLists(conf)
        }
      }
    },
    navRecordsData(item) {
      console.log(item)
      this.setActiveIndex(item.name)
      let navRecords = JSON.parse(JSON.stringify(this.navRecords))
      if (!navRecords.map(el => el.name).includes(item.url)) {
        navRecords.forEach((el, index) => {
          el.active = false
        })
        navRecords.push({
          name: item.url,
          title: item.name,
          active: true
        })
      } else {
        navRecords.forEach((el, index) => {
          el.active = false
          if (el.name === item.url) {
            navRecords[index].active = true
          }
        })
      }
      this.setNavRecords(navRecords)
    },
    handleConfig(type) {
      this.recordsVisible = true
    }
  }
}
</script>

<style type="text/scss" lang="scss">
.downInfo {
  .el-dropdown-menu__item {
    height: 32px;
    line-height: 32px;
    width: 160px;
    font-size: 14px;
    color: $tc1;
  }
}
$border-color: #ebeef5;
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

.left-menu:not(.el-menu--collapse) {
  transition: all 0.2s;
  width: 200px;
  .el-submenu__title {
    padding: 0 !important;
    span {
      margin-left: 40px;
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

.left-menu.el-menu--collapse {
  width: 110px;
}

.el-submenu {
  &__title {
    // height: auto !important;
    min-height: 48px !important;
    line-height: 48px !important;
    font-size: 15px;
    padding: 0 19px 0 49px !important;
    font-weight: bold;
    i {
      left: 8px;
      right: inherit;
      color: $active-color !important;
      font-weight: 600;
      font-size: 16px;
    }
  }
  .el-menu-item {
    min-width: 150px !important;
  }
}
.el-submenu > .el-submenu__title .el-submenu__icon-arrow {
  transform: rotateZ(-90deg);
}
.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  transform: rotateZ(0deg) !important;
}

.left-menu {
  height: calc(100% - 41px);
  padding-top: 12px;
  border: none !important;
  overflow-y: auto;
  box-sizing: border-box;
  h3 {
    text-align: right;
    padding: 2px 6px;
    border-bottom: 1px solid $border-color;
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
    white-space: normal;
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
</style>
