<template>
    <div class='app-container'>
         <div class='icon'>
            <div>
                <i class='el-icon-arrow-left'></i>
                <span>成员信息新增/编辑</span>
            </div>
            <div>
               <el-button  type="primary">保存</el-button>
                <el-button>取消</el-button>
            </div>
        </div>
        <div class='input-info'>           
            <div class='img-user'>
                <img src="@/assets/images/profile.jpg" alt="">
            </div>    
            <div>
                <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px">
                    <el-row>
                        <el-col  :span="12">
                             <el-form-item label="姓名" prop="name">
                                <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                        </el-col>                      
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item label="性别">
                                <el-radio-group v-model="formData.sex">
                                <el-radio label="男"></el-radio>
                                <el-radio label="女"></el-radio>
                                </el-radio-group>
                        </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>

export default {
  data() {
    return {
      formData:{}
    }
  },
  mounted() {
   
  },
  methods: {
 


  }
};
</script>
<style lang="scss" scoped>
.icon{
    margin:10px 0;
    display: flex;
    justify-content: space-between;
    height:30px;
    line-height:30px;
    font-size:18px;
    color:#3D7DFF;
}
.img-user{
    display: inline-block;
    img{
    width:80px;
    height:80px;
    border-radius: 40px;
    }    
}
.input-info{
    display: flex;
}
</style>