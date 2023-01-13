<template>
  <div class="apply">
    <div class="heading">
      <!-- tab开始 -->
      <div class="tabs">
        <div
          v-for="(item, index) in options"
          :key="index"
          :class="{active: index === n}"
          @click="change(index)"
        >
          <span class="text">
            {{ item.label }}
            ({{ 5 }})
          </span>
        </div>
      </div>
      <!-- tab结束 -->
      <div class="btn" @click="isExpand = !isExpand">
        <span>
          {{ isExpand ? '收起' : '筛选' }}
        </span>
        <i :class="['el-icon-arrow-down', {up: isExpand}]"></i>
      </div>
    </div>
    <!-- 表单开始 -->
    <div :class="['search', {expand: isExpand}]">
      <el-form
        :model="formData"
        ref="elForm"
        label-width="90px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="applyDate">
              <el-date-picker
                v-model="formData.applyDate"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :style="style"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程类型" prop="flowId">
              <el-select v-model="formData.flowId" :style="style">

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程编号" prop="flowNo">
              <el-input v-model="formData.flowNo" :style="style" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产类型" prop="assetTypeId">
              <el-cascader
                v-model="formData.assetTypeId"
                :options="asset"
                ref="assetCas"
                :props="{ label: 'typeName', value: 'id' }"
                clearable
                :style="style"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产名称" prop="assetName">
              <el-input v-model.trim="formData.assetName" :style="style" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产编号" prop="assetId">
              <el-input v-model.trim="formData.assetId" :style="style" />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display:flex; justify-content:flex-end; align-items:center">
            <el-button type="primary">
              查询
            </el-button>
            <el-button>
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表单结束 -->
    <!-- 表格开始 -->
    <el-table
      :data="tableData"
      @row-click="goDetail"
      border
      v-loading="loading"
    >
      <el-table-column 
        align="center"
        label="流程ID"
        prop="FLOW_ID"
      />
      <el-table-column 
        align="center"
        label="流程类型"
        prop="CATEGORY_NAME"
      />
      <el-table-column 
        align="center"
        label="流程组名称"
        prop="FLOWGROUP_NAME"
      />
      <el-table-column 
        align="center"
        label="申请人"
        prop="APPLICANT_NAME"
      />
      <el-table-column 
        align="center"
        label="发起时间"
        prop="APPLY_TIME"
      />
      <el-table-column 
        align="center"
        label="资产类型"
        prop="ASSET_TYPE_NAME"
      />
      <el-table-column 
        align="center"
        :formatter="formatter"
      />
      <el-table-column 
        align="center"
        label="数量"
        prop="AMOUNT"
      />
      <el-table-column 
        align="center"
        label="状态"
        prop="STATUS"
      />
      <el-table-column 
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="cancel(row)">
            取消
          </el-button>
        </template>
      </el-table-column>
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
</template>

<script>
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
import { applyList } from '@/api/assetManagement/myAssets'

export default {
  data() {
    return {
      options: [
        { label: '审批中' },
        { label: '已完成' },
        { label: '已取消' },
      ],
      n: 0,
      isExpand: false,
      style: {width: '100%'},
      asset: [],
      formData: {
        assetTypeId: []
      },
      tableData: [{}],
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getAsset()
    this.getTableData()
  },
  methods: {
    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
      })
    },
    // 表格数据
    getTableData() {
      const params = {
        ...this.queryParams,
        userKey: this.$store.state.user.user.userId
      }
      applyList(params).then(res => {

      })
    },
    // tab切换
    change(index) {
      if (this.n === index) {
        return
      }
      this.n = index
    },
    // 取消
    cancel(row) {

    },
    // 分页
    getList() {

    },
    // 进入资产申领
    goDetail(row) {
      this.$router.push({
        path: '/assetManagement/myAssets/myAssets-auth/applyInfo'
      })
    },
    formatter(row) {
      return row.ASSET_NO + row.ASSET_NAME
    }
  }
}
</script>

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
</style>