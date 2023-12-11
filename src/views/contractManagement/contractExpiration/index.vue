<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <!--      流程标题搜索-->
          <el-form-item prop="num">
            <el-input
              prefix-icon="el-icon-search"
              v-model="queryParams.num"
              placeholder="流程标题搜索"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--          供应商-->
          <el-form-item prop="noticeType">
            <el-select v-model="queryParams.noticeType" placeholder="供应商" clearable>
              <el-option
                v-for="dict in supplierArray"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <!--搜索重置-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
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
              @click="setActiveFilter(index)"
            >
              {{ item.text }}
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
    <el-table v-loading="loading" :data="filteredData" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="合同编号"></el-table-column>
      <el-table-column prop="contractType" label="合同类型"></el-table-column>
      <el-table-column prop="contractName" label="合同名称"></el-table-column>
      <el-table-column prop="supplier" label="供应商"></el-table-column>
      <el-table-column prop="contractMoney" label="合同金额"></el-table-column>
      <el-table-column prop="contractTime" label="签订日期"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
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
      v-show="pageParams.total>0"
      :total="pageParams.total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.limit"
      @pagination="getContractExpiration"
    />

    <!--  详情表单-->
    <contract-form :dialogContractForm="dialogContractForm" @closeAddForm="closeAddForm"></contract-form>
  </div>
</template>

<script>
//合同到期提醒
import contractForm from "@/common/contractForm/contractForm";
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
      queryParams: {},
      //翻页参数
      pageParams: {
        total: 10,
        page: 1,
        limit: 10,
        order: "id desc",
      },
      //供应商
      supplierArray: [],
      //切换按钮
      filters: [
        {text: "全部", status: null},
        {text: "近30天", status: "thirty"},
        {text: "近7天", status: "seven"},
      ],
      activeFilterIndex: 0,
      tableData: [
        {
          name: "项目A",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "thirty"
        },
        {
          name: "项目B",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "thirty"
        },
        {
          name: "项目C",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "thirty"
        },
        {
          name: "项目D",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "seven"
        },
        {
          name: "项目E",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "seven"
        },
        {
          name: "项目F",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "seven"
        },
        {
          name: "项目G",
          contractType: "平常",
          contractName: "三方",
          supplier: "国药",
          contractMoney: "100",
          contractTime: "2023/12/07",
          status: "seven"
        },
      ],
    }
  },
  computed: {
    filteredData() {
      const activeFilter = this.filters[this.activeFilterIndex];
      if (!activeFilter.status) {
        return this.tableData;
      }
      return this.tableData.filter((item) => item.status === activeFilter.status);
    },
    switchType() {
      return this.filters.map((filter) => {
        return {
          text: filter.text,
        }
      })
    },
  },
  created() {
    this.getContractExpiration();
  },
  methods: {
    /*查询列表*/
    getContractExpiration() {
      let params = {};
      this.loading = false;
    },
    /*搜索*/
    handleQuery() {

    },
    /*重置*/
    resetQuery() {

    },
    /*切换按钮查询列表*/
    setActiveFilter(index) {
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
