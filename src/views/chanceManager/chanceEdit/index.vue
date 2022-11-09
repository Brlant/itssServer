<template>
  <div class="app-container">
    <div class="routerBar">
      <a href="javascript:;" @click="$router.go(-1)"> &lt; 编辑机会</a>
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary">保存</el-button>
        <el-button size="mini" type="default">取消</el-button>
      </div>
    </div>
    <div class="titleBar">机会基础信息</div>
    <div class="whiteBox">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="110px">
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="机会名称：" prop="chanceName">
              <el-input v-model="formData.chanceName" placeholder="请输入机会名称" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="机会状态" prop="chanceStatus">
              <el-select v-model="formData.chanceStatus" placeholder="请选择机会状态" clearable :style="{width: '100%'}">
                <el-option 
                  v-for="(item, index) in chanceStatusOptions" 
                  :key="index" 
                  :label="item.label"
                  :value="item.value" 
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="负责人" prop="chanceUserId">
              <el-select v-model="formData.chanceUserId" placeholder="请输入负责人" clearable :style="{width: '100%'}">
                <el-option 
                  v-for="(item, index) in chanceUserIdOptions" 
                  :key="index" :label="item.label"
                  :value="item.value" 
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="优先级：" prop="priority">
              <el-radio-group v-model="formData.priority" size="medium">
                <el-radio
                  v-for="(item, index) in priorityOptions"
                  :key="index"
                  :label="item.value"
                  :disabled="item.disabled"
                >
                  <b :class="['priority' + item.value]">
                    {{ item.label }}
                  </b>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="客户：" prop="customer">
              <el-input v-model="formData.customer" placeholder="请输入客户" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="客户联系人" prop="customerLink">
              <el-input v-model="formData.customerLink" placeholder="请输入客户联系人" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="联系方式：" prop="tel">
              <el-input v-model="formData.tel" placeholder="请输入联系方式" clearable :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="客户预算：" prop="budget">
              <el-input-number v-model="formData.budget" placeholder="请输入金额" :precision='2' />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="成功率：" prop="successRate">
              <el-input-number v-model="formData.successRate" placeholder="请输入" :precision='0' />
              <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;%</span>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="预计起始日：" prop="expectStartTime">
              <el-date-picker v-model="formData.expectStartTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择预计起始日" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="预计结束日：" prop="expectEndTime">
              <el-date-picker v-model="formData.expectEndTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :style="{width: '100%'}" placeholder="请选择预计结束日" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="预计工时：" prop="expectWork">
              <el-input-number v-model="formData.expectWork" placeholder="请输入预计工时" :precision='1' />
              <span class="priority4"> &nbsp;&nbsp;&nbsp;&nbsp;人日</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { formData, rules, chanceStatusOptions, chanceUserIdOptions, priorityOptions } from './options'
export default {
  data() {
    return {
      formData,
      rules,
      chanceStatusOptions,
      chanceUserIdOptions,
      priorityOptions
    }
  },
  mounted() {
  },
  methods: {
    submitForm() {

    }
  },

  beforeCreate() {
    document
      .querySelector("body,html")
      .setAttribute("style", "background-color:#E8E8F4;");
  },

  beforeDestroy() {
    document.querySelector("body,html").removeAttribute("style");
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
  a {
    color: #557db3;
  }
  span {
    font-size: 12px;
    color: #999;
  }
}
 
.priority4 {
  color: #909399;
}
.priority3 {
  color: #409eff;
}
.priority2 {
  color: #e6a23c;
}
.priority1 {
  color: #f56c6c;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
 
