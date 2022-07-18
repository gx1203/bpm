<template>
  <div class="parent-header s-header">
    <el-row>
      <el-col :span="24" style="background: rgba(241, 241, 241, 1)">
        <div class="head_left_top">
          <div class="cursor-pointer top_item Suk" @click="Suk_open">
            <i
              class="el-icon-s-operation"
              style="font-size: 20px; color: #2d42af; margin-top: 5px"
            ></i>
            <span style="margin-left: 3px">{{ $t('navigationmenu') }}</span>
          </div>
        </div>
        <div class="head_right_top">
          <div class="cursor-pointer top_item" @click="logout">
            <i class="el-icon el-icon-switch-button" />
            <span>{{ $t('logout') }}</span>
          </div>
          <div class="top_item" @click="resetDialogFormVisible = true">
            <span class="cursor-pointer">{{ $t('changePassword') }}</span>
          </div>
          <div class="top_item welcome" @click="openMessage">
            <el-badge
              :value="talkUnread"
              style="padding-right: 10px; cursor: pointer"
              type="warning"
            >
              <span>{{ $t('message') }}</span>
            </el-badge>
          </div>
          <div class="top_item welcome" @click="jumpToApproveList">
            <el-badge
              class="approve-badge"
              :value="approveCount"
              style="padding-right: 10px; cursor: pointer"
            >
              <span>{{ $t('welcome2') }}，{{ displayname }}</span>
            </el-badge>
          </div>
          <div class="top_item cursor-pointer">
            <i class="el-icon el-icon-s-home" />
            <a href="http://pal.jiucaiyun.cn/#/home" target="_blank">{{
              $t('ProcessAssetPool')
            }}</a>
          </div>
          <!--          <div class="top_item cursor-pointer" @click="jumpSys">-->
          <!--            <i class="el-icon el-icon-s-home" />-->
          <!--            <span>{{ $t('BPA') }}</span>-->
          <!--          </div>-->
          <!-- <div class="top_item cursor-pointer" @click="jumpOperationSystem">
            <i class="el-icon el-icon-s-home" />
            <span>{{ $t("operationSystemManagement") }}</span>
          </div> -->
        </div>
      </el-col>
    </el-row>
    <el-row class="display-flex nav-wrap">
      <div class="left-logo">
        <img class="logo" :src="logo" alt />
      </div>
      <div class="right-conent">
        <div class="user-bar clear-fix">
          <!--        <img class="logo" :src="logo" alt style="height: 50px">-->
          <!--<p class="user-info" @click="toApproveList">-->
          <p class="user-info">
            <switch-language />
            <!-- <span class="line" />
            <el-badge :value="approveCount">
              <i class="img cursor-pointer2" @click="jumpToApproveList">
                <img :src="userPic" alt>
              </i>
            </el-badge>
            <span @click="resetDialogFormVisible = true">{{ $t("welcome2") }}，{{ displayname }}</span>
            <span class="line" />
            <el-dropdown size="mini" class="system" @command="jump">
              <span class="el-dropdown-link">
                <i class="iconfont icon-qiehuan" style="font-size: 18px;" />
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in options" v-if="item.value !== 0" :key="item.value" :command="item.value">
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span class="line" />
            <span class="system" @click="logout">
              <i class="el-icon-switch-button" style="font-size: 17px;" />{{ $t('exit') }}
            </span> -->
            <!-- <el-dropdown size="mini" class="system" @command="jump2">
              <span class="el-dropdown-link">
                <i class="el-icon-s-operation" />
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="item in options2"
                  :key="item.value"
                  :command="item.value"
                  divided
                >
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </p>
          <!--<p class="system">-->
          <!--<el-select clearable v-model="value2" @change="jump2">-->
          <!--<el-option-->
          <!--v-for="item in options2"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.value"-->
          <!--/>-->
          <!--</el-select>-->
          <!--</p>-->
          <!--<p class="system">-->
          <!--<el-select clearable v-model="value" :popper-append-to-body="false" @change="jump">-->
          <!--<el-option-->
          <!--v-for="item in options"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.name"-->
          <!--/>-->
          <!--</el-select>-->
          <!--</p>-->
        </div>
        <div class="firstMenu">
          <div
            v-show="menuLeftBtnShow"
            class="common leftBtn"
            @click="moveMenu('left')"
          >
            <i class="el-icon-arrow-left" />
          </div>
          <div ref="menupart" class="headerNav menupart">
            <ul class="nav-bar">
              <li
                v-for="(item, index) in tabList"
                :key="index"
                class="tab"
                :class="isActive === item.id ? 'active' : ''"
                @click="clickHandle(item)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
          <!--        <div ref="menupart" class="menupart">-->
          <!--          <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" router>-->
          <!--            <el-menu-item v-for="(item, index) in tabList" :key="item.id" :index="item.url" class="tab" @click="clickHandle2(item,index)">-->
          <!--              <span>{{ item.name }}</span>-->
          <!--            </el-menu-item>-->
          <!--          </el-menu>-->
          <!--        </div>-->
          <div
            v-show="menuRightBtnShow"
            class="common rightBtn"
            @click="moveMenu('right')"
          >
            <i class="el-icon-arrow-right" />
          </div>
        </div>
      </div>
    </el-row>
    <change-password v-model="resetDialogFormVisible" />
    <bpm-chat-dialog v-model="chatDialogVisible" />
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="100%"
      class="dialogbox"
      :show-close="false"
      :modal="false"
      style="margin-top:"
    >
      <div class="mainbox">
        <div class="iptbox" style="width: 100%; text-align: right">
          <el-input
            class="filteript"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
          >
          </el-input>
        </div>

        <el-tree
          class="filter-tree"
          :data="treedata"
          :props="defaultProps"
          :filter-node-method="filterNode"
          default-expand-all
          ref="tree"
          :render-content="rendercontent"
          @node-click="nodeClick"
          @node-expand="handleExpand"
        >
        </el-tree>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import logo from '@/bpm/assets/img/common/logo-white.png'
