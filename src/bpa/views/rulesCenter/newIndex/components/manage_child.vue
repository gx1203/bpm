<template>
  <div class="w100">
    <div v-for="item in data" :key="item.id">
      <p class="letter" :class="{'section': item.type === 'section'}">
        {{item.content}}
      </p>
      <manage-father :data="item.childrens" v-if="!!item.childrens && item.childrens.length > 0" />
    </div>
  </div>
</template>
<script>

export default {
  name: 'manageChild',
  data () {
    return {}
  },
  beforeCreate: function () {
    this.$options.components.manageFather = require('./manage_father.vue').default
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    base_url () {
      return process.env.BASE_URL
    },
    action() {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}').empuid
    }
  },
  mounted() {
  },
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.letter {
  word-break: break-all;
  line-height: 22px;
  text-indent: 2.3em;
}
.section {
  font-weight: bold;
  font-size: 16px;
  line-height: 28px;
  text-indent: inherit;
}
</style>
