<template>
  <div class="app-container">
    <div class="plateInfo">
      <el-form :model="filterForm" ref="filterForm" label-width="100px">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="姓名" prop="nickName">
                    <el-input v-model="filterForm.nickName" clearable placeholder="请输入姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="手机号" prop="phonenumber">
                    <el-input v-model="filterForm.phonenumber" clearable placeholder="请输入手机号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="角色" prop="role">
                    <el-select v-model="filterForm.roleId" multiple  filterable collapse-tags placeholder="请输入角色">
                        <el-option v-for="item in roles" :key="item.roleId" :value="item.roleId" :label="item.roleName"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="状态" prop="status">
                    <el-select v-model="filterForm.status" clearable placeholder="请选择状态">
                        <el-option value="1" label="启用"></el-option>
                        <el-option value="2" label="停用"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="账号" prop="userName">
                    <el-input v-model="filterForm.userName" clearable placeholder="请输入账号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="单位名称" prop="org">
                    <!-- <el-input v-model="filterForm.org" clearable placeholder="请输入机构名称"></el-input> -->
                    <el-select v-model="filterForm.unitId" filterable clearable placeholder="请输入单位名称">
                        <el-option v-for="item in orgList" :key="item.unitId" :value="item.unitId" :label="item.unitName"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item class="orgItem">
                    <!-- <el-button v-if="buttonIcon('查询')" type="primary" @click="listQuery()">查询</el-button> -->
                    <el-button type="primary" v-hasPermi="['system:user:list']"  @click="searchFn">查询</el-button>
                    <el-button plain @click="resetFeildFn">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <div class="headerBtn">
          <el-button type="primary" v-hasPermi="['system:user:add']"  @click="addFn">新增</el-button>
          <el-button type="primary" :disabled='selectUsers.length == 0' plain v-hasPermi="['system:unit:edit']"  @click="changeStatusFn(0)">启用</el-button>
          <el-button type="danger" :disabled='selectUsers.length == 0' plain  v-hasPermi="['system:unit:edit']" @click="changeStatusFn(1)">停用</el-button>
      </div>

      <el-table v-loading="tableLoading" :data="tableData" @selection-change="selectionChange" border>
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="account" label="账号">
          <template slot-scope="{ row }">
              {{ row.userName }}
          </template>
        </el-table-column>
        <el-table-column label="关联单位" width="220">
          <template slot-scope="{ row }">
            {{ row.unit?row.unit.unitName:'--'}}
          </template>
        </el-table-column>

         <el-table-column label="姓名" prop="managerName">
          <template slot-scope="{ row }">
            {{ row.nickName }}
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="{ row }">
            {{ row.phonenumber }}
          </template>
        </el-table-column>
        <el-table-column label="角色" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.roles.map( v => v.roleName ).join( ', ' )" placement="top">
              <span class="txtEllipsis">{{ scope.row.roles.map( v => v.roleName ).join( ', ' ) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <span class='enabledStatus' :class="{ error : scope.row.status != 0 }">{{ scope.row.status == 0 ? '启用' : '停用' }}</span>
            <!-- <el-tag v-if="scope.row.userStatus === 1" type="success">启用</el-tag>
            <el-tag v-else type="info">停用</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="updateBy" label="最后操作人" width="150">
          <template slot-scope="{ row }">
            {{ row.updateBy }}
          </template>
        </el-table-column>

        <el-table-column prop="updateTime" label="最后操作时间">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
              <span class="text-primary cursor"  style="margin-right:20px" @click="editFn( scope.row )" v-hasPermi="['system:user:edit']">编辑</span>
              <span class="text-danger cursor"   @click="resetFn(scope.row)" v-hasPermi="['system:user:edit']">密码重置</span>
          </template>
        </el-table-column>
        <template slot="empty">
          <el-empty description="暂无数据"></el-empty>
        </template>
      </el-table>
      <pagination
          v-show="total>0"
          :total="total"
          :page.sync="currentPage"
          :limit.sync="pageSize"
          @pagination="queryPageFn"
        />
    </div>

    <!-- 新增/编辑 -->
    <el-dialog :title="isAdd ? '新增用户' : '编辑用户'" :close-on-click-modal="false"   class="dialogForm" :visible.sync="isAddEdit" width="860px">
      <el-form :model="addEditForm" ref="addEditForm" :rules="addEditRules" label-width="7em" class="dialogFormInfo">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号名称" prop="userName">
              <el-input v-model="addEditForm.userName" clearable placeholder="请输入账号名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="nickName">
              <el-input v-model="addEditForm.nickName" clearable placeholder="请输入用户姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phonenumber" width="100%">
              <el-input v-model="addEditForm.phonenumber" maxlength="11" clearable placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="isAdd">
            <el-form-item label="密码" prop="password" >
              <el-input v-model="addEditForm.password"   maxlength="20" type="password" auto-complete="new-password" clearable placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!isAdd">
            <el-form-item label="关联单位" prop="unitId" width="100%">
              <el-select v-model="addEditForm.unitId" filterable :disabled="disabled" clearable placeholder="请输入关联单位">
                <el-option v-for="item in filterOrgList" :key="item.unitId" :value="item.unitId" :label="item.unitName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="isAdd">
            <el-form-item label="关联单位" prop="unitId" width="100%">
              <el-select v-model="addEditForm.unitId" :disabled="disabled" filterable clearable placeholder="请输入关联单位">
                <el-option v-for="item in filterOrgList" :key="item.unitId" :value="item.unitId" :label="item.unitName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds" >
              <el-select v-model="addEditForm.roleIds" multiple  filterable collapse-tags placeholder="请输入角色" remote>
                <el-option v-for="item in roles" :key="item.roleId" :value="item.roleId" :label="item.roleName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
        <div class="txtAlignC">
          <el-button type="primary" @click="sendAddEditFn('addEditForm')" >确定</el-button>
          <el-button  plain @click="cancelAddEditFn">取消</el-button>
        </div>
      </el-dialog>

        <!-- 密码重置 -->
      <el-dialog title="密码重置" class="dialogForm" :close-on-click-modal="false"  :visible.sync="isResetPassword" width="420px">
        <el-form :model="passwordForm" ref="passwordForm" :rules="passwordFormRules" :inline="false" label-width="7em" class="dialogFormInfo">
          <el-row>
            <el-col :span="24">
              <el-form-item label="账号" prop="account">
                {{ passwordForm.account }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="新密码" prop="newPassword">
                <el-input type='password' v-model="passwordForm.newPassword" maxlength="20" clearable placeholder="请输入新密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="再次输入" prop="againPassword">
                <el-input type='password' v-model="passwordForm.againPassword" maxlength="20" clearable placeholder="请再次输入新密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>

        <div class="txtAlignC">
          <el-button type="primary" @click="sendPasswordFn('passwordForm')">确定</el-button>
          <el-button  plain @click="cancelPasswordFn">取消</el-button>
        </div>

      </el-dialog>

    <!-- <el-dialog title="密码重置" :close-on-click-modal="false" :visible.sync="dialogVisible" width="500px" center>
      <el-form ref="resetPassword" :model="userPassword" :rules="userPasswordRules" label-width="100px">
        <el-form-item label="账号" prop="account">{{userPassword.account}}</el-form-item>
        <el-form-item :label="$t('person.lNewPassword')" prop="password">
          <el-input v-model="userPassword.password" type="password"
            :placeholder="$t('person.lNewPassword')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
				<el-button @click="resetSumbit(false)">取 消</el-button>
				<el-button :loading="btnloading" type="primary" @click="resetSumbit(true)">确 定</el-button>
			</span>
    </el-dialog> -->
  </div>
</template>


<script>
//   import http from "../../../utils/http";
//   import {
//     queryPage,  // 查询用户列表
//     createUser, // 新增用户
//     modifyUser, // 编辑用户
//     resetPassword,  // 密码重置
//     switchStatus, // 用户状态切换
//     query,  // 角色模糊查询下拉框
//     queryOrg,  // 机构名称模糊查询下拉框
//   } from '@/config/api/userlist' ;
import { getUserKey} from '@/utils/auth'
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, deptTreeSelect } from "@/api/system/user";
import {listRole, selectRoleAll} from "@/api/system/role";
import { getToken } from "@/utils/auth";
import { userUnitList } from "@/api/system/unit";
  let checkPhoneFn = (rule, value, callback) => {
    if( !/^1[34578]\d{9}$/.test( value ) ){
        callback(new Error('请输入正确的手机号!'));
    } else {
        callback();
    }
  } ;
  export default {
    name: 'User',
    data() {
      return {
        table: [],
        routeObj : null,
        roleloading: false,
        search: {
          pageNum: 1,
          pageSize: 10,
          params: {
            account: null,
            managerName: null,
            roleIds: [],
            teleNo: null,
            userStatus: null,
            orgName : '' // 机构名称
          }
        },
        userPassword: {
          userId: null,
          account: null,
          password: null
        },
        userPasswordRules: {
          password: [{
            trigger: 'blur',
            required: true,
            message: '请输入密码'
          }, {
            trigger: 'blur',
            min: 6,
            max: 20,
            message: '登录密码最长20个字符，最短6个字符'
          }]
        },
        dialogVisible: false,
        btnloading: false,
        // tableurl: '/assigncenter/usermanager/manager/queryPage',
        tableurl: '/assigncenter/accesscontr/manager/queryPage',
        isAdd : true, // 是否是新增
        isAddEdit : false, // 是否打开新增、编辑弹窗
        selectUsers: [], // 选择的列表数据
        tableLoading : false,
        tableData : [],
        loading: true,
        roles: [], // 角色列表
        orgList: [], // 机构名称列表
        filterOrgList:[],  // 新增或编辑的机构名称列表
        currentPage : 1,
        pageSize : 10,
        total : 0,
        filterForm : {
          nickName:'',
          userName : '',
          phonenumber : '',
          roleId : [],
          status : '',
          unitId : '',
        },
        addEditForm : {
          nickName : '',
          userName : '',
          phonenumber : '',
          password : '',
          unitId : '',
          roleIds : [],
        },
        addEditRules : {
          userName: [
              {required: true, message: '请输入账号名称', trigger: 'blur'},
          ],
          nickName: [
              {required: true, message: '请输入用户姓名', trigger: 'blur'},
          ],
          phonenumber: [
              {required: true, message: '请输入手机号', trigger: 'blur'},
              {validator: checkPhoneFn, trigger: 'blur'}
          ],
          password: [
              {required: true, message: '请输入密码8~20位', trigger: 'blur'},
          ],
          unitId: [
              {required: false, message: '请输入关联机构', trigger: 'blur'},
          ],
          roleIds: [
              {required: true, message: '请输入角色', trigger: 'blur'},
          ],
        },
        passwordForm : {
          account : '',
          newPassword : '',
          againPassword : '',
          userId : -1
        },
        passwordFormRules : {
            // account: [
              // {required: true, message: '请输入新密码', trigger: 'blur'},
            // ],
          newPassword: [
              {required: true, message: '请输入新密码', trigger: 'blur'},
              {validator: this.checkNewPasswordFn, trigger: 'blur'}
          ],
          againPassword: [
              {required: true, message: '请再次输入新密码', trigger: 'blur'},
              {validator: this.checkPasswordFn, trigger: 'blur'}
          ],
        },
        User:JSON.parse(getUserKey()) || null,  // 缓存拿取用户信息
        disabled:false,  // 新增编辑关联单位是否禁止操作
        isResetPassword : false, // 是否重置密码
        tempRowObj : null // 临时中转对象
      };
    },
    mounted(){
      this.initFn() ;
    },
    methods: {
      initFn(){
        this.currentPage = 1
        this.resetFeildFn()
        this.queryPageFn() // 请求  查询用户列表
        this.queryFn() ; // 请求  查询角色下拉列表
        this.queryOrgFn() ; // 请求  机构名称模糊查询下拉框
      },

      queryPageFn(){
        let params = {
          nickName : this.filterForm.nickName,
          userName : this.filterForm.userName,
          phonenumber : this.filterForm.phonenumber,
          unitId : this.filterForm.unitId,
          roleIds : this.filterForm.roleId.toString(),
          status : this.filterForm.status,
          pageNum : this.currentPage,
          pageSize : this.pageSize,
        } ;
        this.tableLoading = true ;
        listUser(params)
        .then( d => {
          let { code, rows, msg, total } = d ;
          this.tableLoading = false ;
          if( +code === 200 ){
            this.total = total ;
            this.tableData = rows ;
          } else {
            this.$message({
              message:msg,
              type : 'warning'
            }) ;
          }
        } )
        .catch( err => {
          this.tableLoading = false ;
          console.error( err ) ;
        } ) ;
      },
      createUserFn(){ // 请求 新增用户
        let params = {
          userName:this.addEditForm.userName,
          nickName:this.addEditForm.nickName,
          phonenumber:this.addEditForm.phonenumber,
          password:this.addEditForm.password,
          unitId:this.addEditForm.unitId,
          roleIds:this.addEditForm.roleIds,
        }
        addUser(params).then(res=>{
            this.isAddEdit = false;
            this.$modal.msgSuccess(res.msg);
            this.queryPageFn() ; // 请求  查询用户列表
        })
      },

      modifyUserFn(){ // 请求 编辑用户
        let params = {
          userId : this.tempRowObj.userId,
          userName:this.addEditForm.userName,
          nickName:this.addEditForm.nickName,
          phonenumber:this.addEditForm.phonenumber,
          unitId:this.addEditForm.unitId,
          roleIds:this.addEditForm.roleIds,
        }
        updateUser(params).then(res=>{
            this.isAddEdit = false;
            this.$modal.msgSuccess(res.msg);
            this.queryPageFn() ; // 请求  查询用户列表
        })
      },
        //角色下拉选项
      queryFn(){
        selectRoleAll( {pageNum: 1,pageSize: 200,})
        .then( d => {
          let { code, data, msg } = d ;
          if( +code === 200 ){
            this.roles = data ;
          } else {
            this.$message({
              message:msg,
              type : 'warning'
            }) ;
          }
        } )
        .catch( err => {

        } ) ;
      },

      queryOrgFn(){
        let data = {
          pageNum: 1,
          pageSize: 200,
          unitName:'',
          unitStatus:'',
        }
        userUnitList(data,0).then(res=>{
          let { rows} = res
          this.orgList = rows
          this.filterOrgList = this.orgList.filter(item=>item.unitStatus == '0')
        })
      },
      // TODO 新增或编辑中的关联机构列表
      // queryFilterOrgFn(){
      //   let params = {
      //     organizationName : '',
      //     status:1
      //   } ;

      //   queryOrg( { params } )
      //   .then( d => {
      //     let { code, data, message } = d ;

      //     if( +code === 10000 ){
      //       this.filterOrgList = data ;
      //     } else {
      //       this.$message({
      //         message,
      //         type : 'warning'
      //       }) ;
      //     }
      //   } )
      //   .catch( err => {
      //   } ) ;
      // },
      resetPasswordFn(){
        // let params = {
        //   password : this.passwordForm.newPassword,
        //   userId : this.passwordForm.userId
        // } ;
        resetUserPwd( this.passwordForm.userId, this.passwordForm.newPassword)
        .then( d => {
          let { code, data, msg } = d ;
          this.$message({
            message:msg,
            type : +code === 200 ? 'success' : 'warning'
          }) ;
        } )
        .catch( err => {
        } ) ;
      },
      changeStatusFn(v){
        this.switchStatusFn(v) ;
      },
      switchStatusFn(v){
        let params = {
          userIds:this.selectUsers.map( v => v.userId ),
          userStatus: v
        }
        changeUserStatus(params).then(res=>{
          this.$message.success(res.msg)
          this.queryPageFn()
        })
      },
      resetFeildFn(){
        this.filterForm = {
          nickName : '',
          userName:'',
          phonenumber : '',
          roleId : [],
          status : '',
          unitId : '',
        } ;
        this.addEditForm = {
          nickName : '',
          userName : '',
          phonenumber : '',
          password : '',
          org : '',
          roles : [],
        } ;

        this.passwordForm = {
          account : '',
          newPassword : '',
          againPassword : '',
          userId : -1
        } ;
        this.$refs['addEditForm'] && this.$refs['addEditForm'].resetFields();
        this.$refs['passwordForm'] && this.$refs['passwordForm'].resetFields();
        this.$refs['filterForm'] && this.$refs['filterForm'].resetFields();
      },
      sendAddEditFn( formName ){
        this.$refs[ formName ].validate((valid) => {
          if (valid) {
            if( this.isAdd ){ // 如果是新增
              // 调用新增接口
              this.createUserFn() ;
            } else { // 如果是编辑
              // 调用编辑接口
              this.modifyUserFn() ;
            }
          } else {
            return false;
          }
        });
        // this.$refs[formName].resetFields();
      },
      cancelAddEditFn(){
        this.isAddEdit = false ;
      },
      sendPasswordFn( formName ){
        this.$refs[ formName ].validate((valid) => {
          if (valid) {
            this.isResetPassword = false ;
            // 调用修改密码接口
            this.resetPasswordFn() ; // 请求 修改密码接口
          } else {
            return false;
          }
        });
        // this.$refs[formName].resetFields();
      },
      cancelPasswordFn(){
        this.isResetPassword = false ;
      },

      addFn(){ // 新增
        this.isAdd = true ;
        this.isAddEdit = true ; // 打开弹窗
        // this.queryFilterOrgFn()  // 关联结构
        this.$refs['addEditForm'] && this.$refs['addEditForm'].resetFields();
        if(this.User && this.User.unitId){
          this.disabled = true
          this.addEditForm.unitId = this.filterOrgList[0].unitId
        }else {
          this.disabled = false
        }
      },

      editFn( row ){ // 编辑
        this.isAdd = false ;
        this.isAddEdit = true ; // 打开弹窗
        // this.queryFilterOrgFn() // 关联结构
        this.$refs['addEditForm'] && this.$refs['addEditForm'].resetFields();
        this.tempRowObj = row ;
        // this.$nextTick(()=>{
          getUser(row.userId).then(res=>{
              this.addEditForm = {
                  userName : res.data.userName,
                  nickName : res.data.nickName,
                  phonenumber : res.data.phonenumber,
                  password : '',
                  roleIds : res.data.roles.map( v => v.roleId ),
                }
              if(this.User && this.User.unitId){
                  this.disabled = true
                  this.addEditForm.unitId = res.data.unitId?res.data.unitId:this.filterOrgList[0].unitId
              } else {
                  this.disabled = false
                  this.addEditForm.unitId = res.data.unitId
              } 
          })

        // })
      },

      resetFn( row ){
        this.isResetPassword = true ;
        this.passwordForm = {
          account : '',
          newPassword : '',
          againPassword : '',
          userId : -1
        } ;
        this.$refs['passwordForm'] && this.$refs['passwordForm'].resetFields();
        this.$nextTick( () => {
          this.passwordForm.account = row.userName;
          this.passwordForm.userId = row.userId ;
          this.passwordForm.newPassword = '' ;
          this.passwordForm.againPassword = '' ;
        });
      },
      checkPasswordFn(rule, value, callback) {
        if( value.length < 8 ){
          callback(new Error('密码8~20位!'));
        } else if (value !== this.passwordForm.newPassword) {
            value = '' ;
            callback(new Error('两次输入密码不一致!'));
        } else {
            callback();
        }
      },
      checkNewPasswordFn(rule, value, callback) {
        if( value.length < 8 ){
          callback(new Error('密码8~20位!'));
        } else {
          callback();
        }
      },
    //   remoteRoles(val) {
    //     this.roleloading = true;
    //     http.post('/assigncenter/accesscontr/role/query', {
    //       time: Date.now(),
    //       params: {
    //         roleName: val
    //       }
    //     }).then(res => {
    //       if (res.code === '10000') {
    //         this.roles = res.data;
    //       }
    //     }).finally(() => {
    //       this.roleloading = false;
    //     });
    //   },
      // switchStatus(status) {
      //   let statusName = status === 1 ? '启用' : '停用';
      //   if (!this.selectUsers.length) {
      //     this.$message.warning(`请选择需要${statusName}的用户`);
      //     return;
      //   }
      //   if (this.selectUsers.some(row => row.userStatus === status)) {
      //     this.$message.warning(`选择的用户中存在已经${statusName}的用户`);
      //     return;
      //   }
      //   this.$confirm(`是否${statusName}选中的用户？`, '确认', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     http.post('/assigncenter/accesscontr/manager/switchStatus', {
      //       time: Date.now(),
      //       params: {
      //         status: status,
      //         userIds: this.selectUsers.map(row => row.userId)
      //       }
      //     }).then(res => {
      //       if (res.code === '10000') {
      //         this.$message.success(res.message);
      //         this.listQuery();
      //       } else {
      //         this.$message.error(res.message);
      //       }
      //     });
      //   });
      // },
      selectionChange(selection) {
        this.selectUsers = selection;
      },
      searchFn(){
        this.currentPage = 1 ;
        this.queryPageFn() ; // 请求  查询用户列表
      },
    }
  }
</script>

<style lang="scss" scoped>
  .asc-page {
    margin: 25px 0;
    text-align: center;
  }

  .el-tag {
    margin-right: 5px;
  }



  .el-table ::deep {
    .el-table-column--selection .cell {
      text-align: center;
    }
  }
</style>
