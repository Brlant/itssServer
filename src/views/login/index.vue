<template>
    <div class="content">
       <div class="title ml190">运输调度平台</div>
       <div class="limited ml190">
            <el-form class="login-form" label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                        onsubmit="return false">
                <!-- <el-form-item label="系统代码" prop="orgCode" >
                    <el-input v-model="user.orgCode" placeholder="请输入业务单位编码" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="user.username" placeholder="手机号/邮箱/用户名" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" style="position:relative" prop="password">
                    <el-input v-model="user.password" placeholder="请输入密码" show-password type="password" @keyup.enter.native="handleLogin" auto-complete="off"></el-input>
                    <!-- <router-link style="position: absolute;top:-35px;right:0; color:#3D7DFF" to="/forget">激活账号/忘记密码?</router-link> -->
                </el-form-item>
<!--                <el-form-item label="验证码" prop="code">-->
<!--                    <el-input-->
<!--                    v-model="user.code"-->
<!--                    auto-complete="off"-->
<!--                    placeholder="验证码"-->
<!--                    style="width: 63%"-->
<!--                    @keyup.enter.native="handleLogin"-->
<!--                    >-->
<!--                    &lt;!&ndash; <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" /> &ndash;&gt;-->
<!--                    </el-input>-->
<!--                    <div class="login-code">-->
<!--                        <img :src="codeUrl" @click="getCode" class="login-code-img"/>-->
<!--                    </div>-->
<!--                </el-form-item>-->
                <el-checkbox v-model="user.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
                <el-form-item style="width:100%;">
                    <el-button
                    :loading="loading"
                    size="medium"
                    type="primary"
                    style="width:100%;"
                    class="btn"
                    @click.native.prevent="handleLogin"
                    >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                    </el-button>
                    <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                    </div>
                </el-form-item>
                </el-form>
       </div>

    </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

    export default {
        name:'login',
        data(){
            return{
                codeUrl: "",
                user:{
                    username: "",
                    password: "",
                    rememberMe: false,
                    // code: "",
                    // uuid: ""
                },
                rules: {
                    // orgCode: [
                    //     {required: true, message: '请输入业务单位编码', trigger: 'blur'}
                    // ],
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    code: [{required: true, message: '请输入验证码', trigger: 'change'}],
                },
                btnString:'点击登录',
                loading: false,
                // 验证码开关
                captchaEnabled: true,
                // 注册开关
                register: false,
                redirect: undefined
            }
        },
        watch: {
            $route: {
                handler: function(route) {
                    this.redirect = route.query && route.query.redirect;
                },
                immediate: true
            }
        },
        created() {
            // this.getCode();
            this.getCookie();
        },
        methods:{
            getCode() {
                getCodeImg().then(res => {
                    this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
                    if (this.captchaEnabled) {
                    this.codeUrl = "data:image/gif;base64," + res.img;
                    this.user.uuid = res.uuid;
                    }
                });
            },
            getCookie() {
                const username = Cookies.get("username");
                const password = Cookies.get("password");
                const rememberMe = Cookies.get('rememberMe')
                this.user = {
                    username: username === undefined ? this.user.username : username,
                    password: password === undefined ? this.user.password : decrypt(password),
                    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
                };
            },
            handleLogin() {

                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                    this.loading = true;
                    if (this.user.rememberMe) {
                        Cookies.set("username", this.user.username, { expires: 30 });
                        Cookies.set("password", encrypt(this.user.password), { expires: 30 });
                        Cookies.set('rememberMe', this.user.rememberMe, { expires: 30 });
                    } else {
                        Cookies.remove("username");
                        Cookies.remove("password");
                        Cookies.remove('rememberMe');
                    }
                    this.$store.dispatch("Login", this.user).then(() => {
                        this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
                    }).catch(() => {
                        this.loading = false;
                        if (this.captchaEnabled) {
                            // this.getCode();
                        }
                    });
                    }
                });
                }
        }
    }
</script>
<style  lang="scss">
    .limited {
            .el-form-item__label{
            // display: block;
            padding-bottom: 0;
        }
    }
</style>
<style  lang="scss" scoped>
.content{
    width: 100vw;
    height: 100vh;
    background: url(../../assets/images/loginBackground.png) no-repeat center center;
    background-size: 100% 100%;
    box-sizing: border-box;
    padding-top:  47px;

}
.ml190{
    margin-left: 190px;
}
.limited{
    width: 420px;
    margin-top: 90px;

    .btn{
        height: 50px;
        background: linear-gradient(90deg, #3F34DB 0%, #5280F9 100%);
    }
}
.title{
    width: 464px;
    height: 72px;
    font-size: 30px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #347CEF;
    box-sizing: border-box;
     padding-left: 15px;
    line-height: 72px;
}
.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
// .el-login-footer {
//   height: 40px;
//   line-height: 40px;
//   position: fixed;
//   bottom: 0;
//   width: 100%;
//   text-align: center;
//   color: #fff;
//   font-family: Arial;
//   font-size: 12px;
//   letter-spacing: 1px;
// }
.login-code-img {
  height: 38px;
}
</style>
