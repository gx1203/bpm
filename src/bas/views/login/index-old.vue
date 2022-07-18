<template>
  <div class="login">
    <el-form ref="form" class="form" :model="form" :rules="rules">
      <h2 class="input">
        {{ $t('userLogin') }}
      </h2>
      <el-form-item class="input" prop="name">
        <el-input
          v-model="form.name"
          clearable
          :placeholder="$t('pleaseEnterUserName')"
          @keyup.enter.native="loginClick('form')"
        />
        <div class="name icon" />
      </el-form-item>
      <el-form-item class="input" prop="password">
        <el-input
          v-model="form.password"
          clearable
          type="password"
          :placeholder="$t('pleaseEnterPassword')"
          @keyup.enter.native="loginClick('form')"
        />
        <div class="pwd icon" />
      </el-form-item>
      <el-form-item align="left" class="but input">
        <el-button @click="loginClick('form')">
          {{ $t('confirmLogin') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <!--  <bas-login :isPassLogin="isPassLogin" @loginVerification="loginVerification" @fnCallLoginSuccess="fnCallLoginSuccess" />-->
</template>
<script>
// import { getThemeColorInfo } from "@/bpm/api/app";
import { getLoginCount, getLoginMessage } from '@/bas/api/app'
import { getCurrentUser } from '@/bpa/api/user'
import { Base64 } from '@/utils/common'
import { getUserNav } from '@/bpa/api/common'
import { createNamespacedHelpers } from 'vuex'
import cookie from 'js-cookie'
import Vue from 'vue'
import BasLogin from 'bas-component'
Vue.use(BasLogin)
import 'bas-component/lib/BasComponent.css'
const userInfo = createNamespacedHelpers('userInfo')
const app = createNamespacedHelpers('app')
// const { mapMutations } = createNamespacedHelpers('app')
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
            message: this.$t('pleaseEnterUserName'),
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
      isPassLogin: true
    }
  },
  computed: {
    ...userInfo.mapGetters(['getUserMenu'])
  },
  created() {
    this.$loading().close()
  },
  methods: {
    ...userInfo.mapActions(['requireMenu']),
    ...app.mapActions(['refreshModuleList']),
    // ...mapMutations(['setThemeColor','setThemeColorId','setCustomThemeColor']),
    getUserMenu2() {
      getUserNav(1).then(res => {
        if (!res) return false
        res.forEach(item => {
          item.checked = item.url === '/doorCenter'
        })
        localStorage.setItem('userMenu2', JSON.stringify(res))
      })
    },
    loginClick(formName) {
      const than = this
      than.$refs[formName].validate(async valid => {
        if (valid) {
          // const res = await getLoginCount('00041956')
          // console.log('🍓🍓🍓', res)
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
                    // console.log('🍓登录返回数据', datas)
                    const data = {
                      id: than.form.name,
                      password: than.form.password,
                      empuid: than.form.name,
                      cnname: datas.displayname,
                      displayname: datas.displayname,
                      res: datas
                    }
                    // than.getUserMenu2()
                    cookie.set('isLogin', 'isLogin', 0)
                    // console.log('🍓localStorage-userInfo', data)
                    // console.log('🍓localStorage-portalCurrentUserInfo', data)
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
                          console.log(userMenu)
                          const path = userMenu[0].url
                          console.log('草莓', path)
                          than.$router.push({
                            path
                          })
                        }
                      })
                    // than.requireMenu().then(res => {
                    //   console.log(res)
                    //   // than.$router.push({
                    //   //   path: '/doorCenter'
                    //   // })
                    // })
                  })
                  .catch(er => {})

                // getThemeColorInfo().then(rt => {
                //   console.log('rt----------------------登录初始化获取颜色', rt)
                //   if (rt.status === '200') {
                //     this.setThemeColor(rt.data.color)
                //     this.setThemeColorId(rt.data.id)
                //     this.setCustomThemeColor(rt.data.color)
                //   }
                // })
              }
            })
            .catch(er => {
              console.log(er)
              than.load = false
            })
        }
      })
    },
    loginVerification(form) {
      if (form.password === '123456') {
        this.$alert('首次登录需要修改密码！', '修改密码', {
          confirmButtonText: '确定'
        })
        this.isPassLogin = false
      } else {
        this.isPassLogin = true
      }
    },
    fnCallLoginSuccess(rt, form) {
      const than = this
      if (rt && rt.status === '200') {
        localStorage.setItem(
          'language',
          localStorage.getItem('language') || 'cn'
        )
        localStorage.setItem(
          'portalCurrentUserInfo',
          JSON.stringify({
            empuid: form.name
          })
        )
        getCurrentUser(form.name)
          .then(datas => {
            const data = {
              id: form.name,
              password: form.password,
              empuid: form.name,
              cnname: datas.displayname,
              displayname: datas.displayname,
              res: datas
            }
            // than.getUserMenu2()
            localStorage.setItem('userInfo', JSON.stringify(data))
            localStorage.setItem('portalCurrentUserInfo', JSON.stringify(data))
            this.millisecond = new Date().getTime()
            this.expiresTime = new Date(
              this.millisecond + 60 * 1000 * 24 * 60 * 3
            )
            console.log(this.expiresTime)
            cookie.set('username', rt.data.name, {
              expires: this.expiresTime
            })
            if (!cookie.get('lan-local')) {
              const millisecond = new Date().getTime()
              const expiresTime = new Date(
                millisecond + 60 * 1000 * 24 * 60 * 30
              )
              cookie.set('lan-local', localStorage.getItem('language'), {
                expires: expiresTime
              })
            }
            than.$store.dispatch('basuser/saveUser', data)
            than.requireMenu().then(() => {
              localStorage.setItem(
                'userMenu',
                Base64.encode(JSON.stringify(than.getUserMenu))
              )
              than.$router.replace({
                path: '/doorCenter'
              })
            })
          })
          .catch(er => {})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  width: 100%;
  min-width: 1200px;
  height: 100vh;
  min-height: 625px;
  background: url('../../assets/img/login/loginBg.png') no-repeat;
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
