<template>
  <div class="view_wrap">
    <div class="bpm-iframe">
      <iframe :src="designUrl" frameborder="0"/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      designUrl: './leftMenu/BaseNewPage.html?id=ABB8089C1C0B4AB3E0531701A8C0B7A1&listid=ABB48123567C6027E0531701A8C09449&isReadAttr=true'
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    // designUrl() {
    //   return `${this.host}/leftMenu/BaseNewPage.html?id=ABB8089C1C0B4AB3E0531701A8C0B7A1&listid=ABB48123567C6027E0531701A8C09449&isReadAttr=true`
    // },
    username() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    },
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    action() {
      return `${this.host}/attach/upload2?username=${this.userid}`
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .bpm-iframe{
    width: 100%;
    height: calc(100vh - 165px);
    iframe{
      width: 100%;
      height: 100%;
    }
  }
</style>
