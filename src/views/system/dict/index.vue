<template>
  <div class="app-container">
    <div class="plateInfo">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="字典名称" prop="dictName">
                  <el-input
                    v-model="queryParams.dictName"
                    placeholder="请输入字典名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="字典类型" prop="dictType">
                  <el-input
                    v-model="queryParams.dictType"
                    placeholder="请输入字典类型"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="创建时间">
                  <el-date-picker
                    v-model="dateRange"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  placeholder="字典状态"
                  clearable
                >
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary"  @click="handleQuery">搜索</el-button>
                <el-button  @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    </div>
    <div>
      <div class="headerBtn">
        <el-button type="primary" plain @click="handleAdd" v-hasPermi="['system:dict:add']">新增</el-button>
        <!-- <el-button type="success" plain :disabled="single" @click="handleUpdate" v-hasPermi="['system:dict:edit']">修改</el-button>
        <el-button type="danger" plain :disabled="multiple" @click="handleDelete" v-hasPermi="['system:dict:remove']">删除</el-button> -->
        <!-- <el-button type="warning" plain @click="handleExport" v-hasPermi="['system:dict:export']">导出</el-button> -->
        <!-- <el-button type="danger" plain @click="handleRefreshCache" v-hasPermi="['system:dict:remove']">刷新缓存</el-button> -->
      </div>
      <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="字典编号" align="center" prop="dictId" />
          <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
          <el-table-column label="字典类型" align="center" prop="dictType" :show-overflow-tooltip="true">
            <!-- <template slot-scope="scope">
              <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">
                <span>{{ scope.row.dictType }}</span>
              </router-link>
            </template> -->
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <span class="text-primary cursor"  style="margin-right:20px" @click="checkDict(scope.row)">查看</span>
              <span class="text-primary cursor"  style="margin-right:20px" @click="handleUpdate(scope.row)" v-hasPermi="['system:dict:edit']">编辑</span>
              <span class="text-danger cursor"  @click="handleDelete(scope.row)" v-hasPermi="['system:dict:remove']">删除</span>
            </template>
          </el-table-column>
          <template slot="empty">
            <el-empty description="暂无数据"></el-empty>
          </template>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
    </div>


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
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
import { listType, getType, delType, addType, updateType, refreshCache } from "@/api/system/dict/type";

export default {
  name: "Dict",
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
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      submitLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true;
      listType(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.typeList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典类型";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.dictId || this.ids
      getType(dictId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典类型";
      });
    },
    // 查看
    checkDict(val){
      this.$router.push({ path:`/system/dict-data/index/${val.dictId}`})
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictId != undefined) {
            this.submitLoading = true
            updateType(this.form).then(response => {
              this.submitLoading = false
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(()=>{
              this.submitLoading = false
            });
          } else {
            this.submitLoading = true
            addType(this.form).then(response => {
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
      const dictIds = row.dictId || this.ids;
      this.$modal.confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？').then(function() {
        return delType(dictIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/dict/type/export', {
        ...this.queryParams
      }, `type_${new Date().getTime()}.xlsx`)
    },
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess("刷新成功");
        this.$store.dispatch('dict/cleanDict');
      });
    }
  }
};
</script>
