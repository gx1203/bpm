<template>
  <div class="bas-employee-container">
    <bas-employee tableStyle= 'bpmnew' :showPartTimeJob="true" class="bas-employee" :host="host" />
  </div>
</template>
<script>
import Vue from 'vue'
import BasEmployee from 'bas-component'
Vue.use(BasEmployee)
import 'bas-component/lib/BasComponent.css'

// import BasEmployee from '../../../../components/basComponents/BasEmployee/index'
export default {
  name: 'StaffManage',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    }
  }
}
</script>
<style lang="scss" scoped>
.bas-employee {
  /deep/ .content {
    height: auto;
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
