<template>
  <div id="bpmMonthVerificationSheet">
    <projectApproval />
  </div>
</template>
<script>
import projectApproval from "@/bpm/views/monitor/report/projectApproval";
export default {
  components: {
    projectApproval
  },
  data() {
    return {
    }
  },
  computed: {
    iframeUrl () {
      // return `http://localhost:9527/#/monitor/reportMonitoring/projectApproval/report?id=91d9b19d573c11eba868fa163e77a71d`
      return `${process.env.VUE_APP_HOST_URL}/#/monitor/reportMonitoring/projectApproval/report?id=91d9b19d573c11eba868fa163e77a71d`
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  #bpmMonthVerificationSheet {
    /deep/ .el-card {
      background-color: transparent;
      .el-table {
        background-color: transparent;
        border: none !important;
        &:before, &:after {
          display: none;
        }
        .el-table__header-wrapper {
          th {
            color: #ffffff;
            background: #09265e !important;
            border: none !important;
          }
        }
        tr {
          background-color: transparent;
        }
        td {
          color: #ffffff;
          background-color: transparent;
          border: none !important;
          border-bottom: 1px solid #4d576f !important;
        }
      }
      .el-form-item__label {
        color: #ffffff;
      }
      .el-pagination {
        .el-pagination__total, .el-pagination__jump {
          color: #ffffff;
        }
      }
    }
  }
</style>
