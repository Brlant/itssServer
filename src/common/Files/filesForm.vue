<template>
  <el-dialog :visible="dialogAddFiles" :title="formTitle" width="60%" @close="closeAddFiles">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <template>
      <el-form ref="formRef" :model="formData" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <!-- 第一行 -->
          <el-col :span="8">
            <el-form-item label="物品类型" prop="goodsType">
              <el-select v-model="formData.goodsType" placeholder="物品类型" clearable>
                <el-option
                  v-for="(item,index) in goodsTypes"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictCode"
                  :disabled="item.status !== '0'"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物品名称" prop="goodsName">
              <el-input v-model="formData.goodsName" placeholder="物品名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="supplierId" label="供应商">
              <el-select v-model="formData.supplierId" filterable :filter-method="getSupplierList" placeholder="供应商"
                         @change="handleGetSupplier"
                         clearable>
                <el-option
                  v-for="(item,index) in supplierList"
                  :key="index"
                  :label="item.supplierName"
                  :value="item.supplierId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第二行 -->
          <el-col :span="8">
            <el-form-item label="型号" prop="goodsModel">
              <el-input v-model="formData.goodsModel" placeholder="型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格" prop="goodsSpecifications">
              <el-input v-model="formData.goodsSpecifications" placeholder="规格"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="goodsUnitId">
              <el-select v-model="formData.goodsUnitId" placeholder="请选择单位" clearable>
                <el-option
                  v-for="(item,index) in unitList"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictCode"
                  :disabled="item.status !== '0'"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第三行 -->
          <el-col :span="8">
            <el-form-item label="含税进价" prop="taxBid">
              <el-input v-model="formData.taxBid" placeholder="含税进价" type="number" clearable @input="countNonTaxBid">
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率" prop="taxRateId">
              <el-select v-model="formData.taxRateId" placeholder="请选择税率" clearable
                         @change="countNonTaxBid">
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
              <el-input v-model="formData.nonTaxBid" :disabled="true" readonly>
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第四行 -->
          <el-col :span="8">
            <el-form-item label="物品分类" prop="goodsClassify">
              <el-cascader
                v-model="formData.goodsClassify"
                :filter-method="getCategoryList"
                :options="categoryList"
                :props="{ value: 'categoryId', label: 'categoryName', children: 'childList',checkStrictly: true,emitPath:false,   }"
                placeholder="请选择上级类目"
                :filterable="true"
                @change="handleChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="箱规" prop="boxGauge">
              <el-input v-model="formData.boxGauge" placeholder="箱规" type="number">
                <span slot="append">/箱</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="formData.brand" placeholder="品牌"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第五行 -->
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="formData.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!--        附件上传-->
        <el-row :gutter="20">
          <el-form-item label="其他附件">
            <el-upload :action="uploadUrl"
                       :show-file-list="false"
                       :on-success="handleAttachmentSuccess"
                       :before-upload="attachmentUploadBeforeHandler"
                       accept=".png,.jpg,.jpeg,application/pdf"
                       multiple>
              <el-button type="primary">选择文件<i class="el-icon-upload el-icon--right"/></el-button>
            </el-upload>
          </el-form-item>
          <el-form-item v-show="formData.attachmentInfos.length > 0" style="margin-top: 20px">
            <el-row v-for="(attachment, index) in formData.attachmentInfos" :key="index">
              <el-col :span="9">
                <div style="border: 1px lightgrey solid; padding: 0 10px;height: 36px">
                  <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 100px;
                  display: inline-block;" :title="attachment.name">
                    {{ attachment.attachmentPath.split('/').pop() }}
                  </div>
                  <div style="float: right;">
                    <!--下载附件-->
                    <a :href="attachment.attachmentPath"
                       :download="attachment.attachmentFileName"
                       class="el-icon-download el-icon--right"
                       title="下载附件"
                       style="margin-right: 10px"></a>
                    <!--                      <a @click="downloadAttachment(attachment.attachmentPath,attachment.attachmentFileName)"-->
                    <!--                         class="el-icon-download el-icon&#45;&#45;right"-->
                    <!--                         style="margin-right: 10px"></a>-->
                    <!--删除附件-->
                    <a href="#" class="el-icon-delete el-icon--right"
                       title="删除附件"
                       @click.prevent="deleteAttachment(index)"></a>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <el-form-item label="附件名称" label-width="120px"
                              :prop="'attachmentInfos.'+index +'.attachmentFileName'"
                              :rules="[{ required: true, message: '请输入附件名称', trigger: 'blur' }]"
                              style="margin-bottom: 22px">
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
                    value-format="yyyy-MM-dd"
                    placeholder="请选择有效期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <!-- 提交按钮 -->
          <el-col>
            <el-button type="primary" @click="submitForm" :disabled="doing">提交</el-button>
            <el-button @click="closeAddFiles">返回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </el-dialog>
</template>

<script>
import filesApi from '@/api/Files/files'
import supplierApi from '@/api/supplier/supplier'
import categoryApi from '@/api/category/category'
import {getDicts} from '@/api/system/dict/data'
import request from '@/utils/request'

