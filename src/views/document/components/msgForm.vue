<template>
  <!--  新增表单-->
  <el-dialog class="upload"
             :close-on-click-modal="false"
             :visible="dialogVisibleForm"
             width="60%"
             :title="action === 'add'?'添加订单':'编辑订单'"
             @close="handleCloseVisible"
  >
    <div class="diaItem">
      <el-form :model="modelForm" :rules="formRules" ref="ruleForm" label-width="100px">
        <!--        基础信息-->
        <div class="title mb20">基础信息</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主订单号" prop="orderNo" label-width="150px">
              <el-input placeholder="请输入货主订单号" v-model="modelForm.orderNo" maxlength="20" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
<!--            <el-form-item label="调度单号">-->
<!--            </el-form-item>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单类型" prop="orderType" label-width="150px">
              <el-select
                v-model="modelForm.orderType" :clearable="true" filterable placeholder="请选择订单类型"
              >
                <el-option v-for="item in dict.type.order_type" :key="item.value" :label="item.label"
                           :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输条件" prop="transportationCondition" label-width="150px">
              <el-select
                v-model="modelForm.transportationCondition" :clearable="true" filterable placeholder="请选择运输条件"
              >
                <el-option v-for="item in dict.type.transportation_condition.filter(item=>item.value !=0)" :key="item.value" :label="item.label"
                           :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="发运方式" prop="deliveryWay" label-width="150px">
            <el-select
              v-model="modelForm.deliveryWay" :clearable="true" filterable placeholder="请选择发运方式"
            >
              <el-option v-for="item in dict.type.deliver_way" :key="item.value" :label="item.label"
                         :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提货时间" prop="pickUpTime" label-width="150px">
              <el-date-picker
                v-model="modelForm.pickUpTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择提货时间"
                value-format="timestamp"
                type="datetime"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计时间" prop="deliveryTime" label-width="150px">
              <el-date-picker
                v-model="modelForm.deliveryTime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="请选择预计送达时间"
                value-format="timestamp"
                type="datetime"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="承运类型" prop="carryType" label-width="150px">
              <el-radio-group v-model="modelForm.carryType" size="small">
                <el-radio  :label="0">指定承运商</el-radio>
                <el-radio  :label="1">自动派发</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="承运商名称" prop="carrierId" label-width="150px" v-if="modelForm.carryType === 0">
              <el-select v-model="modelForm.carrierId"
                         :clearable="true"
                         :remote-method="queryCarrierList"
                         filterable
                         :loading="loading"
                         placeholder="请输入名称搜承运商名称"
                         remote>
                <el-option v-for="org in carrierList" :key="org.carrierId" :label="org.carrierName" :value="org.carrierId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        发货信息-->
        <div class="title mb20">发货信息</div>
        <el-row>
          <el-form-item label="货主" prop="orgName" label-width="150px">
            <el-input placeholder="请输入货主" v-model="modelForm.orgName"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="发货单位" prop="senderId" label-width="150px">
            <el-select v-model="modelForm.senderId"
                       :clearable="true"
                       :remote-method="queryFilterSender"
                       @click.native="queryFilterSender('')"
                       filterable
                       :disabled="disabled"
                       placeholder="请输入名称搜发货单位"
                       remote>
              <el-option v-for="org in filterSenderList" :key="org.unitId" :label="org.unitName" :value="org.unitId"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货联系人" prop="senderContact" label-width="150px">
              <el-input placeholder="请输入发货联系人" v-model="modelForm.senderContact" maxlength="10" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货电话" prop="senderContactPhone" label-width="150px">
              <el-input placeholder="请输入发货联系电话" v-model="modelForm.senderContactPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="发货地区"  label-width="150px" prop="cascaderVal" >
            <el-cascader :options="selectdata.areas" ref="cascaderVal" v-model="modelForm.cascaderVal"  clearable placeholder="请选择发货地区" @change="handleCascader" filterable></el-cascader>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="具体地址" prop="senderDetailAddr" label-width="150px">
            <el-input placeholder="请输入具体地址" v-model="modelForm.senderDetailAddr" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-row>
        <!-- <el-row>
          <el-form-item label="上门提货" prop="isDoor" label-width="150px">
            <el-radio-group size="small" v-model="modelForm.isDoor">
              <el-radio label="true">需要</el-radio>
              <el-radio label="false">不需要</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row> -->
        <!--        收货信息-->
        <div class="title mb20">收货信息</div>
        <el-row>
          <el-form-item label="收货单位" prop="receiverId" label-width="150px">
            <!-- <el-select v-model="modelForm.receiverId"
                       :clearable="true"
                       :remote-method="queryFilterReceive"
                       @click.native="queryFilterReceive('')"
                       filterable
                       placeholder="请输入名称搜发货单位"
                       remote>
              <el-option v-for="org in consigneeList" :key="org.unitId" :label="org.unitName" :value="org.unitId"></el-option>
            </el-select> -->
            <el-select filterable remote placeholder="请选择/输入收货单位" :remote-method="filterReceiverOrg"
                         :clearable="true" allow-create default-first-option
                         @clear="addressList = []"
                         @change="receiverChange"
                         v-model="modelForm.receiverId" popperClass="good-selects">
                <el-option :value="org.receiverId" :key="org.receiverId" :label="org.receiverName"
                           v-for="org in consigneeList">
                </el-option>
          </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收货联系人" prop="receiverContact" label-width="150px">
              <el-input placeholder="请输入收货联系人" v-model="modelForm.receiverContact" maxlength="10" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收货联系电话" prop="receiverContractPhone" label-width="150px">
              <el-input placeholder="请输入收货联系电话" v-model="modelForm.receiverContractPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="收货地区" label-width="150px" prop="cascaderValOption">
            <el-cascader :options="selectdata.areas" ref="cascaderValOption" v-model="modelForm.cascaderValOption" filterable clearable placeholder="请选择收货地区" @change="handleCascaderOption"
            ></el-cascader>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="具体地址" prop="receiverDetailAddr" label-width="150px">
            <!-- <el-input placeholder="请输入具体地址" v-model="modelForm.receiverDetailAddr" maxlength="100" show-word-limit></el-input> -->
            <el-select filterable placeholder="请选择/输入具体的收货地址"
                         :clearable="true" allow-create default-first-option
                         @change="receiverDetailAddrChange"
                         v-model="modelForm.receiverDetailAddr">
                <el-option  v-for="item in addressList" :value="item.receiverAddress" :key="item.receiverAddressId" :label="item.receiverAddress">
                </el-option>
              </el-select>
          </el-form-item>
        </el-row>
        <!--        货品信息-->
        <div class="title mb20">货品信息</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="整箱箱数" prop="wholeBoxCount" label-width="150px">
              <el-input placeholder="请输入整箱箱数" v-model="modelForm.wholeBoxCount" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="散件箱数" prop="bulkBoxCount" label-width="150px">
              <el-input placeholder="请输入散件箱数" v-model="modelForm.bulkBoxCount" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重 量kg" prop="goodsWeight" label-width="150px">
              <el-input placeholder="请输入重 量kg" v-model="modelForm.goodsWeight" type="number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体 积m³" prop="goodsVolume" label-width="150px">
              <el-input placeholder="请输入体 积m³" v-model="modelForm.goodsVolume" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货品名称"  label-width="150px">
              <el-input placeholder="请输入货品名称" v-model="modelForm.goodsTotalName" maxlength="50" show-word-limit></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订单货品类型" prop="orderGoodsType" label-width="150px">
              <el-select
                v-model="modelForm.orderGoodsType" placeholder="请选择订单货品类型"
              >
                <el-option v-for="item in dict.type.order_goods_type" :key="item.value" :label="item.label"
                           :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总价" label-width="150px">
              <el-input placeholder="请输入总价" v-model="modelForm.goodsTotalPrice" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeVisibleForm">关 闭</el-button>
      <el-button type="primary" @click="addVisibleForm" :disabled="doing">确认订单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserKey} from '@/utils/auth'
