<template>
  <el-dialog id="positionManageDialog" :title="title" :visible.sync="dialogVisible">
    <el-form ref="item" :model="item" :rules="rules" label-width="120px" class="content">
      <el-form-item :label="$t('name2') + '：'" prop="name">
        <el-input v-model="item.name" clearable />
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'" prop="description">
        <el-input
          v-model="item.description"
          clearable
          autocomplete="off"
          :autosize="{ minRows: 2}"
          show-word-limit
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveTree } from '@/bpm/api/configManage/institutionalFramework/position_manage.js'
export default {
  components: {},
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
    treeData: {
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
    const namePudge = (rule, value, callback) => {
      if (this.item.name && this.item.name.length > 400) {
        callback(new Error('名称超长'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: this.value,
      rules: {
        name: [
          { required: true, message: this.$t('placeholderText.pleaseEnterName'), trigger: 'blur' },
          { validator: namePudge, trigger: 'blur' }
        ],
        remark: [{ max: 500, message: '备注超长', trigger: 'blur' }]
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
          let params = {}
          if (this.title === '编辑职务') {
            params = this.item
          } else {
            params = {
              pid: this.treeData.id,
              type: '6',
              name: this.item.name,
              description: this.item.description
            }
          }
          saveTree(params)
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
<style lang="scss">
#positionManageDialog {
  .avatar-uploader .el-upload {
    border: 1px dashed $dc1;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
