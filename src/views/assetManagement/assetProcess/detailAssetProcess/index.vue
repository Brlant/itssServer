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
      <div class="btns">
          
        <el-button type="primary" @click='agree'>全部同意</el-button>
        <el-button type="danger" @click='reject'>全部拒绝</el-button>
    
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
              {{ $route.query.applicantName }}
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
      <approval-process />
    </section>
    <!-- 同意 -->
     <el-dialog
      title="审批同意"
      class="dialogForm"
      width="50%"
      :visible.sync="agreeShow"
    >
      <el-form
        :model="diaForm"
        ref="diaForm"
        :inline="false"
        label-width="120px"
        class="dialogFormInfo"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件上传" prop="typeName">
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
      </el-form>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" 
        @click="sureAgree">确定</el-button>
        <el-button 
        @click="cancelFn">取消</el-button>
      </div>
    </el-dialog>
      <!-- 拒绝 -->
     <el-dialog
      title="审批拒绝"
      class="dialogForm"
      width="50%"
      :visible.sync="rejectShow"
    >
      <el-form
        :model="diaForm"
        ref="diaForm"
        :inline="false"
        label-width="120px"
        class="dialogFormInfo"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件上传" prop="typeName">
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
      </el-form>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" 
        @click="sureReject">确定</el-button>
        <el-button 
        @click="cancelFn">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApprovalProcess from './ApprovalProcess.vue'
import { listAsset } from '@/api/assetManagement/myAssets'
import { tabOptions } from '../../companyAssets/options'
import { agreeQuery,rejectQuery,deleteAttachment,uploadSuccess } from "@/api/assetManagement/assetProcess";
import { 
  fileUpload,
} from '@/api/assetManagement/companyAssets'
export default {
  components: {
    ApprovalProcess
  },
  data() {
    return {
      title:this.$route.query.applyName,
      flowId: this.$route.query.flowId,
      tableData: [],
      diaForm:{},
      total: 0,
      agreeShow:false,
      rejectShow:false,
      url: '',
      name: '',
      type:'',
      attachmentId:''//取消时的附件id
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    //同意
    agree(){
        this.agreeShow=true
        this.rejectShow=false
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
        this.uploadAttachment(res.data)
        }
       
      })
    },
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
            type:data.name.substring(data.name.lastIndexOf('.')),
            userId:this.$store.state.user.user.userId,
          }
        ],
         processInstanceId:this.$route.query.processInstanceId,
         taskId:this.$route.query.taskId,
      }
      uploadSuccess(params).then(res=>{
          this.attachmentId=res.data[0].id
      })
    },
    //确认同意
    sureAgree(){
        let params={
            processInstanceId:this.$route.query.processInstanceId,
            taskId:this.$route.query.taskId,
            userKey:this.$store.state.user.user.userId,
            comment: this.diaForm.comment,
            procVars:{time:new Date()

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
            comment: this.diaForm.comment,
             procVars:{time:new Date()

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
         deleteAttachment(this.attachmentId).then(res=>{
          if(res.code==200){
            this.$message.success('取消成功')
          }
         })
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
</style>
