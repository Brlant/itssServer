<template>
  <el-dialog
    title="审批同意"
    class="dialogForm"
    width="50%"
    :visible.sync="agreeShow"
    destroy-on-close
  > 
    <div v-if='isShow'>
    <el-form
      :model="diaForm"
      :rules="dialogRules"
      ref="diaForm"
      :inline="false"
      label-width="120px"
      class="dialogFormInfo"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="附件上传" prop="url">
            <el-upload
              action
              :on-change="onChange"
              :on-remove="onRemove"
              :file-list="fileList"
              accept=".jpg, .png, .pdf"
              :auto-upload="false"
            >
            <el-button type="info">
              上传附件
            </el-button>
          </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row>
        <el-col :span="12">
          <el-form-item label="备注" prop="comment">
            <el-input v-model="diaForm.comment" type='textarea'>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button type="text" @click="viewFlowOne">
        <span style="text-decoration: underline">
          审批流程查看
        </span>
      </el-button>
      </el-form>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" 
        @click="sureAgree">确定</el-button>
        <el-button 
        @click="cancelFn">取消</el-button>
      </div>
      </div>
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
  </el-dialog>
</template>

<script>
import { fileUpload } from '@/api/assetManagement/companyAssets'
import { 
  agreeQuery,
  uploadSuccess,
  seeFlow 
} from "@/api/assetManagement/assetProcess"
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue"

export default {
  components: {
    FactoryDrawFlow
  },
  props: ['customVar'],
  data() {
    // 上传校验
    const check = (rule, value, callback) => {
      if (!this.url) {
        callback(new Error("请上传证书文件"));
      } else {
        callback();
      }
    };
    return {
      selectAll:[],
      selectAllCopy:[0,1,2,3],
      list: [],
      fileList: [],
      agreeShow: false,
      isShow:true,
      diaForm: {},
      url: '',
      name: '',
      dialogRules: {
        // url: [{ required: true, trigger: "blur", validator: check }],
      },
      sureList: [
        {
          label: "资产类型确认",
          value: 0,
        },
        {
          label: "资产型号确认",
          value: 1,
        },
        {
          label: "资产类型确认",
          value: 2,
        },
        {
          label: "资产型号确认",
          value: 3,
        },
      ],
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
    //确认同意
    sureAgree(){
      this.$refs.diaForm.validate(valid => {
        if (!valid) {
          return
        }
        if (this.fileList.length) {
          this.uploadAttachment()
        }
        this.sureForm()
      })
    },
    sureForm() {
      let params = {
        processInstanceId:this.$route.query.processInstanceId,
        taskId:this.$route.query.taskId,
        userKey:this.$store.state.user.user.userId,
        comment: this.diaForm.comment,
        procVars:{
          attribute: this.$route.query.attribute,
          CUSTOM_VAR: JSON.stringify(this.customVar)
        }
      }
      agreeQuery(params).then(res=>{
        if(res.code == 200) {
            this.$message.success(res.msg)
            this.agreeShow = false
            const obj = {
            path: "/assetManagement/assetProcess",
            query: {
              tab: this.$route.query.tab
            }
          };
          this.$tab.closeOpenPage(obj);
        }
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
    // 提交文件
    uploadAttachment(){
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
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    remove() {
      this.url = ''
      this.name = ''
    },
    //审批流程查看
    viewFlowOne() {
      this.isShow = false
      const params = {
        taskId: this.$route.query.taskId,
        processInstanceId: this.$route.query.processInstanceId,
        deployId: this.$route.query.deployId
      }
      seeFlow(params).then(res => {
        this.list = JSON.parse(res.data.flowProcDefRes.json).list
      })
    },
    select(index){
      let n = index
      this.$nextTick(() => {
        if (this.selectAll.includes(n)) {
          this.selectAll[n] = ''
        } else {
          this.selectAll[n] = n
        }
      })
      this.selectAllCopy = [0,1,2,3]
      this.$forceUpdate()
    },
    open() {
      this.agreeShow = true
    },
    cancelFn() {
      this.agreeShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.list-style{
  display: inline-block;
  width:80%;
}
.sure-title{
  display:inline-block;
  width:13%;
  vertical-align:top;
  text-align:right;
  padding-right:40px;
}
.div-style {
  cursor: pointer;
  width: 30%;
  margin-right: 100px;
  margin-bottom: 20px;
  display: inline-block;
  border: 1px solid #ddd;
  text-align: center;
  padding:10px 0;
}
.current{
  background:#97b2e98c
}
.noSelect{
  box-shadow: 2px 2px 10px red;;
}
</style>
