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
          <el-form-item label="申请日期" prop="time1">
            <el-date-picker
              type="daterange"
              v-model="formData.time1"
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
          <el-form-item label="报废日期" prop="time2">
             <el-date-picker
              type="daterange"
              v-model="formData.time2"
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
                  :props="{ label: 'typeName', value: 'id', checkStrictly: true }"
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
      <el-table :data="scrapRecordData" @row-click="goDetail">
        <el-table-column label="流程ID" align="center" prop="flowId" />

        <el-table-column label="资产类型" align="center" prop="assetTypeName">

        </el-table-column>
        <el-table-column
          label="资产编号&amp;名称"
          align="center"
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
        <el-table-column label="报废数量" align="center" prop="scarpAmount" />
        <el-table-column label="资产原值" align="center" prop="afterTaxPrice" />
        <el-table-column label="累计折旧" align="center" prop="depreciation" />
        <el-table-column label="资产净值" align="center" prop="surplusValue" />
        <el-table-column label="折旧年限" align="center" prop="depreciableLife" />
        <el-table-column label="申请日期" align="center" prop="createTime" />
        <el-table-column label="报废日期" align="center" prop="scarpTime" />
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
 maintenanceScrapRecord
} from "@/api/assetManagement/maintenanceRecords";
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        time1: [],
        time2: [],
        assetNo: '',
        assetTypeId: [],
        assetName: '',
      },
      scrapRecordData: [],
      rules: {

      },
      asset: [],//资产类型
      page:{
      pageNum:1,
      pageSize:10
      },
      total:0,
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
      // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        // this.asset = res.data
        let arr = res.data
        arr.forEach((m) => {
          m.disabled = true
          if ((m.children ?? '')!=='') {
            m.children.forEach((item) => {
              item.disabled = true
            })
          }
        });
        this.asset = arr
      })
    },
    initData(){
       let data={
        ...this.formData
      }
      const assetTypeId = data.assetTypeId
      switch (assetTypeId.length) {
        case 0:
          delete data.assetTypeId
          break
        case 1:
          data.oneTypeId = assetTypeId[0]
          delete data.assetTypeId
          break
        case 2:
          data.twoTypeId = assetTypeId[1]
          delete data.assetTypeId
          break
        case 3:
          data.assetTypeId = assetTypeId[2]
          break
      }
      let params={
        pageNum:this.page.pageNum,
        pageSize:this.page.pageSize,
        businessType:6,
        createStartTime:this.formData.time1 ? this.formData.time1[0] : '',
        createEndTime:this.formData.time1 ? this.formData.time1[1] : '',
        scrapStartTime:this.formData.time2 ? this.formData.time2[0] : '',
        scrapEndTime:this.formData.time2 ? this.formData.time2[1] : '',
        assetNo:this.formData.assetNo,
        assetTypeId:data.assetTypeId,
        assetName:this.formData.assetName
      }
      maintenanceScrapRecord(params).then(res=>{
        this.scrapRecordData=res.rows
        this.total=res.total
      })
    },
    submitForm() {
      this.initData()
    },
    resetForm() {
      this.formData = {
        time1: [],
        time2: [],
        assetNo: '',
        assetTypeId: [],
        assetName: '',
      }
      this.page.pageNum = 1
      this.initData()
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
    goDetail(row, column){
        if(column && column.label=='操作'){
          return;
        }
        const obj = {
        path: "/assetManagement/maintenanceRecords/detail/recordDetail",
        query: {
         taskId:row.taskId,
         processInstanceId:row.processInstanceId,
         deployId:row.deployId,
         flowId:row.flowId,
          title:'报废记录',
          status:this.statusFormatter(row.flowStatus),
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

