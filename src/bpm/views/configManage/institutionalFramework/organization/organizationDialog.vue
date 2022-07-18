<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible">
    <el-form ref="item" :model="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="name">
        <el-input clearable v-model="item.name" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveUserOrg, saveOrgTree, saveUserorgTop } from '@/bpm/api/configManage/institutionalFramework/organization.js'

export default {
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
    return {
      dialogVisible: this.value,
      rules: {
        name: [{ required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: 'blur' },
          { max: 100, message: '名称超长', trigger: 'blur' }]
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.item.dataid) {
            // this.item.id = this.item.dataid
            delete this.item.dataid
          }
          saveUserorgTop(this.item).then(rt => {
            if (rt.status === '200') {
              this.$message.success(`${this.title}成功`)
              this.item.id = rt.data.id
              this.$emit('confirm', this.item)
              this.cancel()
            }
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
