<template>
  <div class="app-container">
    <div class="icon">
      <div class="editTitle">
        <span>个人中心</span>
      </div>
      <div style="cursor: pointer" class="ope">
        <span @click='changeAccount'>账号更改 |</span>
        <span @click='edit'> 编辑 </span>
      </div>
    </div>
    <div>
      <div>
        <div class="img-user">
          <img src="@/assets/images/profile.jpg" alt="" />
        </div>
        <span class="user-name">
          <span>1111</span>
          <i class="el-icon-male"></i>
        </span>
      </div>
      <div>
        <div style="margin: 20px; font-size: 18px">
          <span style="color: red">*</span>
          <span class="title">手机号/账号:</span>
          <span>122837784949</span>
        </div>
        <div style="margin: 20px; font-size: 18px">
          <span class="title">工号:</span>
          <span>7784949</span>
        </div>
        <div style="margin: 20px; font-size: 18px">
          <span class="title">邮箱:</span>
          <span>7784949</span>
        </div>
        <div style="margin:20px;0;font-size:18px;">
          <span class="title">区域:</span>
          <span>7784949</span>
        </div>
        <div style="margin: 20px; font-size: 18px">
          <span class="title">职位类型:</span>
          <span>7784949</span>
          <span class="title">职位名称:</span>
          <span>7784949</span>
          <span class="title">等级:</span>
          <span>7784949</span>
        </div>
        <div style="margin: 20px; font-size: 18px">
          <span class="title">入职时间:</span>
          <span>7784949</span>
          <span class="title">离职时间:</span>
          <span>7784949</span>
        </div>
        <div style="margin: 20px; font-size: 18px">
          <i class="el-icon-unlock"></i>
          <i class="el-icon-lock"></i>
          <span class="title">工作技能:</span>
          <span class="work">7784949</span>
          <span class="work">22222</span>
        </div>
      </div>
    </div>
    <div>
      <div class="titleinfo">权限信息</div>
      <div style="font-size: 18px">
        <div style="margin: 20px; font-size: 18px">
          <span class="title">系统角色:</span>
          <span>aa,fff</span>
        </div>
        <div style="margin: 20px; font-size: 18px">
          <span class="title">直属领导:</span>
          <span>aa,fff</span>
        </div>
        <div style="margin: 20px; font-size: 18px">
          <span class="title">所属部门:</span>
          <span>aa,fff</span>
          <span class="title">负责人:</span>
          <span>aa,fff</span>
        </div>
      </div>
    </div>
    <el-dialog title="账号更改" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="12" :offset="1">
            <el-form-item label="新手机号" prop='tel'>
              <el-input v-model="form.tel" placeholder="请输入新手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="1">
            <el-form-item label="短信验证码" prop='verification'>
              <el-input v-model="form.verification" placeholder="请输入短信验证码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" style='margin-left:15px;'>获取验证码</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: true,
      form: {
        tel: "",
        verification: "",
      },
       rules: {
          tel: [
            { required: true, message: '请输入新手机号', trigger: 'blur' }, 
          ],
           verification: [
            { required: true, message: '请输入短信验证码', trigger: 'blur' }, 
          ],
        }
    };
  },
  mounted() {},
  methods: {
    //编辑个人信息
    edit() {
        
    },
    //更改账号
    changeAccount(){},
    //确定更改
    sure(){
         this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    }
  
  },
};
</script>

<style lang="scss" scoped>
.icon {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  .editTitle {
    font-size: 20px;
  }
  .ope {
    color: #3d7dff;
    padding: 0px 10px;
  }
}
.img-user {
  display: inline-block;
  img {
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }
}
.user-name {
  display: inline-block;
  height: 80px;
  vertical-align: top;
  line-height: 80px;
  margin-left: 20px;
}
.title {
  display: inline-block;
  width: 100px;
  text-align: right;
  margin-right: 10px;
  color: #a8b5c1;
}
.work {
  display: inline-block;
  width: 100px;
  height: 30px;
  text-align: center;
  border-radius: 20px;
  background: red;
  color: #ffffff;
  line-height: 30px;
  margin-right: 15px;
}
.titleinfo {
  height: 50px;
  width: 100%;
  display: block;
  text-indent: 20px;
  line-height: 50px;
  font-size: 18px;
  position: relative;
}
.titleinfo::before {
  content: "|";
  width: 1px;
  height: 30px;
  background-color: #333;
  border: none;
  font-size: 16px;
  margin-right: 10px;
}
</style>