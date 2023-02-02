<template>
  <el-dialog
    title="完成维修"
    :visible.sync="dialogVisible"
    center
    width="30%"
    destroy-on-close
  >
    <!-- 表单开始 -->
    <el-form
      :model="formData"
      :rules="rules"
      ref="elForm"
      label-width="80px"
    >
      <el-row>
        <el-col :span="span / 2">
          <el-form-item label="维修时间" prop="maintenanceDate">
            <el-date-picker
              v-model="formData.maintenanceDate"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              type="date"
              :style="style"
            />
          </el-form-item>
        </el-col>
        <el-col :span="span / 2">
          <el-form-item label="维修金额" prop="maintenancePrice">
            <el-input 
              v-model.trim="formData.maintenancePrice" 
              :style="style" 
            />
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label-width="0" prop="maintenanceInfo">
            <div class="label">
              维修内容
            </div>
            <el-input
              type="textarea"
              v-model="formData.maintenanceInfo"
              :style="style"
            />
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label-width="0" prop="feedback">
            <div class="label">
              维修反馈
            </div>
            <el-input
              type="textarea"
              v-model="formData.feedback"
              :style="style"
            />
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label-width="0">
            <div class="label">
              附件上传
            </div>
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
        </el-col>
        <el-col :span="span">
          <el-form-item label-width="0" prop="comment">
            <div class="label">
              备注
            </div>
            <el-input
              type="textarea"
              v-model="formData.comment"
              :style="style"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表单结束 -->
    <div slot="footer" class="dialog-footer">
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
import { fileUpload } from '@/api/assetManagement/companyAssets'
import { agreeQuery, uploadSuccess } from "@/api/assetManagement/assetProcess"
import { param } from '../../../../utils'

export default {
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
      dialogVisible: false,
      span: 24,
      style: {width: '100%'},
      fileList: [],
      formData: {
        maintenanceDate: '',
        maintenancePrice: '',
        maintenanceInfo: '',
        feedback: '',
        comment: ''
      },
      rules: {
        maintenancePrice: [
          { validator: checkNumber, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible(value) {
      if (value === false) {
        // 关闭时清空表单
        this.$refs.elForm.resetFields()
        this.fileList = []
      }
    }
  },
  methods: {
    submit() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return
        }
        if (this.fileList.length) {
          this.uploadAttachment()
        }
        this.onConfirm()
      })
    },
    // 提交表单
    onConfirm() {
      const params = {
        processInstanceId: this.$route.query.processInstanceId,
        taskId: this.$route.query.taskId,
        userKey: this.$store.state.user.user.userId,
        comment: this.formData.comment,
        procVars: {
          attribute: 'maintenance',
          comment: this.formData.comment,
          CUSTOM_VAR: JSON.stringify([{
            maintenanceDate: this.formData.maintenanceDate,
            maintenancePrice: this.formData.maintenancePrice,
            maintenanceInfo: this.formData.maintenanceInfo,
            feedback: this.formData.feedback
          }])
        }
      }
      agreeQuery(params).then(res => {
        this.$message.success(res.msg)
        const obj = {
          path: "/assetManagement/assetProcess",
          query: {
            tab:this.$route.query.tab
          }
        };
        this.$tab.closeOpenPage(obj);
        this.getTableData()
      }).catch(() => {
        this.dialogVisible = false
      })
    },
    // 提交文件
    uploadAttachment() {
      const params = {
        processInstanceId: this.$route.query.processInstanceId,
        taskId: this.$route.query.taskId,
        attachments: this.fileList.map(item => {
          return {
            name: item.name,
            url: item.url,
            userId: this.$store.state.user.user.userId
          }
        })
      }
      uploadSuccess(params)
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
.label {
  color: #606266; 
  font-weight: 700;
  text-indent: 10px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
::v-deep .el-upload {
  width: 100%;
}
</style>
