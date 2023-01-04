<template>
  <div class="app-container">
    <el-form
      ref="elForm"
      :model="ruleForm"
     
      size="medium"
      label-width="130px"
    >
      <div class="title">
        <span class="box"></span><span class="title-name">规则描述</span>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则名称：">
           {{ruleForm.ruleName}}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="使用范围描述：">
           {{ruleForm.description}}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">
        <span class="box"></span><span class="title-name">规则设置</span>
      </div>
      <el-row style="margin-left: 33px">
      <div v-for="(item,index) in ruleForm.ruleCopy" :key='index'>
        <span>{{item.label+':'}}</span>
        <span>{{item.ruleLable.label}}</span>
        <i class='el-icon-minus'></i>
      </div>
      
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="适用资产类型：">
             <span v-for='(item,index) in ruleForm.assetTypeList' :key='index'>{{item.typeName + ';'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
     ruleForm:{}
     
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log(this.ruleForm)
    this.ruleForm=this.$route.query.detailData
  var ruleCopy=JSON.parse(this.ruleForm.rule)
  
    this.ruleForm.ruleCopy=ruleCopy
    
      console.log(this.ruleForm,'SSSSSSSSSS')
  },
  mounted() {},
  methods: {
  
   
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
.red{
  color: red;
}
</style>
