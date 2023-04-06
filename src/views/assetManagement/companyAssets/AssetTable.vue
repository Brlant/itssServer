<template>
  <div class="table">
    <el-table
      :data="data"
      @row-click="goDetail"
      border
      v-loading="loading"
    >
      <el-table-column
        align="center"
        label="资产编号"
        prop="assetId"
      />
      <el-table-column
        align="center"
        label="资产类型"
        prop="assetTypeName"
      />
<!--      <el-table-column
        align="center"
        label="资产编号&名称"
        prop="assetIdName"
      />-->
      <el-table-column
        align="center"
        label="资产编号&名称"
        prop="assetIdName"
      >
        <template slot-scope="{row}">
          <span>
            {{ row.assetIdName }}
          </span>
          <span
            class="tag useTag"
            v-if="row.useStatus === 1"
          >
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="购入时间"
        prop="purchasingDate"
      >
        <template slot-scope="{row}">
            <span>
              {{ row.purchasingDate }}
            </span>
          <span
            class="tag maintainTag"
            v-if="row.maintainStatus === 1"
          >
            </span>
        </template>
      </el-table-column>
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
        label="原值"
        prop="afterTaxPrice"
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
      <!--      <el-table-column
              align="center"
              label="保管员"
              prop="keeper"
            />-->
      <el-table-column
        align="center"
        label="持有人"
        prop="holderName"
      />
      <el-table-column
        align="center"
        label="状态"
        :formatter="statusFormatter"
      >
        <template slot-scope="{row}">
          <span>
            {{ statusFormatter(row) }}
          </span>
          <span
            class="tag certificateTag"
            v-if="row.certificateStatus === 1"
          >
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="录入人员"
        prop="creatorName"
      />
      <el-table-column
        v-if="flag === 10"
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <span
            class="edit"
            v-if="row.isApplying === 0"
            @click.stop="edit(row)"
          >
            修改
          </span>
          <span
            class="del"
            v-if="row.isApplying === 0"
            @click.stop="del(row)"
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
      this.$confirm('确认删除改资产吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.$emit('delRow', row)
      }).catch(() => {})
    },

    // 进入详情页
    goDetail(row, column) {
      if(column && column.label=='操作'){
        return;
      }
      this.$router.push({
        path: '/assetManagement/companyAssets/companyAssets-auth/detail',
        query: {
          id: row.id,
          status: this.statusFormatter(row),
          isApplying: row.isApplying,
          manageType: row.manageType,
          assetTypeId:row.assetTypeId,
          departmentId:row.departmentId,
          tabFlag: this.flag,
          from: 'companyAssets'
        }
      })
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
        if (row.status === 2 && row.amount !== null && row.amount == 0) {
          return '已耗尽'
        } else if (row.status === 7) {
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
.tag {
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 0 0;
  position: absolute;
  left: 1px;
  top: 2px;
  color: red;
  font-size: 10px;
  line-height: 15px;
}
.useTag{
  background-image: url("../../../assets/images/useTag.png");
}
.maintainTag{
  background-image: url("../../../assets/images/maintainTag.png");
}
.certificateTag{
  background-image: url("../../../assets/images/certificateTag.png");
}
</style>
