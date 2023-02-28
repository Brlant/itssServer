<template>
  <el-dialog
    title="发起盘点"
    :visible.sync="dialogVisible"
    center
    width="30%"
    destroy-on-close
  >
    <!-- 表单开始 -->
    <el-form
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="涉及资产类型">
        <asset-select />
      </el-form-item>
      <el-form-item label="涉及资产状态">

      </el-form-item>
    </el-form>
    <!-- 表单结束 -->
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :disabled="submitLoading"
        @click="submit"
      >
        确定
      </el-button>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import AssetSelect from '@/components/AssetSelect'

export default {
  componnts: {
    AssetSelect
  },
  data() {
    return {
      dialogVisible: false,
      formData: {

      },
      rules: {

      },
      submitLoading: false

    }
  },
  methods: {
    // 提交表单
    submit() {

    },
    open() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
