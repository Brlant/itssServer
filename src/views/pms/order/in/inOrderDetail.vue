<template>
  <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
    <!--    联系人-->
    <div class="jiBenXinXi">
      基本信息
    </div>
    <!-- 第一行：订单类型 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="订单编号" prop="pmsOrderNo" required>
          <el-input v-model="formData.pmsOrderNo" placeholder="请选择入库单编号" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="订单类型" prop="orderBizType" :rules="rules.orderBizType">

          <el-select v-model="formData.orderBizType" placeholder="请选择入库单类型" :disabled="readonly">
            <el-option
              v-for="item in orderBizTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="出库单号" prop="outOrderNo" required
                      v-if=" formData.orderBizType==='1-4' && formData.outOrderNo ">
          <el-input v-model="formData.outOrderNo" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 第二行 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="发起人" prop="applyName" :rules="rules.applyName">
          <el-input v-model="formData.applyName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="发起部门" prop="applyDepartName" :rules="rules.applyDepartName">
          <el-input v-model="formData.applyDepartName" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="发起日期" prop="applyDate" :rules="rules.applyDate">
          <el-input v-model="formData.applyDate" placeholder="选择日期" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="收货人" prop="consigneeName">
          <el-input v-model="formData.consigneeName" :readonly="readonly"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="收货人电话" prop="consigneePhone">
          <el-input v-model="formData.consigneePhone" :readonly="readonly"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="收货人地址" prop="consigneeAddress">
          <el-input v-model="formData.consigneeAddress" :readonly="readonly"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 预算类型&申请原由 -->
    <el-row :gutter="20">
      <el-col :span="6" v-if="!formData.outOrderNo">
        <el-form-item label="预算类型" prop="budgetTypes" :rules="rules.budgetTypes">
          <el-cascader
            v-model="formData.budgetTypes"
            placeholder="请选择预算类型"
            :options="budgetTypes"
            :props="{ label: 'budgetName', value: 'budgetId',children: 'childList'}"
            filterable :disabled="readonly"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请原由">
          <el-input v-model="formData.applyReason" :readonly="readonly"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="jiBenXinXi">
      订单明细
    </div>
    <el-table :data="formData.orderDetailList" border>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="supplier" label="供应商名称" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.supplierId`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择供应商名称', trigger: 'change'},
                         {validator: supplierValidator, trigger: 'change'}]">
            <el-select v-model="scope.row.supplierId" placeholder="请选择供应商名称"
                       filterable :disabled="readonly"
                       @change="supplierChangeHandler(scope.$index)">
              <el-option v-for="(option,index) in supplierOptions" :key="option.supplierId"
                         :label="option.supplierName"
                         :value="option.supplierId"
                         :disabled="option.disabaled"
                         :title="isOverDate(option.validityDate)">
                <span style="float: left;color: red" v-if="isOverDate(option.validityDate)">{{
                    option.supplierName
                  }}</span>
                <span style="float: left" v-else>{{ option.supplierName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ option.supplierCode }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="物品类型" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.goodsType`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品类型', trigger: 'change'}]">
            <el-select v-model="scope.row.goodsType" placeholder="请选择物品类型" style="width: 100%" :disabled="readonly"
                       @change="goodsTypeChangeHandler(scope.$index)">
              <el-option
                v-for="(item,index) in goodsTypes"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictCode"
                :disabled="item.status !== '0'"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="物品编号" min-width="200px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.goodsCode`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品编号'}]">
            <el-select v-model="scope.row.goodsId" placeholder="请选择物品编号" style="width: 100%"
                       filterable :disabled="readonly"
                       @change="goodsChangeHandler(scope.row.goodsId,scope.$index)">
              <el-option v-for="option in goodsListOptions[scope.row.supplierId + '_' + scope.row.goodsType]"
                         :key="option.goodsId"
                         :label="option.goodsCode"
                         :value="option.goodsId"
                         :disabled="option.disabled"
              ></el-option>
              <el-option
                v-if="!hasGoods(scope.row)"
                :key="scope.row.goodsId"
                :label="scope.row.goodsCode"
                :value="scope.row.goodsId"
                :disabled="true"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="物品名称" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.goodsName`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[{required: true, message: '请选择物品名称'}]">
            <el-select v-model="scope.row.goodsId" placeholder="请选择物品名称" style="width: 100%"
                       filterable :disabled="readonly"
                       @change="goodsChangeHandler(scope.row.goodsId,scope.$index)">
              <el-option v-for="option in goodsListOptions[scope.row.supplierId + '_' + scope.row.goodsType]"
                         :key="option.goodsId"
                         :label="option.goodsName"
                         :value="option.goodsId"
                         :disabled="option.disabled"
              ></el-option>
              <el-option
                v-if="!hasGoods(scope.row)"
                :key="scope.row.goodsId"
                :label="scope.row.goodsName"
                :value="scope.row.goodsId"
                :disabled="true"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="含税进价" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.taxBid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.taxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="priceWithoutTax" label="不含税进价" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.nonTaxBid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="数量" min-width="150px">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.amount`" label-width="0"
                        style="margin-top: 22px"
                        :rules="rules.amount">
            <el-input @input="calculateTotal(scope.row)"
                      v-model.number="scope.row.amount" placeholder="请输入数量" :readonly="readonly"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="含税总进价" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.totalTaxBid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPriceWithoutTax" label="不含税总进价" min-width="150px">
        <template v-slot="scope">
          <span>{{ scope.row.nonTotalTaxBid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualReceiptAmount" label="实际收货数量" min-width="150px"
                       v-if="formData.pmsOrderStatus === 3 || formData.pmsOrderStatus === 7">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.actualReceiptAmount`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[
                          { required: true, message: '请输入实际收货数量', trigger: 'blur'},
                         {type: 'number',min:0,message: '请输入正整数', trigger: 'blur'},
                         {type: 'number',max:formData.orderDetailList[scope.$index].amount,  message: '不能大于订单数量', trigger: 'blur'},
                        ]">
            <el-input v-model.number="scope.row.actualReceiptAmount" placeholder="请输入收货数量"
                      :readonly="formData.pmsOrderStatus !== 3"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="actualReceiptPrice" label="实际收货金额" min-width="150px"
                       v-if="formData.pmsOrderStatus === 3 || formData.pmsOrderStatus === 7">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.actualReceiptPrice`" label-width="0"
                        style="margin-top: 22px"
                        :rules="[
                        { required: true, message: '金额不能为空', trigger: 'blur'},
                        { pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,3})?$/,message:'金额不合法，最多3位小数', trigger: 'blur' }
                      ]">
            <el-input v-model="scope.row.actualReceiptPrice" placeholder="请输入实际收货金额，最多三位小数"
                      :readonly="formData.pmsOrderStatus !== 3"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="receiptRemark" label="收货备注" min-width="150px"
                       v-if="formData.pmsOrderStatus === 3 || formData.pmsOrderStatus === 7">
        <template v-slot="scope">
          <el-form-item :prop="`orderDetailList.${scope.$index}.receiptRemark`" label-width="0"
                        style="margin-top: 22px">
            <el-input type="textarea" v-model="scope.row.receiptRemark" placeholder="请输入数量"
                      :readonly="formData.pmsOrderStatus !== 3"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="有效期" v-if="formData.pmsOrderStatus === 3 || formData.pmsOrderStatus === 7"
                       min-width="300px">
        <template v-slot="scope">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item :prop="`orderDetailList.${scope.$index}.validityFlag`" label-width="0"
                            style="margin-top: 22px"
                            :rules="[{ required: true, message: '请选择有效期类型', trigger: 'blur'}]">
                <el-select v-model="scope.row.validityFlag" placeholder="请选择" :disabled="formData.pmsOrderStatus !== 3">
                  <el-option v-for="option in validityFlagOptions"
                             :key="option.value"
                             :label="option.label"
                             :value="option.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14" v-show="scope.row.validityFlag === '2'">
              <el-form-item :prop="`orderDetailList.${scope.$index}.validityDate`" label-width="0"
                            style="margin-top: 22px;"
                            :rules="[{ validator: checkValidityDate,trigger: 'blur'}]">
                <el-date-picker style="width: 100%" :disabled="formData.pmsOrderStatus !== 3"
                                v-model="scope.row.validityDate"
                                type="date"
                                placeholder="请选择"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column width="50px" v-if="!readonly" min-width="150px">
        <template v-slot="scope">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-button circle size="small" icon="el-icon-plus" type="primary" @click="addRow"
                         v-if="scope.$index === 0 && !readonly"></el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 10px">
            <el-col :span="24">
              <el-button circle size="small" icon="el-icon-minus" type="danger" @click="deleteRow(scope.$index)"
                         v-if="formData.orderDetailList.length > 1 && !readonly"></el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!--收货信息-->
    <el-form-item label="签收单"
                  v-show="formData.pmsOrderStatus === 3 || formData.pmsOrderStatus === 7" style="margin-top: 22px">
      <el-form-item v-show="formData.pmsOrderStatus === 3" style="margin-bottom: 22px">
        <el-button title="下载签收单模板" type="primary" @click="downloadReceipt">
          下载签收单<i class="el-icon-download el-icon--right"/>
        </el-button>
      </el-form-item>
      <el-form-item v-show="formData.pmsOrderStatus === 3" style="margin-bottom: 22px">
        <el-upload :action="uploadUrl" multiple
                   :show-file-list="false"
                   :on-success="handleAttachmentSuccess"
                   :before-upload="attachmentUploadBeforeHandler">
          <el-button type="primary">
            上传签收单<i class="el-icon-upload el-icon--right"/>
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item v-show="formData.pmsOrderStatus === 3 || formData.pmsOrderStatus === 7" style="margin-bottom: 22px">
        <el-row v-for="(attachment, index) in formData.attachmentInfos" :key="index">
          <el-col :span="9">
            <div style="border: 1px lightgrey solid; padding: 0 10px;height: 36px">
              <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:auto;
                  display: inline-block;" :title="attachment.attachmentFileName">
                {{ attachment.attachmentFileName }}
              </div>
              <div style="float: right;margin-right: 10px">
                <!--下载附件-->
                <a :href="attachment.attachmentPath"
                   target="_blank"
                   :download="attachment.attachmentFileName"
                   class="el-icon-download el-icon--right"
                   title="下载签收单"
                ></a>
                <a v-if="formData.pmsOrderStatus === 3" href="#" class="el-icon-delete el-icon--right"
                   title="删除附件" style="margin-left: 10px"
                   @click.prevent="deleteReceipt(attachment.attachmentId,index)"></a>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form-item>

    <div class="jiBenXinXi">
      财务信息
    </div>
    <el-form-item label="付款凭证" v-show="formData.pmsOrderStatus === 7">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-upload :action="uploadUrl" multiple
                     :show-file-list="false"
                     :on-success="paymentAttachmentUploadSuccessHandler"
                     :before-upload="paymentAttachmentUploadBeforeHandler">
            <el-button type="primary">
              选择文件<i class="el-icon-upload el-icon--right"/>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="9" v-if="paymentAttachment">
          <div style="border: 1px lightgrey solid; padding: 0 10px;height: 36px">
            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:550px;
                  display: inline-block;" :title="paymentAttachment.attachmentFileName">
              {{ paymentAttachment.attachmentFileName }}
            </div>
            <div style="float: right;margin-right: 10px">
              <!--下载附件-->
              <a :href="paymentAttachment.attachmentPath"
                 target="_blank"
                 :download="paymentAttachment.attachmentFileName"
                 class="el-icon-download el-icon--right"
                 title="下载凭证"
              ></a>
              <a href="#" class="el-icon-delete el-icon--right"
                 title="删除附件" style="margin-left: 10px"
                 @click.prevent="deleteAttachment(paymentAttachment.attachmentId,true)"></a>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="发票" v-show="formData.pmsOrderStatus === 7">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-upload :action="uploadUrl" multiple
                     :show-file-list="false"
                     :on-success="invoiceAttachmentUploadSuccessHandler"
                     :before-upload="invoiceAttachmentUploadBeforeHandler">
            <el-button type="primary">
              选择文件<i class="el-icon-upload el-icon--right"/>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="9" v-if="invoiceAttachment">
          <div style="border: 1px lightgrey solid; padding: 0 10px;height: 36px;">
            <div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:550px;
                  display: inline-block;" :title="invoiceAttachment.attachmentFileName">
              {{ invoiceAttachment.attachmentFileName }}
            </div>
            <div style="float: right;margin-right: 10px">
              <!--下载附件-->
              <a :href="invoiceAttachment.attachmentPath"
                 target="_blank"
                 :download="invoiceAttachment.attachmentFileName"
                 class="el-icon-download el-icon--right"
                 title="下载凭证"
              ></a>
              <a href="#" class="el-icon-delete el-icon--right"
                 title="删除附件" style="margin-left: 10px"
                 @click.prevent="deleteAttachment(invoiceAttachment.attachmentId,false)"></a>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="发票号" v-show="formData.pmsOrderStatus === 7">
          <el-input v-model="formData.invoiceNum" placeholder="请输入发票号" @change="changeInvoiceNumHandler"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-divider></el-divider>
    <!-- 提交按钮 -->
    <el-form-item style="margin-top: 22px">
      <el-button
        class="pull-right"
        type="danger"
        v-has-permi="['pms:in-order:cancel']"
        v-show="formData.cancelButton && formData.pmsOrderStatus !== 5 && formData.pmsOrderStatus !== 7"
        @click="cancelOrder"
      >取消订单
      </el-button>
      <el-button icon="el-icon-edit"
                 v-show="!readonly"
                 v-has-permi="['pms:in-order:edit']"
                 @click="submitForm"
      >重新提交
      </el-button>
      <el-button type="success"
                 v-show="formData.examineButton && (formData.pmsOrderStatus === 0 || formData.pmsOrderStatus === 1)"
                 @click="auditPass"
      >审核通过
      </el-button>
      <el-button type="danger"
                 v-show="formData.examineButton && (formData.pmsOrderStatus === 0 || formData.pmsOrderStatus === 1)"
                 @click="auditNoPass"
      >审核不通过
      </el-button>
      <el-button v-show="formData.returnButton && (formData.pmsOrderStatus === 0 || formData.pmsOrderStatus === 1)"
                 type="primary"
                 @click="revocation"
      >撤回
      </el-button>

      <el-button v-has-permi="['pms:order:confirm']"
                 v-show="formData.receiptButton && (formData.pmsOrderStatus === 3)"
                 type="primary"
                 @click="confirmReceipt"
      >确认收货
      </el-button>
      <el-button @click="goBack">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  examineOrderInfo,
  getOrderDetail,
  editOrderInfo,
  confirmReceipt,
  cancelOrderInfo,
  downloadReceiptTemplate
} from '@/api/pms/order'
import request, {uploadUrl} from '@/utils/request'
import supplierApi from '@/api/supplier/supplier'
import {getDicts} from '@/api/system/dict/data'

