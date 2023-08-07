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
        <div class="right">
          <el-button v-if="isPurchase" type="primary" @click="purchaseRequisition">申请采购</el-button>
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
    <!--  采购申请弹窗  -->
    <el-dialog
        v-if="purchaseDialog"
        title="采购申请"
        :visible.sync="purchaseDialog"
        center
        width="30%"
        destroy-on-close
        :close-on-press-escape="false"
        :close-on-click-modal="false"
    >
      <!-- 表单开始 -->
      <el-form ref="purchaseForm" :model="purchaseForm" :rules="purchaseRules" label-width="85px" v-show="isShow">
        <el-form-item label="资产类型:" prop="assetTypeId">
          <!-- 根据资产类型控制数量
             <el-cascader
              v-model="purchaseForm.assetTypeId"
              :options="asset"
              @change="change"
              ref="assetCas"
              :props="{ label: 'typeName', value: 'id' }"
              clearable
              :style="style"
          />-->
          <el-cascader
              v-model="purchaseForm.assetTypeId"
              :options="asset"
              ref="assetCas"
              :props="{ label: 'typeName', value: 'id' }"
              clearable
              :style="style"
          />
        </el-form-item>
        <el-form-item label="名称:" prop="assetName">
          <el-input v-model="purchaseForm.assetName" show-word-limit maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="数量:" prop="amount">
          <el-input-number
              v-model.number="purchaseForm.amount"
              :min="1"
              :step="1"
              :disabled="manageType === 2"
              step-strictly/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="purchaseForm.remark" show-word-limit maxlength="150">
          </el-input>
        </el-form-item>
        <el-form-item label="附件:" prop="url">
          <el-upload
              action
              :on-change="onChange"
              :before-remove="onRemove"
              :file-list="fileList"
              accept=".jpg, .png, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
              :auto-upload="false"
          >
            <el-button type="primary" size="mini">
              上传附件
            </el-button>
          </el-upload>
        </el-form-item>
        <el-button type="text" @click="viewFlow">
          <span style="text-decoration: underline">
            审批流程查看
          </span>
        </el-button>
      </el-form>
      <!-- 表单结束 -->
      <!-- 流程开始 -->
      <div
          style="cursor:pointer"
          v-show="!isShow"
      >
      <span @click="isShow = true">
        <i class="el-icon-arrow-left"></i>
        返回
      </span>
        <div class="flow-wrap">
          <factory-draw-flow
              :FlowConfig="flowList"
              modelType="see"
              ref="flow"
          />
        </div>
      </div>
      <!-- 流程结束 -->
      <div class="txtAlignC dialogBtnInfo">
        <el-button
            :disabled="submitLoading"
            type="primary"
            @click="submitForm">确定
        </el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { assigned } from "@/api/assetManagement/assetProcess";
import { treeselect, queryChildDepts } from "@/api/system/dept";
import { tabOptions } from '../../companyAssets/options'
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import MyDialog from './MyDialog'
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow"
import { fileUpload } from '@/api/assetManagement/companyAssets'
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
import {purchaseInitiate} from "@/api/assetManagement/companyAssets";
import findItemById from '@/utils/findItemById'
import { getFlow } from '@/api/assetManagement/companyAssets'