import userPic from '@/bpm/assets/img/headImg.png'
import { resetInterface } from '@/bpm/api/app'
import { navigationMenu } from '@/bpa/api/common'
import { businessRoutes } from './../../../bpa/router'
import { getCurrentUser } from '@/bpa/api/user'
import { clearCookies } from '@/bpa/utils/common'
import { logout } from '@/bpm/api/app'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('app')
import SwitchLanguage from '@/bpm/components/switchLanguage/SwitchLanguage.vue'
import changePassword from '@/bpm/components/changePassword'
import bpmChatDialog from '@/bpm/components/bpmChatDialog'
const bpmChat = createNamespacedHelpers('bpmChat')
import $ from 'jquery'
export default {
  name: 'AppHeader',
  components: {
    SwitchLanguage,
    changePassword,
    bpmChatDialog
  },
  data() {
    return {
      websocket: null,
      lockReconnect: false, // 是否真正建立连接
      timeout: 28 * 1000, // 30秒一次心跳
      timeoutObj: null, // 心跳心跳倒计时
      serverTimeoutObj: null, // 心跳倒计时
      timeoutnum: null, // 断开 重连倒计时
      filterText: '',
      treelist: '',
      treedata: [],
      defaultProps: {
        children: 'subNodes',
        label: 'name'
      },
      dialogVisible: false,
      logo: logo,
      userPic: userPic,
      searchContent: '',
      businessRoutes: businessRoutes.filter(item => {
        return item.meta.isNav
      }),
      activeMenu: '',
      options: [],
      options2: [
        {
          value: '修改',
          name: this.$t('passwordChange')
        },
        {
          value: '注销',
          name: this.$t('exit')
        }
      ],
      value: '',
      value2: '',
      resetDialogFormVisible: false,
      resepassword: {
        name: ''
      },
      resetRules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        oldpassword: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterOldPassword'),
            trigger: 'blur'
          }
        ],
        newpassword: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterNewPassword'),
            trigger: 'blur'
          }
        ],
        confirmpassword: [
          {
            required: true,
            message: this.$t('placeholderText.pleaseEnterNewPasswordAgain'),
            trigger: 'blur'
          }
        ]
      },
      displayname: '',
      menuLeftBtnShow: false,
      menuRightBtnShow: false,
      chatDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['tabList', 'navRecords', 'approveCount']),
    ...bpmChat.mapGetters(['talkUnread']),
    userInfo() {
      return this.$store.state.basuser.user
    },
    isActive() {
      return this.$store.state.app.activeAppHeader
    },
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  watch: {
    filterText(val) {
      console.log(val)
      this.$refs.tree.filter(val)
    },
    $route: {
      handler(route) {
        if (route.name === 'businessAdminHome') {
          this.setActiveAppHeader(
            this.tabList.find(item => item.url === 'bpmHome').id
          )
        }
        route.matched.forEach(routeItem => {
          this.businessRoutes.forEach(item => {
            if (routeItem.path === item.path) {
              this.activeMenu = item.path
            }
          })
        })
      },
      immediate: true
    },
    tabList: {
      handler: function(val) {
        let width = 0
        this.$nextTick(() => {
          $('.tab').each(function() {
            width +=
              parseFloat($(this).css('width')) +
              parseFloat($(this).css('marginLeft')) +
              parseFloat($(this).css('marginRight'))
          })
          if (width - parseFloat($('.menupart').css('width')) > 0) {
            this.menuLeftBtnShow = false
            this.menuRightBtnShow = true
          } else {
            this.menuLeftBtnShow = false
            this.menuRightBtnShow = false
          }
        })
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getCurrentUser()
    this.gettreelist()
  },
  mounted() {
    this.requireApproveCount()
    this.getNavigationMenu()
    if (this.$store.state.basuser.user.id) {
      this.initWebSocketTalkUnread()
    }
  },
  methods: {
    rendercontent(node, data, store) {
      let className = 'level hover'
      if (data.node.level == 1) {
        return (
          <div
            class="level2 level1"
            style="display:block;font-size:15px;color:#000;font-weight:600;margin:10px 0;"
          >
            <span class="border-left"></span>
            <span style="margin-left:10px">{data.data.name}</span>
          </div>
        )
      } else if (data.node.level == 2) {
        return (
          <div class="level2" style="color:#c1c1c1;margin:0px 0;">
            {data.data.name}
          </div>
        )
      } else if (data.node.level == 3) {
        return (
          <div class={className} style="height:30px">
            <i
              class={'iconfont' + ' ' + data.data.ico}
              style="margin-left:5px;font-size:12px"
            />
            <span>{data.data.name}</span>
          </div>
        )
      }
    },
    Suk_open() {
      this.dialogVisible = !this.dialogVisible
      if (this.dialogVisible == true) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
      }
      setTimeout(() => {
        this.handleExpand()
      }, 50)
    },
    handleExpand() {
      this.$nextTick(() => {
        this.changeTreeClass()
      })
    },
    changeTreeClass() {
      // 找到之前做标记的class
      var classDomList = document.getElementsByClassName('level') // 改变这几个样式
      for (var i = 0; i < classDomList.length; i++) {
        if (classDomList[i].parentNode) {
          classDomList[i].parentNode.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
          classDomList[i].parentNode.style.styleFloat = 'left'
        }
      }
      var classDomList2 = document.getElementsByClassName('level2') // 改变这几个样式
      for (var i = 0; i < classDomList2.length; i++) {
        if (classDomList2[i].parentNode) {
          classDomList2[i].parentNode.style.width = '100%' // 最底层的节点，包括多选框和名字都让他左浮动
          classDomList2[i].parentNode.style.width = '100%'
        }
      }
      var classDomList1 = document.getElementsByClassName('level1') // 改变这几个样式
      for (var i = 0; i < classDomList2.length; i++) {
        if (classDomList1[i].parentNode) {
          classDomList1[i].parentNode.style.background = '#eee' // 最底层的节点，包括多选框和名字都让他左浮动
          classDomList1[i].parentNode.style.background = '#eee'
        }
      }
    },
    openMessage() {
      this.chatDialogVisible = true
    },
    initWebSocketTalkUnread() {
      if ('WebSocket' in window) {
        let that = this
        this.websocket = new WebSocket(
          `${process.env.VUE_APP_SOCKET_HOST_URL}${process.env.VUE_APP_SOCKET_BASE_URL}/ws/talkUnread/${this.$store.state.basuser.user.id}`
        )
        this.websocket.onmessage = function(e) {
          // 数据接收
          if (e.data) {
            if (e.data === 'heartCheck') {
              console.log(e.data)
              that.reset()
              return
            }
            that.setTalkUnread(e.data)
          }
        }
        this.websocket.onopen = function(event) {
          console.log('连接成功', event)
          that.start()
        }
        this.websocket.onerror = function() {
          // this.initWebSocketTalkUnread()
        }
        this.websocket.onclose = function(e) {
          console.log('断开连接', e)
        }
      } else {
        // 浏览器不支持 WebSocket
        alert('您的浏览器不支持 WebSocket!')
      }
    },
    reconnect() {
      //重新连接
      var that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(function() {
        // 新连接
        that.initWebSocketTalkUnread()
        that.lockReconnect = false
      }, 5000)
    },
    reset() {
      //重置心跳
      var that = this
      // 清除时间
      clearTimeout(that.timeoutObj)
      clearTimeout(that.serverTimeoutObj)
      // 重启心跳
      that.start()
    },
    start() {
      // 开启心跳
      var self = this
      self.timeoutObj && clearTimeout(self.timeoutObj)
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
      self.timeoutObj = setTimeout(function() {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        console.log(self.websocket)
        if (self.websocket.readyState === 1) {
          // 如果连接正常
          self.websocket.send('heartCheck')
        } else {
          // 否则重连
          self.reconnect()
        }
      }, self.timeout)
    },
    getQueryString(item) {
      let str = item.split('?')[1]
      let arr1 = str.split('&')
      let obj = {}
      for (let i = 0; i < arr1.length; i++) {
        obj[arr1[i].split('=')[0]] = arr1[i].split('=')[1]
      }
      return obj
    },
    nodeClick(data, node) {
      if (data.subNodes.length <= 0 || !data.subNodes) {
        if (data.url.indexOf('/') != -1) {
          this.$router.push({
            path: data.url
          })
          this.dialogVisible = false
        } else {
          if (data.url.split('?').length > 1) {
            this.$router.push({
              name: data.url.split('?')[0],
              query: this.getQueryString(data.url)
            })
          } else {
            this.$router.push({
              name: data.url
            })
          }
        }
        this.dialogVisible = false
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    gettreelist() {
      let arr = new Array()
      this.treelist = JSON.parse(localStorage.getItem('db')).userInfo.userMenu
      let treelist2 = JSON.parse(localStorage.getItem('bpm_pc_nav_records')).app
        .tabList
      this.treelist.forEach(item => {
        if (item.url == '/knowLedge') {
          item.subNodes.forEach(ele => {
            if (ele.url == '/knowLedge/index') {
              ele.subNodes.forEach(val => {
                if (val.url == '/knowLedge/permission') {
                  val.subNodes = []
                }
              })
            }
          })
        }
      })
      this.treelist.push(...treelist2)
      this.treedata = this.treelist
    },
    ...mapMutations([
      'setNavRecords',
      'setActiveIndex',
      'setTabList',
      'setUserInfo',
      'setApproveCount',
      'setActiveAppHeader'
    ]),
    ...mapActions(['requireApproveCount']),
    ...bpmChat.mapMutations(['setTalkUnread']),
    // ...bpmChat.mapActions(['initWebSocketTalkUnread']),
    getNavigationMenu() {
      navigationMenu().then(res => {
        if (!res) return false
        res.forEach(item => {
          this.options.push({
            // name: item.name == '业务流程分析' ? 'BPA' : 'BPM',
            name: item.name,
            value: Number(item.id)
          })
        })
      })
    },
    getCurrentUser() {
      getCurrentUser().then(res => {
        if (!res) return false
        this.displayname = res.displayname
        this.setUserInfo(res)
      })
    },
    clickHandle(item) {
      // alert('bpm')
      console.log('---------')
      if (item.url === 'analyseWatchCenter' || item.url === 'bpmHome') {
        this.setActiveAppHeader(item.id)
        this.$router.push({ name: item.url }).catch(e => e)
      } else {
        if (item.subNodes.length > 0) {
          if (item.subNodes[0].subNodes.length > 0) {
            if (item.subNodes[0].subNodes[0].url.indexOf('?') === -1) {
              console.log(item.subNodes[0].subNodes[0].url)
              this.$router
                .push({
                  name: item.subNodes[0].subNodes[0].url
                })
                .catch(e => e)
            } else {
              console.log(item.subNodes[0].subNodes[0].url.split('?')[0])
              this.$router
                .push({
                  name: item.subNodes[0].subNodes[0].url.split('?')[0],
                  query: this.getQueryString(item.subNodes[0].subNodes[0].url)
                })
                .catch(e => e)
            }
          }
        } else {
          this.$router.push({ path: item.url })
        }
      }
    },
    // clickHandle2(item) {
    //   console.log(item)
    //   console.log(this.$router);
    //   this.$router.push({ path: item.path }).catch(e => e)
    // },
    toApproveList() {
      this.dialogVisible = true
      // this.$router.push({ name: 'stagingPersonalApproveList' }).catch(e => e)
      // const navRecords = JSON.parse(JSON.stringify(this.navRecords))
      // this.setActiveIndex('stagingPersonalApproveList')
      // if (!navRecords.map(el => el.name).includes(this.$route.name)) {
      //   navRecords.forEach((el, index) => {
      //     el.active = false
      //   })
      //   navRecords
      //     .push({
      //       name: this.$route.name,
      //       title: this.$route.meta.title,
      //       active: true
      //     })
      //     .catch(e => e)
      // } else {
      //   navRecords.forEach((el, index) => {
      //     el.active = false
      //     if (el.name === this.$route.name) {
      //       navRecords[index].active = true
      //     }
      //   })
      // }
      // this.setNavRecords(navRecords)
    },
    openBPA() {
      // window.open(routeData.href, "_blank");
      const a = document.createElement('a')
      // 给创建好的a标签赋值
      a.setAttribute('href', process.env.VUE_APP_BPA_URL)
      // 设置css 隐藏属性
      a.setAttribute('style', 'display:none')
      // 设置 a标签为新窗口打开
      a.setAttribute('target', '_blank')
      // 将设置好的a标签，{{ $t('add') }}到 body 内
      document.body.appendChild(a)
      // 模拟点击
      a.click()
      // 移除a标签
      a.parentNode.removeChild(a)
    },
    logout() {
      this.$confirm(
        this.$t('hintText.areYouSureYouWantToCancel'),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          logout().then(rt => {
            this.$store.dispatch('basuser/saveUser', {})
            // this.setTabList([])
            const language = localStorage.getItem('language')
            localStorage.clear()
            sessionStorage.clear()
            clearCookies()
            localStorage.setItem('language', language)
            this.$router.replace(this.host + '/logout').catch(e => e)
          })
        })
        .catch(() => {})
    },
    jump(value) {
      console.log(value)
      if (value === 0) {
        console.log(1)
        console.log(this.$router)
        this.$router
          .push({ path: '/staging/personal/approveList' })
          .catch(e => e)
      } else if (value === 1) {
        console.log(2)
        console.log(this.$router)
        this.$router.push({ path: '/doorCenter' }).catch(e => e)
      }
    },
    jumpSys() {
      const bpaMenus = JSON.parse(localStorage.getItem('db')).userInfo.userMenu
      const path = bpaMenus[0].url
      const routes = this.$router.resolve({
        path
      })
      window.open(routes.href, '_blank')
    },
    jumpOperationSystem() {
      const { href } = this.$router.resolve({
        path: '/operationSystem'
      })
      window.open(href, '_blank')
    },
    jump2(value) {
      if (value === '修改') {
        this.resetDialogFormVisible = true
      } else if (value === '注销') {
        this.logout()
      }
    },
    jumpToApproveList() {
      // console.log('跳转到审批列表');
      this.$router.push({ name: 'stagingPersonalApproveList' })
    },
    // 向左移动
    moveMenu(type) {
      switch (true) {
        case type === 'left':
          this.$refs.menupart.scrollLeft = 0
          this.menuLeftBtnShow = false
          this.menuRightBtnShow = true
          break
        case type === 'right':
          let width = 0
          $('.tab').each(function() {
            width +=
              parseFloat($(this).css('width')) +
              parseFloat($(this).css('marginLeft')) +
              parseFloat($(this).css('marginRight'))
          })
          this.$refs.menupart.scrollLeft =
            width - parseFloat($('.menupart').css('width'))
          this.menuLeftBtnShow = true
          this.menuRightBtnShow = false
          break
      }
    }
  },
  beforeDestroy() {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
    }
  }
}
</script>

