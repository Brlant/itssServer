<template>
  <div class="wrap">
    <header>
      <div 
        class="left" 
        @click="$router.push('/assetManagement/companyAssets')"
      >
        <i class="el-icon-arrow-left"></i>
        <span>编辑资产</span>
      </div>
      <div class="btns">
        <el-button type="primary" size="small" @click="save">
          保存
        </el-button>
        <el-button size="small" @click="$router.push('/assetManagement/companyAssets')">
          取消
        </el-button>
      </div>
    </header>
    <!-- 表单部分 -->
    <main>
      <el-form
        :model="formData"
        :rules="rules"
        ref="elForm"
        label-width="120px"
      >
        <div class="section">
          <div class="heading">
            <span class="bar"></span>
            <b>基础信息</b>
          </div>
          <el-row>
            <el-col :span="span">
              <el-form-item label="资产编号:" prop="assetId">
                <el-input v-model.trim="formData.assetId" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="财务编号:" prop="financialNo">
                <el-input v-model.trim="formData.financialNo" :style="style" />
              </el-form-item>
            </el-col>
              <el-col :span="span">
              <el-form-item label="资产名称:" prop="assetName">
                <el-input v-model.trim="formData.assetName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="品牌:" prop="brand">
                <el-input v-model.trim="formData.brand" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="型号:" prop="model">
                <el-input v-model.trim="formData.model" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="保修期:" prop="maintenanceTime">
                <el-date-picker
                  v-model="formData.maintenanceTime"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择"
                  :style="style"
                />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="购入时间:" prop="purchasingDate">
                <el-date-picker
                  v-model="formData.purchasingDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择"
                  :style="style"
                />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="税后价格:" prop="afterTaxPrice">
                <el-input v-model.trim="formData.afterTaxPrice" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="数量:" prop="amount">
                <el-input v-model.trim="formData.amount" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="存放地点:" prop="storageAddress">
                <el-input v-model.trim="formData.storageAddress" :style="style" />
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
              <el-form-item label="保管员:" prop="keeper">
                <el-input v-model.trim="formData.keeper" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="备注:" prop="remark">
                <el-input v-model="formData.remark" type="textarea" :style="style" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="section">
            <div class="heading">
              <span class="bar"></span>
              <b>折旧信息</b>
            </div>
            <el-row>
              <el-col :span="span">
                <el-form-item label="折旧年限:" prop="depreciableLife">
                  <el-input v-model.trim="formData.depreciableLife" :style="style">
                    <span slot="suffix">年</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="section">
          <div class="heading">
            <span class="bar"></span>
            <b>详细信息</b>
          </div>
          <el-row>
            <!-- 动态渲染表单 -->
            <el-col
              v-for="(item, index) in formItems"
              :key="index"
              :span="span"
            >
              <el-form-item :label="item.label" :prop="item.name">
                <el-input 
                  v-model.trim="formData[item.name]"
                  :style="style"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </main>
  </div>
</template>

<script>
import { assetDetail } from '@/api/assetManagement/companyAssets'
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
import { queryAll } from '@/api/assetManagement/quickAssetDetail'
import { treeselect } from "@/api/system/dept"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"

export default {
  components: {
    Treeselect
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      if (!value) {
        callback()
        return
      }
      if (String(Number(value)) === 'NaN') {
        callback(new Error('输入内容不合规'))
      } else {
        if (value < 0) {
          callback(new Error('输入内容不合规'))
        } else {
          callback()
        }
      }
    }
    return {
      id: this.$route.query.id,
      span: 6,
      style: {width: '100%'},
      asset: [],
      template: [],
      dept: [],
      formData: {
        assetTypeId: []
      },
      rules: {
        assetTypeId: [
          { required: true, trigger: 'blur', message: '请选择资产类型' }
        ],
        assetId: [
          { required: true, trigger: 'blur', message: '请输入资产编号' }
        ],
        assetName: [
          { required: true, trigger: 'blur', message: '请输入资产名称' }
        ],
        afterTaxPrice: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        amount: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        depreciableLife: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        preTaxPrice: [
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      formItems: []
    }
  },
  mounted() {
    // this.getDetail()
    this.getAsset()
    this.getTemplate()
    this.getDept()
  },
  methods: {
    getDetail() {
      assetDetail(this.id).then(res => {

      })
    },
    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
      })
    },
    // 模板查询
    getTemplate() {
      queryAll().then(res => {
        this.template = res.rows
      })
    },
    // 部门查询
    getDept() {
      treeselect().then(res => {
        this.dept = res.data
      })
    },
    // 保存表单
    save() {

    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  header {
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }
  main {
    background: #fff;
    padding: 10px;
    .heading {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .bar {
        width: 4px;
        height: 15px;
        background: #333;
        margin-right: 8px;
      }
      b {
        font-size: 15px;
      }
    }
  }
}
.el-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
