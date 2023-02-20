<template>
  <div class="wrap">
    <header style='min-height:56px;'>
      <div
        style="cursor: pointer"
        @click="goBack"
      >
        <i class="el-icon-arrow-left"></i>
        <span>
          {{ title }}
        </span>
      </div>

      <el-button
        type="primary"
        v-if='$route.query.tabFlag != 4&&attribute == "inventoryconfirm"'
        @click="agree"
      >
        资产盘点确认
      </el-button>
      <el-button
        type="primary"
        v-if='$route.query.tabFlag != 4&&attribute == "assetReturnInitiate"'
        @click="agree"
      >
        资产归还
      </el-button>
      <el-button
        type="primary"
        v-if='$route.query.tabFlag != 4&&attribute == "notifyconfirm"'
        @click="agree"
      >
        确认知晓
      </el-button>
      <el-button
        type="primary"
        v-if='$route.query.tabFlag != 4&&attribute == "maintenance"'
        @click="agree"
      >
        维修完成
      </el-button>
      <el-button
        v-if='$route.query.tabFlag != 4 && restart'
        type="primary"
        @click='agree'
      >
        重新发起
      </el-button>
      <div class="btns" v-else-if="$route.query.tabFlag != 4 && showBtn">

        <!-- 显示分配的时候，不显示全部同意 -->
        <el-button
          v-if="showAllocate && typeStatus != 4 && attribute == 'assignment'"
          type="primary"
          @click='allocateAssets'
         >
          分配资产
          </el-button>
        <el-button
          v-if='typeStatus != 4 && attribute == "safeconfirm"'
          type="primary"
          @click='agree'
        >
          安全确认
        </el-button>
        <el-button type="primary" v-if='typeStatus != 4 && !showAllocate' @click='agree'>全部同意</el-button>
        <el-button type="danger"  v-if='typeStatus != 4 && attribute != "maintenance"' @click='reject'>全部拒绝</el-button>
        <!-- typeStatus等于4的时候，只显示已阅 -->
        <!-- <el-button type="danger"  v-if='typeStatus == 4' @click='seeReadShow=true'>已阅</el-button> -->
        <el-button type="danger"  v-if='typeStatus == 4' @click='seeRead'>已阅</el-button>
        <!-- <el-button type="danger"  v-if="showAllocate"  @click='rejectAllocate '>拒绝</el-button> -->
      </div>
    </header>
    <!-- 资产信息开始 -->
    <section class="asset-info">
      <div class="heading">
        <div class="left">
          <span class="bar"></span>
          <b>资产信息</b>
        </div>
        <div class="right">
          <div class="item">
            <span class="name">资产数量：</span>
            <span class="value">
              {{ tableData.length }} 项
              {{ total }} 件
            </span>
          </div>
          <div class="item">
            <span class="name">申请人：</span>
            <span class="value">
              {{ $route.query.applicantName}}
            </span>
          </div>
          <div class="item">
            <span class="name">申请日期：</span>
            <span class="value">
              {{ $route.query.applyTime }}
            </span>
          </div>
          <div class="item">
            <span class="name">审批状态：</span>
            <span class="value">
              {{ $route.query.status }}
            </span>
          </div>
        </div>
      </div>
      <!-- 表格部分 -->
      <el-table
        :data="tableData"
        border
      >
        <el-table-column
          align="center"
          label="资产类型"
          prop="assetTypeName"
        />
        <el-table-column
          align="center"
          label="资产编号"
          prop="assetId"
        />
        <el-table-column
          align="center"
          label="资产名称"
          prop="assetName"
        />
        <el-table-column
          align="center"
          label="品牌"
          prop="brand"
        />
        <el-table-column
          align="center"
          label="型号"
          prop="model"
        />
        <el-table-column
          align="center"
          label="保修期"
          prop="maintenanceTime"
        />
        <el-table-column
          align="center"
          label="数量"
          prop="amount"
        />
        <el-table-column
          align="center"
          label="存放地点"
          prop="storageAddress"
        />
        <el-table-column
          align="center"
          label="归属部门"
          prop="departmentName"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              size="small"
              :disabled="!row.id"
              @click="view(row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 资产信息结束 -->
    <!-- 审批进度开始 -->
    <section class="process">
      <approval-process
        @emitAttr="getAttr"
        ref="process"
      />
    </section>
    <!-- 同意 -->
     <el-dialog
     destroy-on-close
      title="审批同意"
      class="dialogForm"
      width="50%"
      :visible.sync="agreeShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
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
      <div v-if='attribute=="userconfirmation"'>
         <div class='sure-title'><span style='color:red'>*</span>确认信息</div>
        <div class='list-style'>
          <div
            v-for="(item, index) in sureList"
            :key="index"
            :class="['div-style', { current: selectAll.includes(index) },{noSelect:!selectAllCopy.includes(index)}]"
            @click='select(index)'
          >
            {{ item.label }}
          </div>
        </div>
      </div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件上传" prop="url">
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
        <el-button
          type="primary"
          :disabled="submitLoading"
          @click="sureAgree"
        >
          确定
        </el-button>
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
      <!-- 拒绝 -->
     <el-dialog
     destroy-on-close
      title="审批拒绝"
      class="dialogForm"
      width="50%"
      :visible.sync="rejectShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
    <div v-if='show'>
       <el-form
        :model="diaFormTwo"
        ref="diaFormTwo"
        :inline="false"
        label-width="120px"
        class="dialogFormInfo"
      >
        <el-row>
