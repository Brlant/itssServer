<template>
  <div class="wrap">
    <header>
      <div style="cursor: pointer" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <span>
          {{ title }}
        </span>
      </div>
      <div class="btns">
        <el-button type="primary" @click="sure">确定</el-button>
        <el-button type="danger" @click="cancel">取消</el-button>
       
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
                <span class="name">需分配数：</span>
                <span class="value">
                {{ total }} 
                </span>
          </div>
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
        >
            <template>
                
            </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-button 
              type="text" 
              size="small"
              style='color:red'
              :disabled="!row.id"
              @click="del(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 资产信息结束 -->
    <!-- 可分配资产信息开始 -->
    <section class="asset-info">
      <div class="heading">
        <div class="left">
          <span class="bar"></span>
          <b>可分配资产</b>
        </div>
      </div>
      <!-- 表格部分 -->
      <el-table
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
      >
       <el-table-column
        type="selection"
        width="55">
        </el-table-column>
        
        <el-table-column
          align="center"
          label="资产编号"
          prop="assetId"
        />
        <el-table-column
          align="center"
          label="资产类型"
          prop="assetTypeName"
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
          label="购入日期"
          prop="maintenanceTime"
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
      </el-table>
    </section>
    <!-- 可分配资产信息结束 -->
  </div>
</template>
<script>
import { listAsset } from '@/api/assetManagement/myAssets'
import { tabOptions } from '../../companyAssets/options'
import { agreeQuery,rejectQuery,deleteAttachment,uploadSuccess } from "@/api/assetManagement/assetProcess";

export default {
  data() {
    return {
      title:'分配资产',
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
    // this.getTableData()
  },
  methods: {
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
    //确定
    sure(){},
    //拒绝
    cancel(){},
    handleSelectionChange(){},
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
