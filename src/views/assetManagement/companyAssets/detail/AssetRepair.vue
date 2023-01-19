<template>
  <el-dialog
    title="资产维修"
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
    >
      <!-- 表单开始 -->
      <el-form-item label="请输入资产数量" prop="amount">
        <div style="width:100%; display:flex; justify-content:flex-end">
          <el-input-number 
            v-model="formData.amount" 
            :min="1"
            :disabled="$route.query.manageType == 2"
          />
        </div>
      </el-form-item>
      <el-form-item label-width="0">
        <el-upload
          action
          :on-change="onChange"
          :on-remove="onRemove"
          :file-list="fileList"
          accept=".jpg, .png, .pdf"
          :auto-upload="false"
        >
          <el-button type="info" :style="style">
            上传附件
          </el-button>
        </el-upload>
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
      <el-button type="text">
        <span style="text-decoration: underline">
          审批流程查看
        </span>
      </el-button>
    </el-form>
    <!-- 表单结束 -->
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
  fileUpload,
  repair
} from '@/api/assetManagement/companyAssets'

export default {
  props: ['info'],
  data() {
    return {
      dialogVisible: false,
      style: {width: '100%'},
      fileList: [],
      formData: {
        amount: 1,
        remark: ''
      },
      rules: {
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
        const data = {
          ...this.formData,
          asset: {
            id: this.info.id,
            assetId: this.info.assetId,
            assetName: this.info.assetName,
            assetTypeId: this.info.assetTypeId
          },
          attachmentList: this.fileList.map(item => {
            return {
              name: item.name,
              url: item.url
            }
          })
        }
        repair(data).then(res => {
          this.dialogVisible = false
          this.$message.success(res.msg)
        })
      })
    },
    // 上传文件
    onChange(file, fileList) {
      let formData = new FormData()
      formData.append('file', file.raw)
      fileUpload(formData).then(res => {
        // 文件列表格式处理
        let fileArr = this.deepClone(fileList)
        const index = fileArr.findIndex(item => {
          return item.uid == file.uid
        })
        fileArr[index].status = 'success'
        fileArr[index].name = res.data.name
        fileArr[index].url = res.data.url
        this.fileList = fileArr
      })
    },
    onRemove(file, fileList) {
      this.fileList = fileList
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
