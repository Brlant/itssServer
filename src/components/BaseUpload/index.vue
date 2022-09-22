<template>
  <!-- <div v-if="isShow"> -->
  <el-dialog class="upload" :title="title" :close-on-click-modal="false" :visible.sync="isShow" width="600px"
             @closed="handleClosed"
  >
    <el-row style="text-align: center; margin-bottom: 20px; display:flex;justify-content: center;">
      <el-col :span="12" style="border-right:solid 1px rgba(230, 233, 240, 1);" v-if="isTemplate">
        <p>1. 下载模板，填写信息</p>
        <i class="el-icon-document"></i>
        <el-button type="primary" @click="downloadTemplate"><i class="el-icon-download"></i>下载模板</el-button>
      </el-col>
      <el-col :span="12" style="position: relative;">
        <p v-if="isTemplate">2. 上传填写好的文件</p>
        <p v-else>上传填写好的文件</p>
        <i  class="el-icon-document" :class="{ active : isSuccess }">
           <span>{{fileName}}</span>
        </i>
        <div v-if="fileList.length">
          <p class="uploadSuccessTxt" v-if="isSuccess"><i class="el-icon-success"></i> 上传成功!</p>
          <p class="uploadErrorTxt" v-if="isError"><i class="el-icon-error"></i> {{ messageTxt }}</p>
        </div>
        <el-upload ref="batchUpload"
                   :show-file-list="true"
                   :auto-upload="false"
                   :on-remove="fileOnRemoveFn"
                   :on-change="fileOnChangeFn"
                   :on-error="fileOnErrorFn"
                   :file-list="fileList"
                   :limit="1"
                   name="file"
                   accept=".xlsx"
                   :multiple="false"
                   action="/"
                   :http-request="handleUploadFile"
        >
          <el-button v-if="!fileList.length" type="primary" @click="resetUploadFileFn"><i class="el-icon-upload2"></i>上传文件
          </el-button>
          <!-- <el-button v-else type="primary" plain>重新选择</el-button> -->
        </el-upload>
        <div class="txtAlignC" v-if="fileList.length">
          <el-button class="fileImprBtn" :disabled="isSuccess || isError" type="primary" size="mini" @click="fileImpr">
            导入
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
  <!-- </div> -->
</template>

<script>
import { getToken } from '@/utils/auth'
import { baseUploadImport } from '../../api/order/import'

export default {
  name: 'base-upload',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {     // 弹框标题
      type: String,
      default: '批量导入'
    },
    isTemplate: {   // 是否需要下载模板显示
      type: Boolean,
      default: true
    },
    fileData: {  // 上传时携带的数据
      type: Object,
      default: function () {
        return {}
      }
    },
    templateUrl: {   // 下载模板的url
      type: String,
      default: ''
    },
    uploadUrl: { // 上传文件的url
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileName: null,
      uploadReady: false,
      uploadText: '上传文件',

      messageTxt: '',
      isError: false,
      isSuccess: false,
      fileList: [],
      permissionAction: `${process.env.VUE_APP_API}/accesscontr/permission/batchImport`
    }
  },
  mounted() {

  },
  methods: {


    fileOnRemoveFn(file, fileList) {
      this.fileList = fileList
      this.messageTxt = ''
      this.isSuccess = false
      this.isError = false
    },

    fileOnChangeFn(file, fileList) {
      this.fileList = fileList
    },

    fileOnErrorFn(err, file, fileList) {
      let str = err + '', resStr = str.slice(6), obj = JSON.parse(resStr)
      this.$message({
        message: `${obj.message}`,
        type: 'error'
      })
    },

    beforeUploadFn(file) {
      if (file && file.name) {
        if (!/\.xlsx?/.test(file.name)) {
          this.$message({
            message: `请上传.xlsx 或 .xls 文档类型`,
            type: 'warning'
          })
          return false
        }
      }
      return true
    },

    /** 下载模板 **/
    downloadTemplate() {
      this.isShow = false
      this.$confirm('是否下载模板', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        new baseUploadImport().downloadExcel().then(res => {
          const data = res
          const baseUrl = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
          const fileName = '订单模板数据.xlsx' // 下载文件名称
          const exportLink = document.createElement('a')
          exportLink.download = fileName
          exportLink.style.display = 'none'
          exportLink.href = baseUrl
          exportLink.click()
        })
      })
    },
    /* 导入数据*/
    handleUploadFile(params){
      let formdata = new FormData()
      formdata.append('file',params.file)
      new baseUploadImport().importExcel(formdata).then(res=>{
        let {code,msg} = res
        if(+code == 200){
          this.isSuccess = true
          this.$message.success('导入成功')
          this.$emit('searchFn')
          this.$emit('uploadClose')  
        } else {
          this.isError = true
        }
        this.messageTxt = msg
        // this.isShow = false
      })
    },
    // 导入
    fileImpr() {
      // this.fileData.time = Date.now();
      this.$refs.batchUpload.submit()
      // this.$message.success('导入成功')
    },
    // 关闭弹窗
    handleClosed() {
      this.messageTxt = ''
      this.isSuccess = false
      this.isError = false
      this.resetUploadFileFn()
      this.$emit('uploadClose')
    },
    resetUploadFileFn() {
      this.fileList = []
      this.$refs.batchUpload && this.$refs.batchUpload.clearFiles()
      this.messageTxt = ''
      this.isSuccess = false
      this.isError = false
    }
  }
}
</script>

<style lang="scss">
.upload {
  .el-dialog__header {
    border-bottom: 1px solid #D3DBEB;
  }
  .el-icon-document {
    color: #D3DBEB;
    padding: 20px 0 40px;
    display: block;

    &:before {
      font-size: 75px;
    }

    span {
      width: 100%;
      left: 0;
      display: block;
      padding-top: 10px;
      position: absolute;
    }
  }
  .el-upload-list__item-name{
    i{
      display: none;
    }
  }
  .el-upload {
    display: block;
  }

  .fileImprBtn {
    margin: 12px 0 0;
  }

  .uploadErrorTxt {
    color: rgba(251, 98, 95, 1);
    font-size: 14px;
  }

  .uploadSuccessTxt {
    color: rgba(51, 169, 84, 1);
    font-size: 14px;
  }
}

</style>
