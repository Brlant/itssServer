<template>
  <div>
    <div class="process-title">
      <div style="font-size: 18px" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <span>流程组详情</span>
      </div>
      <div>
        <el-button type="primary">复制并新建</el-button>
        <el-button type="primary">编辑</el-button>
        <el-button>启用</el-button>
        <el-button>停用</el-button>
      </div>
    </div>
    <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div style="background: #ffffff;margin-bottom:10px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="流程组名称：">
                {{ form.groupName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="适用范围描述：">
                {{ form.groupDescription }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="当前在用：">
                <span v-for='(item,index) in form.assetTypeList' :key='index'>{{item.typeName+'；'}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        

        <!-- <el-form-item label="审批异常处理" prop="nickName">
          <el-row>
            <el-col :span="6" style="margin-right: 10px">
              {{ form.aa1 }}
            </el-col>

            <el-col :span="4">
              {{ form.dd2 }}
            </el-col>
          </el-row>
          <div>指定节点内成员离职，为空等情况的处理方式</div>
        </el-form-item>

        <el-form-item label="自动审批" prop="email">
          <el-row>
            <el-col :span="12">
              {{ form.email }}
            </el-col>
          </el-row>
          <div>当多个审批节点的角色为同一人时</div>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="加签限制" prop="phonenumber">
              {{ form.phonenumber }}
            </el-form-item>
          </el-col>
        </el-row> -->
          <div class="select">
          <span  v-for="(data,index) in form.flowInfoVoList" 
          :key='index' 
          :class="[{ current: n == index }]" 
          @click="checkSelect(data,index)">
            {{data.flowTypeName}}
            <span v-if='index<form.flowInfoVoList.length-1'>|</span>
          </span>
          
        </div>
        <div style='background:#ffffff;'>
          <div v-for='(item,index) in FlowConfigList' :key="index" style='width:30%;display:inline-block'>
            <FactoryDrawFlow
              ref="flow"
              :FlowConfig="item.list"
              :modelType="item.type"
              :scaleVal="scaleVal"
            ></FactoryDrawFlow>
            <el-row >
              <el-col :span="12" >
                <el-form-item label="适用部门" prop="dept">
                  <span v-for='(i,index) in item.sysDeptList' :key="index"> {{i.deptName+'；'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
    
       
      </el-form>
    </div>
  </div>
</template>

<script>
import DrawFlowChart from "@/components/DrawFlow/src/DrawFlowChart.vue";
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue";
import { getDetailProcess } from "@/api/assetManagement/assetManagementSet";
export default {
  components: {
    DrawFlowChart,
    FactoryDrawFlow
  },
  data() {
    return {
       scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
      form: {},
      detailId:'',
      // flowType: "see",
      typeList:[],
      type:'see',
      flowId: "",
      n: 0,
      FlowConfigList:[
         {
          list:[
            {
              id: 'a78x4anxe',
              groupId: null,
              pids: [null],
              groupPid: null,
              groupId: null,
              type: "1",
              title: "发起人",
              nodeName: "发起人",
              nodeType: "userTask",
              assignee: "${INITIATOR}",
              oiginator: true,
              isRow: true,
              isRoot: true,
            }
         ]
        }
      ],
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
  created() {
    this.detailId = this.$route.query.detailId;
    this.detailData()
    console.log(this.form, "this.form");
  },
  methods: {
    checkSelect(data,index) {
      this.n=index
      this.FlowConfigList=data.flowDefInfoVoList
       this.FlowConfigList.forEach(item=>{
           let { des, json, modelType, modelKey, processId } = item.flowProcDefRes;
              let processData = JSON.parse(json);
              item.list=processData.list
              item.type='see'
               console.log( item.list,'this.FlowConfigthis.FlowConfigthis.FlowConfig')
        })
    },
    detailData(){
      getDetailProcess(this.detailId).then(res=>{
        this.form=res.data
        // this.type=res.data.flowInfoVoList
        this.FlowConfigList=res.data.flowInfoVoList[0].flowDefInfoVoList
        this.FlowConfigList.forEach(item=>{
           let { des, json, modelType, modelKey, processId } = item.flowProcDefRes;
              let processData = JSON.parse(json);
              item.list=processData.list
              item.type='see'
               console.log( item.list,'this.FlowConfigthis.FlowConfigthis.FlowConfig')
        })
         console.log(this.FlowConfigList,'this.FlowConfigList')
       
      })
    },
    //返回
    goBack() {
      const obj = {
        path: "/assetManagement/assetManagementSet/approvalProcess",
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
  },
};
</script>

<style lang="scss" scoped>
.process-title {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #ffffff;
  margin-bottom: 10px;
}
.select {
  margin-left: 30px;
  margin-bottom: 20px;
  span {
    padding: 0 10px;
    cursor: pointer;
  }
  .current {
    color: #5f94ff;
  }
}
</style>