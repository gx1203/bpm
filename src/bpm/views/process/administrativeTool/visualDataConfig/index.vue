<template>
  <div class="visualDataConfig">
    <bas-data-table-config :basDragForm="basDragForm" tableStyle="bpmnew" :viewUrl="viewUrl"></bas-data-table-config>
  </div>
</template>
<script>
export default {
  name: 'visualDataConfig',
  components: {
  },
  data() {
    return {
      basDragForm:'basDragForm',
      viewUrl:'basDataList',
    }
  },
  created() {
  },
  mounted() {
  }
}
</script>