<style>
.s-header .el-dialog__wrapper {
  margin-top: 90px !important;
}
.parent-header .el-dialog {
  margin-top: 0 !important;
}
.parent-header .el-dialog {
  margin: 0 auto;
}
.parent-header::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: transparent;
}

.parent-header::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.parent-header:hover::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 53%, 0.4);
}

.parent-header:hover::-webkit-scrollbar-track {
  background: hsla(0, 0%, 53%, 0.1);
}
</style>
<style type="text/scss" lang="scss" scoped>
.nav-wrap {
  height: 60px;
  align-items: center;
  padding: 0 20px;
}
.head_left_top {
  padding: 0 20px;
  line-height: 30px;
  // &:after {
  //   content: "";
  //   display: block;
  //   clear: both;
  // }
  .top_item {
    height: 100%;
    float: left;
    margin-left: 20px;
    &:after {
      content: '';
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
}
.head_right_top {
  padding: 0 20px;
  line-height: 30px;
  &:after {
    content: '';
    display: block;
    clear: both;
  }
  .top_item {
    height: 100%;
    float: right;
    margin-left: 20px;
    &:after {
      content: '';
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
.el-menu-demo {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
.firstMenu {
  padding: 0 10px;
  margin: 0 50px;
  position: relative;
  overflow: hidden;
  .common {
    position: absolute;
    top: 0;
    width: 30px;
    height: 33px;
    line-height: 33px;
    text-align: center;
    cursor: pointer;
  }
  .leftBtn {
    left: 0;
  }
  .rightBtn {
    right: 5px;
  }
}
.parent-header .menupart {
  overflow-x: hidden;
}
.parent-header {
  position: relative;
  z-index: 3000;
  box-shadow: 0 5px 10px -5px #dfdfdf;
  .left-logo {
    float: left;
    width: 20vw;
    /*min-width: 340px;*/
    /*max-width: 535px;*/
    img {
      width: 100%;
    }
  }
  .right-conent {
    float: left;
    width: calc(100% - 20vw);
    color: #fff;
    .user-bar {
      float: right;
      margin-left: 40px;
      p {
        float: right;
        height: 33px;
        line-height: 33px;
        padding: 0 5px;
        cursor: pointer;
        i {
          margin-right: 6px;
          vertical-align: middle;
        }
      }
      span.line {
        height: 14px;
        border-right: 1px solid #fff;
        margin: 7px 10px 0;
      }
      .logout {
        i {
          font-size: 18px;
          font-weight: 500;
        }
      }
      .user-info {
        font-size: 12px;
        .el-badge {
          margin-right: 8px;
          /deep/ .el-badge__content {
            top: 8px !important;
            background-color: #e60012;
            transform: scale(0.8) translateY(-50%) translateX(100%);
          }
        }
        i.img {
          display: inline-block;
          width: 28px;
          height: 28px;
          margin-right: 0;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
        .cursor-pointer {
          margin-left: 8px;
        }
        .cursor-pointer2 {
          cursor: pointer;
        }
      }
      .search-box {
        /deep/ .el-input {
          .el-input__inner {
            width: 100px;
            background-color: #f2f2f2;
            padding-left: 36px;
            padding-right: 40px;
            border: none;
            border-radius: 14px;
            -webkit-transition: all 0.3s;
            -moz-transition: all 0.3s;
            -ms-transition: all 0.3s;
            -o-transition: all 0.3s;
            transition: all 0.3s;
            &:focus {
              width: 200px;
            }
          }
          .el-input__prefix {
            left: 10px;
            top: 2px;
            i {
              font-size: 22px;
              color: $tc1;
            }
          }
          .el-input__suffix {
            right: 10px;
            color: $tc1;
          }
        }
      }
      /deep/ .el-dropdown {
        height: 28px !important;
        color: #ffffff;
        &:nth-child(2) {
          margin-left: 20px;
        }
        i {
          margin-right: 0;
        }
      }
      /deep/ .el-dropdown:nth-of-type(2) {
        width: 50px !important;
        margin-left: 30px;
      }
      .el-dropdown-link {
        cursor: pointer;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
    }
    .headerNav {
      .nav-bar {
        width: 100%;
        overflow: visible;
        white-space: nowrap;
        .tab {
          display: inline-block;
          height: 31px;
          line-height: 31px;
          color: #fff;
          margin: 0 23px;
          font-size: 15px;
          font-weight: bold;
          border-bottom: 2px solid transparent;
          cursor: pointer;
        }
        .tab.active {
          color: #fff;
          border-color: #fff;
        }
      }
    }
    .system {
      /deep/ .el-input__inner {
        border-radius: 2px;
        border: 1px solid #666;
      }
      /deep/ .el-input__suffix-inner {
        i {
          color: #666;
        }
      }
    }
  }
  /deep/ {
    .el-input__inner {
      // background-color: #0796f9;
    }
  }
}
.el-badge {
  margin-right: 8px;
  /deep/ .el-badge__content {
    top: 8px !important;
    transform: scale(0.8) translateY(-50%) translateX(100%);
  }
}
.approve-badge {
  /deep/ .el-badge__content {
    background-color: #e60012;
  }
}
.el-dropdown-menu {
  .el-dropdown-menu__item {
    white-space: nowrap;
  }
}
.filteript {
  width: 200px;
  // padding-bottom: 10px;
  // position: absolute;
  // z-index: 9;
  // right: 20px;
}
.mainbox /deep/ {
  width: 80%;
  margin: 0 auto;
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #eee !important;
  }
  .el-tree-node__content:hover {
    background-color: rgba(0, 0, 0, 0);
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #eee;
  }
  .el-tree .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    // margin-top: 12px;
  }
  .el-tree .el-icon-caret-right:before {
    content: '';
  }
  .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    content: '';
  }

  .el-tree-node__label {
    width: auto;
    margin-top: 12px;
    float: right;
    font-size: 14px;
    color: #999999;
    line-height: 25px;
    letter-spacing: 1px;
  }
  .el-tree-node {
    margin: 10px 0;
  }
  .el-tree-node__content {
    text-align: center;
    padding: 15px;
  }
}
.header /deep/ {
  .el-dialog .el-dialog__header {
    border-bottom: none;
  }

  .dialogbox {
    top: 90px;

    .el-dialog {
      margin-top: 12vh !important;
      .el-dialog__body {
        padding: 10px 15px;
        //max-height: 450px;
        overflow: none;
        box-sizing: border-box;
      }
    }
  }
}
.hover:hover {
  color: #000;
  &:hover {
    color: #519eff;
  }
}
.dialogbox::-webkit-scrollbar /deep/ {
  /*滚动条整体样式*/
  width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.dialogbox::-webkit-scrollbar-thumb /deep/ {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.dialogbox::-webkit-scrollbar-track /deep/ {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

.header .el-dialog /deep/ {
  margin-top: 12vh !important;
  .el-dialog__body {
    padding: 10px 15px;
    //max-height: 450px;
    overflow: auto;
    box-sizing: border-box;
  }
}

.border-left::before {
  content: '';
  border-left: 4px solid #2d42af;
}

.Suk {
  color: rgb(45, 66, 175);
  display: flex;
}
</style>
