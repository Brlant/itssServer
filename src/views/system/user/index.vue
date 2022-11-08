<template>
  <div class="app-container">
    <div class="user-app">
      <div class="left">
        <div class="head-container">
          <el-input
            class="input-style"
            v-model="deptName"
            placeholder="搜索成员、部门、技能"
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
            @focus="searchTable"
          />
          <i class="el-icon-plus" @click="handleAdd"></i>
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </div>
      <div class="right">
        <div class="right-header">
          <div>{{ deptTitle }}</div>
          <div>
            <el-button
              type="text"
              v-hasPermi="['system:user:query']"
              @click="add"
              >添加</el-button
            >
          </div>
        </div>
        <el-table :data="user">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column label="姓名" align="center" prop="nickName" />
          <el-table-column label="职位" align="center" prop="postName" />
          <el-table-column label="部门" align="center" prop="deptName" />
          <el-table-column label="邮箱" align="center" prop="email" />
          <el-table-column label="手机号码" align="center" prop="phonenumber" />
          <el-table-column label="系统角色" align="center" prop="roles">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.roles" :key="index"
                ><span v-if="item"
                  >{{ item.roleName
                  }}<span v-if="index < scope.row.roles.length - 1"
                    >,</span
                  ></span
                ></span
              >
            </template>
          </el-table-column>
          <el-table-column label="身份ID" align="center" prop="userId" />
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text">邀请</el-button>
              <el-button
                size="mini"
                type="text"
                v-hasPermi="['system:user:query']"
                @click="detail(scope.row.userId)"
                >详情</el-button
              >
              <el-button
                size="mini"
                type="text"
                style="color: red"
                @click="stopOrUse(scope.row.userId, 1)"
                v-if="scope.row.status == 0"
                >停用</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="stopOrUse(scope.row.userId, 0)"
                v-if="scope.row.status == 1"
                >启用</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加或修改部门对话框 -->
   
    <el-dialog
      title="新增部门"
      class="dialogForm"
      width="600px"
      :visible.sync="open"
    >
      <el-form
        :model="deptForm"
        ref="deptForm"
        :rules="deptRules"
        :inline="false"
        label-width="7em"
        class="dialogFormInfo"
      >
        <!-- <el-row v-if='isHaveParent'> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model="deptForm.name"
                size="medium"
                clearable
                placeholder="请输入部门名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="deptNo">
              <el-input
                v-model="deptForm.deptNo"
                size="medium"
                clearable
                placeholder="请输入部门编号"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="关联机构" prop="orgId">
              <el-cascader
                v-model="deptForm.orgId"
                size="medium"
                filterable
                ref="org"
                clearable
                :options="orgData"
                :props="orgPropsObj"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <el-cascader
                v-model="deptForm.parentId"
                size="medium"
                filterable
                ref="parentDept"
                clearable
                :options="parentDeptData"
                :props="propsObj"
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="关联岗位" prop="posts">
              <el-select
                v-model="deptForm.posts"
                :multiple="true"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
                placeholder="请选择关联机构"
              >
                <el-option
                  v-for="item in postList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="deptForm.sort"
                size="medium"
                controls-position="right"
                :min="0"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="部门状态" prop="status">
              <el-radio-group v-model="deptForm.status">
                <el-radio
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="deptForm.remark"
                type="textarea"
                size="medium"
                clearable
                placeholder="请输入备注"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" @click="newAdd">确定</el-button>
        <!-- <el-button @click="cancelFn">取消</el-button> -->
      </div>
    </el-dialog>
    <!--用户数据-->
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  changeStatus,
  queryUserList,
  stopUse,
} from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { treeselect, listDept, addDept } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { reqList, status } from "@/api/OrgManage/OrgManage.js";
import { all } from "@/api/PostManage/PostManage.js";
import {
  tree,
  add,
  update,
  remove,
  deptStatus,
} from "@/api/DeptMange/DeptManage.js";
// import { directive } from 'vue/types/umd';

