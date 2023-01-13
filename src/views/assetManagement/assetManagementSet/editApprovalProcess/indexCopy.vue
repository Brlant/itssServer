<template>
  <div class="app-container">
    <div>
      <div class="process-title">
        <div style="font-size: 18px" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          <span>流程组编辑</span>
        </div>
        <div>
          <el-button type="primary" @click="sureSave">保存</el-button>
          <el-button>取消</el-button>
        </div>
      </div>
      <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="流程组名称" prop="groupName">
                <el-input
                  v-model="form.groupName"
                  placeholder="请输入流程组名称"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="适用范围描述" prop="groupDescription">
                <el-input
                  v-model="form.groupDescription"
                  placeholder="请输入适用范围描述"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-form-item label="审批异常处理" prop="nickName">
          <el-row>
            <el-col :span="6" style='margin-right:10px;'>
              <el-select
                v-model="form.flowId"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
               
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
               
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
          <div class="select">
            <span
              v-for="(data, index) in form.flowInfoVoList"
              :key="index"
              :class="[{ current: n == data.flowTypeId }]"
              @click="checkSelect(data, data.flowTypeId)"
            >
              {{ data.flowTypeName }}
              <span v-if="index < form.flowInfoVoList.length - 1">|</span>
            </span>

            <div style="background: #ffffff">
              <div
                v-for="(item, index) in FlowConfigList"
                :key="index"
                style="
                  width: 30%;
                  display: inline-block;
                  background: #e5e5e5;
                  margin-right: 10px;
                  min-height: 820px;
                  height: 820px;
                  margin-top:20px;
                "
                @click="aa(index)"
              >
               <el-button type='primary' @click.self='del(index)' style='z-index:1000'>删除</el-button>
               <div >
                  <DrawFlowChart
                  :flowData="item.list"
                  :flowType="item.type"
                  :groupGetCategory="n"
                  :ref="item.flow"
                  @childClick="childClick"
                  :modelKey="item.modelKey"
                  :deptId="item.deptId"
                ></DrawFlowChart>
                  <el-row>
                  <el-col :span="12">
                    <el-form-item label="适用部门" prop="deptId">
                      <treeselect
                        multiple
                        @input="searchDept(item.deptId)"
                        @change="searchDept(item.deptId)"
                        v-model="item.deptId"
                        :options="deptOptions"
                        :show-count="true"
                        placeholder="请选择适用部门"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
               </div>
              
               
              
              </div>
              
            </div>
            <el-button type='text' @click="add">+添加审批流程</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import DrawFlowChart from "@/components/DrawFlow/src/DrawFlowChart.vue";
