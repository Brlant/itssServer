<template>
  <div class="app-container">
    <div class="routerBar">
      <router-link :to="'/projectManager/proManager'"> < 新建机会</router-link>
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
        <el-button size="mini" @click="resetForm" type="default">取消</el-button>
      </div>
    </div>
    <div class="titleBar">机会基础信息</div>
      <div class="whiteBox">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px">
      <el-row  >
        <el-col :span="10" :offset="1">
          <el-form-item label="机会名称：" prop="chanceName">
            <el-input v-model="formData.chanceName" placeholder="请输入机会名称" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="机会状态" prop="chanceStatus">
            <el-select v-model="formData.chanceStatus" placeholder="请选择机会状态" clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in chanceStatusOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="负责人" prop="chanceUserId">
            <el-select v-model="formData.chanceUserId" placeholder="请输入负责人" clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in chanceUserIdOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="优先级：" prop="priority">
            <!-- <el-select v-model="formData.priority" placeholder="请选择优先级" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in priorityOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select> -->
            <el-radio-group v-model="formData.priority" size="medium">
                <el-radio
                  v-for="(item, index) in priorityOptions"
                  :key="index"
                  :label="item.value"
                  :disabled="item.disabled"
                >
                  <b :class="['priority' + item.value]">
                    {{ item.label }}
                  </b>
                </el-radio>
              </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="客户：" prop="customer">
            <el-input v-model="formData.customer" placeholder="请输入客户" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="客户联系人" prop="customerLink">
            <el-input v-model="formData.customerLink" placeholder="请输入客户联系人" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="联系方式：" prop="tel">
            <el-input v-model="formData.tel" placeholder="请输入联系方式" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="客户预算：" prop="budget">
            <el-input-number v-model="formData.budget" placeholder="请输入金额" :precision='2'></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="成功率：" prop="successRate">
            <el-input-number v-model="formData.successRate" placeholder="请输入" :precision='0'>
            </el-input-number>
            <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;%</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="预计起始日：" prop="expectStartTime">
            <el-date-picker v-model="formData.expectStartTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择预计起始日" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="预计结束日：" prop="expectEndTime">
            <el-date-picker v-model="formData.expectEndTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :style="{width: '100%'}" placeholder="请选择预计结束日" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="预计工时：" prop="expectWork">
            <el-input-number v-model="formData.expectWork" placeholder="请输入预计工时" :precision='1'>
            </el-input-number>
            <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;人日</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="预计报价：" prop="expectOffer">
             <el-input-number v-model="formData.expectOffer" placeholder="请输入预计报价" :precision='2'></el-input-number>
            <!-- <el-input v-model="formData.expectOffer" placeholder="请输入预计报价" clearable :style="{width: '100%'}"> -->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="服务对象：" prop="chanceService">
            <el-select v-model="formData.chanceService" placeholder="请选择对内/对外" clearable
              :style="{width: '100%'}">
              <el-option v-for="(item, index) in chanceServiceOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注"
              :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="titleBar">
        资源配置
        <div class="rightBox">
          <el-button size="mini" @click="addUserListHandel" type="primary">添加配置</el-button>
        </div>
      </div>
      <div class="whiteBox UserListBox">
          <el-row  >
        <el-col :span="6">
          <el-form-item label="职能：" prop="postId">
            <el-select v-model="formData.postId" placeholder="请选择职能" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in postIdOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="区域：" prop="areaId">
            <el-select v-model="formData.areaId" placeholder="请选择区域" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in areaIdOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="等级：" prop="gradeId">
            <el-select v-model="formData.gradeId" placeholder="请选择等级" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in gradeIdOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="field106">
            <el-button type="primary" size="mini"> 删除 </el-button>
          
            <el-button type="info" size="mini"> 取消 </el-button>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="技能需求："  prop="skillIdList">
            <el-select v-model="formData.skillIdList" placeholder="请选择技能需求" clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in skillIdListOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
        </el-col> -->
        </el-row>

        <el-row>

        <el-col :span="6">
          <el-form-item label="配置安排：" prop="startEndTime" >
            <el-date-picker type="daterange" v-model="formData.startEndTime" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" :style="{width: '100%'}" start-placeholder="开始日期"
              end-placeholder="结束日期" range-separator="至" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          123
        </el-col>
        <el-col :span="6">
          123
        </el-col>
        <el-col :span="6">
          123
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="6">
         123
        </el-col>
        <el-col :span="6">
         123
        </el-col>
        <el-col :span="6">
         123
        </el-col>
        <el-col :span="6">
        123
        </el-col>
      </el-row>
      </div>
    </el-form>
  </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
          // chanceName: "", //          机会名称
          // chanceStatus: "", //          机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
          // priority: 3, //          优先级（1.最高;2.高，3.普通，4.较低）
          // projectId:null, //      已转项目
          // projectName:null, //      已转项目
          // chanceUserId: "",//       机会负责人id
          // chanceUserName:"", //          机会负责人
          // customer: "", //          客户
          // customerLink: "", //          客户联系人
          // tel: "", //          联系方式
          // budget: undefined, //          客户预算
          // successRate: undefined, //          成功率
          // expectStartTime: "", //          预计开始时间
          // expectEndTime: "", //          预计结束时间
          // expectWork: undefined, //          预计工时（人日）
          // expectOffer: undefined, //          预计报价
          // chanceService: "", //          服务对象(1.对内;2.对外)
          // remark: "", //          备注
          /*------------测试用-----------------*/
          chanceName: "机会测试1", 
          chanceStatus: 1, 
          priority: 3, 
          // projectId:null, 
          // projectName:null, 
          chanceUserId: 2,
          // chanceUserName:"测试", 
          customer: "国药控股合肥奇兵有限公司", 
          customerLink: "周佩煌", 
          tel: "13817242305", 
          budget: 250000, 
          successRate: 85, 
          expectStartTime: "2022-10-01", 
          expectEndTime: "2022-12-30", 
          expectWork: 66, 
          expectOffer: 660000, 
          chanceService: 1, 
          remark: "都很棒", 
          chanceConfigList:[]
      },
      // 配置的基本信息
        chanceConfigList: 
        {
          postId: "", //职位id
          areaId: "", //区域id
          gradeId: "", //等级id
          skillIdList: "", //技能id
          startTime: "", //开始时间
          endTime: "", //结束时间
          workTime: "", //总工时
          workDay: "", //总人日（工作日*工时/8）
          planLoad: "", //计划负荷
          expectedCost: "", //预计成本
          chanceConfigScheduleList: [], //
          week: "", //周数
          startTime: "", //开始时间
        },      
      rules: {
        chanceName: [{
          required: true,
          message: '请输入机会名称',
          trigger: 'blur'
        }],
        chanceStatus: [{
          required: true,
          message: '请选择机会状态',
          trigger: 'change'
        }],
        chanceUserId: [{
          required: true,
          message: '请输入负责人',
          trigger: 'change'
        }],
        priority: [{
          required: true,
          message: '请选择优先级',
          trigger: 'change'
        }],
        customer: [],
        customerLink: [],
        tel: [{
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '请输入正确的手机号！',
          trigger: 'blur'
        }],
        budget: [],
        successRate: [],
        expectStartTime: [],
        expectEndTime: [],
        expectOffer: [],
        expectOffer: [],
        chanceService: [{
          required: true,
          message: '请选择对内/对外',
          trigger: 'change'
        }],
        remark: [],
      },
       
      chanceStatusOptions: [{
        "label": "新建",
        "value": 1
      }, {
        "label": "跟进中",
        "value": 2
      }, {
        "label": "已结束",
        "value": 3
      }, {
        "label": "已转项目",
        "value": 4
      }],
      chanceUserIdOptions: [{
        "label": "周佩煌",
        "value": 1
      }, {
        "label": "张帆",
        "value": 2
      }],
      priorityOptions: [{
        "label": "最高",
        "value": 1
      }, {
        "label": "高",
        "value": 2
      }, {
        "label": "普通",
        "value": 3
      }, {
        "label": "较低",
        "value": 4
      }],
      chanceServiceOptions: [{
        "label": "对内",
        "value": 1
      }, {
        "label": "对外",
        "value": 2
      }],
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
        submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
        console.log(this.formData);
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    // 点击 新增用户的
    addUserListHandel() {
      //  if(this.formData.projectService==""){
      //         this.$message.error("请您先完整填写项目基础信息！");
      //   }
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 上面基础信息填写好 再填写下面，因为需要用到上面的 服务对象和项目有效期
        if (valid) {
          let oneUser = this.deepClone(this.chanceConfigList);
          oneUser.startTime = this.formData.expectStartTime;
          oneUser.endTime = this.formData.expectEndTime;
          this.formData.chanceConfigList.push(oneUser);
          this.$forceUpdate();
        }
      });
    },
  },

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
.app-container {
  padding: 0;
}
.routerBar {
  a {
    color: #557db3;
  }
  span {
    font-size: 12px;
    color: #999;
  }
}
.priority4 {
  color: #909399;
}
.priority3 {
  color: #409eff;
}
.priority2 {
  color: #e6a23c;
}
.priority1 {
  color: #f56c6c;
}
</style>
