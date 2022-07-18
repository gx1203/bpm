<template>
  <div class="w100">
    <el-table :data="successKeylist" class="main_tab" stripe>
      <el-table-column v-if="existTabField('number', 'refer')" :label="existTabField('number', '', true)" type="index"
        width="50"></el-table-column>
      <el-table-column v-if="existTabField('code', 'refer')" prop="code" width="80"
        :label="existTabField('code', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('ksfName', 'refer')" prop="kcpname"
        :label="existTabField('ksfName', '', true)"></el-table-column>
      <el-table-column v-if="existTabField('elements', 'refer')" prop="controlelement"
        :label="existTabField('elements', '', true)"></el-table-column>
    </el-table>
    <el-pagination @current-change="handleSuccessChange" :current-page="successpages.pageNum" background
      layout="prev, pager, next, jumper, total" :total="successpages.total"></el-pagination>
  </div>
</template>
<script>
import { getSuccessElement } from '@/bpa/api/processDesignCenter'

import fileOperation from '@/bpa/mixins/fileDownView'
export default {
  name: 'keyElement',
  data () {
    return {
      successKeylist: [],
      successpages: {
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
      this.getSuccesslist(1)
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
    getSuccesslist (pageNum) {
      getSuccessElement({
        filters: [{ key: 'listid', value: this.modelid }],
        orderby: 'code',
        pageNum: !pageNum ? 1 : pageNum,
        pageSize: 10,
        sort: 'asc'
      }).then(res => {
        console.log(res)
        this.successKeylist = res.list
        this.successpages.total = res.total
      })
    },
    handleSuccessChange (val) {
      this.successpages.pageNum = val
      this.getSuccesslist(val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
