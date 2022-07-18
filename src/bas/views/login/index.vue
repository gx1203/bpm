<template>
  <div class="login">
    <div class="login-layout">
      <div class="login-img">
        <div class="login-logo">
          <img :src="logo" alt="">
        </div>
        <div class="login-desc">
          <img :src="loginDesc" alt="">
        </div>
      </div>
      <el-form ref="form" class="form" :model="form" :rules="rules">
        <div class="login-title">
          用户登录
        </div>
        <el-form-item class="input" prop="name">
          <el-input
            v-model="form.name"
            clearable
            :placeholder="$t('account')"
            @keyup.enter.native="loginClick('form')"
          />
          <div class="name icon" />
        </el-form-item>
        <el-form-item class="input" prop="password">
          <el-input
            v-model="form.password"
            clearable
            type="password"
            :placeholder="$t('password')"
            @keyup.enter.native="loginClick('form')"
          />
          <div class="pwd icon" />
        </el-form-item>
        <el-form-item align="left" class="but input">
          <el-button @click="loginClick('form')">
            {{ $t('login') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getLoginMessage } from '@/bas/api/app'
import { getCurrentUser } from '@/bpa/api/user'
// import logo from '@/bas/assets/img/login/logo-white.png'
import logo from '@/bas/assets/img/login/logo-white_jiucaiyun.png'
import loginDesc from '@/bas/assets/img/login/login-desc.png'
import cookie from 'js-cookie'
import { createNamespacedHelpers } from 'vuex'
const userInfo = createNamespacedHelpers('userInfo')
const app = createNamespacedHelpers('app')
export default {
  name: 'Login',
  data() {
    return {
      load: false,
      form: {
        name: '',
        password: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t('pleaseEnterAccount'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('pleaseEnterPassword'),
            trigger: 'blur'
          }
        ]
      },
      expiresTime: '',
      millisecond: '',
      isPassLogin: true,
      logo: logo,
      loginDesc: loginDesc,
      isLogin: false
    }
  },
  computed: {
    ...userInfo.mapGetters(['getUserMenu'])
  },
  created() {
    this.$loading().close()
  },
  mounted() {
  },
  methods: {
    ...userInfo.mapActions(['requireMenu']),
    ...app.mapActions(['refreshModuleList']),
    loginClick(formName) {
      const than = this
      than.$refs[formName].validate(async valid => {
        if (valid) {
          than.load = true
          const formData = new FormData()
          formData.append('username', than.form.name)
          formData.append('password', than.form.password)
          getLoginMessage(formData)
            .then(rt => {
              than.load = false
              if (rt && rt.status === '200') {
                localStorage.setItem(
                  'language',
                  localStorage.getItem('language') || 'cn'
                )
                localStorage.setItem(
                  'portalCurrentUserInfo',
                  JSON.stringify({
                    empuid: than.form.name
                  })
                )
                getCurrentUser(than.form.name)
                  .then(datas => {
                    const data = {
                      id: than.form.name,
                      password: than.form.password,
                      empuid: than.form.name,
                      cnname: datas.displayname,
                      displayname: datas.displayname,
                      res: datas
                    }
                    cookie.set('isLogin', 'isLogin', 0)
                    localStorage.setItem('userInfo', JSON.stringify(data))
                    localStorage.setItem(
                      'portalCurrentUserInfo',
                      JSON.stringify(data)
                    )
                    this.millisecond = new Date().getTime()
                    this.expiresTime = new Date(
                      this.millisecond + 60 * 1000 * 24 * 60 * 3
                    )
                    cookie.set('username', rt.data.name, {
                      expires: this.expiresTime
                    })
                    if (!cookie.get('lan-local')) {
                      const millisecond = new Date().getTime()
                      const expiresTime = new Date(
                        millisecond + 60 * 1000 * 24 * 60 * 30
                      )
                      cookie.set(
                        'lan-local',
                        localStorage.getItem('language'),
                        { expires: expiresTime }
                      )
                    }
                    than.$store.dispatch('basuser/saveUser', data)
                    than
                      .refreshModuleList()
                      .then(res => {
                        if (res.data.length !== 0) {
                          return than.requireMenu()
                        } else {
                          this.$message.error(
                            '您暂时没有BPA登录权限，还请联系管理为您开通'
                          )
                        }
                      })
                      .then(res => {
                        this.$router.push({
                          path: '/doorCenter'
                        })
                      })
                  })
                  .catch(er => {})
              }
            })
            .catch(er => {
              console.log(er)
              than.load = false
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
html {
  overflow: auto;
}
$login-main-height: 631px;
.login {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  .login-layout {
    width: 100%;
    min-width: 1200px;
    height: 100%;
    min-height: 625px;
    position: relative;
    overflow: auto;
    // background: url('../../assets/img/login/loginBg.png') no-repeat;
    background: url('../../assets/img/login/loginBg_jiucaiyun.png') no-repeat;
    background-size: 100% 100%;
  }
  .login-img {
    position: absolute;
    top: 13%;
    right: 8%;
    text-align: center;
    .login-logo {
      margin-bottom: 12px;
      img {
        width: 160px;
      }
    }
    .login-desc {
      img {
        width: 400px
      }
    }
  }
  .form {
    width: 260px;
    text-align: center;
    position: absolute;
    left: 12%;
    top: 15%;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: 0px 0px 10px #bbb;
  }
  .login-title {
    line-height: 30px;
    margin-bottom: 16px;
    font-size: 18px;
    color: #000000;
  }
  .input {
    position: relative;
    margin-bottom: 24px;
    /deep/ .el-form-item__error {
      margin-top: 4px;
    }
  }
  .input /deep/ .el-input__inner {
    height: 38px;
    line-height: 38px;
    border: 0;
    padding: 0;
    text-indent: 44px;
    font-size: 14px;
    border: 1px solid #E1E1E1;
    border-radius: 5px;
    background-color: #ffffff !important;
  }
  .but /deep/ .el-button {
    width: 100%;
    height: 38px;
    border-radius: 5px;
    color: white;
    border: 0;
    background: #3D55D3;
    font-size: 13px;
  }
  a {
    color: #b1b1b1;
  }
  .icon {
    width: 34px;
    height: 22px;
    position: absolute;
    top: 9px;
    left: 5px;
  }
  .name {
    background: url(../../assets/img/login/user.png) 10px no-repeat;
    background-size: 15px
  }
  .pwd {
    background: url(../../assets/img/login/pass.png) 10px no-repeat;
    background-size: 14px
  }
  .forget-pwd {
    text-align: right;
    padding-right: 38px;
  }
}
</style>
