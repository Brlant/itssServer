<template>
  <div class="apply">
    <div class="heading">
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
            <el-button @click="reset">
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表单结束 -->
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
        prop="FLOW_ID"
      />
      <el-table-column 
        align="center"
        label="流程类型"
        prop="CATEGORY_NAME"
      />
      <el-table-column 
        align="center"
        label="流程组名称"
        prop="FLOWGROUP_NAME"
      />
      <el-table-column 
        align="center"
        label="申请人"
        prop="APPLICANT_NAME"
      />
      <el-table-column 
        align="center"
        label="发起时间"
        prop="APPLY_TIME"
      />
      <el-table-column 
        align="center"
        label="资产类型"
        prop="ASSET_TYPE_NAME"
      />
      <el-table-column 
        align="center"
        label="资产编号&名称"
      >
        <div slot-scope="{row}">
          {{ row.NO_NAME_ARR[0] }}
          <el-popover
            v-if="row.NO_NAME_ARR.length > 1"
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
                v-for="(item, index) in row.NO_NAME_ARR"
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
        prop="AMOUNT"
      />
      <el-table-column 
        align="center"
        label="状态"
        :formatter="statusFormatter"
      />
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
import {
  cateList,
  applyList 
} from '@/api/assetManagement/myAssets'

export default {
  data() {
    return {
      userId: this.$store.state.user.user.userId,
      options: [
        { label: '审批中', value: '1' },
        { label: '已完成', value: '2' },
        { label: '已取消', value: '3' }
      ],
      n: 0,
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
    this.getTableData()
  },
  methods: {
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
    getTableData() {
      this.loading = true
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
        STATUS: this.options[this.n].value,
        APPLICANT_ID: this.userId + ''
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
        userKey: this.userId,
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
      applyList(params).then(res => {
        let tableData = res.data.data.map(item => {
          return item.procVars
        })
        // 处理资产编号与名称
        for (let i = 0; i < tableData.length; i ++) {
          const noArr = tableData[i].ASSET_NO.split(',')
          const nameArr = tableData[i].ASSET_NAME.split(',')
          let arr = []
          noArr.forEach((value, index) => {
            arr.push(value + nameArr[index])
          })
          tableData[i]['NO_NAME_ARR'] = arr 
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
      this.getTableData()
    },
    // 重置表单
    reset() {
      this.$refs.elForm.resetFields()
      this.getTableData()
    },
    // tab切换
    change(index) {
      if (this.n === index) {
        return
      }
      this.n = index
      this.queryParams.pageNum = 1
      this.getTableData()
    },
    // 取消
    cancel(row) {

    },
    // 分页
    getList() {
      this.getTableData()
    },
    // 进入资产申领
    goDetail(row) {
      this.$router.push({
        path: '/assetManagement/myAssets/myAssets-auth/applyInfo'
      })
    },
    statusFormatter(row) {
      if (row.STATUS) {
        return this.options.find(v => v.value === row.STATUS).label
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
</style>
