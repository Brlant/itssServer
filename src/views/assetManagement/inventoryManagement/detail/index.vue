<template>
  <div class="detail">
    <!-- 头部 -->
    <div class="heading">
      <div class="left">
        <i class="el-icon-arrow-left"></i>
        <div class="wrap">
          <div class="item">
            <span class="name">盘点任务编号：</span>
            <span class="value">
              111
            </span>
          </div>
          <div class="item">
            <span class="name">创建时间：</span>
            <span class="value">
              111
            </span>
          </div>
          <div class="item">
            <span class="name">创建人：</span>
            <span class="value">
              111
            </span>
          </div>
          <div class="item">
            <span class="name">备注：</span>
            <span class="value">
              111
            </span>
          </div>
        </div>
      </div>
      <el-button type="text" @click="viewScope">
        查看盘点范围
      </el-button>
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
        <el-table-column 
          align="center"
          label="盘点进度"
        />
        <el-table-column 
          align="center"
          label="资产状态"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <el-button type="text" size="small">
            确认
          </el-button>
          <el-button type="text" size="small" class="redBtn">
            报损
          </el-button>
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
            111
          </p>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MyTabs from '@/components/MyTabs'

export default {
  components: {
    MyTabs
  },
  data() {
    return {
      options: [
        { label: '保管人确认', value: 0 }
      ],
      tabOptions: [
        { label: '待确认', value: 0 },
        { label: '已确认', value: 1 }
      ],
      tab: 0,
      active: 0,
      tableData: [{}],
      dialogVisible: false
    }
  },
  methods: {
    change() {

    },
    viewScope() {
      this.dialogVisible = true
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
