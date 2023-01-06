<template>
  <div>
    <div class="process-title">
      <div style="font-size: 24px; color: #4c4c4c">
        <span>公司资产流程审批</span>
      </div>
      <div>
        <span @click="showSelect = !showSelect" style="color: #1c6cf7">
          筛选
          <i class="el-icon-arrow-down" v-if="showSelect"></i>
          <i class="el-icon-arrow-up" v-if="!showSelect"></i>
        </span>
      </div>
    </div>
    <div class="select" v-if="showSelect">
      <el-row :gutter="24">
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="120px"
        >
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="申请人" prop="field102">
              <el-input
                v-model="formData.field102"
                placeholder="请输入维修金额"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="流程类型" prop="field104">
              <el-select
                v-model="formData.field104"
                placeholder="请选择流程类型"
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
          <el-col :span="6">
            <el-form-item label="流程编号" prop="field103">
              <el-input
                v-model="formData.field103"
                placeholder="请输入流程编号"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="资产编号" prop="field105">
              <el-input
                v-model="formData.field105"
                placeholder="请输入资产编号"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="large">
              <el-button type="primary" @click="submitForm">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div
      style="
        margin-top: 20px;
        width: 30%;
        display: flex;
        justify-content: space-between;
      "
    >
      <div :class="['default', { currren: m == 0 }]" @click="checkActive(0)">
        <span :class="[{ active: m == 0 }]">申请中（5）</span>
      </div>
      <div :class="['default', { currren: m == 1 }]" @click="checkActive(1)">
        <span :class="[{ active: m == 1 }]">已完成</span>
      </div>
      <div :class="['default', { currren: m == 2 }]" @click="checkActive(2)">
        <span :class="[{ active: m == 2 }]">已取消</span>
      </div>
      <div :class="['default', { currren: m == 3 }]" @click="checkActive(3)">
        <span :class="[{ active: m == 3 }]">待处理</span>
      </div>
      <div :class="['default', { currren: m == 4 }]" @click="checkActive(4)">
        <span :class="[{ active: m == 4 }]">参与处理记录</span>
      </div>
    </div>
    <div style="margin-top: 20px;background:#ffffff;padding:5px;">
      <el-table :data="processData" @row-click="getDetail">
        <el-table-column label="流程ID" align="center" prop="id" />

        <el-table-column label="流程类型" align="center" prop="assetTypeList">
        </el-table-column>
        <el-table-column label="流程组名称" align="center" prop="id" />
        <el-table-column label="申请人" align="center" prop="assetTypeList">
        </el-table-column>
        <el-table-column label="发起时间" align="center" prop="assetTypeList">
        </el-table-column>
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
        >
          <template slot-scope="scope">
            <span>{{ scope.row.assetcode[0].typeName }}</span>
            <span v-if="scope.row.assetcode.length > 1">
              <span>
                <el-popover placement="bottom" width="400" trigger="click">
                  <div
                    v-for="(item, index) in scope.row.assetcode"
                    :key="index"
                    style="height: 40px; border-bottom: 1px solid #ebeff3;line-height:40px;"
                  >
                    {{ item.typeName }}
                  </div>
                  <span
                    slot="reference"
                    style="float: right; cursor: pointer; color: #1c6cf7"
                    >...更多</span
                  >
                </el-popover>
              </span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="数量" align="center" prop="ruleName" />
        <el-table-column label="状态" align="center" prop="ruleName" />
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-button size="mini" type="text">取消</el-button>
            </span>
            <!-- <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                  style="color: red"
                  @click="delAsset(scope.row)"
                  >删除</el-button
                >
              </span>
              <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                  style="color: red"
                  @click="stopOrUse(scope.row.id, 1)"
                  v-if="scope.row.status == 0"
                  >停用</el-button
                >
              </span>
              <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                  @click="stopOrUse(scope.row.id, 0)"
                  v-if="scope.row.status == 1"
                  >启用</el-button
                >
              </span> -->
          </template>
        </el-table-column>
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
      m: 0,
      //是否展示筛选条件
      showSelect: false,
      formData: {
        field101: null,
        field102: undefined,
        field103: undefined,
        field104: undefined,
        field105: undefined,
      },
      processData: [
        { assetcode: [{ typeName: "aaaa" }, { typeName: "bbbb" }] },
      ],
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
    getDetail(row, column, event) {
      console.log(row, "row");
    },
    checkActive(index) {
      this.m = index;
    },
  },
};
</script>
<style lang="scss" scoped>
.select {
  background: #ffffff;
  padding: 10px;
}
.process-title {
  padding: 20px 50px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
}
.default {
  padding: 5px 10px;
  text-align: center;
  cursor: pointer;
}
.currren {
  background: #ffffff;
  border-radius: 15px;
}
.active {
  color: #1c6cf7;
}
</style>
