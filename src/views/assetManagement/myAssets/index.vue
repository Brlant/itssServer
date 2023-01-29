<template>
  <div class="my">
    <div class="heading">
      <my-tabs
        v-model="tab"
        :options="tabOptions"
        @change="change"
      />
      <div class="btns">
        <el-button type="primary">批量归还</el-button>
        <el-button type="primary" @click="initClaim">
          资产申领
        </el-button>
        <el-button type="primary" @click="initBorrow">
          资产借用
        </el-button>
      </div>
    </div>
    <!-- 前2个tab -->
    <div class="main" v-if="tab === 0 || tab === 1">
      <!-- 表格开始 -->
      <el-table
        :data="tableData"
        @row-click="goDetail"
        border
        v-loading="loading"
      >
        <el-table-column 
          align="center"
          label="资产ID"
          prop="assetId"
        />
        <el-table-column 
          align="center"
          label="资产编号"
          prop="assetNo"
        />
        <el-table-column 
          align="center"
          label="资产类型"
          prop="assetTypeName"
        />
        <el-table-column 
          align="center"
          label="资产名称"
          prop="assetName"
        />
        <el-table-column 
          align="center"
          label="型号"
          prop="model"
        />
        <el-table-column
          v-if="tab === 0"
          align="center"
          label="状态"
          :formatter="statusFormatter"
        />
        <el-table-column
          v-if="tab === 1"
          align="center"
          label="领用数量"
          prop="amount"
        />
        <el-table-column
          align="center"
          label="申请日期"
          prop="applyDate"
        />
        <el-table-column
          align="center"
          label="查收日期"
          prop="checkDate"
        />
      </el-table>
      <!-- 表格结束 -->
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>

    <!-- 我的申请tab -->
    <my-apply 
      v-if="tab === 2"
      :asset="asset"
      ref="apply"
    />

    <!-- 资产申领弹窗 -->
    <asset-claim 
      :asset="asset"
      @success="onClaimSuccess"
      ref="claim" 
    />

    <!-- 资产借用弹窗 -->
    <asset-borrow
      :asset="asset"
      ref="borrow" 
    />
  </div>
</template>

<script>
import MyTabs from '@/components/MyTabs'
import { personalAssetList } from '@/api/assetManagement/myAssets'
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
import MyApply from './MyApply'
import AssetBorrow from './AssetBorrow'
import AssetClaim from './AssetClaim'

export default {
  components: {
    MyTabs,
    MyApply,
    AssetBorrow,
    AssetClaim
  },
  data() {
    return {
      tab: 0,
      tabOptions: [
        { label: '个人资产', value: 2 },
        { label: '已领耗材', value: 1 },
        { label: '我的申请', value: 3 }
      ],
      tableData: [],
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      asset: []
    }
  },
  created() {
    // tab回显
    const { tab } = this.$route.params
    this.tab = tab ? tab - 0 : 0

    this.getTableData()
    this.getAsset()
  },
  methods: {
    // 表格数据
    getTableData() {
      let data
      if (this.tab !== 2) {
        // 前2个tab
        data = {
          manageType: this.tabOptions[this.tab].value
        }
        personalAssetList(data, this.queryParams).then(res => {
          this.tableData = res.rows
          this.total = res.total
        })
      }
    },
    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
      })
    },
    // 进入详情页
    goDetail(row) {
      this.$router.push({
        path: '/assetManagement/companyAssets/companyAssets-auth/detail',
        query: {
          id: row.id,
          status: this.statusFormatter(row)
        }
      })
    },
    // 资产申领
    initClaim() {
      this.$refs.claim.open()
    },
    onClaimSuccess() {
      if (this.tab == 2) {
        this.$refs.apply.getTableData()
      }
    },
    // 资产借用
    initBorrow() {
      this.$refs.borrow.open()
    },
    // tab切换
    change() {
      this.queryParams.pageNum = 1
      this.getTableData()
    },
    // 分页
    getList() {
      this.getTableData()
    },
    // 状态
    statusFormatter(row) {
      let status
      switch (row.status) {
        case 1:
          status = '闲置'
          break
        case 2:
          status = '使用中'
          break
        case 3:
          status = '借用中'
          break
        case 4:
          status = '维修中'
          break
        case 5:
          status = '已报废'
          break
        case 6:
          status = '盘亏'
          break
        case 7:
          status = '待审批入库'
          break
      }
      return status
    }
  }
}
</script>

<style lang="scss" scoped>
.my {
  padding: 10px;
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
}
.pagination-container {
  background: transparent;
}
</style>
