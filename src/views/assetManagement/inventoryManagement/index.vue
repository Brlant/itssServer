<template>
  <div class="inventory">
    <div class="heading">
      <span class="title">
        盘点任务列表
      </span>
      <div class="btns">
        <div class="item">
          <span @click="openDialog">发起盘点</span>
        </div>
         <!-- @click='countSet'暂时不做 -->
        <div class="item">
          <span>盘点设置</span>
        </div>
      </div>
    </div>
    <!-- 表格部分 -->
    <el-table
      :data="tableData"
      border
      @row-click="goDetail"
      v-loading="loading"
    >
      <el-table-column
        align="center"
        label="盘点ID"
        prop="id"
      />
      <el-table-column
        align="center"
        label="创建人"
        prop="creatorName"
      />
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
      />
      <el-table-column
        align="center"
        label="完成时间"
        prop="completeTime"
      />
      <el-table-column
        align="center"
        label="涉及资产类型"
        prop="assetTypeName"
      />
      <el-table-column
        align="center"
        label="涉及资产状态"
        prop="assetStatusName"
      />
      <el-table-column
        align="center"
        label="备注"
        prop="remark"
      />
      <el-table-column
        align="center"
        label="当前状态"
      >
      <template slot-scope="scope">
        <span>
          {{
            scope.row.name
            ? formatStatus(scope.row.name)
            : ''
          }}
        </span>
      </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 发起盘点弹窗 -->

  </div>
</template>

<script>
import { getAssetInventory } from '@/api/assetManagement/inventoryManagement'

export default {
  components: {

  },
  data() {
    return {
      loading: false,
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
    }
  },
  mounted()
  {
    this.getTableData()
  },

  methods: {
    // 表格数据
    getTableData() {
      this.loading = true
      getAssetInventory(this.queryParams).then(res=>{
        this.tableData = res.rows
        this.total = res.total
        this.loading = false
      }).catch(()=>{
        this.loading = false
      })
    },

    // 打开发起盘点弹窗
    openDialog() {

    },
    // 进入详情
    goDetail(row) {
      this.$router.push({
        path: '/assetManagement/inventoryManagement-auth/detail',
        query:{
          id:row.id,
        }
      })
    },
    //盘点设置按钮
    countSet(){
      this.$router.push({
        path: '/assetManagement/inventoryManagement-auth/countingSettings'
      })
    },

    // 分页
    getList() {
      this.getTableData()
    },

    // 格式化状态
    formatStatus(val){
      let label = ''
      if(val){
        switch (val) {
          case '1':
            label = '进行中'
            break
          case '2':
            label = '已完成'
            break
          case '3':
            label = '已报损'
            break
        }
        return label
      }
      return label
    }
  }
}
</script>

<style lang="scss" scoped>
.inventory {
  background: #fff;
  padding: 15px 10px;
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .title {
      font-size: 18px;
    }
    .btns {
      display: flex;
      align-items: center;
      .item {
        padding: 0 10px;
        border-right: 1px solid #037dff;
        line-height: 1;
        &:last-child {
          border-right: 0;
          padding-right: 0;
        }
        span {
          color: #037dff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
