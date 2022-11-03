<template>
    <div class='app-container'>
        <div>成员信息</div>
        <div class='icon'>
            <div>
                <i class='el-icon-arrow-left'></i>
                <span>返回</span>
            </div>
            <div>
                <span>发送邀请 |</span>
                <span> 技能锁定 |</span>
                <span> 编辑 |</span>
                <span> 停用 |</span>
                <span> 删除</span>
            </div>
        </div>
        <div>
            <div>
                <div class='img-user'>
                    <img src="@/assets/images/profile.jpg" alt="">
                </div>
                <span class='user-name'>
                    <span>1111</span>
                    <i class='el-icon-male'></i>
                </span>
            </div>
            <div>
                <div style="margin:15px;0;font-size:18px;">
                    <span style="color:red">*</span>
                    <span class='title'>手机号/账号:</span>
                    <span>122837784949</span>
                </div>
                 <div style="margin:15px;0;font-size:18px;">
                  
                    <span class='title'>工号:</span>
                    <span>7784949</span>
                </div>
                 <div style="margin:15px;0;font-size:18px;">
                  
                    <span class='title'>邮箱:</span>
                    <span>7784949</span>
                </div>
                  <div style="margin:15px;0;font-size:18px;">
                  
                    <span class='title'>区域:</span>
                    <span>7784949</span>
                    <span class='title'>担任职位:</span>
                    <span>7784949</span>
                    <span class='title'>级别:</span>
                    <span>7784949</span>
                </div>
                 <div style="margin:15px;0;font-size:18px;">
                  <i class='el-icon-unlock'></i>
                   <i class='el-icon-lock'></i>
                    <span class='title'>工作技能:</span>
                    <span class='work'>7784949</span>
                    <span class='work'>22222</span>
                </div>
            </div>
        </div>
        <div>
             <div class="titleinfo">权限信息</div>
            <div style="margin:15px;0;font-size:18px;">
                   <div style="margin:15px;0;font-size:18px;">
                  
                    <span class='title'>系统角色:</span>
                    <span>aa,fff</span>
                </div>
                  <div style="margin:15px;0;font-size:18px;">
                  
                    <span class='title'>直属领导:</span>
                    <span>aa,fff</span>
                </div>
                  <div style="margin:15px;0;font-size:18px;">
                  
                    <span class='title'>所属部门:</span>
                    <span>aa,fff</span>
                    <span class='title'>负责人:</span>
                    <span>aa,fff</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.icon{
    margin:10px 0;
    display: flex;
    justify-content: space-between;
    background:#dddddd;
    height:30px;
    line-height:30px;
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
        margin-left:20px
    }
.title{
    display: inline-block;
    width:100px;
    text-align:right;
    margin-right:10px;
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