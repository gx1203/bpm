<template>
  <div class="w100">
    <el-table :data="risklist" class="main_tab" stripe>
      <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index"
        width="50"></el-table-column>
      <el-table-column v-if="existTabField('riskIdentifier', 'refer')" prop="code" width="80"
        :label="existTabField('riskIdentifier', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('riskName', 'refer')" prop="kcpname" width="160"
        :label="existTabField('riskName', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('controlelement', 'refer')" prop="controlelement"
        :label="existTabField('controlelement', '', true)" show-overflow-tooltip  min-width="130">
          <template slot-scope="scope">
            <div>{{scope.row.controlelement}}</div>
          </template>
      </el-table-column>
      <el-table-column v-if="existTabField('controlNum', 'refer')" prop="targetcomprate" width="80"
        :label="existTabField('controlNum', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('controlName', 'refer')" prop="processtarget" width="160"
        :label="existTabField('controlName', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('controlDemand', 'refer')" prop="risk" width="160"
        :label="existTabField('controlDemand', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('ownerdept', 'refer')" prop="sampleselect" width="160"
        :label="existTabField('ownerdept', '', true)"></el-table-column>
<!--      <el-table-column v-if="existTabField('formationAccording', 'refer')" prop="remark" width="160"-->
<!--        :label="existTabField('formationAccording', '', true)"></el-table-column>-->
<!--      <el-table-column v-if="existTabField('testIvdence', 'refer')" prop="testprogram" width="160"-->
<!--        :label="existTabField('testIvdence', '', true)"></el-table-column>-->
    </el-table>
    <el-pagination @current-change="handleKeyChange" :current-page="keypages.pageNum" background
      layout="prev, pager, next, jumper, total" :total="keypages.total"></el-pagination>
  </div>
</template>
<script>
import { getRisk } from '@/bpa/api/processDesignCenter'

import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  name: 'riskNecessary',
  data () {
    return {
      risklist: [],
      keypages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    },
    download () {
      return this.host + '/attach/download/'
    },
    viewfile () {
      return this.host + '/document/print/'
    },
    userid () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .empuid
    },
    username () {
      return JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
        .cnname
    }
  },
  props: {
    showtabfiled: {
      type: Array,
      default: () => []
    },
    modelid: {
      type: String,
      default: ''
    }
  },
  mixins: [fileOperation],
  watch: {
    showtabfiled (val) {
      console.log(val)
      console.log(this.modelid)
      this.getRisklist(1)
    }
  },
  methods: {
    // 判断条件
    existTabField (pname, type, bool) {
      let obj = {}
      this.showtabfiled.forEach(item => {
        if (item.pname === pname) {
          obj = JSON.parse(JSON.stringify(item))
          return false
        }
      })
      let lang = localStorage.getItem("language")
      if (type == 'refer') {
        return !!obj.pname
      } else if (type == 'necessary') {
        return obj.necessary == '1'
      } else {
        return obj.pname && lang === 'cn' ? obj.name + (!bool ? ':' : '') : obj.pname && lang === 'en' ? obj.enname + (!bool ? ':' : '') : obj.enname + (!bool ? ":" : "")
      }
    },
    // 获取关键风险控制点
    getRisklist (pageNum) {
      getRisk({
        filters: [{ key: 'listid', value: this.modelid }],
        orderby: 'code',
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: 'asc'
      }).then(res => {
        console.log(res)
        this.risklist = res.list
        this.keypages.total = res.total
      })
    },
    handleKeyChange (val) {
      this.keypages.pageNum = val
      this.getRisklist(val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
