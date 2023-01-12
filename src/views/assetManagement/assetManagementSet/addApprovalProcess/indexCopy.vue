<template>
  <div class="app-container">
    <div class="process-title">
      <div style="font-size: 18px" @click='goBack'>
        <i class="el-icon-arrow-left"></i>
        <span>流程组新建</span>
      </div>
      <div>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
    <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="流程组名称" prop="processName">
              <el-input
                v-model="form.processName"
                placeholder="请输入流程组名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="适用范围描述" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入适用范围描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if='hidden'>
           <el-form-item label="审批异常处理" prop="nickName">
          <el-row>
            <el-col :span="6" style='margin-right:10px;'>
              <el-select
                v-model="form.flowId"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
                <el-option
                  v-for="(item,index) in detailTemplates"
                  :key="index"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option>
              </el-select>
            </el-col>

            <el-col :span="4">
              <el-select
                v-model="form.flowId"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
                <el-option
                  v-for="(item,index) in detailTemplates"
                  :key="index"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <div>指定节点内成员离职，为空等情况的处理方式</div>
        </el-form-item>

        <el-form-item label="自动审批" prop="email">
          <el-row>
            <el-col :span="12">
              <el-select
                v-model="form.flowId"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
                <el-option
                  v-for="(item,index) in detailTemplates"
                  :key="index"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <div>当多个审批节点的角色为同一人时</div>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="加签限制" prop="phonenumber">
              <el-select
                v-model="form.flowId"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
                <el-option
                  v-for="(item,index) in detailTemplates"
                  :key="index"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        </div>
       
        <div class='select'>
            <span 
              v-for='(item,index) in modelType'
              :key='index'
              :class="[{ current: n == index }]" 
              @click='aa(index)'>
                {{item.name}}
                <span v-if='index<modelType.length-1'>|</span>
            </span>
        </div>
        <el-row>
          <el-col>
            <!-- <DrawFlowList :isShowCheck="isShowCheck" :params ="params"/> -->
            <!-- <DrawFlowList/> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='12'>
             <el-form-item label="适用部门" prop="dept">
              <el-select
                v-model="form.dept"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
                <!-- <el-option
                  v-for="item in detailTemplates"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getProcessType } from "@/api/assetManagement/assetManagementSet";
export default {
  data() {
    return {
        hidden:false,
        isShowCheck: true, // 是否现实审核，这个必须要写 true
        params: {
          taskId:'06fc35b6-16bf-11ed-86db-00ff19aa678e',
          processInstanceId:'06e0701c-16bf-11ed-86db-00ff19aa678e',
          deployId:'8007d903-148f-11ed-9e4d-f645cd1a1bbc'
        },


      form: {},
      modelType:[],
      n:0,
      rules: {
        processName: [
          {
            required: true,
            message: "流程组名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created(){
    this.getType()
  },
  methods:{
    aa(index){
        this.n=index

    },
    //获取类型
    getType(){
      getProcessType().then(res=>{
        this.modelType=res.data
      })
    },
     goBack(){
      const obj = {
        path: "/assetManagement/assetManagementSet/approvalProcess",
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    }
  }
};
</script>

<style lang="scss" scoped>
.process-title {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
.select{
    margin-left:30px;
    margin-bottom:20px;
    span{
        padding:0 10px;
         cursor: pointer;
    }
    .current{
    color:#5F94FF;
   
}
}

</style>