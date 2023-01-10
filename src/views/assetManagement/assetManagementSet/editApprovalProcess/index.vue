<template>
  <div class="app-container">
    <div>
      <div class="process-title">
        <div style="font-size: 18px" @click="goBack">
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
              :class="[{ current: n == index }]"
              @click="checkSelect(data, index)"
            >
              {{ data.flowTypeName }}
              <span v-if="index < form.flowInfoVoList.length - 1">|</span>
            </span>
         
          <div style="background: #ffffff">
            <div
              v-for="(item, index) in FlowConfigList"
              :key="index"
              style="width: 30%; display: inline-block"
            >
              <FactoryDrawFlow
                v-if="isShowEdit"
                ref="flow"
                :FlowConfig="item.list"
                :modelType="item.type"
                :scaleVal="scaleVal"
              ></FactoryDrawFlow>
              <span style="width: 20%; position: absolute; top: 480px">
                <el-button
                  type="primary"
                  @click="editProcess(item.list)"
                  v-if="isShowEdit"
                  >编辑</el-button
                >
              </span>
              <el-row  v-if="isShowEdit">
                <el-col :span="12">
                  <el-form-item label="适用部门" prop="deptId">
                    <treeselect
                      multiple
                      v-model="item.deptId"
                      :options="deptOptions"
                      :show-count="true"
                      placeholder="请选择适用部门"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
             <!-- <div v-if="!isShowEdit">
              
                <FactoryDrawFlow
                  @clickNode="clickNode"
                  ref="flow"
                  :FlowConfig="editData"
                  :modelType="type"
                  :scaleVal="scaleVal"
                ></FactoryDrawFlow>
               
                <el-drawer
                  title="设置节点属性"
                  :before-close="handleClose"
                  :visible.sync="isShowAttribute"
                  direction="rtl"
                  custom-class="demo-drawer"
                  ref="drawer"
                >
                  <NodeAttribute
                    @cancel="handleClose"
                    :nodeData="nodeData"
                    :nodeList="nodeList"
                    @nodeChange="nodeChange($event)"
                  />
                </el-drawer>
              </div> -->
            <div v-if="!isShowEdit">
               <DrawFlowChart :flowData="flowData" :flowType="type"></DrawFlowChart>
                <el-row >
                <el-col :span="12">
                  <el-form-item label="适用部门" prop="deptId">
                    <treeselect
                      multiple
                      v-model="deptId"
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
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import DrawFlowChart from "@/components/DrawFlow/src/DrawFlowChart.vue";
import NodeAttribute from "@/components/DrawFlow/src/components/NodeAttribute/NodeAttribute.vue";
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue";
import { getDetailProcess } from "@/api/assetManagement/assetManagementSet";
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
      flowData:[],
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
      n: 0,
      detailId: "",
      editData: {},
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
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
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
    //编辑按钮
    editProcess(data) {
    
      this.isShowEdit = false;
      this.flowData = data;
      this.type = "edit";
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    //切换类型触发事件
    checkSelect(data, index) {
      this.isShowEdit = true
      this.n = index;
      this.FlowConfigList = data.flowDefInfoVoList;
      this.FlowConfigList.forEach((item) => {
        let { des, json, modelType, modelKey, processId } = item.flowProcDefRes;
        let processData = JSON.parse(json);
        item.list = processData.list;
        item.type = "see";
        item.deptId = [];
        item.sysDeptList.forEach((i) => {
          item.deptId.push(i.deptId);
        });
        console.log(item.list, "this.FlowConfigthis.FlowConfigthis.FlowConfig");
      });
    },
    detailData() {
      getDetailProcess(this.detailId).then((res) => {
        this.form = res.data;
        // this.type=res.data.flowInfoVoList
        this.FlowConfigList = res.data.flowInfoVoList[0].flowDefInfoVoList;
        this.FlowConfigList.forEach((item) => {
          let { des, json, modelType, modelKey, processId } =
            item.flowProcDefRes;
          let processData = JSON.parse(json);
          item.list = processData.list;
          item.type = "see";
          item.deptId = [];
          item.sysDeptList.forEach((i) => {
            item.deptId.push(i.deptId);
          });
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