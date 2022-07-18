<template>
  <div class="scheduled-task-container">
    <bas-scheduled-task tableStyle='bpmnew' :iconShow="true"  />
  </div>
</template>
<script>
  import Vue from 'vue'
  import BasScheduledTask from 'bas-component'
  Vue.use(BasScheduledTask)
  import 'bas-component/lib/BasComponent.css'
  export default {
    name: 'ScheduledTask',
    components: {

    },
    data() {
      return {

      }
    },
    watch: {

    },
    mounted() {

    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
.scheduled-task-container {
  box-sizing: border-box;
  height: 100%;
  ::v-deep .el-card__body {
    padding: 10px 30px 10px 10px !important;
  }
}
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 20px;
    }
  }
  .w100 {
    width: 100%;
  }
</style>
