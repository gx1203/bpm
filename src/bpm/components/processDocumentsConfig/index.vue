<template>
  <el-dialog v-if="dialogVisible" :append-to-body="true" width="1000px" :visible.sync="dialogVisible" title="流程单据配置" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="form" :model="formData" label-width="80px">
      <el-row class="margin-b10">
        <span class="red" style="margin-right: 3px;">{{ $t('hintText.selectProcessDocumentsNote') }}</span>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('dataRange') + '：'">
            <el-radio-group v-model="formData.datascope">
              <el-radio label="0">
                {{ $t('all') }}
              </el-radio>
              <el-radio label="1">
                {{ $t('applicantInitiated') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="tool-common-wrap">
            <div class="btn-wrap">
              <el-button type="primary" @click="processVisible = true">
                {{ $t('add') }}
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <!-- 信息表格 -->
        <el-table
          :data="tableList"
          stripe
          :header-cell-style="{background: '#E1EAFD !important'}"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column :label="$t('number')" type="index" />
          <el-table-column prop="processnamecn" :label="$t('processName2')" show-overflow-tooltip />
        <el-table-column prop="currentframe" :label="$t('itBelongsToTheFinalFrame')" show-overflow-tooltip />
        <el-table-column prop="topframe" :label="$t('subordinateLevelFramework')" show-overflow-tooltip />
          <el-table-column prop="status" :label="$t('theScopeOfState')" show-overflow-tooltip>
            <template slot="header" slot-scope="scope">
              <span class="red">*</span>{{ $t('theScopeOfState') }}
            </template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.status">
                <el-option :label="$t('all')" value="全部" />
                <el-option :label="$t('completed')" value="已完成" />
                <el-option :label="$t('completed') + '&' + $t('beingProcessed')" value="已完成&审批中" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" :label="$t('remarks')" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.remarks" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('operation')" width="60" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                :title="$t('delete')"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
    </span>
    <choose-process v-model="processVisible" :node-id="nodeId" :item-data="itemData" @confirm="handleProcess" />
  </el-dialog>
</template>

<script>
import chooseProcess from './chooseProcess'

export default {
  components: {
    chooseProcess
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default() {
        return {}
      }
    },
    nodeId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      formData: {
        datascope: '0'
      },
      tableList: [],
      processVisible: false
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        if (this.itemData.nodeProcessDtos && this.itemData.nodeProcessDtos.length > 0) {
          this.tableList = this.itemData.nodeProcessDtos
        }
        if (this.itemData.datascope || this.itemData.datascope === 0 || this.itemData.datascope === '0') {
          this.formData.datascope = this.itemData.datascope
        }
      } else {
        this.tableList = []
        this.formData.datascope = '0'
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    handleDelete(index) {
      this.tableList.splice(index, 1)
    },
    handleProcess(data) {
      console.log(data)
      data.forEach(item => {
        if (!this.tableList.map(el => el.processname).includes(item.processname)) {
          this.tableList.push(item)
        }
      })
    },
    submit() {
      for (let i = 0; i < this.tableList.length; i++) {
        const item = this.tableList[i]
        if (!item.status) {
          this.$message({
            message: this.$t('hintText.pleaseSelectScopeStatus'),
            type: 'warning'
          })
          return false
        }
      }
      this.$emit('confirm', {
        datascope: this.formData.datascope,
        nodeProcessDtos: this.tableList
      })
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
