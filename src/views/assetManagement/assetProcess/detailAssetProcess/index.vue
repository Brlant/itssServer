<template>
  <div class="wrap">
    <header>
      <div 
        style="cursor: pointer" 
        @click="goBack"
      >
        <i class="el-icon-arrow-left"></i>
        <span>
          {{ title }}
        </span>
      </div>
      <div class="btns" v-if="$route.query.tabFlag != 4">
        <!-- 显示分配的时候，不显示全部同意 -->
        <el-button
          v-if="showAllocate && typeStatus != 4" 
          type="primary" 
          @click='allocateAssets'
         >
          分配资产
          </el-button>
        <el-button type="primary" v-if='typeStatus != 4 && !showAllocate' @click='agree'>全部同意</el-button>
        <el-button type="danger"  v-if='typeStatus != 4' @click='reject'>全部拒绝</el-button>
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
      <!-- 拒绝 -->
     <el-dialog
     destroy-on-close
      title="审批拒绝"
      class="dialogForm"
      width="50%"
      :visible.sync="rejectShow"
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
  </div>
</template>

<script>
import ApprovalProcess from './ApprovalProcess.vue'
import { listAsset } from '@/api/assetManagement/myAssets'
import { tabOptions } from '../../companyAssets/options'
import { agreeQuery,rejectQuery,deleteAttachment,uploadSuccess,seeFlow,read } from "@/api/assetManagement/assetProcess";
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
      isShow:true,
      show:true,
      title:this.$route.query.applyName,
      flowId: this.$route.query.flowId,
      tableData: [],
      attribute:'',
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
        {
          label: "资产类型确认",
          value: 2,
        },
        {
          label: "资产型号确认",
          value: 3,
        },
      ],
      selectAll:[],
      selectAllCopy:[0,1,2,3],
       dialogRules: {
        // url: [{ required: true, trigger: "blur", validator: check }],
      },
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
    }
  },
  created() {
    this.getTableData()
    this.typeStatus=this.$route.query.type ? this.$route.query.type : ''
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
        }
      })
      this.selectAllCopy=[0,1,2,3]
      this.$forceUpdate()
      console.log(this.selectAllCopy,'this.selectAll')
     
    },
    //同意
    agree(){
      this.attribute = this.$refs.process.getAttribute()
      if (this.attribute == 'maintenance') {
        this.$refs.maintenance.open()
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
      if (value == 'assignment') {
        this.showAllocate = true
      } else {
        this.showAllocate = false
      }
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
    rejectAllocate(){},
    //拒绝分配资产

    remove() {
      this.url = ''
      this.name = ''
    },
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
        this.sureForm()
          // this.attachmentId=res.data[0].id
      })
    },
    //确认同意
    sureAgree(){
       this.$refs.diaForm.validate(valid => {
        if (!valid) {
          return
        }
            if(this.attribute=='userconfirmation'){
              console.log(this.selectAll,'this.selectAll')
                 if(!this.selectAll.includes('') && this.selectAll.length==4){
                   this.uploadAttachment(this.uploadData)
                  
                  
                 }else{
                  this.selectAllCopy=JSON.parse(JSON.stringify(this.selectAll))
                 }
          }else{
            this.uploadAttachment(this.uploadData)
          }
        
       })
    
    },
    sureForm(){
      let params={
            processInstanceId:this.$route.query.processInstanceId,
            taskId:this.$route.query.taskId,
            userKey:this.$store.state.user.user.userId,
            comment: this.diaForm.comment ? this.diaForm.comment : '',
            
            procVars:{
              attribute: this.$refs.process.getAttribute(),
              revoke: this.$refs.process.getNodeId()=='a78x4anxe' ? 'true': 'false',
            }
        }
        agreeQuery(params).then(res=>{
            if(res.code==200){
             
                this.$message.success(res.msg)
                this.agreeShow=false
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
        })
    },
    //确认拒绝
    sureReject(){
        let params={
            processInstanceId:this.$route.query.processInstanceId,
            taskId:this.$route.query.taskId,
            userKey:this.$store.state.user.user.userId,
            comment: this.diaFormTwo.comment ? this.diaFormTwo.comment : '',
            procVars:{
              attribute: this.$refs.process.getAttribute(),
              revoke:this.$route.query.procVars.revoke ? this.$route.query.procVars.revoke : ''
            }
        }
        rejectQuery(params).then(res=>{
            if(res.code==200){
                this.$message.success(res.msg)
                this.rejectShow=false
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
        })
    },
     //取消按钮
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
    }
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
