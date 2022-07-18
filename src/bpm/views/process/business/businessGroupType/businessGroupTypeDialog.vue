<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
    <el-form :model="item" ref="item" :rules="rules" label-width="auto" class="content">
      <el-form-item label="业务组类型名称:" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
      <el-form-item label="业务组类型描述:"  prop="description">
        <el-input clearable v-model="item.description" />
      </el-form-item>
      <el-form-item :label="$t('correspondingBusinessTable') + '：'"  prop="tablename">
        <el-input clearable v-model="item.tablename" />
      </el-form-item>
      <el-form-item label="名称对应列:"  prop="namefield">
        <el-input clearable v-model="item.namefield" />
      </el-form-item>
      <el-form-item label="主键对应列:"  prop="keyfield">
        <el-input clearable v-model="item.keyfield" />
      </el-form-item>
      <el-form-item label="业务表类型key:"  prop="key">
        <el-input clearable v-model="item.key" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveBusinessGroupType } from '@/bpm/api/process/business/business_group_type'
export default {
  data () {
    return {
      dialogVisible: this.value,
      rules: {
        name: [
          { required: true, message: '请输入业务组类型名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入业务组类型描述', trigger: 'blur' }
        ],
        tablename: [
          { required: true, message: '请输入对应业务表', trigger: 'blur' }
        ],
        namefield: [
          { required: true, message: '请输入名称对应列', trigger: 'blur' }
        ],
        keyfield: [
          { required: true, message: '请输入主键对应列', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入业务表类型key', trigger: 'blur' }
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
          saveBusinessGroupType(this.item)
            .then(rt => {
              if (rt.status === '200') {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: 'success'
                })
                this.dialogVisible = false
                this.$emit('confirm', true)
              } else {
                this.$message({
                  message: this.$t('hintText.failToSave'),
                  type: 'error'
                })
              }
            })
            .catch(() => {
              this.$message({
                message: this.$t('hintText.failToSave'),
                type: 'error'
              })
            })
        }
      })
    },
    cancel () {
      this.dialogVisible = false
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
</style>
