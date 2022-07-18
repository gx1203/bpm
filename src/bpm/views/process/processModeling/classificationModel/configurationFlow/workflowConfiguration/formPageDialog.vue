<template>
  <el-dialog :title="$t('selectFormPage')" :visible.sync="dialogVisible" v-loading="load" append-to-body>
    <el-table
        :data="content.list"
        border
        style="width: 100%; margin: 10px 0"
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column :label="$t('placeholderText.select')" width="50" align="center">
          <template slot-scope="scope">
            <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="dictionarycn" @keyup.enter.native="seach" :placeholder="$t('placeholderText.nameSearch')" />
          </template>
          <el-table-column prop="dictionarycn" :label="$t('name2')" align="center"/>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="dictionaryen" @keyup.enter.native="seach" :placeholder="$t('typeNameSearch')" />
          </template>
          <el-table-column prop="dictionaryen" :label="$t('typeName')" align="center"/>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="customsql" @keyup.enter.native="seach" :placeholder="$t('tableNameSearch')" />
          </template>
          <el-table-column prop="customsql" :label="$t('tableName')" align="center"/>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          :page-size="pageSize" :current-page.sync="pageNum" :total="content.total"
          background @current-change="handlePageChanged"/>
      </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getDictoraryList } from '@/bpm/api/configManage/dataDictorary'
export default {
  data () {
    return {
      content: {},
      dialogVisible: this.value,
      load: false,
      selectIndex: -1,
      pageNum: 1,
      pageSize: 5,
      dictionaryen: '',
      dictionarycn: '',
      customsql: ''
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    seach () {
      this.pageNum = 1
      this.getList()
    },
    getList () {
      this.load = true
      getDictoraryList({
        logic: 'and',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        filters: [
          {'key': 'dictionaryen', 'opt': 'LIKE', 'type': 'S', 'value': this.dictionaryen},
          {'key': 'dictionarycn', 'opt': 'LIKE', 'type': 'S', 'value': this.dictionarycn},
          {'key': 'customsql', 'opt': 'LIKE', 'type': 'S', 'value': this.customsql}
        ]
      }).then(rt => {
        if (rt.status === '200') {
          this.content = rt.data
        }
        this.load = false
      }).catch(() => {
        this.load = false
      })
    },
    handlePageChanged () {
      this.getList()
    },
    handleCurrentChange (val) {
      if (val) {
        this.selectIndex = this.content.list.findIndex(item => item.id === val.id)
      }
    },
    submit () {
      if (this.selectIndex >= 0) {
        const data = JSON.parse(JSON.stringify(this.content.list[this.selectIndex]))
        this.$emit('confirm', data)
      }
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style scoped>
</style>