import NodeAttribute from "@/components/DrawFlow/src/components/NodeAttribute/NodeAttribute.vue";
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue";
import {
  getDetailProcess,
  editGroup,
} from "@/api/assetManagement/assetManagementSet";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: {
    DrawFlowChart,
    FactoryDrawFlow,
    Treeselect,
    NodeAttribute,
  },
  data() {
    return {
      isShowAttribute: false, // 是否显示属性
      nodeData: null, // 当前点击的node对象
      nodeList: null, // 流程图所有的节点列表
      flowData: [],
      // 保存的参数
      params: {},
      dataCopy: null,
      editData: [
        {
          id: "a78x4anxe",
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
        },
      ],
      isShowEdit: true,
      form: {},
      n:1,
      m: 0,
      checkIndex: "",
      chenckName: "",
      detailId: "",
      editData: {},
      //模型数据
      modelData: [],
      //部门名称
      deptId: null,
      deptOptions: [],
      rules: {
        processName: [
          {
            required: true,
            message: "流程组名称不能为空",
            trigger: "blur",
          },
        ],
      },
      dataList: {},
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
      FlowConfigListCopy: [],
      FlowConfigList: [
        {
          list: [
            {
              id: "a78x4anxe",
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
            },
          ],
        },
      ],
    };
  },
  created() {
    this.detailId = this.$route.query.detailId;
    this.detailData();
    this.getTreeselect();
  },
  methods: {
    setFlowChart() {
      this.isShowEdit = true;
      this.detailData();
    },
    aa(index) {
      this.m = index;
      console.log(index, "ddddddddddddddddddddd");
    },
    //添加流程
    add() {
      this.FlowConfigListCopy.push({
        modelDeployId: "",
        modelKey:'',
        sysDeptList:[]
      })
      this.FlowConfigList.push( {
          list: [
            {
              id: "a78x4anxe",
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
            },
          ],
        },)
    },
    //编辑按钮
    editProcess(data, index) {
      this.m = index;
      this.flowData = data;
      // this.FlowConfigList[index].type='edit'
      this.$set(this.FlowConfigList[index], "type", "edit");
      this.$forceUpdate();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    //切换类型触发事件
    checkSelect(data, index) {
      this.isShowEdit = true;
      this.checkIndex = data.flowTypeId;
      this.checkName = data.flowTypeName;
      this.n = index;
      console.log(this.n,'this.n')
      this.FlowConfigList = [];
      this.FlowConfigList = JSON.parse(JSON.stringify(data.flowDefInfoVoList));
      this.$forceUpdate();
      this.FlowConfigListCopy = this.deepClone(this.FlowConfigList);
      console.log(this.FlowConfigListCopy,',,,,,,,,,,,,')
      this.FlowConfigList.forEach((item, index) => {
        let { des, json, modelType, modelKey, processId } = item.flowProcDefRes;
        let processData = JSON.parse(json);
        item.list = processData.list;
        console.log(item.list, "kkkkkkkkkkkkkkkkkkkk");
        item.type = "edit";
        item.deptId = [];
        item.modelKey = modelKey;
        item.sysDeptList.forEach((i) => {
          item.deptId.push(i.deptId);
        });
        item.flow = index;
        item.list.sysDeptList = item.deptId;
        console.log(item.list, "this.FlowConfigthis.FlowConfigthis.FlowConfig");
      });
    },
    detailData() {
      getDetailProcess(this.detailId).then((res) => {
        this.form = res.data;
        // this.type=res.data.flowInfoVoList
        this.checkIndex = res.data.flowInfoVoList[0].flowTypeId;
        this.checkName = res.data.flowInfoVoList[0].flowTypeName;
        this.FlowConfigList = this.deepClone(res.data.flowInfoVoList[0].flowDefInfoVoList);
        console.log(this.FlowConfigList,'this.FlowConfigList')
        this.FlowConfigListCopy = res.data.flowInfoVoList[0].flowDefInfoVoList
        console.log( this.FlowConfigListCopy, "this.FlowConfigListCopy");
        this.FlowConfigList.forEach((item, index) => {
          let { des, json, modelType, modelKey, processId } =
            item.flowProcDefRes;
          let processData = JSON.parse(json);
          item.list = processData.list;
          item.type = "edit";
          item.modelKey = modelKey;
          item.deptId = [];
          item.sysDeptList.forEach((i) => {
            item.deptId.push(i.deptId);
          });
          item.flow = index;
          console.log(index, "aaaaaaaaaaaaaaaaaaaaaaa");
          item.list.sysDeptList = item.deptId;
          console.log(
            item.list,
            "this.FlowConfigthis.FlowConfigthis.FlowConfig"
          );
        });
        console.log(this.FlowConfigList, "this.FlowConfigList");
      });
    },
    goBack() {
      const obj = {
        path: "/assetManagement/assetManagementSet/approvalProcess",
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    clickNode(node) {
      if (node.oiginator) {
        return false;
      }
      this.nodeData = node;
      this.nodeList = this.$refs.flow.getData();
      this.isShowAttribute = true;
      this.$forceUpdate();
      console.log("当前点击节点", node);
    },
    handleClose() {
      this.isShowAttribute = false;
    },
    // 改变某一个节点,并对节点进行验证
    nodeChange(params) {
      if (params.type == "userTask") {
        const {
          nodeName,
          processMultiInstanceUsers,
          title,
          rejectKey,
          completionCondition,
          userType,
          sequential,
          className,
        } = params;
        this.nodeData.nodeName = nodeName;
        this.nodeData.assignee = nodeName;
        this.nodeData.processMultiInstanceUsers = processMultiInstanceUsers;
        this.nodeData.title = title;
        this.nodeData.rejectKey = rejectKey;
        this.nodeData.completionCondition = completionCondition;
        this.nodeData.userType = userType;
        this.nodeData.sequential = sequential;
        this.nodeData.taskListeners = className;
      } else {
        const { nodeName, conditionExpression, title } = params;
        this.nodeData.nodeName = nodeName;
        this.nodeData.title = title;
        this.nodeData.conditionExpression = conditionExpression;
      }

      let flag = this.$refs.flow.nodeChange(this.nodeData);
      if (flag) {
        this.isShowAttribute = false;
      }
    },
    searchDept(item) {
      
      console.log("this.FlowConfigListCopy", this.FlowConfigListCopy);
      console.log(!this.dataCopy,'this.dataCopy')
      this.$nextTick(() => {
        let sysDeptList = [];
       
       
        if(this.dataCopy){
          console.log(this.m, ",,,,,,");
          this.FlowConfigListCopy[this.m].modelDeployId =
          this.dataCopy.modelDeployId;
        this.FlowConfigListCopy[this.m].modelKey = this.dataCopy.modelKey;
        console.log(this.FlowConfigListCopy, " this.FlowConfigList[this.m]");
        }else{
        
        }
      
        this.FlowConfigList[this.m].deptId = item;
        this.FlowConfigList[this.m].deptId.forEach((i) => {
          sysDeptList.push({ deptId: i });
        });

        this.FlowConfigListCopy[this.m].sysDeptList = sysDeptList;

        // this.params = {
        //   groupName: this.form.groupName,
        //   groupDescription: this.form.groupDescription,
        //   groupSetting: null,
        //   id: this.$route.query.detailId,
        //   flowInfoVoList: [
        //     {
        //       flowTypeId: this.checkIndex,
        //       flowTypeName: this.checkName,
        //       flowDefInfoVoList: this.FlowConfigListCopy,
        //     },
        //   ],
        // };
      });
    },
    //子组件触发
    childClick(data) {
      this.dataCopy = data;
      this.$nextTick(() => {
        let sysDeptList = [];
        // console.log(this.FlowConfigListCopy, "this.FlowConfigListCopy");
        console.log(this.m, ",,,,,,");

        this.FlowConfigListCopy[this.m].modelDeployId = data.modelDeployId;
        this.FlowConfigListCopy[this.m].modelKey = data.modelKey;
        console.log(this.FlowConfigListCopy, " this.FlowConfigList[this.m]");
        if(this.FlowConfigListCopy[this.m].modelDeployId && this.FlowConfigList[this.m].deptId){
           this.FlowConfigList[this.m].deptId.forEach((i) => {
          sysDeptList.push({ deptId: i });
        });
        }
       
        // this.FlowConfigList[this.m].
        this.FlowConfigListCopy[this.m].sysDeptList = sysDeptList;
        // this.params = {
        //   groupName: this.form.groupName,
        //   groupDescription: this.form.groupDescription,
        //   groupSetting: null,
        //   id: this.$route.query.detailId,
        //   flowInfoVoList: [
        //     {
        //       flowTypeId: this.checkIndex,
        //       flowTypeName: this.checkName,
        //       flowDefInfoVoList: this.FlowConfigListCopy,
        //     },
        //   ],
        // };
      });
    },
    del(i){
      this.FlowConfigList.splice(i,1)
      this.FlowConfigListCopy.splice(i,1)
      console.log(this.FlowConfigList,' this.FlowConfigList.splice(i,1)')
    },
    //保存
    sureSave() {
      console.log(this.params, " this.params");
  this.params = {
          groupName: this.form.groupName,
          groupDescription: this.form.groupDescription,
          groupSetting: null,
          id: this.$route.query.detailId,
          flowInfoVoList: [
            {
              flowTypeId: this.checkIndex,
              flowTypeName: this.checkName,
              flowDefInfoVoList: this.FlowConfigListCopy,
            },
          ],
        };
      editGroup(this.params).then((res) => {
        if (res.code == 200) {
          this.$message.success('操作成功')
        //   this.detailData();
     const obj = {
        path: "/assetManagement/assetManagementSet/approvalProcess",
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
        }
      });
      //   console.log(this.form,'this.form')
      //   this.dataList.sysDeptList=this.FlowConfigList[this.m].deptId
      //   console.log()
      //    const index = this.modelData.findIndex(v => {
      //  return v.modelKey === this.dataList.modelKey
      // })
      // if (index === -1) {
      //  this.modelData.push(this.dataList)
      // } else {
      //  this.modelData.splice(index, 1, this.dataList)
      // }
      //   console.log('cccc',this.modelData)
    },
  },
};
</script>

<style lang="scss" scoped>
.process-title {
  display: flex;
  justify-content: space-between;
  padding: 20px;
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
.design-engine {
  width: 80%;
  display: inline-block;
}
</style>

