<template>
  <el-dialog
    class="upload"
    :close-on-click-modal="false"
    :visible.sync="detailVisibleFenPeiForm"
    width="60%"
    :title="actionDetailFenPeiForm === 'detailFenPeiForm'?'分配详情':'分配详情'"
    @close="handleCloseFenPeiForm"
  >
    <div class="diaItem">
      <el-form ref="ruleForm" label-width="100px">
        <!--        基础信息-->
        <div class="title mb20">基础信息</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主订单号：" label-width="150px">
              {{ formItemFenPeiForm.orderNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调度单号：" label-width="150px">
              {{ formItemFenPeiForm.controlNo }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计送货时间：" label-width="150px">
              {{ formItemFenPeiForm.deliveryTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货人联系电话：" label-width="150px">
              {{ formItemFenPeiForm.receiverContractPhone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单货品类型：" label-width="150px">
              <dict-tag :options="dict.type.order_type" :value="formItemFenPeiForm.orderType"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输条件：" label-width="150px">
              <dict-tag :options="dict.type.transportation_condition" :value="formItemFenPeiForm.transportationCondition"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主：" label-width="150px">
              {{ formItemFenPeiForm.orgName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货单位：" label-width="150px">
              {{ formItemFenPeiForm.senderId }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承运类型" prop="carryType" label-width="150px">
              <el-radio-group v-model="formItemFenPeiForm.carryType" size="small">
                <el-radio :label="0">指定承运商</el-radio>
                <el-radio :label="1">自动派发</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="承运商名称" prop="carrierId" label-width="150px">
<!--              {{formItemFenPeiForm.carrierName}}-->
<!--              <el-input v-model="formItemFenPeiForm.carrierName" :disabled=""></el-input>-->
              <el-select v-model="formItemFenPeiForm.carrierId"
                         :clearable="true"
                         :remote-method="queryCarrierList"
                         @click.native="queryCarrierList('')"
                         filterable
                         :disabled="formItemFenPeiForm.carryType === 1"
                         placeholder="请输入名称搜承运商名称"
                         remote>
                <el-option v-for="org in carrierList" :key="org.carrierId" :label="org.carrierName" :value="org.carrierId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="整箱箱数：" label-width="150px">
              {{ formItemFenPeiForm.wholeBoxCount }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="散件箱数：" label-width="150px">
              {{ formItemFenPeiForm.bulkBoxCount }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重 量kg：" label-width="150px">
              {{ formItemFenPeiForm.goodsWeight }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体 积m³：" label-width="150px">
              {{ formItemFenPeiForm.goodsVolume }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单货品类型：" label-width="150px">
              <dict-tag :options="dict.type.order_goods_type" :value="formItemFenPeiForm.orderGoodsType"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总价：" label-width="150px">
              {{ formItemFenPeiForm.goodsTotalPrice }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeForm">取消分配</el-button>
      <el-button type="primary" @click="submitForm">确认分配</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orderList } from '../../../api/order/import'
import { getCarriers } from '../../../api/system/carrier'
import mixins from '../mixins/mixins'
export default {
  name: 'fenPeiForm',
  mixins: [mixins],
  dicts: ['order_type', 'transportation_condition', 'deliver_way','order_goods_type'],
  props: {
    detailVisibleFenPeiForm: {
      type: Boolean,
      default: false
    },
    actionDetailFenPeiForm: {
      type: String,
      default: '分配详情'
    },
    formItemFenPeiForm: {
      type: Object,
      default: {},
      required: true
    },
  },
  data() {
    return {
      tableList: [],
      orderId:"",
      carrierList:[]
    }
  },
  watch: {
    formItemFenPeiForm: function(val) {
      this.orderId = val.orderId
      this.queryCarrierList(val.carrierName)
    }
  },
  mounted() {

  },
  methods: {
    /* 关闭弹框信息 */
    handleCloseFenPeiForm() {
      this.$emit('handleCloseFenPeiForm')
    },
    /*确认分配*/
    submitForm(){
      let query = {
        orderId:this.formItemFenPeiForm.orderId,
        carryType:this.formItemFenPeiForm.carryType,
        carrierId:this.formItemFenPeiForm.carrierId,
      }
      new orderList().order(query).then(res=>{
        this.$notify.success({
          duration: 2000,
          name: '成功',
          message: '分配详情成功'
        });
        this.$emit('refreshSubmitForm')
      }).catch(error=>{
        this.$notify.success({
          duration: 2000,
          name: '成功',
          message: error.response.data
        });
        this.$emit('refreshSubmitForm')
      })
    },
    // 搜索承运商
    queryCarrierList(query){
        if (query !== '') {
          this.loading = true;
          getCarriers(query).then(res=>{
            this.carrierList = res
            this.loading = false;
          })
        } else {
          this.carrierList = [];
        }
    },
    /* 取消分配*/
    closeForm(){
      this.$emit('handleCloseFenPeiForm')
    }
  }
}
</script>
<style lang="scss">
.el-dialog__title {
  font-size: 18px;
  font-weight: bolder;
}
</style>
<style scoped lang="scss">
.diaItem {
  width: 100%;

  .title {
    width: 100%;
    box-sizing: border-box;
    padding-left: 10px;
    border-left: 3px solid #3D7DFF;
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
