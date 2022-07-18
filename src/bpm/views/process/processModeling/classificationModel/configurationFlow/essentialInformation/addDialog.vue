<template>
  <el-dialog :title="$t('selectField')" id='addFieldDialog' :visible.sync="dialogVisible" v-loading="load" top="5vh" width="60%" append-to-body>
    <!-- 新建按钮 -->
    <el-row type="flex" justify="end">
      <router-link target="_blank" :to="{ path:'/process/processClassification/fieldMaintenance', query:{ isShowAddDialog: 'true' }}">
        <el-button type="primary">{{ $t('newAdd') }}</el-button>
      </router-link>
    </el-row>
    <el-table
        :data="content.list"
        stripe
        :header-cell-style="{background: '#E1EAFD !important'}"
        highlight-current-row
        style="width: 100%; margin: 10px 0"
        @selection-change="handleCurrentChange">
        <el-table-column type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="fieldName" @keyup.enter.native="seach" :placeholder="$t('placeholderText.enterSettingsProcessTabCard')" />
          </template>
          <el-table-column prop="fieldName" :label="$t('fieldName')" align="center"/>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="fieldShowName" @keyup.enter.native="seach" :placeholder="$t('placeholderText.showTextSearch')" />
          </template>
          <el-table-column prop="fieldShowName" :label="$t('displayText')" align="center"/>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
               <el-select clearable v-model="inputType"  @change="seach" clearable class="w100" :placeholder="$t('placeholderText.fieldTypeSearch')">
              <el-option
                v-for="item in subparagraphType"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <el-table-column prop="inputType" :label="$t('fieldType')" align="center">
             <template slot-scope="scope">
            {{getInputType(scope.row.inputType)}}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="length" @keyup.enter.native="seach" :placeholder="$t('placeholderText.fieldLengthSearch')" />
          </template>
          <el-table-column prop="length" :label="$t('fieldLength')" align="center"/>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input clearable v-model="datasource" @keyup.enter.native="seach" :placeholder="$t('placeholderText.dataSourceSearch')" />
          </template>
          <el-table-column prop="datasource" :label="$t('dataSources')" align="center"/>
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
import { getFieldLibraryList } from '@/bpm/api/process/advancedConfig/field_maintenance.js'
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'

export default {
  data () {
    return {
      content: {},
      dialogVisible: this.value,
      load: false,
      pageNum: 1,
      pageSize: 10,
      multipleSelection: [],
      subparagraphType: [],
      fieldName: '',
      fieldShowName: '',
      inputType: '',
      length: '',
      datasource: ''
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
    getInputType (status) {
      const result = this.subparagraphType.find(item => item.value === status)
      return result ? result.text : '未知'
    },
    seach () {
      this.pageNum = 1
      this.getList()
    },
    getList () {
      this.load = true
      getFieldLibraryList({
        logic: 'and',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        filters: [
          {'key': 'fieldName', 'opt': 'LIKE', 'type': 'S', 'value': this.fieldName},
          {'key': 'fieldShowName', 'opt': 'LIKE', 'type': 'S', 'value': this.fieldShowName},
          {'key': 'inputType', 'opt': 'EQ', 'type': 'S', 'value': this.inputType},
          {'key': 'length', 'opt': 'LIKE', 'type': 'S', 'value': this.length},
          {'key': 'datasource', 'opt': 'LIKE', 'type': 'S', 'value': this.datasource}
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
      this.multipleSelection = val
    },
    getData () {
      getDictionaryOption({
        dictionaryen: 'subparagraphType'
      }).then(rt => {
          if (rt.status === '200') {
            this.subparagraphType = rt.data
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    submit () {
      if (this.multipleSelection.length > 0) {
        this.$emit('confirm', this.multipleSelection)
      }
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
    }
  },
  mounted () {
    this.getData ()
    this.getList()
  }
}
</script>

<style lang="scss">
#addFieldDialog {
.el-table .cell{

    text-overflow: unset;
}
}
</style>
