<template>
  <div>
    <bas-page-bpm-staging-personal-processTrace tableStyle= 'bpmnew' :host="host" :VUE_APP_BPA_URL="VUE_APP_BPA_URL" />
  </div>
</template>
<script>
export default {
  name: 'stagingPersonalProcessTrace',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    VUE_APP_BPA_URL() {
      return process.env.VUE_APP_BPA_URL;
    }
  }
}
</script>