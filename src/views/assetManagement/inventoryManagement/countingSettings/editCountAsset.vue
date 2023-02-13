<!--盘点审批流程-->
<template>
    <div>
        <div class="left">
          <div class="title">
            <span class="bar">
            </span>
            <b>审批流程</b>
          </div>
          <div>
            <el-button type="primary" @click="sureSave">保存</el-button>
            <el-button @click='cancel'>取消</el-button>
          </div>

        </div>
      <div style="background: #ffffff;display:flex">
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
                  margin-top: 20px;
                "

        >
          <el-button
            type="primary"
            @click="del(index)"
            style="z-index: 2000"
          >删除</el-button
          >
          <div @click="clickFlow(index)">
            <DrawFlowChart

              :flowData="item.list"
              :flowType="item.type"
              :groupGetCategory="n"
              :ref="item.flow"
              :index='index'
              @childClick="childClick"
              @getEditNodeSon='getEditNodeSon'
              :modelKey="item.modelKey"
              :deptId="item.deptId"
            ></DrawFlowChart>
          </div>
        </div>
      </div>
      <el-button type="text" @click="add">+添加审批流程</el-button>
    </div>
</template>

<script>
import { getInventoryFlow, updateInventory } from '@/api/assetManagement/inventoryManagement'
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue";

import DrawFlowChart from "@/components/DrawFlow/src/DrawFlowChart.vue";
export default {
  components: {
    DrawFlowChart,FactoryDrawFlow
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
      isShowEdit: true,
      form: {},
      n: 1,
      m: 0,
      checkIndex: "",
      chenckName: "",
      detailId: "",
      //模型数据
      modelData: [],
      flowInfoVoListCopy: [],
      deptIds: [],
      //部门名称
      deptId: null,
      deptOptions: [],
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
      FlowConfigListCopy: [],
      FlowConfigList: [
        {
          list: [
            {
              id: "a78x4anxe",
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
    this.detailData()
  },
  methods: {
    setFlowChart() {
      this.isShowEdit = true;
      this.detailData();
    },

    //点击某个流程图调用方法，获取点击流程图的下标
    clickFlow(index) {
      this.m = index;
    },

    //添加流程
    add() {
      this.FlowConfigListCopy.push({
        modelDeployId: "",
        modelKey: "",
        sysDeptList: [],
        modelDefinition: {},
      });
      this.FlowConfigList.push({
        list: [
          {
            id: "a78x4anxe",
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
      });
    },

    //页面初始化时数据获取
    detailData() {
      getInventoryFlow().then(res=>{
        this.detailId = res.data.id;
        this.flowInfoVoListCopy = this.deepClone(res.data.flowInfoVoList);
        this.checkIndex = res.data.flowInfoVoList[0].flowTypeId;
        this.checkName = res.data.flowInfoVoList[0].flowTypeName;
        this.FlowConfigList = this.deepClone(
          res.data.flowInfoVoList[0].flowDefInfoVoList
        );
        // console.log(this.FlowConfigList,'this.FlowConfigList')
        this.FlowConfigListCopy = res.data.flowInfoVoList[0].flowDefInfoVoList;
        // console.log( this.FlowConfigListCopy, "this.FlowConfigListCopy");
        this.FlowConfigList.forEach((item, index) => {
          let { des, json, modelType, modelKey, processId } =
            item.flowProcDefRes;
          let processData = JSON.parse(json);
          item.list = processData.list;
          item.type = "edit";
          item.modelKey = modelKey;
          /*item.deptId = [];
          item.sysDeptList.forEach((i) => {
            item.deptId.push(i.deptId);
          });*/
          item.flow = index;
          item.list.sysDeptList = item.deptId;
          // console.log(
          //   item.list,
          //   "this.FlowConfigthis.FlowConfigthis.FlowConfig"
          // );
        });
        this.flowInfoVoListCopy[this.n - 1].flowDefInfoVoList = this.FlowConfigListCopy;
        this.params = {
          flowInfoVoList: this.flowInfoVoListCopy,
        };
      });
    },

    clickNode(node) {
      if (node.oiginator) {
        return false;
      }
      this.nodeData = node;
      this.nodeList = this.$refs.flow.getData();
      this.isShowAttribute = true;
      this.$forceUpdate();
      // console.log("当前点击节点", node);
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

    //点击删除节点触发事件
    getEditNodeSon(data){
      this.m=data.index
      // return
      this.FlowConfigListCopy[this.m].modelDeployId = "";
      this.FlowConfigListCopy[this.m].modelDefinition = data.modelDefinition;

      this.flowInfoVoListCopy[this.n - 1].flowDefInfoVoList =
        this.FlowConfigListCopy;

    },

    //子组件触发（右侧弹窗）
    childClick(data) {
      // this.deptIds=[]
      this.dataCopy = data;
      this.$nextTick(() => {
        let sysDeptList = [];

        // 当流程定义没有修改时 modelDeployId 保持原样
        if (
          this.FlowConfigListCopy &&
          this.FlowConfigListCopy[this.m] &&
          this.FlowConfigListCopy[this.m].modelDefinition
        ) {
          if (
            JSON.stringify(this.FlowConfigListCopy[this.m].modelDefinition) !=
            JSON.stringify(data.modelDefinition)
          ) {
            this.FlowConfigListCopy[this.m].modelDeployId = "";
          }
        } else {
          this.FlowConfigListCopy[this.m].modelDeployId = "";
        }
        if (this.deptIds) {
          this.deptIds.forEach((i) => {
            sysDeptList.push({ deptId: i });
          });
        }
        this.FlowConfigListCopy[this.m].sysDeptList = sysDeptList;
        this.FlowConfigListCopy[this.m].modelDefinition = data.modelDefinition;
        this.flowInfoVoListCopy[this.n - 1].flowTypeId = this.checkIndex;
        this.flowInfoVoListCopy[this.n - 1].flowTypeName = this.checkName;
        this.flowInfoVoListCopy[this.n - 1].flowDefInfoVoList =
          this.FlowConfigListCopy;
      });
      this.params = {

        // groupName: this.form.groupName,
        // groupDescription: this.form.groupDescription,

        flowInfoVoList: this.flowInfoVoListCopy,
      };
    },

    //删除按钮事件
    del(i) {
      // console.log(i)
      this.FlowConfigList.splice(i, 1);

      this.FlowConfigListCopy.splice(i, 1);

      this.flowInfoVoListCopy[this.n - 1].flowDefInfoVoList =
        this.FlowConfigListCopy;
    },

    //保存
    sureSave() {
      // this.params.groupName= this.form.groupName
      // this.params.groupDescription=this.form.groupDescription
      this.params.groupSetting= null
      this.params.id = this.detailId
        // return
        updateInventory(this.params).then((res) => {
          if (res.code == 200) {
            this.n = 1;
            this.$message.success("操作成功");
            this.$emit("change",false)
          }
        });
    },

    //页面取消按钮
    cancel() {
      this.$confirm(`当前页面修改内容尚未保存，是否确认退出？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            this.$emit("change",false)
          })
          .catch(() => {});
    }

  },
};
</script>

<style lang="scss" scoped>
.left {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .title {
    display: flex;
    align-items: center;
  }

  .bar {
    display: inline-block;
    width: 4px;
    height: 15px;
    background: #333;
    margin-right: 8px;
  }

  b {
    font-size: 15px;
  }
}
</style>
