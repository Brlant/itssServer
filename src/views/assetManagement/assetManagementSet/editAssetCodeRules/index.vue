<template>
  <div class="app-container">
    <div class="process-title">
      <div style="font-size: 18px; cursor: pointer" @click="goBack">
        <i class="el-icon-arrow-left">
        </i>
        <span>
            资产编号规则编辑
        </span>
      </div>
      <div>
        <el-button
          type="primary"
          :disabled="submitLoading"
          @click="sureSave"
        >
            保存
        </el-button>
        <el-button @click='cancel'>
            取消
        </el-button>
      </div>
    </div>
    <el-form
      ref="elForm"
      :model="ruleForm"
      :rules="rules"
      size="medium"
      label-width="130px"
    >
      <div class="title">
        <span class="box">
        </span>
        <span class="title-name">
            规则描述
        </span>
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
          <el-form-item label="使用范围描述：" prop="description">
            <el-input
              v-model="ruleForm.description"
              placeholder="请输入使用范围描述："
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title">
        <span class="box">
        </span>
        <span class="title-name">
            规则设置
        </span>
      </div>
      <el-row style="margin-left: 33px; margin-bottom: 20px">
        <div v-for="(item, index) in ruleForm.ruleList" :key="index">
          <el-col :span="6">
            <el-form-item
              v-if="item.type == 1"
              :label="item.label"
              label-width="120px"
            >
              <el-input v-model="item.value" placeholder="请输入" disabled>
                <template slot="append">
                  <i
                    class="el-icon-remove red"
                    @click="delThis(item, index)"
                  ></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="item.type == 5"
              :label="item.label"
              label-width="120px"
            >
              <el-input v-model="item.ruleLable" placeholder="请输入" disabled>
                <template slot="append">
                  <i
                    class="el-icon-remove red"
                    @click="delThis(item, index)"
                  ></i>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="item.type != 1 && item.type != 5"
              :label="item.label"
              label-width="120px"

            >
              <el-input
                v-if='item.ruleLable &&  item.ruleLable.label'
                v-model="item.ruleLable.label"
                placeholder="请输入"
                disabled
              >
                <template slot="append">
                  <i
                    class="el-icon-remove red"
                    @click="delThis(item, index)"
                  ></i>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="0.3" class="i-class">
            <i class="el-icon-minus">
            </i>
          </el-col>
        </div>

        <el-col :span="4" style="margin-left: 20px">
          <el-button type="primary" @click="addNode"> + </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="适用资产类型：" prop="assetTypeIdList">
            <el-select
              v-model="ruleForm.assetTypeIdList"
              :collapse-tags="true"
              filterable
              clearable
              multiple
              size="medium"
              @change="changeAll"
            >
              <el-option
                v-for="(item, index) in assetTypes"
                :key="index"
                :label="item.allName"
                :value="item.id"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
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
                  <span class="name">
                    固定前、后缀
                  </span>
                  <el-input
                    v-model="value1.value"
                    @input="checkedRadio($event, '1')"
                  ></el-input>
                </el-radio>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-radio label="2">
                  <span class="name">使用1级分类</span>
                  <el-select
                    v-model="value2.value"
                    @change="checkedRadio($event, '2')"
                  >
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
                  <el-select
                    v-model="value3.value"
                    @change="checkedRadio($event, '3')"
                  >
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
                  <el-select
                    v-model="value4.value"
                    @change="checkedRadio($event, '4')"
                  >
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
                  <el-select
                    v-model="value5.value"
                    multiple
                    @change="checkedRadio($event, '5')"
                  >
                    <el-option
                      v-for="(item, index) in dates"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-radio>
              </el-col>
            </el-row>
          </el-radio-group>
