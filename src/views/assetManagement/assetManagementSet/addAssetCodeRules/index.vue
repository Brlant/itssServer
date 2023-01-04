<template>
  <div class="app-container">
    <el-form
      ref="elForm"
      :model="ruleForm"
      :rules="rules"
      size="medium"
      label-width="130px"
    >
      <div class="title">
        <span class="box"></span><span class="title-name">规则描述</span>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则名称：" prop="ruleName">
            <el-input
              v-model="ruleForm.ruleName"
              placeholder="请输入规则名称："
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="使用范围描述：" prop="field102">
            <el-input
              v-model="ruleForm.field102"
              placeholder="请输入使用范围描述："
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">
        <span class="box"></span><span class="title-name">规则设置</span>
      </div>
      <el-row style="margin-left: 33px">
        {{ ruleForm.ruleList }}
        <div v-for="(item, index) in ruleForm.ruleList" :key="index">
          <el-col :span="4">
            <el-form-item v-if="item.type==1" prop="field105" :label="item.label" label-width="120px">
              <el-input
                v-model="item.value"
                placeholder="请输入"
                clearable
              >
                <template slot="append">
               <i class="el-icon-remove red" @click="delThis(item,index)"></i>
              </template>
              </el-input>
            </el-form-item>
            <el-form-item v-else prop="field105" :label="item.label" label-width="120px">
              <el-input
                v-model="item.ruleLable.label"
                placeholder="请输入"
                clearable
              >
              <template slot="append">
               <i class="el-icon-remove red" @click="delThis(item,index)"></i>
              </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="0.3" class="i-class">
            <i class="el-icon-minus"></i>
          </el-col>
        </div>

        <el-col :span="4" style="margin-left: 20px">
          <el-button type="primary" @click="dialogShow=true"> + </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="适用资产类型：" prop="field102">
            <el-select
              v-model="ruleForm.field102"
              :collapse-tags="true"
              filterable
              clearable
              size="medium"
            >
              <!-- <el-option
                  v-for="item in detailTemplates"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="新增/编辑编号规则"
      class="dialogForm"
      width="50%"
      :visible.sync="dialogShow"
    >
      <el-form
        :model="diaForm"
        ref="diaForm"
        :inline="false"
        label-width="120px"
        class="dialogFormInfo"
      >
        <el-form-item>
          <el-radio-group v-model="diaForm.radioSelect">
            <el-row>
              <el-col :span="24">
                <el-radio label="1">
                  <span class="name">固定前、后缀</span>
                  <el-input v-model="value1.value"></el-input>
                </el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-radio label="2">
                  <span class="name">使用1级分类</span>
                  <el-select v-model="value2.value">
                    <el-option
                      v-for="(item, index) in types"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-radio label="3">
                  <span class="name">使用2级分类</span>
                  <el-select v-model="value3.value">
                    <el-option
                      v-for="(item, index) in types"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-radio label="4">
                  <span class="name">使用3级分类</span>
                  <el-select v-model="value4.value">
                    <el-option
                      v-for="(item, index) in types"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-radio label="5">
                  <span class="name">当天日期</span>
                  <el-select v-model="value5.value" multiple>
                    <el-option
                      v-for="(item, index) in dates"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-radio label="6" style="margin-left: 20px" @change="change">
                  <span class="name">子序列号</span>
                  <el-select v-model="value6.value">
                    <el-option
                      v-for="(item, index) in childNo"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-radio label="7">
                  <span class="name">使用序列号</span>
                  <el-select v-model="value7.value">
                    <el-option
                      v-for="(item, index) in childNo"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" @click="sureEdit">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      dialogShow: true,
      diaForm: {},
      ruleForm: {
        ruleName: undefined,
        ruleList: [],
        field102: undefined,
        field105: undefined,
        field106: undefined,
        field107: undefined,
        field108: undefined,
      },
      //1级，2级，3级分类
      types: [
        { value: 1, label: "类型ID" },
        { value: 2, label: "拼音缩写" },
        { value: 3, label: "序列号" },
      ],
      //当天日期
      dates: [
        { value: 1, label: "年(2位,如2022年,为22)" },
        { value: 2, label: "年(4位,如2022年,为2022)" },
        { value: 3, label: "月(有效位,如2月,为2)" },
        { value: 4, label: "月(2位,如2月,为02)" },
        { value: 5, label: "日(有效位,如2月2日,为2)" },
        { value: 6, label: "日(2位,如2月2日,为02)" },
      ],
      //子序列号
      childNo: [
        { value: 1, label: "自然数(如1、2、3)" },
        { value: 2, label: "3位自然数(如001、002、003)" },
        { value: 3, label: "4位自然数(如0001、0002)" },
        { value: 4, label: "5位自然数(如00001)" },
      ],
      value1: {type:'1',value:'',label:"固定前、后缀"},
      value2: {type:'2',value:'',label:"使用1级分类"},
      value3: {type:'3',value:'',label:"使用2级分类"},
      value4: {type:'4',value:'',label:"使用3级分类"},
      value5: {type:'5',value:'',label:"当天日期"},
      value6: {type:'6',value:'',label:"子序列号"},
      value7: {type:'7',value:'',label:"使用序列号"},
      rules: {
        ruleName: [],
        field102: [],
        field105: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        field106: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        field107: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
        field108: [
          {
            required: true,
            message: "请输入",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    change() {
      console.log(this.diaForm.radioSelect, "aaaaaa");
    },
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    sureEdit() {
      console.log(this.diaForm.radioSelect);
      let checkedNum = parseInt(this.diaForm.radioSelect)
      switch (checkedNum) {
        case 1:
          this.ruleForm.ruleList.push(this.value1)
          break;
        case 2:
          this.value2.ruleLable = this.types.find(item=>{
            console.log(item.value,this.value2.value);
            if(item.value==this.value2.value){
              return item.label
            }
          })
          this.ruleForm.ruleList.push(this.value2)

          break;
        case 3:
          this.value3.ruleLable = this.types.find(item=>{if(item.value==this.value3.value){
              return item.label
            }})

          this.ruleForm.ruleList.push(this.value3)

          break;
        case 4:
          this.value4.ruleLable = this.dates.find(item=>{if(item.value==this.value4.value){
              return item.label
            }})

          this.ruleForm.ruleList.push(this.value4)

          break;
        case 5:
          this.value5.ruleLable = this.dates.find(item=>{if(item.value==this.value5.value){
              return item.label
            }})

          this.ruleForm.ruleList.push(this.value5)

          break;
        case 6:
          this.value5.value = [1] // 默认选择第一项
          this.value5.ruleLable = this.dates.find(item=>{if(item.value==this.value5.value){
              return item.label
            }})
          this.value6.ruleLable = this.childNo.find(item=>{if(item.value==this.value6.value){
              return item.label
            }})

          this.ruleForm.ruleList.push(this.value5)
          this.ruleForm.ruleList.push(this.value6)

          break;
        case 7:
          this.value7.ruleLable = this.childNo.find(item=>{if(item.value==this.value7.value){
              return item.label
            }})

          this.ruleForm.ruleList.push(this.value7)

          break;
      }
      this.dialogShow=false
    },
    delThis(item,i){
      //item 暂时用不着，留着
      this.ruleForm.ruleList.splice(i,1)
    },
    cancelFn() {
      this.dialogShow = false
    },
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