<!--          <el-col :span="24">
            <el-form-item label="附件上传" prop="url">
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
          </el-col>-->
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="comment">
              <el-input v-model="diaFormTwo.comment" type='textarea'>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-button type="text" @click="viewFlowTwo">
        <span style="text-decoration: underline">
          审批流程查看
        </span>
      </el-button>
      </el-form>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary"
        @click="sureReject">确定</el-button>
        <el-button
        @click="cancelFn">取消</el-button>
      </div>
    </div>
    <div
      style="cursor:pointer"
      v-show="!show"
    >
      <span @click="show = true">
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
    </el-dialog>
    <!-- 已阅 -->
     <el-dialog
     destroy-on-close
      title="是否已阅"
      class="dialogForm"
      width="20%"
      :visible.sync="seeReadShow"
    >
     <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary"
        @click="seeRead">确定</el-button>
        <el-button
        @click="seeReadShow=false">取消</el-button>
      </div>
     </el-dialog>
    <!-- 完成维修弹窗 -->
    <my-maintenance ref="maintenance" />

    <!--  确认弹框  -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      center
      width="30%"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <!-- 表单开始 -->
      <el-form
        :model="formData"
        :rules="formRules"
        ref="elForm"
        label-width="80px"
      >
        <el-form-item label-width="0" prop="comment">
          <div class="label">
            备注
          </div>
          <el-input
            type="textarea"
            v-model="formData.comment"
            style='width:100%'
          />
        </el-form-item>
      </el-form>
      <!-- 表单结束 -->
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="submitLoading"
          @click="onSubmit">
          确定
        </el-button>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApprovalProcess from './ApprovalProcess.vue'
import { listAsset } from '@/api/assetManagement/myAssets'
import { tabOptions } from '../../companyAssets/options'
import {
  agreeQuery,
  rejectQuery,
  deleteAttachment,
  uploadSuccess,
  seeFlow,
  read
} from "@/api/assetManagement/assetProcess";
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue";
import {
  fileUpload,
} from '@/api/assetManagement/companyAssets'
import MyMaintenance from './MyMaintenance'

