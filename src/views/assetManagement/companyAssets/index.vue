<template>
  <div class="company">
    <!-- 筛选项开始 -->
    <section class="search">
      <div class="heading">
        <div class="left">
          <span>展开筛选</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <div class="right">
          <el-button type="primary" size="small" >
            批量管理
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-button type="primary" size="small" >
            录入资产
          </el-button>
        </div>
      </div>
      <div class="form">
        <el-form 
          :model="formData" 
          ref="elForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="span">
              <el-form-item label="购入日期" prop="purchasingDate">
                <el-date-picker
                  v-model="formData.purchasingDate"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :style="style"
                />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="保管人" prop="holderName">
                <el-input v-model.trim="formData.holderName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="保管员" prop="keeper">
                <el-input v-model.trim="formData.keeper" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="录入人" prop="creatorName">
                <el-input v-model.trim="formData.creatorName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="管理方式" prop="manageType">
                <el-select v-model="formData.manageType" clearable :style="style">
                  <el-option value="1" label="耗材" />
                  <el-option value="2" label="固定资产" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="span">
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
            <el-col :span="span">
              <el-form-item label="资产名称" prop="assetName">
                <el-input v-model.trim="formData.assetName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="资产品牌" prop="brand">
                <el-input v-model.trim="formData.brand" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="资产型号" prop="model">
                <el-input v-model.trim="formData.model" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="归属部门:" prop="departmentId">
                <treeselect
                  v-model="formData.departmentId"
                  :options="dept"
                  ref="deptTree"
                  :show-count="true"
                  placeholder="请选择"
                />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="资产编号" prop="assetId">
                <el-input v-model.trim="formData.assetId" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="财务编号" prop="financialNo">
                <el-input v-model.trim="formData.financialNo" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="到期提醒" prop="certificateType">
                <el-select v-model="formData.certificateType" clearable :style="style">
                  <el-option value="1" label="证书到期" />
                  <el-option value="2" label="保用期限到期" />
                  <el-option value="3" label="保养到期" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="折旧统计" prop="depreciation">
                <el-date-picker
                  v-model="formData.depreciation"
                  value-format="yyyy-MM-dd"
                  type="monthrange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  :style="style"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="display:flex; justify-content:flex-end">
              
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
    <!-- 筛选项结束 -->
  </div>
</template>

<script>
import {
  queryAsset
} from '@/api/assetManagement/quickAssetDetail'
import { treeselect } from "@/api/system/dept"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      span: 6,
      style: {width: '100%'},
      asset: [],
      dept: [],
      formData: {
        assetTypeId: []
      },
    }
  },
  mounted() {
    this.getAsset()
    this.getDept()
  },
  methods: {
    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
      })
    },
    // 部门查询
    getDept() {
      treeselect().then(res => {
        this.dept = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.company {
  .search {
    padding: 10px;
    background: #fff;
    .heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .left {
        color: #037dff;
        i {
          margin-left: 5px;
        }
      }
    }
  }
}
.el-row { 
  display:flex; 
  flex-wrap: wrap; 
}
</style>