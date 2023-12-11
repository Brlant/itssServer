<template>
  <div class="content">
    <div class="title ml190">采购系统</div>
    <div class="limited ml190">
      <el-form class="login-form" label-position="top" ref="loginForm" label-width="80px" :model="form" :rules="rules"
               onsubmit="return false"
      >
        <el-form-item label="企业邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入企业邮箱"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode">
          <div style="display: flex;">
            <div>
              <el-input v-model="form.verificationCode" placeholder="请输入验证码"></el-input>
            </div>
            <div style="margin-left: 35px">
              <img :src="form.verificationImage" alt="验证码图片">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <div style="display: flex;">
            <div>
              <el-input v-model="form.emailCode" placeholder="请输入邮箱验证码"></el-input>
            </div>
            <div style="margin-left: 35px">
              <el-button type="primary" @click="getEmailCode" :disabled="emailCodeDisabled">获取验证码</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="form.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" placeholder="请再次输入新密码"></el-input>
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


export default {
  name: 'login',
  data() {
    return {
      form: {
        email: '',
        verificationCode: '',
        verificationImage: '',
        emailCode: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入企业邮箱', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        emailCode: [
          { required: true, message: '请输入邮箱验证码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      }

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

  },
  methods: {
    getEmailCode() {
      // 获取邮箱验证码的逻辑
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 提交表单的逻辑
        } else {
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
