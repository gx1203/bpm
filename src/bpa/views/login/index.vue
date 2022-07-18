<template>
  <div id="login">
    <img src="../../assets/img/login_bg.jpg" alt="" />
    <!--    <form ref="ssoFrm" :action="logInUrl" name="ssoFrm" method="POST">-->
    <!--      <input ref="loginFormUsername" :value="username" type="text" name="username" hidden>-->
    <!--      <input ref="loginFormPassword" :value="password" type="text" name="password" hidden>-->
    <!--    </form>-->
    <div class="login_wrap" @keyup.13="loginClick">
      <h4>欢迎登录BPA系统</h4>
      <div class="input_wrap">
        <input type="text" v-model="username" />
        <i class="icon iconfont icon-zhanghao"></i>
        <span>账户</span>
      </div>
      <div class="input_wrap">
        <input type="password" v-model="password" />
        <i class="icon iconfont icon-mima"></i>
        <span>密码</span>
      </div>
      <el-checkbox v-model="isAutoLogin">自动登录</el-checkbox>
      <div class="submit">
        <el-button class="submit_btn" type="primary" @click="loginClick"
          >登录</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { login } from "../../api/user";
import cookie from "js-cookie";
import { clearCookies, Base64 } from "@/bpa/utils/common";
import { createNamespacedHelpers } from "vuex";

// import md5 from 'js-md5'
// import { Base64 } from 'js-base64'

const userInfo = createNamespacedHelpers("userInfo");

export default {
  data() {
    return {
      isAutoLogin: false,
      username: "",
      password: "",
      millisecond: "",
      // cookie限制时间
      expiresTime: "",
      logInUrl: `${process.env.HOST_URL}${process.env.BASE_URL}/authentication/form`,
    };
  },
  computed: {
    ...userInfo.mapGetters(["getUserMenu"]),
  },
  mounted() {
    console.log(this.logInUrl);
    // cookie.set('JSESSIONID', '2D3D27EEE460E40619A19A24ECDAAAFA', { expires: this.expiresTime, path: '/' })
    if (cookie.get("username")) {
      this.username = cookie.get("username");
      this.password = "ab1234";
      this.loginClick();
    }
  },
  methods: {
    ...userInfo.mapMutations(["setUserAuthority"]),
    ...userInfo.mapActions(["requireMenu"]),
    loginClick() {
      if (!this.username || !this.password) {
        this.$message({
          type: "warning",
          message: "账户或者密码不能为空!",
        });
        return false;
      }
      // this.$refs['ssoFrm'].submit()
      // login({ userid: Base64.encode(this.username), password: Base64.encode(this.password) }).then(async (rt) => {
      let formData = new FormData();
      formData.append("username", this.username);
      formData.append("password", this.password);
      login(formData)
        .then(async (rt) => {
          if (!rt) return false;
          rt.empuid = rt.name;
          console.log(1111111111111111111, rt);
          localStorage.setItem("isAutoLogin", this.isAutoLogin);
          localStorage.setItem("portalCurrentUserInfo", JSON.stringify(rt));
          this.millisecond = new Date().getTime();
          this.expiresTime = new Date(
            this.millisecond + 60 * 1000 * 24 * 60 * 3
          );
          console.log(this.expiresTime);
          cookie.set("username", rt.name, { expires: this.expiresTime });
          // 获取菜单
          // 先清空cookie
          // clearCookies()
          this.requireMenu().then(() => {
            localStorage.setItem(
              "userMenu",
              Base64.encode(JSON.stringify(this.getUserMenu))
            );
            this.$message({
              type: "success",
              message: "登录成功！",
            });
            this.$router.replace("/doorCenter");
          });
        })
        .catch((e) => {
          this.$message({
            type: "warning",
            message: "登录失败！",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  position: relative;
  min-height: 650px;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
  .login_wrap {
    width: 280px;
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px 30px 40px;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 160px;
    background: rgba($color: #fff, $alpha: 0.15);
    h4 {
      color: #fff;
      font-size: 17px;
      text-align: center;
      font-weight: normal;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }
    .input_wrap {
      width: 100%;
      height: 30px;
      position: relative;
      margin-bottom: 20px;
      input {
        display: block;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: 1px solid #fff;
        background: transparent;
        border-radius: 3px;
        padding-left: 50px;
        color: #fff;
        box-sizing: border-box;
      }
      // input:-internal-autofill-selected {
      //   -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0) inset;
      // }
      .icon {
        position: absolute;
        left: 6px;
        top: 50%;
        transform: translateY(-50%);
        color: #fff;
        font-size: 14px;
      }
      span {
        color: #fff;
        font-size: 12px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%) scale(0.8);
        left: 22px;
      }
    }
  }
  .submit {
    margin-top: 30px;
    .submit_btn {
      width: 100%;
    }
  }
}
</style>