export default {
  name: "InOrderDetail",
  props: {
    tabName: {
      type: String,
      default: '',
    },
    orderId: {
      type: String,
      default: '',
    }
  },
  computed: {
    // 当前登录用户
    currUser() {
      return this.$store.state.user.user
    },
    readonly() {
      return !(this.formData.pmsOrderStatus === 2
        || this.formData.pmsOrderStatus === 4)
    },
    oldStr() {
      let {orderBizType, budgetType, orderDetailList} = this.orderDetail
      let details = orderDetailList.map(item => {
        return item.supplierId + '__' + item.goodsType + '__' + item.goodsId + '__' + item.amount
      }).join(',')
      return orderBizType + '__' + budgetType + '__' + details
    },
    newStr() {
      let {orderBizType, budgetType, orderDetailList} = this.formData
      let details = orderDetailList.map(item => {
        return item.supplierId + '__' + item.goodsType + '__' + item.goodsId + '__' + item.amount
      }).join(',')
      return orderBizType + '__' + budgetType + '__' + details
    },
    needAudit() {
      return this.oldStr != this.newStr
    },
    paymentAttachment() {
      return this.paymentAttachmentInfos && this.paymentAttachmentInfos.length > 0 ? this.paymentAttachmentInfos[0] : null
    },
    invoiceAttachment() {
      return this.invoiceAttachmentInfos && this.invoiceAttachmentInfos.length > 0 ? this.invoiceAttachmentInfos[0] : null
    }
  },
  watch: {
    orderId: {
      handler(newVal) {
        if (newVal) {
          console.log('订单详情', newVal);
          // 每次重新进入订单详情后需要重新清空表单校验
          if (this.$refs.form) {
            this.$refs.form.resetFields()
          }

          this.paymentAttachmentInfos = []
          this.invoiceAttachmentInfos = []

          this.getSupplierList()
          this.getBudgetTypeList()

          this.getOrderDetail(newVal)
        }
      },
      immediate: true,
    }
  },
  data() {
    return {
      uploadUrl: uploadUrl,
      formTitle: "基本信息",
      formData: {
        outOrderNo: '',
        applyDepart: '',
        applyDepartName: '',
        applyName: '',
        applyUserId: '',
        orderType: '0',
        pmsOrderStatus: '',
        applyDate: '',
        // 预算类型
        budgetType: '',
        budgetTypeName: '',
        applyReason: '',
        paymentFlag: '',
        orderBizType: '',
        recipientId: '',
        recipientName: '',
        // 领用部门id
        recipientDepartId: '',
        recipientDepartName: '',
        invoiceNum: '',
        invoiceName: '',
        invoiceUrl: '',
        consigneeName: '',
        consigneePhone: '',
        consigneeAddress: '',
        orderDetailList: [{
          "orderDetailId": "",
          "pmsOrderId": "",
          "goodsId": "",
          "goodsType": '',
          "goodsCode": "",
          "goodsName": "",
          "supplierId": "",
          "supplierName": "",
          "unitPrice": '',
          "taxRate": "",
          "amount": '',
          "totalPrice": '',
          "taxBid": '',
          "nonTaxBid": '',
          "totalTaxBid": '0.00',
          "nonTotalTaxBid": '0.00',
          "deleteFlag": '',
          "actualReceiptAmount": '',
          "actualReceiptPrice": '',
          "receiptRemark": "",
          "validityFlag": "",
          "validityDate": "",
          "grossMargin": ""
        }],
        // 按钮权限标识
        examineButton: 0,// 审核：判断是否有审核权限，0否1是
        returnButton: 0,// 撤回：判断是否有撤回权限，0否1是
        receiptButton: 0,// 签收：判断是否有收货权限，0否1是
        attachmentInfos: []
      },
      orderDetail: {},
      rules: {
        applyName: [{required: true, message: '请选择发起人', trigger: 'blur'}],
        applyDepartName: [{required: true, message: '请选择发起人部门', trigger: 'blur'}],
        applyDate: [{required: true, message: '请选择发起日期', trigger: 'blur'}],
        orderBizType: [{required: true, message: '请选择订单类型', trigger: 'blur'}],
        budgetTypes: [{required: true, message: '请输入预算类型', trigger: 'blur'}],
        amount: [
          {required: true, message: '请输入数量', trigger: 'blur'},
          {validator: this.checkAmount, trigger: 'blur'}
        ],
      },
      supplierMap: {},
      supplierOptions: [],
      // 物品类型:固定资产、消耗品、服务、销售品
      goodsTypes: [
        // {value: 1, label: '固定资产'},
        // {value: 2, label: '消耗品'},
        // {value: 3, label: '服务'},
        // {value: 4, label: '销售品'},
      ],
      // { supplierId:goodsList}
      goodsListOptions: {},
      goodsMap: {},
      orderBizTypes: [
        {label: '采购入库', value: '1-0'},
        {label: '盘盈入库', value: '1-2'},
        {label: '领用入库', value: '1-4'},
      ],
      budgetTypes: [],
      // 无需效期，有效期
      validityFlagOptions: [
        {label: '无需效期', value: '1'},
        {label: '有效期', value: '2'},
      ],
      paymentAttachmentInfos: [],
      invoiceAttachmentInfos: [],
    }
  },
  methods: {
    getGoodsTypes() {
      return getDicts('goods_types').then((res) => {
        this.goodsTypes = res.data
      })
    },
    /*关闭弹框*/
    handleEntryClose() {
      this.$refs.form.resetFields()
      this.$emit('close', {refresh: true})
    },
    getOrderDetail(orderId) {
      getOrderDetail(orderId).then(res => {
        res.data.orderDetailList = res.data.orderDetailList.map((item, index) => {
          if (!this.supplierOptions.some(supplier => supplier.supplierId === item.supplierId)) {
            this.supplierOptions.push({
              supplierId: item.supplierId,
              supplierCode: item.supplierCode,
              supplierName: item.supplierName,
              disabled: true
            })
          }

          return {
            ...item,
            // 默认收货数量是申请数量
            actualReceiptAmount: item.pmsOrderStatus === 3 ? item.amount : item.actualReceiptAmount
          }
        })

        if (res.data.budgetType) {
          let budgetType = res.data.budgetType.split("-")
          let budgetTypes = []
          for (let i = 0; i < budgetType.length; i++) {
            budgetTypes.push(Number.parseInt(budgetType[i]))
          }
          res.data.budgetTypes = budgetTypes
        }

        this.orderDetail = JSON.parse(JSON.stringify(res.data))
        this.formData = res.data
        let attachmentInfos = res.data.attachmentInfos || []
        this.invoiceAttachmentInfos = attachmentInfos.filter(item => item.attachmentObjectType === 'orderInvoice')
        this.paymentAttachmentInfos = attachmentInfos.filter(item => item.attachmentObjectType === 'orderPayment')
        this.formData.attachmentInfos = attachmentInfos.filter(item => item.attachmentObjectType === 'orderReceipt')
        for (let index = 0; index < this.formData.orderDetailList.length; index++) {
          this.setGoodsList(index)
        }
      })
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
            this.editOrder()
          }
        });
      })
    },
    // 编辑订单
    editOrder() {
      // console.log('oldStr：', this.oldStr)
      // console.log('newStr：', this.newStr)
      this.formData.changeFlag = this.needAudit

      let params = this.formData
      params.applyDepart = this.currUser.deptId
      params.applyDepartName = this.currUser.deptName
      params.applyName = this.currUser.nickName
      params.applyUserId = this.currUser.userId

      editOrderInfo(params).then(res => {
        if (res.code === 200) {
          this.$message.success('编辑成功')
          this.$emit('closeOrderDetail')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 取消订单
    cancelOrder() {
      this.$confirm('此操作将取消订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelOrderInfo(this.formData.pmsOrderId, 0).then((res) => {
          this.$message({
            type: 'success',
            message: '取消订单成功'
          })
          this.$emit('closeOrderDetail')
        })
      })
    },
    /*审核通过*/
    auditPass() {
      this.$confirm('是否确定审核通过?', '二次确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          pmsOrderId: this.formData.pmsOrderId,
          orderType: 0,
          examineType: 1,
        }
        examineOrderInfo(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.$emit('closeOrderDetail')
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
          pmsOrderId: this.formData.pmsOrderId,
          orderType: 0,
          examineType: 2,
          remark: value,
        }

        examineOrderInfo(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })

          this.$emit('closeOrderDetail')
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
          pmsOrderId: this.formData.pmsOrderId,
          orderType: 0,
          examineType: 3
        }

        examineOrderInfo(params).then((res) => {
          this.$message({
            type: 'success',
            message: '操作成功'
          })

          this.$emit('closeOrderDetail')
        })
      })
    },
    /*订单明细表格函数*/
    addRow() {
      this.formData.orderDetailList.push({
        "orderDetailId": "",
        "pmsOrderId": "",
        "goodsId": "",
        "goodsType": '',
        "goodsCode": "",
        "goodsName": "",
        "supplierId": "",
        "supplierName": "",
        "unitPrice": '',
        "taxRate": "",
        "amount": '',
        "totalPrice": '',
        "taxBid": '',
        "nonTaxBid": '',
        "totalTaxBid": '0.00',
        "nonTotalTaxBid": '0.00',
        "deleteFlag": '',
        "actualReceiptAmount": '',
        "actualReceiptPrice": '',
        "receiptRemark": "",
        "validityFlag": "",
        "validityDate": "",
        "grossMargin": ""
      });
    },
    deleteRow(index) {
      this.formData.orderDetailList.splice(index, 1);
    },
    checkAmount(rule, value, callback) {
      const regex = /^\d+$/;
      if (!regex.test(value)) {
        return callback(new Error('请输入正整数'))
      }

      return callback()
    },
    calculateTotal(row) {
      let taxRate = parseFloat(row.taxRate) / 100
      row.totalTaxBid = (row.taxBid * row.amount).toFixed(2)
      row.nonTotalTaxBid = (row.nonTaxBid * row.amount).toFixed(2)
    },
    getSupplierList(keyword = '') {
      let params = {
        codeNameKey: keyword,
        supplierStatus: 3,
      }
      // 查询供应商下拉列表
      request.post('pms/supplier/getSupplierList', params).then((res) => {
        this.supplierOptions = res.data
        this.supplierOptions.forEach(one => {
          this.supplierMap[one.supplierId] = one.supplierName
        })
      })
    },
    getBudgetTypeList(keyword = '') {
      request.get('/system/budget/getList', {
        params: {
          budgetName: keyword
        }
      }).then(({data}) => {
        this.budgetTypes = data;
      })
    },
    supplierChangeHandler(index) {
      this.formData.orderDetailList[index].goodsId = ''
      this.setGoodsList(index)
    },
    goodsTypeChangeHandler(index) {
      this.formData.orderDetailList[index].goodsId = ''
      this.setGoodsList(index)
    },
    setGoodsList(index) {
      let supplierId = this.formData.orderDetailList[index].supplierId
      if (!supplierId) {
        return
      }

      this.formData.orderDetailList[index].supplierName = this.supplierMap[supplierId]
      let goodsType = this.formData.orderDetailList[index].goodsType
      if (!goodsType) {
        return
      }

      let key = supplierId + '_' + goodsType
      let goodsList = this.goodsListOptions[key]
      if (!goodsList) {
        request.get('/pms/goods/queryAllList', {
          params: {
            supplierId, goodsType,
            goodsStatus: 3,
          }
        }).then(res => {
          goodsList = res.data
          this.$set(this.goodsListOptions, key, goodsList)
          goodsList.forEach(goods => {
            this.goodsMap[goods.goodsId] = goods
          })
        })
      } else {
        this.$set(this.goodsListOptions, key, goodsList)
      }
    },
    goodsChangeHandler(goodsId, index) {
      let goodsInfo = this.goodsMap[goodsId]
      let goodsCode = goodsInfo.goodsCode
      let goodsName = goodsInfo.goodsName
      let taxBid = goodsInfo.taxBid
      let nonTaxBid = goodsInfo.nonTaxBid
      let taxRate = goodsInfo.taxRate

      this.formData.orderDetailList[index].goodsId = goodsId
      this.formData.orderDetailList[index].goodsCode = goodsCode
      this.formData.orderDetailList[index].goodsName = goodsName
      this.formData.orderDetailList[index].taxBid = taxBid
      this.formData.orderDetailList[index].nonTaxBid = nonTaxBid
      this.formData.orderDetailList[index].taxRate = taxRate

      let amount = this.formData.orderDetailList[index].amount
      if (amount) {
        this.formData.orderDetailList[index].totalTaxBid = (taxBid * amount).toFixed(2)
        this.formData.orderDetailList[index].nonTotalTaxBid = (nonTaxBid * amount).toFixed(2)
      }
    },
    goBack() {
      this.$emit('closeOrderDetail')
    },
    isOverDate(dateStr) {
      return this.monent(dateStr).isBefore(this.monent()) ? '已到期' : ''
    },
    downloadReceipt() {
      downloadReceiptTemplate()
    },
    attachmentUploadBeforeHandler(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传的签收单大小不能超过 10MB!')
        return false
      }

      return true
    },
    handleAttachmentSuccess(response, file) {
      // 附件上传成功后的处理
      this.formData.attachmentInfos.push({
        attachmentId: '',
        attachmentFileName: response.data.name,
        attachmentPath: response.data.url,
      });
    },
    paymentAttachmentUploadBeforeHandler(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传的付款凭证大小不能超过 10MB!')
        return false
      }

      const isTYPE = /\/(jpe?g|png)|pdf$/.test(file.type);
      if (!isTYPE) {
        this.$message.error('上传的凭证只能是JPG/JPEG/PNG/PDF格式!')
        return false
      }

      return true
    },
    paymentAttachmentUploadSuccessHandler(response, file) {
      // 附件上传成功后的处理
      this.paymentAttachmentInfos = [{
        attachmentId: '',
        attachmentFileName: response.data.name,
        attachmentPath: response.data.url,
      }]

      // 附件上传成功后更新订单的付款凭证
      this.editOrderPayment()
    },
    invoiceAttachmentUploadBeforeHandler(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传的发票大小不能超过 10MB!')
        return false
      }

      const isTYPE = /\/(jpe?g|png)|pdf$/.test(file.type);
      if (!isTYPE) {
        this.$message.error('上传的发票只能是JPG/JPEG/PNG/PDF格式!')
        return false
      }

      return true
    },
    invoiceAttachmentUploadSuccessHandler(response, file) {
      // 附件上传成功后的处理
      this.invoiceAttachmentInfos = [{
        attachmentId: '',
        attachmentFileName: response.data.name,
        attachmentPath: response.data.url,
      }]

      // 附件上传成功后更新订单的发票
      this.editOrderInvoice(true)
    },
    confirmReceipt() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 表单验证通过，可以在这里进行提交操作
          confirmReceipt(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.$emit('closeOrderDetail')
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    },
    checkValidityDate(rule, value, callback) {
      if (value === '') {
        callback(new Error('请选择有效期'));
      } else {
        callback();
      }
    },
    // 编辑付款凭证
    editOrderPayment() {
      let pmsOrderId = this.formData.pmsOrderId
      let attachmentInfos = this.paymentAttachmentInfos
      request.post('/pms/order/editOrderPayment', {pmsOrderId, attachmentInfos}).then(res => {
        if (res.code === 200) {
          this.$message.success('付款凭证上传成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 编辑发票信息
    editOrderInvoice(uploadFlag) {
      let pmsOrderId = this.formData.pmsOrderId
      let invoiceNum = this.formData.invoiceNum
      let attachmentInfos = this.invoiceAttachmentInfos
      request.post('/pms/order/editOrderInvoice', {pmsOrderId, invoiceNum, attachmentInfos}).then(res => {
        if (res.code === 200) {
          this.$message.success(uploadFlag ? '发票上传成功' : '发票号修改成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    deleteAttachment(attachmentId, paymentFlag) {
      this.$confirm('此操作将永久删除该附件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (attachmentId) {
          supplierApi.deleteAttachment(attachmentId).then(res => {
            if (res.code === 200) {
              this.localDelAttachment(paymentFlag)
              this.$message.success('附件删除成功')
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          // 没有附件id的直接本地删除
          this.localDelAttachment(paymentFlag)
          this.$message.success('附件删除成功')
        }
      })
    },
    deleteReceipt(attachmentId, index) {
      this.$confirm('此操作将永久删除该附件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (attachmentId) {
          supplierApi.deleteAttachment(attachmentId).then(res => {
            if (res.code === 200) {
              this.formData.attachmentInfos.splice(index, 1)
              this.$message.success('附件删除成功')
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          // 没有附件id的直接本地删除
          this.formData.attachmentInfos.splice(index, 1)
          this.$message.success('附件删除成功')
        }
      })
    },
    localDelAttachment(paymentFlag) {
      if (paymentFlag) {
        this.paymentAttachmentInfos.splice(0, 1)
      } else {
        this.invoiceAttachmentInfos.splice(0, 1)
      }

      this.$message.success('删除成功')
    },
    changeInvoiceNumHandler(value) {
      if (value) {
        this.editOrderInvoice(false)
      }
    },
    hasGoods(row) {
      let list = this.goodsListOptions[row.supplierId + '_' + row.goodsType]
      if (!list) {
        return false
      }
      return this.goodsListOptions[row.supplierId + '_' + row.goodsType].some(goods => goods.goodsId === row.goodsId)
    },
    supplierValidator(rule, value, callback) {
      let supplierId = value
      if (value === '') {
        callback(new Error('请选择供应商'))
      } else {
        let supplier = this.supplierOptions.find(one => one.supplierId === supplierId)
        let validityDate = supplier.validityDate
        if (this.isOverDate(validityDate)) {
          callback(new Error('供应商已到期'))
        } else {
          callback()
        }
      }
    }
  },
  mounted() {
    this.getGoodsTypes()
  }
}
</script>

<style scoped>
.jiBenXinXi {
  font-weight: bolder;
  font-size: 14px;
  width: 100%;
  border-bottom: 1px solid #F2F2F2;
  margin-bottom: 22px;
  padding-bottom: 10px;
  box-sizing: content-box;
}

</style>
