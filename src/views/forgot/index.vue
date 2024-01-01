<template>
  <div class="content">
    <div class="title ml190">采购系统</div>
    <div class="limited ml190">

      <el-form class="login-form" label-position="top" ref="loginForm" label-width="80px" :model="form" :rules="rules"
               onsubmit="return false"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" @change="submitUserName"></el-input>
        </el-form-item>
        <el-form-item label="企业邮箱" prop="identify">
          <el-input v-model="form.identify" placeholder="请输入企业邮箱" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="captchaCode">
          <div style="display: flex;">
            <div>
              <el-input v-model="form.captchaCode" placeholder="请输入验证码"></el-input>
            </div>
            <div style="margin-left: 35px" @click="getCodeImg">
              <img :src="form.verificationImage" alt="验证码图片">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="validCode">
          <div style="display: flex;">
            <div>
              <el-input v-model="form.validCode" placeholder="请输入邮箱验证码"></el-input>
            </div>
            <div style="margin-left: 35px">
              <el-button type="primary" @click="getEmailCode" v-if="!sendMsgDisabled">获取验证码</el-button>
              <el-button v-if="sendMsgDisabled" plain>{{ time+'秒后获取' }}</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input  v-model="form.password" placeholder="请输入新密码" show-password type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input  v-model="form.confirmPassword" placeholder="请再次输入新密码" show-password type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" style="width: 100%">确认修改</el-button>
          <!--          <el-button @click="resetForm">重置</el-button>-->
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import forgotApi from '@/api/forgot/forgot'

export default {
  name: 'login',
  data() {
    return {
      form: {
        identify:'',
        verificationImage: '', //图片验证码
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        // identify: [
        //   { required: true, message: '请输入企业邮箱', trigger: 'blur' }
        // ],
        captchaCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        validCode: [
          { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      },
      time: 60, // 发送验证码倒计时
      sendMsgDisabled: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  computed: {
    emailCodeDisabled() {
      // 根据需要添加禁用逻辑
      return false
    }
  },
  created() {
    /* 获取验证码 */
    this.getCodeImg()
  },
  methods: {
    submitUserName(query){
      console.log(query)
      let formData = new FormData()
      formData.append('username',query)
      forgotApi.getEmailByName(formData).then(res=>{
        if(res.code === 200){
          this.form.identify = res.email;
        }
      })
    },
    getCodeImg(){
      forgotApi.sendCode().then(res => {
        if(res.code === 200){
          let imgElement = document.createElement('img');
          this.form.verificationImage = 'data:image/*;base64,' + res.img;
          this.form.uuid = res.uuid;
        }
      })
    },
    getEmailCode() {
      const that = this
      const regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if(!regExp.test(that.form.identify)){
        this.$message({
          message: '请输入正确的邮箱',
          type:'error'
        })
        return false
      }

      let formData = new FormData()
      formData.append('validType','2')
      formData.append('identify',that.form.identify)
      forgotApi.getEmail(formData).then(res => {
        if(res.code === 200){
          that.form.validUuid=res.uuid;
        }
      })


      that.sendMsgDisabled = true
      const interval = window.setInterval(function() {
        if ((that.time--) <= 0) {
          that.time = 60
          that.sendMsgDisabled = false
          window.clearInterval(interval)
        }
      }, 1000)



    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if(this.form.password!== this.form.confirmPassword){
            this.$message({
              message: '两次密码不一致',
              type:'error'
            })
            return false
          }
          let formData = new FormData()
          formData.append('username', this.form.username)
          formData.append('captchaCode', this.form.captchaCode)
          formData.append('validCode', this.form.validCode)
          formData.append('password', this.form.password)
          formData.append('uuid', this.form.uuid)
          formData.append('validUuid', this.form.validUuid)
          formData.append('identify', this.form.identify)
          forgotApi.checkEmail(formData).then(res => {
            if(res.code === 200){
              this.$message({
                message: '修改成功',
                type:'success'
              })
              this.$router.push({
                path: '/login'
              })
            }
          })
        }else {
          console.log('表单校验失败')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.loginForm.resetFields()
    }

  }
}
</script>
<style lang="scss">
.limited {
  .el-form-item__label {

    padding-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
html, body {
  height: 100%;
}

.content {
  width: 100vw;
  height: 100vh;
  background: url(../../assets/images/loginBackground.png) no-repeat center center;
  background-size: cover;
  box-sizing: border-box;
  //padding-top: 47px;
  //overflow: hidden;
  overflow-y: scroll;

}

.ml190 {
  margin-left: 190px;
}

.limited {
  width: 420px;
  margin-top: 90px;

  .btn {
    height: 50px;
    background: linear-gradient(90deg, #3F34DB 0%, #5280F9 100%);
  }
}

.title {
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

.login-code-img {
  height: 38px;
}
</style>
