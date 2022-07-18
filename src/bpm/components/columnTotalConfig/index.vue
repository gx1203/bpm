<template>
  <el-dialog id="sbox" :modal="false" :title="$t('fieldCalculationConfiguration')" :visible.sync="dialogVisible" v-if="dialogVisible" v-loading="loading" width="600px" top="10vh"
    :close-on-click-modal="false">
    <el-row class="margin-b10">
      <span class="red" style="margin-right: 3px;">*</span>{{$t('computedField')}}：{{itemData.fieldShowName}}
    </el-row>
    <el-table
      :data="tableList"
      stripe
      :header-cell-style="{ background: '#E1EAFD !important' }"
      highlight-current-row
      style="width:100%;"
      max-height="300">
      <el-table-column :label="$t('number')" type="index" align="center">
      </el-table-column>
      <el-table-column :label="$t('computeMode')" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-select clearable v-model="scope.row.method">
            <el-option
              v-for="item in computeModeList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>{{$t('fieldNames')}}
        </template>
        <template slot-scope="scope">
          <el-input clearable type="text" :title="scope.row.fieldCnname" v-model="scope.row.fieldCnname" @focus="fieldCnnameFocus(scope.row)" @clear="fieldCnnameClear(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operativeSymbol')" align="center" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>{{$t('operativeSymbol')}}
        </template>
        <template slot-scope="scope">
          <el-select clearable v-model="scope.row.operator">
            <el-option
              v-for="item in operativeSymbolList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('operation')" width="80" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="$t('delete')" placement="top">
            <el-button type="text" icon="el-icon-delete" @click="handleDeleteOne(scope.$index)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button @click="addRules">添加规则</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
    <choose-process-field v-model="procesFieldVisible" :nodeId="nodeId" :tableItem="tableItem" :itemData="itemData" :mainTableName="mainTableName" type="columnTotal" @confirm="handleFieldCnname" :isMore="false" />
  </el-dialog>
</template>
<script>
import chooseProcessField from "@/bpm/components/tableDialog/chooseProcessField";
export default {
  components: {
    chooseProcessField
  },
  data () {
    return {
      dialogVisible: this.value,
      loading: false,
      computeModeList: [
        {
          text: 'sum()',
          value: 'sum'
        },
        {
          text: 'avg()',
          value: 'avg'
        },
        {
          text: 'max()',
          value: 'max'
        },
        {
          text: 'min()',
          value: 'min'
        }
      ],
      operativeSymbolList: [
        {
          text: '+',
          value: '+'
        },
        {
          text: '-',
          value: '-'
        },
        {
          text: '*',
          value: '*'
        },
        {
          text: '/',
          value: '/'
        }
      ],
      tableList: [],
      procesFieldVisible: false,
      tableItem: {}
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
    nodeId: {
      type: String,
      default () {
        return ''
      }
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
      this.dialogVisible = val
      if (val) {
        if (this.itemData.calculationDtos && this.itemData.calculationDtos.length > 0) {
          this.tableList = this.itemData.calculationDtos
        }
      } else {
        this.tableList = []
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    addRules () {
      this.tableList.push({})
    },
    handleDeleteOne (index) {
      this.tableList.splice(index, 1)
    },
    fieldCnnameFocus (item) {
      this.tableItem = item
      this.procesFieldVisible = true
    },
    fieldCnnameClear (item) {
      this.$set(item, 'fieldCnname', '')
      this.$set(item, 'fieldId', '')
    },
    handleFieldCnname (item) {
      this.$set(this.tableItem, 'fieldCnname', item.fieldShowName)
      this.$set(this.tableItem, 'fieldId', item.id)
    },
    submit () {
      for (let i = 0, len = this.tableList.length; i < len; i++) {
        let item = this.tableList[i]
        if (!item.fieldCnname) {
          this.$message.error(`序号${i + 1}：${this.$t('fieldNames')}${this.$t('hintText.cannotBeEmpty')}`);
          return false;
        }
        if (!item.operator && i !== len - 1) {
          this.$message.error(`序号${i + 1}：${this.$t('operativeSymbol')}${this.$t('hintText.cannotBeEmpty')}`);
          return false;
        }
      }
      this.$emit('confirm', this.tableList)
      this.dialogVisible = false
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
#sbox{
  .el-select-dropdown{
    z-index: 9999
  }
}
</style>
