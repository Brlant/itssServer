<template>
  <div class="app-container">
    <div class="type-app">
      <div class="type-left">
        <div class="type-title">资产类型列表</div>
        <div>
          <!-- 分类树 -->
        </div>
      </div>
      <div class="type-right">
        <div class="right-header">
          <div>xx二级分类名称</div>
          <div>
            <el-button type="text" @click="add">添加</el-button>
          </div>
        </div>

        <el-table :data="user" @row-click="showRowDetail">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column label="类型ID" align="center" prop="typeId" />
          <el-table-column label="序列编号" align="center" prop="num" />
          <el-table-column label="类型名称" align="center" prop="typeName" />
          <el-table-column label="拼音缩写" align="center" prop="pinyin" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column label="管理方式" align="center" prop="manage" />
          <el-table-column label="备注" align="center" prop="" />
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
        
              <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                  style="color: red"
                  @click="stopOrUse(scope.row.userId, 1)"
                  v-if="scope.row.status == 0"
                  >停用</el-button
                >
              </span>
              <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                  @click="stopOrUse(scope.row.userId, 0)"
                  v-if="scope.row.status == 1"
                  >启用</el-button
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新建或编辑弹窗 -->
    <el-dialog
      :title="title"
      class="dialogForm"
      width="30%"
      :visible.sync="addEdit"
    >
      <el-form
        :model="diaForm"
        ref="diaForm"
        :rules="dialogRules"
        :inline="false"
        label-width="120px"
        class="dialogFormInfo"
      >
        <el-row>
          <el-col>
            <el-form-item label="类型名称" prop="typeName">
              <el-select
                v-model="diaForm.commander"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
                <el-option
                  v-for="user in projectUserIdOptions"
                  :key="user.userId"
                  :label="user.nickName"
                  :value="user.userId"
                  :disabled="user.disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" @click="sureEdit">确定</el-button>
        <!-- <el-button @click="cancelFn">取消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
    data(){
        return{
            addEdit:true,
            titie:'',
            diaForm:{}
        }
    },
    methods:{
        //禁用启用
        stopOrUse(){

        }
    }
}
</script>

<style lang="scss" scoped>
.type-app {
  display: flex;
  justify-content: space-between;
  .type-left {
    width: 20%;
  }
  .type-right {
    width: 79%;
    .right-header {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>