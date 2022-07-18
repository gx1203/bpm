<template>
  <div id="station">
    <div class="pad-10px pad-t15px h100">
      <el-scrollbar class="h100">
        <el-table
          :data="processList"
          border
          class="main_tab">
          <el-table-column
            prop="listname"
            width="150"
            label="流程">
          </el-table-column>
          <el-table-column
            prop="nodename"
            width="100"
            label="活动">
          </el-table-column>
          <el-table-column
            prop="description"
            label="工作职责">
          </el-table-column>
          <el-table-column
            prop="raci"
            width="80"
            label="RACI">
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { getStationlistsOther } from '@/bpa/api/jobsCenter'
export default {
  name: 'station',
  data() {
    return {
      processList: []
    }
  },
  props: {
    idArr: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    idArr: {
      handler: function(newVal, oldVal) {
        console.log(newVal)
        this.ids = newVal
        if (newVal && newVal.length > 0) {
          this.getProcesslists(newVal.join(','))
        } else {
          this.getProcesslists(null)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    getProcesslists (params) {
      getStationlistsOther(params).then(res => {
        if (!res) return false
        this.processList = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
*{
  box-sizing: border-box;
}
#station {
  height: calc(100vh - 200px);
  /deep/ .el-scrollbar__wrap{
      padding: 0!important;
  }
}
</style>
