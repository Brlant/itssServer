<template>
  <div class="maintain">
    <el-timeline v-if="list.length">
      <el-timeline-item
        v-for="(item, index) in list"
        :key="index"
        :timestamp="item.createTime"
        placement="top"
      >
        <p class="row1">
          {{ item.creatorName }}提交保养记录，保养日期：{{ item.nowTime }}
        </p>
        <p class="row2">
          下次保养时间：{{ item.nextTime }}
        </p>
        <p class="row3">
          附件：
          <span class="link" @click="downFlowLoad(item.maintainUrl)">
            {{ item.maintainName }}
          </span>
        </p>
      </el-timeline-item>
    </el-timeline>
    <div v-else style="font-size: 14px">
      暂无保养记录
    </div>
    <div class="btn">
      <el-button type="text" @click="dialogVisible = true">
        提交保养记录
      </el-button>
    </div>
    <!-- 提交证书弹窗 -->
    <el-dialog
      title="提交保养记录"
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
          <el-form-item label="保养文件" prop="url">
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
          <el-form-item label="本次保养日期" prop="nowTime">
            <el-date-picker
              v-model="formData.nowTime"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              type="date"
            />
          </el-form-item>
          <el-form-item label="下次保养日期" prop="nextTime">
            <el-date-picker
              v-model="formData.nextTime"
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
  maintainList,
  fileUpload,
  addMaintain
} from '@/api/assetManagement/companyAssets'
import moment from 'moment'
import downFile from '@/utils/downFile'

export default {
  data() {
    // 上传校验
    const check = (rule, value, callback) => {
      if (!this.url) {
        callback(new Error('请上传保养文件'))
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
        nowTime: '',
        nextTime: ''
      },
      rules: {
        url: [
          { required: true, trigger:'blur', validator: check }
        ],
        nowTime: [
          { required: true, trigger: 'change', message: '请选择本次保养日期' }
        ],
        nextTime: [
          { required: true, trigger: 'change', message: '请选择下次保养日期' }
        ]
      },
      submitLoading: false,

      attachmentDialog: false, // 预览附件
      attachmentUrl: '', // 附件地址
    }
  },
  created() {
    this.getMaintainList()
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
    getMaintainList() {
      const data = {
        assetId: this.id
      }
      maintainList(data).then(res => {
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
        const startStamp = moment(this.formData.nowTime, 'YYYY-MM-DD').valueOf()
        const endStamp = moment(this.formData.nextTime, 'YYYY-MM-DD').valueOf()
        if (startStamp > endStamp) {
          this.$message.warning('下次保养日期不能早于本次保养日期')
          return
        }
        const data = {
          assetId: this.id,
          maintainName: this.name,
          maintainUrl: this.url,
          nowTime: this.formData.nowTime,
          nextTime: this.formData.nextTime
        }
        this.submitLoading = true
        addMaintain(data).then(res => {
          this.submitLoading = false
          this.dialogVisible = false
          this.$message.success(res.msg)
          this.getMaintainList()
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
        } else {
          downFile(url)
        }
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
.maintain {
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
