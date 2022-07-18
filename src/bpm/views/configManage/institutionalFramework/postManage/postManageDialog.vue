<template>
  <el-dialog id="staffManageDialog" :title="title" :visible.sync="dialogVisible">
    <el-form ref="item" :model="item" :rules="rules" label-width="120px" class="content">
      <el-form-item :label="$t('positionGroupName') + '：'" prop="name">
        <el-input clearable v-model="item.name" :placeholder="$t('placeholderText.pleaseEnterPostGroupName')"/>
      </el-form-item>
      <el-form-item :label="$t('sort') + '：'" prop="sortid">
        <el-input :placeholder="$t('placeholderText.pleaseInputSort')" v-model="item.sortid" type="number" on-keypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" min="0" />
      </el-form-item>
      <el-form-item :label="$t('grade') + '：'" prop="grade">
        <el-input :placeholder="$t('placeholderText.pleaseEnterGrade')" v-model="item.grade" type="number" on-keypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" min="0" />
      </el-form-item>
      <el-form-item :label="$t('remarks') + '：'" prop="explain">
        <el-input clearable v-model="item.explain" :placeholder="$t('placeholderText.pleaseEnterNote')"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { savePositions } from '@/bpm/api/configManage/institutionalFramework/post_manage'
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
    title: {
      type: String,
      default: false
    }
  },
  data() {
    const namePudge = (rule, value, callback) => {
      if (this.item.name && this.item.name.length > 400) {
        callback(new Error(this.$t('hintText.thePostGroupNameTooLong')))
      } else {
        callback()
      }
    }
    const sortidPudge = (rule, value, callback) => {
      if (this.item.sortid && this.item.sortid.length > 10) {
        callback(new Error(this.$t('hintText.superLongGrade')))
      } else {
        callback()
      }
    }
    const gradePudge = (rule, value, callback) => {
      if (this.item.grade && this.item.grade.length > 10) {
        callback(new Error(this.$t('hintText.superLongGrade')))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: this.value,
      rules: {
        name: [
          { required: true, message: this.$t('placeholderText.pleaseEnterPostGroupName'), trigger: 'blur' },
          { validator: namePudge, trigger: 'blur' }
        ],
        sortid: [{ validator: sortidPudge, trigger: 'blur' }],
        grade: [{ validator: gradePudge, trigger: 'blur' }],
        explain: [{ max: 500, message: this.$t('hintText.remarksAreSuperLong'), trigger: 'blur' }]
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
          savePositions(this.item)
            .then(rt => {
              if (rt.status === '200') {
                this.$message({
                  message: `${this.title}成功`,
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
#staffManageDialog {
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
