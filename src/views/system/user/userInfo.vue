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
            <div></div>
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
</style>