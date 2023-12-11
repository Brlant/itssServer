<template>
  <div class="app-container">
    <el-row>
      <el-col :span="20">
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
          <!--     时间搜索 -->
          <el-form-item prop="recv_time">
            <el-date-picker
              v-model="queryParams.recv_time"
              style="width: 300px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
            ></el-date-picker>
          </el-form-item>
          <!--      流程名称-->
          <el-form-item prop="house_id">
            <el-select v-model="queryParams.house_id" placeholder="流程名称" clearable>
              <el-option
                v-for="u in flowPathName"
                :key="u.value"
                :label="u.label"
                :value="u.value"
              />
            </el-select>
          </el-form-item>
          <!--      发起人-->
          <el-form-item prop="house_id">
            <el-select v-model="queryParams.house_id" placeholder="发起人" clearable>
              <el-option
                v-for="u in flowPathName"
                :key="u.value"
                :label="u.label"
                :value="u.value"
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
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-download">
          导出
        </el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table v-loading="loading" :data="handleList">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="所属部门" align="center" prop="department"/>
      <el-table-column label="物品编号" align="center" prop="serialNumber"/>
      <el-table-column label="物品名称" align="center" prop="serialName"/>
      <el-table-column label="物品类型" align="center" prop="serialType"/>
      <el-table-column label="物品类目" align="center" prop="serialCategory"/>
      <el-table-column label="型号" align="center" prop="model"/>
      <el-table-column label="规格" align="center" prop="specifications"/>
      <el-table-column label="单位" align="center" prop="unit"/>
      <el-table-column label="供应商" align="center" prop="supplier"/>
      <el-table-column label="含税进价" align="center" prop="taxIncludedPurchasePrice"/>
      <el-table-column label="税率" align="center" prop="taxRate"/>
      <el-table-column label="不含税进价" align="center" prop="purchasePriceExcludingTax"/>
      <el-table-column label="库存数量" align="center" prop=""/>
      <el-table-column label="含税总进价" align="center" prop=""/>
      <el-table-column label="不含税总进价" align="center" prop=""/>
      <el-table-column label="有效期" align="center" prop=""/>
    </el-table>

    <!--    翻页-->
    <pagination
      v-show="pageParams.total>0"
      :total="pageParams.total"
      :page.sync="pageParams.page"
      :limit.sync="pageParams.limit"
      @pagination="getInventoryList"
    />
  </div>
</template>

<script>
//我的办理页面
export default {
  name: "index",
  data() {
    return {
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
      //流程名称
      flowPathName: [],
      //查询列表数据
      handleList: [
        {
          department: "国药", serialNumber: 1, serialName: "国药", serialType: "公用", serialCategory: "测试",
          model:"CVN",specifications:"规格",unit:"单位",supplier:"国企",taxIncludedPurchasePrice:"59.5",
          taxRate:"53.5",purchasePriceExcludingTax:"5629",
        }
      ],
    }
  },
  created() {
    this.getInventoryList();
  },
  methods: {
    /** 获取库存管理列表数据 */
    getInventoryList() {
      let params = {};
      this.loading = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {

    },
    /** 重置按钮*/
    resetQuery() {

    },

  }
}
</script>

<style scoped>

</style>
