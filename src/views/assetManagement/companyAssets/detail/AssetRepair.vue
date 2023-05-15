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
      v-show="isShow"
    >
      <!-- 表单开始 -->
      <el-form-item label="请输入资产数量" prop="amount">
        <div style="width:100%; display:flex; justify-content:flex-end">
          <el-input-number
            v-model="formData.amount"
            :min="1"
            :step="1"
            step-strictly
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
          accept=".jpg, .png, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
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
  fileUpload,
  repair,
  getFlow
} from '@/api/assetManagement/companyAssets'
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue"

export default {
  props: ['info'],
  components: {
    FactoryDrawFlow
  },
  data() {
    return {
      isShow: true,
      list: [],
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
        this.fileList = []
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
        const data = {
          ...this.formData,
          deptId: this.info.departmentId ? this.info.departmentId : JSON.parse(window.localStorage.getItem("user")).deptId,
          asset: {
            id: this.info.id,
            assetId: this.info.assetId,
            assetName: this.info.assetName,
            assetTypeId: this.info.assetTypeId
          },
          personalId:this.$route.query.personalId ? this.$route.query.personalId : null,
          attachmentList: this.fileList.map(item => {
            return {
              name: item.name,
              url: item.url
            }
          }),
          revoke: 'true'
        }
        console.log(data,'data')
        repair(data).then(res => {
          this.dialogVisible = false
          this.$message.success(res.msg)
          const obj = {
            name: "myAssets",
            params:{
              tab: 2
            }
          };
          this.$tab.closeOpenPage(obj)
        }).catch(() => {
          this.dialogVisible = false
        })
      })
    },
    // 查看流程
    viewFlow() {
      this.isShow = false
      const params = {
        assetTypeIds: this.info.assetTypeId,
        categoryId: 5,
        deptId: this.info.departmentId ? this.info.departmentId : JSON.parse(window.localStorage.getItem("user")).deptId

      }
      getFlow(params).then(res => {
        this.list = JSON.parse(res.data.json).list
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