export default {
  name: "filesForm",
  props: {
    dialogAddFiles: {
      type: Boolean,
      default: "",
    }
  },
  watch: {
    dialogAddFiles: {
      handler(val) {
        if (val) {
          // 重新打开新建对话框时，表单重置
          this.$refs.formRef && this.$refs.formRef.resetFields();
        }
      },
      immediate: true,
    }
  },

  data() {
    return {
      doing:false,
      formTitle: "基本信息",
      formData: {
        taxRateId: '',
        goodsType: '',
        goodsName: '',
        supplierId: '',
        supplierCode:'',
        goodsUnitId: '',
        taxBid: '',
        taxRate: '',
        boxGauge: '',
        brand: '',
        goodsClassify: '',
        remark: '',
        goodsSpecifications: '',
        goodsModel: '',
        attachmentInfos: [],
      },
      rules: {
        goodsType: [{required: true, message: '请输入物品类型', trigger: 'blur'}],
        goodsName: [{required: true, message: '请输入物品名称', trigger: 'blur'}],
        supplierId: [{required: true, message: '请选择供应商', trigger: 'change'}],

        goodsUnitId: [{required: true, message: '请选择单位', trigger: 'change'}],
        taxBid: [{required: true, message: '请输入含税进价', trigger: 'blur'}],
        taxRateId: [{required: true, message: '请选择税率', trigger: 'change'}],

        boxGauge: [
          {required: true, message: '请输入箱规', trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur'}
        ],
        goodsClassify: [{required: true, message: '请选择物品分类', trigger: 'blur'}],
        attachmentInfos: [{required: true, message: '请选择附件', trigger: 'blur'}]
      },
      //物品类型
      goodsTypes: [
        // {label:'固定资产',value:1},
        // {label:'消耗品',value:2},
        // {label:'服务',value:3},
        // {label:'销售品',value:4},
      ],
      //单位
      unitList: [
        // {label:'支',value:1},
        // {label:'套',value:2},
        // {label:'个',value:3},
        // {label:'盒',value:4},
      ],
      //税率
      taxRateList: [
        // {label:'1%',value:"0.01"},
        // {label:'3%',value:"0.03"},
        // {label:'6%',value:"0.06"},
        // {label:'12%',value:"0.12"},
        // {label:'15%',value:"0.15"},
      ],
      //供应商
      supplierList: [],
      //物品分类
      categoryList: [],
    }
  },
  computed: {
    uploadUrl() {
      return supplierApi.uploadUrl
    }
  },
  created() {
    this.getCategoryList()
    this.getSupplierList();
    this.getTaxRateList()
    this.getGoodsTypes()
    this.getGoodsUnits()
  },
  methods: {
    countNonTaxBid(val) {
      let nonTaxBid = ''
      let taxRate = this.taxRateList.find(item => item.dictCode === this.formData.taxRateId)?.dictLabel;
      if (taxRate && this.formData.taxBid) {
        nonTaxBid = this.formData.taxBid / (1 + Number.parseFloat(taxRate) / 100);
        // nonTaxBid = nonTaxBid.toFixed(3)
      }

      this.formData.nonTaxBid = nonTaxBid
    },
    getGoodsUnits() {
      return getDicts('goods_unit').then((res) => {
        this.unitList = res.data
      })
    },
    getGoodsTypes() {
      return getDicts('goods_types').then((res) => {
        this.goodsTypes = res.data
      })
    },
    getTaxRateList() {
      return getDicts('tax_rate').then((res) => {
        this.taxRateList = res.data
      })
    },
    /* 获取上级类目列表 */
    getCategoryList() {
      const params = {
        categoryStatus: 1,
      }
      categoryApi.getCategoryList(params).then(res => {
        this.categoryList = res.rows
      })
    },
    handleChange(query) {
      this.formData.goodsClassify = query;
    },
    handleGetSupplier(query){
      const queryName = this.supplierList.find(res => res.supplierId === query)?.supplierCode
      this.formData.supplierCode = queryName
    },
    getSupplierList(query) {
      // this.formData.supplierCode = query;
      // console.log(this.formData.supplierCode)
      let params = {
        codeNameKey: query,
        supplierStatus: 3,
      }
      // 查询供应商下拉列表
      request.post('pms/supplier/getSupplierList',params).then((res) => {
        this.supplierList = res.data
      })
    },
    /*关闭新建弹框*/
    closeAddFiles() {
      // this.formData = {}
      this.$refs.formRef.resetFields();
      this.formData.remark = '';
      this.formData.attachmentInfos = [];
      this.doing = false;
      // this.$refs['formRef'].resetFields();
      this.$emit('closeAddFiles');
    },
    submitForm() {
      if (this.doing) return;
      this.doing = true;
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.formData.goodsUnit = this.unitList.find(item => item.dictCode === this.formData.goodsUnitId)?.dictLabel;
          this.formData.taxRate = this.taxRateList.find(item => item.dictCode === this.formData.taxRateId)?.dictLabel;
          this.formData.goodsTypeName = this.goodsTypes.find(item => item.dictCode === this.formData.goodsType)?.dictLabel;
          filesApi.addFiles(this.formData).then(res => {
            if (res.code === 200) {
              this.doing = false;
              this.$notify.success('新增成功')
              this.closeAddFiles();
            }
          }).catch(error=>{
            this.doing = false;
          })
        } else {
          this.doing = false;
          // 表单验证失败
          return false;
        }
      });
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
        attachmentValidityDate: '',
      });

    },
    attachmentUploadBeforeHandler(file) {

      let fileRaw = file
      // 附件上传前的处理
      const attachmentNameRule = {required: true, message: '请输入附件名称', trigger: 'blur'};
      this.rules.attachmentInfos = [{name: attachmentNameRule}];

      const isLt10M = fileRaw.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传营业执照大小不能超过 10MB!')
        return false
      }

      return true
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
    }
  }
}
</script>

<style scoped>

</style>
