<template>
  <div class="w100">
    <el-table :data="recordlist" class="main_tab">
      <el-table-column
        v-if="existTabField('number', 'refer')"
        :label="existTabField('number', '', true)"
        type="index"
        width="50"
      />
      <el-table-column
        v-if="existTabField('theme', 'refer')"
        :label="existTabField('theme', '', true)"
        prop="subject"
      />
      <el-table-column
        v-if="existTabField('processNodeName', 'refer')"
        :label="existTabField('processNodeName', '', true)"
        prop="processnodename"
        width="200"
      />
      <el-table-column
        v-if="existTabField('approver', 'refer')"
        :label="existTabField('approver', '', true)"
        prop="username"
        width="80"
      />
      <el-table-column
        v-if="existTabField('approvalTime', 'refer')"
        :label="existTabField('approvalTime', '', true)"
        prop="approvaltime"
        width="150"
      />
      <el-table-column
        v-if="existTabField('appOperate', 'refer')"
        :label="existTabField('appOperate', '', true)"
        prop="approvaloperation"
        width="80"
      />
      <el-table-column
        v-if="existTabField('remark', 'refer')"
        :label="existTabField('remark', '', true)"
        prop="remark"
        width="200"
      />
    </el-table>
  </div>
</template>
<script>
import {
  getRecordlist
  // getRecordlist2
} from '@/bpa/api/processDesignCenter'

export default {
  name: 'AppovalRecord',
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
  data() {
    return {
      recordlist: []
    }
  },
  watch: {
    'showtabfiled'(val) {
      console.log(val)
      this.getRecord()
    }
  },
  methods: {
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
    getRecord() {
      getRecordlist(this.modelid).then(res => {
        console.log(res)
        this.recordlist = res
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
