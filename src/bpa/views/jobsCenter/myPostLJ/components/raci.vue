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
            prop="responsible"
            label="责任者(R)">
          </el-table-column>
          <el-table-column
            prop="approers"
            label="审批者(A)">
          </el-table-column>
          <!-- <el-table-column
            prop="consultants"
            label="咨询者(C)">
          </el-table-column> -->
          <el-table-column
            prop="noticers"
            label="知会者(I)">
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { racilists } from '@/bpa/api/jobsCenter'

export default {
  name: 'raci',
  data() {
    return {
      processList: []
    }
  },
  computed: {
    userid() {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  props: {
    orgIds: {
      type: String,
      default: ''
    }
  },
  watch: {
    orgIds: {
      handler (obj) {
        console.log(obj)
        if (obj) {
          this.getProcesslists(obj)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    getProcesslists (obj) {
      racilists(obj).then(res => {
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
