<template>
  <div class="my">
    <div class="heading">
      <my-tabs
        v-model="tab"
        :options="tabOptions"
        @change="change"
      />
      <div class="btns">
<!--        暂时不做
        <el-button type="primary">批量归还</el-button>-->

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
      :asset="assetBorrow"
      @success="onBorrowSuccess"
      ref="borrow"
    />
  </div>
</template>

<script>
import MyTabs from '@/components/MyTabs'
import { personalAssetList } from '@/api/assetManagement/myAssets'
import { queryAsset, queryAssetBorrow } from '@/api/assetManagement/quickAssetDetail'
import MyApply from './MyApply'
import AssetBorrow from './AssetBorrow'
import AssetClaim from './AssetClaim'
import {tabOptions} from "../companyAssets/options";

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
      asset: [],
      // 资产借用数据源
      assetBorrow: []
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
        // this.asset = res.data
        let arr = res.data
        arr.forEach((m) => {
          if ((m.children ?? '')!=='') {
            m.children.forEach((item) => {
              if ((item.children ?? '')=='') {
                item.disabled = true
              }
            });
          }else if ((m.children ?? '')=='') {
            m.disabled = true
          }
        });
        this.asset = arr
      })
      queryAssetBorrow().then(res=>{
        // this.assetBorrow = res.data
        let arr = res.data
        arr.forEach((m) => {
          if ((m.children ?? '') !== '') {
            m.children.forEach((item) => {
              if ((item.children ?? '') == '') {
                item.disabled = true
              }
            });
          }else if ((m.children ?? '') == '') {
            m.disabled = true
          }
        });
        this.assetBorrow = arr
      })
    },
    // 进入详情页
    goDetail(row, column) {
      if(column && column.label=='操作'){
        return;
      }
      this.$router.push({
        path: '/assetManagement/companyAssets/companyAssets-auth/detail',
        query: {
          id: row.assetId,
          personalId:row.id,
          status: this.statusFormatter(row),
          isApplying: row.isApplying,
          manageType: row.manageType
        }
      })
    },
    // 资产申领
    initClaim() {
      this.$refs.claim.open()
    },
    onClaimSuccess() {
      if (this.tab == 2) {
        this.$refs.apply.reset()
      }
    },

    // 资产借用
    initBorrow() {
      this.$refs.borrow.open()
    },
    onBorrowSuccess() {
      if (this.tab == 2) {
        this.$refs.apply.reset()
      }
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
          // status = '闲置'
          // 2023/06/30 v1.1版本
          status = '在库'
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

    /*// 状态处理
    statusFormatter(row) {
      let res
      if (row.specialStatus !== null) {
        const specialArr = tabOptions.filter(v => v.type == 'specialStatus')
        res = specialArr.find(v => row.specialStatus == v.value).label
        return res
      }
      if (row.status !== null) {
        if (row.status === 7) {
          if (row.isApplying === 0) {
            return '未入库'
          } else if (row.isApplying === 1) {
            return '待审批入库'
          }
        } else {
          const arr = tabOptions.filter(v => v.type == 'status')
          res = arr.find(v => row.status == v.value).label
          return res
        }
      }
    },*/
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
<style lang="scss" scoped>
.apply {
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .tabs {
      display: flex;
      align-items: center;
      >div {
        box-sizing: border-box;
        padding: 5px 10px;
        border-radius: 15px;
        margin-right: 15px;
        cursor: pointer;
        .text {
          font-size: 14px;
        }
      }
      .active {
        background: #fff;
        color: #037dff;
      }
    }
    .btn {
      color: #037dff;
      cursor: pointer;
      i {
        margin-left: 5px;
        transition: all .4s;
      }
      .up {
        transform: rotate(180deg);
      }
    }
  }
  .search {
    background: #fff;
    height: 0;
    overflow: hidden;
    transition: all .4s;
  }
  .expand {
    padding: 10px;
    height: auto;
  }
}
.item {
  padding: 5px 0;
  border-bottom: 1px solid #dfe6ec;
  &:last-child {
    border-bottom: 0;
  }
}
.pagination-container {
  background: transparent;
}
</style>
