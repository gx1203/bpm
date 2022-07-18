<template>
  <el-scrollbar>
    <el-menu
      :default-active="$route.path"
      :collapse="isCollpase"
      background-color="#f5f5f5"
      text-color="#333"
      class="menu_list"
      active-text-color="#fa6f03">
      <div v-for="item in treeList" :key="item.custom" class="menu_item">
        <el-submenu v-if="item.children.length" :index="item.custom">
          <template slot="title">
            <span>{{ item.custom }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.custom" :index="child.custom">{{ child.custom }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="item.custom">
          <span slot="title">{{ item.custom }}</span>
        </el-menu-item>
      </div>
    </el-menu>
    <!-- <i :class="['isCollpase', isCollpase ? 'el-icon-s-unfold' : 'el-icon-s-fold']" @click="handlerCollpase" /> -->
  </el-scrollbar>
</template>

<script>
// import { businessRoutes } from '../../router'
// import { generateMenu } from '@/bpa/utils/i18n'
// import {createNamespacedHelpers} from 'vuex'

// const userInfo = createNamespacedHelpers('userInfo')

export default {
  name: 'KnowTreeIndex',
  props: {
    treeList: {
      type: Array,
      default() {
        return [
          {
            id: '12',
            custom: '山东',
            children: [
              {
                id: '121',
                custom: '济南',
                children: [
                  {
                    id: '121',
                    custom: '济南1'
                  },
                  {
                    id: '121',
                    custom: '济南2'
                  }
                ]
              },
              {
                id: '121',
                custom: '烟台'
              },
              {
                id: '121',
                custom: '菏泽'
              }
            ]
          },
          {
            id: '12',
            custom: '山西',
            children: [
              {
                id: '121',
                custom: '太原'
              },
              {
                id: '121',
                custom: '金城'
              }
            ]
          },
          {
            id: '12',
            custom: '河南',
            children: []
          },
          {
            id: '12',
            custom: '河北',
            children: []
          }
        ]
      }
    }
  },
  data() {
    return {
      isCollpase: false,
      defaultActive: '',
      menuList: []
    }
  },
  created() {
    console.log('111111111', this.treeList)
  },
  computed: {
    // ...userInfo.mapState(['userMenu']),
    // currentParentRoutePath () {
    //   return this.$route.path.match(/^\/(\w+)\//)[1]
    // },
    // menuList2 () {
    //   // console.log(this.userMenu)
    //   return this.userMenu.filter(item => {
    //     return item.custom.substring(1) === this.currentParentRoutePath
    //   })[0].children
    // }
  },
  watch: {
    // currentParentRoutePath () {
    //   this.routesFilter()
    // }
  },
  mounted () {
    // this.routesFilter()
  },
  methods: {
    // generateMenu,
    // handlerCollpase () {
    //   this.isCollpase = !this.isCollpase
    // },
    // routesFilter () {
    //   this.menuList = businessRoutes.filter(item => {
    //     return item.meta.title === this.currentParentRoutePath
    //   })[0].children
    // }
  }
}
</script>
