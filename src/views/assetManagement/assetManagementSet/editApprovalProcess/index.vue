<template>
  <div class="app-container">
    <div class="process-title">
      <div style="font-size: 18px">
        <i class="el-icon-arrow-left"></i>
        <span>流程组编辑</span>
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
                <!-- <el-option
                  v-for="item in detailTemplates"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option> -->
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
                <!-- <el-option
                  v-for="item in detailTemplates"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option> -->
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
                <!-- <el-option
                  v-for="item in detailTemplates"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option> -->
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
        <div class='select'>
            <span :class="[{ current: n == 0 }]" @click='aa(0)'>入库</span>|
            <span :class="[{ current: n == 1 }]" @click='aa(1)'>申领</span>|
            <span :class="[{ current: n == 2 }]" @click='aa(2)'>归还</span>|
            <span :class="[{ current: n == 3 }]" @click='aa(3)'>借用</span>|
            <span :class="[{ current: n == 4 }]" @click='aa(4)'>维修</span>|
            <span :class="[{ current: n == 5 }]" @click='aa(5)'>报废</span>|
            <span :class="[{ current: n == 6 }]" @click='aa(6)'>盘亏</span>
        </div>
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
export default {
  data() {
    return {
      form: {},
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
  methods:{
    aa(index){
        this.n=index

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