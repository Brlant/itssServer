<template>
  <!-- 新建资产详情模板 -->
  <div class="app-container">

    <!-- 顶部返回左侧和右侧按钮 -->
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <div class="bg-purple-left-title" @click="backPreviousLayer">
            <p>
              <i class="el-icon-arrow-left"></i>
            </p>
            <p class="title2">编辑资产详情模板</p>
          </div>
        </div>
      </el-col>
      <el-col :span="12" >
        <div class="grid-content bg-purple-light">
          <div class="right-button">
            <el-button
              type="primary"
              :disabled="submitLoading"
              @click="saveAseet"
            >
              保存
            </el-button>
            <el-button type="info" @click="cancelDetail">取消</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 内容主体开始 -->
    <div>
      <el-form ref="form" :model="assetTemplate" label-width="80px">
        <div class="base-row">
          <div class="title">
            <span class="title-name c333">模板信息</span>

          </div>
          <br />
          <div class="base">
            <el-row :gutter="15">
              <el-form-item label="模板名称" required>
                  <!-- :disabled="$route.query.id ? true : false" -->
                <el-input
                  v-model="assetTemplate.templateName"
                  maxlength="32"
                  placeholder="请输入模板名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="模板表述">
                <el-input
                  v-model="assetTemplate.describe"
                  maxlength="32"
                  placeholder="请输入模板表述"
                ></el-input>
              </el-form-item>
            </el-row>
          </div>
        </div>
        <div class="base-row">
          <div class="title">
            <span class="title-name c999">基础信息</span>
            <span class="greenFont">必要字段不支持自定义</span>
          </div>
          <div class="base">
            <el-radio-group v-for="(item, index) in basicInformation" :key="index">
              <el-radio disabled v-model="item.name" :label="item.label"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="base-row">
          <div class="title">
            <span class="title-name c999">折旧信息</span>
            <span class="greenFont">依据资产类型是否计算折旧，判断是否显示信息，不支持自定义</span>
          </div>
          <div class="base">
            <el-radio-group v-for="(item, index) in depreciationInformation1" :key="index">
              <el-radio disabled v-model="item.name" :label="item.label"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
         <div class="base-row">
          <div class="title1">
            <span class="greenFont">无需填写，由系统自动计算</span>
          </div>
          <div class="base">
            <el-radio-group v-for="(item, index) in depreciationInformation" :key="index">
              <el-radio disabled v-model="item.name" :label="item.label"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="detail-row">
          <div class="title">
            <span class="title-name  c333">详细信息</span>
            <span class="greenFont">勾选后，会在资产详情中出现的信息</span>
          </div>
          <div class="detail-group">
            <el-checkbox-group
              v-model="assetTemplate.detailRadius"
              @change="handleCheckedCitiesChange"
            >
                  <!-- :disabled="$route.query.id ? true : false" -->
              <span v-for="(item, index) in detailInformation" :key="index">
                <el-checkbox
                  v-if="item.status !== 'belongDepartmentId'"
                  :class="$route.query.id ? 'custom-disable-class' : ''"
                  :label="item.status"
                  :value="item.status"
                  >{{ item.label }}
                </el-checkbox>
              </span>
            </el-checkbox-group>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 取消二级对话框 -->
    <!-- <Dialog :dialogObject="dialogObject" @changeValueFromModel="dialogChange">
        </Dialog> -->
    <!-- 内容主体结束 -->
  </div>
</template>

<script>
// import Dialog from "@/components/dialog.vue";
import { createDictionary,queryAll,updateOrDelete,searchDetail } from "@/api/assetManagement/assetDetailTemplate";


