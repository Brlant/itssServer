<template>
  <div class="app-container">
    <div class="icon">
      <div class="editTitle">
        <i class="el-icon-arrow-left" @click='goBack'></i>
        <span>个人资料修改</span>
      </div>
      <div style="cursor: pointer" class="ope">
        <!-- <span @click='changeAccount'>账号更改 |</span> -->
        <el-button
          type='primary'
          :disabled="submitLoading"
          @click='save'
        >
          保存
        </el-button>
         <el-button @click='cancle'>取消</el-button>
      </div>
    </div>
     <div>
            <div>
                <div class='img-user'>
                    <img src="@/assets/images/profile.jpg" alt="">
                </div>
                <span class='user-name'>
                    <span>{{info.nickName}}</span>
                    <i class='el-icon-male' v-if='info.sex==0' style='color:#3d7dff;margin-left:10px;'></i>
                    <i class='el-icon-male'  v-if='info.sex==1' style='color:pink;margin-left:10px;'></i>
                </span>
            </div>
            <div>
                <div style="margin:20px;font-size:18px;">
                    <span style="color:red">*</span>
                    <span class='title'>手机号:</span>
                    <span>{{info.phonenumber}}</span>
                </div>
                 <div style="margin:20px;font-size:18px;">
                    <span style="color:red">*</span>
                    <span class='title'>账号:</span>
                    <span>{{info.userName}}</span>
                </div>
                 <div style="margin:20px;font-size:18px;">

                    <span class='title'>工号:</span>
                    <span>{{info.employeeNo}}</span>
                </div>
                 <div style="margin:20px;font-size:18px;">

                    <span class='title'>邮箱:</span>
                    <span>{{info.email}}</span>
                </div>
                   <div style="margin:20px;0;font-size:18px;">

                    <span class='title'>区域:</span>
                    <span>{{info.regionName}}</span>
                </div>
                  <div style="margin:20px;font-size:18px;">

                    <span class='title'>职位类型:</span>
                    <span class="content">{{info.postType}}</span>
                    <span class='title'>职位名称:</span>
                    <span class="content">{{info.postName}}</span>
                    <span class='title'>等级:</span>
                    <span class="content">{{info.postLevel}}</span>
                </div>
                   <div style="margin:20px;font-size:18px;">

                    <span class='title'>入职时间:</span>
                    <span class="content">{{info.inTime}}</span>
                    <span class='title'>离职时间:</span>
                    <span>{{info.outTime}}</span>

                </div>
                 <div style="margin:20px;font-size:18px;" v-if='info.skillLock==1'>

                   <i class='el-icon-lock' v-if='info.skillLock==1'></i>
                    <span class='title'>工作技能:</span>
                    <span class='work' v-for='(item,index) in info.userSkills' :key='index' :style="{background: matchColor(item.cssClass)}">{{item.skillName}}</span>

                </div>
                 <div style="margin:20px;font-size:18px;display:flex;"  v-else>

                   <div slot="label"><i class='el-icon-unlock' v-if='info.skillLock==0'></i>
                  工作技能：</div>
                    <skill-select v-model="skillIds" />

                </div>
                 <div style="font-size:18px;display:flex;">

                    <el-form
                      ref="elForm"
                      :model="info"
                      size="medium"
                      label-width="110px"
                      >
                      <el-row>
                        <el-col :span='24'>
                          <el-form-item label="TB用户ID:" prop="tbUserId">
                          <el-input
                            v-model="info.tbUserId"
                            placeholder="请输入TB用户ID"
                          ></el-input>
                        </el-form-item>
                        </el-col>
                      </el-row>

                       <el-row>
                        <el-col :span='24'>
                          <el-form-item label="git账号:" prop="gitAccount">
                          <el-input
                            v-model="info.gitAccount"
                            placeholder="请输入git账号"
                          ></el-input>
                        </el-form-item>
                        </el-col>
                      </el-row>
                      </el-form>

                </div>
            </div>
        </div>
        <div>
             <div class="titleinfo">权限信息</div>
            <div style="font-size:18px;">
                   <div style="margin:20px;font-size:18px;">

                    <span class='title'>系统角色:</span>
                    <span v-for='(item,index) in info.roles' :key='index'>
                        <span>{{item.roleName}}</span>
                        <span v-if='index<info.roles.length-1'>,</span>
                    </span>
                </div>
                  <div style="margin:20px;font-size:18px;">

                    <span class='title'>所属部门:</span>
                    <span v-if='info.dept' class="content">{{info.dept.deptName}}</span>
                    <span class='title'>负责人:</span>
                    <span v-if='info.dept' class="content">{{info.dept.leaderName}}</span>
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
import {
userDetail,stopUse,skillLocking,delUser,editSkill
} from "@/api/system/user";
import { color } from '@/components/ColorSelect/options'
import SkillSelect from "@/components/SkillSelect/index";
export default {
     components: {
    SkillSelect
  },
  data() {
    return {
      dialogFormVisible: false,
      info:{},
      form: {
        tel: "",
        verification: "",
      },
      skillIds:[],
       rules: {
          tel: [
            { required: true, message: '请输入新手机号', trigger: 'blur' },
          ],
           verification: [
            { required: true, message: '请输入短信验证码', trigger: 'blur' },
          ],
        },
      submitLoading: false
    };
  },
  created() {
    this.detail()
  },
  methods: {
      // 匹配颜色
    matchColor(cssClass) {
      if (cssClass) {
        return color.find(v => v.cssClass === cssClass).color
      }
    },
    //编辑个人信息
    save() {
        let data = {
            userId:this.$store.state.user.user.userId,
            skillIds:this.skillIds,
            tbUserId:this.info.tbUserId,
            gitAccount:this.info.gitAccount

        }
        console.log(data)
        this.submitLoading = true
       editSkill(data).then(res=>{
         this.submitLoading = false
            if(res.code==200){
                this.$message.success(res.msg)
            //      const obj = {
            //     path: "/user/profile",
            // };
            // // getToday()
            // this.$tab.closeOpenPage(obj);
             this.$router.go(-1)
            }
       }).catch(()=>{
         this.submitLoading = false
       })
    },
    cancle(){
       this.$router.go(-1)
    },
    detail() {
      // let id=this.$store.state.user.user.userId
      let id;
      if(this.$route.query.userId){
        id=this.$route.query.userId
      }else{
         id=this.$store.state.user.user.userId
      }

        userDetail(id).then(res=>{
            this.info=res.data
             this.skillIds = res.data.userSkills.map((v) => v.skillId);
             console.log(this.skillIds,'this.skillIds')

        })

    },
    goBack(){
      //   const obj = {
      //   path: "/user/profile",
      // };
      // // getToday()
      // this.$tab.closeOpenPage(obj);
      this.$router.go(-1)
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
