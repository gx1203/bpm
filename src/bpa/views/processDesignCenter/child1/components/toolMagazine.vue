<template>
  <div class="w100">
    <el-table :data="lists" class="main_tab" stripe>
      <el-table-column :label="existTabField('number', '', true)" type="index"></el-table-column>
      <el-table-column prop="toolname" :label="existTabField('names', '', true)"></el-table-column>
      <el-table-column prop="toolversion" :label="existTabField('ToolVersion', '', true)"></el-table-column>
      <el-table-column prop="limituse" :label="existTabField('rangeOfApplication', '', true)"></el-table-column>
      <el-table-column prop="remark" :label="existTabField('remarks', '', true)"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange"
      :current-page.sync="pages.pageNum" :page-sizes="[10, 15, 20]" :page-size="pages.pageSize" background
      layout="prev, pager, next, jumper, total" :total="pages.total"></el-pagination>
  </div>
</template>
<script>
import {
  queryToolsModellist
} from '@/bpa/api/processDesignCenter'
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
    showtabfiled: {
      type: Array,
      default: () => []
    },
    treeId: {
      type: String,
      default: ''
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
  mounted () {
    console.log(this.treeId)
    this.getList()
  },
  watch: {
    'showtabfiled'(val) {
      console.log(val)
      this.getRecord()
    }
  },
  methods: {
    getRecord() {
      getRecordlist(this.modelid).then(res => {
        console.log(res)
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
      queryToolsModellist({
        attr: {},
        filters: [
          { key: 'listid', opt: 'EQ', type: 'S', value: this.modelid }
        ],
        orderby: 'createon',
        sort: 'desc',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize
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
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-table .warning-row {
  background: #e4e7ed;
}
</style>
