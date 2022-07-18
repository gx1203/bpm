<template>
  <div>
    <!-- <div v-if="showBreadCrumb" shadow="never" class="breadcrumb">
      <div class="tag-wrap" v-menus>
        <draggable
          class="tag-content"
          :list="navRecords"
          ghost-class="ghost">
          <div class="tag-item"
            :key="index"
            v-for="(tag, index) in navRecords"
            @contextmenu.prevent="rightEvent(tag, index)">
            <el-tag
              :class="tag.active ? 'active' : ''"
              :closable="navRecords.length > 1"
              :disable-transitions="true"
              @close="handleClose(tag, index)"
              @click="changeActive(tag, index)">
              {{tag.title}}
            </el-tag>
          </div>
        </draggable>
        <ul class="contextmenu" :style="{'left': menuLeft, 'top': menuTop}" v-show="menuShow">
          <li @click="closeCurrentTag">关闭当前标签页</li>
          <li @click="closeLeftTag" v-if="leftTagShow">关闭左侧标签页</li>
          <li @click="closeRightTag" v-if="rightTagShow">关闭右侧标签页</li>
          <li @click="closeOtherTag">关闭其它标签页</li>
        </ul>
      </div>
      <el-backtop :visibility-height="100" :bottom="160"></el-backtop>
    </div> -->
<!--    <keep-alive :include="keepAliveList">-->
    <router-view :key="$route.fullPath"></router-view>
