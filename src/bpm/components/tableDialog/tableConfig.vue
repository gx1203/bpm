<template>
  <el-dialog :title="itemData.fieldShowName ? itemData.fieldShowName : '' + '-' + $t('tableConfig')"
    :visible.sync="dialogVisible" v-if="dialogVisible" v-loading="load" width="80%" top="10vh"
    :close-on-click-modal="false">
    <p style="color:red;margin-bottom: 10px;">{{$t('tableConfigTip')}}</p>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('showName') + '：'" prop="titleName">
            <el-input v-model="ruleForm.titleName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('tableName') + '：'" prop="titleTable">
            <el-input v-model="ruleForm.titleTable" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="queryList()" :title="$t('query')" type="text" icon="el-icon-refresh-right"
            style="font-size: 24px;">
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('storageField') + '：'" prop="saveField">
            <el-select clearable v-model="ruleForm.saveField" placeholder="">
              <el-option v-for="item in content" :key="item.columnName" :label="item.cnname" :value="item.columnName"
                :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('displayField') + '：'" prop="showField">
            <el-select clearable v-model="ruleForm.showField" placeholder="">
              <el-option v-for="item in content" :key="item.columnName" :label="item.cnname" :value="item.columnName"
                :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="content" border style="width:100%;" max-height="300">
      <el-table-column type="index" width="50" align="center">
      </el-table-column>
      <el-table-column prop="columnName" align="center" show-overflow-tooltip>
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>{{$t('fieldName')}}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>{{$t('chineseName2')}}
        </template>
        <template slot-scope="scope">
          <el-input clearable v-model="scope.row.cnname"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('englishName')" align="center">
        <template slot-scope="scope">
          <el-input clearable v-model="scope.row.enname"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120">
        <template slot="header" slot-scope="scope">
          <el-checkbox v-model="displayChecked" @change="changVal('isshow')" :disabled="content.length < 1">
            {{$t('listDisplay')}}</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isshow" @change="changRowVal('isshow')"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120">
        <template slot="header" slot-scope="scope">
          <el-checkbox v-model="queryChecked" @change="changVal('istj')" :disabled="content.length < 1">
            {{$t('queryConditions')}}</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.istj" @change="changRowVal('istj')"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" label="页面对应字段名" v-if="itemData.inputType === 'radioDialog'">
        <template slot-scope="scope">
          <el-input clearable type="text" :title="scope.row.relationField" v-model="scope.row.relationField" @focus="relationFieldFocus(scope.row)" @clear="relationFieldClear(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span class="red">*</span>{{$t('sort')}}
        </template>
        <template slot-scope="scope">
          <el-input clearable type="number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" min="1"
            @input="checkVal(scope.$index,'sort')" v-model="scope.row.sort"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('remarks')" width="120" align="center">
        <template slot-scope="scope">
          <el-input clearable v-model="scope.row.remarks"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('ruleForm')">{{ $t('submit') }}</el-button>
    </span>
    <choose-process-field v-model="procesFieldVisible" :nodeId="nodeId" :tableItem="tableItem" @confirm="handleRelationField" />
  </el-dialog>
