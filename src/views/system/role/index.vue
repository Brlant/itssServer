<template>
  <div class="app-container">
    <div class="plateInfo">
        <el-form :model="queryParams" ref="queryForm"  label-width="100px"  v-show="showSearch">
          <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input
                    v-model="queryParams.roleName"
                    placeholder="请输入角色名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
                <el-form-item label="权限字符" prop="roleKey">
                  <el-input
                    v-model="queryParams.roleKey"
                    placeholder="请输入权限字符"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
            </el-col> -->
            <el-col :span="6">
                <el-form-item label="角色状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="请选择角色状态"
                    clearable
                  >
                    <el-option
                      v-for="item in roleState"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6" v-if="$store.state.user.user.userId == 1">
              <el-form-item label="所属机构" prop="orgId">
                <el-cascader
                  v-model="queryParams.orgId"
                  :options="orgList"
                  ref="org"
                  :props="{ label: 'name', value: 'id', checkStrictly: true, emitPath: false }"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" v-hasPermi="['system:role:list']"  @click="handleQuery">搜索</el-button>
                  <el-button   @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-col>
            <!-- <el-col :span="6">
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
            </el-col> -->
          </el-row>
        </el-form>
    </div>
    <div>
        <div class="headerBtn">
            <el-button
              type="primary"
              plain
              @click="handleAdd"
              v-hasPermi="['system:role:add']"
            >新增</el-button>
            <el-button
              type="success"
              plain
              :disabled="checkList.length == 0"
              @click="handleStatusChange(0)"
              v-hasPermi="['system:role:edit']"
            >启用</el-button>
            <el-button
              type="danger"
              plain
              :disabled="checkList.length == 0"
              @click="handleStatusChange(1)"
              v-hasPermi="['system:role:edit']"
            >停用</el-button>
            <!-- <el-button
              type="success"
              plain
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['system:role:edit']"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:role:remove']"
            >删除</el-button>
            <el-button
              type="warning"
              plain
              @click="handleExport"
              v-hasPermi="['system:role:export']"
            >导出</el-button> -->
        </div>
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="180" />
      <!-- <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="180" /> -->
      <!-- <el-table-column label="显示顺序" prop="roleSort" width="100" /> -->

      <el-table-column label="所属机构" prop="orgName" width="120" />

      <el-table-column label="状态"  width="180">
        <template slot-scope="scope">
          <span class='enabledStatus' :class="{ error : scope.row.status != 0 }">{{ scope.row.status == 0 ? '启用' : '停用' }}</span>
          <!-- <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="最后操作人"  prop="updateBy" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后操作时间"  prop="updateTime" width="220">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime? scope.row.updateTime:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  class-name="small-padding fixed-width">
        <template slot-scope="scope" >
          <span
            class="text-success cursor mr20"
            v-if="scope.row.roleId !== 1"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >编辑</span>
          <span
            class="text-warning cursor"
            @click="handleToView(scope.row)"
            v-hasPermi="['system:role:query']"
          >查看</span>
           <!-- <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:role:edit']">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDataScope" icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']">数据权限</el-dropdown-item>
              <el-dropdown-item command="handleAuthUser" icon="el-icon-user"
                v-hasPermi="['system:role:edit']">分配用户</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>  -->
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
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            权限字符
          </span>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
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

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus, deptTreeSelect,batchChangeStatus } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { reqList } from '@/api/OrgManage/OrgManage.js' ;

export default {
  name: "Role",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      // single: true,
      // // 非多个禁用
      // multiple: true,
      // 选中的数组
      checkList:[],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      // dateRange: [],
      // 角色状态
      roleState:[
        {
          label: "启用",
          value: 0
        },
        {
          label: "禁用",
          value: 1
        },
      ],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
        {
          value: "2",
          label: "自定数据权限"
        },
        {
          value: "3",
          label: "本部门数据权限"
        },
        {
          value: "4",
          label: "本部门及以下数据权限"
        },
        {
          value: "5",
          label: "仅本人数据权限"
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: '',
        status: '',
        orgId:'',
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      },
      submitLoading: false,
      orgList: []
    };
  },
  mounted() {
    this.getList();
    this.getOrgList()
  },
  methods: {
    /** 查询机构列表 */
    getOrgList() {
      let reqObj = {} ;
      reqObj.headers = {
        userId : 1,
      } ;
      reqList(reqObj).then(res=>{
        this.orgList = res.data
      })
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.queryParams).then(response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getDeptTree(roleId) {
      return deptTreeSelect(roleId).then(response => {
        this.deptOptions = response.depts;
        return response;
      });
    },
    // 角色状态修改（0启用、1停用）
    handleStatusChange(type) {
      let parame = {
        roleIds:this.checkList.map(item=>item.roleId).toString(),
        roleStatus:type
      }
      batchChangeStatus(parame).then(res=>{
        let {code,msg} = res
        if(+code == 200){
          this.$message.success(msg)
          this.handleQuery()
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
      this.menuNodeAll = false,
      this.deptExpand = true,
      this.deptNodeAll = false,
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
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
      this.queryParams.roleName = ''
      this.queryParams.status = ''
      // this.dateRange = [];
      // this.resetForm("queryForm");
      // this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.checkList = selection
      // this.ids = selection.map(item => item.roleId)
      // this.single = selection.length!=1
      // this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleDataScope":
          this.handleDataScope(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true: false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      // this.getMenuTreeselect();
      // this.open = true;
      // this.title = "添加角色";
      this.$router.push({ path:'/system/role-auth/roleAdd/'})
      // this.$router.push({ path:'/system/role-auth/roleEdit/', query:{ isAdd:'add'}})
    },
    /** 修改按钮操作  这里的好的*/
    // handleUpdate(row) {
    //   this.reset();
    //   const roleId = row.roleId || this.ids
    //   const roleMenu = this.getRoleMenuTreeselect(roleId);
    //   getRole(roleId).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.$nextTick(() => {
    //       roleMenu.then(res => {
    //         let checkedKeys = res.checkedKeys
    //         checkedKeys.forEach((v) => {
    //             this.$nextTick(()=>{
    //                 this.$refs.menu.setChecked(v, true ,false);
    //             })
    //         })
    //       });
    //     });
    //     this.title = "修改角色";
    //   });
    // },
    // 编辑
    handleUpdate(row) {
      this.$router.push({ path:'/system/role-auth/roleEdit/',
       query:{ isAdd:'edit',
       roleId:row.roleId,
       }})
    },
    // 详情
    handleToView(row) {
      this.$router.push({ path:'/system/role-auth/roleDetail/',
       query:{ roleId:row.roleId,}})
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if(value !== '2') {
        this.$refs.dept.setCheckedKeys([]);
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      const deptTreeSelect = this.getDeptTree(row.roleId);
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.$nextTick(() => {
          deptTreeSelect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = "分配数据权限";
      });
    },
    /** 分配用户操作 */
    handleAuthUser: function(row) {
      const roleId = row.roleId;
      this.$router.push("/system/role-auth/user/" + roleId);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            this.submitLoading = true
            updateRole(this.form).then(response => {
              this.submitLoading = false
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(()=>{
              this.submitLoading = false
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            this.submitLoading = true
            addRole(this.form).then(response => {
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
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$modal.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？').then(function() {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/role/export', {
        ...this.queryParams
      }, `role_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
