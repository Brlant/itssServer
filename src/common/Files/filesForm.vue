<template>
  <el-dialog :visible="dialogAddFiles" :title="formTitle" width="60%" @close="closeAddFiles">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ formTitle }}</div>
    </template>
    <template>
      <el-form ref="form" :model="formData" label-width="100px" :rules="rules">
        <el-row :gutter="20">
          <!-- 第一行 -->
          <el-col :span="8">
            <el-form-item label="物品类型" prop="goodsType">
              <el-select v-model="formData.goodsType" placeholder="物品类型" clearable>
                <el-option
                  v-for="(item,index) in listOfItemTypes"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
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
              <el-select v-model="formData.supplierId" filterable :filter-method="getSupplierList" placeholder="供应商" clearable>
                <el-option
                  v-for="(item,index) in supplierList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
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
            <el-form-item label="单位" prop="goodsUnit">
              <el-select v-model="formData.goodsUnit" placeholder="单位" clearable>
                <el-option
                  v-for="(item,index) in unitList"
                  :key="index"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- 第三行 -->
          <el-col :span="8">
            <el-form-item label="含税进价" prop="taxBid">
              <el-input v-model="formData.taxBid" placeholder="含税进价" type="number" clearable>
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率" prop="taxRate">
              <el-select v-model="formData.taxRate" placeholder="物品类型" clearable>
                <el-option
                  v-for="(item,index) in taxRateList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不含税进价" prop="nonTaxBid">
              <el-input v-model="nonTaxBid" :disabled="true"  readonly >
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
              <el-input v-model="formData.boxGauge" placeholder="箱规">
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
                       multiple>
              <el-button type="primary">选择文件<i class="el-icon-upload el-icon--right"/></el-button>
            </el-upload>
          </el-form-item>
          <el-form-item v-if="formData.attachmentInfos.length > 0" style="margin-top: 20px">
            <el-row v-for="(attachment, index) in formData.attachmentInfos" :key="index">
              <el-col :span="9">
                <div style="border: 1px lightgrey solid; padding: 0 10px;height: 36px">
                  <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 325px;
                  display: inline-block;" :title="attachment.name">
                    {{ attachment.name }}
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
                    placeholder="请选择有效期"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <!-- 提交按钮 -->
          <el-col >
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button>返回</el-button>
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
export default {
  name: "filesForm",
  props: {
    dialogAddFiles: {
      type: Boolean,
      default: "",
    }
  },

  data() {
    return {
      formTitle: "基本信息",
      formData: {
        attachmentInfos: [],
      },
      rules: {
        goodsType: [{required: true, message: '请输入物品类型', trigger: 'blur'}],
        goodsName: [{required: true, message: '请输入物品名称', trigger: 'blur'}],
        supplierId: [{required: true, message: '请选择供应商', trigger: 'change'}],

        goodsUnit: [{required: true, message: '请选择单位', trigger: 'change'}],
        taxBid: [{required: true, message: '请输入含税进价', trigger: 'blur'}],
        taxRate: [{required: true, message: '请选择税率', trigger: 'change'}],

        boxGauge: [{required: true, message: '请输入箱规', trigger: 'blur'}],
        goodsClassify: [{required: true, message: '请选择物品分类', trigger: 'blur'}],
      },
      //物品类型
      listOfItemTypes: [
        {label:'固定资产',value:1},
        {label:'消耗品',value:2},
        {label:'服务',value:3},
        {label:'销售品',value:4},
      ],
      //单位
      unitList:[
        {label:'支',value:1},
        {label:'套',value:2},
        {label:'个',value:3},
        {label:'盒',value:4},
      ],
      //税率
      taxRateList:[
        {label:'1%',value:"0.01"},
        {label:'3%',value:"0.03"},
        {label:'6%',value:"0.06"},
        {label:'12%',value:"0.12"},
        {label:'15%',value:"0.15"},
      ],
      //供应商
      supplierList:[],
      //物品分类
      categoryList: [],
    }
  },
  computed:{
    nonTaxBid(){
      return this.formData.taxBid / (1 + Number(this.formData.taxRate));
    },

    uploadUrl() {
      return supplierApi.uploadUrl
    }
  },
  created() {
    this.getCategoryList()
    this.getSupplierList();
  },
  methods: {
    /* 获取上级类目列表 */
    getCategoryList(){
      categoryApi.getCategoryList().then(res=>{
        this.categoryList = res.rows;
      })
    },
    handleChange(query){
      this.formData.goodsClassify = query;
    },

    getSupplierList(query){
      let params = {
        codeNameKey: query,
        pageNum: 1,
        pageSize: 1000,
      }
      supplierApi.getSupplierList(params).then((res) => {
        this.supplierList = res.data.rows.map(item => {
          return {
            value: item.supplierId,
            label: item.supplierName
          }
        })
      })
    },
    /*关闭新建弹框*/
    closeAddFiles() {
      this.$emit('closeAddFiles');
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formData.nonTaxBid = this.nonTaxBid;
          filesApi.addFiles(this.formData).then(res=>{
            if(res.code === 200){
              this.$notify.success('新增成功')
              this.closeAddFiles();
            }
          })
        } else {
          // 表单验证失败
          return false;
        }
      });
    },
    handleAttachmentSuccess(response, file) {

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