import selectdata from '../../../utils/selectdata'
import { orderList,receiverList } from '../../../api/order/import'
import { getCarriers } from '../../../api/system/carrier'
import { userUnitList } from '../../../api/system/unit'
// import mixins from '../mixins/mixins'
export default {
  name: 'msgForm',
  // mixins: [mixins],
  dicts: ['order_type', 'transportation_condition', 'deliver_way', 'order_goods_type'],
  props: {
    dialogVisibleForm: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      doing: false,
      selectdata,
      modelForm: {
        cascaderVal:[],
        cascaderValOption:[], // 收货地区编码
        //基础信息
        orderNo: '',// 货主订单号
        orderType: '',//订单类型
        transportationCondition: '',//运输条件
        deliveryWay: '',//发运方式
        pickUpTime: '',//提货时间
        deliveryTime: '',//预计送达时间
        carryType:'',//承运类型
        carrierId: '',//承运商名称
        //发货信息
        orgName: '',//货主
        senderId: '',//发货单位
        senderContact: '',//发货联系人
        senderContactPhone: '',//发货联系电话
        senderProvinceCode: '', //发货单位所属省编码
        senderCityCode: '', //发货单位所属市编码
        senderRegionCode: '', //发货单位所属区编码
        senderAddressCode:'',//地址拼接
        senderDetailAddr: '',//发货具体地址
        // isDoor: '',//上门提货
        //收货信息
        receiverId: '',//收货单位id
        receiverName: '', //收货单位名字
        receiverContact: '',//收货联系人
        receiverContractPhone: '',//收货联系电话
        receiverProvinceCode: '', //收货单位所属省编码
        receiverCityCode: '', //收货单位所属市编码
        receiverRegionCode: '', //收货单位所属区编码
        receiverAddressCode:'',//地址拼接
        receiverDetailAddr: '',//具体地址
        //货品信息
        wholeBoxCount: '',//整箱箱数
        bulkBoxCount: '',//散装箱数
        goodsWeight: '',//重量
        goodsVolume: '',//体积
        goodsTotalName: '',//货品名称
        orderGoodsType: '',//货品订单类型
        goodsTotalPrice: ''//总价
      },
      formRules: {
        cascaderVal:[{ required: true, message: '请选择发货地址', trigger: 'change' }],
        cascaderValOption:[{ required: true, message: '请选择收货地址', trigger: 'change' }],
        //基础信息
        orderNo: [{ required: true, message: '请输入货主订单号', trigger: 'change' }],
        orderType: [{ required: true, message: '请选择订单类型', trigger: 'change' }],
        transportationCondition: [{ required: true, message: '请选择运输条件', trigger: 'change' }],
        deliveryWay: [{ required: true, message: '请选择发运方式', trigger: 'change' }],
        pickUpTime: [{ required: false, message: '请选择提货时间', trigger: 'change' }],
        deliveryTime: [{ required: false, message: '请选择预计送达时间', trigger: 'change' }],
        carryType: [{ required: true, message: '请选择承运类型', trigger: 'change' }],
        carrierId: [{ required: true, message: '请选择承运商名称', trigger: 'change' }],
        //发货信息
        orgName: [{ required: false, message: '请输入货主', trigger: 'change' }],
        senderId: [{ required: true, message: '请输入发货单位', trigger: 'change' }],
        senderContact: [{ required: true, message: '请输入发货联系人', trigger: 'change' }],
        senderContactPhone: [{ required: true, message: '请输入发货联系电话', trigger: 'change' }],
        senderDetailAddr: [{ required: true, message: '请输入发货具体地址', trigger: 'change' }],
        // isDoor: [{ required: true, message: '是否上门提货', trigger: 'change' }],
        //收货信息
        receiverId: [{ required: true, message: '请输入收货单位', trigger: 'change' }],
        receiverContact: [{ required: true, message: '请输入收货联系人', trigger: 'change' }],
        receiverContractPhone: [{ required: true, message: '请输入收货联系人', trigger: 'change' }],
        receiverDetailAddr: [{ required: true, message: '请输入具体地址', trigger: 'change' }],
        //货品信息
        wholeBoxCount: [{ required: true, message: '请输入整箱箱数', trigger: 'change' }],
        bulkBoxCount: [{ required: true, message: '请输入散装箱数', trigger: 'change' }],
        goodsWeight: [{ required: true, message: '请输入重量', trigger: 'change' }],
        goodsVolume: [{ required: true, message: '请输入体积', trigger: 'change' }],
        // goodsTotalName: [{ required: true, message: '请输入货品名称', trigger: 'change' }],
        orderGoodsType: [{ required: true, message: '请选择货品订单类型', trigger: 'change' }]
      },
      loading:false,
      carrierList:[], //承运商
      //  发货单位
      filterSenderList:[],
      // 收货单位
      consigneeList:[],
      User:JSON.parse(getUserKey()) || null,  // 缓存拿取用户信息
      disabled:false, //发货地址下拉是否可编辑
      addressList: [],  // 收货具体地址的下拉列表

    }
  },
  // mounted() {
  //   console.log(this.dialogVisibleForm,'dialogVisibleForm');
  //   this.queryFilterSender()
  //   // this.queryFilterReceive()
  //   this.filterReceiverOrg()
  // },
  watch: {
    dialogVisibleForm:{
      handler(val){
        if(val){
          // this.$refs.ruleForm.resetFields()
          // 发货单位修改，收货单位下拉也要跟随变动
            this.queryFilterSender()
        }
      },
      immediate: true
    },
  },
  methods: {
    //发货单位
    queryFilterSender(query){
      let params = {
        pageNum:1,
        pageSize:200,
        unitName:query,
        unitStatus:0
      }
      userUnitList(params,0).then(res=>{
        this.filterSenderList = res.rows
        if(res.rows && res.rows.length == 1){
          this.disabled = true
          this.modelForm.senderId = res.rows[0].unitId
          this.modelForm.orgName = res.rows[0].unitName
        }
        this.filterReceiverOrg()
      })
    },
    // 过滤收货单位
    filterReceiverOrg(receiverName, pageNo = 1, pageSize = 100) {
      let params= {
        senderId:this.modelForm.senderId || '',
        receiverName:receiverName || '',
        pageNo,
        pageSize,
      }
      receiverList(params)
        .then(res => {
          const {total, rows} = res;
          if (pageNo == 1) {
            this.consigneeList = rows;
          } else {
            this.consigneeList = this.consigneeList.concat(rows);
          }
          if ((total/pageSize) > pageNo) {
            this.filterReceiverOrg(receiverName, pageNo++);
          }
        })
    },
     // 收货单位变更时的处理
    receiverChange(value) {
      if (value === '') {
        this.modelForm.receiverId = '';
        this.modelForm.receiverName = '';
        this.modelForm.receiverProvinceCode = '';
        this.modelForm.receiverCityCode = '';
        this.modelForm.receiverRegionCode = '';
        this.modelForm.receiverDetailAddr = '';
        this.modelForm.cascaderValOption = [];
        this.addressList = [];
        return;
      }

      const item = this.consigneeList.find(item => item.receiverId == value);
      if (!item) {
        this.modelForm.receiverName = value;
        this.modelForm.receiverProvinceCode = '';
        this.modelForm.receiverCityCode = '';
        this.modelForm.receiverRegionCode = '';
        this.modelForm.receiverDetailAddr = '';
        this.modelForm.cascaderValOption = [];
        this.addressList = [];
        return;
      }

      this.addressList = item.addressList;
      if (this.addressList.length == 0) {
        this.modelForm.receiverDetailAddr = '';
        this.modelForm.cascaderValOption = [];
        return;
      }

      // 如果收货单位有多个地址，这里只回显第一个
      const {
        receiverProvinceCode,
        receiverCityCode,
        receiverRegionCode,
        receiverAddress,
      } = this.addressList[0];

      // this.provinceChange(receiverProvinceCode);
      // this.cityChange(receiverCityCode);

      this.modelForm.receiverId = item.receiverId;
      this.modelForm.receiverName = item.receiverName;
      this.modelForm.receiverProvinceCode = receiverProvinceCode;
      this.modelForm.receiverCityCode = receiverCityCode;
      this.modelForm.receiverRegionCode = receiverRegionCode;
      this.modelForm.receiverDetailAddr = receiverAddress;

      this.modelForm.cascaderValOption = [
        this.modelForm.receiverProvinceCode,
        this.modelForm.receiverCityCode,
        this.modelForm.receiverRegionCode
      ];
    },
    // 收货具体地址
    receiverDetailAddrChange(value) {
      if (!value) {
        return;
      }

      const addr = this.addressList.find(item => item.receiverAddress == value);
      if (addr == undefined) {
        this.modelForm.receiverDetailAddr = value;
        // return;
      } else {
        this.modelForm.cascaderValOption = [addr.receiverProvinceCode, addr.receiverCityCode, addr.receiverRegionCode];
      }
    },
    /*关闭弹窗*/
    handleCloseVisible() {
      this.resetForm()
      this.$refs.ruleForm.resetFields()
      this.$emit('handleCloseVisible')
    },
    /* 取消表单*/
    closeVisibleForm() {
      this.resetForm()
      this.$refs.ruleForm.resetFields()
      this.$emit('handleRefreshFn')
    },
    // 重置表单
    resetForm(){
      this.modelForm= {
        cascaderVal:[],
        cascaderValOption:[], // 收货地区编码
        //基础信息
        orderNo: '',// 货主订单号
        orderType: '',//订单类型
        transportationCondition: '',//运输条件
        deliveryWay: '',//发运方式
        pickUpTime: '',//提货时间
        deliveryTime: '',//预计送达时间
        carryType:'',//承运类型
        carrierId: '',//承运商名称
        //发货信息
        orgName: '',//货主
        senderId: '',//发货单位
        senderContact: '',//发货联系人
        senderContactPhone: '',//发货联系电话
        senderProvinceCode: '', //发货单位所属省编码
        senderCityCode: '', //发货单位所属市编码
        senderRegionCode: '', //发货单位所属区编码
        senderAddressCode:'',//地址拼接
        senderDetailAddr: '',//发货具体地址
        // isDoor: '',//上门提货
        //收货信息
        receiverId: '',//收货单位id
        receiverName: '', //收货单位名字
        receiverContact: '',//收货联系人
        receiverContractPhone: '',//收货联系电话
        receiverProvinceCode: '', //收货单位所属省编码
        receiverCityCode: '', //收货单位所属市编码
        receiverRegionCode: '', //收货单位所属区编码
        receiverAddressCode:'',//地址拼接
        receiverDetailAddr: '',//具体地址
        //货品信息
        wholeBoxCount: '',//整箱箱数
        bulkBoxCount: '',//散装箱数
        goodsWeight: '',//重量
        goodsVolume: '',//体积
        goodsTotalName: '',//货品名称
        orderGoodsType: '',//货品订单类型
        goodsTotalPrice: ''//总价
      }
    },
    /* 增加表单*/
    addVisibleForm() {
      if (this.doing) return;
      this.doing = true;
      // 进行表单验证
      this.$refs['ruleForm'].validate((valid) => {
        if (!valid) {
          this.doing = false;
          return false
        }
        this.doing = true;
        if(this.modelForm.carryType === 1){
          this.modelForm.carrierId = ""
        }
        if (this.action === 'add') {
          let params = Object.assign({},
            {
              orderNo: this.modelForm.orderNo,
              orderType: this.modelForm.orderType,
              transportationCondition: this.modelForm.transportationCondition,
              deliveryWay: this.modelForm.deliveryWay,
              pickUpTime: this.modelForm.pickUpTime,
              deliveryTime: this.modelForm.deliveryTime,
              carryType: this.modelForm.carryType,
              carrierId: this.modelForm.carrierId,
              orgName: this.modelForm.orgName,
              senderId: this.modelForm.senderId,
              senderContact: this.modelForm.senderContact,
              senderContactPhone: this.modelForm.senderContactPhone,
              senderProvinceCode: this.modelForm.senderProvinceCode,
              senderCityCode: this.modelForm.senderCityCode,
              senderRegionCode: this.modelForm.receiverRegionCode,
              senderDetailAddr: this.modelForm.senderDetailAddr,
              senderAddress:this.modelForm.senderAddressCode+this.modelForm.senderDetailAddr,
              // isDoor: this.modelForm.isDoor,
              receiverId: this.modelForm.receiverId,
              receiverName: this.modelForm.receiverName,
              receiverContact: this.modelForm.receiverContact,
              receiverContractPhone: this.modelForm.receiverContractPhone,
              receiverProvinceCode: this.modelForm.receiverProvinceCode,
              receiverCityCode: this.modelForm.receiverCityCode,
              receiverRegionCode: this.modelForm.receiverRegionCode,
              receiverDetailAddr: this.modelForm.receiverDetailAddr,
              receiverAddress:this.modelForm.receiverAddressCode + this.modelForm.receiverDetailAddr,
              wholeBoxCount: this.modelForm.wholeBoxCount,
              bulkBoxCount: this.modelForm.bulkBoxCount,
              goodsWeight: this.modelForm.goodsWeight,
              orderGoodsType: this.modelForm.orderGoodsType,
              goodsTotalName: this.modelForm.goodsTotalName,
              goodsVolume: this.modelForm.goodsVolume,
              goodsTotalPrice: this.modelForm.goodsTotalPrice
            }
          )
          if (params.receiverName === params.receiverId) {
          // 如果id和名字是一样的说明是新增的单位，需要把id置空
            params.receiverId = null;
          }
          new orderList().addOrderForm(params).then((res) => {
            this.doing = false;
            // this.dialogVisibleForm= false
            this.$message.success('新增订单成功')
            this.resetForm()
            this.$emit('handleRefreshFn')
          }).catch(error => {
            this.doing = false;
            // this.dialogVisibleForm= false
            this.$message.error('新增订单失败')
            this.$emit('handleRefreshFn')
          })
        }
      })
    },
    /* 地区编码处理*/
    handleCascader(val) {
      this.$nextTick(() => {
        let expenseItem = this.$refs.cascaderVal.getCheckedNodes()[0].pathLabels
        this.modelForm.senderAddressCode = expenseItem[0]+expenseItem[1]+expenseItem[2]
      })
      if(val){
        this.modelForm.senderProvinceCode = val[0]
        this.modelForm.senderCityCode = val[1]
        this.modelForm.senderRegionCode = val[2]
      }
      
    },
    handleCascaderOption(val){
      this.$nextTick(() => {
        let expenseItem = this.$refs.cascaderValOption.getCheckedNodes()[0].pathLabels
        this.modelForm.receiverAddressCode = expenseItem[0]+expenseItem[1]+expenseItem[2]
      })
      if(val){
        this.modelForm.receiverProvinceCode = val[0]
        this.modelForm.receiverCityCode = val[1]
        this.modelForm.receiverRegionCode = val[2]
      }
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
  },
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
.good-selects, .order-good-selects {
  .el-select-dropdown__item {
    padding-top: 4px;
    padding-bottom: 4px;
    height: auto;
    span {
      line-height: initial !important;
    }
    .el-tag {
      line-height: 22px !important;
      height: 22px;
      float: left;
      padding: 0 5px;
    }
    .select-other-info {
      line-height: initial;
    }
  }
}

.select-other-info {
  color: #999;
  margin-left: 10px
}
</style>
