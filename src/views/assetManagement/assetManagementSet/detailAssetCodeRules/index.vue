<template>
  <div class="app-container">
    <div class="process-title">
      <div style="font-size: 18px;cursor:pointer;" @click='goBack'>
        <i class="el-icon-arrow-left"></i>
        <span>资产编号规则详情</span>
      </div>
      <div>
        <el-button type="primary" @click="copyAdd">复制并新建</el-button>
        <el-button @click='edit'>编辑</el-button>
        <el-button
          type="danger"
          @click="stopOrUse(ruleForm.id, 1)"
          v-if="ruleForm.status == 0"
          >停用</el-button
        >
        <el-button
         type="primary"
          @click="stopOrUse(ruleForm.id, 0)"
          v-if="ruleForm.status == 1"
          >启用</el-button
        >
      </div>
    </div>
    <el-form ref="elForm" :model="ruleForm" size="medium" label-width="130px">
      <div class="title">
        <span class="box"></span><span class="title-name">规则描述</span>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则名称：">
            {{ ruleForm.ruleName }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="使用范围描述：">
            {{ ruleForm.description }}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">
        <span class="box"></span><span class="title-name">规则设置</span>
      </div>
      <el-row style="margin-left: 33px; margin-bottom: 15px">
        <div
          v-for="(item, index) in ruleForm.ruleCopy"
          :key="index"
          style="display: inline-block"
        >
          <span style="color: #8294ad">{{ item.label + "：" }}</span>
          <span style="color: #4d4d4d" v-if="item.type == 1">{{
            item.value
          }}</span>
          <span style="color: #4d4d4d" v-if="item.type != 5 && item.type != 1">{{
            item.ruleLable.label
          }}</span>
          <span style="color: #4d4d4d" v-if="item.type == 5">{{
            item.ruleLable
          }}</span>
          <i
            class="el-icon-minus"
            v-if="index < ruleForm.ruleCopy.length - 1"
            style="margin: 0 5px"
          ></i>
        </div>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="适用资产类型：">
            <span
              v-for="(item, index) in ruleForm.assetTypeList"
              :key="index"
              >{{ item.typeName + "；" }}</span
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { disableEnable } from "@/api/assetManagement/addAssetCodeRules";
export default {
  components: {},
  props: [],
  data() {
    return {
      ruleForm: {},
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log(this.ruleForm);
    this.ruleForm = this.$route.query.detailData;
    var ruleCopy = JSON.parse(this.ruleForm.rule);
    this.ruleForm.ruleCopy = ruleCopy;
  },
  mounted() {},
  methods: {
  //返回
  goBack(){
     this.$router.go(-1)
  },
    //复制新建
  copyAdd(){

  },
     //停用启用
  stopOrUse(id, item) {
    let data;
    if (item == 0) {
      data = {
        id,
        status: 0,
      };
    } else {
      data = {
        id,
        status: 1,
      };
    }
    //禁用启用
    disableEnable(data).then((res) => {
      if (res.code == 200) {
        this.$message.success("操作成功");
        if (data.status == 0) {
          this.ruleForm.status = 0;
        } else {
          this.ruleForm.status = 1;
        }
      }
    });
   
  },
   //编辑
    edit(){
      const obj = {
    path: "/assetManagement/assetManagementSet/process/editAssetCodeRules",
    query:{ detailData:this.$route.query.detailData}
   };
   // getToday()
   this.$tab.closeOpenPage(obj);
    }
  },
 
};
</script>
<style lang="scss" scoped>
.title {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.process-title {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
.box {
  width: 4px;
  height: 22px;
  background: #4c4c4c;
  display: inline-block;
  position: absolute;
  /* bottom: 0;
    left: 0; */
  border-radius: 8px;
}
.title-name {
  margin-left: 14px;
  font-size: 18px;
  color: #4c4c4c;
  font-weight: bold;
  line-height: 20px;
}
.el-form-item__content {
  display: inline-block;
}
.i-class {
  height: 36px !important;
  line-height: 36px !important;
}
.name {
  margin-right: 15px;
  width: 50px;
}
.el-radio-group .el-row {
  margin-bottom: 15px;
}
.red {
  color: red;
}
</style>
