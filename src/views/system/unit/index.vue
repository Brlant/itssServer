<template>
    <div class="app-container">
        <div class="plateInfo">
            <el-form :model="filterForm" ref="filterForm"  label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="单位名称" prop="unitName">
                            <el-input v-model="filterForm.unitName" clearable placeholder="请输入单位名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态" prop="unitStatus">
                            <el-select v-model="filterForm.unitStatus" clearable placeholder="请选择状态">
                                <el-option value="0" label="启用"></el-option>
                                <el-option value="1" label="停用"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item class="orgItem">
                            <el-button type="primary" v-hasPermi="['system:unit:list']" @click="searchFn">查询</el-button>
                            <el-button plain @click="resetFeildFn">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <div class="headerBtn">
                <el-button type="primary" v-hasPermi="['system:unit:add']" @click="addFn">新增单位</el-button>
                <el-button type="primary" v-hasPermi="['system:unit:edit']" plain :disabled="selectUsers.length == 0"   @click="changeStatusFn(0)">启用</el-button>
                <el-button type="danger" v-hasPermi="['system:unit:edit']" plain :disabled="selectUsers.length == 0"    @click="changeStatusFn(1)">停用</el-button>
            </div>
            <el-table v-loading="tableLoading" :data="tableData" @selection-change="selectionChange" border>
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="unitName" label="企业名称">
          <template slot-scope="{ row }">
              {{ row.unitName }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="120">
          <template slot-scope="{ row }">
            <span class='enabledStatus' :class="{ error : row.unitStatus != 0 }">{{ row.unitStatus == 0 ? '启用' : '停用' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="用户帐号" width="120">
          <template slot-scope="{ row }">
            <span class='enabledStatus' :class="{ error : row.userStatus != 0 }">{{ row.userStatus == 0 ? '启用' : '停用' }}</span>
          </template>
        </el-table-column>
        
       
         <el-table-column label="创建时间" prop="createTime" width="180">
          <template slot-scope="{ row }">
            {{ row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="{ row }">
            {{ row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="text-success cursor mr20" v-hasPermi="['system:unit:query']" @click="detailFn( scope.row )" >查看</span>
            <span class="text-warning cursor " v-hasPermi="['system:unit:edit']" @click="passFn( scope.row )">开通产品</span>
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
        <!-- 开通产品 -->
        <el-dialog  :close-on-click-modal="false" title="开通产品" class="dialogForm" :visible.sync="isConfig" width="397px">
        <el-form :model="configForm" ref="configForm" :rules="configFormRules" :inline="false" label-width="80px" class="dialogFormInfo">
          <el-row>
            <el-col :span="24">
              <el-form-item label="单位名称" prop="unitName">
                <el-input v-model="configForm.unitName" :disabled='true' clearable placeholder="请输入单位名称"></el-input>
              </el-form-item>
            </el-col>
            
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="开通产品" prop="roleIds">
                <!-- <el-form-item label="角色" prop="roles" > -->
                    <!-- <el-select v-model="configForm.roleIds" multiple  filterable collapse-tags placeholder="请选择角色" remote>
                        <el-option v-for="item in roles" :key="item.roleId" :value="item.roleId" :label="item.roleName"></el-option>
                    </el-select> -->
                <!-- </el-form-item> -->
                <!-- <el-input v-model="configForm.pass" clearable placeholder="请输入secert"></el-input> -->
                <el-checkbox-group v-model="configForm.roleIds"  placeholder="请选择开通产品">
                  <el-checkbox :label="v.roleId" v-for="v in roles" :key="v.roleId" >{{ v.roleName }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>

        <div class="txtAlignC">
          <el-button type="primary" @click="sendSaveFn('configForm')">保存</el-button>
          <el-button  plain @click="cancelPasswordFn">取消</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { listUnit, updateUnit, openProduct, } from "@/api/system/unit";
import { selectRoleAll } from "@/api/system/role";
    export default {
        name:'unit',
        data(){
            return{
                selectUsers: [], // 选择的列表数据
                tableLoading : false,
                tableData : [],
                loading: true,
                roles: [], // 角色列表
                currentPage : 1,
                pageSize : 10,
                total : -1,
                filterForm : {
                    unitName: '',
                    unitStatus : '',
                },
                configForm : {
                    unitName : '',
                    roleIds : [],
                },
                configFormRules : {
                    unitName: [
                        {required: true, message: '请输入企业名称', trigger: 'blur'},
                    ],
                    roleIds: [
                        {required: true, message: '请选择开通产品', trigger: 'change'},
                    ]
                },
                isConfig : false, // 是否重置密码
                tempRowObj : null, // 临时中转对象
            }
        },
        mounted(){
            this.initFn() ;
        },
        methods:{
            initFn(){
                this.currentPage = 1 ;
                this.resetFeildFn() ;
                this.queryPageFn() ; // 请求  查询用户列表
            },
            // 角色下拉
            queryFn(){
                selectRoleAll().then(response => {
                    this.roles = response.data;
                })
            },
            // list 列表
            queryPageFn(){
                let params = { 
                    pageNum:this.currentPage,
                    pageSize : this.pageSize,
                    ...this.filterForm }
                this.tableLoading = true
                listUnit(params).then(res=>{
                    let { rows,total } = res
                    this.tableLoading = false
                    this.tableData = rows
                    this.total = total
                })
            },
            openProductionFn(){
                let params = {
                    unitId : this.tempRowObj.unitId,
                    roleIds : this.configForm.roleIds.toString(),
                } ;
                openProduct(params).then(res=>{
                    console.log(res,'开通产品');
                    let {msg} = res
                    this.$message.success(msg)
                    this.searchFn()
                })
            },
            // 启用 停用
            changeStatusFn(v){
                this.switchStatusFn(v) ;
            },
            switchStatusFn(v){
                let params = {
                    unitStatus:v
                }
                let unitIds = this.selectUsers.map( v => v.unitId ) ;
                params.unitIds  = unitIds.toString()
                updateUnit(params).then(res=>{
                    let {msg} = res
                    this.$message.success(msg)
                    this.searchFn()
                })
            },
            // 重置 列表
            resetFeildFn(){
                this.filterForm = {
                    unitName : '',
                    unitStatus : '',
                } ;
            },
            // 开通产品 保存
            sendSaveFn( formName ){
                this.$refs[ formName ].validate((valid) => {
                    if (valid) {
                        this.isConfig = false ;
                        // 调用开通产品
                        this.openProductionFn() ; // 请求 调用开通产品
                    } else {
                        return false;
                    }
                });
            },
            // 开通产品 取消
            cancelPasswordFn(){
                this.isConfig = false ;
            },
            // 开通产品
            async passFn( row ){
                console.log(row,'row')
                this.isConfig = true ;
                this.$refs['configForm'] && this.$refs['configForm'].resetFields();
                this.configForm.unitName = row.unitName
                this.configForm.roleIds = row.admin.roles.map(item=>item.roleId)
                this.tempRowObj = row
                await this.queryFn()
            },
            selectionChange(selection) {
                this.selectUsers = selection;
            },
            searchFn(){
                this.currentPage = 1 ; 
                this.queryPageFn() ; // 请求  查询用户列表
            },
            // 新增单位
            addFn(){ 
                this.$router.push("/system/unit-auth/unitAdd/")
            },
            // 查看详情
            detailFn(row){
                this.$router.push({ path:'/system/unit-auth/unitDetail', query:{ unitId:row.unitId}})
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>