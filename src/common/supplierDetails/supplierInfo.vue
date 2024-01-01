<template>
  <el-form ref="form" :model="formData" :rules="formRules" label-width="135px">
    <!--    基本信息-->
    <div class="JiBenXinXi">
      基本信息
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="供应商编号" prop="supplierCode">
          <el-input v-model="formData.supplierCode" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="formData.supplierName" :readonly="readonly" maxlength="50" show-word-limit></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="企业类型" prop="supplierType">
          <el-select v-model="formData.supplierType" :disabled="readonly">
            <el-option
              v-for="(item,index) in supplierTypes"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictCode"
              :disabled="item.status!=='0'"
            />
            <el-option v-if="!supplierTypes.some(list=> list.dictCode === formData.supplierType)"
                       :label="formData.supplierTypeName"
                       :value="formData.supplierType"
                       :disabled="true"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="营业执照有效期" prop="validityDate"
                      :rules="[{required: true, message: '请选择有效期', trigger: 'blur'}]">
          <el-date-picker
            v-model="formData.validityDate"
            type="date"
            placeholder="选择有效期"
            value-format="yyyy-MM-dd"
            :readonly="readonly">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="办公地址" prop="supplierAddress">
          <el-input v-model="formData.supplierAddress" :readonly="readonly" maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16">
        <el-form-item label="仓库地址" prop="warehouseAddress">
          <el-input v-model="formData.warehouseAddress" :readonly="readonly" maxlength="200" show-word-limit></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <!--    工商信息-->
    <div class="GongShangXinXi">
      工商信息
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="法人" prop="businessInfo.legalPerson"
                      :rules="[{required: true, message: '请输入法人', trigger: 'blur'}]">
          <el-input v-model="formData.businessInfo.legalPerson" :readonly="readonly" maxlength="30" show-word-limit></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="法人身份证号" prop="businessInfo.legalPersonID">
          <el-input v-model="formData.businessInfo.legalPersonID" :readonly="readonly"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="公司成立时间" prop="businessInfo.foundingDate"
                      :rules="[{ required: true, message: '请选择公司成立时间', trigger: 'blur' }]">
          <el-date-picker v-model="formData.businessInfo.foundingDate" type="date"
                          value-format="yyyy-MM-dd"
                          :readonly="readonly"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="统一社会信用代码" prop="businessInfo.creditCode"
                      :rules="[{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }]">
          <el-input v-model="formData.businessInfo.creditCode" :readonly="readonly"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="开户行" prop="businessInfo.openingBank"
                      :rules="[{ required: true, message: '请输入开户行', trigger: 'blur' }]">
          <el-input v-model="formData.businessInfo.openingBank" :readonly="readonly" maxlength="30" show-word-limit></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收款账号" prop="businessInfo.accountNumber"
                      :rules="[{ required: true, message: '请输入收款账号', trigger: 'blur' }]">
          <el-input v-model="formData.businessInfo.accountNumber" :readonly="readonly" maxlength="30" show-word-limit></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="经营范围" prop="businessInfo.businessScope"
                      :rules="[{ required: true, message: '请输入经营范围', trigger: 'blur' }]">
          <el-input v-model="formData.businessInfo.businessScope" :readonly="readonly"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 图片上传 -->
    <el-row>
      <el-col :span="8">
        <el-form-item label="营业执照" prop="businessInfo.businessLicenseUrl"
                      :rules="[{ required: true, message: '请上传营业执照', trigger: 'change' }]">
          <div class="picInfo flexDis flexContentC flexAlignC">
            <el-upload class="avatar-uploader flexDis flexContentC flexAlignC applyFlex"
                       :action="uploadUrl"
                       :show-file-list="false"
                       :on-success="handleBusinessLicenseSuccess"
                       :before-upload="businessLicenseChangeHandler">
              <div slot="trigger">
                <img v-if="businessLicenseUrl" :src="businessLicenseUrl">
                <div v-else class="lib-comp-group preview" style="opacity: 1; width: 28px; height: 28px;">
                  <div id="5yebs-lpaqujrt-du8" class="component component-rect selected-by-others preview"
                       style="transform: translate(0px, 13px) rotate(0deg); width: 28px; height: 2px; box-shadow: rgba(255, 255, 255, 0) 0px 0px 1px; transition: unset; z-index: 0;">
                    <div class="lib-comp-rect"
                         style="width: 28px; height: 2px; background: rgb(196, 199, 207); border-radius: 1px; transition: unset;"></div>
                  </div>
                  <div id="5yebs-lpaqujrt-du9" class="component component-rect selected-by-others preview"
                       style="transform: translate(0px, 13px) rotate(90deg); width: 28px; height: 2px; box-shadow: rgba(255, 255, 255, 0) 0px 0px 1px; transition: unset; z-index: 0;">
                    <div class="lib-comp-rect"
                         style="width: 28px; height: 2px; background: rgb(196, 199, 207); border-radius: 1px; transition: unset;"></div>
                  </div>
                </div>
              </div>

            </el-upload>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="其他附件" prop="businessInfo.attachmentInfos">
          <el-upload :action="uploadUrl"
                     :show-file-list="false"
                     :on-success="handleAttachmentSuccess"
                     :before-upload="attachmentUploadBeforeHandler"
                     accept=".png,.jpg,.jpeg,application/pdf"
                     multiple
                     v-show="!readonly">
            <el-button type="primary">选择文件<i class="el-icon-upload el-icon--right"/></el-button>
          </el-upload>
          <el-form-item v-if="attachmentInfos.length > 0" style="margin-top: 22px">
            <el-row v-for="(attachment, index) in formData.businessInfo.attachmentInfos" :key="index">
              <el-col :span="9">
                <div style="border: 1px lightgrey solid; padding: 0 10px;height: 36px">
                  <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 100px;
                  display: inline-block;" :title="attachment.name">
                    {{ attachment.attachmentPath.split('/').pop() }}
                  </div>
                  <div style="float: right;">
                    <!--下载附件-->
                    <a :href="attachment.attachmentPath"
                       target="_blank"
                       :download="attachment.attachmentFileName"
                       class="el-icon-download el-icon--right"
                       title="下载附件"
                       style="margin-right: 10px"></a>
                    <!--<a @click.prevent="downloadAttachment(attachment.attachmentPath,attachment.attachmentFileName)"-->
                    <!--   class="el-icon-download el-icon&#45;&#45;right"-->
                    <!--   style="margin-right: 10px"></a>-->
                    <!--删除附件-->
                    <a href="#" class="el-icon-delete el-icon--right"
                       title="删除附件"
                       @click.prevent="deleteAttachment(index)"></a>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <el-form-item label="附件名称" label-width="120px"
                              :prop="'businessInfo.attachmentInfos.'+index +'.attachmentFileName'"
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
        </el-form-item>
      </el-col>
    </el-row>

    <!--    联系人-->
    <div class="lainXiRen">
      联系人
    </div>
    <div v-for="(contact, index) in formData.contactsInfoList" :key="contact.id">
      <el-row :gutter="20">
        <el-col :span="5">
          <el-form-item :label="'联系人' + (index + 1)" :prop="'contactsInfoList.' + index +'.contactsName'"
                        :rules="[
                          { required: true, message: '请输入手机号', trigger: 'blur' },
                        ]">
            <el-input v-model="contact.contactsName" placeholder="请输入联系人姓名" :readonly="readonly" maxlength="30" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="职位" prop="positions">
            <el-input v-model="contact.positions" placeholder="请输入职位" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="手机号" :prop="'contactsInfoList.' + index +'.contactsPhone'"
                        :rules="[{ required: true, message: '请输入手机号', trigger: 'blur' },
                        { pattern: /^[0-9]*$/, message: '请输入正整数0-9', trigger: 'blur' },]">
            <el-input v-model="contact.contactsPhone" placeholder="请输入手机号" :readonly="readonly" maxlength="11" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="邮箱" prop="contactsMailbox">
            <el-input v-model="contact.contactsMailbox" placeholder="请输入邮箱" :readonly="readonly"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button circle size="small" icon="el-icon-plus" type="primary" @click="addContact"
                       v-if="!readonly && index === 0"></el-button>
            <el-button circle size="small" icon="el-icon-minus" type="danger" @click="removeContact(index)"
                       v-if="!readonly && formData.contactsInfoList.length > 1"></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <el-form-item>
      <el-button
        v-show="formData.supplierStatus === 5"
        icon="el-icon-delete"
        @click="enableSupplier(formData.supplierId, 3)"
        v-has-permi="['pms:supplier:enable']"
      >启用
      </el-button>
      <el-button
        v-show="formData.supplierStatus === 3"
        icon="el-icon-delete"
        @click="enableSupplier(formData.supplierId, 5)"
        v-has-permi="['pms:supplier:enable']"
      >停用
      </el-button>
      <el-button
        v-show="formData.supplierStatus === 5 || formData.supplierStatus === 3"
        icon="el-icon-delete"
        @click="enableSupplier(formData.supplierId, 6)"
        v-has-permi="['pms:supplier:enable']"
      >淘汰
      </el-button>
      <el-button
        v-show="formData.returnButton && (formData.supplierStatus === 2 || formData.supplierStatus === 4)"
        icon="el-icon-delete"
        @click="handleDelete"
      >删除
      </el-button>
      <el-button v-has-permi="['pms:supplier:edit']"
                 icon="el-icon-edit"
                 v-show="!readonly"
                 @click="submitForm"
      >重新提交
      </el-button>
      <el-button v-has-permi="['pms:supplier:edit']"
                 type="success"
                 v-show="formData.examineButton && (formData.supplierStatus === 0 || formData.supplierStatus === 1)"
                 @click="auditPass"
      >审核通过
      </el-button>
      <el-button v-has-permi="['pms:supplier:edit']"
                 type="danger"
                 v-show="formData.examineButton && (formData.supplierStatus === 0 || formData.supplierStatus === 1)"
                 @click="auditNoPass"
      >审核不通过
      </el-button>
      <el-button v-show="formData.returnButton && (formData.supplierStatus === 0 || formData.supplierStatus === 1)"
                 type="danger"
                 @click="revocation"
      >撤回
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import supplierApi from '@/api/supplier/supplier'
import {resetUserPwd} from '@/api/system/user'
import {download} from '@/utils/request'
import {getDicts} from '@/api/system/dict/data'

