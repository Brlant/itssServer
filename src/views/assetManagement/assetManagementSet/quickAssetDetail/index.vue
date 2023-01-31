<template>
  <div class="app-container">
     

    <el-row :gutter="10" class="mb8" type="flex"  justify="end">
      <el-col :span="1.5"  >
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
<!--       
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:user:export']"
        >导出</el-button> -->
      <!-- </el-col> -->
    </el-row>

    <el-table 
      v-loading="loading" 
      :data="tableData" 
      @row-click="goDetail"
    >
      <el-table-column 
        label="模板ID" 
        align="center"
        width="100"
        prop="id" 
      />
      <el-table-column 
        label="模板名称" 
        align="center"
        prop="templateName"
      />
      <el-table-column 
        label="适用资产类型" 
        align="center" 
        prop="assetTypeName" 
      />
      <el-table-column 
        label="品牌" 
        align="center" 
        prop="brand" 
      />
      <el-table-column 
        label="型号" 
        align="center" 
        prop="model" 
      />
      <el-table-column 
        label="操作系统" 
        align="center" 
        prop="os" 
      />
          <!-- /// 状态 0停用 1启用 -->
     
      <el-table-column 
        label="操作" 
        align="center" 
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click.native.stop="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
            <!-- <el-button
            size="mini"
            type="text"
            @click.native.stop="handleActive(scope.row)"
            :class="[scope.row.status=='1'?'tingyong':'qiyong']"
          >
          {{scope.row.status=='1'?'停用':'启用'}} 
          </el-button> -->
          <!-- <el-button
            size="mini"
            type="text"
            @click.native.stop="handleDelete(scope.row)"
            class="tingyong"
          >
          删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

     
  </div>
</template>

<script>
import {
  queryAll,
  searchDetail,
  createInfo,
  updateOrDelete
}  from '@/api/assetManagement/quickAssetDetail'

export default {
  name: "User",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户信息表格数据
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      // open: false,
      // // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // deptId: null,
        // userName: null,
        // nickName: null,
        // userType: null,
        // email: null,
        // phonenumber: null,
        // sex: null,
        // avatar: null,
        // password: null,
        // status: null,
        // loginIp: null,
        // loginDate: null,
      },
      // 表单参数
      // form: {},
      // 表单校验
      // rules: {
      //   userName: [
      //     { required: true, message: "用户账号不能为空", trigger: "blur" }
      //   ],
      //   nickName: [
      //     { required: true, message: "用户昵称不能为空", trigger: "blur" }
      //   ],
      // }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 
     * 查询用户信息列表
     *  */
    getList() {
      this.loading = true;
      queryAll(this.queryParams).then(res => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    /**
     * 查看详情页面
     * */
    goDetail(row){
      //  const obj = { path: "/assetManagement/assetManagementSet/quickAssetDetailDetail",query:{"id":row.id} };
      const obj = { 
        path: "/assetManagement/assetManagementSet/quickAsset-auth/detail",
        query:{"id":row.id} 
      }
      this.$tab.closeOpenPage(obj);
    },
      
    /**
     *  新增按钮操作
     * 
     */
    handleAdd() {
      // this.reset();
      // this.open = true;
      // this.title = "添加用户信息";
      // const obj = { path: "/assetManagement/assetManagementSet/quickAssetDetailAdd",query:{"action":'add'} };
      const obj = { 
        path: "/assetManagement/assetManagementSet/quickAsset-auth/add",
        query:{"action":'add'} 
      }
      this.$tab.closeOpenPage(obj);
    },
    /** 
     * 修改按钮操作
     *  */
    handleAcitce(row) {
      this.reset();
      const userId = row.userId || this.ids
      getUser(userId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户信息";
      });
    },
    /** 
     * 修改按钮操作
     *  */
    handleUpdate(row) {
      // const obj = { path: "/assetManagement/assetManagementSet/quickAssetDetailedit",query:{"id":row.id} };
      const obj = { 
        path: "/assetManagement/assetManagementSet/quickAsset-auth/edit",
        query:{"id":row.id} 
      }
      this.$tab.closeOpenPage(obj);
    },
    /** 
     * 提交按钮
     *  */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != null) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /**
     *  启用或者激活
    */
    handleActive(row){
      // 0停用 1启用 2删除
      let parems = this.deepClone(row)
      if(row.status=='1'){
        parems.status = '0'
      }else{
        parems.status = '1'
      }
      updateOrDelete(parems).then(res=>{
          this.$modal.msgSuccess("状态修改成功");
      })
      // parems.status =2
      // this.$modal.confirm('您确定删除"' + row.templateName + '"吗？').then(function() {
      //   return updateOrDelete(parems);
      // }).then(() => {
        this.getList();
      //   this.$modal.msgSuccess("删除成功");
      // }).catch(() => {});
    },
    /** 
     * 删除按钮操作
     *  */
    handleDelete(row) {
      // const userIds = row.userId || this.ids;
      let parems = this.deepClone(row)
      parems.status =2
      this.$modal.confirm('您确定删除"' + row.templateName + '"吗？').then(function() {
        return updateOrDelete(parems);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 
     * 导出按钮操作
     *  */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style scoped>
.qiyong{
  color: cornflowerblue;
}
.tingyong{
  color: crimson;
}
</style>