<template>
  <div class="wrap">
    <header>
      <div class="left" @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>
        <span>资产信息</span>
      </div>
      <div class="btns">
        <div class="item" v-if="showEntry">
          <span @click="warehousing">入库</span>
        </div>
        <div class="item" v-if="showRepair">
          <span @click="initRepair">维修</span>
        </div>
        <div class="item" v-if="showScrap">
          <span @click="initScrap">报废</span>
        </div>
        <div class="item" v-if="showReturn">
          <span @click="initReturn">归还</span>
        </div>
        <div class="item" v-if="showEntry">
          <span @click="goEdit">编辑</span>
        </div>
        <div class="item">
          <span @click="printCode">打印条码</span>
        </div>
      </div>
    </header>
    <div class="main">
      <span class="status">
        {{ status }}
      </span>
      <div class="section">
        <div class="heading">
          <span class="bar"></span>
          <b>基础信息</b>
        </div>
        <el-row>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">资产编号：</span>
              <span class="value">{{ info.assetId }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item" style="display:flex">
              <span class="star">*</span>
              <span class="label">资产条码：</span>
              <div class="box">
                <el-popover
                  trigger="hover"
                  placement="bottom-start"
                >
                  <div class="qrcode" ref="qrcode" slot="reference"></div>
                  <div class="qrcodeLarge" ref="qrcodeLarge"></div>
                </el-popover>
              </div>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">财务编号：</span>
              <span class="value">{{ info.financialNo }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">资产名称：</span>
              <span class="value">{{ info.assetName }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">资产类型：</span>
              <span class="value">{{ info.assetTypeName }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">品牌：</span>
              <span class="value">{{ info.brand }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">型号：</span>
              <span class="value">{{ info.model }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">保修期：</span>
              <span class="value">{{ info.maintenanceTime }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">购入时间：</span>
              <span class="value">{{ formatDate(info.purchasingDate) }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">税后价格：</span>
              <span class="value">{{ info.afterTaxPrice }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">数量：</span>
              <span class="value">{{ info.amount }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">存放地点：</span>
              <span class="value">{{ info.storageAddress }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">归属部门：</span>
              <span class="value">{{ info.departmentName }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">保管员：</span>
              <span class="value">{{ info.keeper }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">备注：</span>
              <span class="value">{{ info.remark }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="section">
        <div class="heading">
          <span class="bar"></span>
          <b>折旧信息</b>
        </div>
        <el-row>
          <el-col :span="span">
            <div class="item">
              <span class="label">折旧年限：</span>
              <span class="value">{{ info.depreciableLife }}年</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">资产净值：</span>
              <span class="value">{{ info.surplusValue }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">每月折旧：</span>
              <span class="value">{{ info.monthDepreciation }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">累计折旧：</span>
              <span class="value">{{ info.depreciation }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- tab切换部分 -->
    <div class="tabs">
      <easy-tabs 
        v-model="tab" 
        :options="tabOptions" 
        @change="change" 
      />
      <div class="content">
        <!-- 详细信息 -->
        <detail-info 
          v-if="tab === 0" 
          :info="info" 
          :list="list" 
        />
        <!-- 使用记录 -->
        <use-record v-if="tab === 1" />
        <!-- 维修记录 -->
        <maintain-record v-if="tab === 2" />
        <!-- 保养记录 -->
        <asset-maintain v-if="tab === 3" />
        <!-- 证书记录 -->
        <asset-certificate v-if="tab === 4" />
      </div>
    </div>
    <!-- 资产入库发起begin -->
    <el-dialog
    destroy-on-close
      :title="title"
      class="dialogForm"
      width="30%"
      :visible.sync="dialogShow"
    >
    <div v-if='isShow'>
        <el-form
        :model="diaForm"
        ref="diaForm"
        :rules="dialogRules"
        :inline="false"
        label-width="120px"
        class="dialogFormInfo"
      >
        <div class='sure-title'><span style='color:red'>*</span>确认信息</div>
        <div class='list-style'>
          <div
            v-for="(item, index) in sureList"
            :key="index"
            :class="['div-style', { current: selectAll.includes(index) },{noSelect:!selectAllCopy.includes(index)}]"
            @click='select(index)'
          >
            {{ item.label }}
          </div>
        </div>

        <el-row>
          <el-col :span="12">
            <el-form-item label="证书文件" prop="url">
              <el-upload
                action
                :on-change="upChange"
                :before-remove="remove"
                :limit="1"
                accept=".jpg, .png, .pdf"
                :auto-upload="false"
              >
                <el-button type="info"> 上传附件 </el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
           <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="url">
             <el-input v-model='diaForm.remark' type='textarea'>
             </el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-button type="text" @click="viewFlowOne">
        <span style="text-decoration: underline">
          审批流程查看
        </span>
      </el-button>
      </el-form>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" @click="sureApply">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </div>
     <div 
      style="cursor:pointer" 
      v-if="!isShow"
    >
      <span @click="isShow = true">
        <i class="el-icon-arrow-left"></i>
        返回
      </span>
      <div class="flow-wrap">
        <factory-draw-flow
          :FlowConfig="list"
          modelType="see"
          ref="flow"
        />
      </div>
    </div>
    
    </el-dialog>
   <!-- 资产入库发起end -->
    <!-- 发起报废 -->
    <asset-scrap 
      ref="scrap" 
      :info="info" 
    />
    <!-- 发起维修 -->
    <asset-repair
      ref="repair" 
      :info="info" 
    />
    <!-- 发起归还 -->
    <asset-return  
      ref="return" 
      :info="info" >

    </asset-return>
  </div>
</template>

<script>
import { assetDetail, fileUpload, setWarehousing,seeAssetProcess,getFlow} from "@/api/assetManagement/companyAssets";
import { queryAsset } from "@/api/assetManagement/quickAssetDetail";
import findItemById from "@/utils/findItemById";
import Print from '@/utils/Print';
import { detailInformation } from "../options";
import EasyTabs from "@/components/EasyTabs";
import DetailInfo from "./DetailInfo";
import AssetCertificate from "./AssetCertificate";
import AssetMaintain from "./AssetMaintain";
import UseRecord from "./UseRecord";
import MaintainRecord from "./MaintainRecord";
import AssetScrap from './AssetScrap'
import AssetReturn from './AssetReturn'
import AssetRepair from './AssetRepair'
import FactoryDrawFlow from "@/components/DrawFlow/src/DrawFlow.vue"
import QRCode from "qrcodejs2"

export default {
  components: {
    EasyTabs,
    DetailInfo,
    AssetCertificate,
    AssetMaintain,
    UseRecord,
    MaintainRecord,
    AssetScrap,
    AssetRepair,
    FactoryDrawFlow,
    AssetReturn
  },
  data() {
    // 上传校验
    const check = (rule, value, callback) => {
      if (!this.url) {
        callback(new Error("请上传证书文件"));
      } else {
        callback();
      }
    };
    return {
      isShow:true,
      span: 6,
      id: this.$route.query.id,
      status: this.$route.query.status,
      isApplying: this.$route.query.isApplying,
      manageType: this.$route.query.manageType,
      info: {},
      list: [],
      scaleVal: 100, // 流程图缩放比例 100%
      sureList: [
        {
          label: "资产类型确认",
          value: 0,
        },
        {
          label: "资产型号确认",
          value: 1,
        },
        {
          label: "资产类型确认",
          value: 2,
        },
        {
          label: "资产型号确认",
          value: 3,
        },
      ],
      tabOptions: ["详细信息", "使用记录", "维修记录", "保养记录", "证书记录"],
      tab: 0,
      dialogShow: false,
      assetShow:false,
      title: "申请入库",
      diaForm: {},
      url: "",
      name: "",
      type:'',
      selectAll:[],
      selectAllCopy:[0,1,2,3],
      dialogRules: {
        // url: [{ required: true, trigger: "blur", validator: check }],
      },
      showEntry: false,
      showRepair: false,
      showScrap: false,
      showReturn: false
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 控制按钮的显示与隐藏
    handleShow() {
      // 入库与编辑
      if (this.status.includes("入库") && this.info.isApplying == 0) {
        this.showEntry = true;
      } else {
        this.showEntry = false;
      }
      // 维修
      if (!this.status.includes("入库") && this.info.manageType == 2 && this.info.isApplying == 0) {
        this.showRepair = true;
      } else {
        this.showRepair = false;
      }
      // 报废
      if (!this.status.includes("入库") && this.info.manageType == 2 && this.info.isApplying == 0) {
        this.showScrap = true;
      } else {
        this.showScrap = false;
      }
      // 归还
      if (this.status=="使用中" 
       && this.info.manageType == 2 && this.info.isApplying == 0 && this.info.holderId==JSON.parse(window.localStorage.getItem("user")).userId) {
        this.showReturn = true;
      } else {
        this.showReturn = false;
      }
    },
    // 发起维修
    initRepair() {
      this.$refs.repair.open()
    },
    // 发起报废
    initScrap() {
      this.$refs.scrap.open()
    },
    //发起归还
    initReturn(){
      this.$refs.return.open()
    },
    // 上传文件
    upChange(file) {
      let formData = new FormData();
      formData.append("file", file.raw);
      fileUpload(formData).then(res => {
        this.url = res.data.url
        this.name = res.data.name
        this.type=this.name.substring(this.name.lastIndexOf('.'))
      })
    },
    remove() {
      this.url = "";
      this.name = "";
      this.type=''
    },
    //弹框取消
    cancelFn() {
      this.dialogShow = false;
    },
    select(index){
      console.log(this.selectAll,'selectAll')
      let n=index
      this.$nextTick(()=>{
        if(this.selectAll.includes(n)){
          console.log('aaaa')
          // this.selectAll.splice(n, 1);
            this.selectAll[n]=''
        
        }else{
          this.selectAll[n]=n
        }
      })
      this.selectAllCopy=[0,1,2,3]
      this.$forceUpdate()
      console.log(this.selectAllCopy,'this.selectAll')
     
    },
    //弹框确认
    sureApply() {
       this.$refs.diaForm.validate(valid => {
        if (!valid) {
          return
        }
         let count = []
            this.selectAll.forEach((i,index)=>{
            count.push(i)
              
            })
           if(!this.selectAll.includes('') && this.selectAll.length==4 && count.length==4){
        
          let attachList={
              name:this.name,
              url:this.url,
              type:this.type,
              description:''
          }
          let attachmentList=[]
          let assetList=[]
          attachmentList.push(attachList)
          assetList.push(this.info)
          let params={
            assetList,
            attachmentList,
            revoke: "true",
            remark:this.diaForm.remark,
            deptId: this.info.departmentId ? this.info.departmentId : JSON.parse(window.localStorage.getItem("user")).deptId
          }
          // console.log(params,'params')
          // return
          setWarehousing(params).then(res=>{
            if(res.code==200){
              this.$message.success(res.msg)
              this.dialogShow=false
            //   this.$router.push({
            //   name: "myAssets",
            //   params:{
            //     tab:'2'
            //   }
            // });
             const obj = { 
              name: "myAssets",
              params:{
                tab:'2'
              }
              };
              this.$tab.closeOpenPage(obj);
            }
          })
      }else{
        this.selectAllCopy=JSON.parse(JSON.stringify(this.selectAll))
      }
     
       })
     
    },
    // 详情
    getDetail() {
      assetDetail(this.id).then((res) => {
        this.info = res.data;
        // 生成二维码
        this.$nextTick(() => {
          new QRCode(this.$refs.qrcode, {
            text: this.info.assetId, // 需要转换为二维码的内容
            width: 25,
            height: 25,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          })
          new QRCode(this.$refs.qrcodeLarge, {
            text: this.info.assetId, // 需要转换为二维码的内容
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          })
        })

        // 动态渲染展示条目
        queryAsset().then((resp) => {
          const { assetTemplate } = findItemById(
            this.info.assetTypeId,
            resp.data
          );
          let list = [];
          detailInformation.forEach((item) => {
            for (let i in assetTemplate) {
              if (item.status === i) {
                if (assetTemplate[i] === 1) {
                  list.push(item);
                }
              }
            }
          });
          this.list = list;
        });

        // 控制按钮的显示与隐藏
        this.handleShow()
      });
    },
    //入库
    warehousing() {
      this.dialogShow = true;
    },
    // 进入编辑
    goEdit() {
      this.$router.push({
        path: "/assetManagement/companyAssets/companyAssets-auth/edit",
        query: {
          id: this.id,
        },
      });
    },
    // 打印条码
    printCode() {
      Print(this.$refs.qrcodeLarge)
    },
    // tab切换
    change() {},
    // 时间格式
    formatDate(date) {
      if (date) {
        return date.substr(0, 10);
      }
    },
    //查看流程图
    viewFlowOne(){
      console.log(JSON.parse(window.localStorage.getItem("user")).deptId)
      // return
       this.isShow = false
      const params = {
        assetTypeIds: this.info.assetTypeId,
        categoryId: 1,
        deptId: this.info.departmentId ? this.info.departmentId : JSON.parse(window.localStorage.getItem("user")).deptId
      }
      getFlow(params).then(res => {
        this.list = JSON.parse(res.data.json).list
      })
    }
  },
};
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
    .left {
      cursor: pointer;
    }
    .btns {
      display: flex;
      align-items: center;
      .item {
        padding: 0 10px;
        border-right: 1px solid #037dff;
        line-height: 1;
        &:last-child {
          border-right: 0;
          padding-right: 0;
        }
        span {
          color: #037dff;
          cursor: pointer;
        }
      }
    }
  }
  .main {
    background: #fff;
    padding: 10px;
    font-size: 14px;
    position: relative;
    .status {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 15px;
      color: #67c23a;
    }
    .item {
      padding: 10px;
      .star {
        color: #f52551;
      }
      .label {
        color: #8294ad;
      }
    }
    .section {
      margin-top: 8px;
    }
    .heading {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
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
  }
  .tabs {
    .content {
      background: #fff;
      min-height: 261px;
      padding: 10px;
    }
  }
}
.el-row {
  display: flex;
  flex-wrap: wrap;
}
.list-style{
  display: inline-block;
  width:80%;
}
.sure-title{
  display:inline-block;
  width:20%;
  vertical-align:top;
  text-align:right;
  padding-right:40px;
}
.div-style {
  cursor: pointer;
  width: 30%;
  margin-right: 100px;
  margin-bottom: 20px;
  display: inline-block;
  border: 1px solid #ddd;
  text-align: center;
  padding:10px 0;
}
.current{
  background:#97b2e98c;
}
.noSelect{
  box-shadow: 2px 2px 10px red;;
}
.box {
  display: inline-block;
  .qrcode {
    display: inline-block;
    width: 25px;
    height: 25px;
  }
  .qrcodeLarge {
    display: inline-block;
    width: 100px;
    height: 100px;
  }
}
</style>
