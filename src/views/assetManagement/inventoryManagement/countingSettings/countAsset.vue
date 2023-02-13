<!--盘点审批流程-->
<template>
    <div>
        <div class="left">
          <div class="title">
            <span class="bar">
            </span>
            <b>审批流程</b>
          </div>
          <el-button type="text" @click="edit">编辑</el-button>

        </div>
      <div style='background:#ffffff;'>
        <div v-for='(item,index) in FlowConfigList' :key="index" style='width:30%;display:inline-block'>
          <FactoryDrawFlow
            ref="flow"
            :FlowConfig="item.list"
            :modelType="item.type"
            :scaleVal="scaleVal"
          ></FactoryDrawFlow>
          <!--              <el-form-item label="适用部门" prop="dept">
                          <span v-for='(i,index) in item.sysDeptList' :key="index"> {{i.deptName+'；'}}</span>
                        </el-form-item>-->
        </div>
      </div>
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
      scaleVal: 100, // 流程图缩放比例 100%
      detailId:'',
      FlowConfigList:[],
    };
  },
  created() {
    this.detailData()
  },
  methods: {
    //编辑
    edit() {
      this.$emit("change",true)
    },
    detailData(){
      getInventoryFlow().then(res=>{
        this.FlowConfigList = res.data.flowInfoVoList[0].flowDefInfoVoList
        this.FlowConfigList.forEach(item=>{
          let { des, json, modelType, modelKey, processId } = item.flowProcDefRes;
          let processData = JSON.parse(json);
          item.list=processData.list
          item.type='see'
        })
      })
    },

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
