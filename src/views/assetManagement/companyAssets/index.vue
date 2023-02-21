<template>
  <div class="company">
    <!-- 筛选项开始 -->
    <section class="search">
      <div class="heading">
        <div class="left" @click="isExpand = !isExpand">
          <span>
            {{ isExpand ? '收起筛选' : '展开筛选' }}
          </span>
          <i :class="['el-icon-arrow-down', {up: isExpand}]"></i>
        </div>
        <div class="right">
          <!-- <el-button type="primary" size="small" >
            批量管理
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/assetManagement/companyAssets/companyAssets-auth/add')"
          >
            录入资产
          </el-button>
        </div>
      </div>
      <div :class="['form', {expand: isExpand}]">
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
<!--            <el-col :span="span">
              <el-form-item label="保管人" prop="holderName">
                <el-input v-model.trim="formData.holderName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="保管员" prop="keeper">
                <el-input v-model.trim="formData.keeper" :style="style" />
              </el-form-item>
            </el-col>-->
            <el-col :span="span">
              <el-form-item label="持有人" prop="holderName">
                <el-input v-model.trim="formData.holderName" :style="style" />
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
                  :props="{ label: 'typeName', value: 'id', checkStrictly: true }"
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
                  :normalizer="normalizer"
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
                  <el-option value="2" label="使用期限到期" />
                  <el-option value="3" label="保养到期" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="折旧统计" prop="depreciation">
                <el-date-picker
                  v-model="formData.depreciation"
                  value-format="yyyy-MM"
                  type="monthrange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  :style="style"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="display:flex; justify-content:flex-end; align-items:center">
              <el-button type="primary" size="small" @click="query">
                查询
              </el-button>
              <el-button size="small" @click="reset">
                重置
              </el-button>
              <!-- <el-button type="success" size="small">
                导出Excel
              </el-button> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
    <!-- 筛选项结束 -->
    <!-- tab切换 -->
    <div class="tabs">
      <my-tabs
        v-model="tab"
        :options="tabOptions"
        @change="change"
      />
    </div>
    <!-- 计算部分开始 -->
    <div class="calc">
      <div class="item">
        <span class="label">
          <b>总计</b>
          (此处精确到小数点后两位)
        </span>
      </div>
      <div class="specific">
        <div class="item">
          <span class="label">税后价格</span>
          <span class="value">
            {{ calcData.afterTaxPriceTotal }}
          </span>
        </div>
        <div class="item">
          <span class="label">期间折旧</span>
          <span class="value">
            {{ calcData.periodDepreciationTotal }}
          </span>
        </div>
        <div class="item">
          <span class="label">
            截止至{{ deadLine }}
          </span>
        </div>
        <div class="item">
          <span class="label">累计折旧</span>
          <span class="value">
            {{ calcData.depreciationTotal }}
          </span>
        </div>
        <div class="item">
          <span class="label">资产净值</span>
          <span class="value">
            {{ calcData.surplusValueTotal }}
          </span>
        </div>
      </div>
    </div>
    <!-- 计算部分结束 -->
    <!-- 表格部分 -->
    <asset-table
      :data="tableData"
      @delRow="delRow"
      :flag="tab"
      ref="table"
    />
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
import {
  queryAssetList,
  getTotal,
  updateAssets
} from '@/api/assetManagement/companyAssets'
import { treeselect, queryChildDepts } from "@/api/system/dept"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import MyTabs from '@/components/MyTabs'
import { tabOptions } from './options'
import AssetTable from './AssetTable'
import moment from 'moment'

export default {
  components: {
    Treeselect,
    MyTabs,
    AssetTable
  },
  data() {
    return {
      isExpand: false,
      span: 6,
      style: {width: '100%'},
      asset: [],
      dept: [],
      formData: {
        assetTypeId: []
      },
      tabOptions,
      tab: 0,
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      paramData: {},
      calcData: {},
    }
  },
  created() {
    // tab回显
    const { tab } = this.$route.params
    this.tab = tab ? tab - 0 : 0
  },
  computed: {
    deadLine() {
      if (this.paramData.endDate) {
        return moment(this.paramData.endDate, 'YYYY-MM').format('YYYY年M月')
      } else {
        return moment().format('YYYY年M月')
      }
    }
  },
  mounted() {
    this.getAsset()
    this.getDept()
    this.getTableData()
    this.calc()
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
      /*treeselect().then(res => {
        this.dept = res.data
      })*/
      let params = {
        deptId:  this.$store.state.user.user.deptId
      }
      queryChildDepts(params).then(res => {
        this.dept = res.data
      })
    },

    normalizer(node) {
      //当子节点也就是children=[]时候去掉子节点
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      };
    },

    // 表格数据
    getTableData() {
      this.$refs.table.startLoading()
      // 传参数据的一些处理
      let data = {
        ...this.formData
      }
      if (data.purchasingDate) {
        data.purchasingDateStart = data.purchasingDate[0]
        data.purchasingDateEnd = data.purchasingDate[1]
        delete data.purchasingDate
      }
      const assetTypeId = data.assetTypeId
      switch (assetTypeId.length) {
        case 0:
          delete data.assetTypeId
          break
        case 1:
          data.oneTypeId = assetTypeId[0]
          delete data.assetTypeId
          break
        case 2:
          data.twoTypeId = assetTypeId[1]
          delete data.assetTypeId
          break
        case 3:
          data.assetTypeId = assetTypeId[2]
          break
      }
      if (data.depreciation) {
        data.startDate = data.depreciation[0]
        data.endDate = data.depreciation[1]
        delete data.depreciation
      }
      const tabData = tabOptions.find(v => {
        return this.tab == v.name
      })
      if (tabData.type == 'status') {
        data.status = tabData.value
      } else if (tabData.type == 'specialStatus') {
        data.specialStatus = tabData.value
      }
      this.paramData = data
      queryAssetList(this.paramData, this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total
        this.$refs.table.endLoading()
      }).catch(() => {
        this.$refs.table.endLoading()
      })
    },
    // 计算
    calc() {
      getTotal(this.paramData).then(res => {
        this.calcData = res.data
      })
    },
    // 点击查询
    query() {
      this.queryParams.pageNum = 1
      this.getTableData()
      this.calc()
    },
    // 重置表单
    reset() {
      this.queryParams.pageNum = 1
      this.$refs.elForm.resetFields()
      this.getTableData()
      this.calc()
    },
    // 删除
    delRow(row) {
      const data = {
        ...row,
        status: 0
      }
      updateAssets(data).then(res => {
        this.$message.success(res.msg)
        this.getTableData()
        this.calc()
      })
    },
    // tab切换
    change() {
      this.queryParams.pageNum = 1
      this.getTableData()
      this.calc()
    },
    // 分页
    getList() {
      this.getTableData()
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
    .form {
      height: 0;
      overflow: hidden;
      transition: all .4s;
    }
    .expand {
      height: auto;
      overflow: visible;
    }
  }
  .tabs {
    padding: 10px;
  }
  .calc {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .item {
      margin-right: 50px;
      &:last-child {
        margin-right: 0;
      }
      .label {
        color: #A8B5C1;
      }
      .value {
        margin-left: 5px;
      }
    }
    .specific {
      display: flex;
    }
  }
}
.el-row {
  display:flex;
  flex-wrap: wrap;
}
.pagination-container {
  background: transparent;
}
</style>
