<template>
  <el-dialog
    :title="$t('hintText.hint')"
    :visible.sync="loginExpiredShow"
    width="420px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <span class="expired-content"><i class="warning el-icon-warning"/>{{$t('hintText.loginExpired')}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="confirm()">{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('app')
export default {
  data() {
    return {
    };
  },
  props: {
    value: {
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['loginExpiredShow'])
  },
  methods: {
    ...mapMutations(["setLoginExpiredShow"]),
    confirm() {
      localStorage.removeItem('user')
      localStorage.removeItem('userid')
      this.$store.dispatch('basuser/saveUser', {})
      this.$store.commit('userInfo/setUserMenu', [])
      this.$store.commit('app/setTabList', [])
      this.$store.commit('app/setLoginExpiredShow', false)
      this.$store.commit('app/setCarouselShow', true)
      window.location.replace('#/login')
    }
  }
};
</script>


<style lang="scss" >
.expired-content {
  display: inline-block;
  line-height: 24px;
  .warning {
    color: #e6a23c;
    margin-right: 10px;
    font-size: 24px;
    vertical-align: middle;
  }
}
</style>
