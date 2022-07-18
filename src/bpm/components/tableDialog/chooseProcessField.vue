<template>
  <el-dialog :title="$t('placeholderText.selectTheFieldNameForThePage')" :visible.sync="dialogVisible" v-if="dialogVisible" v-loading="loading" width="80%" top="10vh" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <el-table
      v-if="isMore"
      :data="tableList"
      stripe
      :header-cell-style="{background: '#E1EAFD !important'}"
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      max-height="300"
      :row-key="getRowKeys">
      <el-table-column type="selection" width="55" fixed align="center"></el-table-column>
      <el-table-column prop="fieldName" :label="$t('fieldName')" min-width="150" align="center"></el-table-column>
      <el-table-column prop="fieldShowName" :label="$t('chineseName')" min-width="150" align="center"></el-table-column>
      <el-table-column prop="relationType" :label="$t('tableName')" min-width="150" align="center"></el-table-column>
    </el-table>
    <el-table
      v-else
      :data="tableList"
      stripe
      :header-cell-style="{background: '#E1EAFD !important'}"
      highlight-current-row
      style="width: 100%;margin-top: 10px;"
      @current-change="handleCurrentChange"
      ref="multipleTable"
      max-height="300"
      :row-key="getRowKeys">
      <el-table-column prop="fieldName" :label="$t('fieldName')" min-width="150" align="center"></el-table-column>
      <el-table-column prop="fieldShowName" :label="$t('chineseName')" min-width="150" align="center"></el-table-column>
      <el-table-column prop="relationType" :label="$t('tableName')" min-width="150" align="center"></el-table-column>
      <el-table-column :label="$t('select')" width="100" align="center">
        <template slot-scope="scope">
          <el-radio v-model="selectIndex" :label="scope.$index">{{''}}</el-radio>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirmButton') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getAllTablesByNodeId } from '@/bpm/api/process/processModeling/classificationModel'
export default {
  components: {
  },
  data () {
    return {
      tableList: [],
      dialogVisible: this.value,
      loading: false,
      selectIndex: -1,
      multipleSelection: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default () {
        return {}
      }
    },
    tableItem: {
      type: Object,
      default () {
        return {}
      }
    },
    nodeId: {
      type: String,
      default () {
        return ''
      }
    },
    type: {
      type: String,
      default () {
        return ''
      }
    },
    isMore: {
      type: Boolean,
      default: true
    },
    mainTableName: {
      type: String,
      default () {
        return ''
      }
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.quickQueryData()
      } else {
        this.$refs.multipleTable.clearSelection()
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getRowKeys (row) {
      return row.id
    },
    // 单选
    handleCurrentChange (val) {
      if (val) {
        this.selectIndex = this.tableList.findIndex(item => item.id === val.id)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    quickQueryData () {
      this.loading = true;
      this.selectIndex = -1
      getAllTablesByNodeId(this.nodeId).then(rt => {
        this.loading = false
        if (rt.status === '200' && rt.data) {
          if (this.type === 'columnTotal') {
            this.tableList = rt.data.filter(item => (item.inputType === 'number' || item.inputType === 'double') && this.itemData.id !== item.id)
            if (this.itemData.relationType !== this.mainTableName) {
              this.tableList = this.tableList.filter(item => (item.relationType === this.itemData.relationType || item.relationType === this.mainTableName))
            }
          } else {
            this.tableList = rt.data.filter(item => item.inputType === 'text')
            if (this.tableItem.relationFieldId) {
              let arr = this.tableItem.relationFieldId.split(',')
              arr.forEach(val => {
                this.tableList.find(item => {
                  if (val === item.id) {
                    this.toggleSelection([item])
                  }
                })
              })
            }
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },
    toggleSelection (rows) {
      this.$nextTick(() => {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          })
        }
      })
    },
    submit () {
      if (this.isMore) {
        this.$emit('confirm', this.multipleSelection)
      } else {
        if (this.selectIndex >= 0) {
          const data = JSON.parse(JSON.stringify(this.tableList[this.selectIndex]))
          this.$emit('confirm', data)
        }
      }
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
