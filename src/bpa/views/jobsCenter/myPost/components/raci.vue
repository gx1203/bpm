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
          <template #responsible="scope">
            <span style="color: #2d42af;" v-show="scope.row.raci === 'R'">{{scope.row.responsible}}</span>
            <span v-show="scope.row.raci !== 'R'">{{scope.row.responsible}}</span>
          </template>
          <template #approers="scope">
            <span style="color: #2d42af;" v-show="scope.row.raci === 'A'">{{scope.row.approers}}</span>
            <span v-show="scope.row.raci !== 'A'">{{scope.row.approers}}</span>
          </template>
          <template #consultants="scope">
            <span style="color: #2d42af;" v-show="scope.row.raci === 'C'">{{scope.row.consultants}}</span>
            <span v-show="scope.row.raci !== 'C'">{{scope.row.consultants}}</span>
          </template>
        </bas-table>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { racilists } from '@/bpa/api/jobsCenter'

export default {
  name: 'Raci',
  props: {
    orgIds: {
      type: String,
      default: ''
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
          prop: 'responsible',
          slotName: 'responsible'
        },
        {
          label: this.$t('approver_a'),
          prop: 'approers',
          slotName: 'approers'
        },
        {
          label: this.$t('consultants'),
          prop: 'consultants',
          slotName: 'consultants'
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
      consultants: this.$t('consultants'),
      onlyThose: this.$t('onlyThose_i'),
    }
  },
  computed: {
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    }
  },
  watch: {
    orgIds: {
      handler (obj) {
        if (obj) {
          this.getProcesslists(obj)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () { },
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