export default {
  name: "User",
  dicts: ["sys_normal_disable", "sys_user_sex"],
  components: { Treeselect },
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
      // 用户表格数据
      user: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      deptOption: [],
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      stop: false,
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" },
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      deptTitle: "",
      orgData: [],
      statusList: [],
      postList: [],
      parentDeptData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],

      deptForm: {
        name: "",
        deptNo: "",
        orgId: "",
        orgIdNode: null,
        parentId: "",
        // parentIdNode : null,
        posts: "",
        sort: "",
        status: "",
        remark: "",
      },
      propsObj: {
        value: "id",
        label: "name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
        emitPath: false, //  只返回选择的该节点的值, 为 true 返回各级菜单的数组形式
      },
      orgPropsObj: {
        value: "id",
        label: "name",
        expandTrigger: "hover",
        checkStrictly: true,
        emitPath: false,
      },
      deptRules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        // parentDept: [
        //     { required: false, message: '请选择上级部门', trigger: 'blur' },
        // ],
        orgId: [{ required: true, message: "请选择关联机构", trigger: "blur" }],
        sort: [
          { required: true, message: "请输入显示排序", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.reqStatusFn();
    this.reqAllListFn();
    this.reqOrgListFn();
    this.reqParentDeptFn();
    // this.getConfigKey("sys.user.initPassword").then((response) => {
    //   this.initPassword = response.msg;
    // });
  },
  methods: {
    reqParentDeptFn() {
      let reqObj = {};

      // 测试数据
      reqObj.headers = {
        userId: 1, // 当前登陆用户 ID   < 必填 >
        deptId: 1, // 当前登陆人的部门 ID   < 必填 >
      };

      let _fn = (arr) => {
        let result = arr;

        result.forEach((item) => {
          // 有无children项
          if (item.children && item.children.length !== 0) {
            let newChildren = [];
            newChildren = _fn(item.children);
            item.children = newChildren;
          } else {
            if (item.type !== 2) {
              // 非部门类型数据
              item.disabled = true;
            } else {
              // type : 2 为部门数据, 只有部门数据可选择
              item.disabled = false;
            }
          }
        });

        return result;
      };

      tree(reqObj)
        .then((d) => {
          if (d.code === 200) {
            this.parentDeptData = _fn(d.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    reqAllListFn() {
      all({})
        .then((d) => {
          if (d.code === 200) {
            if (d.data) {
              this.postList = d.data;
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    reqOrgListFn() {
      let reqObj = {};

      // 测试数据
      reqObj.headers = {
        userId: 1, // 当前登陆用户 ID         < 必填 >
        orgId: 3, // 当前登陆人的所属机构 ID    < 必填 >
      };

      reqList(reqObj)
        .then((d) => {
          if (d.code === 200) {
            this.orgData = d.data;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    reqStatusFn() {
      status({})
        .then((d) => {
          if (d.code === 200) {
            if (d.data) {
              let statusArr = [];
              for (let a in d.data) {
                statusArr.push({
                  label: d.data[a],
                  value: +a,
                });
              }
              this.statusList = statusArr;
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    add() {
      const obj = { path: "/system/user-auth/editAddInfo" };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    searchTable() {
      const obj = { path: "/system/user-auth/search" };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    detail(id) {
      console.log(id, "dddd");
      const obj = { path: "/system/user-auth/userInfo", query: { userId: id } };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    show(data) {
      console.log(data);
    },
    //停用启用
    stopOrUse(id, code) {
      stopUse({ status: code, userId: id }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.getList();
        }
      });
    },
    /** 查询用户列表 */
    getList() {
      queryUserList({ deptId: this.queryParams.deptId }).then((response) => {
        this.user = response.data;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      console.log(data);
      this.queryParams.deptId = data.id;
      this.deptTitle = data.label;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.userName + '"用户吗？')
        .then(function () {
          return changeStatus(row);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
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
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postId: "",
        roleIds: [],
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        case "handleAuthRole":
          this.handleAuthRole(row);
          break;
        default:
          break;
      }
    },
    newAdd() {
      this.deptForm.posts =
        this.deptForm.posts && Array.isArray(this.deptForm.posts)
          ? this.deptForm.posts.join(",")
          : "";

      add({ method: "post", data: { ...this.deptForm } })
        .then((d) => {
          if (d.code === 200) {
            this.reqDeptListFn(); // 刷新列表数据
          }

          this.$message({
            message: d.code === 200 ? "新增成功!" : "新增异常!",
            type: d.code === 200 ? "success" : "warning",
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      // this.getTreeselect();
      // getUser().then((response) => {
      //   response.posts.map((item, i) => {
      //     item.postName =
      //       item.regionName + "-" + item.postName + "-" + item.postLevel;
      //   });
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      // this.title = "添加部门";
      this.open = true;
      this.title = "添加部门";
      treeselect().then((response) => {
        this.deptOption = response.data;

        // this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data;
        response.posts.map((item, i) => {
          item.postName =
            item.regionName + "-" + item.postName + "-" + item.postLevel;
        });
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        // this.form.postIds = response.postIds;
        this.form.postId = response.data.postId;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        })
        .catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function (row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按钮 */
    // submitForm: function () {
    //   this.$refs["form"].validate((valid) => {
    //     if (valid) {
    //       // this.form.postid = this.form.postIds
    //       // delete this.form.postIds
    //       if (this.form.userId != undefined) {
    //         updateUser(this.form).then((response) => {
    //           this.$modal.msgSuccess("修改成功");
    //           this.open = false;
    //           this.getList();
    //         });
    //       } else {
    //         addUser(this.form).then((response) => {
    //           this.$modal.msgSuccess("新增成功");
    //           this.open = false;
    //           this.getList();
    //         });
    //       }
    //     }
    //   });
    // },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$modal
        .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "system/user/importTemplate",
        {},
        `user_template_${new Date().getTime()}.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>
<style lang="scss" scoped>
.user-app {
  display: flex;
  justify-content: space-between;
  .left {
    width: 20%;
  }
  .right {
    width: 79%;
    .right-header {
      display: flex;
      justify-content: space-between;
    }
  }
}
.input-style {
  display: inline-block;
  width: 88%;
  margin-right: 5px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