<!--    </keep-alive>-->
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('app')
import keepAliveConf from '@/bpm/mixins/keep_alive_conf'
export default {
  name: 'AppMain',
  mixins: [keepAliveConf],
  provide () { // 注册一个方法
    return {
      reload: this.reload
    }
  },
  components: {
    draggable
  },
  data () {
    return {
      breadcrumbList: [],
      menuShow: false,
      leftTagShow: true,
      rightTagShow: true,
      menuLeft: 0,
      menuTop: 0,
      rightClickTagData: {},
      rightClickIndex: 0,
      isRouterAlive: true // 局部刷新
    }
  },
  computed: {
    ...mapGetters(['showBreadCrumb', 'navRecords']),
    key () {
      return this.$route.matched[1].name
    },
    keepAliveList(){
      return this.$store.state.app.keepAliveList
    }
  },
  watch: {
    '$route': {
      handler (val) {
        this.buildBreadcrumbList(val.matched)
      },
      immediate: true
    }
  },
  directives: {
    menus: {
      inserted: function (el, binding, vnode) {
        // 获取vue实例对象
        let vm = vnode.context
        let showFlag = true
        vnode = vnode.elm
        // 阻止默认浏览器的右键菜单
        el.oncontextmenu = (event) => {
          event.preventDefault()
        }
        el.onmouseup = (event) => {
          if (event.button === 2 && vm.navRecords.length > 1) {
            vm.menuShow = true
            showFlag = false
            let realTop = vm.getElementToPageTop(vnode)
            let realLeft = vm.getElementToPageLeft(vnode)
            let top = event.pageY - realTop + 5 + 'px'
            let left = event.pageX - realLeft + 5 + 'px'
            vm.menuLeft = left
            vm.menuTop = top
          }
        }
        document.onmouseup = () => {
          if (showFlag) {
            vm.menuShow = false
          }
          showFlag = true
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setNavRecords', 'setActiveIndex','setKeepAliveLists']),
    navRecordsData (item) {
      if (item.name === 'configureJobs') return
      this.setActiveIndex(item.meta.title)
      let navRecords = JSON.parse(JSON.stringify(this.navRecords))
      if (!navRecords.map(el => el.name).includes(item.name)) {
        let addActiveIndex = navRecords.findIndex(item => item.active)
        navRecords.forEach((el, index) => {
          el.active = false
        })
        navRecords.splice(addActiveIndex + 1, 0, {
          name: item.name,
          title: item.meta.title,
          active: true,
          query: item.query
        })
      } else {
        navRecords.forEach((el, index) => {
          el.active = false
          if (el.name === item.name) {
            navRecords[index].active = true
          }
        })
      }

      this.setNavRecords(navRecords)
    },
    getQueryString(item) {
      let str = item.split("?")[1];
      let arr1 = str.split("&");
      let obj = {};
      for (let i = 0; i < arr1.length; i++) {
        obj[arr1[i].split("=")[0]] = arr1[i].split("=")[1];
      }
      return obj;
    },
    handleClose (tag, index) {
    let navRecords = JSON.parse(JSON.stringify(this.navRecords))
      navRecords.splice(index, 1)
      if (tag.active) {
        if (index === 0) {
          navRecords[index].active = true
          this.setActiveIndex(navRecords[index].title)
          if(navRecords[index].name.indexOf('?') === -1){
              this.$router.push({
                name: navRecords[index].name
              })
            } else {
              this.$router.push({
                name: navRecords[index].name.split("?")[0],
                query: this.getQueryString(navRecords[index].name)
              });
            }
        } else {
          navRecords[index - 1].active = true
          this.setActiveIndex(navRecords[index - 1].title)
            if(navRecords[index - 1].name.indexOf('?') === -1){
              this.$router.push({
                name: navRecords[index - 1].name
              })
            } else {
              this.$router.push({
                name: navRecords[index - 1].name.split("?")[0],
                query: this.getQueryString(navRecords[index - 1].name)
              });
            }
        }
      }
      this.setNavRecords(navRecords)
      this.setKeepAliveLists(this.navRecords.map(item=>item.name).join());
    },
    changeActive (tag, index) {
       let navRecords = JSON.parse(JSON.stringify(this.navRecords))
      navRecords.forEach(el => {
        el.active = false
      })
      navRecords[index].active = true
      this.setActiveIndex(tag.title)
      this.setNavRecords(navRecords)
      if(tag.name.indexOf('?') === -1){
        this.$router.push({
          name: tag.name
        })
      } else {
        this.$router.push({
          name: tag.name.split("?")[0],
          query: this.getQueryString(tag.name)
        });
      }
    },
    buildBreadcrumbList (matched) {
      this.breadcrumbList = matched
    },
    rightEvent (tag, index) {
      this.rightClickTagData = tag
      this.rightClickIndex = index
      this.leftTagShow = this.rightClickIndex !== 0
      this.rightTagShow = this.rightClickIndex !== this.navRecords.length - 1
    },
    closeCurrentTag () {
      this.handleClose(this.rightClickTagData, this.rightClickIndex)
    },
    closeLeftTag () {
      let navRecords = JSON.parse(JSON.stringify(this.navRecords))
      let navRecords1 = navRecords.slice(this.rightClickIndex, navRecords.length)
      if (navRecords1.filter(item => item.active).length > 0) {
        this.setNavRecords(navRecords1)
      } else {
        navRecords1[0].active = true
        this.$router.push({name: navRecords1[0].name})
        this.setActiveIndex(navRecords1[0].title)
        this.setNavRecords(navRecords1)
      }
      this.setKeepAliveLists(this.navRecords.map(item=>item.name).join());
    },
    closeRightTag () {
      let navRecords = JSON.parse(JSON.stringify(this.navRecords))
      let navRecords1 = navRecords.slice(0, this.rightClickIndex + 1)
      if (navRecords1.filter(item => item.active).length > 0) {
        this.setNavRecords(navRecords1)
      } else {
        navRecords1[navRecords1.length - 1].active = true
        this.$router.push({name: navRecords1[navRecords1.length - 1].name})
        this.setActiveIndex(navRecords1[navRecords1.length - 1].title)
        this.setNavRecords(navRecords1)
      }
      this.setKeepAliveLists(this.navRecords.map(item=>item.name).join());
    },
    closeOtherTag () {
      let navRecords = []
       if(this.rightClickTagData.name.indexOf('?') === -1){
          navRecords.push({
            name: this.rightClickTagData.name,
            title: this.rightClickTagData.title,
            active: true
          })
        this.$router.push({
          name: this.rightClickTagData.name
        })
      } else {
        navRecords.push({
          name: this.rightClickTagData.name,
          title: this.rightClickTagData.title,
          active: true
        })
        this.$router.push({
          name: this.rightClickTagData.name.split("?")[0],
          query: this.getQueryString(this.rightClickTagData.name)
        });
      }
      // this.$router.push({name: this.rightClickTagData.name})
      this.setActiveIndex(this.rightClickTagData.title)
      this.setNavRecords(navRecords)
      this.setKeepAliveLists(this.navRecords.map(item=>item.name).join());

    },
    closeAllTag () {
      let navRecords = JSON.parse(JSON.stringify(this.navRecords)).filter(item => item.active)
      this.setNavRecords(navRecords)
      this.setKeepAliveLists(this.navRecords.map(item=>item.name).join());
    },
    closeOne () {

    },
    getElementToPageTop (el) {
      if (el.offsetParent) {
        return this.getElementToPageTop(el.offsetParent) + el.offsetTop
      }
      return el.offsetTop
    },
    getElementToPageLeft (el) {
      if (el.offsetParent) {
        return this.getElementToPageLeft(el.offsetParent) + el.offsetLeft
      }
      return el.offsetLeft
    },
    back () {
      this.$router.back()
    },
    // 全局局部刷新
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
  .breadcrumb {
    overflow: inherit;
    height: 40px;

    /deep/ .el-card__body {
      padding: 9px 20px;
    }
    .tag-wrap {
      position: relative;
      width: 100%;
      display: inline-block;
      .contextmenu {
        margin: 0;
        background: #fff;
        width: 130px;
        z-index: 100;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, .3);
        &:before {
          content: '';
          position: absolute;
          left: 6px;
          top: -12px;
          /*border: 6px solid transparent;*/
          /*border-bottom-color: #eeeeee;*/
        }
        &:after {
          content: '';
          position: absolute;
          left: 6px;
          top: -11px;
          /*border: 6px solid transparent;*/
          /*border-bottom-color: #ffffff;*/
        }
        li {
          margin: 0;
          padding: 7px 16px;
          cursor: pointer;
          &:hover {
            background: #eee;
          }
        }
      }

      .tag-content {
        display: inline-block;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        font-size: 0;
        .tag-item {
          display: inline-block;
          .el-tag {
            position: relative;
            vertical-align: bottom;
            height: 40px;
            line-height: 40px;
            margin: 0;
            padding: 0 24px;
            border: 1px solid #e9e9e9;
            border-left: none;
            border-radius: 0;
            font-size: 14px;
            color: #838383;
            background-color: #eeeeee;
            cursor: pointer;
            /deep/ .el-icon-close {
              width: 20px;
              height: 20px;
              line-height: 21px;
              text-align: center;
              font-size: 20px;
              color: #838383;
              &:hover {
                background-color: transparent;
                color: red !important;;
              }
            }
          }
          .el-tag.active {
            position: relative;
            background-color: #ffffff;
            border-bottom-color: transparent;
            color: $active-color;
            &:before {
              content: '';
              position: absolute;
              top: -1px;
              left: 0;
              right: 0;
              height: 2px;
              background-color: $active-color;
            }
          }
          &:first-child .el-tag {
            border-left: 1px solid #e0e0e0;
          }
          &:first-child .el-tag.active {
            border-left-color: transparent;
          }
        }
      }

      .tag-content::-webkit-scrollbar {
        height: 3px;
        background-color: transparent;
      }

      .tag-content::-webkit-scrollbar-track {
        height: 3px;
        background-color: transparent;
      }

      .tag-content::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #aaaaaa;
      }
    }
    .el-breadcrumb {
      font-size: 13px;
      float: left;
      margin-bottom: 15px;
    }
  }

</style>
