<template>
    <div class='app-container'>
        <div>成员信息</div>
        <div class='icon'>
            <div @click='goBack' style='cursor: pointer;'>
                <i class='el-icon-arrow-left'></i>
                <span>返回</span>
            </div>
            <div style='cursor: pointer;'>
                <span @click='sendInvitation'>发送邀请 |</span>
                <span @click='skillLock(1)' v-if='info.skillLock==0'> 技能锁定 |</span><span @click='skillLock(0)'  v-if='info.skillLock==1'> 技能解锁 |</span>
                <span @click='editInfo'> 编辑 |</span>
                <span @click='stop(1)' v-if='info.status==0'> 停用 |</span><span @click='stop(0)' v-if='info.status==1'> 启用 |</span>
                <span @click='del'> 删除</span>
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
                 <div style="margin:20px;font-size:18px;">
                  <i class='el-icon-unlock' v-if='info.skillLock==0'></i>
                   <i class='el-icon-lock' v-if='info.skillLock==1'></i>
                    <span class='title'>工作技能:</span>
                    <span class='work' v-for='(item,index) in info.userSkills' :key='index' :style="{background: matchColor(item.cssClass)}">{{item.skillName}}</span>
                    
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
    </div>
</template>
<script>

import {
userDetail,stopUse,skillLocking,delUser
} from "@/api/system/user";
import { color } from '@/components/ColorSelect/options'
export default {
  data(){
    return{
        userId:this.$route.query.userId,
        info:{},
        
    }
  },
  mounted(){
    this.detailInfo()
  },
  methods:{
    // 详情
    detailInfo(){
        userDetail(this.userId).then(res=>{
            this.info=res.data
            
        })
    },
    //返回
    goBack(){
        const obj = {
            path: "/system/user",
        };
      this.$tab.closeOpenPage(obj);
    },
    //编辑
    editInfo(){
        const obj = { path:'/system/user-auth/editAddInfo',query:{userInfo:this.info,isEdit:1}};
            // getToday()
        this.$tab.closeOpenPage(obj);
    },
    //发送邀请
    sendInvitation(){

    },
    //技能锁定
    skillLock(code){
        skillLocking({skillLock:code,userId:this.userId}).then(res=>{
            if(res.code==200){
                this.$message.success(res.msg)
                this.detailInfo()
            }
        })
    },
    //停用
    stop(code){
         stopUse({status:code,userId:this.userId}).then(res=>{
        if(res.code==200){
          this.$message.success(res.msg)
          this.detailInfo()
        }

      })
    },
    //删除
    del(){
        delUser(this.userId).then(res=>{
            if(res.code==200){
                this.$message.success(res.msg)
                // this.detailInfo()
                 this.$router.go(-1)
            }

        })
    },
     // 匹配颜色
    matchColor(cssClass) {
      if (cssClass) {
        return color.find(v => v.cssClass === cssClass).color
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon{
    margin:10px 0;
    display: flex;
    justify-content: space-between;
    background:#E8E8F4;
    height:30px;
    line-height:30px;
    color: #3d7dff;
    padding:0px 10px;
}
.img-user{
    display: inline-block;
    img{
    width:80px;
    height:80px;
    border-radius: 40px;
    }
  
    
}
  .user-name{
         display: inline-block;
         height:80px;
        vertical-align: top;
        line-height: 80px;
        margin-left:20px;
        font-size:18px;
    }
.title{
    display: inline-block;
    min-width:60px;
    padding:0 20px;
    text-align:right;
    margin-right:10px;
    color:#a8b5c1;
}
.content{
    margin-right:15px;
}
.work{
    display: inline-block;
    width:100px;
    height:30px;
    text-align: center;
    border-radius: 20px;
    background:red;
    color:#ffffff;
    line-height:30px;
    margin-right:15px;
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