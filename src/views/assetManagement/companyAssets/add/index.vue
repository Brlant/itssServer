<template>
  <div class="wrap">
    <header>
      <div
        class="left"
        @click="$router.push('/assetManagement/companyAssets')"
      >
        <i class="el-icon-arrow-left"></i>
        <span>录入资产</span>
      </div>
      <div class="btns">
        <el-button
          type="primary"
          size="small"
          :disabled="saveLoading"
          @click="save">
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
            <el-form-item label="资产类型:" prop="assetTypeId">
              <el-cascader
                v-model="formData.assetTypeId"
                @change="handleChange"
                :options="asset"
                ref="assetCas"
                :props="{ label: 'typeName', value: 'id' }"
                clearable
                :style="style"
              />
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="填充模板:" prop="templateId">
              <el-select
                v-model="formData.templateId"
                :disabled="!formData.assetTypeId.length"
                @change="change"
                :style="style"
                clearable
              >
                <el-option
                  v-for="(item, index) in template"
                  :key="index"
                  :label="item.templateName"
                  :value="item.id"
                />
              </el-select>
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
              <el-form-item label="资产原值:" prop="afterTaxPrice">
                <el-input v-model.trim="formData.afterTaxPrice" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="数量:" prop="amount">
                <el-input
                  v-model.number="formData.amount"
                  :disabled="manageType === 2"
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
<!--            <el-col :span="span">
              <el-form-item label="持有人:" prop="holderName">
                <el-input v-model.trim="formData.holderName" :style="style" />
              </el-form-item>
            </el-col>-->
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
                <el-input v-model.trim="formData.depreciableLife" @input="formData.depreciableLife=formData.depreciableLife.replace(/^(0+)|[^\d]+/g,'')"  :style="style">
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
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
import { queryAll } from '@/api/assetManagement/quickAssetDetail'
import { treeselect, queryChildDepts } from "@/api/system/dept"
import { addAssets, queryAssetId } from '@/api/assetManagement/companyAssets'
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import { detailInformation, information } from '../options'
import recursion from '@/utils/recursion'
import matchData from '@/utils/matchData'
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
        if (value < 0) {
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
      span: 6,
      style: {width: '100%'},
      manageType: '',
      asset: [],
      template: [],
      dept: [],
      formData: {
        assetTypeId: [],
        assetId: null,
        amount: 1
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
          { required: true, trigger: 'blur', message: '请输入资产原值' },
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
      },
      formItems: [],
      saveLoading: false,
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
        let arr = res.data
        arr.forEach((m) => {
          if ((m.children ?? '')!=='') {
            m.children.forEach((item) => {
              if ((item.children ?? '')=='') {
                item.disabled = true
              }
            });
          }else if ((m.children ?? '')=='') {
            m.disabled = true
          }
        });
        this.asset = arr
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

    // 查询填充模板
    getTemplate(assetTypeId) {
      queryAll({ assetTypeId }).then(res => {
        let rows = this.deepClone(res.rows)
        rows.forEach(item => {
          item.templateId = item.id
          item.assetTypeId = recursion(this.asset, item.assetTypeId)
        })
        this.template = rows
      })
    },

    // 查询资产编号
    getAssetId(assetTypeId) {
      queryAssetId(assetTypeId).then(res => {
        if (res) {
          this.formData.assetId = res.data
        } else {
          this.formData.assetId = null
        }
        this.$forceUpdate()
      })
    },
    handleChange(value) {
      if (this.formData.templateId) {
        this.formData = {
          assetTypeId: value,
          assetId: null
        }
      }
      if (!value.length) {
        this.formData.assetId = null
        this.formItems = []
        this.$forceUpdate()
        return
      }
      // a - 控制数量
      const { manageType } = findItemById(value[value.length - 1], this.asset)
      if (manageType === 2) {
        this.formData.amount = 1
      }
      this.manageType = manageType
      // b - 动态渲染详细信息的表单
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
      // c - 控制填充模板
      const assetTypeId = value[value.length - 1]
      this.getTemplate(assetTypeId)
      // d - 获取资产编号
      this.getAssetId(assetTypeId)
    },

    // 填充表单
    change(value) {
      const {
        assetTypeId,
        assetId,
        financialNo,
        assetName
      } = this.formData
      if (value) {
        const template = this.template.find(item => {
          return item.id === value
        })
        let formData = this.deepClone(template)
        formData.assetId = assetId
        formData.financialNo = financialNo
        formData.assetName = assetName
        this.formData = formData
      } else {
        this.formData = {
          assetTypeId,
          assetId,
          financialNo,
          assetName
        }
      }
    },

    // 保存表单
    save() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return
        }
        // 传参格式的一些处理
        let data = matchData(this.formData, [...information, ...this.formItems])
        const assetTypeId = data.assetTypeId
        data.assetTypeId = assetTypeId[assetTypeId.length - 1]
        if (data.departmentId) {
          data.departmentName = this.$refs.deptTree.getNode(data.departmentId).label
        } else {
          data.departmentName = null
        }
        this.saveLoading = true
        addAssets(data).then(res => {
          this.saveLoading = false
          this.$message.success(res.msg)
          this.$router.push({
            name: 'companyAssets',
            params: {
              tab: 10
            }
          })
        }).catch(()=>{
          this.saveLoading = false
        })
      })
    },

    // 取消
    cancel() {
      this.$confirm('确定返回列表页？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        const obj = { path: "/assetManagement/companyAssets" };
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

.el-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
<style lang="scss" scoped>
.test{
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
.item {
  padding: 5px 0;
  border-bottom: 1px solid #dfe6ec;
  &:last-child {
    border-bottom: 0;
  }
}
.pagination-container {
  background: transparent;
}
}

</style>
