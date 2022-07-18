<template>
  <div id="passManage">
    <el-row>
      <el-col :span="12" :offset="5">
        <el-form :model="resepassword" :rules="resetRules" ref="resetRef" label-width="100px" >
          <el-form-item label="账号 :" prop="name">
            <el-input clearable v-model="resepassword.name"></el-input>
          </el-form-item>
          <el-form-item label="旧密码 :" prop="oldpassword">
            <el-input clearable v-model="resepassword.oldpassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码 :" prop="newpassword">
            <el-input clearable v-model="resepassword.newpassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码 :" prop="confirmpassword">
            <el-input clearable v-model="resepassword.confirmpassword" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmForm">确定</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { resetInterface } from '@/bpa/api/settings/resetPassword'
export default {
  data () {
    return {
      resepassword: {},
      resetRules: {
        name: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        oldpassword: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        confirmpassword: [
          { required: true, message: ' ', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    confirmForm () {
      this.$refs.resetRef.validate((valid) => {
        console.log(valid)
        if (valid) {
          if (this.resepassword.newpassword != this.resepassword.confirmpassword) {
            this.$message({
              type: 'warning',
              message: '新密码和确认密码不一致, 请重新填写!'
            })
            return false
          }
          resetInterface({
            'confirmedPassword': this.resepassword.confirmpassword,
            'originalPassword': this.resepassword.oldpassword,
            'newPassword': this.resepassword.newpassword,
            'userid': this.resepassword.name
          }).then(res => {
            console.log(res)
            if (!res) return false
            this.$message({
              type: 'success',
              message: '密码修改成功!'
            })
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    resetForm () {
      this.$confirm('确认要重置已填写的信息吗?', this.$t('hintText.hint'),{
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(res => {
        this.resepassword = {}
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
