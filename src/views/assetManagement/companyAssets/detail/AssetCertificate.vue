<template>
  <div class="certificate">
    <el-timeline v-if="list.length">
      <el-timeline-item
        v-for="(item, index) in list"
        :key="index"
        :timestamp="item.createTime"
        placement="top"
      >
        <p class="row1">
          {{ item.creatorName }}提交证书记录，
        </p>
        <p class="row2">
          起效日期：{{ item.startTime }}，失效日期：{{ item.endTime }}
        </p>
        <p class="row3">
          附件：
          <span class="link" @click="downFlowLoad(item.certificateUrl)">
            {{ item.certificateName }}
          </span>
        </p>
      </el-timeline-item>
    </el-timeline>
    <div v-else style="font-size: 14px">
      暂无证书记录
    </div>
    <div class="btn">
      <el-button type="text" @click="dialogVisible = true">
        提交证书记录
      </el-button>
    </div>
    <!-- 提交证书弹窗 -->
    <el-dialog
      title="提交证书记录"
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
          label-width="120px"
        >
          <el-form-item label="证书文件" prop="url">
            <el-upload
              action
              :on-change="onChange"
              :before-remove="remove"
              :limit="1"
              accept=".jpg, .png, .pdf"
              :auto-upload="false"
            >
              <el-button type="info">
                上传附件
              </el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="证书生效时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              type="date"
            />
          </el-form-item>
          <el-form-item label="证书失效时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              type="date"
            />
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

    <!--  预览附件弹框  -->
    <el-dialog
      :visible.sync="attachmentDialog"
      class="attachment"
      fullscreen
    >
      <div>
        <iframe :src="attachmentUrl" frameborder="0" width="100%" height="100%"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  certificateList,
  fileUpload,
  addCertificate
} from '@/api/assetManagement/companyAssets'
import moment from 'moment'
import downFile from '@/utils/downFile'

export default {
  data() {
    // 上传校验
    const check = (rule, value, callback) => {
      if (!this.url) {
        callback(new Error('请上传证书文件'))
      } else {
        callback()
      }
    }
    return {
      id: this.$route.query.id - 0,
      list: [],
      dialogVisible: false,
      url: '',
      name: '',
      formData: {
        startTime: '',
        endTime: ''
      },
      rules: {
        url: [
          { required: true, trigger:'blur', validator: check }
        ],
        startTime: [
          { required: true, trigger: 'blur', message: '请选择证书生效时间' }
        ],
        endTime: [
          { required: true, trigger: 'blur', message: '请选择证书失效时间' }
        ]
      },
      submitLoading: false,

      attachmentDialog: false, // 预览附件
      attachmentUrl: '', // 附件地址
    }
  },
  created() {
    this.getCertificateList()
  },
  watch: {
    dialogVisible(value) {
      if (value === false) {
        // 关闭时清空表单
        this.$refs.elForm.resetFields()
        this.url = ''
        this.name = ''
      }
    }
  },
  methods: {
    // 证书记录
    getCertificateList() {
      const data = {
        assetId: this.id
      }
      certificateList(data).then(res => {
        this.list = res.data
      })
    },
    // 上传文件
    onChange(file) {
      let formData = new FormData()
      formData.append('file', file.raw)
      fileUpload(formData).then(res => {
        this.url = res.data.url
        this.name = res.data.name
      })
    },
    remove() {
      this.url = ''
      this.name = ''
    },
    // 提交
    submit() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return
        }
        const startStamp = moment(this.formData.startTime, 'YYYY-MM-DD').valueOf()
        const endStamp = moment(this.formData.endTime, 'YYYY-MM-DD').valueOf()
        if (startStamp > endStamp) {
          this.$message.warning('失效时间不能早于生效时间')
          return
        }
        const data = {
          assetId: this.id,
          certificateName: this.name,
          certificateUrl: this.url,
          startTime: this.formData.startTime,
          endTime: this.formData.endTime
        }
        this.submitLoading = true
        addCertificate(data).then(res => {
          this.submitLoading = false
          this.dialogVisible = false
          this.$message.success(res.msg)
          this.getCertificateList()
        }).catch(()=>{
          this.submitLoading = false
        })
      })
    },
    // 查看文件
    downFlowLoad(url) {
      if (url) {
        let lowerCase = url.toLowerCase()
        if (lowerCase.includes('.jpg') || lowerCase.includes('.png') || lowerCase.includes('.pdf')) {
          // this.attachmentUrl = url;
          // this.attachmentUrl = this.convertUrl(url)
          const substringUrl = url.substring(url.indexOf('/itss') + 1, url.length)
          this.attachmentUrl = process.env.BASE_URL + substringUrl
          this.attachmentDialog = true;
        }
      } else {
        downFile(url)
      }
    },

    convertUrl(path){
      let reg = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
      path = path.replace(reg, "https://$2$3$4$5$6");
      return path
    },
  }
}
</script>

<style lang="scss" scoped>
.certificate {
  position: relative;
  .link {
    cursor: pointer;
    color: #037dff;
    text-decoration: underline;
  }
  .btn {
    position: absolute;
    right: 0;
    top: 0;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

::v-deep .attachment {
  .el-dialog.is-fullscreen {
    .el-dialog__header {
      padding-bottom: 0;

      .el-dialog__headerbtn {
        top: 12px;
      }
    }

    .el-dialog__body {
      div {
        height: calc(100vh - 120px);
      }
    }
  }
}
</style>
