<template>
  <div class="company">
    <!-- 筛选项开始 -->
    <section class="search">
      <div class="heading">
        <div class="left" @click="isExpand = !isExpand">
          <span>
            {{ isExpand ? '收起筛选' : '展开筛选' }}
          </span>
          <i :class="['el-icon-arrow-down', {up: isExpand}]"></i>
        </div>
        <div class="right">
          <!-- <el-button type="primary" size="small" >
            批量管理
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="handleImport"
          >
            批量导入
          </el-button>
          <el-button
            type="primary"
            size="small"
            :disabled="exportLoading"
            @click="handleExport"
          >
            导出
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="$router.push('/assetManagement/companyAssets/companyAssets-auth/add')"
          >
            录入资产
          </el-button>
        </div>
      </div>
      <div :class="['form', {expand: isExpand}]">
        <el-form
          :model="formData"
          ref="elForm"
          label-width="100px"
        >
          <el-row>
            <el-col :span="span">
              <el-form-item label="购入日期" prop="purchasingDate">
                <el-date-picker
                  v-model="formData.purchasingDate"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :style="style"
                />
              </el-form-item>
            </el-col>
<!--            <el-col :span="span">
              <el-form-item label="保管人" prop="holderName">
                <el-input v-model.trim="formData.holderName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="保管员" prop="keeper">
                <el-input v-model.trim="formData.keeper" :style="style" />
              </el-form-item>
            </el-col>-->
            <el-col :span="span">
              <el-form-item label="持有人" prop="holderName">
                <el-input v-model.trim="formData.holderName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="录入人" prop="creatorName">
                <el-input v-model.trim="formData.creatorName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="管理方式" prop="manageType">
                <el-select v-model="formData.manageType" clearable :style="style">
                  <el-option value="1" label="耗材" />
                  <el-option value="2" label="固定资产" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="资产类型" prop="assetTypeId">
                <el-cascader
                  v-model="formData.assetTypeId"
                  :options="asset"
                  ref="assetCas"
                  :props="{ label: 'typeName', value: 'id', checkStrictly: true }"
                  clearable
                  :style="style"
                />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="资产名称" prop="assetName">
                <el-input v-model.trim="formData.assetName" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="资产品牌" prop="brand">
                <el-input v-model.trim="formData.brand" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="资产型号" prop="model">
                <el-input v-model.trim="formData.model" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="归属部门:" prop="departmentId">
                <treeselect
                  v-model="formData.departmentId"
                  :options="dept"
                  :normalizer="normalizer"
                  ref="deptTree"
                  :show-count="true"
                  placeholder="请选择"
                />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="资产编号" prop="assetId">
                <el-input v-model.trim="formData.assetId" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="财务编号" prop="financialNo">
                <el-input v-model.trim="formData.financialNo" :style="style" />
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="到期提醒" prop="certificateType">
                <el-select v-model="formData.certificateType" clearable :style="style">
                  <el-option value="1" label="证书到期" />
                  <el-option value="2" label="使用期限到期" />
                  <el-option value="3" label="保养到期" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="span">
              <el-form-item label="折旧统计" prop="depreciation">
                <el-date-picker
                  v-model="formData.depreciation"
                  value-format="yyyy-MM"
                  type="monthrange"
                  range-separator="至"
                  start-placeholder="开始月份"
                  end-placeholder="结束月份"
                  :style="style"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="display:flex; justify-content:flex-end; align-items:center">
              <el-button type="primary" size="small" @click="query">
                查询
              </el-button>
              <el-button size="small" @click="reset">
                重置
              </el-button>
              <!-- <el-button type="success" size="small">
                导出Excel
              </el-button> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
    <!-- 筛选项结束 -->
    <!-- tab切换 -->
    <div class="tabs">
      <my-tabs
        v-model="tab"
        :options="tabOptions"
        @change="change"
      />
    </div>
    <!-- 计算部分开始 -->
    <div class="calc">
      <div class="item">
        <span class="label">
          <b>总计</b>
          (此处精确到小数点后两位)
        </span>
      </div>
      <div class="specific">
        <div class="item">
          <span class="label">税后价格</span>
          <span class="value">
            {{ calcData.afterTaxPriceTotal }}
          </span>
        </div>
        <div class="item">
          <span class="label">期间折旧</span>
          <span class="value">
            {{ calcData.periodDepreciationTotal }}
          </span>
        </div>
        <div class="item">
          <span class="label">
            截止至{{ deadLine }}
          </span>
        </div>
        <div class="item">
          <span class="label">累计折旧</span>
          <span class="value">
            {{ calcData.depreciationTotal }}
          </span>
        </div>
        <div class="item">
          <span class="label">资产净值</span>
          <span class="value">
            {{ calcData.surplusValueTotal }}
          </span>
        </div>
      </div>
    </div>
    <!-- 计算部分结束 -->
    <!-- 表格部分 -->
    <asset-table
      :data="tableData"
      @delRow="delRow"
      :flag="tab"
      ref="table"
    />
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!--  批量导入  -->
    <el-dialog
      title="批量导入"
      width="50%"
      v-if="importDialog"
      :visible.sync="importDialog"
      destroy-on-close
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="import-dialog"
      @close="closeFn"
    >
      <div v-if="!imported" class="h450">
        <el-form
          :model="importForm"
          :rules="importRules"
          ref="importForm"
          :inline="false"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="资产类型选择" prop="assetTypeId">
                <el-cascader
                  v-model="importForm.assetTypeId"
                  :options="filterAsset"
                  ref="assetCas"
                  :props="{ label: 'typeName', value: 'id'}"
                  clearable
                  :style="style"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item
                v-if="importForm.assetTypeId"
                label="请选择要导入的数据文件（Excel格式）"
                prop="fileList"
              >
                <br>
                <el-upload
                  v-loading="importLoading"
                  action
                  list-type="picture-card"
                  :on-change="onChange"
                  :on-remove="onRemove"
                  :file-list="importForm.fileList"
                  accept=".xlsx"
                  :show-file-list="false"
                  :auto-upload="false"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-alert
          v-if="failMsg"
          class="mb10"
          :title="failMsg"
          type="error"
          :closable="false">
        </el-alert>
        <el-alert
          title="文件上传要求"
          type="success"
          :closable="false">
        </el-alert>
        <ol class="contentText">
          <li> 文件格式详见
            <a href="./文件上传模板.xlsx" download="文件上传模板.xlsx" class="fileTmpl">
              文件上传模板
            </a>
            ，模板中
            <span class="redFont">*</span> 为必填项
          </li>
          <li>单次上传文件不得超过200M</li>
        </ol>
      </div>
      <div v-if="imported" class="flexC h450">
          <div v-if="progressLoading" class="flexC">
            <el-progress
              :show-text="false"
              :stroke-width="10"
              style="width:50%"
              :percentage="percentage"
            ></el-progress>
          </div>
          <div v-else>
            <span>上传成功</span>
            <i type="success" size="50" class="el-icon-circle-check import-success"/>
          </div>
      </div>

        <div class="txtAlignR dialogBtnInfo">
          <el-button v-if="imported" type="primary" @click="closeFn('import')">确定</el-button>
          <el-button v-if="!imported" @click="closeFn">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