export default {
  data() {
    return {
      assetTemplate: {
        templateName: "",
        describe: "",
        detailRadius: [],
      },
      // dialog控制参数
      dialogObject: {
        dialogVisible: false,
        dataSourceList: "此次编辑内容未被保存，是否确认退出？",
        sure: "",
        center: "",
      },
      // 基础信息
      basicInformation: [
        {
          id: 1,
          name: "资产编号",
        },

        {
          id: 2,
          name: "资产条码",
        },
        {
          id: 3,
          name: "财务编号",
        },
        {
          id: 4,
          name: "资产名称",
        },
        {
          id: 5,
          name: "资产类型",
        },
        {
          id: 6,
          name: "品牌",
        },
        {
          id: 7,
          name: "型号",
        },
        {
          id: 9,
          name: "保修期",
        },
        {
          id: 10,
          name: "购入时间",
        },
         {
          id: 11,
           // name: "税后价格",
           // 2023/06/30 v1.1版本
           name: "资产原值",
        },

        {
          id: 12,
          name: "数量",
        },
        {
          id: 13,
          name: "存放地点",
        },
        {
          id: 14,
          name: "归属部门",
        },
        {
          id: 15,
          name: "保管人",
        },
        {
          id: 16,
          name: "备注",
        },
        {
          id: 17,
          name: "报废日期（报废后才出现）",
        },
      ],
      // 折旧信息
      depreciationInformation1: [
         {
          name:"折旧年限",
          id:1
        },],
      depreciationInformation: [
        //  {
        //   name:"折旧年限",
        //   id:1
        // },
        {
          name:"资产净值",
          id:1
        },
        {
          name:"每月折旧",
          id:2
        },
        {
          name:"累计折旧",
          id:3
        },
        //-------------------------------------
        // {
        //   label: "折旧年限",
        //   name: "depreciableLife",
        //   value: "",
        //   status: "depreciableLifeFlag",
        // },
        // {
        //   label: "资产净值",
        //   name: "surplusValue",
        //   value: "",
        //   status: "surplusValueFlag",
        // },
        // {
        //   label: "每月折旧",
        //   name: "monthDepreciation",
        //   value: "",
        //   status: "monthlyDepartmentFlag",
        // },
        // {
        //   label: "累计折旧",
        //   name: "cumulativeDepreciation",
        //   value: "1",
        //   status: "cumulativeDepreciationFlag",
        // },
      ],
      // 详细信息
      detailInformation: [
        // {
        //   label: "购入价格(不含税)",
        //   name: "purchasePrice",
        //   value: "",
        //   status: "purchasePriceFlag",
        // },
        {
          // label: "购入价格(含税)",
          // label: "税前价格",
          // 2023/06/30 v1.1版本
          label: "购入价格(含税)",
          name: "preTaxPrice",
          value: "",
          status: "preTaxPriceFlag",
        },
        {
          label: "CPU",
          name: "cpu",
          value: "",
          status: "cpuFlag",
        },
        {
          label: "CPU主频",
          name: "cpuHertz",
          value: "",
          status: "cpuHertzFlag",
        },
        {
          label: "内存型号",
          name: "memory",
          value: "",
          status: "memoryFlag",
        },
        {
          label: "内存容量",
          name: "memorySize",
          value: "",
          status: "memorySizeFlag",
        },
        {
          label: "显卡型号",
          name: "graphicsCard",
          value: "",
          status: "graphicsCardFlag",
        },
        {
          label: "显卡容量",
          name: "graphicsMemorySize",
          value: "",
          status: "graphicsMemorySizeFlag",
        },
        {
          label: "硬盘型号",
          name: "hardDisk",
          value: "",
          status: "hardDiskFlag",
        },
        {
          label: "硬盘容量",
          name: "hardDiskSize",
          value: "",
          status: "hardDiskSizeFlag",
        },
        {
          label: "显示器分辨率",
          name: "resolutionRadio",
          value: "",
          status: "resolutionRadioFlag",
        },
        {
          label: "操作系统",
          name: "os",
          value: "",
          status: "osFlag",
        },
        {
          label: "杀毒软件",
          name: "antivirus",
          value: "",
          status: "antivirusFlag",
        },
        {
          label: "办公软件",
          name: "office",
          value: "",
          status: "officeFlag",
        },
        {
          label: "MAC地址",
          name: "macAddress",
          value: "",
          status: "macAddressFlag",
        },
        {
          label: "IP地址",
          name: "ipAddress",
          value: "",
          status: "ipAddressFlag",
        },
        {
          label: "序列号",
          name: "serialNumber",
          value: "",
          status: "serialNumberFlag",
        },
        {
          label: "测量范围",
          name: "measuringRange",
          value: "",
          status: "measuringRangeFlag",
        },
        {
          label: "使用范围",
          name: "usableRange",
          value: "",
          status: "usableRangeFlag",
        },
        {
          label: "采样频率",
          name: "sampleFrequency",
          value: "",
          status: "sampleFrequencyFlag",
        },
        {
          label: "相变材料",
          name: "phaseChangeMaterial",
          value: "",
          status: "phaseChangeMaterialFlag",
        },
        {
          label: "其他信息",
          name: "additionalInfo",
          value: "",
          status: "additionalInfoFlag",
        },

        // {
        //   label: "归属部门",
        //   name: "departmentName",
        //   value: "",
        //   status: "belongDepartmentFlag",
        // },
        // {
        //   label: "归属部门id",
        //   name: "departmentId",
        //   value: "",
        //   status: "belongDepartmentId",
        // },
      ],
      submitLoading: false

    };
  },
  components: {
    // Dialog
  },

  mounted() {
    this.gettemplateDetail();
  },

  methods: {
    /**
     * @description 根据路由传参信息，进行回显
     */
    gettemplateDetail() {
      if (this.$route.query.id) {
        searchDetail(this.$route.query.id).then((res) => {
          this.assetTemplate.templateName =res.data.templateName
          this.assetTemplate.describe = res.data.describe
        // 获取选择的详细信息，1选中，0不选择
          for (let key in res.data) {
            if (res.data[key] == 1) {
              this.assetTemplate.detailRadius.push(key);
            }
          }
        });
      }
    },
    /**
     * @description 父组件接收子组件的函数
     * @param data { Boolean } dialog传过来的params
     */
    dialogChange(data) {
      data.status ? this.backPreviousLayer() : (this.dialogObject.dialogVisible = false);
    },
    /**
     * @description 选择详细信息
     * @params data { Object } 选中的信息
     */
    handleCheckedCitiesChange(data) {},
    /**
     * @description 返回上一层
     */
    backPreviousLayer() {
       const obj = { path: "/assetManagement/assetManagementSet/list" };
        this.$tab.closeOpenPage(obj);
    },
    /**
     * @description 取消按钮
     */
    cancelDetail() {
      // this.dialogObject.dataSourceList = "此次编辑内容未被保存，是否确认退出？";
      // this.dialogObject.dialogVisible = true;
      // this.dialogObject.sure = "退出";
      // this.dialogObject.center = "取消";
      // const obj = { path: "/assetManagement/assetManagementSet/list" };
      // this.$tab.closeOpenPage(obj);
      this.$confirm('确定返回列表页？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        const obj = { path: "/assetManagement/assetManagementSet/list" };
        this.$tab.closeOpenPage(obj);
      }).catch(() => {})
    },
    /**
     * @description 保存按钮
     */
    saveAseet() {
      if (this.assetTemplate.templateName === "") {
        this.$message.error("请输入模板名称!");
        return;
      }
      /*if (this.assetTemplate.detailRadius=="") {
        this.$message.error("请选择详细信息!");
        return;
      }*/

      let params = {
        templateName: this.assetTemplate.templateName,
        describe:this.assetTemplate.describe,
        // creator: JSON.parse(localStorage.getItem("user") || "").userId,
        // creatorName: JSON.parse(localStorage.getItem("user") || "").userName,
      };
      for (let i in this.assetTemplate.detailRadius) {
        let key = this.assetTemplate.detailRadius[i];
        console.log(key);
        // 获取选择的详细信息，1选中，0不选择
        params[key] = 1;
      }
      console.log(params);
      if(this.$route.query.id){
        // 有id 则说明是修改
        params.id= this.$route.query.id
        this.submitLoading = true
        updateOrDelete(params).then((res) => {
          this.submitLoading = false
          if (res.code == 200) {
            this.$message({
              message: "修改成功！",
              type: "success",
            });
            const obj = { path: "/assetManagement/assetManagementSet/list" };
        this.$tab.closeOpenPage(obj);
          }
        }).catch(()=>{
          this.submitLoading = false
        });
      }else{
        this.submitLoading = true
        createDictionary(params).then((res) => {
          this.submitLoading = false
          // if (res.code == 200) {
            this.$message({
              message: "新增成功！",
              type: "success",
            });
            const obj = { path: "/assetManagement/assetManagementSet/list" };
        this.$tab.closeOpenPage(obj);
          // }
        }).catch(()=>{
          this.submitLoading = false
        });
      }
    },
  },
};
</script>

