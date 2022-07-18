<template>
  <el-dialog
    :title="$t('changePassword')"
    :visible.sync="dialogVisible"
    width="50%"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
  >
    <el-form ref="resetRef" :model="resepassword" :rules="resetRules" label-width="100px">
      <el-form-item :label="$t('account') + '：'" prop="name">
        <el-input v-model="resepassword.name" clearable disabled />
      </el-form-item>
      <el-form-item :label="$t('oldPassword') + '：'" prop="oldpassword">
        <el-input v-model="resepassword.oldpassword" :placeholder="$t('placeholderText.pleaseEnterOldPassword')" clearable type="password" />
      </el-form-item>
      <el-form-item :label="$t('newPassword') + '：'" prop="newpassword">
        <el-input v-model="resepassword.newpassword" :placeholder="$t('placeholderText.pleaseEnterNewPassword')" clearable type="password" />
      </el-form-item>
      <el-form-item :label="$t('comfirmPassword') + '：'" prop="confirmpassword">
        <el-input v-model="resepassword.confirmpassword" :placeholder="$t('placeholderText.pleaseEnterNewPasswordAgain')" clearable type="password" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmForm">
        {{ $t('confirm') }}
      </el-button>
      <el-button @click="dialogVisible = false">
        {{ $t('cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { resetInterface } from '@/bpm/api/app'
export default {
  data() {
    return {
      dialogVisible: false,
      resepassword: {
        name: ''
      },
      resetRules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        oldpassword: [{ required: true, message: this.$t('placeholderText.pleaseEnterOldPassword'), trigger: 'blur' }],
        newpassword: [{ required: true, message: this.$t('placeholderText.pleaseEnterNewPassword'), trigger: 'blur' }],
        confirmpassword: [{ required: true, message: this.$t('placeholderText.pleaseEnterNewPasswordAgain'), trigger: 'blur' }]
      }
    };
  },
  props: {
    value: {
      type: Boolean
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.resepassword = {
          name: JSON.parse(localStorage.getItem('portalCurrentUserInfo') || '{}')
            .empuid
        }
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    closeDialog () {
      this.$refs.resetRef.resetFields()
    },
    confirmForm() {
      this.$refs.resetRef.validate(valid => {
        if (valid) {
          if (
            this.resepassword.newpassword !== this.resepassword.confirmpassword
          ) {
            this.$message({
              type: 'warning',
              message: this.$t('hintText.newPasswordIsInconsistentWithTheConfirmedPasswordPleaseFillInAgain')
            })
            return false
          }
          resetInterface({
            originalPassword: this.resepassword.oldpassword,
            newPassword: this.resepassword.newpassword,
            confirmedPassword: this.resepassword.newpassword,
            userId: this.resepassword.name
          }).then(res => {
            console.log(res)
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.$t('hintText.passwordChangedSuccessfully')
            })
            this.dialogVisible = false
          })
        }
      })
    }
  }
};
</script>


<style lang="scss" >
#processDialog {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }

  .el-transfer {
    .el-transfer-panel {
      width: calc(50% - 110px);
    }
    .el-checkbox {
      display: block;
    }
  }
}
</style>