export default {
  name: "supplierInfo",
  props: {
    // tabName: {
    //   type:String,
    //   default:'',
    // }
    // 供应商id
    supplierData: {
      type: Object,
    },
  },
  watch: {
    // tabName: {
    //   handler(newVal, oldVal) {
    //     console.log('档案信息',newVal);
    //   },
    //   immediate:true,
    //   deep: true,
    // }
    supplierData: {
      handler(newVal, oldVal) {
        if (newVal && newVal.supplierId) {
          this.formData = JSON.parse(JSON.stringify(newVal))
          this.backData = JSON.stringify(this.formData)
        }
      },
      immediate: true,
      deep: true,
    }
  },
  data() {
    return {
      formData: {
        //基本信息
        supplierCode: '',
        supplierName: '',
        supplierType: '',
        supplierDate: '',
        supplierAddress: '',
        warehouseAddress: '',
        //工商信息
        businessInfo: {
          legalPerson: '',
          legalPersonID: '',
          foundingDate: '',
          creditCode: '',
          openingBank: '',
          accountNumber: '',
          businessScope: '',
          //工商信息的文件上传
          businessLicenseUrl: '',
          // {
          //   "attachmentId": "",
          //   "attachmentObjectType": "",
          //   "attachmentObjectId": "",
          //   "attachmentFileName": "",
          //   "attachmentSize": 0,
          //   "attachmentPath": "",
          //   "attachmentUploadUserId": 0,
          //   "attachmentDownloadPower": false,
          //   "attachmentValidityDate": "2023-12-18 20:41:35",
          //   "deleteFlag": 0,
          //   "createBy": "",
          //   "createTime": "2023-12-18 20:41:35",
          //   "updateBy": "",
          //   "updateTime": "2023-12-18 20:41:35"
          // }
          attachmentInfos: [],
        },
        //联系人
        contactsInfoList: [
          {
            id: Date.now(),
            supplierId: '',
            contactsName: '',
            positions: '',
            contactsPhone: '',
            contactsMailbox: ''
          }
        ],
        changeFlag: false
      },
      //表单校验
      formRules: {
        supplierName: [{required: true, message: '请输入供应商名称', trigger: 'blur'}],
        supplierDate: [{required: true, message: '请选择供应商日期', trigger: 'change'}],
        supplierAddress: [{required: true, message: '请输入办公室地址', trigger: 'blur'}],
        warehouseAddress: [{required: true, message: '请输入仓库地址', trigger: 'blur'}],
        //工商信息
        // legalPerson: [{required: true, message: '请输入法人', trigger: 'blur'}],
        // idCardNumber: [{required: true, message: '请输入法人身份证号', trigger: 'blur'}],
        // establishDate: [{required: true, message: '请选择公司成立时间', trigger: 'change'}],
        // openingBank: [{required: true, message: '请输入开户行', trigger: 'blur'}],
        // accountNumber: [{required: true, message: '请输入收款账号', trigger: 'blur'}],
        // businessScope: [{required: true, message: '请输入经营范围', trigger: 'blur'}],

        //联系人
        // contactName: [
        //   {required: true, message: '请输入联系人', trigger: 'blur'}
        // ],
        // cellPhoneNumber: [
        //   {required: true, message: '请输入手机号', trigger: 'blur'}
        // ]
      },
      backData: null,//原始数据
      supplierTypes: [],
    }
  },
  computed: {
    businessLicenseUrl() {
      return this.formData.businessInfo.businessLicenseUrl
    },
    uploadUrl() {
      return supplierApi.uploadUrl
    },
    attachmentInfos() {
      return this.formData.businessInfo.attachmentInfos || []
    },
    readonlyClass() {
      return {
        'noneBorder': this.readonly
      }
    },
    readonly() {
      return !(this.formData.supplierStatus === 2
        || this.formData.supplierStatus === 3
        || this.formData.supplierStatus === 4)
    },
    oldStr() {
      let {
        supplierName,
        validityDate,
        supplierAddress,
        warehouseAddress,
        businessInfo,
        contactsInfoList
      } = this.supplierData
      let attachmentFileNames = businessInfo.attachmentInfos.map(item => {
        return item.attachmentFileName
      }).join(',')

      let contactsInfos = contactsInfoList.map(item => {
        return item.contactsName + item.contactsPhone
      }).join(',')
      let str = supplierName + validityDate + supplierAddress + warehouseAddress
      str += businessInfo.legalPerson + businessInfo.foundingDate + businessInfo.creditCode + businessInfo.openingBank
        + businessInfo.accountNumber + businessInfo.businessScope
        + businessInfo.businessLicenseUrl + attachmentFileNames + contactsInfos
      return str
    },
    newStr() {
      let {
        supplierName,
        validityDate,
        supplierAddress,
        warehouseAddress,
        businessInfo,
        contactsInfoList
      } = this.formData
      let attachmentFileNames = businessInfo.attachmentInfos.map(item => {
        return item.attachmentFileName
      }).join(',')

      let contactsInfos = contactsInfoList.map(item => {
        return item.contactsName + item.contactsPhone
      }).join(',')
      let str = supplierName + validityDate + supplierAddress + warehouseAddress
      str += businessInfo.legalPerson + businessInfo.foundingDate + businessInfo.creditCode + businessInfo.openingBank
        + businessInfo.accountNumber + businessInfo.businessScope
        + businessInfo.businessLicenseUrl + attachmentFileNames + contactsInfos
      return str
    },
    needAudit() {
      // 找出必填字段，拼成字符串，来比较是否有变化，必填字段修改后，需要重新审核
      // console.log(this.oldStr)
      // console.log(this.newStr)
      return this.oldStr !== this.newStr
    },
  },
  methods: {
    addContact() {
      this.formData.contactsInfoList.push({
        id: Date.now(),
        supplierId: "",
        contactsName: "",
        positions: "",
        contactsPhone: "",
        contactsMailbox: "",
      });
    },
    removeContact(index) {
      this.formData.contactsInfoList.splice(index, 1);
    },
    // 关闭弹框
    closeHandlerInfo() {
      this.$emit('closeHandlerInfo')
    },
    /*表单校验提交*/
    submitForm() {
      this.$confirm('是否重新提交?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 表单验证通过，可以在这里进行提交操作
            let stringParams = JSON.stringify(this.formData) !== this.backData
            if (stringParams === false) {
              return this.$message.error('内容未做任何修改，无需提交')
            } else {
              this.updateSupplier()
            }
          }
        });
      })
    },
    // 编辑供应商
    updateSupplier() {
      this.formData.changeFlag = this.needAudit
      this.formData.supplierTypeName = this.supplierTypes.find(item => item.dictCode === this.formData.supplierType)?.dictLabel
      supplierApi.updateSupplier(this.formData).then(res => {
        if (res.code === 200) {
          this.$message.success('编辑成功')
          this.closeHandlerInfo()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    enableSupplier(supplierId, status) {
      this.$confirm('是否确定?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          supplierId: supplierId,
          supplierStatus: status,
        }
        supplierApi.enableSupplier(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandlerInfo();
        })
      })
    },
    /*删除*/
    handleDelete() {
      this.$confirm('此操作将永久删除该供应商档案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        supplierApi.deleteSupplier(this.formData.supplierId).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.closeHandlerInfo();
        })
      })
    },
    editSupplier() {

    },

    /*审核通过*/
    auditPass() {
      this.$confirm('是否确定审核通过?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          supplierId: this.formData.supplierId,
          examineType: 1,
        }
        supplierApi.auditSupplier(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandlerInfo();
        })
      })
    },
    /*审核不通过*/
    auditNoPass() {
      this.$prompt('请填写审核不通过的原因', "", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputValidator: value => !!value,
        inputErrorMessage: "原因不能为空"
      }).then(({value}) => {
        let params = {
          supplierId: this.formData.supplierId,
          examineType: 2,
          remark: value,
        }

        supplierApi.auditSupplier(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandlerInfo();
        })
      }).catch(() => {
      });
    },
    /*撤回*/
    revocation() {
      this.$confirm('是否确定撤回?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          supplierId: this.formData.supplierId,
          examineType: 3
        }

        supplierApi.auditSupplier(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.closeHandlerInfo()
        })
      })
    },
    attachmentUploadBeforeHandler(file) {
      let fileRaw = file
      // 附件上传前的处理
      const attachmentNameRule = {required: true, message: '请输入附件名称', trigger: 'blur'};
      this.formRules.attachmentInfos = [{name: attachmentNameRule}];

      const isLt10M = fileRaw.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传营业执照大小不能超过 10MB!')
        return false
      }

      return true
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
      this.formData.businessInfo.attachmentInfos.push({
        attachmentId: '',
        name: response.data.name,
        attachmentPath: response.data.url,
        attachmentFileName: '',
        attachmentValidityDate: '',
      });
    },
    // 营业执照上传
    businessLicenseChangeHandler(file, fileList) {
      let fileRaw = file
      const isTYPE = /^image\/(jpe?g|png)$/.test(fileRaw.type);
      const isLt10M = fileRaw.size / 1024 / 1024 < 10
      if (file.name.slice(0, file.name.indexOf('.')).length < 3) {
        this.$message({
          message: '文件名称最少3位',
          type: 'error'
        })
        return false
      }
      if (!isTYPE) {
        this.$message.error('上传营业执照只能是JPG/JPEG/PNG格式!')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传营业执照大小不能超过 10MB!')
        return false
      }

      return true
    },
    handleBusinessLicenseSuccess(response, file) {
      // 营业执照上传成功后的处理
      this.formData.businessInfo.businessLicenseUrl = response.data.url
      // 手动触发校验
      this.$refs.form.validateField('businessInfo.businessLicenseUrl');
    },
    getSupplierTypes() {
      return getDicts('supplier_type').then((res) => {
        console.log(res.data)
        this.supplierTypes = res.data
      })
    },
    downloadAttachment(src, fileName) {
      let $a = document.createElement('a');
      $a.setAttribute('href', src);
      $a.setAttribute('download', fileName);
      let fileLink = document.createElement('span');
      fileLink.setAttribute('style', 'cursor: pointer; -webkit-tap-highlight-color: transparent');
      $a.appendChild(fileLink);
      let body = document.getElementsByTagName('body')[0];
      body.appendChild($a);
      fileLink.click();
      body.removeChild($a);
    },
    deleteAttachment(index) {
      this.$confirm('此操作将永久删除该附件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let attachmentId = this.formData.businessInfo.attachmentInfos[index].attachmentId
        if (attachmentId) {
          supplierApi.deleteAttachment(attachmentId).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.formData.businessInfo.attachmentInfos.splice(index, 1)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          // 没有附件id的直接本地删除
          this.$message.success('删除成功')
          this.formData.businessInfo.attachmentInfos.splice(index, 1)
        }
      })
    }
  },
  mounted() {
    this.getSupplierTypes()
  },
}
</script>

