<template>
  <!-- <div class="header parent-header"> -->
  <div
    :class="{
      headers: !this.$route.query.theProcessIs,
      onlyClose: this.$route.query.theProcessIs
    }"
    class="header parent-header"
  >
    <div
      style="color: #2d42af;background: grba(0,0,0,0)"
      v-if="this.$route.query.theProcessIs"
    >
      <div class="head_right_top">
        <div class="cursor-pointer top_item" @click="close1">
          <i class="el-icon el-icon-switch-button" style="color: #2d42af" />
          <span>{{ $t('close1') }}</span>
        </div>
      </div>
    </div>

    <div v-else>
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
            <div class="top_item cursor-pointer" @click="jumpSys">
              <i class="el-icon el-icon-s-home" />
              <span>{{ $t('BPM') }}</span>
            </div>
            <!-- <div class="top_item cursor-pointer" @click="jumpOperationSystem">
              <i class="el-icon el-icon-s-home" />
              <span>{{ $t("operationSystemManagement") }}</span>
            </div>
            <div class="top_item cursor-pointer" @click="jumpTheProcessIsv">
              <i class="el-icon el-icon-s-home" />
              <span>{{ $t('Businessprocessdesign')}}</span>
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
            <p class="user-info">
              <switch-language />
              <!-- <span class="line" />
            <el-badge :value="approveCount">
              <i class="img cursor-pointer2" @click="jumpToApproveList">
                <img :src="userPic" alt>
              </i>
            </el-badge> -->
              <!-- <span @click="resetDialogFormVisible = true">{{ $t("welcome2") }}，{{ displayname }}</span>
            <span class="line" />
            <el-dropdown size="mini" @command="jump">
              <span class="el-dropdown-link">
                <i class="iconfont icon-qiehuan" style="font-size: 18px;" />
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in options" v-if="item.value !== 1" :key="item.value" :command="item.value">
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
              <!-- <span class="line" />
            <span class="system" @click="logout">
              <i class="el-icon-switch-button" style="font-size: 17px;" />{{ $t('exit') }}
            </span> -->
              <!-- <el-dropdown size="mini" class="system" @command="jump2">
              <span class="el-dropdown-link">
                <i class="el-icon-switch-button" />
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in options2" :key="item.value" :command="item.value" divided>
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            </p>
            <!-- <div class="globalSearch">
              <i class="el-icon-search" @click="toGlobalSearch"></i>
              <el-input
                v-model="searchVal"
                @keyup.enter.native="toGlobalSearch"
                :placeholder="$t('placeholderText.pleaseEnterSearchContent')"
              ></el-input>
            </div> -->
          </div>
          <div class="firstMenu">
            <div
              v-show="menuLeftBtnShow"
              class="common leftBtn"
              @click="moveMenu('left')"
            >
              <i class="el-icon-arrow-left" />
            </div>
            <div ref="menupart" class="menupart">
              <el-menu
                :default-active="activeMenu"
                class="el-menu-demo"
                mode="horizontal"
                router
              >
                <el-menu-item
                  v-for="(item, index) in userMenu"
                  :key="item.id"
                  :index="item.url"
                  class="tab"
                  @click="clickHandle2(item, index)"
                >
                  <span>{{ item.name }}</span>
                </el-menu-item>
              </el-menu>
            </div>
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
    </div>

    <change-password v-model="resetDialogFormVisible" />
    <bpm-chat-dialog v-model="chatDialogVisible" />
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="100%"
      height="100%"
      class="dialogbox"
      :show-close="false"
      :modal="false"
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
import { businessRoutes } from '../router'
import { generateMenu } from '@/bpa/utils/i18n'
import { createNamespacedHelpers } from 'vuex'
import { clearCookies } from '@/bpa/utils/common'
import { navigationMenu } from '@/bpa/api/common'
import { getApproveCount } from '@/bpm/api/staging/personal/approve_list'
import userPic from '@/bpm/assets/img/headImg.png'
import logo from '@/bpm/assets/img/common/logo-blue.png'
import systemPic from '@/assets/img/common/systemSwitch.png'
import { Base64 } from '@/utils/common'

