<template>
  <div class="wrap">
    <header>
      <div 
        class="left" 
        @click="$router.go(-1)"
      >
        <i class="el-icon-arrow-left"></i>
        <span>快速填充模板编辑</span>
      </div>
      <div class="btns">
        <el-button type="primary" size="small" @click="save">
          保存
        </el-button>
        <el-button size="small" @click="$router.go(-1)">
          取消
        </el-button>
      </div>
    </header>
    <main>
      <el-form 
        :model="formData"
        :rules="rules"
        ref="elForm" 
        label-width="120px"
      >
        <el-row>
          <el-col :span="span">
            <el-form-item label="模板名称:" prop="templateName">
              <el-input v-model.trim="formData.templateName" :style="style" />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="资产类型:" prop="assetTypeId">
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
        </el-row>
        <div class="section">
          <div class="heading">
            <span class="bar"></span>
            <b>基础信息</b>
          </div>
          <el-row>
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
                <el-input v-model.trim="formData.maintenanceTime" :style="style" />
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
        </div>
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
import { treeselect } from "@/api/system/dept"
import { 
  searchDetail, 
  queryAsset,
  updateOrDelete
} from '@/api/assetManagement/quickAssetDetail'
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import recursion from '@/utils/recursion'
import { detailInformation } from './option'

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
      dept: [],
      formData: {
        assetTypeId: []
      },
      formItems: [],
      rules: {
        templateName: [
          { required: true, trigger: 'blur', message: '请输入模板名称' }
        ],
        assetTypeId: [
          { required: true, trigger: 'blur', message: '请选择资产类型' }
        ],
        model: [
          { required: true, trigger: 'blur', message: '请输入型号' }
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
      }
    }
  },
  mounted() {
    this.getDept()
    this.getAsset()
  },
  watch: {
    'formData.assetTypeId': {
      deep: true,
      // 动态渲染详细信息的表单
      handler(value) {
        if (!value.length) {
          this.formItems = []
          return
        }
        this.$nextTick(() => {
          let formItems = []
          const { assetTemplate } = this.$refs.assetCas.getCheckedNodes()[0].data
          detailInformation.forEach(item => {
            for (let i in assetTemplate) {
              if (item.status === i) {
                if (assetTemplate[i] === 1) {
                  formItems.push(item)
                }
              }
            }
          })
          this.formItems = formItems
        })
      }
    }
  },
  methods: {
    // 部门查询
    getDept() {
      treeselect().then(res => {
        this.dept = res.data
      })
    },
    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
        // 填充表单
        searchDetail(this.id).then(resp => {
          let formData = resp.data
          // 为了el-cascader的回显而反推完整的id数组
          formData.assetTypeId = recursion(this.asset, formData.assetTypeId)
          this.formData = this.deepClone(formData)
        })
      })
    },
    // 提交表单
    save() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return
        }
        // 传参格式的一些处理
        let data = this.deepClone(this.formData)
        delete data.assetTypeName
        const assetTypeId = data.assetTypeId
        data.assetTypeId = assetTypeId[assetTypeId.length - 1]
        if (this.formData.departmentId) {
          data.departmentName = this.$refs.deptTree.getNode(this.formData.departmentId).label
        } else {
          data.departmentName = null
        }
        updateOrDelete(data).then(res => {
          this.$message.success(res.msg)
          this.$router.go(-1)
        })
      })
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
</style>
