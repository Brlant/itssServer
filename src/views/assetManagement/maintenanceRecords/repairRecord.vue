<template>
  <div class="form-style">
    <el-row :gutter="15">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="120px"
      >
        <el-col :span="8">
          <el-form-item label="申请日期" prop="field101">
            <el-date-picker
              type="daterange"
              v-model="formData.field101"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :style="{ width: '100%' }"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              range-separator="至"
              clearable
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修金额" prop="field102">
            <el-row>
              <el-col :span='11'>
                <el-input
                  v-model="formData.field102"
                  placeholder="请输入维修金额"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-col>
              <el-col :span='2' style='text-align:center;'><span>——</span></el-col>
              <el-col :span='11'>
                <el-input
                  v-model="formData.field102"
                  placeholder="请输入维修金额"
                  clearable
                  :style="{ width: '100%' }"
                >
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产编号" prop="field103">
            <el-input
              v-model="formData.field103"
              placeholder="请输入资产编号"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产类型" prop="field104">
            <el-select
              v-model="formData.field104"
              placeholder="请选择资产类型"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in field104Options"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="资产名称" prop="field105">
            <el-input
              v-model="formData.field105"
              placeholder="请输入资产名称"
              clearable
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button @click="resetForm">导出</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <div>
      <el-table :data="repairData" @row-click='getDetail'>
        <el-table-column label="流程ID" align="center" prop="id" />

        <el-table-column label="资产类型" align="center" prop="assetTypeList">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.assetTypeList"
              :key="index"
              >{{ item.typeName + "；" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="资产编号&amp;名称"
          align="center"
          prop="updateTime"
        />
        <el-table-column label="维修内容" align="center" prop="updatorName" />
        <el-table-column label="维修数量" align="center" prop="ruleName" />
        <el-table-column label="维修金额" align="center" prop="ruleName" />
        <el-table-column label="申请日期" align="center" prop="updatorName" />
        <el-table-column label="送修日期" align="center" prop="ruleName" />
        <el-table-column label="归还日期" align="center" prop="ruleName" />
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field101: null,
        field102: undefined,
        field103: undefined,
        field104: undefined,
        field105: undefined,
      },
      repairData: [{
        updatorName:'1'
      }],
      rules: {
        field101: [
          {
            required: true,
            message: "申请日期不能为空",
            trigger: "change",
          },
        ],
        field102: [
          {
            required: true,
            message: "请输入维修金额",
            trigger: "blur",
          },
        ],
        field103: [
          {
            required: true,
            message: "请输入资产编号",
            trigger: "blur",
          },
        ],
        field104: [
          {
            required: true,
            message: "请选择资产类型",
            trigger: "change",
          },
        ],
        field105: [
          {
            required: true,
            message: "请输入资产名称",
            trigger: "blur",
          },
        ],
      },
      field104Options: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    //点击行获取详情
    getDetail(row, column, event){
      console.log(row,'row')
    }
  },
};
</script>
<style lang="scss" scoped>
.form-style {
  background: #ffffff;
  padding: 10px;
}
</style>