import {
  queryAssetList,
  getTotal,
  updateAssets,
  fileUpload,
  importAsset,
  exportAsset
} from '@/api/assetManagement/companyAssets'
import { treeselect, queryChildDepts } from "@/api/system/dept"
import Treeselect from "@riophae/vue-treeselect"
import "@riophae/vue-treeselect/dist/vue-treeselect.css"
import MyTabs from '@/components/MyTabs'
import { tabOptions } from './options'
import AssetTable from './AssetTable'
import moment from 'moment'

export default {
  components: {
    Treeselect,
    MyTabs,
    AssetTable
  },
  data() {
    return {
      isExpand: false,
      span: 6,
      style: {width: '100%'},
      asset: [],
      dept: [],
      formData: {
        assetTypeId: []
      },
      tabOptions,
      tab: 0,
      tableData: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      paramData: {},
      calcData: {},

      /**批量导入*/
      importDialog: false,
      importForm: {
        assetTypeId:'',
        fileList:[],
      },
      importRules:{
        assetTypeId: [
          { required: true, trigger: 'change', message: '请选择资产类型' }
        ],
        fileList: [
          { required: true, trigger: 'change', message: '请上传文件' }
        ],
      },
      imported: false,
      failMsg: '',
      filterAsset: [],
      importLoading: false,

      /** 批量导入成功进度条 */
      percentage: 0,
      progressLoading: false,

      exportLoading: false
    }
  },
  created() {
    // tab回显
    const { tab } = this.$route.params
    this.tab = tab ? tab - 0 : 0
  },
  computed: {
    deadLine() {
      if (this.paramData.endDate) {
        return moment(this.paramData.endDate, 'YYYY-MM').format('YYYY年M月')
      } else {
        return moment().format('YYYY年M月')
      }
    }
  },
  mounted() {
    this.getAsset()
    this.getDept()
    this.getTableData()
    this.calc()
  },
  methods: {
    // 资产类型查询
    getAsset() {
      queryAsset().then(res => {
        this.asset = res.data
        let arr = res.data
        arr.forEach((m) => {
          if ((m.children ?? '')!=='') {
            m.children.forEach((item) => {
              if ((item.children ?? '')=='') {
                item.disabled = true
              }
            });
          }else if ((m.children ?? '')=='') {
            m.disabled = true
          }
        });
        this.filterAsset = arr
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

    // 表格数据
    getTableData() {
      this.$refs.table.startLoading()
      // 传参数据的一些处理
      let data = {
        ...this.formData
      }
      if (data.purchasingDate) {
        data.purchasingDateStart = data.purchasingDate[0]
        data.purchasingDateEnd = data.purchasingDate[1]
        delete data.purchasingDate
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
      if (data.depreciation) {
        data.startDate = data.depreciation[0]
        data.endDate = data.depreciation[1]
        delete data.depreciation
      }
      const tabData = tabOptions.find(v => {
        return this.tab == v.name
      })
      if (tabData.type == 'status') {
        data.status = tabData.value
      } else if (tabData.type == 'specialStatus') {
        data.specialStatus = tabData.value
      }
      this.paramData = data
      queryAssetList(this.paramData, this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = res.total
        this.$refs.table.endLoading()
      }).catch(() => {
        this.$refs.table.endLoading()
      })
    },
    // 计算
    calc() {
      getTotal(this.paramData).then(res => {
        this.calcData = res.data
      })
    },
    // 点击查询
    query() {
      this.queryParams.pageNum = 1
      this.getTableData()
      this.calc()
    },
    // 重置表单
    reset() {
      this.queryParams.pageNum = 1
      this.$refs.elForm.resetFields()
      this.getTableData()
      this.calc()
    },
    // 删除
    delRow(row) {
      const data = {
        ...row,
        status: 0
      }
      updateAssets(data).then(res => {
        this.$message.success(res.msg)
        this.getTableData()
        this.calc()
      })
    },
    // tab切换
    change() {
      this.queryParams.pageNum = 1
      this.getTableData()
      this.calc()
    },
    // 分页
    getList() {
      this.getTableData()
    },

    onChange(file, fileList) {
      this.importForm.fileList = fileList
      let fileLength = this.importForm.fileList.length
      const isSize = file.size / 1024 / 1024 < 200
      if (!isSize)
      {
        this.$message.warning('仅支持Excel格式,不超过200MB的文件!')
        this.importForm.fileList.splice(fileLength - 1, 1)
        return
      }
      let flatArr = this.getFlatArr(this.filterAsset)
      let assetTypeId = this.importForm.assetTypeId[this.importForm.assetTypeId.length - 1]
      let manageType = flatArr.find(item => item.id == assetTypeId).manageType
      let formData = new FormData()
      formData.append('file', file.raw)
      formData.append('assetTypeId', assetTypeId)
      formData.append('manageType', manageType)
      // console.log("formData", formData)
      this.importLoading = true
      importAsset(formData)
        .then(res =>
        {
          this.importLoading = false
          if (res.code == 200)
          {
            if (this.$refs['importForm']) {
              this.$refs['importForm'].resetFields();
            }
            this.imported = true
            this.progressLoading = true
            let timer = setInterval(() => {
              this.percentage += 10
              if (this.percentage = 100) {
                clearInterval(timer)
                this.progressLoading = false
              }
            }, 100)
          }
          else
          {
            console.log("res.msg",res.msg)
            this.failMsg = res.msg
          }
        })
        .catch((err) =>
        {
          this.importLoading = false
          this.failMsg = err
        })
    },
    getFlatArr(arr) {
      return arr.reduce((a, item) => {
        let flatArr = [...a, item];

        // 可以在此处限制各种需要的条件，在展示字段前加空格，——之类的，以及其它情况

        if (item.children) {
          flatArr = [...flatArr, ...this.getFlatArr(item.children)];
        }
        return flatArr;
      }, []);
    },

    onRemove(){

    },

    // 批量导入
    handleImport(){
      this.importDialog = true
    },

    // 关闭批量导入
    closeFn(type){
      if (this.$refs['importForm']) {
        this.$refs['importForm'].resetFields();
      }
      this.percentage = 0;
      this.imported = false;
      this. progressLoading = false;
      this.importDialog = false;
      if (type == "import") {
        this.query()
      }
    },

    // 导出
    handleExport(){
      // this.$refs.table.startLoading()
      // 传参数据的一些处理
      let data = {
        ...this.formData
      }
      if (data.purchasingDate) {
        data.purchasingDateStart = data.purchasingDate[0]
        data.purchasingDateEnd = data.purchasingDate[1]
        delete data.purchasingDate
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
      if (data.depreciation) {
        data.startDate = data.depreciation[0]
        data.endDate = data.depreciation[1]
        delete data.depreciation
      }
      const tabData = tabOptions.find(v => {
        return this.tab == v.name
      })
      if (tabData.type == 'status') {
        data.status = tabData.value
      } else if (tabData.type == 'specialStatus') {
        data.specialStatus = tabData.value
      }
      this.paramData = data
      this.exportLoading = true
      exportAsset(this.paramData).then(res=>{
        this.exportLoading = false
        let blob = new Blob([res], {
          // type:"application/vnd.ms-excel",
          type: "application/octet-stream;charset=UTF-8",
        });
        console.log(blob);
        let timeString =  moment().format("YYYYMMDDhhmmss");
        const fileName = `资产管理${timeString}.xlsx` // 下载文件名称
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        this.$message.success("导出成功！");
        this.exportLoading = false

      }).catch(()=>{
        this.exportLoading = false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.company {
  .search {
    padding: 10px;
    background: #fff;
    .heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .left {
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
    .form {
      height: 0;
      overflow: hidden;
      transition: all .4s;
    }
    .expand {
      height: auto;
      overflow: visible;
    }
  }
  .tabs {
    padding: 10px;
  }
  .calc {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    .item {
      margin-right: 50px;
      &:last-child {
        margin-right: 0;
      }
      .label {
        color: #A8B5C1;
      }
      .value {
        margin-left: 5px;
      }
    }
    .specific {
      display: flex;
    }
  }
}
.el-row {
  display:flex;
  flex-wrap: wrap;
}
.pagination-container {
  background: transparent;
}

.import-dialog {
  .el-alert--success.is-light {
    background-color: #ccecfb;
    color: #2984e7;
  }

  .contentText li {
    color: #999;
    padding: 2px 0;

    .fileTmpl {
      color: #2984e7;
    }

    .redFont {
      color: red;
    }
  }

  .flexC {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    .import-success {
      display: block;
      font-size: 50px;
      color: #3de58f;
      margin-top: 20px;
    }
  }

  .h450 {
    height: 450px;
  }
}
</style>
