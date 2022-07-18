<template>
  <el-dialog id="classifyHandleDialog" :title="title" :visible.sync="dialogVisible">
    <el-form ref="item" :model="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="modelname">
        <el-input v-model="item.modelname" clearable />
      </el-form-item>
      <el-form-item :label="$t('sort') + '：'" prop="sort">
        <el-input v-model="item.sort" clearable type="number" on-keypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import {
  saveProcessType
} from '@/bpm/api/process/processModeling/process_classification'

export default {
  name: 'ClassifyHandleDialog',
  components: {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    var validateRightscode = (rule, value, callback) => {
      if (value.toString().length > 10) {
        callback(new Error(this.$t('hintText.sortExceedsLengthLimit')))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: this.value,
      rules: {
        modelname: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: this.$t('placeholderText.pleaseInputSort'), trigger: 'blur' },
          { validator: validateRightscode, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    //   if(val){
    //     if(this.title === '新增子节点'){
    //         this.item = {
    //             pid : this.item.id,
    //             unallocatedList: [],
    //             allocatedList: [],
    //         }
    //     }
    //   }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    submit(formName) {
      this.$refs['item'].validate(valid => {
        if (valid) {
          this.loading = true
          saveProcessType(this.item)
            .then(rt => {
              this.loading = false
              if (rt.status === '200') {
                this.$message({
                  message: this.$t('hintText.saveSuccessfully'),
                  type: 'success'
                })
                this.dialogVisible = false
                this.$emit('confirm')
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
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    }
  }
}
</script>
<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
  padding: 0 10px;
}
.w100 {
  width: 100%;
}
</style>
