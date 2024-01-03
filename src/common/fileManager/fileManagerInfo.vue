<template>
  <div>
    <el-form ref="formData" :model="formData" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="物品编号" prop="goodsCode">
            <el-input v-model="formData.goodsCode" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="物品类型" prop="goodsType">
            <el-select v-model="formData.goodsType" placeholder="物品类型" clearable :disabled="readonly">
              <el-option
                v-for="(item,index) in goodsTypes"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.status !== '0'"
              />
              <el-option v-if="!goodsTypes.some(list=> list.dictCode === formData.goodsType)"
                         :label="formData.goodsTypeName"
                         :value="formData.goodsType"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物品名称" prop="goodsName">
            <el-input v-model="formData.goodsName" placeholder="物品名称" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="supplierId" label="供应商">
            <el-select v-model="formData.supplierId" filterable :filter-method="getSupplierList" placeholder="供应商"
                       :disabled="readonly" clearable
                       @change="handleGetSupplier"
                       :title='formData.supplierName'
            >
              <el-option
                v-for="(item,index) in supplierList"
                :key="index"
                :label="item.supplierName"
                :value="item.supplierId"
              />
              <el-option v-if="!supplierList.some(list=> list.supplierId === formData.supplierId)"
                         :label="formData.supplierName"
                         :value="formData.supplierId"
                         :disabled="true"
                       />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第二行-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="型号" prop="goodsModel">
            <el-input v-model="formData.goodsModel" placeholder="型号" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格" prop="goodsSpecifications">
            <el-input v-model="formData.goodsSpecifications" placeholder="规格" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位" prop="goodsUnitId">
            <el-select v-model="formData.goodsUnitId" placeholder="单位" clearable :disabled="readonly">
              <el-option
                v-for="(item,index) in unitList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.status!=='0'"
              />
              <el-option v-if="!unitList.some(list=> list.dictCode === formData.goodsUnitId)"
                         :label="formData.goodsUnit"
                         :value="formData.goodsUnitId"
                         :disabled="true"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第三行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="含税进价" prop="taxBid">
            <el-input v-model="formData.taxBid" placeholder="含税进价" type="number" clearable :disabled="readonly">
              <span slot="append">元</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="税率" prop="taxRateId">
            <el-select v-model="formData.taxRateId" placeholder="请选择税率" clearable :disabled="readonly">
              <el-option
                v-for="(item,index) in taxRateList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.status !== '0'"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="不含税进价" prop="nonTaxBid">
            <el-input v-model="nonTaxBid" :disabled="true" :readonly="readonly">
              <span slot="append">元</span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第四行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="物品分类" prop="goodsClassify">
            <el-cascader
              :disabled="readonly"
              v-model="formData.goodsClassify"
              :filter-method="getCategoryList"
              :options="categoryList"
              :props="{ value: 'categoryId', label: 'categoryName', children: 'childList',checkStrictly: true,emitPath:false,  }"
              placeholder="请选择上级类目"
              :filterable="true"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="箱规" prop="boxGauge">
            <el-input v-model="formData.boxGauge" placeholder="箱规" :readonly="readonly">
              <span slot="append">/箱</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="品牌" prop="goodsBrand">
            <el-input v-model="formData.goodsBrand" placeholder="品牌" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第五行-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="formData.remark" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      第六行-->
      <el-row :gutter="20">
        <el-form-item label="质检资料">
          <el-upload :action="uploadUrl"
                     :show-file-list="false"
                     :on-success="handleAttachmentSuccess"
                     :before-upload="attachmentUploadBeforeHandler"
                     accept=".png,.jpg,.jpeg,application/pdf"
                     multiple
          >
            <el-button type="primary">选择文件<i class="el-icon-upload el-icon--right"/></el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="formData.attachmentInfos.length > 0" style="margin-top: 20px">
          <el-row v-for="(attachment, index) in formData.attachmentInfos" :key="index">
            <el-col :span="9">
              <div style="border: 1px lightgrey solid; padding: 0 10px;height: 36px">
                <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 200px;
                  display: inline-block;" :title="attachment.name"
                >
                  {{ attachment.attachmentPath.split('/').pop() }}
                </div>
                <div style="float: right;">
                  <!--下载附件-->
                  <a :href="attachment.attachmentPath"
                     :download="attachment.attachmentFileName"
                     class="el-icon-download el-icon--right"
                     title="下载附件"
                     style="margin-right: 10px"
                  ></a>
                  <!--                      <a @click="downloadAttachment(attachment.attachmentPath,attachment.attachmentFileName)"-->
                  <!--                         class="el-icon-download el-icon&#45;&#45;right"-->
                  <!--                         style="margin-right: 10px"></a>-->
                  <!--删除附件-->
                  <a href="#" class="el-icon-delete el-icon--right"
                     title="删除附件"
                     @click.prevent="deleteAttachment(index)"
                  ></a>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <el-form-item label="附件名称" label-width="120px"
                            :prop="'attachmentInfos.'+index +'.attachmentFileName'"
                            :rules="[{ required: true, message: '请输入附件名称', trigger: 'blur' }]"
                            style="margin-bottom: 22px"
              >
                <el-input v-model="attachment.attachmentFileName"
                          placeholder="请输入附件名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="附件有效期" label-width="120px">
                <el-date-picker
                  v-model="attachment.attachmentValidityDate"
                  type="date"
                  placeholder="请选择有效期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <!--      第七行-->
      <el-form-item>
        <el-button
          v-show="formData.goodsStatus === 5"
          icon="el-icon-delete"
          @click="enableFiles(formData.goodsId, 3)"
          v-hasPermi="['pms:goods:enable']"
        >启用
        </el-button>

        <el-button
          v-show="formData.goodsStatus === 3"
          icon="el-icon-delete"
          @click="stopFiles(formData.goodsId, 5)"
          v-hasPermi="['pms:goods:enable']"
        >停用
        </el-button>
        <el-button
          type="success"
          @click="overFilesExamin"
          v-show="formData.examineButton && (formData.goodsStatus === 0 || formData.goodsStatus === 1)"
        >审核通过
        </el-button>
        <el-button
          v-show="formData.returnButton && (formData.goodsStatus === 2 || formData.goodsStatus === 4)"
          icon="el-icon-delete"
          @click="deleteFiles(formData.goodsId)"
        >删除
        </el-button>
        <el-button
          v-show="formData.returnButton && (formData.goodsStatus === 0 || formData.goodsStatus === 1)"
          type="danger"
          @click="overFilesCheHui"
        >撤回
        </el-button>
        <el-button
          type="danger"
          v-show="formData.examineButton && (formData.goodsStatus === 0 || formData.goodsStatus === 1)"
          @click="overFilesNoExamin"
        >审核不通过
        </el-button>
        <el-button
                   icon="el-icon-edit"
                   v-show="formData.goodsStatus === 2 || formData.goodsStatus === 3 || formData.goodsStatus === 4"
                   @click="submitForm"
                   v-hasPermi="['pms:goods:edit']"
        >重新提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import supplierApi from '@/api/supplier/supplier'
