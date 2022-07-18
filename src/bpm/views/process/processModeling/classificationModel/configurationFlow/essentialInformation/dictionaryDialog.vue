<template>
  <el-dialog :title="$t('selectDataSource')" :visible.sync="dialogVisible" v-loading="load" top="5vh" append-to-body>
    <el-table
        :data="content.list"
        style="width: 100%; margin: 10px 0"
        stripe
        :header-cell-style="{background: '#E1EAFD !important'}"
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column :label="$t('placeholderText.select')" width="50" align="center">
          <template slot-scope="scope">
            <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column width="160px">
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="dictionaryen" @keyup.enter.native="seach" :placeholder="$t('placeholderText.numberSearch')" />
          </template>
          <el-table-column prop="dictionaryen" :label="$t('numbering')" align="center"/>
        </el-table-column>
        <el-table-column width="160px">
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="dictionarycn" @keyup.enter.native="seach" :placeholder="$t('placeholderText.nameSearch')" />
          </template>
          <el-table-column prop="dictionarycn" :label="$t('name2')" align="center"/>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="customsql" @keyup.enter.native="seach" :placeholder="$t('placeholderText.SQLStatementSearch')" />
          </template>
          <el-table-column prop="customsql" :label="$t('sqlStatement2')" align="center"/>
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
      pageSize: 10,
      dictionaryen: '',
      dictionarycn: '',
      customsql: ''
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: String,
      default: ()=>{
        return ''
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.getList()
      }
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
          this.selectIndex = -1
          if(this.item){
            this.selectIndex = this.content.list.findIndex(item => item.dictionaryen === this.item)
          }
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
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog__wrapper {
    /deep/ .el-dialog {
      min-width: 800px;
      width: 70%;
    }
  }
</style>
