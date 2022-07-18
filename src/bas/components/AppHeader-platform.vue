<template>
  <div>
    <div
      v-if="!theProcessIs"
      class="bas-components-header"
      :class="`skin-${getHeaderSkin}`"
    >
      <div class="bas-components-header-content">
        <div class="logo" style="display: flex">
          <img
            :src="require(`@/bas/assets/img/ic_logo_jcy_${getHeaderSkin}.png`)"
          />
          <img
            style="height: 15px;margin-left: -3px"
            :src="require('@/bas/assets/img/ic_logo_type.png')"
          />
        </div>

        <!-- <el-popover
          v-model="navShow"
          placement="bottom-start"
          width="800"
          :visible-arrow="false"
          trigger="hover"
        >
          <menu-nav @itemClick="navShow = !navShow" />
          <el-button slot="reference">
            <span class="nav-btn">导航</span>
          </el-button>
        </el-popover>
        <div class="mainnav">
          <i
            v-show="menuLeftBtnShow"
            class="left-arrow el-icon-arrow-left"
            @click="moveMenu('left')"
          />
          <div class="mainnav-content">
            <ul
              ref="menupart"
              :style="`transform: translateX(${deviation}px);`"
            >
              <li
                v-for="v in userMenu"
                :key="v.id"
                :class="{ current: navIndex === v.id }"
                style="font-weight: 600;"
                @click="goTab(v)"
              >
                <span>{{ v.name }}</span>
              </li>
            </ul>
          </div>
          <i
            v-show="menuRightBtnShow"
            class="right-arrow el-icon-arrow-right"
            @click="moveMenu('right')"
          />
        </div> -->
        <div class="dropdownNav">
          <p class="currentNav" @click.stop="menuShow = !menuShow">
            {{ curPlatform.name }} <i class="iconfont icon-web-icon-" />
          </p>
          <!-- <el-input
            placeholder="请选择日期"
            suffix-icon="el-icon-arrow-down"
            v-model="input1">
          </el-input> -->
          <transition name="el-fade-in-linear">
            <div v-show="menuShow" class="transition-box">
              <platform-menu
                is-login
                popover-placement="left-start"
                popover-class="headerNavPopover"
                @fnJumpSuccessful="fnJumpSuccessful"
              />
            </div>
          </transition>
        </div>
        <div class="right-side">
          <div
            class="username"
            :title="usernameTitle"
            @click="showemployeeInfo"
          >
            <!--            <el-badge-->
            <!--              :max="99"-->
            <!--              :value="approveCount"-->
            <!--              class="item"-->
            <!--              style="cursor: pointer"-->
            <!--            >-->
            <!--              -->
            <!--            </el-badge>-->
            {{ $t('welcome2') }}， {{ username }}
          </div>
          <switch-language />
          <!--          <div class="webmap" @click="openWebMap">-->
          <!--            <span class="el-dropdown-link">-->
          <!--              {{ $t('webmap')-->
          <!--              }}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
          <!--            </span>-->
          <!--          </div>-->
          <div
            class="top_item"
            style="margin-right: 10px"
            @click="resetDialogFormVisible = true"
          >
            <span class="cursor-pointer">{{ $t('changePassword') }}</span>
          </div>
          <div class="cursor-pointer top_item logout" @click="logout">
            <i class="el-icon el-icon-switch-button" />
            <span>{{ $t('logout') }}</span>
          </div>
        </div>
      </div>
    </div>
    <change-password v-model="resetDialogFormVisible" />
    <webmap-dialog ref="WebmapDialog" v-model="dialogVisible" />

    <employee-info
      v-model="isShowEmployeeInfoDialogVisible"
      :title="linkTitle"
      :type="linkType"
      :detail="editItem"
      :org-data="orgData"
      :pos-data="posData"
      @showOrgData="showOrg"
      @showPosData="showPos"
    />

    <bas-organieation
      v-model="organieationShow"
      :selected-element="selectedElement"
      :is-specified-group-but="false"
      :is-show-bustom-groups-but="false"
      :select-element="selectElement"
      :show-element="showElement"
      :title="orgtitle"
      :multiple="false"
      :is-show-org-post="isShowOrgPost"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </div>
</template>

<script>
import $ from 'jquery'
// import { createNamespacedHelpers } from 'vuex'
import { mapState, createNamespacedHelpers } from 'vuex'
import SwitchLanguage from '@/bpm/components/switchLanguage/SwitchLanguage.vue'
import WebmapDialog from '@/bpa/components/MenuNavigation'
import { logout } from '@/bpm/api/app'
import { clearCookies } from '@/bpa/utils/common'
// import MenuNav from './MenuNav'
import EmployeeInfo from './EmployeeInfo'
import changePassword from '@/bpm/components/changePassword'
import PlatformMenu from '@/bas/components/PlatformMenu'

