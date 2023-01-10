<template>
  <div class="table">
    <el-table 
      :data="data"
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
        label="资产类型"
        prop="assetTypeName"
      />
      <el-table-column
        align="center"
        label="资产编号&名称"
        prop="assetIdName"
      />
      <el-table-column
        align="center"
        label="购入时间"
        prop="purchasingDate"
      />
      <el-table-column
        align="center"
        label="型号"
        prop="model"
      />
      <el-table-column
        align="center"
        label="数量"
        prop="amount"
      />
      <el-table-column
        align="center"
        label="期间折旧"
        prop="periodDepreciation"
      />
      <el-table-column
        align="center"
        label="累计折旧"
        prop="depreciation"
      />
      <el-table-column
        align="center"
        label="资产净值"
        prop="surplusValue"
      />
      <el-table-column
        align="center"
        label="归属部门"
        prop="departmentName"
      />
      <el-table-column
        align="center"
        label="保管员"
        prop="keeper"
      />
      <el-table-column
        align="center"
        label="状态"
        :formatter="statusFormatter"
      />
      <el-table-column
        align="center"
        label="录入人员"
        prop="creatorName"
      />
      <el-table-column
        v-if="flag === 9"
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <span
            class="edit"
            v-if="row.isApplying === 0 || row.isApplying === 3"
            @click="edit(row)"
          >
            修改
          </span>
          <span 
            class="del"
            v-if="row.isApplying === 0 || row.isApplying === 3"
            @click="del(row)"
          >
            删除
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tabOptions } from './options'

export default {
  props: [
    'data',
    'flag'
  ],
  data() {
    return {
      loading: false
    }
  },
  methods: {
    // 修改
    edit(row) {
      this.$router.push({
        path: '/assetManagement/companyAssets/companyAssets-auth/edit',
        query: {
          id: row.id
        }
      })
    },
    // 删除
    del(row) {

    },
    // 状态处理
    statusFormatter(row) {
      let res
      if (row.specialStatus !== null) {
        const specialArr = tabOptions.filter(v => v.type == 'specialStatus')
        res = specialArr.find(v => row.specialStatus == v.value).label
        return res
      }
      if (row.status !== null) {
        if (row.status == 1) {
          res = '闲置'
          return res
        } else {
          const arr = tabOptions.filter(v => v.type == 'status')
          res = arr.find(v => row.status == v.value).label
          return res
        }
      }
    },
    // 处理loading
    startLoading() {
      this.loading = true
    },
    endLoading() {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  color: #307dff;
  margin-right: 5px;
  cursor: pointer;
}
.del {
  color: #f56c6c;
  cursor: pointer;
}
</style>
