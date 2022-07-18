<template>
  <div id="app">
    <router-view />
    <login-expired />
  </div>
</template>
<script>
import loginExpired from '@/bpm/components/loginExpired'
export default {
  name: 'App',
  components: {
    loginExpired
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
