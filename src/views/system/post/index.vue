<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="职位编码" prop="postCode">
        <el-input
          v-model="queryParams.postCode"
          placeholder="请输入职位编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="职位名称" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入职位名称"
          clearable

        />
      </el-form-item>
      <el-form-item label="区域" prop="regionId" v-if='areas.length != 0'>
          <el-select v-model="queryParams.regionId" placeholder="区域" clearable>
          <el-option
            v-for="dict in areas"
            :key="dict.dictCode"
            :label="dict.dictLabel"
            :value="dict.dictCode"
          />
        </el-select>
        </el-form-item>
         <el-form-item label="职位类型" prop="postType" v-if='typeList.length != 0'>
         <el-select v-model="queryParams.postType" placeholder="职位类型" clearable>
          <el-option
            v-for="dict in typeList"
            :key="dict.dictCode"
            :label="dict.dictLabel"
            :value="dict.dictCode"
          />
        </el-select>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:post:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:post:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="职位编号" align="center" prop="postId" />
      <el-table-column label="区域" align="center" prop="regionName" />
      <el-table-column label="职位名称" align="center" prop="postName" />
      <el-table-column label="等级" align="center" prop="postLevel" />
      <el-table-column label="成本内部预设（元/天）" align="center" prop="costIn" />
      <el-table-column label="成本外部预设（元/天）" align="center" prop="costOut" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除</el-button>
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
         <el-form-item label="区域" prop="regionId">
          <el-select v-model="form.regionId" placeholder="区域" clearable>
          <el-option
            v-for="dict in areas"
            :key="dict.dictCode"
            :label="dict.dictLabel"
            :value="dict.dictCode"
          />
        </el-select>
        </el-form-item>
         <el-form-item label="职位类型" prop="postType">
         <el-select v-model="form.postType" placeholder="职位类型" clearable>
          <el-option
            v-for="dict in typeList"
            :key="dict.dictCode"
            :label="dict.dictLabel"
            :value="dict.dictCode"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="职位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入职位名称" />
        </el-form-item>
        <el-form-item label="等级" prop="postLevel">
          <el-input v-model="form.postLevel" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="对内成本预设（元/天）" prop="costIn">
         <el-input v-model="form.costIn" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="对外成本预设（元/天）" prop="costOut">
          <el-input v-model="form.costOut" placeholder="请输入等级" />
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="submitLoading"
          @click="submitForm"
        >
          确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost,areatypePost } from "@/api/system/post";

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
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
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined
      },
      typeList:[{}],
      areas:[{}],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        postName: [
          { required: true, message: "职位名称不能为空", trigger: "blur" }
        ],
        postType:[{
          required: true, message: "职位类型不能为空", trigger: "blur"
        }],
        postLevel:[
          { required: true, message: "职位等级不能为空", trigger: "blur" }
        ],
        regionId: [
          { required: true, message: "区域不能为空", trigger: "blur" }
        ],
        area:[
          { required: true, message: "职位名称不能为空", trigger: "blur" }
        ],
        // postSort: [
        //   { required: true, message: "岗位顺序不能为空", trigger: "blur" }
        // ]
      },
      submitLoading: false
    };
  },
  created() {
    this.getList();
    this.positinType('region')
    this.positinType('post_type')
  },
  methods: {
    positinType(val){
      areatypePost(val).then(res=>{
        if(val=='region'){
          this.areas=res.data
        }else if(val=='post_type'){
          this.typeList=res.data
        }

      })
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        costIn: "",
        costOut: "",
        postLevel: "",
        postName: "",
        postType: undefined,
        regionId: undefined,
      };
      this.form={

      }
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加职位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.postId || this.ids
      getPost(postId).then(response => {
        // // 因为憨批后台返回了一个字符串，
        // // 导致展示的结果是数字，
        // // 而字典的类型是int
        // // 估有此行代码
        // response.data.postType = parseInt(response.data.postType)
        this.form = response.data;

        this.open = true;
        this.title = "修改职位";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      // return
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.postId != undefined) {
            this.submitLoading = true
            updatePost(this.form).then(response => {
              this.submitLoading = false
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(()=>{
              this.submitLoading = false
            });
          } else {
            this.submitLoading = true
            addPost(this.form).then(response => {
              this.submitLoading = false
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(()=>{
              this.submitLoading = false
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.postId || this.ids;
      this.$modal.confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？').then(function() {
        return delPost(postIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