</template>
<script>
import { getTableColumn, getNodeColumnsByNodeTableId } from '@/bpm/api/process/processModeling/classificationModel'
import chooseProcessField from "./chooseProcessField";
export default {
  components: {
    chooseProcessField
  },
  data () {
    return {
      content: [],
      dialogVisible: this.value,
      load: false,
      ruleForm: {},
      displayChecked: false,
      queryChecked: false,
      rules: {
        titleTable: [{ required: true, message: this.$t('tableNameCannotBeEmpty'), trigger: ['blur', 'change'] }],
        titleName: [{ required: true, message: this.$t('hintText.displayNameCannotBeEmpty'), trigger: ['blur', 'change'] }],
        saveField: [{ required: true, message: this.$t('storageFieldEmpty'), trigger: ['blur', 'change'] }],
        showField: [{ required: true, message: this.$t('displayFieldEmpty'), trigger: ['blur', 'change'] }]
      },
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
    }
  },
  watch: {
    value (val) {
      if (val) {
        console.log(this.itemData)
        this.$set(this.ruleForm, 'titleTable', this.itemData.titleTable || '')
        this.$set(this.ruleForm, 'titleName', this.itemData.titleName || '')
        this.$set(this.ruleForm, 'saveField', this.itemData.saveField || '')
        this.$set(this.ruleForm, 'showField', this.itemData.showField || '')
        if (this.itemData.nodeColumnDtos && this.itemData.nodeColumnDtos.length > 1) {
          this.itemData.nodeColumnDtos.forEach(element => {
            element.isshow = element.isshow === '1'
            element.istj = element.istj === '1'
          });
          this.content = this.itemData.nodeColumnDtos
          this.changRowVal('isshow')
          this.changRowVal('istj')
        } else {
          // if (this.itemData.id) {
          //   getNodeColumnsByNodeTableId({
          //     nodeTableId: this.itemData.id
          //   }).then(rt => {
          //     if (rt.status === '200') {
          //       rt.data.forEach(element => {
          //         element.isshow = element.isshow === '1' ? true : false
          //         element.istj = element.istj === '1' ? true : false
          //       });
          //       this.content = rt.data
          //       this.changRowVal('isshow')
          //       this.changRowVal('istj')
          //     }
          //   })
          // }
        }
      } else {
        this.ruleForm = {}
        this.content = []
        this.displayChecked = false
        this.queryChecked = false
      }
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    changVal (name) {
      this.content.forEach(element => {
        this.$set(element, name, name === 'isshow' ? this.displayChecked : this.queryChecked)
      })
    },
    changRowVal (name) {
      let len = this.content.filter(x => x[name] === true).length
      name === 'isshow' ? this.displayChecked = this.content.length === len : this.queryChecked = this.content.length === len
    },
    checkVal (index, name) {
      if (name === 'sort' && this.content[index].sort < '1') {
        this.content[index].sort = 1;
      }
    },
    relationFieldFocus (item) {
      this.tableItem = item
      this.procesFieldVisible = true
    },
    relationFieldClear (item) {
      this.$set(item, 'relationField', '')
      this.$set(item, 'relationFieldId', '')
    },
    handleRelationField (list) {
      this.$set(this.tableItem, 'relationField', list.map(item => item.fieldShowName).join('&'))
      this.$set(this.tableItem, 'relationFieldId', list.map(item => item.id).join())
    },
    queryList () {
      if (!this.ruleForm.titleTable) {
        this.$message(this.$t('tableNameCannotBeEmpty'))
        return
      }
      getTableColumn({ 'tableName': this.ruleForm.titleTable }).then(rt => {
        if (rt.status === '200') {
          this.displayChecked = false
          this.queryChecked = false
          this.$set(this.ruleForm, 'saveField', '')
          this.$set(this.ruleForm, 'showField', '')
          rt.data.forEach(element => {
            element.isshow = false
            element.istj = false
            element.enname = ''
            element.remarks = ''
          })
          this.content = rt.data
        }
      })
    },
    submit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let list = Object.assign([], this.content)
          if (list.length < 1) {
            this.$message(`字段信息不能为空！`)
            return
          }
          for (let index = 0; index < list.length; index++) {
            const element = list[index]
            this.$set(element, 'nodeid', this.nodeId)
            element.isshow = element.isshow === true ? '1' : '0'
            element.istj = element.istj === true ? '1' : '0'
            if (!element.cnname) {
              this.$message(`请输入第${index + 1}行中文名！`)
              return
            }
            if (!element.sort) {
              this.$message(`请输入第${index + 1}行排序！`)
              return
            }
          }
          this.ruleForm.nodeColumnDtos = list
          this.$emit('confirm', this.ruleForm)
          this.dialogVisible = false
        }
      })
    },
    cancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
</style>
