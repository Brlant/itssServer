<template>
  <div class="app-container">
    <div class="process-title">
      <div style="font-size: 18px">
        <i class="el-icon-arrow-left"></i>
        <span>资产申领</span>
      </div>
      <div>
        <el-button type="primary">全部同意</el-button>
        <el-button type="danger">全部拒绝</el-button>
      </div>
    </div>
    <div class="process-title">
      <div class="title">
        <span class="box"></span>
        <span class="title-name">规则描述</span>
      </div>
      <div>
        <span> 
            资产数量：33
        </span>
        <span> 
            申请人：qq
        </span>
        <span>
            申请日期：2022
        </span>
        <span> 
            审批状态
        </span>
      </div>
    </div>
     <el-table :data="detailAssetData">
        <el-table-column label="流程ID" align="center" prop="id">
        </el-table-column>

        <el-table-column label="资产类型" align="center" prop="assetTypeList">
        </el-table-column>
        <el-table-column
          label="资产编号&amp;名称"
          align="center"
          prop="updateTime"
        />
        <el-table-column label="资产编号" align="center" prop="updatorName">
        </el-table-column>
        <el-table-column label="资产名称" align="center" prop="ruleName">
        </el-table-column>
        <el-table-column label="品牌" align="center" prop="ruleName">
        </el-table-column>
        <el-table-column label="型号" align="center" prop="updatorName">
        </el-table-column>
        <el-table-column label="保修期" align="center" prop="ruleName">
        </el-table-column>
        <el-table-column label="数量" align="center" prop="ruleName">
        </el-table-column>
        <el-table-column label="存放地点" align="center" prop="ruleName">
        </el-table-column>
        <el-table-column label="归属部门" align="center" prop="remark">
        </el-table-column>
          <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-button size="mini" type="text" @click='see(scope.row)'>查看</el-button>
            </span>
             <!-- <span style="margin-left: 10px">
              <el-button size="mini" type="text" @click='detail(scope.row)'>详情</el-button>
            </span> -->
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
        <div class="process-title">
      <div class="title">
        <span class="box"></span>
        <span class="title-name">审批进度</span>
      </div>
      <div>
        <el-button type="text">
            查看全部记录
        </el-button>
      </div>
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
      detailAssetData: [],
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
</style>