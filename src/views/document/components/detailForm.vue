<template>
  <el-dialog
    class="upload"
    :close-on-click-modal="false"
    :visible.sync="detailVisibleForm"
    width="60%"
    :title="actionDetail === 'detail'?'订单详情':'订单详情'"
    @close="handleCloseDetail"
  >
    <div class="diaItem">
      <el-form ref="ruleForm" label-width="100px">
        <!--        基础信息-->
        <div class="title mb20">基础信息</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主订单号：" label-width="150px">
              {{ formItem.orderNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调度单号：" label-width="150px">
              {{ formItem.controlNo }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预计送货时间：" label-width="150px">
              {{ formItem.deliveryTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货人联系电话：" label-width="150px">
              {{ formItem.receiverContractPhone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单货品类型：" label-width="150px">
              <dict-tag :options="dict.type.order_goods_type" :value="formItem.orderGoodsType"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输条件：" label-width="150px">
              <dict-tag :options="dict.type.transportation_condition" :value="formItem.transportationCondition"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主：" label-width="150px">
              {{ formItem.orgName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货单位：" label-width="150px">
              <el-input v-model="formItem.senderName" disabled></el-input>
              <!-- <el-select v-model="formItem.senderId"
                         :clearable="true"
                         disabled
                         :remote-method="queryFilterSender"
                         @click.native="queryFilterSender('')"
                         filterable
                         placeholder="请输入名称搜发货单位"
                         remote>
                <el-option v-for="org in filterSenderList" :key="org.unitId" :label="org.unitName" :value="org.unitId"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货联系人：" label-width="150px">
              {{ formItem.senderContact }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货联系电话：" label-width="150px">
              {{ formItem.senderContactPhone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货地区：" label-width="150px">
              {{ formItem.senderAddress }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="具体地址：" label-width="150px">
              {{ formItem.senderDetailAddr }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收货单位：" label-width="150px">
              <el-input v-model="formItem.receiverName" disabled></el-input>
              <!-- <el-select v-model="formItem.receiverId"
                         :clearable="true"
                         disabled
                         :remote-method="queryFilterSender"
                         @click.native="queryFilterSender('')"
                         filterable
                         placeholder="请输入名称搜发货单位"
                         remote>
                <el-option v-for="org in filterSenderList" :key="org.unitId" :label="org.unitName" :value="org.unitId"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货地区：" label-width="150px">
              {{ formItem.receiverAddress }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收货联系人：" label-width="150px">
              {{ formItem.receiverContact }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货联系电话：" label-width="150px">
              {{ formItem.receiverContractPhone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="具体地址：" label-width="150px">
              {{ formItem.receiverDetailAddr }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承运类型：" label-width="150px">
              <div v-if="formItem.carryType === 0">指定承运商</div>
              <div v-if="formItem.carryType === 1">自动派发</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承运商名称：" label-width="150px">
              {{ formItem.carrierName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="整箱箱数：" label-width="150px">
              {{ formItem.wholeBoxCount }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="散件箱数：" label-width="150px">
              {{ formItem.bulkBoxCount }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重 量kg：" label-width="150px">
              {{ formItem.goodsWeight }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体 积m³：" label-width="150px">
              {{ formItem.goodsVolume }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="总价：" label-width="150px">
              {{ formItem.goodsTotalPrice }}
            </el-form-item>
          </el-col>
        </el-row>
        <!--        基础信息-->
        <div class="title mb20">操作日志</div>
        <el-table class="mb20" :data="orderLog" border>
          <el-table-column label="类型">
            <template slot-scope="{row}">
              {{ row.logActionType }}
            </template>
          </el-table-column>
          <el-table-column label="时间">
            <template slot-scope="{row}">
              {{ row.logOperationTime }}
            </template>
          </el-table-column>
          <el-table-column label="创建人">
            <template slot-scope="{row}">
              {{ row.logOperatorName }}
            </template>
          </el-table-column>
        </el-table>
        <!--        基础信息-->
        <div class="title mb20">推送日志</div>
        <el-table
          :data="orderPushLog" border>
          <el-table-column label="类型">
            <template slot-scope="{row}">
              <span v-if="row.pushType === 'push-order'">推送订单</span>
              <span v-if="row.pushType === 'cancel-order'">取消订单</span>
            </template>
          </el-table-column>
          <el-table-column label="推送信息">
            <template slot-scope="{row}">
              {{ row.pushMessage }}
            </template>
          </el-table-column>
          <el-table-column label="推送时间">
            <template slot-scope="{row}">
              {{ row.pushTime }}
            </template>
          </el-table-column>
          <el-table-column label="推送状态">
            <template slot-scope="{row}">
              {{ row.pushStatusCode }}
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import mixins from '../mixins/mixins'

export default {
  name: 'detailForm',
  dicts: ['order_type', 'transportation_condition', 'deliver_way','order_goods_type'],
  mixins: [mixins],
  props: {
    detailVisibleForm: {
      type: Boolean,
      default: false
    },
    actionDetail: {
      type: String,
      default: '订单详情'
    },
    formItem: {
      type: Object,
      default: {},
      required: true
    },
    orderLog:{
      type:Array,
      default: {},
      required: true
    },
    orderPushLog:{
      type:Array,
      default: {},
      required: true
    }
  },
  data() {
    return {
      tableList: []
    }
  },
  watch: {
    formItem: function(val) {

    }
  },
  mounted() {

  },
  methods: {
    /* 关闭弹框信息 */
    handleCloseDetail() {
      this.$emit('handleCloseDetail')
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