<style lang="scss" scoped>
//::v-deep .el-input__inner {
//  border: none;
//  background-color: rgba(255, 255, 255, 0);
//}

//::v-deep .el-input__inner:hover {
//  /*border: none;*/
//  background-color: rgba(255, 255, 255, 0);
//}

.JiBenXinXi {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 20px;
  padding-bottom: 10px;
  box-sizing: content-box;
}

.GongShangXinXi {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 20px;
  padding-bottom: 10px;
  box-sizing: content-box;
}

.lainXiRen {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 20px;
  padding-bottom: 10px;
  box-sizing: content-box;
}

.picInfo {

  width: 148px;
  height: 148px;
  background: rgb(255, 255, 255);
  border-width: 1px;
  border-color: rgb(216, 220, 230);
  border-style: dashed;
  border-radius: 4.5px;
  transition: unset;

  img {
    max-width: 148px;
    max-height: 148px;
  }
}

.picInfo:hover {
  border-color: rgba(0, 157, 255);
}

.flexDis {
  display: flex;
}

.flexContentC {
  justify-content: center;
}

.flexAlignC {
  align-items: center;
}

.applyFlex {
  flex-grow: 1;
}

.avatar-uploader {
  width: 100%;
  height: 100%;
  position: relative;
}

.avatar-uploader-icon {
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  color: rgba(198, 211, 226, 1);
}

input.noneBorder {
  border: none;
}
</style>
