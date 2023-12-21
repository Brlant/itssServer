<template>
  <el-dialog :visible="dialogAddForm" :title="formTitle" width="80%" @close="closeAddForm">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <el-table v-loading="loading" :data="formList">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="订单编号" align="center" prop="pmsOrderNo"/>
      <el-table-column label="订单类型" align="center" prop="orderBizType">
        <template v-slot="{ row }">
          <span v-if="row.orderBizType === '1-0'">采购入库</span>
          <span v-if="row.orderBizType === '1-2'">盘盈入库</span>
          <span v-if="row.orderBizType === '1-4'">领用入库</span>
        </template>
      </el-table-column>
      <el-table-column label="发起人" align="center" prop="promoterName"/>
      <el-table-column label="发起部门" align="center" prop="promoterDepartName"/>
      <el-table-column label="发起日期" align="center" prop="promoterDate"/>
      <el-table-column label="库存变化" align="center" prop="stockChangeNum"/>
      <el-table-column label="库存余量" align="center" prop="stockAmount"/>
    </el-table>

    <!--    翻页-->
    <pagination
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    />

  </el-dialog>
</template>

<script>
import inventoryApi from '@/api/inventory/inventory'
export default {
  name: 'inventoryForm',
  props:['dialogAddForm','formTitle','stockId'],
  watch:{
    stockId:{
      handler(val){
       if(val){
         this.getFormList(val)
       }
      },
      immediate: true
    }
  },
  data() {
    return {
      formList:[],
      loading:true,
      queryParams:{
        pageNum:1,
        pageSize:10,
        total:0
      }
    }
  },
  methods: {
    closeAddForm() {
      this.$emit('closeAddForm')
    },
    /* 获取列表 */
    getFormList(stockId){
      let params = {
        pageNum:this.queryParams.pageNum,
        pageSize:this.queryParams.pageSize,
        stockId:stockId
      }
      inventoryApi.queryInventoryLog(params).then(res => {
        this.formList = res.rows
        this.queryParams.total = res.total
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