<!--          <el-radio-group v-model="diaForm.radioSelect1">
            <el-row>
              <el-col :span="24">
                <el-radio label="6" style="margin-left: 20px">
                  <span class="name">子序列号</span>
                  <el-select
                    v-model="value6.value"
                    @change="checkedRadio($event, '6')"
                  >
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
          </el-radio-group>-->
          <el-radio-group v-model="diaForm.radioSelect">
            <el-row>
              <el-col :span="24">
                <el-radio label="7">
                  <span class="name">使用序列号</span>
                  <el-select
                    v-model="value7.value"
                    @change="checkedRadio($event, '7')"
                  >
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
import { queryType, editRule } from "@/api/assetManagement/addAssetCodeRules";
export default {
  components: {},
  props: [],
  data() {
    return {
      assetTypes: [],
      dialogShow: false,
      diaForm: {},
      ruleForm: {
        ruleName: undefined,
        assetTypeIdList: [],
        ruleList: [],
        description: "",
      },
      //1级，2级，3级分类
      types: [
        { value: 1, label: "类型ID" },
        { value: 2, label: "拼音缩写" },
        { value: 3, label: "序列号" },
      ],
      //当天日期
      /*dates: [
        { value: 1, label: "年(2位,如2022年,为22)" },
        { value: 2, label: "年(4位,如2022年,为2022)" },
        { value: 3, label: "月(有效位,如2月,为2)" },
        { value: 4, label: "月(2位,如2月,为02)" },
        { value: 5, label: "日(有效位,如2月2日,为2)" },
        { value: 6, label: "日(2位,如2月2日,为02)" },
      ],*/
      dates: [
        { value: 1, label: "年(2位,如2022年,为22)", disabled: false },
        { value: 2, label: "年(4位,如2022年,为2022)", disabled: false },
        { value: 3, label: "月(有效位,如2月,为2)", disabled: false },
        { value: 4, label: "月(2位,如2月,为02)", disabled: false },
        { value: 5, label: "日(有效位,如2月2日,为2)", disabled: false },
        { value: 6, label: "日(2位,如2月2日,为02)", disabled: false },
      ],
      //子序列号
      childNo: [
        { value: 1, label: "自然数(如1、2、3)" },
        { value: 2, label: "3位自然数(如001、002、003)" },
        { value: 3, label: "4位自然数(如0001、0002)" },
        { value: 4, label: "5位自然数(如00001)" },
      ],
      value1: { type: "1", value: "", label: "固定前、后缀" },
      value2: { type: "2", value: "", label: "1级分类" },
      value3: { type: "3", value: "", label: "2级分类" },
      value4: { type: "4", value: "", label: "3级分类" },
      value5: { type: "5", value: "", label: "当天日期" },
      value6: { type: "6", value: "", label: "子序列号" },
      value7: { type: "7", value: "", label: "序列号" },
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
      submitLoading: false
    };
  },
  computed: {},
  watch: {
    'value5.value':{
      deep: true,
      handler(val){
        this.setDisabled(val)
      }
    }
  },
  created() {
    this.ruleForm = this.$route.query.detailData;

    let pushAssetType = [];
    this.$route.query.detailData.assetTypeList.forEach((item) =>
      pushAssetType.push(item.id)
    );
    this.ruleForm.assetTypeIdList = pushAssetType;
    console.log(this.ruleForm, "this.ruleForm.ruleList");
    //将字符串转化为数组对象
    var ruleCopy = JSON.parse(this.ruleForm.rule);
    this.ruleForm.ruleList = ruleCopy;
    console.log(this.ruleForm, " this.ruleForm.ruleList");
  },
  mounted() {
    this.getType();
  },
  methods: {
     //取消
    cancel(){
       this.$confirm(`当前页面修改内容尚未保存，是否确认退出？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
            this.$router.push('/assetManagement/assetManagementSet/assetCodeRules')
        })
        .catch(() => {});
    },
    changeAll(index) {
      if (index.includes(0)) {
        this.assetTypes.forEach((item) => {
          if (item.id != 0) {
            item.disabled = true;
          }
        });
        this.ruleForm.assetTypeIdList = [0];
      } else {
        this.assetTypes.forEach((item) => {
          if (item.id != 0) {
            item.disabled = false;
          }
        });
      }
    },
    getType() {
      queryType().then((res) => {
        this.assetTypes = res.data;
      });
    },
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
    addNode() {
      this.diaForm.radioSelect1 = "";
      this.diaForm.radioSelect = "";
      this.dialogShow = true;
      this.value1.value = "";
      this.value2.value = "";
      this.value3.value = "";
      this.value4.value = "";
      this.value5.value = [];
      this.value6.value = "";
      this.value7.value = "";
    },
    sureEdit() {
      console.log(this.diaForm.radioSelect);
      let checkedNum = parseInt(this.diaForm.radioSelect);
      switch (checkedNum) {
        case 1:
          let params = this.deepClone(this.value1);
          console.log(params, "params");
          this.ruleForm.ruleList.push(params);
          break;
        case 2:
          this.value2.ruleLable = this.types.find((item) => {
            console.log(item.value, this.value2.value);
            if (item.value == this.value2.value) {
              return item.label;
            }
          });
          this.ruleForm.ruleList.push(this.deepClone(this.value2));

          break;
        case 3:
          this.value3.ruleLable = this.types.find((item) => {
            if (item.value == this.value3.value) {
              return item.label;
            }
          });

          this.ruleForm.ruleList.push(this.deepClone(this.value3));

          break;
        case 4:
          this.value4.ruleLable = this.dates.find((item) => {
            if (item.value == this.value4.value) {
              return item.label;
            }
          });

          this.ruleForm.ruleList.push(this.deepClone(this.value4));

          break;
        case 5:
          console.log(this.value5);
          let ruleList5 = [];
          this.value5.value.map((codes) => {
            this.dates.map((item) => {
              if (codes == item.value) {
                ruleList5 += item.label + "-";
              }
            });
          });
          this.value5.ruleLable = ruleList5
            .toString()
            .substring(0, ruleList5.length - 1);

          this.ruleForm.ruleList.push(this.deepClone(this.value5));
          if (this.value6.value) {
            this.value6.ruleLable = this.childNo.find((item) => {
              if (item.value == this.value6.value) {
                return item.label;
              }
            });
            this.ruleForm.ruleList.push(this.deepClone(this.value6));
          }

          break;
        case 6:
          this.value5.value = [1]; // 默认选择第一项
          let ruleList55 = [];
          this.value5.value.map((codes) => {
            this.dates.map((item) => {
              if (codes == item.value) {
                ruleList55 += item.label + "-";
              }
            });
          });
          this.value5.ruleLable = ruleList55
            .toString()
            .substring(0, ruleList55.length - 1);
          this.value6.ruleLable = this.childNo.find((item) => {
            if (item.value == this.value6.value) {
              return item.label;
            }
          });

          this.ruleForm.ruleList.push(this.deepClone(this.value5));
          this.ruleForm.ruleList.push(this.deepClone(this.value6));

          break;
        case 7:
          this.value7.ruleLable = this.childNo.find((item) => {
            if (item.value == this.value7.value) {
              return item.label;
            }
          });

          this.ruleForm.ruleList.push(this.deepClone(this.value7));

          break;
      }
      this.dialogShow = false;
    },
    checkedRadio(value, who) {
      console.log(value);
      this.value1.value = "";
      this.value2.value = "";
      this.value3.value = "";
      this.value4.value = "";
      this.value5.value = [];
      console.log(who, "who");
      if (who != 5 && who != 6) {
        this.diaForm.radioSelect1 = "";
        this.value6.value = "";
      }
      if (who == 5 && this.value6.value == "") {
        // 如果我选择了 当天日期 且 子项目没有有值 不清空
        this.value6.value = "";
      }

      this.value7.value = "";
      let pj = "this.value" + who;
      console.log(pj);
      eval(pj).value = value;
      this.diaForm.radioSelect = who + "";
      console.log(who, "ffff");
      if (who == 6) {
        // 如果选择了 当天日期的子项目
        // 自动选择和填充  当天日期的第一条
        this.value5.value = [1]; // 默认选择第一项
        this.diaForm.radioSelect1 = who + "";
        this.diaForm.radioSelect = 5 + "";
      }
    },

    // 当天日期中 年/月/日 只能选其中一种模式
    setDisabled(value) {
      if (value.length > 0) {
        this.dates.map(item => item.disabled = false)
        if (value.includes(1)) {
          this.dates[0].disabled = false
          this.dates[1].disabled = true
        }
        if (value.includes(2)) {
          this.dates[0].disabled = true
          this.dates[1].disabled = false
        }
        if (value.includes(3)) {
          this.dates[2].disabled = false
          this.dates[3].disabled = true
        }
        if (value.includes(4)) {
          this.dates[2].disabled = true
          this.dates[3].disabled = false
        }
        if (value.includes(5)) {
          this.dates[4].disabled = false
          this.dates[5].disabled = true
        }
        if (value.includes(6)) {
          this.dates[4].disabled = true
          this.dates[5].disabled = false
        }
      } else {
        this.dates.map(item => item.disabled = false)
      }
    },

    delThis(item, i) {
      //item 暂时用不着，留着
      console.log(this.ruleForm);
      this.ruleForm.ruleList.splice(i, 1);
      //强制刷新
      this.$forceUpdate()
    },
    cancelFn() {
      this.dialogShow = false;
    },
    //保存
    sureSave() {
      let data = {
        ...this.ruleForm,
        rule: JSON.stringify(this.ruleForm.ruleList),
      };
      this.submitLoading = true
      editRule(data).then((res) => {
        this.submitLoading = false
        if (res.code == 200) {
          this.$message.success("编辑成功");
            this.$router.push('/assetManagement/assetManagementSet/assetCodeRules')
        }
      }).catch(()=>{
        this.submitLoading = false
      });
    },
    //返回
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.process-title {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
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
.red {
  color: red;
}
.el-radio-group {
  display: block !important;
}
</style>
