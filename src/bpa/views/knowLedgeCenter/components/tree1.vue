<template>
  <el-scrollbar>
    <el-menu
      :default-active="$route.path"
      :collapse="isCollpase"
      background-color="#f5f5f5"
      text-color="#333"
      class="menu_list"
      active-text-color="#fa6f03">
      <div v-for="item in treeList" :key="item.custom" class="menu_item" style="text-align: center;">
        <el-submenu class="menu_item2" v-if="item.children.length" :index="item.custom">
          <template slot="title">
            <span>{{ item.custom }}</span>
          </template>
          <el-menu-item v-for="child in item.children" :key="child.custom" :index="child.custom" @click="gogogogo(child.pathName)">{{ child.custom }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :index="item.custom" @click="gogogo(item.pathName)">
          <span slot="title">{{ item.custom }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </el-scrollbar>
</template>

<script>

export default {
  name: 'KnowTreeIndex',
  props: {
    treeList: {
      type: Array,
      default() {
        return [
          {
            id: '12',
            custom: '我的收藏',
            pathName: 'favorite', // 路由的name属性值
            children: []
          },
          {
            id: '12',
            custom: '我上传的',
            pathName: 'upload', // 路由的name属性值
            children: []
          },
          {
            id: '12',
            custom: '我分享的',
            pathName: 'share', // 路由的name属性值
            children: []
          },
          {
            id: '12',
            custom: '分享给我',
            pathName: 'shareTo', // 路由的name属性值
            children: []
          },
          {
            id: '12',
            custom: '荣誉墙',
            pathName: 'honor', // 路由的name属性值
            children: []
          },
          {
            id: '12',
            custom: '回收站',
            pathName: 'recycle', // 路由的name属性值
            children: []
          },
          {
            id: '12',
            custom: '权限查看',
            pathName: 'permission', // 路由的name属性值
            children: [
              {
                id: '121',
                custom: '用户维度',
                pathName: '/knowLedge/permission/user', // 路由的name属性值
                children: []
              },
              {
                id: '121',
                custom: '用户知识',
                pathName: '/knowLedge/permission/userknowledge', // 路由的name属性值
                children: []
              },
              {
                id: '121',
                custom: '组织维度',
                pathName: '/knowLedge/permission/orgpermission', // 路由的name属性值
                children: []
              },
              {
                id: '121',
                custom: '组织知识',
                pathName: '/knowLedge/permission/orgknowledge', // 路由的name属性值
                children: []
              }
            ]
          },
          {
            id: '12',
            custom: '知识管理',
            pathName: 'manage', // 路由的name属性值
            children: []
          },
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
  watch: {
  },
  mounted () {
    // this.routesFilter()
  },
  methods: {
    gogogo(route){
      this.$router.replace(route)
      console.log('跳转子页面1',route)
    },
    gogogogo(route){
      this.$router.replace(route)
      console.log('跳转子页面2',route)
    }
  }
}
</script>
<style scoped>
.menu_item2 .el-menu-item{
  text-indent: 20px;
}
</style>
