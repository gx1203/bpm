<template>
  <div class="w100">
    <el-table :data="lists" class="main_tab" stripe>
      <el-table-column :label="existTabField('ordinal', '', true)" type="index"></el-table-column>
      <el-table-column :label="existTabField('Item name', '', true)" prop="name"></el-table-column>
      <el-table-column :label="existTabField('department', '', true)" prop="deptname"></el-table-column>
      <el-table-column :label="existTabField('responsibility', '', true)" prop="duty"></el-table-column>
      <el-table-column :label="existTabField('Time limit', '', true)" prop="timelimit">
        <template slot-scope="scope">{{scope.row.timelimit + 'H'}}</template>
      </el-table-column>
      <el-table-column :label="existTabField('creator', '', true)" prop="username"></el-table-column>
      <el-table-column :label="existTabField('creation time', '', true)" prop="createon"></el-table-column>
      <el-table-column :label="existTabField('status', '', true)" prop="status">
        <template slot-scope="scope">
          <span>{{scope.row.status == '2'?$t('haveBeenVoided') : $t('HaveSynchronous')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="pages.pageNum" :page-sizes="[10, 15, 20]" :page-size="pages.pageSize" background
      layout="prev, pager, next, jumper, total" :total="pages.total"></el-pagination>
  </div>
</template>
<script>
import { getPermissionTableList } from '@/bpa/api/componentsApi'
import paginations from '@/bpa/mixins/pagination_mixin'
import {
  getRecordlist
  // getRecordlist2
} from '@/bpa/api/processDesignCenter'
export default {
  name: 'author',
  data () {
    return {
      lists: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  props: {
    treeId: {
      type: String,
      default: ''
    },
    showtabfiled: {
      type: Array,
      default: () => []
    },
    modelid: {
      type: String,
      default: ''
    }
  },
  mixins: [paginations],
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    action () {
      return `${this.host}/mangercenterdoc/uploadCopy?username=${this.userid}`
    }
  },
  watch: {
    'showtabfiled'(val) {
      console.log(val)
      this.getRecord()
    }
  },
  mounted () {
    console.log(this.treeId)
    this.getList()
  },
  methods: {
    getRecord() {
      getRecordlist(this.modelid).then(res => {
        this.recordlist = res
      })
    },
    // 判断条件
    existTabField(pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      if (type == 'refer') {
        // console.log(!!obj.pname)
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return !obj.pname ? '' : obj.name + (!bool ? ':' : '')
      }
    },
    getList () {
      getPermissionTableList({
        pagenum: this.pages.pageNum,
        pagesize: this.pages.pageSize,
        id: this.modelid
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.lists = res.list
        this.pages.total = res.total
      })
    },
    handleCurrentChange (val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange () { }
    // tableRowClassName({row, rowIndex}) {
    //   console.log(row.status)
    //   console.log(rowIndex)
    //   if (row.status === '2') {
    //     return 'warning-row'
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table .warning-row {
  background: #e4e7ed;
}
</style>
