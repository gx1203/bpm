<template>
  <div class="display-flex">
    <p
      v-for="(item, index) in curModule.children"
      :key="index"
      :class="$route.matched[1].name === item.name ? 'nav-item active' : 'nav-item'"
      @click="toChild(item)">
      <i :class="item.meta.icon"></i>
      {{item.meta.title}}
    </p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('app')

export default {
  name: 'NavHeader',
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters(['tabList']),
    // userInfo () {
    //   return this.$store.state.basuser.user
    // },
    curModule () {
      const arr = this.$route.matched
      return this.tabList.find(item => item.name === arr[0].name)
    }
  },
  mounted() {
    this.userInfo = localStorage.getItem('userInfo')
  },

  methods: {
    toChild (item) {
      this.$router.push({ name: item.name })
    }
  }
}
</script>

<style lang="scss" scoped>
  .nav-item {
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    cursor: pointer;
    color: $tc1;
    margin: 0px 10px;
    border-bottom: 2px solid transparent;
  }
  .active {
    border-bottom: 2px solid $bc3;
    color: $bc3;
  }
</style>
