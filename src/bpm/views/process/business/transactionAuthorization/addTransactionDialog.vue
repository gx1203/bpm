<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" :rules="rules" ref="item" label-width="auto" class="content">
      <el-form-item label="控制字段名称:" prop="fieldname">
        <el-input clearable v-model="item.fieldname" />
      </el-form-item>
      <el-form-item label="控制字段对应列名:" prop="fieldkey">
        <el-input clearable v-model="item.fieldkey" />
      </el-form-item>
      <el-form-item label="控制字段对应业务表:" prop="fieldtablename">
        <el-input clearable v-model="item.fieldtablename" />
      </el-form-item>
      <el-form-item label="控制字段类型:" prop="fieldtype">
        <el-select clearable v-model="item.fieldtype" class="w100">
          <el-option
            v-for="item in selectTypeList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveOrUpdate } from '@/bpm/api/process/business/business.js'
export default {
  data () {
    return {
      dialogVisible: this.value,
      selectTypeList: [
        {
          name: '日期',
          value: 'date'
        },
        {
          name: '字符串',
          value: 'string'
        },
        {
          name: '数值',
          value: 'double'
        }
      ],
      rules: {
        fieldname: [
          { required: true, message: '请输入控制字段名称', trigger: 'blur' }
        ],
        fieldkey: [
          { required: true, message: '请输入控制字段对应列名', trigger: 'blur' }
        ],
        fieldtablename: [
          { required: true, message: '请输入控制字段对应业务表', trigger: 'blur' }
        ],
        fieldtype: [
          { required: true, message: '请选择控制字段类型', trigger: 'change' }
        ]
      }
    }
  },
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
      default: ''
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
    submit (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveOrUpdate(this.item).then(rt => {
            if (rt.status === '200') {
              this.$message.success(this.$t('hintText.saveSuccessfully'))
              this.dialogVisible = false
              this.$emit('confirm', true)
            }
          }).catch(() => {
            this.$message.error(this.$t('hintText.failToSave'))
          })
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
