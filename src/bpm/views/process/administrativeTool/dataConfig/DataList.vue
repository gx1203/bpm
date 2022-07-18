<template>
  <div class="DataList">
    <bas-data-list :menukey="menukey" ></bas-data-list>
  </div>
</template>
<script>
import Vue from 'vue'
import BasComponent from 'bas-component'
Vue.use(BasComponent)
import 'bas-component/lib/BasComponent.css'
export default {
  name: 'DataList',
  components: {
  },
  data() {
    return {
      menukey:''
    }
  },
  created() {
  },
  mounted() {
      this.menukey = this.$route.params.menukey
  }
}
</script>