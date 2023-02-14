<template>
  <div class="inventory">
    <div class="heading">
      <span class="title">
        盘点任务列表
      </span>
      <div class="btns">
        <div class="item">
          <span @click="openDialog" v-hasPermi="['inventory:create']">发起盘点</span>
        </div>
         <!-- @click='countSet'暂时不做 -->
        <div class="item">
          <span @click='countSet'>盘点设置</span>
        </div>
      </div>
    </div>
    <!-- 表格部分 -->
    <el-table
      :data="tableData"
      border
      @row-click="goDetail"
      v-loading="loading"
    >
      <el-table-column
        align="center"
        label="盘点ID"
        prop="id"
      />
      <el-table-column
        align="center"
        label="创建人"
        prop="creatorName"
      />
      <el-table-column
        align="center"
        label="创建时间"
        prop="createTime"
      />
      <el-table-column
        align="center"
        label="完成时间"
        prop="completeTime"
      />
<!--      <el-table-column
        align="center"
        label="涉及资产类型"
        prop="assetTypeName"
      />
      <el-table-column
        align="center"
        label="涉及资产状态"
        prop="assetStatusName"
      />-->
      <el-table-column
        align="center"
        label="备注"
        prop="remark"
      />
      <el-table-column
        align="center"
        label="当前状态"
      >
      <template slot-scope="scope">
        <span>
          {{
            scope.row.status
            ? formatStatus(scope.row.status)
            : ''
          }}
        </span>
      </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 发起盘点弹窗 -->
    <el-dialog
      destroy-on-close
      title="发起盘点"
      class="dialogForm"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogShow"
    >
      <div v-if='isShow'>
        <el-form
          :model="diaForm"
          ref="diaForm"
          :rules="dialogRules"
          :inline="false"
          label-width="120px"
          class="dialogFormInfo"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="附件上传" prop="url">
                <el-upload
                  action
                  :on-change="upChange"
                  :before-remove="remove"
                  :limit="1"
                  accept=".jpg, .png, .pdf"
                  :auto-upload="false"
                >
                  <el-button type="info"> 上传附件 </el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注" prop="url">
                <el-input v-model='diaForm.remark' type='textarea'>
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
          <el-button type="primary" @click="sureApply">确定</el-button>
          <el-button @click="cancelFn">取消</el-button>
        </div>
      </div>
      <div
        style="cursor:pointer"
        v-if="!isShow"
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

    </el-dialog>
  </div>
</template>

<script>
import { getAssetInventory, fileUpload, getInventoryFlow } from '@/api/assetManagement/inventoryManagement'
import {initiateInventory} from "../../../api/assetManagement/inventoryManagement";
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue";

export default {
  components: {
    FactoryDrawFlow
  },
  data() {
    return {
      loading: false,
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogShow: false,
      isShow: true,
      diaForm:{

      },
      dialogRules:{

      },
      url: "",
      name: "",
      type:'',
      list:[],
    }
  },
  mounted()
  {
    this.getTableData()
  },

  methods: {
    // 表格数据
    getTableData() {
      this.loading = true
      getAssetInventory(this.queryParams).then(res=>{
        this.tableData = res.rows
        this.total = res.total
        this.loading = false
      }).catch(()=>{
        this.loading = false
      })
    },

    // 打开发起盘点弹窗
    openDialog() {
      this.dialogShow = true;
    },

    // 上传文件
    upChange(file) {
      let formData = new FormData();
      formData.append("file", file.raw);
      fileUpload(formData).then(res => {
        this.url = res.data.url
        this.name = res.data.name
        this.type=this.name.substring(this.name.lastIndexOf('.'))
      })
    },

    // 移除文件
    remove() {
      this.url = "";
      this.name = "";
      this.type=''
    },

    //查看流程图
    viewFlowOne(){
      console.log(JSON.parse(window.localStorage.getItem("user")).deptId)
      // return
      this.isShow = false
      const params = {
        // assetTypeIds: this.info.assetTypeId,
        // categoryId: 1,
        // deptId: this.info.departmentId ? this.info.departmentId : JSON.parse(window.localStorage.getItem("user")).deptId
      }
      getInventoryFlow(params).then(res => {
        this.list = JSON.parse(res.data.flowInfoVoList[0].flowDefInfoVoList[0].flowProcDefRes.json).list
      })
    },

    //弹框确认
    sureApply() {
      this.$refs.diaForm.validate(valid => {
        if (!valid) {
          return
        }
          let attachList={
            name:this.name,
            url:this.url,
            type:this.type,
            description:''
          }
          let attachmentList=[]
          attachmentList.push(attachList)
          let params={
            attachmentList,
            remark:this.diaForm.remark,
            // deptId: this.info.departmentId ? this.info.departmentId : JSON.parse(window.localStorage.getItem("user")).deptId
          }
          // console.log(params,'params')
          // return
          initiateInventory(params).then(res=>{
            if(res.code==200){
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.dialogShow=false
            }
          })

      })

    },

    //弹框取消
    cancelFn() {
      this.dialogShow = false;
    },

    // 进入详情
    goDetail(row, column) {
      if(column && column.label=='操作'){
        return;
      }
      this.$router.push({
        path: '/assetManagement/inventoryManagement-auth/detail',
        query:{
          id:row.id,
        }
      })
    },

    //盘点设置按钮
    countSet(){
      this.$router.push({
        path: '/assetManagement/inventoryManagement-auth/countingSettings'
      })
    },

    // 分页
    getList() {
      this.getTableData()
    },

    // 格式化状态
    formatStatus(val){
      let label = ''
      if(val){
        switch (val) {
          case 0:
            label = '未开始'
            break
          case 1:
            label = '进行中'
            break
          case 2:
            label = '已完成'
            break
          case 3:
            label = '已取消'
            break
        }
        return label
      }
      return label
    }
  }
}
</script>

<style lang="scss" scoped>
.inventory {
  background: #fff;
  padding: 15px 10px;
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .title {
      font-size: 18px;
    }
    .btns {
      display: flex;
      align-items: center;
      .item {
        padding: 0 10px;
        border-right: 1px solid #037dff;
        line-height: 1;
        &:last-child {
          border-right: 0;
          padding-right: 0;
        }
        span {
          color: #037dff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