export default {
  components: {
    ApprovalProcess,
    FactoryDrawFlow,
    MyMaintenance
  },
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
      attribute: '',
      list:[],
      showBtn:false,
      isShow:true,
      show:true,
      title:this.$route.query.applyName,
      flowId: this.$route.query.flowId,
      tableData: [],
      // attribute:'',
      uploadData:{},
      diaForm:{
        url:''
      },
      diaFormTwo:{},
      total: 0,
      agreeShow:false,
      rejectShow:false,
      url: '',
      name: '',
      type:'',
      typeStatus:'',
      seeReadShow:false,
      attachmentId:'',//取消时的附件id
      showAllocate: false,
      sureList: [
        {
          label: "资产类型确认",
          value: 0,
        },
        {
          label: "资产型号确认",
          value: 1,
        },
        /*{
          label: "资产类型确认",
          value: 2,
        },
        {
          label: "资产型号确认",
          value: 3,
        },*/
      ],
      selectAll:[],
      // selectAllCopy:[0,1,2,3],
      selectAllCopy:[0,1],
      dialogRules: {
        // url: [{ required: true, trigger: "blur", validator: check }],
      },
      dialogTitle: '',
      dialogVisible: false,
      formData: {
        comment: ''
      },
      formRules: {
      },
      submitLoading: false,
      restart: false
    }
  },
  watch: {
    agreeShow(value) {
      if (value === false) {
       this.cancelFn()
      }
    },
    rejectShow(value) {
      if (value === false) {
       this.cancelFn()
      }
    },

    dialogVisible(value)
    {
      if (value === false)
      {
        // 关闭时清空表单
        this.$refs.elForm.resetFields()
      }
    }
  },
  created() {
    this.getTableData()
    this.typeStatus=this.$route.query.type ? this.$route.query.type : ''
    this.restart = (this.$route.query.commentSize>1&&this.$route.query.taskDefKey == 'a78x4anxe') ? true : false
  },
  methods: {
      select(index){
      console.log(this.selectAll,'selectAll')
      let n=index
      this.$nextTick(()=>{
        if(this.selectAll.includes(n)){
          console.log('aaaa')
          // this.selectAll.splice(n, 1);
            this.selectAll[n]=''

        }else{
          this.selectAll[n]=n
          // this.selectAll.push(n)
        }
      })
      // this.selectAllCopy=[0,1,2,3]
        this.selectAllCopy=[0,1]
        this.$forceUpdate()
      console.log(this.selectAllCopy,'this.selectAll')

    },
    //同意
    agree(){
      this.attribute = this.$refs.process.getAttribute()
      console.log(this.attribute,'this.attribute')
      if (this.attribute == 'maintenance') {
        this.$refs.maintenance.open()
      } else if(this.attribute == 'inventoryconfirm' || this.attribute == 'assetReturnInitiate' || this.attribute == 'notifyconfirm' || this.attribute == 'safeconfirm' || this.restart){
        this.dialogTitle = this.attribute == 'inventoryconfirm'
                           ? '盘点确认'
                           : this.attribute == 'assetReturnInitiate'
                             ? '资产归还'
                             : this.attribute == 'notifyconfirm'
                               ? '确认知晓'
                               : this.attribute == 'safeconfirm'
                                 ? '安全确认'
                                 : this.restart
                                    ? '重新发起'
                                    : ''
        this.dialogVisible = true
      } else {
        this.selectAll=[]
        this.selectAllCopy=[0,1,2,3]
        this.agreeShow=true
        this.rejectShow=false
        // this.attribute=this.$refs.process.getAttribute()
      }
    },
    //拒绝
    reject(){
        this.rejectShow=true
         this.agreeShow=false
    },
      // 上传文件
    onChange(file) {
      let formData = new FormData()
      formData.append('file', file.raw)
      fileUpload(formData).then(res => {
        if(res.code==200){
        this.url = res.data.url
        this.name = res.data.name
        this.uploadData=res.data

        }

      })
    },
    // 控制分配资产按钮
    getAttr(value) {
      this.attribute = value
      if (value == 'inventoryconfirm' || value == 'assetReturnInitiate' || value == 'notifyconfirm' || this.restart){
        return
      } else if (value == 'assignment' || value == 'safeconfirm') {
        this.showAllocate = true
      } else {
        this.showAllocate = false
      }
      this.showBtn=true
      console.log(this.showBtn,'this.showBtn')
    },

    //分配资产按钮
    allocateAssets(){
      // const obj = {
      //   path: "/assetManagement/allocateAssets/allocate",
      // };
      // getToday()

      const {
        applicantName,
        applyTime,
        status,
        applyUserId,
        assetTypeId,
        amount,
        taskId,
        processInstanceId,
        deployId
      } = this.$route.query

      this.$router.push({
        path: '/assetManagement/allocateAssets/process/allocateAssets',
        query: {
          applicantName,
          applyTime,
          status,
          applyUserId,
          assetTypeId,
          amount,
          attribute: this.attribute,
          taskId,
          processInstanceId,
          deployId
        }
      })
    },

   //删除上传的文件
    remove() {
      this.url = ''
      this.name = ''
    },
    //点击弹框的确认按钮之后调用的方法，上传文件相关
    uploadAttachment(data){
      let params={
        attachments:[
          {
            description:'',
            name:data.name,
            url:data.url,
            type:data.name ? data.name.substring(data.name.lastIndexOf('.')) : '',
            userId:this.$store.state.user.user.userId,
          }
        ],
         processInstanceId:this.$route.query.processInstanceId,
         taskId:this.$route.query.taskId,
      }
      uploadSuccess(params).then(res=>{
        //同意的接口请求事件
        this.sureForm()
      })
    },

    // 弹框里的同意按钮  确认同意
    sureAgree(){
       this.$refs.diaForm.validate(valid => {
        if (!valid) {
          return
        }
            if(this.attribute=='userconfirmation'){
              //this.attribute=='userconfirmation'时，需要将'确认信息'的四个按钮全都选中才能提交
              let count = []
              this.selectAll.forEach((i,index)=>{
              count.push(i)
              })
                 /*if(!this.selectAll.includes('')
                 && this.selectAll.length==4
                 && count.length==4){//这个条件是判断确认信息的四个按钮有没有全都选中*/
              if(!this.selectAll.includes('')
                && this.selectAll.length==2
                && count.length==2){//这个条件是判断确认信息的两个按钮有没有全都选中
                 //全都选中则直接调用接口
                   this.uploadAttachment(this.uploadData)
                 }else{
                  //未全选中，将this.selectAll赋值给this.selectAllCopy，判断四个按钮是的出现红色阴影提示
                  this.selectAllCopy=JSON.parse(JSON.stringify(this.selectAll))
                 }
          }else{
             // this.attribute！='userconfirmation'时，'确认信息'的四个按钮不显示
            this.uploadAttachment(this.uploadData)
          }

       })

    },

    //同意的接口请求事件
    sureForm(){
      let params={
            processInstanceId:this.$route.query.processInstanceId,
            taskId:this.$route.query.taskId,
            userKey:this.$store.state.user.user.userId,
            comment: this.diaForm.comment ? this.diaForm.comment : '',

            procVars:{
              attribute: this.$refs.process.getAttribute(),
              //revoke: this.$refs.process.getNodeId()=='a78x4anxe' ? 'true': 'false'
            }
        }
        this.submitLoading = true
        agreeQuery(params).then(res=>{
            if(res.code==200){

                this.$message.success(res.msg)
                this.agreeShow=false
                this.submitLoading = false
                  const obj = {
                path: "/assetManagement/assetProcess",
                query:{
                    tab:this.$route.query.tab
                }
              };
              // getToday()
              this.$tab.closeOpenPage(obj);
              this.getTableData()
          }
        }).catch(() => {
          this.submitLoading = false
        })
    },

    //弹框里的确认按钮  确认拒绝
    sureReject(){
        let params={
            processInstanceId:this.$route.query.processInstanceId,
            taskId:this.$route.query.taskId,
            userKey:this.$store.state.user.user.userId,
            comment: this.diaFormTwo.comment ? this.diaFormTwo.comment : '',
            procVars:{
              attribute: this.$refs.process.getAttribute(),
              //revoke:this.$route.query.procVars.revoke ? this.$route.query.procVars.revoke : ''
            }
        }
      this.submitLoading = true
        rejectQuery(params).then(res=>{
            if(res.code==200){
                this.$message.success(res.msg)
                this.rejectShow=false
              this.submitLoading = false
                  const obj = {
                    path: "/assetManagement/assetProcess",
                    query:{
                        tab:this.$route.query.tab
                    }
                  };
                  // getToday()
                  this.$tab.closeOpenPage(obj);
                this.getTableData()
            }
        }).catch(() => {
          this.submitLoading = false
        })
    },

     //弹框里的取消按钮
     cancelFn(){
         this.rejectShow=false
         this.agreeShow=false
    },

    // 表格数据
    getTableData() {
      listAsset(this.flowId).then(res => {
        this.tableData = res.data
        // 总件数
        let total = 0
        this.tableData.forEach(value => {
          total += value.amount
        })
        this.total = total
      })
    },

    // 查看详情
     view(row) {
      this.$router.push({
        path: '/assetManagement/companyAssets/companyAssets-auth/detail',
        query: {
          id: row.id,
          status: this.statusFormatter(row),
          isApplying: row.isApplying,
          manageType: row.manageType
        }
      })
    },

    // 状态处理
    statusFormatter(row) {
      let res
      if (row.specialStatus !== null) {
        const specialArr = tabOptions.filter(v => v.type == 'specialStatus')
        res = specialArr.find(v => row.specialStatus == v.value).label
        return res
      }
      if (row.status !== null) {
        if (row.status == 1) {
          res = '闲置中'
          return res
        } else {
          const arr = tabOptions.filter(v => v.type == 'status')
          res = arr.find(v => row.status == v.value).label
          return res
        }
      }
    },

    // 返回
    goBack() {
       const obj = {
        path: "/assetManagement/assetProcess",
        query:{
            tab:this.$route.query.tab
        }
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },

    //审批流程查看
    viewFlowOne(){
      //全部同意按钮里的审批流程查看
       this.isShow = false
        let params = {
        taskId: this.$route.query.taskId,
        processInstanceId: this.$route.query.processInstanceId,
        deployId: this.$route.query.deployId
      }
      seeFlow(params).then(res => {
        this.list = JSON.parse(res.data.flowProcDefRes.json).list
        console.log(this.list,'this.list')
        return
      })
    },
     viewFlowTwo(){
       //全部拒绝按钮里的审批流程查看
       this.show = false
      let params = {
        taskId: this.$route.query.taskId,
        processInstanceId: this.$route.query.processInstanceId,
        deployId: this.$route.query.deployId
      }

      seeFlow(params).then(res => {
        this.list = JSON.parse(res.data.flowProcDefRes.json).list
        console.log(this.list,'this.list')
        return
      })
    },

    //已阅
    seeRead(){
       this.$confirm('确认已阅吗？', '提示', {
        type: 'warning'
      }).then(() => {
        let params={
          taskId: this.$route.query.taskId,
          processInstanceId: this.$route.query.processInstanceId,
        }
        read(params).then(res=>{
            if(res.code==200){
              const obj = {
                path: "/assetManagement/assetProcess",
                query:{
                    tab:this.$route.query.tab
                }
              };
        // getToday()
              this.$tab.closeOpenPage(obj);
            }
          })
        }).catch(() => {})
    },

    // 资产盘点确认提交
    onSubmit() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return
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
          // attribute: 'inventoryconfirm',
          attribute: this.$refs.process.getAttribute(),
          comment: this.formData.comment,
        }
      }
      this.submitLoading = true
      agreeQuery(params).then(res => {
        this.$message.success(res.msg)
        this.dialogVisible = false
        this.submitLoading = false
        const obj = {
          path: "/assetManagement/assetProcess",
          query: {
            tab:this.$route.query.tab
          }
        };
        this.$tab.closeOpenPage(obj);
        this.getTableData()
      }).catch(() => {
        this.submitLoading = false
      })
    },
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
  }

  .asset-info {
    background: #fff;
    padding: 10px;
    margin-bottom: 5px;
  }

  .process {
    background: #fff;
    padding: 10px;
  }

  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .left {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

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

    .right {
      display: flex;

      .item {
        font-size: 14px;
        margin-right: 50px;

        .name {
          color: #8294ad;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

.list-style {
  display: inline-block;
  width: 80%;
}

.sure-title {
  display: inline-block;
  width: 13%;
  vertical-align: top;
  text-align: right;
  padding-right: 40px;
}

.div-style {
  cursor: pointer;
  width: 30%;
  margin-right: 100px;
  margin-bottom: 20px;
  display: inline-block;
  border: 1px solid #ddd;
  text-align: center;
  padding: 10px 0;
}

.current {
  background: #97b2e98c
}

.noSelect {
  box-shadow: 2px 2px 10px red;;
}
</style>
