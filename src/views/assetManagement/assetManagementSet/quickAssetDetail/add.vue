<template>
  <div class="wrap">
    <header>
      <div
        class="left"
        @click="$router.push('/assetManagement/assetManagementSet/quickAssetDetailIndex')"
      >
        <i class="el-icon-arrow-left"></i>
        <span>新增快速填充模板</span>
      </div>
      <div class="btns">
        <el-button type="primary" size="small" @click="save">
          保存
        </el-button>
        <el-button size="small" @click="cancel">
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
                @change="change"
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
                <el-input
                  :disabled="manageType === 2"
                  v-model.number="formData.amount"
                  :style="style"
                />
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
                  :normalizer="normalizer"
                  ref="deptTree"
                  :show-count="true"
                  placeholder="请选择"
                />
              </el-form-item>
            </el-col>
<!--            <el-col :span="span">
              <el-form-item label="保管员:" prop="keeper">
                <el-input v-model.trim="formData.keeper" :style="style" />
              </el-form-item>
            </el-col>-->
            <el-col :span="span">
              <el-form-item label="持有人:" prop="holderName">
                <el-input v-model.trim="formData.holderName" :style="style" />
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
import { treeselect, queryChildDepts } from "@/api/system/dept"
import {
  queryAsset,
  createInfo
} from '@/api/assetManagement/quickAssetDetail'
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import { detailInformation } from './option'
import findItemById from '@/utils/findItemById'

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
        if (value <= 0) {
          callback(new Error('输入内容不合规'))
        } else {
          callback()
        }
      }
    }
    const checkAmount = (rule, value, callback) => {
      if (String(value) === 'NaN') {
        callback(new Error('输入内容不合规'))
      } else {
        if (value <= 0) {
          callback(new Error('输入内容不合规'))
        } else {
          callback()
        }
      }
    }
    return {
      manageType: '',
      span: 6,
      style: {width: '100%'},
      asset: [],
      dept: [],
      formData: {
        assetTypeId: [],
        amount: 1
      },
      formItems: [],
      rules: {
        assetId: [
          { required: true, trigger: 'blur', message: '请输入资产编号' }
        ],
        templateName: [
          { required: true, trigger: 'blur', message: '请输入模板名称' }
        ],
        assetTypeId: [
          { required: true, trigger: 'blur', message: '请选择资产类型' }
        ],
        afterTaxPrice: [
          { validator: checkNumber, trigger: 'blur' }
        ],
        amount: [
          { required: true, trigger: 'blur', message: '请输入数量' },
          { validator: checkAmount, trigger: 'blur' }
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

    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
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
        createInfo(data).then(res => {
          this.$message.success(res.msg)
          this.$router.push('/assetManagement/assetManagementSet/quickAssetDetailIndex')
        })
      })
    },
    // 选择资产类型
    change() {
      const idArr = this.formData.assetTypeId
      const { manageType } = findItemById(idArr[idArr.length - 1], this.asset)
      if (manageType === 2) {
        this.formData.amount = 1
      }
      this.manageType = manageType
    },
    // 取消
    cancel() {
      this.$confirm('确定返回列表页？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        const obj = { path: "/assetManagement/assetManagementSet/quickAssetDetailIndex" };
        this.$tab.closeOpenPage(obj);
      }).catch(() => {})
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
    .left {
      cursor: pointer;
    }
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
