<template>
  <el-dialog :visible="dialogDetailsProcessDialog" :title="detailsTitle" width="60%" @close="handleCloseProcess">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ detailsTitle }}</div>
    </template>
    <el-table v-loading="detailsLoading" :data="detailsDataList">
      <el-table-column label="序号" align="serialNumber" prop="serialNumber"></el-table-column>
      <el-table-column label="节点名称" align="center" prop="modelNode" />
      <el-table-column label="审批人类型" align="center" prop="reviewedType" >
        <template v-slot="{ row }">
          <span v-if="row.reviewedType === null">/</span>
          <span v-else>{{row.reviewedType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="reviewedName" >
        <template v-slot="{ row }">
          <span v-if="row.reviewedName === null">/</span>
          <span v-else>{{row.reviewedName}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { getDetailList } from '@/api/auditCenter/process/process';
export default {
  name: 'processDetail',
  props:["dialogDetailsProcessDialog","modelId","detailsTitle"],
  watch:{
    modelId: {
      handler(newVal, oldVal) {
        if(newVal){
          this.getDetailList(newVal)
        }
      },
      immediate: true,
    }
  },
  data(){
    return{
      // detailsTitle:'供应商档案审核流程', //弹框详情
      detailsLoading:false,//详情加载
      detailsDataList:[],//详情列表
    }
  },
  created() {

  },
  mounted() {
    if(this.modelId){
      this.getDetailList(this.modelId);
    }
  },
  methods:{
    /* 关闭详情弹框 */
    handleCloseProcess(){
      this.$emit('handleCloseProcess')
    },
    /* 获取详情信息*/
    getDetailList(newVal){
      let params = {
        activeModelId:newVal
      }
      getDetailList(params).then((res)=>{
        this.detailsDataList = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
