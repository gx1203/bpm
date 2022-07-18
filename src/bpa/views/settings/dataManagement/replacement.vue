<template>
  <el-dialog :title="$t('GlobalReplacement')" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false"
    :close-on-press-escape="false" v-loading="loading">
    <el-form label-width="110px" :rules="rules" :model="formData" ref="form">
      <el-form-item label="查找内容" prop="oldWord">
        <el-input clearable v-model="formData.oldWord"></el-input>
      </el-form-item>
      <el-form-item label="替换为" prop="newWord">
        <el-input clearable v-model="formData.newWord"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button @click="cancelBtn">{{$t("cancel")}}</el-button> -->
      <el-button type="primary" @click="confirmBtn">全部替换</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { replaceAll } from '@/bpa/api/settings/dataManagement'
import axios from 'axios'
export default {
  data () {
    return {
      formData: {},
      dialogVisible: false,
      loading: false,
      rules: {
        oldWord: [{ required: true, message: ' ', trigger: 'blur' }],
        newWord: [{ required: true, message: ' ', trigger: 'blur' }]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    confirmBtn () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          axios({
            method: 'post',
            url: process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL + '/attachmentSearch/replaceAll',
            data: this.formData
          }).then(rt => {
            console.log(rt)
            this.loading = false
            if (rt.status === 200) {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: this.$t('hintText.operateSuccessfully')
              })
            }
          }).catch(er => {
            console.log(er)
            this.loading = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    cancelBtn () {
      this.addBtndialogVisible = false
    }
  }
}
</script>
