<template>
  <el-scrollbar class="left_menu">
    <el-menu
      :default-active="$route.path"
      :collapse="isCollpase"
      background-color="#f5f5f5"
      text-color="#333"
      class="menu_list"
      active-text-color="#fa6f03"
    >
      <div v-for="item in menuList2" :key="item.custom" class="menu_item">
        <el-submenu v-if="item.children.length" :index="item.custom">
          <template slot="title">
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.custom" :index="child.custom" @click="emitUrl(child.custom)">
            {{ child.name }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="item.custom">
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
    </el-menu>
    <i :class="['isCollpase', isCollpase ? 'el-icon-s-unfold' : 'el-icon-s-fold']" @click="handlerCollpase" />
  </el-scrollbar>
</template>

<script>
import { businessRoutes } from '../../router'
import { generateMenu } from '@/bpa/utils/i18n'
import { createNamespacedHelpers } from 'vuex'

const userInfo = createNamespacedHelpers('userInfo')

export default {
  data() {
    return {
      isCollpase: false,
      defaultActive: '',
      menuList: []
    }
  },
  computed: {
    ...userInfo.mapState(['userMenu']),
    currentParentRoutePath() {
      return this.$route.path
    },
    menuList2() {
      console.log(this.userMenu)
      // return this.userMenu.filter(item => {
      //   return item.custom.substring(1) === this.currentParentRoutePath
      // })[0].children
      return this.userMenu.filter(item => {
        return item.custom.includes(this.currentParentRoutePath)
      })[0].children
    }
  },
  watch: {
    currentParentRoutePath() {
      this.routesFilter()
    }
  },
  mounted() {
    this.routesFilter()
  },
  methods: {
    generateMenu,
    handlerCollpase() {
      this.isCollpase = !this.isCollpase
      console.log(this.isCollpase)
    },
    routesFilter() {
      // this.menuList = businessRoutes.filter(item => {
      //   return item.meta.title === this.currentParentRoutePath
      // })[0].children
    },
    emitUrl(url) {
      const bpmurl = url + '?username=' + JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
      this.$emit('bpmurl', bpmurl)
    }
  }
}
</script>