const { mapGetters, mapMutations, mapActions } = createNamespacedHelpers('app')
const headetStore = createNamespacedHelpers('header')
// const userInfo = createNamespacedHelpers('userInfo')
// const bpmChat = createNamespacedHelpers('bpmChat')

export default {
  name: 'AppHeader',
  components: {
    EmployeeInfo,
    // MenuNav,
    SwitchLanguage,
    WebmapDialog,
    changePassword,
    PlatformMenu
  },
  data() {
    return {
      selectType: '',
      selectElement: [],
      selectedElement: {},
      showElement: [],
      orgtitle: '',
      isShowOrgPost: false,
      organieationShow: false,
      orgData: {},
      posData: {},
      editItem: { id: '' },
      linkTitle: '修改个人信息',
      linkType: 'edit',
      isShowEmployeeInfoDialogVisible: false, // 是否显示员工信息对话框
      menuLeftBtnShow: false,
      menuRightBtnShow: true,
      dialogVisible: false,
      navShow: false,
      scrollNum: 0,
      deviation: 0, // 偏移量
      theProcessIs: false,
      navIndex: 0,
      currentNav: {},
      resetDialogFormVisible: false,
      menuShow: false
    }
  },
  computed: {
    ...mapGetters(['approveCount', 'tabList']),
    ...headetStore.mapGetters(['getHeaderSkin', 'curPlatform']),
    ...mapState({
      username: state => {
        if (state?.basuser?.user?.displayname?.length > 5) {
          return state.basuser.user.displayname.slice(0, 5) + '...'
        } else {
          return state.basuser.user.displayname
        }
      },
      usernameTitle: state => state.basuser.user.displayname,
      userMenu: state => state.userInfo.userMenu
    })
  },
  watch: {
    $route: {
      handler(route) {
        this.setNavId()
        for (let i = 0, len = this.userMenu.length; i < len; i++) {
          const item = this.userMenu[i]
          const subNodes = [
            {
              url: item.url
            }
          ]
          this.getPath(item.subNodes, subNodes)
          if (
            subNodes.map(el => el.url.split('?')[0]).includes(route.name) ||
            subNodes.map(el => el.url.split('?')[0]).includes(route.fullPath)
          ) {
            this.setCurPlatform(item)
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    const { theProcessIs } = this.$route.query
    // const { path } = this.$route
    this.moveMenu('left')
    this.requireApproveCount()
    this.theProcessIs = theProcessIs
    // this.navIndex = path
    this.setNavId()
    const that = this
    $('body').click(function(e) {
      if ($(e.target).parents('.dropdownNav').length === 0) {
        that.menuShow = false
      }
    })
  },
  methods: {
    ...mapActions(['requireApproveCount']),
    ...mapMutations(['setCarouselShow']),
    ...headetStore.mapMutations(['setHeader', 'setCurPlatform']),
    // 显示组织
    showOrg(data) {
      this.orgtitle = this.$t('basEmployee.ChooseImmediateSuperior')
      this.selectElement = ['9']
      this.isShowOrgPost = false
      this.organieationShow = true
      this.selectType = 'showOrgType'
      if (data.superior && data.superiorName) {
        this.selectedElement = {
          id: data.superior,
          name: data.superiorName,
          idType: `${data.superior}-9`
        }
      }
    },
    // 显示岗位
    showPos(data) {
      this.orgtitle = this.$t('basEmployee.ChooseImmediateDefaultposname')
      this.selectElement = ['3']
      this.isShowOrgPost = true
      this.organieationShow = true
      this.selectType = 'showPosType'
      if (data.defaultpos && data.defaultposname) {
        this.selectedElement = {
          id: data.defaultpos,
          name: data.defaultposname,
          idType: `${data.defaultpos}-3`
        }
      }
    },
    fnBasOrganieationCallBack(data) {
      this.organieationShow = false
      console.log(data)
      if (this.selectType === 'showPosType') {
        this.posData = data
      } else if (this.selectType === 'showOrgType') {
        this.orgData = data
      }
    },
    async setNavId() {
      // const current = this.tabList.find((v) => v.url === this.$route.path)
      // console.log('this.tabList.104',this.tabList)
      // this.setHeader({
      //   ...current,
      // })
      await this.getCurrentTab(this.tabList)
      this.navIndex = this.currentNav.top
      this.setHeader({
        ...this.currentNav
      })
    },
    /**
     * 获取当前页面
     * @date 2021-08-03
     * @param {any} tabList
     * @returns {any}
     */
    async getCurrentTab(tabList, top) {
      const current = tabList.find(v => v.url === this.$route.path)
      // const current = tabList.find((v) =>this.$route.path.indexOf(v.url)!==-1)
      if (current) {
        this.currentNav = {
          top: current.id,
          ...current
        }
      } else {
        if (tabList.length) {
          for (let i = 0; i < tabList.length; i++) {
            const item = tabList[i]
            if (item.pid === '1') {
              // 最顶层
              item.top = item.id
            } else {
              item.top = top
            }
            const subCurrent = item.subNodes.find(v => {
              // console.log(item.pid)
              if (item.pid !== '1') {
                // 最顶层
                v.top = item.top
              }
              // console.log('find/v',v)
              return v.url === this.$route.path
            })
            // console.log('subCurrent.159',subCurrent)
            if (subCurrent) {
              this.currentNav = subCurrent
              break
            } else {
              await this.getCurrentTab(item.subNodes, item.top)
            }
          }
        }
      }
    },
    goTab(item, e) {
      const { url, id } = item
      console.log('🍓🍓', url)
      // console.log("e",e)
      // const newTagUrl = [
      //   '/operationSystem',
      //   '/doorCenter/TheProcessIsv?theProcessIs=true',
      // ] // 需要新页面打开的连接
      this.navIndex = id
      // if (newTagUrl.includes(url)) {
      //   let routeUrl = this.$router.resolve({
      //     path: url,
      //   })
      //   window.open(routeUrl.href, '_blank')
      // } else {
      //   this.$router.push({ path: url })
      // }
      const firstChild = this.getFirstChild(item)
      // return
      if (item.name === '流程中心' || item.name === '流程分析') {
        // this.$router.push({ path: item.subNodes[0].url }).catch(e => e)
        this.$router.push({ path: firstChild.url }).catch(e => e)
      } else if (
        item.name === '系统管理' ||
        item.name === '岗位职责' ||
        item.name === '规章制度'
      ) {
        // this.$router.push({ path: item.subNodes[0].subNodes[0].url }).catch(e => e)
        this.$router.push({ path: firstChild.url }).catch(e => e)
      } else {
        // this.$router.push({ path: item.url }).catch(e => e)
        this.$router.push({ path: firstChild.url }).catch(e => e)
      }
    },
    getFirstChild(item) {
      if (!item.subNodes || item.subNodes.length === 0) {
        return item
      }
      // 针对流程运行的特殊处理
      if (
        item.subNodes.length > 1 &&
        item.subNodes[0].url === '/bpmHome/businessAdminHome'
      ) {
        return this.getFirstChild(item.subNodes[1])
      }
      return this.getFirstChild(item.subNodes[0])
    },
    openWebMap() {
      this.dialogVisible = !this.dialogVisible
      // this.$refs.WebmapDialog.open()
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
        .then(async () => {
          if (process.env.NODE_ENV === 'production') {
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
          } else {
            await this.$store.dispatch('basuser/saveUser', {})
            const language = localStorage.getItem('language')
            localStorage.clear()
            sessionStorage.clear()
            clearCookies()
            localStorage.setItem('language', language)
            this.$router.replace('/login')
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    moveMenu(type) {
      const allWidth = parseFloat($('.mainnav-content').css('width'))
      const menuWidth = parseFloat($('.mainnav-content ul').css('width'))
      const $li = $('.mainnav-content li')
      if (allWidth > menuWidth) {
        this.menuLeftBtnShow = false
        this.menuRightBtnShow = false
        return
      }
      let $liWidth
      switch (true) {
        case type === 'left':
          if (this.scrollNum >= 0) {
            $liWidth = parseFloat($li.eq(this.scrollNum--).css('width'))
          }
          if (this.deviation < -100) {
            this.deviation = this.deviation + $liWidth
            this.menuLeftBtnShow = true
          } else {
            this.deviation = 0
            this.menuLeftBtnShow = false
          }
          this.menuRightBtnShow = true
          break
        case type === 'right':
          $liWidth = parseFloat(
            $('.mainnav-content li')
              .eq(this.scrollNum++)
              .css('width')
          )
          if (menuWidth - allWidth > Math.abs(this.deviation) + 100) {
            this.deviation = this.deviation - $liWidth
            this.menuRightBtnShow = true
          } else {
            this.deviation = allWidth - menuWidth
            this.menuRightBtnShow = false
          }
          this.menuLeftBtnShow = true
          break
      }
    },
    // jumpToApproveList() {
    //   this.$router.push({ path: '/staging/personal/approveList' })
    // }
    showemployeeInfo() {
      this.isShowEmployeeInfoDialogVisible = true
      this.linkTitle = this.$t('basEmployee.modifyEmployeeInformation')
      this.editItem.id = JSON.parse(localStorage.getItem('userInfo')).id
    },
    fnJumpSuccessful(data) {
      this.menuShow = false
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
$boxHeight: 66px;
$headerFont: 16px;
$leftheaderFont: 12px;
@mixin skinSet(
  $background,
  $mainColor,
  $mainBackground,
  $mainNavWeight,
  $rightSideColor,
  $mainCurrentColor
) {
  background: $background;
  .bas-components-header-content {
    background: $background;
    position: relative;
    //height: 60px;
    //margin-top: 15px;
  }
  .mainnav {
    .left-arrow,
    .right-arrow {
      color: $mainColor;
    }

    li {
      font-weight: $mainNavWeight;
      color: $mainColor;

      &:hover {
        color: $mainColor;
      }
    }

    li.current {
      color: $mainCurrentColor;

      span {
        padding-bottom: 5px;
        border-bottom: 2px solid $mainCurrentColor;
      }
    }
  }
  .nav-btn {
    color: #333;
    font-size: 13px;
    font-weight: 700;

    &:hover {
      color: #fff;
    }
  }
  .right-side {
    color: $rightSideColor;
  }
  /deep/ .el-dropdown {
    color: $rightSideColor;
  }
  .el-icon-switch-button {
    color: $mainColor;
  }
}

.skin-blue {
  $background: #2d42af;
  $mainColor: #ffffff;
  $mainBackground: #1a2e95;
  $mainNavWeight: normal;
  $rightSideColor: #fff;
  $mainCurrentColor: #ffffff;
  @include skinSet(
    $background,
    $mainColor,
    $mainBackground,
    $mainNavWeight,
    $rightSideColor,
    $mainCurrentColor
  );

  .mainnav li:hover {
    background: $mainBackground;
  }
}

.skin-white {
  $background: #ffffff;
  $mainColor: #666666;
  $mainBackground: #e1e5fe;
  $mainNavWeight: bold;
  $rightSideColor: #333;
  $mainCurrentColor: #2d42af;
  @include skinSet(
    $background,
    $mainColor,
    $mainBackground,
    $mainNavWeight,
    $rightSideColor,
    $mainCurrentColor
  );

  .mainnav li:hover {
    color: #000000;
    background: #eeeeee;
  }

  .mainnav li.current:hover {
    color: $mainCurrentColor;
  }
}

.bas-components-header {
  height: $boxHeight;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  &-content {
    // width: 1280px;
    width: 96%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 3000;
  }

  .logo {
    margin-right: 20px;
    height: 40px;
    width: 355px;

    img {
      height: 40px;
    }
  }

  .mainnav {
    flex: 1;
    display: flex;
    align-items: center;

    .left-arrow,
    .right-arrow {
      width: 14px;
      margin: 0 5px;
      cursor: pointer;
    }

    .left-arrow {
      position: relative;
      margin-right: -24px;
    }

    .mainnav-content {
      width: 740px;
      overflow: hidden;
      position: relative;
      height: $boxHeight;
      margin-left: 24px;
    }

    ul {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      height: $boxHeight;
      position: absolute;
      left: 0;
      top: 0;
      transition: all 0.3s;
    }

    li {
      font-size: $headerFont;
      height: $boxHeight;
      line-height: $boxHeight;
      padding: 0 6px;
      white-space: nowrap;
      cursor: pointer;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .right-side {
    display: flex;
    //margin-bottom: 30px;
    //height: 100%;
    position: absolute;
    font-size: $leftheaderFont;
    padding: 7px;
    top: 0;
    right: 0;
  }

  .username {
    cursor: pointer;
    margin-right: 15px;
    font-size: $leftheaderFont;
    white-space: nowrap;
  }

  /deep/ .el-dropdown {
    cursor: pointer;
    margin-right: 10px;

    .el-dropdown-link {
      font-size: $leftheaderFont;
      white-space: nowrap;
    }
  }

  .webmap {
    margin-right: 10px;
    cursor: pointer;

    .el-dropdown-link {
      font-size: $leftheaderFont;
      white-space: nowrap;
    }
  }

  .top_item {
    height: 100%;
    float: left;
    //margin-left: 15px;
    font-size: $leftheaderFont;
    // &:after {
    //   content: '';
    //   height: 100%;
    //   display: inline-block;
    //   vertical-align: middle;
    // }
    // .el-icon {
    //   font-size: 17px;
    //   color: $active-color;
    //   margin-right: 5px;
    // }
  }

  /deep/ .icon-fanyi {
    display: none;
  }

  /deep/ .el-badge {
    vertical-align: inherit;
  }

  /deep/ .el-badge__content {
    border: 0 none;
    cursor: pointer;
  }

  .logout {
    font-size: $leftheaderFont;
    white-space: nowrap;
  }

  .el-icon-switch-button {
    font-size: $leftheaderFont;
  }
}
.dropdownNav {
  margin-top: 30px;
  position: relative;
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
