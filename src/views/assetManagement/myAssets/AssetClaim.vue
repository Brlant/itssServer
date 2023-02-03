<template>
  <el-dialog
    title="资产申领"
    :visible.sync="dialogVisible"
    center
    width="30%"
    destroy-on-close
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="elForm"
      label-width="120px"
      v-show="isShow"
    >
      <!-- 表单开始 -->
      <el-form-item label="请选择资产类型" prop="assetTypeId">
        <el-cascader
          v-model="formData.assetTypeId"
          :options="asset"
          @change="change"
          ref="assetCas"
          :props="{ label: 'typeName', value: 'id' }"
          clearable
          :style="style"
        />
      </el-form-item>
      <el-form-item label="请输入资产数量" prop="amount">
        <div style="width:100%; display:flex; justify-content:flex-end">
          <el-input-number 
            v-model="formData.amount" 
            :min="1"
            :step="1"
            :disabled="manageType === 2"
            step-strictly
          />
        </div>
      </el-form-item>
      <el-form-item label-width="0" prop="remark">
        <div style="color:#606266; font-weight:700">
          备注
        </div>
        <el-input
          type="textarea"
          v-model="formData.remark"
          :style="style"
        />
      </el-form-item>
      <el-button type="text" @click="viewFlow">
        <span style="text-decoration: underline">
          审批流程查看
        </span>
      </el-button>
    </el-form>
    <!-- 表单结束 -->
    <!-- 流程开始 -->
    <div 
      style="cursor:pointer" 
      v-show="!isShow"
    >
      <span @click="isShow = true">
        <i class="el-icon-arrow-left"></i>
        返回
      </span>
      <div class="flow-wrap">
        <factory-draw-flow
          :FlowConfig="list"
          modelType="see"
          ref="flow"
        />
      </div>
    </div>
    <!-- 流程结束 -->
    <div slot="footer" style="display:flex; justify-content:flex-end; align-items:center">
      <el-button type="primary" @click="submit">
        确定
      </el-button>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { 
  claim,
  getFlow
} from '@/api/assetManagement/companyAssets'
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue"
import findItemById from '@/utils/findItemById'

export default {
  props: ['asset'],
  components: {
    FactoryDrawFlow
  },
  data() {
    return {
      manageType: '',
      isShow: true,
      list: [],
      dialogVisible: false,
      style: {width: '100%'},
      formData: {
        assetTypeId: [],
        amount: 1,
        remark: ''
      },
      rules: {
        assetTypeId: [
          { required: true, trigger: 'blur', message: '请选择资产类型' }
        ],
        amount: [
          { required: true, trigger: 'blur', message: '请输入资产数量' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(value) {
      if (value === false) {
        // 关闭时清空表单
        this.$refs.elForm.resetFields()
        this.isShow = true
      }
    }
  },
  methods: {
    // 提交表单
    submit() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return
        }
        const { assetTypeId } = this.formData
        const data = {
          assetTypeId: assetTypeId[assetTypeId.length - 1],
          amount: this.formData.amount,
          remark: this.formData.remark,
          deptId: JSON.parse(window.localStorage.getItem("user")).deptId,
          revoke: "true",
        }
        claim(data).then(res => {
          this.dialogVisible = false
          this.$message.success(res.msg)
          this.$emit('success')
        }).catch(() => {
          this.dialogVisible = false
        })
      })
    },
    // 选择资产，控制数量
    change(value) {
      console.log('ccc',value)
      this.manageType = findItemById(value[value.length - 1], this.asset).manageType
      if (this.manageType === 2) {
        this.formData.amount = 1
      }
    },
    // 查看流程
    viewFlow() {
      this.$refs.elForm.validateField('assetTypeId', error => {
        if (error) {
          return
        }
        this.isShow = false
        const { assetTypeId } = this.formData
        const params = {
          assetTypeIds: assetTypeId[assetTypeId.length - 1],
          categoryId: 2,
          deptId: this.$store.state.user.user.deptId
        }
        getFlow(params).then(res => {
          this.list = JSON.parse(res.data.json).list
        })
      })
    },
    open() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
  width: 100%;
}
</style>
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
</style>
