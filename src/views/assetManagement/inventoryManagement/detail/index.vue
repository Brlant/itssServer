<template>
  <div class="detail">
    <!-- 头部 -->
    <div class="heading">
      <div class="left">
        <i class="el-icon-arrow-left" @click="goBack"></i>
        <div class="wrap">
          <div class="item">
            <span class="name">盘点任务编号：</span>
            <span class="value">
              {{
                titleInfo.id
              }}
            </span>
          </div>
          <div class="item">
            <span class="name">创建时间：</span>
            <span class="value">
              {{
                titleInfo.createTime
              }}
            </span>
          </div>
          <div class="item">
            <span class="name">创建人：</span>
            <span class="value">
              {{
                titleInfo.creatorName
              }}
            </span>
          </div>
          <div class="item">
            <span class="name">备注：</span>
            <span class="value">
              {{
                titleInfo.remark
              }}
            </span>
          </div>
        </div>
      </div>

<!--      暂时不做
      <el-button type="text" @click="viewScope">
        查看盘点范围
      </el-button>-->

    </div>
    <!-- tab部分 -->
    <div class="tab-box">
      <my-tabs
        v-model="tab"
        :options="options"
        @change="change"
      />
    </div>
    <!-- 表格部分 -->
    <div class="main">
      <my-tabs
        v-model="active"
        :options="tabOptions"
        size="small"
        @change="changeStatus"
      />
      <el-table
        :data="tableData"
        border
        class="table"
      >
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
          label="资产类型"
          prop="assetTypeName"
        />
        <el-table-column
          align="center"
          label="保管人"
          prop="keeper"
        />
<!--        <el-table-column
          align="center"
          label="盘点进度"
        />-->
        <el-table-column
          align="center"
          label="资产状态"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="{row}">
            <template v-if="active==0">
              <el-button
                type="text"
                size="small"
                :disabled="confirmLoading"
                @click="onConfirm(row)"
              >
                确认
              </el-button>
              <el-button
                type="text"
                size="small"
                class="redBtn"
                @click="onScrap(row)"
              >
                报损
              </el-button>
            </template>
            <span v-if="active==1">
              {{ formatStatus(row.status) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 盘点范围弹窗 -->
    <el-dialog
      title="盘点范围"
      :visible.sync="dialogVisible"
      center
      width="30%"
      destroy-on-close
    >
      <div class="content">
        <div class="row">
          <p class="row-name">涉及资产类型</p>
          <p class="row-value">
            111
          </p>
        </div>
        <div class="row">
          <p class="row-name">涉及资产状态</p>
          <p class="row-value">
            222
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--  盘点确认弹框  -->
    <el-dialog>

    </el-dialog>

    <!--  盘点报损弹框  -->
      <inventory-scrap
        ref="scrap"
        :info="info"
        @success="onScrapSuccess"
      >
      </inventory-scrap>
  </div>
</template>

<script>
import MyTabs from '@/components/MyTabs'
import {getById,assetConfirm} from "@/api/assetManagement/inventoryManagement";
import inventoryScrap from "./inventoryScrap";
export default {
  components: {
    MyTabs,
    inventoryScrap
  },
  data() {
    return {
      options: [
        {
          label: '保管人确认',
          value: 1
        },
        {
          label: '执行人确认',
          value: 2
        },
        {
          label: '资产管理',
          value: 3
        },
      ],
      tabOptions: [
        { label: '待确认', value: 1 },
        { label: '已确认', value: 2 }
      ],
      tab: 0,
      active: 0,
      titleInfo:{},
      tableData: [],
      dialogVisible: false,
      loading: false,
      confirmLoading: false,
      info: {},
    }
  },
  created() {
    this.getTableData()
  },

  methods: {
    // 表格数据
    getTableData(){
      let data = {
        id: this.$route.query.id,
        roleType: this.tab + 1,
        status: this.active + 1,
      }
      this.loading = true
      getById(data).then(res=>{
        this.titleInfo = res.data
        this.tableData = res.data.list
        this.loading = false
      }).catch(() =>
      {
        this.loading = false
      })
    },

    viewScope() {
      this.dialogVisible = true
    },

    // 确认
    onConfirm(row)
    {
      const params = {
        inventoryInfoId: row.inventoryInfoId,
        roleType: this.tab + 1,
      }
      this.confirmLoading = true;
      assetConfirm(params)
        .then(res =>
        {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.getTableData()
          this.confirmLoading = false;
        })
        .catch(() =>
        {
          this.confirmLoading = false;
        })
    },

    // 报损
    onScrap(row){
      this.info = row;
      this.$refs.scrap.open()
    },

    onScrapSuccess(){
      this.getTableData()
    },

    // tab切换
    change() {
      // this.queryParams.pageNum = 1
      this.getTableData()
    },

    // 确认状态tab切换
    changeStatus(){
      this.getTableData()
    },

    // 分页
    getList() {
      this.getTableData()
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },

    // 格式化状态
    formatStatus(val){
      let label = ''
      if(val){
        switch (val) {
          case 1:
            label = '待确认'
            break
          case 2:
            label = '已确认'
            break
          case 3:
            label = '已报损'
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
.detail {
  .heading {
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      i {
        cursor: pointer;
        margin-right: 8px;
      }
      .wrap {
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
  .tab-box {
    padding: 10px 15px;
  }
  .main {
    background: #fff;
    padding: 15px;
    .table {
      margin-top: 10px;
      .redBtn {
        color: #f56c6c;
      }
    }
  }
  .content {
    padding: 0 15px;
    .row {
      margin-bottom: 25px;
      &:last-child {
        margin-bottom: 0;
      }
      .row-name {
        color: #8294ad;
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
