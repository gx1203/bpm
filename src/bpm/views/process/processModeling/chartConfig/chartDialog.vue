<template>
  <el-dialog
    v-loading="loading"
    :title="title"
    width="90%"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    append-to-body
  >
    <div class="chartDialog">
      <div class="text-l margin-b10">
        <el-button type="primary" @click="addFormList">
          {{ $t('addChart') }}
          
        </el-button>
      </div>
      <el-table
        stripe
        :header-cell-style="{background: '#E1EAFD !important'}"
        highlight-current-row
        :data="chartList"
        style="width: 100%;"
        height="50vh"
      >
        <el-table-column fixed prop="name" :label="$t('chartName')" width="200">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('chartName') }}
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.name" clearable />
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('chartType')" width="200">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('chartType') }}
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" clearable :placeholder="$t('placeholderText.pleaseSelect')" @change="typeChange(scope.row)">
              <el-option
                v-for="item in chartTypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="yname" :label="$t('YAxisName')" width="200">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('YAxisName') }}
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.yname" clearable />
          </template>
        </el-table-column>
        <el-table-column prop="dimension" :label="$t('dimension')" width="200">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('dimension') }}
          </template>
          <template slot-scope="scope">
            <el-select v-model="scope.row.dimension" clearable class="w100">
              <el-option
                v-for="item in dimensionList"
                :key="item.name"
                :label="item.showName"
                :value="item.name"
              >
                <span style="float: left">{{ item.showName }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px"
                  @click.stop="editRule(scope.$index, item)"
                >
                  <el-button type="text" icon="el-icon-edit" />
                </span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="dimension2" :label="$t('dimension') + '2'" width="200">
          <template slot-scope="scope">
            <el-select v-model="scope.row.dimension2" clearable class="w100" :disabled="scope.row.type === 'Pie' || scope.row.type === 'Funnel'">
              <el-option
                v-for="item in dimensionList"
                :key="item.name"
                :label="item.showName"
                :value="item.name"
              >
                <span style="float: left">{{ item.showName }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px"
                  @click.stop="editRule(scope.$index, item)"
                >
                  <el-button type="text" icon="el-icon-edit" />
                </span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="quota" :label="$t('index2')" width="200">
          <template slot="header">
            <span class="required">*</span>
            {{ $t('index2') }}
          </template>
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.quota"
              clearable
              :placeholder="$t('placeholderText.pleaseSelect')"
            >
              <el-option
                v-for="item in quotaList"
                :key="item.name"
                :label="item.showName"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column :label="$t('showSomeData')" width="200">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.dataSize"
              clearable
              type="number"
              min="1"
              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
              @blur="checkVal(scope.row)"
              class="input-with-select"
            >
              <el-select
                slot="prepend"
                v-model="scope.row.dataFlag"
                style="width:75px"
                :placeholder="$t('placeholderText.pleaseSelect')"
              >
                <el-option :label="$t('before')" value="forward" />
                <el-option :label="$t('rear')" value="afterward" />
              </el-select>
            </el-input>
          </template>
        </el-table-column>
<!--        <el-table-column prop="chartfieldcol" :label="$t('severalColumnsPerRow')" />-->
<!--        <el-table-column prop="chartcolspan" :label="$t('howManyColumns')" width="100">-->
<!--          <template slot-scope="scope">-->
<!--            <el-input-->
<!--              v-model="scope.row.chartcolspan"-->
<!--              clearable-->
<!--              type="number"-->
<!--              min="1"-->
<!--              onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"-->
<!--            />-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column :label="$t('operation')">
          <template slot-scope="scope">
            <el-button
              type="text"
              :title="$t('delete')"
              icon="el-icon-delete"
              @click="handleDeleteOne(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit">{{ $t('save') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  queryDetailList,
  saveChartDetail
} from '@/bpm/api/process/processModeling/chart_config'

import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      dialogEquationVisible: false,
      columnList: [],
      dimensionList: [],
      quotaList: [],
      chartTypeList: [],
      chartList: [],
      loading: false
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.chartList = []
        this.columnList = []
        this.dimensionList = []
        this.quotaList = []
        this.getData()
      }
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    checkVal(item) {
      if (item.dataSize === 0 || item.dataSize === '0') {
        this.$set(item, 'dataSize', '')
        this.$message({
          message: '只能输入大于0的整数',
          type: 'warning'
        })
      }
    },
    typeChange(item) {
      if (item.type === 'Pie' || item.type === 'Funnel') {
        this.$set(item, 'dimension2', '')
      }
    },
    // 添加字段
    addFormList() {
      this.chartList.push({
        name: '',
        type: '',
        yname: '',
        dimension: '',
        dimension2: '',
        quota: '',
        chartrow: '',
        dataFlag: 'forward'
        // chartfieldcol: '12',
        // chartcolspan: '12'
      })
    },
    editRule(i, data) {
      this.$prompt(this.$t('showName'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        inputValue: data.showName
      }).then(({ value }) => {
        data.showName = value
      }).catch(() => {
      })
    },
    handleDeleteOne(index) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: 'warning'
      })
        .then(() => {
          this.chartList.splice(index, 1)
        })
        .catch(()=> {})
    },
    getData() {
      const than = this
      getDictionaryOption({
        dictionaryen: 'chartType'
      })
        .then(rt => {
          than.chartTypeList = rt.data
        })
      this.loading = true;
      queryDetailList(this.item.id)
        .then(rt => {
          if (rt.status === "200" && rt.data) {
            this.chartList = rt.data.detailList || []
            this.columnList = rt.data.columnList || []
            this.dimensionList = rt.data.columnList.filter(item => item.dimension)
            this.quotaList = rt.data.columnList.filter(item => item.quota)
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submit(formName) {
      for (let i = 0, len = this.chartList.length; i < len; i++) {
        let item = this.chartList[i]
        if (!item.name) {
          this.$message({
            message: `${this.$t('chartName')} ${this.$t('hintText.cannotBeEmpty')}`,
            type: 'warning'
          })
          return
        }
        if (!item.type) {
          this.$message({
            message: `${this.$t('chartType')} ${this.$t('hintText.cannotBeEmpty')}`,
            type: 'warning'
          })
          return
        }
        if (!item.yname) {
          this.$message({
            message: `${this.$t('YAxisName')} ${this.$t('hintText.cannotBeEmpty')}`,
            type: 'warning'
          })
          return
        }
        if (!item.dimension) {
          this.$message({
            message: `${this.$t('dimension')} ${this.$t('hintText.cannotBeEmpty')}`,
            type: 'warning'
          })
          return
        }
        if (!item.quota) {
          this.$message({
            message: `${this.$t('index2')} ${this.$t('hintText.cannotBeEmpty')}`,
            type: 'warning'
          })
          return
        }
        if (item.dimension === item.dimension2) {
          this.$message({
            message: `${this.$t('dimension')}和${this.$t('dimension')}2不能相等`,
            type: 'warning'
          })
          return
        }
      }
      this.loading = true
      saveChartDetail({
        ...this.item,
        detailList: this.chartList,
        columnList: [
          ...this.columnList,
          ...this.dimensionList
        ]
      })
        .then(rt => {
          if (rt.status === '200') {
            this.loading = false
            this.$message({
              message: this.$t('hintText.saveSuccessfully'),
              type: 'success'
            })
            this.dialogVisible = false
            this.$emit('confirm', true)
          } else {
            this.loading = false
            this.$message({
              message: this.$t('hintText.failToSave'),
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
.ruleClass::after{
    right: 7px!important;
}
</style>

<style lang="scss" scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
</style>