import { querylink } from '@/bpa/api/settings/resetPassword'
import { logout } from '@/bpm/api/app'
import { getCurrentUser } from '@/bpa/api/user'
const userInfo = createNamespacedHelpers('userInfo')
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
      searchVal: '',
      logo: logo,
      tableList: [],
      lang: '中',
      businessRoutes: businessRoutes.filter(item => {
        return item.meta.isNav
      }),
      inputAnimation: false,
      activeMenu: '',
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
      indexActive: -1,
      value: '',
      options: [],
      value2: '',
      options2: [
        {
          value: this.$t('modify'),
          name: this.$t('passwordChange')
        },
        {
          value: this.$t('exit'),
          name: this.$t('exit')
        }
      ],
      isact: '',
      menuList: [],
      userPic: userPic,
      systemPic: systemPic,
      displayname: '',
      passwordChange: this.$t('passwordChange'),
      account: this.$t('account'),
      oldPassword: this.$t('oldPassword'),
      newPassword: this.$t('newPassword'),
      comfirmPassword: this.$t('comfirmPassword'),
      businessProcessAnalysis: this.$t('businessProcessAnalysis'),
      menuLeftBtnShow: true,
      menuRightBtnShow: false,
      scrollNum: 0,
      chatDialogVisible: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    $route: {
      handler(route) {
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
    userMenu: {
      handler: function(val) {
        let width = 0
        this.$nextTick(() => {
          $('.el-menu-item').each(function() {
            width += parseFloat($(this).css('width'))
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
  computed: {
    ...mapGetters(['tabList', 'navRecords', 'approveCount']),
    ...bpmChat.mapGetters(['talkUnread']),
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    href() {
      return location.origin + '/#/processModelCenter/processDesignCenter'
    },
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    ...userInfo.mapState(['userMenu'])
  },
  created() {
    this.getCurrentUser()
    this.gettreelist()
    // this.getUserMenu()
  },
  mounted() {
    this.getdata()
    this.getNavigationMenu()
    this.requireApproveCount()
    if (this.$store.state.basuser.user.id) {
      this.initWebSocketTalkUnread()
    }
    // this.requireMenu()
    // this.menuList = localStorage.getItem(Base64.)
  },
  methods: {
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
    Suk_open() {
      this.dialogVisible = !this.dialogVisible
      if (this.dialogVisible == true) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
      }
      setTimeout(() => {
        this.handleExpand()
      }, 500)
    },
    handleExpand() {
      this.$nextTick(() => {
        this.changeTreeClass()
      })
    },
    getQueryString(item) {
      const str = item.split('?')[1]
      const arr1 = str.split('&')
      const obj = {}
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
      // if (node.level == 3) {

      // }
    },
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
    changeTreeClass() {
      // 找到之前做标记的class
      var classDomList = document.getElementsByClassName('level') // 改变这几个样式
      for (var i = 0; i < classDomList.length; i++) {
        classDomList[i].parentNode.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
        classDomList[i].parentNode.style.styleFloat = 'left'
      }
      var classDomList2 = document.getElementsByClassName('level2') // 改变这几个样式
      for (var i = 0; i < classDomList2.length; i++) {
        classDomList2[i].parentNode.style.width = '100%' // 最底层的节点，包括多选框和名字都让他左浮动
        classDomList2[i].parentNode.style.width = '100%'
      }
      var classDomList1 = document.getElementsByClassName('level1') // 改变这几个样式
      for (var i = 0; i < classDomList2.length; i++) {
        classDomList1[i].parentNode.style.background = '#eee' // 最底层的节点，包括多选框和名字都让他左浮动
        classDomList1[i].parentNode.style.background = '#eee'
      }
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
      // setTimeout(() => {
      //   this.changeTreeClass();
      // }, 50);
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    ...userInfo.mapActions(['requireMenu']),
    ...mapMutations(['setCarouselShow']),
    ...mapActions(['requireApproveCount']),
    ...bpmChat.mapMutations(['setTalkUnread']),
    // ...bpmChat.mapActions(['initWebSocketTalkUnread']),
    generateMenu,
    handleClose() {
      this.dialogVisible = false
    },

    toGlobalSearch() {
      if (!this.searchVal) {
        this.$message(this.$t('placeholderText.pleaseEnterSearchContent'))
        return
      }
      const routes = this.$router.resolve({
        name: 'globalSearch',
        query: { searchVal: this.searchVal }
      })
      window.open(routes.href, '_blank')
    },
    getdata() {
      querylink({}).then(res => {
        if (!res) return false
        const arr = []
        res.list.forEach(item => {
          if (
            item.id != 1 &&
            item.id !== 'support' &&
            item.id !== 'strategy' &&
            item.id !== 'main'
          ) {
            arr.push(item)
          }
        })
        this.tableList = arr.reverse()
      })
    },
    close1() {
      window.opener = null
      window.close()
    },
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
      })
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
            const language = localStorage.getItem('language')
            localStorage.clear()
            sessionStorage.clear()
            clearCookies()
            localStorage.setItem('language', language)
            this.$router.replace(this.host + '/logout').catch(e => e)
            this.setCarouselShow(true)
          })
        })
        .catch(() => {})
    },
    clickHandle(item) {
      if (item.url === 'analyseWatchCenter') {
        this.$router.push({ name: item.url }).catch(e => e)
      } else {
        if (item.subNodes.length > 0) {
          if (item.subNodes[0].subNodes.length > 0) {
            if (item.subNodes[0].subNodes[0].url.indexOf('?') === -1) {
              this.$router.push({
                name: item.subNodes[0].subNodes[0].url
              })
            } else {
              this.$router
                .push({
                  name: item.subNodes[0].subNodes[0].url.split('?')[0],
                  query: this.getQueryString(item.subNodes[0].subNodes[0].url)
                })
                .catch(e => e)
            }
          }
        }
      }
    },
    clickHandle2(item, index) {
      // alert('bpa')
      console.log(item)
      console.log(item.url)
      // this.menuList.forEach((item, index1) => {
      //   if (index1 === index) {
      //     item.checked = true
      //   } else {
      //     item.checked = false
      //   }
      // })
      // this.indexActive = index
      if (item.name == '流程中心' || item.name == '流程分析') {
        this.$router.push({ path: item.subNodes[0].url }).catch(e => e)
      } else if (
        item.name == '系统管理' ||
        item.name == '岗位职责' ||
        item.name == '规章制度'
      ) {
        this.$router
          .push({ path: item.subNodes[0].subNodes[0].url })
          .catch(e => e)
      } else {
        this.$router.push({ path: item.url }).catch(e => e)
      }
    },
    jump(value) {
      if (value === 0) {
        this.$router.replace('/bpmHome').catch(e => e)
      } else if (value === 1) {
        this.$router.push({ path: '/doorCenter' }).catch(e => e)
      }
    },
    jumpSys() {
      const bpmMenus = JSON.parse(localStorage.getItem('bpm_pc_nav_records'))
        .app.tabList
      const name = bpmMenus[0].url
      const routes = this.$router.resolve({
        name
      })
      window.open(routes.href, '_blank')
    },
    jumpTheProcessIsv() {
      const routes = this.$router.resolve({
        path: '/doorCenter/TheProcessIsv',
        query: { theProcessIs: true }
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
      if (value == this.$t('modify')) {
        this.resetDialogFormVisible = true
      } else if (value == this.$t('exit')) {
        this.logout()
      }
    },
    handleCommand(command) {
      this.$message('click on item ' + command)
    },
    jumpToApproveList() {
      this.$router.push({ name: 'stagingPersonalApproveList' })
    },
    // 向左移动
    moveMenu(type) {
      switch (true) {
        case type === 'left':
          this.scrollNum = 0
          this.$refs.menupart.scrollLeft = 0
          this.menuLeftBtnShow = false
          this.menuRightBtnShow = true
          break
        case type === 'right':
          let width = 0
          $('.el-menu-item').each(function() {
            width += parseFloat($(this).css('width'))
          })
          this.scrollNum++
          let menuWidth = parseFloat($('.menupart').css('width'))
          this.$refs.menupart.scrollLeft = (menuWidth - 100) * this.scrollNum
          this.menuLeftBtnShow = true
          this.menuRightBtnShow = menuWidth * (this.scrollNum + 1) < width
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
.parent-header .el-dialog__wrapper {
  margin-top: 0vh !important;
}
.header .el-dialog {
  margin: 0 auto;
}
.header::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: transparent;
}

.header::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.header:hover::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 53%, 0.4);
}

.header:hover::-webkit-scrollbar-track {
  background: hsla(0, 0%, 53%, 0.1);
}
</style>
<style lang="scss">
.header {
  .el-dialog {
    margin-top: 0px;
  }
}
</style>
<style lang="scss" scoped>
.globalSearch {
  width: 150px;
  margin-right: 10px;
  position: relative;
  float: right;
  margin-top: 4px;
  /deep/ .el-input__inner {
    border-radius: 50px;
    padding-right: 35px;
  }
  i {
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 9;
    padding: 6px;
    font-size: 15px;
    color: #a1a4ad;
    cursor: pointer;
  }
}
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
.el-dialog__wrapper {
  overflow: none;
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
.parent-header .menupart {
  overflow-x: hidden;
}
.parent-header {
  // align-items: center;
  // padding: 0 20px;
  // box-shadow: 0 5px 10px -5px #dfdfdf;
  overflow: hidden;
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
    color: #000;
    .user-bar {
      float: right;
      margin-left: 10px;
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
        // color: #ffffff;
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
.display-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
.headers {
  height: 90px;
  background: #fff;
}

.header {
  width: 100%;
  // box-shadow: 0 3px 3px #f5f5f5;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  // padding: 0 20px;
  box-sizing: border-box;
  .header_left {
    height: 100px;
    .logo_wrap {
      width: 345px;
      height: 50px;
      margin-left: 20px;
      margin-top: 25px;
      img {
        width: 340px;
      }
    }
  }
  .head_right_top-titel {
    font-size: 14px;
    text-align: center !important;
    font-weight: bold;
    height: 30px;
  }
  .header_right {
    min-width: 850px;
    .head_right_top {
      height: 50px;
      /*padding-right: 20px;*/
      &:after {
        content: '';
        display: block;
        clear: both;
        img {
          width: 340px;
        }
      }
      .top_item {
        height: 100%;
        float: right;
        &:after {
          content: '';
          height: 100%;
          display: inline-block;
          vertical-align: middle;
        }
        &.welcome {
          // margin-right: 30px;
        }
        &.tobpm {
          margin-right: 30px;
          i {
            font-size: 12px;
            display: inline-block;
            vertical-align: middle;
          }
          span {
            font-size: 12px;
            display: inline-block;
            vertical-align: middle;
            a {
              font-size: 12px;
              &:hover {
                color: #327ab7;
              }
            }
          }
        }
        &.search {
          margin-right: 30px;
        }
        .img {
          display: inline-block;
          width: 28px;
          height: 28px;
          margin-right: 0;
          border-radius: 50%;
          overflow: hidden;
        }
        .cursor-pointer2 {
          cursor: pointer;
        }
        .icon,
        .user_img,
        span,
        .search_wrap {
          font-size: 12px;
          display: inline-block;
          vertical-align: middle;
          &.icon {
            font-size: 20px;
          }
          &.user_img {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            margin-right: 10px;
            position: relative;
            .badge {
              position: absolute;
              top: -7px;
              right: -7px;
              display: inline-block;
              height: 14px;
              line-height: 14px;
              border-radius: 7px;
              color: #fff;
              padding: 0 4px;
              cursor: pointer;
            }
          }
          &.search_wrap {
            position: relative;
            input {
              width: 100px;
              height: 30px;
              padding-left: 35px;
              outline: none;
              box-sizing: border-box;
              border-radius: 15px;
              background: #f2f2f2;
              transition: width 0.5s;
              &.inputAnimation {
                width: 250px;
              }
            }
            .icon {
              font-size: 18px;
              cursor: pointer;
              position: absolute;
              top: 50%;
              margin-top: -9px;
              left: 10px;
            }
            span {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 10px;
              cursor: pointer;
            }
          }
        }
      }
      /deep/ .el-dropdown {
        height: 30px !important;
        width: 100px;
      }
      /deep/ .el-dropdown:nth-of-type(2) {
        width: 44px !important;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #666666;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
    }
    .changelang {
      cursor: pointer;
      width: 18px;
      height: 18px;
      text-align: center;
      line-height: 20px;
      border: 2px solid #519eff;
      border-radius: 50%;
      color: #519eff;
      font-weight: bold;
      display: inline-block;
      vertical-align: middle;
    }
    .shutdown-wrapper {
      cursor: pointer;
    }
  }
}

.onlyClose {
  width: 40%;
  left: 60%;
  right: 0;
}

.el-menu-demo {
  width: 100%;
  overflow-x: auto;
  background: none;
}
.firstMenu {
  padding: 0 20px;
  margin-left: 50px;
  position: relative;
  overflow: hidden;
  .common {
    position: absolute;
    top: 0;
    width: 30px;
    height: 33px;
    line-height: 38px;
    text-align: center;
    cursor: pointer;
  }
  .leftBtn {
    left: 0;
  }
  .rightBtn {
    right: 0;
  }
}
.header .menupart {
  overflow-x: hidden;
}
.header .el-menu.el-menu--horizontal {
  overflow: visible;
}
.headerNav {
  overflow-x: auto;
  .nav-bar {
    margin: 12px 30px 0;
    /*width: calc(100vw - 510px);*/
    height: 35px;
    white-space: nowrap;
    display: flex;
    /*flex-direction: row;  !* 子元素横向排列 *!*/
    /*justify-content: center; !* 相对父元素水平居中 *!*/
    /*align-items: center; !*  子元素相对父元素垂直居中 *!*/
    .tab {
      height: 29px;
      line-height: 31px;
      color: $tc2;
      margin: 0 15px;
      font-size: 15px;
      font-weight: bold;
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }
    .tab.active {
      color: $active-color;
      border-color: $active-color;
    }
  }
}
.active {
  color: #2d42af;
  border-color: #2d42af;
}
.system {
  // margin-right: 20px;
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
.logout {
  line-height: 50px;
}
.el-badge {
  position: relative;
  vertical-align: middle;
  display: inline-block;
  margin-right: 10px;
  i {
    vertical-align: middle;
    position: relative;
    top: -1px;
  }
  .img {
    display: inline-block;
    width: 28px;
    height: 28px;
    margin-right: 0;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      border: none;
    }
  }
}
/deep/ .el-badge__content {
  /*top: 8px !important;*/
  /*background-color: #2d42af;*/
  /*-webkit-transform: scale(0.8) translateY(-50%) translateX(100%);*/
  /*transform: scale(0.8) translateY(-50%) translateX(100%);*/
}
/deep/ .el-menu--horizontal {
  .el-menu-item {
    color: #666666;
  }
}
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
  background: none;
  color: #000;
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
      margin-top: 0vh !important;
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

.el-dialog__body::-webkit-scrollbar /deep/ {
  /*滚动条整体样式*/
  width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.el-dialog__body::-webkit-scrollbar-thumb /deep/ {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.el-dialog__body::-webkit-scrollbar-track /deep/ {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
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

.border-left::before {
  content: '';
  border-left: 4px solid #2d42af;
}

.Suk {
  color: rgb(45, 66, 175);
  display: flex;
}
</style>
