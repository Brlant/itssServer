<template>
  <div class="form-style">
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="120px"
      >
        <el-col :span="8">
          <el-form-item label="申请日期" prop="time">
            <el-date-picker
              type="daterange"
              v-model="formData.time"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{ width: '100%' }"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修金额">
            <el-row>
              <el-col :span='11'>
                <el-input
                  v-model="formData.priceStart"
                  placeholder="请输入维修金额"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-col>
              <el-col :span='2' style='text-align:center;'><span>——</span></el-col>
              <el-col :span='11'>
                <el-input
                  v-model="formData.priceEnd"
                  placeholder="请输入维修金额"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产编号" prop="assetNo">
            <el-input
              v-model="formData.assetNo"
              placeholder="请输入资产编号"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产类型" prop="assetTypeId">
            <el-cascader
                v-model="formData.assetTypeId"
                :options="asset"
                ref="assetCas"
                :props="{ label: 'typeName', value: 'id' }"
                clearable
              
              />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产名称" prop="assetName">
            <el-input
              v-model="formData.assetName"
              placeholder="请输入资产名称"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
            <!-- <el-button @click="resetForm">导出</el-button> -->
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div>
      <el-table :data="repairData" @row-click='goDetail'>
        <el-table-column label="流程ID" align="center" prop="flowId" />

        <el-table-column label="资产类型" align="center" prop="assetTypeName">
         
        </el-table-column>
        <el-table-column
          label="资产编号&amp;名称"
          align="center"
          prop="updateTime"
        >
         <template slot-scope="scope">
            <span v-if='scope.row.assetNo'>
              {{scope.row.assetNo}}
             </span>
             <span v-if='scope.row.assetNo && scope.row.assetName'>-</span>
             <span v-if='scope.row.assetName'>
               {{scope.row.assetName}}
             </span>
          </template>
        </el-table-column>
        <el-table-column label="维修内容" align="center" prop="maintenanceInfo" />
        <el-table-column label="维修数量" align="center" prop="amount" />
        <el-table-column label="维修金额" align="center" prop="maintenancePrice" />
        <el-table-column label="申请日期" align="center" prop="createTime" />
        <el-table-column label="送修日期" align="center" prop="maintenanceDate" />
        <el-table-column label="归还日期" align="center" prop="returnDate" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
      <pagination
     v-show="total > 0"
     :total="total"
     :page.sync="page.pageNum"
     :limit.sync="page.pageSize"
     @pagination="initData"
    />
    </div>
  </div>
</template>
<script>
import {
 maintenanceRecord
} from "@/api/assetManagement/maintenanceRecords";
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
export default {
  components: {},
  props: [],
  
  data() {
    return {
      asset: [],//资产类型
      formData: {
       
      },
      page:{
        pageNum:1,
        pageSize:10
      },
      total:0,
      repairData: [{
        updatorName:'1'
      }],
      rules: {
        field101: [
          {
            required: true,
            message: "申请日期不能为空",
            trigger: "change",
          },
        ],
        field102: [
          {
            required: true,
            message: "请输入维修金额",
            trigger: "blur",
          },
        ],
        field103: [
          {
            required: true,
            message: "请输入资产编号",
            trigger: "blur",
          },
        ],
        field104: [
          {
            required: true,
            message: "请选择资产类型",
            trigger: "change",
          },
        ],
        field105: [
          {
            required: true,
            message: "请输入资产名称",
            trigger: "blur",
          },
        ],
      },
      field104Options: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getAsset()
    this.initData()
  },
  mounted() {},
  methods: {
    initData(){

      let params={
        pageNum:this.page.pageNum,
        pageSize:this.page.pageSize,
        createStartTime:this.formData.time ? this.formData.time[0] : '',
        createEndTime:this.formData.time ? this.formData.time[1] : '',
        priceStart:this.formData.priceStart ? this.formData.priceStart*1 : '',
        priceEnd:this.formData.priceEnd ? this.formData.priceEnd*1 : '',
        assetNo:this.formData.assetNo,
        assetTypeId:this.formData.assetTypeId,
        assetName:this.formData.assetName
      }
      console.log(params,'params')
      maintenanceRecord(params).then(res=>{
        this.repairData=res.rows
        this.total=res.total
      })
    },
     // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
      })
    },
    submitForm() {
      this.initData()
    },
    resetForm() {
      this.formData={}
    },
    statusFormatter(status) {
      if (status=='1') {
        return '申请中'
      }else if(status=='2'){
        return '已完成'
      }else{
      return '已取消'
      }
    },
    //点击行获取详情
  
    goDetail(row){
        const obj = {
        path: "/assetManagement/maintenanceRecords/detail/recordDetail",
        query: {
         taskId:row.taskId,
         processInstanceId:row.processInstanceId,
         deployId:row.deployId,
         flowId:row.flowId,
          status:this.statusFormatter(row.status),
          applyTime:row.createTime,
          applicantName:row.creatorName
        }
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    }
  },
};
</script>
<style lang="scss" scoped>
.form-style {
  background: #ffffff;
  padding: 10px;
}
</style>