<style scoped>
p {
  margin: 0%;
  padding: 0;
}

.main {
  margin: 10px 0px 10px 15px;
}

/* 顶部导航栏样式开始 */
.bg-purple-left-title {
  display: inline-block;
  font-size: 18px;
  color: #409eff;
  cursor: pointer;
}
.bg-purple-left-title .el-icon-arrow-left:before {
  font-weight: bold;
}
.bg-purple-left-title p {
  display: inline-block;
}
.bg-purple-left-title .title {
  font-weight: bold;
}

.bg-purple-light {
  display: flex;
  justify-content: flex-end;
}

/* 顶部导航栏样式结束 */
.template-row,
.base-row,
.detail-row {
  margin-top: 40px;
}
.title1 {
 position: relative;
    /* border: 1px red solid; */
    min-height: 20px;
    /* border-left: 4px #999999 solid; */
  padding-left: 12px;
}
.title {
 position: relative;
    /* border: 1px red solid; */
    min-height: 20px;
    border-left: 4px #999999 solid;
  padding-left: 12px;
}

.title-name {
  font-size: 18px;
  font-weight: bold;
  line-height: 20px;
}
.c333{
  color: #333;
}
.c999{
  color: #999;
}
.template-row {
  display: flex;
  flex-direction: row;
}
.template-row .title-item {
  margin-bottom: 0;
}
.template-row .title-item .el-form-item__content {
  margin-left: 20px !important;
}
.base-row .base {
  width: 80%;
  /* display: flex;
    align-content:space-around; */
}
.base-row .base .el-radio-group {
  margin-left: 14px;
  margin-top: 20px;
  display: inline-block;
  width: 10%;
}
/* 详细信息 */
.detail-row .detail-group {
  width: 90%;
}
.detail-row .detail-group .custom-disable-class .is-checked .el-checkbox__inner {
  background-color: #909399;
}
.detail-row .detail-group .el-checkbox {
  margin-left: 14px;
  margin-top: 20px;
  width: 12%;
}
.greenFont{
  display: block;
    width: 100%;
    position: relative;
    font-size: 14px;
    color: #45c7a7;
}
</style>
