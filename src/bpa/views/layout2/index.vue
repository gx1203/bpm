<template>
  <div id="main">
    <app-header />
    <div id="container">
      <left-menu />
      <div class="view_wrap">
        <el-scrollbar>
          <router-view :key="key" />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import LeftMenu from './LeftMenu'
import {createNamespacedHelpers} from 'vuex'
const userInfo = createNamespacedHelpers('userInfo')
export default {
  components: {
    LeftMenu
  },
  computed: {
    // key() {
    //   return this.$route.fullPath
    // }
    ...userInfo.mapState(['userMenu']),
    ...userInfo.mapGetters(['curModule']),
  },
  watch: {
    curModule: {
      handler: function (val) {
        this.key = val.url
      },
      deep: true,
      immediate: true
    },
    '$route': {
      handler: function (val) {
        for (let i = 0, len = this.userMenu.length; i < len; i++) {
          let item = this.userMenu[i]
          let subNodes = []
          if (item.subNodes) {
            this.getPath(item.subNodes, subNodes)
          }
          if (subNodes.map(el => el.url).includes(val.fullPath)) {
            this.setCurModule(item)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...userInfo.mapMutations(['setCurModule']),
    // ...mapActions(['refreshModuleList'])
    getPath (list, subNodes) {
      for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i]
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
#main {
  background-color: $bc2;
}
</style>
