<template>
  <div class="app-container">
    <div class="routerBar">
     <router-link :to="'/projectManager/proManager'"> < 新建项目</router-link> <span> （仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
          <el-button size="mini" type="primary">保存</el-button>
          <el-button size="mini" type="default">取消</el-button>
      </div>
    </div>
    <div class="titleBar">项目基础信息</div>
    
    <div class="whiteBox">
       <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-row>         
            <el-col :span="8" :offset="1">
                 <el-form-item label="项目编号" prop="proCode">
                <el-input v-model="form.proCode" placeholder="请输入项目编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8"  :offset="3">
                 <el-form-item label="项目名称" prop="proName">
                <el-input v-model="form.proName" placeholder="请输入项目名称" clearable></el-input>
              </el-form-item>
            </el-col>
        </el-row>
      </el-row>
       </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {   form: {
        totalDate: ["2022-01-01", "2022-12-31"],
        totalScope: "1",
        proName: "",
        proCode: "",
        totalState: "1",
        totalLeval: "1",
      },
       // 表单校验
      rules: {
          proName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
         proCode: [
          { required: true, message: "项目编号不能为空", trigger: "blur" }
        ],
        // userName: [
        //   { required: true, message: "用户名称不能为空", trigger: "blur" },
        //   // { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        // ],
        // nickName: [
        //   { required: true, message: "用户昵称不能为空", trigger: "blur" }
        // ],
        // password: [
        //   { required: true, message: "用户密码不能为空", trigger: "blur" },
        //   { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        // ],
        // email: [
        //   {
        //     type: "email",
        //     message: "请输入正确的邮箱地址",
        //     trigger: ["blur", "change"]
        //   }
        // ],
        // phonenumber: [
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur"
        //   }
        // ]
      }};
  },
  mounted() {},
  methods: {},

  beforeCreate() {
    document
      .querySelector("body,html")
      .setAttribute("style", "background-color:#E8E8F4;");
  },

  beforeDestroy() {
    document.querySelector("body,html").removeAttribute("style");
  },
};
</script>
<style lang="scss" scoped>
.app-container{
  padding: 0;
}
.routerBar{
  a{
    color:#557DB3
  }
  span{
    font-size: 12px;
    color: #999;
  }
}
 
</style>
