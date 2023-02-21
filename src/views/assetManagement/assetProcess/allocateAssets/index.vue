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
        <el-button
          type="primary"
          :disabled="tableData.length == 0"
          @click="sure"
        >
          确定
        </el-button>
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
              {{ amount }}
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
        >

        </el-table-column>
        <el-table-column
          align="center"
          label="归属部门"
          prop="departmentName"
        >
          <template slot-scope="{row}">
            <treeselect
              v-model="row.departmentId"
              :options="dept"
              :normalizer="normalizer"
              ref="deptTree"
              :show-count="true"
              appendToBody
              z-index="9999"
              placeholder="请选择"
            />
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
        :data="list"
        border
        :row-style="rowStyle"
      >
        <el-table-column
          align="center"
          width="90"
        >
          <template slot-scope="{row}">
            <el-radio
              :label="row.id"
              v-model="id"
              @input="input"
            >
              <span></span>
            </el-radio>
          </template>
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
    <!-- 确定弹窗 -->
    <my-dialog
      :customVar="CUSTOM_VAR"
      ref="dialog"
    />
  </div>
</template>
<script>
import { assigned } from "@/api/assetManagement/assetProcess";
import { treeselect, queryChildDepts } from "@/api/system/dept";
import { tabOptions } from '../../companyAssets/options'
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import MyDialog from './MyDialog'

export default {
  components: {
    Treeselect,
    MyDialog
  },
  data() {
    return {
      amount: 0,
      title:'分配资产',
      flowId: this.$route.query.flowId,
      id: '',
      dept: [],
      tableData: [],
      list: [],
      diaForm:{},
      agreeShow:false,
      rejectShow:false,
      url: '',
      name: '',
      type:'',
      attachmentId:'',//取消时的附件id
      CUSTOM_VAR: []
    }
  },
  computed: {
    // 总件数
    total() {
      if (!this.tableData.length) {
        return 0
      } else {
        let total = 0
        this.tableData.forEach(value => {
          total += value.amount
        })
        return total
      }
    }
  },
  created() {
    this.amount = this.$route.query.amount
    this.getList()
    this.getDept()
  },
  methods: {
    // 表格数据
    getList() {
      const params = {
        applyUserId: this.$route.query.applyUserId,
        assetType: this.$route.query.assetTypeId,
        amount: this.$route.query.amount
      }
      assigned(params).then(res => {
        this.list = res.data
      })
    },
    // 部门查询
    getDept() {
      /*treeselect().then(res => {
        this.dept = res.data
      })*/
      let params = {
        deptId:  this.$store.state.user.user.deptId
      }
      queryChildDepts(params).then(res => {
        this.dept = res.data
      })
    },

    normalizer(node) {
      //当子节点也就是children=[]时候去掉子节点
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      };
    },

    // 单选操作
    input() {
      let row = this.deepClone(this.list.find(item => {
        return item.id === this.id
      }))
      row.amount = this.amount
      this.tableData = [row]
    },
    rowStyle({ row }) {
      if (row.id === this.id) {
        return {
          background: '#f5f7fa'
        }
      }
    },
    del(row) {
      this.tableData = []
      this.id = ''
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
        } else if (row.status === 7) {
          if (row.isApplying === 0) {
            return '未入库'
          } else if (row.isApplying === 1) {
            return '待审批入库'
          }
        } else {
          const arr = tabOptions.filter(v => v.type == 'status')
          res = arr.find(v => row.status == v.value).label
          return res
        }
      }
    },
    // 确定
    sure() {
      const { departmentId } = this.tableData[0]
      let departmentName
      if (departmentId) {
        departmentName = this.$refs.deptTree.getNode(departmentId).label
      } else {
        departmentName = null
      }
      this.CUSTOM_VAR = this.tableData.map(item => {
        return {
          id: item.id,
          assetId: item.assetId,
          assetName: item.assetName,
          amount: item.amount,
          departmentId: item.departmentId,
          departmentName
        }
      })
      this.$refs.dialog.open()
    },
    //拒绝
    cancel(){
      this.$router.go(-1)
    },
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
