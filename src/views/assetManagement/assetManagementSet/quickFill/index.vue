<template>
  <div class="quick-fill">
    <div class="heading">
      <span class="name">
        快速填充模板
      </span>
      <div class="add">
        <span class="plus">+</span>
        <span class="text">添加</span>
      </div>
    </div>
    <el-table 
      :data="tableData" 
      border
      v-loading="loading"
    >
      <el-table-column 
        width="100" 
        align="center" 
        label="模板ID" 
        prop="id"
      />
      <el-table-column
        align="center"
        label="模板名称" 
        prop="templateName" 
      />
      <el-table-column
        align="center" 
        label="适用资产类型" 
        prop="assetTypeName" 
      />
      <el-table-column
        align="center" 
        label="品牌" 
        prop="brand" 
      />
      <el-table-column
        align="center"
        label="型号" 
        prop="model" 
      />
      <el-table-column
        align="center"
        label="操作系统" 
        prop="os" 
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="edit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="switchPage"
        :current-page.sync="pageNum"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        layout="sizes, prev, pager, next"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import { 
  queryAll 
} from '@/api/assetManagement/quickAssetDetail'

export default {
  data() {
    return {
      loading: false,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 表格数据
    getTableData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      queryAll(params).then(res => {

      })
    },
    // 编辑
    edit(row) {

    },
    // 分页相关
    handleSizeChange(pageSize) {

    },
    switchPage(pageNum) {

    }
  }
}
</script>

<style lang="scss" scoped>
.quick-fill {
  .heading {
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .add {
      display: flex;
      align-items: center;
      color: #307dff;
      cursor: pointer;
      .plus {
        margin-right: 8px;
      }
    }
  }
  .pagination {
    margin-top: 15px;
  }
}
</style>
