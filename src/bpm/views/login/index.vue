<template>
  <div v-loading="load" class="login">
    <el-form ref="form" class="form" :model="form" :rules="rules">
      <!-- <img class="logo" src="../../assets/img/login/logo.png" alt=""> -->
      <h2 class="input">
        用户登录
      </h2>
      <el-form-item class="input" prop="name">
        <el-input v-model="form.name" clearable placeholder="请输入用户名" @keyup.enter.native="loginClick('form')" />
        <div class="name icon" />
      </el-form-item>
      <el-form-item class="input" prop="password">
        <el-input
          v-model="form.password"
          clearable
          type="password"
          placeholder="请输入密码"
          @keyup.enter.native="loginClick('form')"
        />
        <div class="pwd icon" />
      </el-form-item>
      <el-form-item align="left" class="but input">
        <el-button @click="loginClick('form')">
          确认登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getLoginMessage, getUserNav } from '@/bpm/api/app'
import cookie from 'js-cookie'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('app')
export default {
  data() {
    return {
      load: false,
      form: {
        name: '',
        password: ''
      },
      rules: {
        name: [{ required: true, message: '请输入账户', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      millisecond: '',
      // cookie限制时间
      expiresTime: ''
    }
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    ...mapMutations(['setTabList']),
    loginClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.load = true
          const formData = new FormData()
          formData.append('username', this.form.name)
          formData.append('password', this.form.password)
          getLoginMessage(formData)
            .then(rt => {
              if (rt) {
                if (rt.status === '200') {
                  // localStorage.setItem('token', rt.requestId)
                  const data = {
                    id: this.form.name,
                    password: this.form.password,
                    displayname: rt.data.name,
                    res: rt.data
                  }
                  this.setUserInfo(data)
                  localStorage.setItem('userInfo', JSON.stringify(data))
                  this.millisecond = new Date().getTime()
                  this.expiresTime = new Date(this.millisecond + 60 * 1000 * 24 * 60 * 3)
                  console.log(this.expiresTime)
                  cookie.set('username', rt.data.name, { expires: this.expiresTime })
                  this.$router.push({
                    path: '/staging/personal/approveList'
                  })
                  // sessionStorage.setItem('userInfo', JSON.stringify(data))
                  // getUserNav(1301996271304740)
                  //   .then(rt => {
                  //     if (rt) {
                  //       this.setTabList(rt.data)
                  //       this.$router.push({
                  //         path: '/staging/personal/approveList'
                  //       })
                  //     }
                  //   })
                  this.load = false
                }
                // else if (rt.status === '401') {
                //   this.$message.error('用户名密码错误')
                //   this.load = false
                // }
              }
            })
            .catch(er => {
              console.log(er)
              this.load = false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  min-width: 1360px;
  height: 100%;
  min-height: 625px;
  background: url(../../assets/img/login/loginBg.png) no-repeat;
  background-size: 100% 100%;
  position: absolute;
  .form {
    width: 340px;
    text-align: center;
    position: absolute;
    left: 5.6%;
    top: 6.3%;
  }
  .logo {
    width: 64%;
    margin-bottom: 57px;
  }
  h2 {
    font-size: 24px;
    text-align: center;
    padding-bottom: 32px;
    color: #333333;
    font-weight: 300;
  }
  .input {
    width: 309px;
    position: relative;
  }
  .input /deep/ .el-input__inner {
    height: 42px;
    line-height: 42px;
    border: 0;
    background-color: #cfd5db;
    text-indent: 64px;
    font-size: 14px;
    color: #fff;
    border-radius: 40px;
    padding: 0;
  }
  .input /deep/ .el-input__inner:focus {
    background-color: rgb(49, 153, 228);
  }
  .input /deep/ .el-input__inner::-webkit-input-placeholder {
    color: #fff;
  }
  .input /deep/ .el-input__inner::-moz-placeholder {
    color: #fff;
  }
  .input /deep/ .el-input__inner:-moz-placeholder {
    color: #fff;
  }
  .input /deep/ .el-input__inner:-ms-input-placeholder {
    color: #fff;
  }
  .but /deep/ .el-button {
    width: 160px;
    height: 44px;
    border-radius: 40px;
    color: white;
    border: 0;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(#329de2),
      to(#3cb9c1)
    );
    background: -webkit-linear-gradient(left, #329de2, #3cb9c1);
    background: -o-linear-gradient(left, #329de2, #3cb9c1);
    background: linear-gradient(to right, #329de2, #3cb9c1);
  }
  a {
    color: #b1b1b1;
  }
  .icon {
    width: 42px;
    height: 20px;
    border-right: 1px solid #fff;
    position: absolute;
    top: 11px;
    left: 10px;
    background-size: 18px;
  }
  .name {
    background: url(../../assets/img/login/user.png) 10px no-repeat;
  }
  .pwd {
    background: url(../../assets/img/login/pass.png) 10px no-repeat;
  }
  .forget-pwd {
    text-align: right;
    padding-right: 38px;
  }
}
</style>
