<template>
  <div id="station">
    <div class="pad-10px pad-t15px h100">
      <el-scrollbar class="h100">
        <bas-table
          class="main_tab"
          row-key="id"
          :tableList="processList"
          :headerList="headerList"
          :isShowPagination="false"
        >
        </bas-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { racilistsOther } from '@/bpa/api/jobsCenter'

export default {
  name: 'raci',
  props: {
    ids: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 表头字段
      headerList: [
        {
          label: this.$t('process'),
          prop: 'listname'
        },
        {
          label: this.$t('activity'),
          prop: 'nodename'
        },
        {
          label: this.$t('responsible_r'),
          prop: 'responsible'
        },
        {
          label: this.$t('approver_a'),
          prop: 'approers'
        },
        {
          label: this.$t('consultants'),
          prop: 'consultants'
        },
        {
          label: this.$t('onlyThose_i'),
          prop: 'noticers'
        }
      ],
      processList: [],
      process: this.$t('process'),
      activity: this.$t('activity'),
      responsible: this.$t('responsible_r'),
      approver: this.$t('approver_a'),
      consultants: this.$t("consultants"),
      onlyThose: this.$t('onlyThose_i'),
    }
  },
  mounted () {
    let arr = this.ids.map(item => {
      return item.id
    })
    this.getProcesslists(arr.join(','))
  },
  methods: {
    getProcesslists (params) {
      racilistsOther(params).then(res => {
        if (!res) return false
        this.processList = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
#station {
  height: calc(100vh - 200px);
  /deep/ .el-scrollbar__wrap {
    padding: 0 !important;
  }
}
</style>