import categoryApi from '@/api/category/category'
import filesApi from '@/api/Files/files'
import {getDicts} from '@/api/system/dict/data'
import request from '@/utils/request'

export default {
  name: 'fileManagerInfo',
  props: {
    detailsGoodsData: {
      type: Object
    }
  },
  watch: {
    detailsGoodsData: {
      handler(newVal, oldVal) {
        if (newVal && newVal.goodsId) {
          this.formData = JSON.parse(JSON.stringify(newVal))
          this.backData = newVal
          this.queryDetail ={...newVal};

          if(this.formData.goodsClassifyName){
            if(!this.categoryList.some(list=>list.categoryId===newVal.goodsClassify)){
              this.$nextTick(()=>{
                this.$set(this.categoryList,0,{categoryId:newVal.goodsClassify,categoryName:newVal.goodsClassifyName})
              })
            }
          }

        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      backData: {},
      queryDetail:null,
      formData: {
        goodsCode: '',
        goodsType: '',
        goodsName: '',
        supplierId: '',
        goodsModel:'',//型号
        goodsSpecifications:'',//规格
        goodsBrand:'',//品牌
        remark:'',//备注
        supplierName:'',
        goodsUnit: '',
        goodsUnitId: '',
        taxBid: '',
        taxRate: '',
        taxRateId: '',
        boxGauge:'',
        goodsClassify:'',
        attachmentInfos: []
      },
      rules: {
        goodsType: [{ required: true, message: '请输入物品类型', trigger: 'blur' }],
        goodsName: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],

        goodsUnitId: [{ required: true, message: '请选择单位', trigger: 'change' }],
        taxBid: [{ required: true, message: '请输入含税进价', trigger: 'blur' }],
        taxRateId: [{ required: true, message: '请选择税率', trigger: 'change' }],

        boxGauge: [{ required: true, message: '请输入箱规', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '请输入正整数',trigger: 'blur' }
        ],
        goodsClassify: [{ required: true, message: '请选择物品分类', trigger: 'blur' }]
      },
      goodsTypes: [
        // { label: '固定资产', value: 1 },
        // { label: '消耗品', value: 2 },
        // { label: '服务', value: 3 },
        // { label: '销售品', value: 4 }
      ],
      //供应商
      supplierList: [],
      //单位
      unitList: [
        // { label: '支', value: 1 },
        // { label: '套', value: 2 },
        // { label: '个', value: 3 },
        // { label: '盒', value: 4 }
      ],
      //税率
      taxRateList:[
        // {label:'1%',value:"0.01"},
        // {label:'3%',value:"0.03"},
        // {label:'6%',value:"0.06"},
        // {label:'12%',value:"0.12"},
        // {label:'15%',value:"0.15"},
      ],
      categoryList: []
    }
  },
  computed: {
    nonTaxBid(){
      let taxRate = this.taxRateList.find(item => item.dictCode === this.formData.taxRateId)?.dictLabel;
      if (taxRate){
        return this.formData.taxBid / (1 + Number.parseFloat(taxRate)/100);
      }
      return ''
    },
    readonly() {
      return !(this.formData.goodsStatus === 2 || this.formData.goodsStatus === 3
        || this.formData.goodsStatus === 4)
    },
    attachmentInfos() {
      return this.formData.attachmentInfos || []
    },
    uploadUrl() {
      return supplierApi.uploadUrl
    },

    oldFlag(){

    },

    oldStr() {
      let {
        goodsType,
        goodsName,
        supplierId,
        goodsUnitId,
        taxBid,
        taxRateId,
        boxGauge,
        goodsClassify,

        // goodsModel,
        // goodsSpecifications,
        // goodsBrand,
        // remark,
      } = this.detailsGoodsData
      let attachmentFileNames = this.attachmentInfos.map(item => {
        return item.attachmentFileName
      }).join(',')

      let str = goodsType + goodsName + supplierId + goodsUnitId + taxBid + taxRateId + boxGauge + goodsClassify;
      str += + attachmentFileNames
      return str;
    },

    newStr() {
      let {
        goodsType,
        goodsName,
        supplierId,
        goodsUnitId,
        taxBid,
        taxRateId,
        boxGauge,
        goodsClassify,

        // goodsModel,
        // goodsSpecifications,
        // goodsBrand,
        // remark,
      } = this.formData
      let attachmentFileNames = this.attachmentInfos.map(item => {
        return item.attachmentFileName
      }).join(',')

      let str = goodsType + goodsName + supplierId + goodsUnitId + taxBid + taxRateId + boxGauge + goodsClassify;
      str += + attachmentFileNames
      return str;
    },


    needAudit() {
      // 找出必填字段，拼成字符串，来比较是否有变化，必填字段修改后，需要重新审核
      // console.log(this.oldStr)
      // console.log(this.newStr)
      return this.oldStr !== this.newStr
    },

    paramsOldStr() {
      let {
        goodsType,
        goodsName,
        supplierId,
        goodsUnitId,
        taxBid,
        taxRateId,
        boxGauge,
        goodsClassify,

        goodsModel,
        goodsSpecifications,
        goodsBrand,
        remark,
      } = this.detailsGoodsData
      let attachmentFileNames = this.attachmentInfos.map(item => {
        return item.attachmentFileName
      }).join(',')

      let str = goodsType + goodsName + supplierId + goodsUnitId + taxBid + taxRateId + boxGauge + goodsClassify + goodsModel + goodsSpecifications + goodsBrand + remark;
      str += + attachmentFileNames
      return str;
    },

    paramsNewStr() {
      let {
        goodsType,
        goodsName,
        supplierId,
        goodsUnitId,
        taxBid,
        taxRateId,
        boxGauge,
        goodsClassify,

        goodsModel,
        goodsSpecifications,
        goodsBrand,
        remark,
      } = this.formData
      let attachmentFileNames = this.attachmentInfos.map(item => {
        return item.attachmentFileName
      }).join(',')

      let str = goodsType + goodsName + supplierId + goodsUnitId + taxBid + taxRateId + boxGauge + goodsClassify + goodsModel + goodsSpecifications + goodsBrand + remark;
      str += + attachmentFileNames
      return str;
    },

    needParamsAudit() {
      // 找出必填字段，拼成字符串，来比较是否有变化，必填字段修改后，需要重新审核
      // console.log(this.oldStr)
      // console.log(this.newStr)
      return this.paramsOldStr !== this.paramsNewStr
    },


  },
  created() {
    this.getSupplierList()

    this.getCategoryList()
  },
  methods: {
    deleteFiles(goodsId){
      this.$confirm('是否确定删除?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          goodsId: goodsId
        }
        filesApi.deleteFiles(params).then(res => {
          this.$message({
            type:'success',
            message: '操作成功'
          })
          this.closeHandler();
        })
      })
    },
    overFilesExamin(){
      this.$confirm('是否确定审核通过?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          goodsId: this.formData.goodsId,
          goodsStatus: 3,
          examineType:1,
        }
        filesApi.checkPass(params).then(res => {
          this.$message({
            type:'success',
            message: '操作成功'
          })
          this.closeHandler();
        })
      })
    },
    overFilesNoExamin(){
      this.$prompt('请填写审核不通过的原因', "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputValidator: value => !!value,
        inputErrorMessage: "原因不能为空"
      }).then(({ value }) => {
        let params = {
          goodsId: this.formData.goodsId,
          goodsStatus: 2,
          examineType:2,
          remark: value,
        }
        filesApi.checkPass(params).then(res => {
          this.$message({
            type:'success',
            message: '操作成功'
          })
          this.closeHandler();
        })
      })
    },
    overFilesCheHui(){
      this.$confirm('是否确定审核撤回?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          goodsId: this.formData.goodsId,
          goodsStatus: 4,
          examineType:3,
        }
        filesApi.checkPass(params).then(res => {
          this.$message({
            type:'success',
            message: '操作成功'
          })
          this.closeHandler();
        })
      })
    },
    enableFiles(goodsId, status) {
      this.$confirm('是否确定启用?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          goodsId: goodsId,
          goodsStatus: status
        }
        filesApi.changeStatus(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandler();
        })
      })
    },
    stopFiles(goodsId, status) {
      this.$confirm('是否确定停用?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          goodsId: goodsId,
          goodsStatus: status
        }
        filesApi.changeStatus(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandler();
        })
      })
    },
    deleteAttachment(index) {
      this.$confirm('此操作将永久删除该附件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let attachmentId = this.formData.attachmentInfos[index].attachmentId
        if (attachmentId) {
          supplierApi.deleteAttachment(attachmentId).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.formData.attachmentInfos.splice(index, 1)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          // 没有附件id的直接本地删除
          this.$message.success('删除成功')
          this.formData.attachmentInfos.splice(index, 1)
        }
      })
    },
    handleAttachmentSuccess(response, file) {

      const isPNG = file.raw.type === 'image/png';
      const isJPG = file.raw.type === 'image/jpeg';
      const isPDF = file.raw.type === 'application/pdf';

      if (!isPNG && !isJPG && !isPDF) {
        this.$message.error('只能上传PNG、JPG图片或PDF文件');
        return false;
      }

      // 附件上传成功后的处理
      this.formData.attachmentInfos.push({
        attachmentId: '',
        name: response.data.name,
        attachmentPath: response.data.url,
        attachmentFileName: '',
        attachmentValidityDate: ''
      })

    },
    attachmentUploadBeforeHandler(file) {

      let fileRaw = file
      // 附件上传前的处理
      const attachmentNameRule = { required: true, message: '请输入附件名称', trigger: 'blur' }
      this.rules.attachmentInfos = [{ name: attachmentNameRule }]

      const isLt10M = fileRaw.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传营业执照大小不能超过 10MB!')
        return false
      }

      return true
    },
    handleChange(query) {
      this.formData.goodsClassify = query
    },
    /* 获取上级类目列表 */
    getCategoryList() {
      categoryApi.getCategoryList().then(res => {
        this.categoryList = res.rows
        if(this.formData.goodsClassifyName){
          if(!this.categoryList.some(list=>list.categoryId===this.formData.goodsClassify)){
              this.$set(this.categoryList,0,{categoryId:this.formData.goodsClassify,categoryName:this.formData.goodsClassifyName,disabled:true})
          }
        }
      })
    },
    handleGetSupplier(query){
      const queryName = this.supplierList.find(res => res.supplierId === query)?.supplierName
      this.formData.supplierName = queryName
    },
    getSupplierList(query) {
      let params = {
        codeNameKey: query,
        supplierStatus: 3,
      }
      // 查询供应商下拉列表
      request.post('pms/supplier/getSupplierList',params).then((res) => {
        this.supplierList = res.data
        console.log(this.supplierList,'供应商')
      })
    },
    submitForm() {
      this.$confirm('此操作将重新提交数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.nonTaxBid = this.nonTaxBid;
        this.$refs.formData.validate((valid) => {
          if (valid) {
            // let changes = Object.keys(this.formData).filter(key => this.formData[key] !== this.queryDetail[key]);
            // console.log(changes,'修改的字段')
            // this.updateSupplier()
            // // 在这里可以进行表单提交操作，比如调用接口提交数据
            // this.$message({
            //   message: '表单提交成功',
            //   type: 'success'
            // })
            // 表单验证通过，可以在这里进行提交操作
            //
            // console.log(this.needParamsAudit,'参数值')

            if (this.needParamsAudit === false) {
              return this.$message.error('内容未做任何修改，无需提交')
            } else {
              this.updateSupplier()
            }



          } else {
            this.$message.error('表单验证失败，请检查输入内容')
            return false
          }
        })
      })
    },
    updateSupplier(){

      // if(this.needAudit === false){
      //   return this.$message.error('内容未做任何修改，无需提交')
      // }

      this.formData.changeFlag = this.needAudit
      this.formData.goodsTypeName = this.goodsTypes.find(item => item.dictCode === this.formData.goodsType)?.dictLabel
      this.formData.goodsUnit = this.goodsTypes.find(item => item.dictCode === this.formData.goodsUnitId)?.dictLabel
      this.formData.taxRate = this.taxRateList.find(item => item.dictCode === this.formData.taxRateId)?.dictLabel
      filesApi.editFiles(this.formData).then(res=>{
        this.$message.success('编辑成功')
        this.closeHandler()
        // if (res.data.code === 200) {
        //   this.$message.success('编辑成功')
        //   this.closeHandler()
        // } else {
        //   this.$message.error(res.data.message)
        // }
      })
    },
    closeHandler(){
      this.$emit('closeHandler')
    },
    getGoodsTypes(){
      return getDicts('goods_types').then((res) => {
        console.log(res.data)
        this.goodsTypes = res.data
      })
    },
    getTaxRateList(){
      return getDicts('tax_rate').then((res) => {
        this.taxRateList = res.data
      })
    },
    getGoodsUnits(){
      return getDicts('goods_unit').then((res) => {
        this.unitList = res.data
        console.log(this.unitList,'货品单位')
      })
    }
  },
  mounted() {
    this.getGoodsTypes()
    this.getTaxRateList()
    this.getGoodsUnits()
  }
}
</script>

<style scoped>
/deep/ .el-input__inner {
  border: none;
  background-color: rgba(255, 255, 255, 0);
}

/deep/ .el-input-group__append {
  border: none; /* 去除边框 */
  background: none;
}

/deep/ .no-border-span {
  background-color: transparent; /* 去除背景颜色 */
  border-left: none; /* 去除左边框 */
}
</style>
