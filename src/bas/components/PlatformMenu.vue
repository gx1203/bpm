<template>
  <div class="platform-menu">
    <el-scrollbar class="menu-scrollbar">
      <el-menu class="el-menu-demo">
        <el-menu-item
          v-for="(item, index) in navList"
          :key="item.id"
          :index="item.url"
          :disabled="!isLogin || !navPath.includes(item.url)"
          class="tab"
        >
          <el-popover
            v-model="item.popoverShow"
            :placement="popoverPlacement"
            trigger="hover"
            :popper-class="'login-menu-popper ' + popoverClass"
            :visible-arrow="false"
            :close-delay="10"
          >
            <ul v-if="navSubNodes.length > 0" :style="{ width: (navSubNodes.length > 5 ? 5 : navSubNodes.length) * 90 + 'px' }">
              <li
                v-for="(sub, i) in navSubNodes"
                :key="sub.id"
                :index="sub.url"
                :title="sub.name"
                :style="{ background: colorList[i % 8] }"
                :class="!navPath.includes(sub.url.split('?')[0]) ? 'is-disabled' : ''"
                @click="navPath.includes(sub.url.split('?')[0]) ? toPath(sub, item) : ''"
              >
                <i class="iconfont" :class="sub.ico" />
                <p>{{ sub.name }}</p>
              </li>
            </ul>
            <div
              slot="reference"
              class="menu-item-content"
              @mouseenter="!isLogin ? '' : hoverHandle(item, index)"
              @click="!isLogin || !navPath.includes(item.url) ? '' : clickHandle(item, index)"
            >
              <p class="left-img">
                <img :src="platformImg[index % 5]" alt="">
              </p>
              <div class="right-content">
                <h3>{{ item.name }}</h3>
                <p :title="textList[index % 6]">
                  {{ textList[index % 6] }}
                </p>
              </div>
            </div>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import platform1 from '@/assets/img/platform1.png'
import platform2 from '@/assets/img/platform2.png'
import platform3 from '@/assets/img/platform3.png'
import platform4 from '@/assets/img/platform4.png'
import platform5 from '@/assets/img/platform5.png'
import { mapState, createNamespacedHelpers } from 'vuex'
const BASUSER = createNamespacedHelpers('basuser')
const APP = createNamespacedHelpers('app')
import {
  getNavigations
} from '@/bpm/api/configManage/navConfig'
export default {
  name: 'PlatformMenu',
  props: {
    isLogin: {
      type: Boolean,
      default: false
    },
    popoverPlacement: {
      type: String,
      default: ''
    },
    popoverClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      platformImg: [platform1, platform2, platform3, platform4, platform5],
      colorList: [
        '#0078D7',
        '#2A569F',
        '#6A55BC',
        '#2A569F',
        '#2A569F',
        '#DF783B',
        '#0078D7',
        '#008272'
      ],
      textList: [
        '管理要素的设计、修订和发布',
        '管理要素已发布业务的展示',
        '流程的发起与审批',
        '流程的落地配置及模块开发',
        '系统的组织、菜单、权限等配置',
        '管理要素发布情况和运行情况'
      ],
      navList: [],
      navSubNodes: [],
      popoverShow: true
    }
  },
  computed: {
    ...BASUSER.mapGetters(['user']),
    ...mapState({
      navPath: state => {
        return [
          ...state.userInfo.navPath,
          ...state.app.navPath
        ]
      }
    })
  },
  mounted() {
    this.navSubNodes = []
    getNavigations('1').then(rt => {
      this.navList = rt.data || []
    }).catch(() => {})
  },
  methods: {
    ...APP.mapMutations([
      'setActiveIndex'
    ]),
    clickHandle(item) {
      if (item.url.includes('/')) {
        this.$router.push({
          path: item.url
        })
        this.setActiveIndex(item.name)
        this.$emit('fnJumpSuccessful', item)
        item.popoverShow = false
      }
    },
    hoverHandle(item) {
      this.navSubNodes = []
      if (!this.navPath.includes(item.url)) return
      getNavigations(item.id).then(rt => {
        const list = rt.data || []
        this.navSubNodes = list.filter(val => this.navPath.includes(val.url.split('?')[0]))
      }).catch(() => {})
    },
    toPath(sub, item) {
      getNavigations(sub.id).then(rt => {
        const list = rt.data || []
        // const curRoute = list.length === 0 ? sub : list[0]
        const validMune = list.filter(val => this.navPath.includes(val.url.split('?')[0]))
        const curRoute = validMune.length === 0 ? sub : validMune[0]
        if (curRoute.url.indexOf('?') === -1) {
          this.$router.push({
            name: curRoute.url
          })
        } else {
          if (window.location.href.indexOf(curRoute.url) === -1) {
            this.$router.push({
              name: curRoute.url.split('?')[0],
              query: this.getQueryString(curRoute.url)
            })
          }
        }
        console.log(curRoute)
        this.setActiveIndex(curRoute.name)
        this.$emit('fnJumpSuccessful', curRoute)
        item.popoverShow = false
      }).catch(() => {})
    },
    getQueryString(item) {
      const str = item.split('?')[1]
      const arr1 = str.split('&')
      const obj = {}
      for (let i = 0; i < arr1.length; i++) {
        obj[arr1[i].split('=')[0]] = arr1[i].split('=')[1]
      }
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.platform-menu {
  height: 100%;
  /deep/ .menu-scrollbar {
    height: 100%;
    .el-scrollbar__wrap {
      height: 100%;
      padding: 0 !important;
      overflow: auto;
    }
    .el-scrollbar__bar.is-horizontal {
      display: none;
    }
  }
  /deep/ .el-menu {
    width: 100%;
    border: none;
    background: transparent;
    .el-menu-item {
      padding: 0 !important;
      height: auto;
      line-height: normal;
      border-top: 3px solid transparent;
      border-radius: 3px;
      margin-bottom: 16px;
      background: #ffffff !important;
      &:last-child {
        margin-bottom: 0 !important;
      }
      .menu-item-content {
        padding: 10px 20px;
        overflow: hidden;
      }
      .left-img {
        float: left;
        width: 60px;
        margin-right: 12px;
        img {
          width: 100%;
        }
      }
      .right-content {
        margin-top: 8px;
        overflow: hidden;
        h3 {
          margin-bottom: 10px;
          font-size: 18px;
        }
        p {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .menu-collapse {
        position: absolute;
        top: 0;
        left: 100%;
      }
    }
    .el-menu-item:not(.is-disabled):hover,
    .el-menu-item:not(.is-disabled):focus,
    .el-menu-item.is-active {
      color: $active-color;
      border-top-color: $active-color;
    }
    .el-menu-item.is-disabled {
      opacity: 0.7;
      background-color: #f5f5f5 !important;
    }
  }
}
</style>
<style lang="scss">
.login-menu-popper {
  min-width: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  transform: translate(-8px, 0);
  ul {
    width: 400px;
    padding: 5px;
    overflow: hidden;
    font-size: 12px;
    color: #ffffff;
    box-sizing: content-box;
    li {
      float: left;
      margin: 5px;
      width: 80px;
      text-align: center;
      background: #0078d7;
      padding: 12px 4px;
      border-radius: 6px;
      box-sizing: border-box;
      cursor: pointer;
          box-shadow: -2px 2px 5px #999;
      i {
        display: inline-block;
        height: 30px;
        margin: 0;
        font-size: 24px;
        vertical-align: middle;
      }
      p {
        margin-top: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    li.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
