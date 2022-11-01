<template>
  <div class="app-container">
     <div class="routerBar">
      <router-link :to="'/chanceManager/chanceList'"> < 机会详情</router-link>
      <div class="rightBox">
        <router-link class="priority3 ft13":to="'/chanceManager/chanceEdit'">编辑基本信息</router-link>
        <router-link class="priority3 ft13" :to="'/chanceManager/addChance'">| 机会详情</router-link>
        <!-- <router-link class="priority3 ft13" :to="'/chanceManager/addChance'">| 机会详情</router-link> -->
        <span class="priority3 ft13" @click="transformProject">| 转为正式项目</span>
      </div>
    </div>
    <div class="titleBar">机会基础信息</div>
      <div class="whiteBox">
    <el-form ref="elForm" :model="formData"   size="medium" label-width="110px">
      <el-row  >
        <el-col :span="7" :offset="1">
          <el-form-item label="机会名称：" prop="chanceName">
            {{formData.chanceName}}
          </el-form-item>
        </el-col>
       
        <el-col :span="7" :offset="1">
          <el-form-item label="机会状态" prop="chanceStatus">
           {{ formData.chanceStatusName }}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="负责人" prop="chanceUserId">
            {{formData.chanceUserIdName }}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="优先级：" prop="priority">
            {{formData.priorityName}}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="客户：" prop="customer">
            {{formData.customer }}
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="客户联系人" prop="customerLink">
            {{formData.customerLink}}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="联系方式：" prop="tel">
            {{formData.tel}}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="客户预算：" prop="budget">
            {{formData.budget}}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="成功率：" prop="successRate">
           {{formData.successRate}}
            <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;%</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="预计起始日：" prop="expectStartTime">
            {{formData.expectStartTime}}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="预计结束日：" prop="expectEndTime">
            {{formData.expectEndTime}}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="预计工时：" prop="expectWork">
            {{formData.expectWork}}
            </el-input-number>
            <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;人日</span>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="预计报价：" prop="expectOffer">
             {{formData.expectOffer}}
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="服务对象：" prop="chanceService">
            {{formData.chanceServiceName}}
          </el-form-item>
        </el-col>
        <el-col :span="21" :offset="1">
          <el-form-item label="备注：" prop="remark">
            {{formData.remark}}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="titleBar">
        资源配置
        <div class="rightBox">
          <!-- <el-button size="mini" @click="addConfigListHandel" type="primary">添加配置</el-button> -->
        </div>
      </div>
      

    </el-form>
    </div>
  </div>
</template>
<script>
 import {
  queryDict,// 字典查询 传入字典名称 
  addChance,
  chanceDetail,toProject
} from "@/api/chanceManager/chanceManager";
import {
  getTimeProcess,
} from "@/api/proManager/proManager";

export default {
  data() {
    return {
          formData: {
          chanceName: "", //          机会名称
          chanceStatus: "", //          机会状态：1.新建、2.跟进中、3.已结束、4.已转项目
          priority: 3, //          优先级（1.最高;2.高，3.普通，4.较低）
          projectId:null, //      已转项目
          projectName:null, //      已转项目
          chanceUserId: "",//       机会负责人id
          chanceUserName:"", //          机会负责人
          customer: "", //          客户
          customerLink: "", //          客户联系人
          tel: "", //          联系方式
          budget: undefined, //          客户预算
          successRate: undefined, //          成功率
          expectStartTime: "", //          预计开始时间
          expectEndTime: "", //          预计结束时间
          expectWork: undefined, //          预计工时（人日）
          expectOffer: undefined, //          预计报价
          chanceService: "", //          服务对象(1.对内;2.对外)
          remark: "", //          备注
          chanceConfigList:[]
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
    this.init(this.$route.query.chanceId)
  },
  methods: {
   init(chanceId){
    chanceDetail(chanceId).then((res)=>{
      console.log(res.data);
      this.formData = res.data
    })
   },
   // 转换为正式项目
   transformProject(){
    // 跳转到项目详情页 再转换
       // 跳转到 新增项目 此处 需要在新增页面 增加判断 拿数据
      const obj = { path: "/ProjectManager/AddProject",query:{chanceId:this.formData.chanceId} };
      this.$tab.closeOpenPage(obj);
    // toProject(this.formData.chanceId).then((res)=>{
    //      let { code, msg } = res;
    //         this.$message.success(msg);
    //         if (+code == 200) {
    //           this.$router.push("/chanceManager/chanceList");
    //         }
    // })
   }
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
.ft13{
  font-size: 13px;
}
</style>
 
