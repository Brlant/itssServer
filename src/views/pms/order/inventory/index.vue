<template>
  <div class="app-container">
    <el-row>
      <el-col :span="20">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <!--      流程标题搜索-->
          <el-form-item prop="codeNameKey">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.codeNameKey"
              placeholder="物品编号/名称"
              clearable
            />
          </el-form-item>

          <!--     物品类型 -->
          <el-form-item prop="goodsType">
            <el-select v-model="queryParams.goodsType" placeholder="物品类型" clearable  >
              <el-option
                v-for="(item,index) in goodsTypes"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.status !== '0'"
              />
            </el-select>
          </el-form-item>
          <!--      供应商-->
          <el-form-item prop="supplierId">
            <el-select v-model="queryParams.supplierId" @clear="removeTag" filterable :filter-method="getSupplierList" placeholder="供应商" clearable>
              <el-option
                v-for="(item,index) in supplierList"
                :key="index"
                :label="item.supplierName"
                :value="item.supplierId"
              />
            </el-select>
          </el-form-item>
          <!--      所属部门-->
          <el-form-item prop="departId">
            <el-cascader
              v-model="queryParams.departId"
              placeholder="发起部门"
              :options="deptList"
              :props="{ checkStrictly: true,emitPath:false, value: 'id' }"
              clearable filterable ></el-cascader>
          </el-form-item>
          <!--搜索重置-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getInventoryList">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-download"
                   v-has-permi="['pms:stock:export']"
                   @click="exportExcel">
          导出
        </el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table v-loading="loading" :data="handleList" @row-click="handleRowClick">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="所属部门" align="center" prop="departName"/>
      <el-table-column label="物品编号" align="center" prop="goodsCode"/>
      <el-table-column label="物品名称" align="center" prop="goodsName"/>
      <el-table-column label="物品类型" align="center" prop="goodsType">
        <template v-slot="{ row }">
          <div v-for="(item,index) in goodsTypes">
            <span v-if="row.goodsType  === item.dictCode">{{item.dictLabel}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="物品类目" align="center" prop="goodsClassifyName"/>
      <el-table-column label="型号" align="center" prop="goodsModel"/>
      <el-table-column label="规格" align="center" prop="goodsSpecifications"/>
      <el-table-column label="单位" align="center" prop="goodsUnit"/>
      <el-table-column label="供应商" align="center" prop="supplierName"/>
      <el-table-column label="含税进价" align="center" prop="taxBid"/>
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="不含税进价" align="center" prop="nonTaxBid"/>
      <el-table-column label="库存数量" align="center" prop="amount"/>
      <el-table-column label="含税总进价" align="center" prop="totalTaxBid"/>
      <el-table-column label="不含税总进价" align="center" prop="nonTotalTaxBid"/>
      <el-table-column label="有效期" align="center" prop="validityDate" >
        <template v-slot="{ row }">
          <span v-if="row.validityDate" :style="{ color: isPast(row.validityDate) ? 'red' : 'black' }">
            {{row.validityDate}}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!--    翻页-->
    <pagination
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getInventoryList"
    />

    <inventory-form :dialogAddForm="dialogAddForm" :formTitle="formTitle" :stockId="stockId" @closeAddForm="closeAddForm"></inventory-form>
  </div>
</template>

<script>
import supplierApi from '@/api/supplier/supplier'
import inventoryApi from '@/api/inventory/inventory'
import { treeselect } from '@/api/system/dept'
import inventoryForm from '@/views/pms/order/inventory/inventoryLog'
import {getDicts} from '@/api/system/dict/data'
import request from '@/utils/request'
export default {
  name: "index",
  components: {
    inventoryForm
  },
  data() {
    return {
      stockId:0,
      // 遮罩层
      loading: true,
      dialogAddForm:false,
      // 显示搜索条件
      showSearch: true,
      formTitle:'库存流水',
      // 查询参数
      queryParams: {
        //分页
        total: 10,
        pageNum: 1,
        pageSize: 10,
      },
      //查询列表数据
      handleList: [],
      //物品类型列表
      goodsTypes:[
        // {label:"固定资产",value:1},
        // {label:"易耗品",value:2},
        // {label:"服务",value:3},
        // {label:"销售品",value:4},
      ],
      supplierList:[],
      // 发起部门（多层级）
      deptList: [],
      // 发起人，按部门筛选
      userList: []
    }
  },
  created() {
    this.getInventoryList();
    this.getSupplierList();
    this.getDeptList('')
    this.getUserList('')
    this.getGoodsTypes()
  },
  methods: {
    isPast(date) {
      const now = new Date();
      const past = new Date(date);
      return past.getTime() < now.getTime();
    },
    /* 导出 */
    exportExcel(){
      inventoryApi.exportInventoryLog(this.queryParams).then()
    },
    getDeptList(query) {
      treeselect(query).then(res => {
        this.deptList = res.data
      })
    },
    getUserList(keyword) {
      let params = {
        deptId: this.queryParams.applyDepart,
        nickName: keyword,
        // 用户状态（0正常 1停用）
        status: 0
      }

      request.get('system/user/selectUserList', {
        params
      }).then(res => {
        this.userList = res.rows.map(item => {
          return {
            label: item.nickName,
            value: item.userId
          }
        })
      })
    },
    getSupplierList(query){
      let params = {
        codeNameKey: query,
        pageNum: 1,
        pageSize: 1000,
      }
      supplierApi.getSupplierList(params).then((res) => {
        this.supplierList = res.data.rows;
      })
    },
    /** 获取库存管理列表数据 */
    getInventoryList() {
      let params = {
        codeNameKey: this.queryParams.codeNameKey,
        goodsType: this.queryParams.goodsType,
        supplierId: this.queryParams.supplierId,
        departId: this.queryParams.departId,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      }

      inventoryApi.queryInventory(params).then((res) => {
        this.handleList = res.data.rows;
        console.log(res.data.rows)
        this.queryParams.total = res.data.total;
        this.loading = false;
      })
    },
    handleRowClick(row) {
      this.stockId = row.stockId;
      this.dialogAddForm = true
    },
    closeAddForm(){
      this.stockId = 0;
      this.dialogAddForm = false;
    },

    /** 重置按钮*/
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.getInventoryList();
      this.getSupplierList();
    },
    removeTag(){
      this.getInventoryList();
      this.getSupplierList();
    },
    getGoodsTypes(){
      return getDicts('goods_types').then((res) => {
        this.goodsTypes = res.data.filter(item => item.dictLabel !== '服务');
      })
    }
  }
}
</script>

<style scoped>

</style>
