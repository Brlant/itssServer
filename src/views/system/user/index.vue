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
          <i
            class="el-icon-plus"
            @click="handleAdd"
            v-hasPermi="['system:user:add']"
            style="cursor: pointer"
          ></i>
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            node-key="id"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="trees"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          >
            <!-- <span slot-scope="{ data }">{{data.label}}<i class='el-icon-plus' style='margin-left:100px;'></i></span> -->
          </el-tree>
        </div>
      </div>
      <div class="right">
        <div class="right-header">
          <div>{{ deptTitle }}</div>
<!--          <div v-if="showSetCommander" v-hasPermi="['system:user:add']">-->
          <div v-hasPermi="['system:user:add']">
            <el-button type="text" @click="setCommander">设置负责人</el-button>
            <span>
              <span>|</span>
              <el-button type="text" @click="add">添加</el-button>
            </span>
          </div>
        </div>
        <el-table :data="user" @row-click="showRowDetail">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column label="姓名" align="center" prop="nickName">
            <template slot-scope="scope">
              <span
                @click="detail(scope.row.userId)"
                style="cursor: pointer; color: #3d7dff"
                ><i
                  class="el-icon-user-solid"
                  v-if="scope.row.dept.leader&&scope.row.dept.leader.includes(scope.row.userId)"
                ></i
                >{{ scope.row.nickName }}</span
              >
            </template>
          </el-table-column>
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
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.status == 0
                  ? '启用'
                  : scope.row.status == 1
                    ? '停用'
                    : '' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text">邀请</el-button> -->
              <el-button
                size="mini"
                type="text"
                v-hasPermi="['system:user:query']"
                @click.stop="detail(scope.row.userId)"
                >详情</el-button
              >
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
                maxlength='30'
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
                @change="changeOrgId"
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
        <!-- <el-row>
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
        </el-row> -->
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
        <el-button
          type="primary"
          :disabled="addLoading"
          @click="newAdd">确定</el-button>
        <!-- <el-button @click="cancelFn">取消</el-button> -->
      </div>
    </el-dialog>
    <!--用户数据-->
    <el-dialog
      title="设置负责人"
      class="dialogForm"
      width="30%"
      :visible.sync="editShow"
      destroy-on-close
      :close-on-press-escape="false"
      :close-on-click-modal="false"
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
            <el-form-item label="设置部门负责人" prop="commander">
              <el-select
                v-model="diaForm.commander"
                :collapse-tags="true"
                multiple
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
  setuser,
  queryUserlistByRole,
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
import { dictDataAll } from "@/api/dataDict";

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
      editShow: false,
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
      diaForm: {
        commander: [],
      },
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
        // label: "name",
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
      projectUserIdOptions: [],
      curren: "",
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
        status: 1,
        remark: "",
      },
      propsObj: {
        value: "id",
        // label: "name",
        label: "label",
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
      dialogRules: {
        commander: [
          { required: true, message: "请选择负责人", trigger: "blur" },
        ],
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
      // 是否显示设置负责人
      // showSetCommander: false,
      // 当前点击节点
      currentNode: {},
      addLoading: false,
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },

  created() {
    // this.getList();

    this.getTreeselect();

    this.reqAllListFn();
    this.reqOrgListFn();
    // this.reqParentDeptFn();
    this.getSkills();
    const { currentNode } = this.$route.params
    if (currentNode && typeof currentNode == "object") {
      this.handleNodeClick(currentNode)
    }
  },
  methods: {
    getSkills() {
      const params = {
        dictType: "skill_type",
        status: "0",
      };
      dictDataAll(params).then((res) => {
        let { rows } = res;
        rows.forEach((v) => (v.tick = false));
        sessionStorage.setItem("skills", JSON.stringify(rows));
      });
    },
    detailInfo(id) {
      const obj = { path: "/user/profile", query: { userId: id, isUser: 1 } };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    showRowDetail(row, column) {
      // console.log(row,"column",column);
      if(column && column.label=='操作'){
        return;
      }
      const obj = {
        path: "/system/user-auth/userInfo",
        query: {
          userId: row.userId,
          deptId: this.queryParams.deptId,
          deptTitle: this.deptTitle,
          currentNode: this.currentNode
        },
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    defaultData() {
      // console.log(this.$refs.tree,'this.$refs.tree')
      // this.$refs.trees.setCurrentKey(this.deptOptions[0].label)
      this.$nextTick(function () {
        this.$refs.trees.setCurrentKey(this.curren); //data[0].id为默认选中的节点
      });
    },
    sureEdit() {
      this.$refs["diaForm"].validate((valid) => {
        if (valid) {
          let data = {
            deptId: this.queryParams.deptId,
            leader: this.diaForm.commander.toString(),
          };
          setuser(data).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.editShow = false;
              this.getList();
            }
          });
        }
      });
    },
    setCommander() {
      // 筛选出列表中的负责人
      let leader = this.user.length > 0
                   ? this.user[0].dept.leader
                   : '';
      // 筛选出可设置的负责人数据源中的负责人
      let newList = []
      if (leader) {
         newList = this.projectUserIdOptions.filter((item) =>
          leader.includes(item.userId)
        );
      }
      // 取出userId回显已设置的负责人
      const commander = newList.map(item =>
      {
        return item.userId
      })
      this.diaForm = {
        commander: commander,
      };
      this.editShow = true;
    },
    /* 查询是项目主管的用户列表 */
    queryUserlistByRole() {
      let data = { deptId: this.queryParams.deptId, hasChild: false };
      console.log(data, "dd");
      queryUserlistByRole(data).then((res) => {
        // res.data.map((item) => {
        //   item.userNameAndPost = item.nickName + "（" + item.postName + "）";
        // });
        this.projectUserIdOptions = res.data; // 初始化填充给 项目负责人的 永远是所有用户
      });
    },
    changeOrgId(val){
      this.deptForm.parentId = null
      val ? this.reqParentDeptFn() : this.parentDeptData = []
    },

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

      /*tree(reqObj)
        .then((d) => {
          if (d.code === 200) {
            this.parentDeptData = _fn(d.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });*/


      let params = {
        orgId: this.deptForm.orgId
      }
      treeselect(params).then((d) => {
        if (d.code === 200) {
          this.parentDeptData = d.data;
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
              this.statusList.map((v) =>
                v.label === "启用" || v.value === 1
                  ? (this.deptForm.status = v.value)
                  : ""
              );
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    add() {
      sessionStorage.removeItem("editAddInfo");
      const obj = {
        path: "/system/user-auth/editAddInfo",
        query: {
          currentNode: this.currentNode
        }
      };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    searchTable() {
      const obj = { path: "/system/user-auth/search" };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
    detail(id) {
      // window.localStorage.setItem('depttId',this.queryParams.deptId)
      // window.localStorage.setItem('deptTitle',this.deptTitle)
      const obj = {
        path: "/system/user-auth/userInfo",
        query: {
          userId: id,
          deptId: this.queryParams.deptId,
          deptTitle: this.deptTitle,
          currentNode: this.currentNode
        },
      };
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
      this.user = [];
      queryUserList({ deptId: this.queryParams.deptId }).then((response) => {
        this.user = response.data;
      }).catch(()=>{
        this.user = [];
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
        // this.$store.commit('SET_DEPTID',this.deptOptions[0].id)
        //  if(this.$store.state.deptId){

        //       this.queryParams.deptId = window.localStorage.getItem('depttId')
        //        this.deptTitle =window.localStorage.getItem('deptTitle');
        //         this.curren=window.localStorage.getItem('depttId')

        //     }else{
        // this.queryParams.deptId = this.deptOptions[0].id;
        if (this.$store.state.user.deptId) {
          console.log(this.$store.state.user.deptId);
          this.queryParams.deptId = this.$store.state.user.deptId;
          this.deptTitle = this.$store.state.user.deptTitle;
          this.curren = this.$store.state.user.deptId;
        } else {
          this.queryParams.deptId = this.deptOptions[0].id;
          this.deptTitle = this.deptOptions[0].label;
          this.curren = this.deptOptions[0].id;
        }

        // }

        console.log(this.deptTitle, " this.deptTitle");

        this.getList();
        this.queryUserlistByRole();
        this.defaultData();
        if (this.deptOptions.length > 0) {
          this.handleNodeClick(this.deptOptions[0])
        }
      });

     /* let reqObj = {};

      reqObj.headers = {
        userId: this.$store.state.user.user.userId,
        deptId: this.$store.state.user.user.deptId,
      };
      tree(reqObj)
        .then((d) => {
          if (d.code === 200) {
            // this.deptOptions = d.data;
            if(this.$store.state.user.user.userId == 1){
              this.deptOptions = d.data;
            }else {
              d.data.map(item=>{
                if(item.type == 1){
                   this.deptOptions = item.children
                }
              })
            }
            if (this.$store.state.user.deptId) {
              console.log(this.$store.state.user.deptId);
              this.queryParams.deptId = this.$store.state.user.deptId;
              this.deptTitle = this.$store.state.user.deptTitle;
              this.curren = this.$store.state.user.deptId;
            } else {
              this.queryParams.deptId = this.deptOptions[0].id;
              this.deptTitle = this.deptOptions[0].name;
              this.curren = this.deptOptions[0].id;
            }
            this.getList();
            this.queryUserlistByRole();
            this.defaultData();
          }
        })
        .catch((err) => {
          console.error(err);
        });*/
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      // return data.label.indexOf(value) !== -1;
      return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      // console.log("data",data)
      /*this.showSetCommander = (this.$store.state.user.user.userId == 1 || data.id == this.$store.state.user.user.deptId || data.parentId == this.$store.state.user.user.deptId)
                              ? true
                              : false*/
      this.currentNode = data
      console.log(this.defaultData, "defaultData");
      console.log(data, "data");
      this.queryParams.deptId = data.id;
      this.$store.commit("SET_DEPTID", this.queryParams.deptId);
      // this.deptTitle = data.label;
      this.deptTitle = data.name;
      this.$store.commit("SET_DEPTTITLE", this.deptTitle);
      this.queryUserlistByRole();
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
      (this.deptForm = {
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
      }),
        this.resetForm("form");
    },

    newAdd() {
      this.deptForm.posts =
        this.deptForm.posts && Array.isArray(this.deptForm.posts)
          ? this.deptForm.posts.join(",")
          : "";
      this.$refs.deptForm.validate(valid => {
        if (!valid) return
        this.addLoading = true
        add({
          method: "post",
          data: {...this.deptForm}
        })
          .then((d) => {
            this.addLoading = false
            if (d.code === 200) {
              // this.$message.success('新增部门成功')
              this.open = false;
              this.getTreeselect(); // 刷新列表数据
            }

            this.$message({
              message: d.code === 200
                       ? "新增成功!"
                       : "新增异常!",
              type: d.code === 200
                    ? "success"
                    : "warning",
            });
          })
          .catch((err) => {
            this.addLoading = false
            console.error(err);
          });
      })
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
      this.deptForm = {
        name: "",
        deptNo: "",
        orgId: "",
        // orgIdNode : null,
        parentId: "",
        // parentIdNode : null,
        posts: "",
        sort: "",
        status: "",
        remark: "",
      }; // deptForm.status statusList
      this.reqStatusFn();
      treeselect().then((response) => {
        this.deptOption = response.data;

        // this.form.password = this.initPassword;
      });
    },

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