export default {
  components: {
    Treeselect,
    MyDialog,
    FactoryDrawFlow
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
      CUSTOM_VAR: [],
      /** 采购申请 */
      // 是否需要申请采购
      isPurchase: false,
      // 申请采购弹窗
      purchaseDialog: false,
      asset: [],
      // 采购申请表单
      purchaseForm: {
        assetTypeId: null,
        assetName: null,
        amount: null,
        remark: null,
        url: null
      },
      // 采购申请表单校验规则
      purchaseRules: {
        assetTypeId: [
          {
            required: true,
            message: "资产类型不能为空",
            trigger: "change",
          },
        ],
        assetName: [
          {
            required: true,
            message: "名称不能为空",
            trigger: "blur",
          },
        ]
      },
      style: {width: '100%'},
      fileList: [],
      submitLoading: false,
      flowList: [],
      isShow: true,
      manageType: '',
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
          // total += value.amount
          if (value.amount) {
            total += parseFloat(value.amount)
          }
        })
        return total
      }
    }
  },
  watch: {
    purchaseDialog(value) {
      if (value === false) {
        // 关闭时清空表单
        this.$refs.purchaseForm.resetFields()
        this.isShow = true
      }
    }
  },
  created() {
    this.amount = this.$route.query.amount
    this.getList()
    this.getDept()
    this.getAsset()
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
        if (this.list.length == 0) {
          this.isPurchase = true
        } else {
          this.isPurchase = false
        }
      }).catch(()=>{
        this.isPurchase = false
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
          // res = '闲置中'
          // 2023/06/30 v1.1版本
          res = '在库'
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
    },

    /** 申请采购 */
    purchaseRequisition() {
      this.purchaseDialog = true;
      this.reset()
    },

    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        let arr = res.data
        arr.forEach((m) => {
          if ((m.children ?? '') !== '') {
            m.children.forEach((item) => {
              if ((item.children ?? '') == '') {
                item.disabled = true
              }
            });
          } else if ((m.children ?? '') == '') {
            m.disabled = true
          }
        });
        this.asset = arr
      })
    },

    // 重置采购申请表单
    reset() {
      this.purchaseForm = {
        assetTypeId: null,
        assetName: null,
        amount: null,
        remark: null,
        url: null
      }
    },

    // 上传文件
    onChange(file, fileList) {
      let formData = new FormData()
      formData.append('file', file.raw)
      fileUpload(formData).then(res => {
        // 文件列表格式处理
        let fileArr = this.deepClone(fileList)
        const index = fileArr.findIndex(item => {
          return item.uid == file.uid
        })
        fileArr[index].status = 'success'
        fileArr[index].name = res.data.name
        fileArr[index].url = res.data.url
        this.fileList = fileArr
      })
    },

    // 移除文件
    onRemove(file, fileList) {
      this.fileList = fileList
    },

    // 选择资产，控制数量
    change(value) {
      this.manageType = findItemById(value[value.length - 1], this.asset).manageType
      if (this.manageType === 2) {
        this.purchaseForm.amount = 1
      }
    },

    // 采购申请提交
    submitForm() {
      this.$refs.purchaseForm.validate(valid=>{
        if (valid) {
          const { assetTypeId } = this.purchaseForm
          const data = {
            // ...this.purchaseForm,
            deptId: this.$store.state.user.user.deptId,
            asset: {
              assetName: this.purchaseForm.assetName,
              assetTypeId: assetTypeId[assetTypeId.length - 1],
              amount: this.purchaseForm.amount,
              deptId: JSON.parse(window.localStorage.getItem("user")).deptId,
            },
            assetTypeId: assetTypeId[assetTypeId.length - 1],
            attachmentList: this.fileList.map(item => {
              return {
                name: item.name,
                url: item.url
              }
            }),
            remark: this.purchaseForm.remark,
          }
          this.submitLoading = true
          purchaseInitiate(data).then(res => {
            this.submitLoading = false
            this.purchaseDialog = false
            this.$message.success(res.msg)
            const obj = {
              path: "/assetManagement/assetProcess",
              query:{
                tab:this.$route.query.tab
              }
            };
            this.$tab.closeOpenPage(obj);
          }).catch(() => {
            this.submitLoading = false
            this.purchaseDialog = false
          })
        }
      })
    },

    // 采购申请取消
    cancelFn() {
      this.reset()
      this.fileList = [];
      this.purchaseDialog = false;
    },

    // 查看流程
    viewFlow() {
      this.$refs.purchaseForm.validateField('assetTypeId', error => {
        if (error) {
          return
        }
        this.isShow = false
        const { assetTypeId } = this.purchaseForm
        const params = {
          assetTypeIds: assetTypeId[assetTypeId.length - 1],
          categoryId: 10,
          deptId: this.$store.state.user.user.deptId
        }
        getFlow(params).then(res => {
          this.flowList = JSON.parse(res.data.json).list
        })
      })
    },
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
