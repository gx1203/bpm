<template>
  <div class="login">
    <div class="login-layout">
      <div class="login-wrap">
        <div class="login-header">
          <div class="left-img">
            <img :src="decorateLeft" alt="">
          </div>
          <div class="login-title">
            数字化转型管控集成平台
          </div>
          <div class="right-img">
            <img :src="decorateRight" alt="">
          </div>
        </div>
        <div class="login-main">
          <div class="login-nav">
            <platform-menu :is-login="isLogin" popover-placement="right-start" />
          </div>
          <div class="login-content">
            <div v-if="isLogin" class="login-succeed">
              <div class="content">
                <h3>Hi，您好</h3>
                <p>我们又有新升级啦！五彩云BPM极速版细分了6大业务平台，欢迎体验！</p>
              </div>
            </div>
            <div v-else class="login-form">
              <el-form ref="form" class="form" :model="form" :rules="rules">
                <div class="login-logo">
                  <img class="logo" :src="logo" alt="">
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getLoginMessage } from '@/bas/api/app'
import { getCurrentUser } from '@/bpa/api/user'
import logo from '@/bas/assets/img/login/logo.png'
import decorateLeft from '@/bas/assets/img/login/decorateLeft.png'
import decorateRight from '@/bas/assets/img/login/decorateRight.png'
import cookie from 'js-cookie'
import PlatformMenu from '@/bas/components/PlatformMenu'
import { createNamespacedHelpers } from 'vuex'
const userInfo = createNamespacedHelpers('userInfo')
const app = createNamespacedHelpers('app')
export default {
  name: 'Login',
  components: {
    PlatformMenu
  },
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
      decorateLeft: decorateLeft,
      decorateRight: decorateRight,
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
                        console.log(res)

                        const userMenu = JSON.parse(localStorage.getItem('db'))
                          .userInfo.userMenu
                        if (userMenu.length !== 0) {
                          this.isLogin = true
                          // const path = userMenu[0].url
                          // than.$router.push({
                          //   path
                          // })
                        }
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
  width: 100%;
  height: 100vh;
  background: url('../../assets/img/login/loginBeijing.png') no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  overflow: auto;
  .login-layout {
    width: 100%;
    min-width: 1200px;
    min-height: 100vh;
    padding: 30px 60px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-wrap {
    width: 100%;
    max-width: 1300px;
  }
  .login-header {
    width: 100%;
    height: 40px;
    margin-bottom: 30px;
    display: flex;
    .left-img, .right-img {
      flex: 1;
      display: flex;
      align-items: center;
      img {
        height: 100%;
      }
    }
    .left-img {
      justify-content: flex-end;
    }
    .login-title {
      width: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 600;
      color: #293EAD;
      overflow: hidden;
    }
  }
  .login-main {
    position: relative;
    width: 100%;
    // height: calc(100vh - 186px);
    height: $login-main-height;
    box-sizing: border-box;
  }
  .login-nav {
    float: left;
    width: 300px;
    height: 100%;
    margin-right: 20px;
    overflow: hidden;
  }
  .login-content {
    height: 100%;
    overflow: hidden;
  }
  .login-succeed {
    height: 100%;
    background: url('../../assets/img/login/loginSucceedBg.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    .content {
      position: absolute;
      top: 30%;
      left: 6%;
      width: 36%;
      h3 {
        font-size: 30px;
      }
      p {
        margin-top: 20px;
        line-height: 24px;
        font-size: 14px;
        color: #666666;
      }
    }
  }
  .login-form {
    height: 100%;
    background: url('../../assets/img/login/loginBg.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
  }
  .form {
    width: 260px;
    text-align: center;
    position: absolute;
    right: 4%;
    top: 24%;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 6px;
  }
  .login-logo {
    margin-bottom: 16px;
    img {
      width: 160px;
    }
  }
  .input {
    position: relative;
    margin-bottom: 24px;
    /deep/ .el-form-item__error {
      margin-top: 4px;
    }
  }
  .input /deep/ .el-input__inner {
    height: 40px;
    line-height: 40px;
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
    height: 40px;
    border-radius: 5px;
    color: white;
    border: 0;
    background: #3D55D3;
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
    background-size: 17px
  }
  .pwd {
    background: url(../../assets/img/login/pass.png) 10px no-repeat;
    background-size: 17px
  }
  .forget-pwd {
    text-align: right;
    padding-right: 38px;
  }
}
</style>
