<template>
  <div class="apply">
    <div class="heading">
      <div
      style='font-size:18px;
      color:#000000'
      >公司资产审批流程</div>
      <div class="btn" @click="isExpand = !isExpand">
        <span>
          {{ isExpand ? '收起' : '筛选' }}
        </span>
        <i :class="['el-icon-arrow-down', {up: isExpand}]"></i>
      </div>
    </div>
    <!-- 表单开始 -->
    <div :class="['search', {expand: isExpand}]">
      <el-form
        :model="formData"
        ref="elForm"
        label-width="90px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="申请日期" prop="APPLY_TIME">
              <el-date-picker
                v-model="formData.APPLY_TIME"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :style="style"
              />
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="申请人" prop="APPLICANT_ID">
               <el-select v-model="formData.APPLICANT_ID" clearable :style="style">
                <el-option
                  v-for="(item, index) in peopleLists"
                  :key="index"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程类型" prop="CATEGORY_ID">
              <el-select v-model="formData.CATEGORY_ID" clearable :style="style">
                <el-option
                  v-for="(item, index) in cateList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程编号" prop="FLOW_ID">
              <el-input v-model.trim="formData.FLOW_ID" :style="style" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产类型" prop="ASSET_TYPE">
              <el-cascader
                v-model="formData.ASSET_TYPE"
                :options="asset"
                ref="assetCas"
                :props="{ label: 'typeName', value: 'id' }"
                clearable
                :style="style"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产名称" prop="ASSET_NAME">
              <el-input v-model.trim="formData.ASSET_NAME" :style="style" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="资产编号" prop="ASSET_NO">
              <el-input v-model.trim="formData.ASSET_NO" :style="style" />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="display:flex; justify-content:flex-end; align-items:center">
            <el-button type="primary" @click="query">
              查询
            </el-button>
            <el-button>
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表单结束 -->
      <!-- tab开始 -->
      <div class="tabs">
        <div
          v-for="(item, index) in options"
          :key="index"
          :class="{active: index === n}"
          @click="change(index)"
        >
          <span class="text">
            {{ item.label }}
          </span>
        </div>
      </div>
      <!-- tab结束 -->
    <!-- 表格开始 -->
     <el-table
      :data="tableData"
      @row-click="goDetail"
      border
      v-loading="loading"
    >
      <el-table-column 
        align="center"
        label="流程ID"
      >
        <template slot-scope="{row}">
          {{ row.procVars.FLOW_ID }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center"
        label="流程类型"
      >
        <template slot-scope="{row}">
          {{ row.procVars.CATEGORY_NAME }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center"
        label="流程组名称"
      >
        <template slot-scope="{row}">
          {{ row.procVars.FLOWGROUP_NAME }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center"
        label="申请人"
      >
        <template slot-scope="{row}">
          {{ row.procVars.APPLICANT_NAME }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center"
        label="发起时间"
      >
        <template slot-scope="{row}">
          {{ row.procVars.APPLY_TIME }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center"
        label="资产类型"
      >
        <template slot-scope="{row}">
          {{ row.procVars.ASSET_TYPE_NAME }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center"
        label="资产编号&名称"
      >
        <div slot-scope="{row}">
          {{ row.noNameArr[0] }}
          <el-popover
            v-if="row.noNameArr.length > 1"
            width="200"
            trigger="hover"
            placement="bottom-end"
          >
            <el-button type="text" size="small" slot="reference">
              ...更多
            </el-button>
            <div class="content">
              <div 
                class="item"
                v-for="(item, index) in row.noNameArr"
                :key="index"
              >
                {{ item }}
              </div>
            </div>
          </el-popover>
        </div>
      </el-table-column>
      <el-table-column 
        align="center"
        label="数量"
      >
        <template slot-scope="{row}">
          {{ row.procVars.AMOUNT }}
        </template>
      </el-table-column>
      <el-table-column 
        align="center"
        label="状态"
      >
        <template slot-scope="{row}">
          {{ statusFormatter(row.procVars.STATUS) }}
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
            @click="cancel(row)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格结束 -->
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
import { getPendingList, getProcessedList,getPeople } from "@/api/assetManagement/assetProcess";
import {
  cateList,
  applyList 
} from '@/api/assetManagement/myAssets'
export default {
  data() {
    return {
      userId: this.$store.state.user.user.userId,
      options: [
        { label: '申请中', value: '0' },
        { label: '已完成', value: '1' },
        { label: '已取消', value: '2' },
        { label: '待处理', value: '3' },
        { label: '参与处理记录', value: '4' },
       
      ],
      n: 3,
      peopleLists:[],
      isExpand: false,
      style: {width: '100%'},
      asset: [],
      cateList: [],
      formData: {
        ASSET_TYPE: []
      },
      tableData: [],
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.getAsset()
    this.getCateList()
    this.peopleList()
    console.log(this.$route.query.tab,'this.$route.query.tab')
    if(this.$route.query.tab){
      this.n=this.$route.query.tab-0
      if(this.n==3){
         this.queryParams.pageNum = 1
      this.pendingList()
      }else if(this.n==4){
        this.queryParams.pageNum = 1
         this.getProcessed()
      }
    }else{
      this.pendingList()
    }
   
  },
  methods: {
    //申请人查询
    peopleList(){
      getPeople().then(res=>{
        this.peopleLists=res.data
      })
    },
    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
      })
    },
    // 流程类型
    getCateList() {
      cateList().then(res => {
        this.cateList = res.data
      })
    },
    // 表格数据
    getProcessed() {
      // 传参数据处理
      const {
        APPLY_TIME,
        CATEGORY_ID,
        FLOW_ID,
        ASSET_TYPE,
        ASSET_NAME,
        ASSET_NO
      } = this.formData
      
      let eq = {
        // STATUS: this.options[this.n].value,
        APPLICANT_ID:  this.formData.APPLICANT_ID
      }
      if (CATEGORY_ID) {
        eq.CATEGORY_ID = CATEGORY_ID
      }
      if (FLOW_ID) {
        eq.FLOW_ID = FLOW_ID
      }
      
      let like = {}
      if (ASSET_TYPE.length) {
        like.ASSET_TYPE = `%${ASSET_TYPE[ASSET_TYPE.length - 1]}%`
      }
      if (ASSET_NAME) {
        like.ASSET_NAME = `%${ASSET_NAME}%`
      }
      if (ASSET_NO) {
        like.ASSET_NO = `%${ASSET_NO}%`
      }

      let lte = {}
      let gte = {}
      if (APPLY_TIME) {
        lte.APPLY_TIME = APPLY_TIME[1]
        gte.APPLY_TIME = APPLY_TIME[0]
      }

      const params = {
        ...this.queryParams,
      userKey:this.$store.state.user.user.userId,
        // userKey:4,
        variableJsonStr: JSON.stringify({
          eq,
          neq: {},
          like,
          lte,
          lt: {},
          gte,
          gt: {}
        })
      }
      getProcessedList(params).then(res => {
        let tableData = res.data.data
        for (let i = 0; i < tableData.length; i ++) {
          if (tableData[i].procVars.ASSET_NO) {
            const noArr = tableData[i].procVars.ASSET_NO.split(',')
            const nameArr = tableData[i].procVars.ASSET_NAME.split(',')
            let arr = []
            noArr.forEach((value, index) => {
              arr.push(value + nameArr[index])
            })
            tableData[i]['noNameArr'] = arr
          } else {
            tableData[i]['noNameArr'] = []
          }   
        }
        this.tableData = tableData
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    pendingList(){
        const {
        APPLY_TIME,
        CATEGORY_ID,
        FLOW_ID,
        ASSET_TYPE,
        ASSET_NAME,
        ASSET_NO
      } = this.formData
      
      let eq = {
        // STATUS: this.options[this.n].value,
        APPLICANT_ID: this.formData.APPLICANT_ID
      }
      if (CATEGORY_ID) {
        eq.CATEGORY_ID = CATEGORY_ID
      }
      if (FLOW_ID) {
        eq.FLOW_ID = FLOW_ID
      }
      
      let like = {}
      if (ASSET_TYPE.length) {
        like.ASSET_TYPE = `%${ASSET_TYPE[ASSET_TYPE.length - 1]}%`
      }
      if (ASSET_NAME) {
        like.ASSET_NAME = `%${ASSET_NAME}%`
      }
      if (ASSET_NO) {
        like.ASSET_NO = `%${ASSET_NO}%`
      }

      let lte = {}
      let gte = {}
      if (APPLY_TIME) {
        lte.APPLY_TIME = APPLY_TIME[1]
        gte.APPLY_TIME = APPLY_TIME[0]
      }

      const params = {
        ...this.queryParams,
         userKey:this.$store.state.user.user.userId,
        // userKey:4,
        variableJsonStr: JSON.stringify({
          eq,
          neq: {},
          like,
          lte,
          lt: {},
          gte,
          gt: {}
        })
      }
      console.log(params,'params')
      getPendingList(params).then(res => {
         let tableData = res.data.data
        for (let i = 0; i < tableData.length; i ++) {
          if (tableData[i].procVars.ASSET_NO) {
            const noArr = tableData[i].procVars.ASSET_NO.split(',')
            const nameArr = tableData[i].procVars.ASSET_NAME.split(',')
            let arr = []
            noArr.forEach((value, index) => {
              arr.push(value + nameArr[index])
            })
            tableData[i]['noNameArr'] = arr
          } else {
            tableData[i]['noNameArr'] = []
          }   
        }
        this.tableData = tableData
        this.total = res.data.total
        this.loading = false
      
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击查询
    query() {
      this.queryParams.pageNum = 1
      this.n=3
      this.pendingList()
    },
    // tab切换
    change(index) {
      console.log(index,'index')
      if (this.n === index) {
        return
      }
      this.n = index
      this.queryParams.pageNum = 1
       if(index==3){
        this.pendingList()
      }else if(index==4){
        this.getProcessed()
      }
      // this.getTableData()
    },
    // 取消
    cancel(row) {

    },
    // 分页
    getList() {
      this.n=3
      this.pendingList()
    },
    // 进入入库详情
    goDetail(row) {
      console.log(row,'scope')
      // return 
       const obj = {
        path: "/assetManagement/detailAssetProcess/process/detailAssetProcess",
        query: {
          // flowId: row.procVars.FLOW_ID,
          // applyName:row.procVars.CATEGORY_NAME,
          // applicantName: row.procVars.APPLICANT_NAME,
          // applyTime: row.procVars.APPLY_TIME,
          status: this.statusFormatter(row.procVars.STATUS),
          taskId: row.taskId,
          processInstanceId: row.processInstanceId,
          deployId: row.deployId,
          tab:this.n,
          assetTypeId: row.procVars.ASSET_TYPE,
          amount: row.procVars.AMOUNT,
          applyUserId: row.procVars.APPLICANT_ID,
          type:row.procVars.type,
          procVars:row.procVars
        }
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    formatter(row) {
      return row.ASSET_NO + row.ASSET_NAME
    },
    statusFormatter(status) {
      if (status=='1') {
        return '申请中'
      }else if(status=='2'){
        return '已完成'
      }else{
      return '已取消'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.apply {
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  
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
    .tabs {
      margin:10px 0;
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
.pagination-container {
  background: transparent;
}
</style>
