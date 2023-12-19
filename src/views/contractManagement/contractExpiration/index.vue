<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <!--      合同编号-->
          <el-form-item prop="key">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.key"
              placeholder="合同编号"
              clearable
              @keyup.enter.native="getContractExpiration"
            />
          </el-form-item>
          <!--          供应商-->
          <el-form-item prop="supplierId">
            <el-select v-model="queryParams.supplierId" filterable :filter-method="getSupplierList" placeholder="供应商" clearable>
              <el-option
                v-for="(item,index) in supplierList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!--搜索重置-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getContractExpiration">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="CentralSearch">
          <el-form>
            <el-form-item label="到期时间"></el-form-item>
          </el-form>
          <el-form>
            <el-button
              v-for="(item,index) in switchType"
              :key="index"
              :class="{ 'is-active': activeFilterIndex === index }"
              @click="setActiveFilter(item,index)"
            >
              {{ item.label }}
            </el-button>
          </el-form>
        </div>
      </el-col>
      <el-col :span="2">
        <!--        导出-->
        <el-button
          type="primary"
          icon="el-icon-download"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <!--    查询表格-->
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="contractRecordCode" label="合同档案编号"></el-table-column>
      <el-table-column prop="contractCode" label="合同编号"></el-table-column>
      <el-table-column prop="contractType" label="合同类型">
        <template slot-scope="scope">
          <span>{{ scope.row.contractType === 1? '销售合同' : '采购合同' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractName" label="合同名称"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>
      <el-table-column prop="contractAmount" label="合同金额"></el-table-column>
      <el-table-column prop="signingDate" label="签订日期"></el-table-column>
      <el-table-column prop="contractStatus" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.contractStatus === ''">全部</span>
          <span v-if="scope.row.contractStatus === 0">待审核</span>
          <span v-if="scope.row.contractStatus === 1">审核中</span>
          <span v-if="scope.row.contractStatus === 2">审核不通过</span>
          <span v-if="scope.row.contractStatus === 3">启用</span>
          <span v-if="scope.row.contractStatus === 5">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-data"
            @click="handleDetails(scope.row)"
          >详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    翻页-->
    <pagination
      v-show="queryParams.total>0"
      :total="queryParams.total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getContractExpiration"
    />

    <!--  详情表单-->
    <contract-form :dialogContractForm="dialogContractForm" @closeAddForm="closeAddForm"></contract-form>
  </div>
</template>

<script>
//合同到期提醒
import contractForm from "@/common/contractForm/contractForm";
import supplierApi from '@/api/supplier/supplier'
import { getContractFileList } from '@/api/contractFilesManagement/contractFilesManagement'
export default {
  name: "index",
  components:{
    contractForm,
  },
  data() {
    return {
      dialogContractForm:false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        key:"",
        supplierId:'',
        days:'',
        //分页
        total: 10,
        page: 1,
        limit: 10,
      },
      //供应商
      supplierArray: [],
      supplierList:[],
      //切换按钮
      filters: [
        {label: "全部", value: null},
        {label: "近30天", value: "30"},
        {label: "近7天", value: "7"},
      ],
      activeFilterIndex: 0,
      tableData: [],
    }
  },
  computed: {
    switchType() {
      return this.filters.map((filter) => {
        return {
          label: filter.label,
          value: filter.value
        }
      })
    },
  },
  created() {
    this.getContractExpiration();
  },
  methods: {
    getSupplierList(query){
      let params = {
        codeNameKey: query,
        pageNum: 1,
        pageSize: 10,
      }
      supplierApi.getSupplierList(params).then((res) => {
        this.supplierList = res.data.rows.map(item => {
          return {
            value: item.supplierId,
            label: item.supplierName
          }
        })
      })
    },

    /*查询列表*/
    getContractExpiration() {
      let params = {
        key:this.queryParams.key,
        supplierId:this.queryParams.supplierId,
        days:this.queryParams.days,
        pageNum: this.queryParams.page,
        pageSize: this.queryParams.limit,
      };
      getContractFileList(params).then(res=>{
        this.loading = false;
        this.tableData = res.rows;
        this.queryParams.total = res.total;
      })

    },

    /*重置*/
    resetQuery() {
      this.$refs.queryForm.resetFields();
      this.getContractExpiration();
    },
    /*切换按钮查询列表*/
    setActiveFilter(row,index) {
      this.queryParams.days = row.value;
      this.getContractExpiration();
      this.activeFilterIndex = index;
    },
    /*详情*/
    handleDetails(row) {
      this.dialogContractForm = true;
    },
    /*关闭详情弹框*/
    closeAddForm(){
      this.dialogContractForm = false;
    },
  },

}
</script>

<style scoped>
.CentralSearch {
  display: flex
}

.is-active {
  background-color: #409eff;
  color: #fff;
}

.SwitchTypes {
  margin: 10px 0px;
}
</style>
