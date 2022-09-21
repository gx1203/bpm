<template>
  <div id="app" class="page-component__scroll">
    <el-scrollbar class="scrollbar">
      <router-view />
      <login-expired />
    </el-scrollbar>
    <el-backtop
      target=".page-component__scroll .el-scrollbar__wrap"
      :bottom="100"
      :visibility-height="20"
    >
      <div
        style="
           {
            height: 100%;
            width: 100%;
            border-radius: 50%;
            background-color: #d6d6d6;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
            font-size: 14px;
            font-weight: bold;
          }
        "
      >
        顶部
      </div>
    </el-backtop>
  </div>
</template>
<script>
import loginExpired from '@/bpm/components/loginExpired'
export default {
  name: 'App',
  components: {
    loginExpired,
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.page-component__scroll{
  background-color: #fff;
}
.scrollbar {
  height: 100%;
}
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
