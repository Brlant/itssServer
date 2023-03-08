<template>
    <div class="app-container" >
        <el-form  ref="roleform" v-loading="formloading" label-width="120px" :inline="false" :model="formmodel"
        :rules="formrules" class="tree-box" :disabled="disabled" >
            <el-row>
                <el-col :span="24">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="formmodel.roleName" maxlength="128"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="角色权限" prop="roleKey">
                        <el-input v-model="formmodel.roleKey" maxlength="128"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="$store.state.user.user.userId == 1">
              <el-col :span="24">
                <el-form-item label="所属机构" prop="orgIdList"
                  :rules="[{ required: true, message: '请选择所属机构', trigger: 'change' }]"
                >
                  <el-cascader
                    v-model="formmodel.orgIdList"
                    :options="orgList"
                    ref="org"
                    :props="{ label: 'name', value: 'id', checkStrictly: true }"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="菜单" prop="menuIds">
                        <menuTree  :fromData="fromData" :toData="toData" @getRightData="getRightData"></menuTree>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="角色说明" prop="remark">
                        <el-input v-model="formmodel.remark" :rows="3" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label=" " style="margin: 25px 275px 25px 0;">
                        <el-button :loading="sumbitloading" type="primary" @click="formSumbit">保存</el-button>
                        <el-button class="cancel-btn" @click="cancelFn">取消</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import menuTree from './components/menuTree.vue'
import {  addRole } from "@/api/system/role";
import { treeselect } from "@/api/system/menu"
import { reqList } from '@/api/OrgManage/OrgManage.js' ;
    export default {
        name:'roleAdd',
        components:{ menuTree },
        data(){
            return{
                formmodel: {
                    roleId: this.$route.query.roleId? this.$route.query.roleId : '',
                    roleName:'',
                    roleKey:'', // 权限校验
                    remark: '',
                    menuIds:[],  // 右侧菜单树的id集合
                    orgIdList:[], // 所属机构
                },
                fromData:[    //源数据 类型：Array 必填：true 补充：数据格式同element-ui tree组件，但必须有id和pid
                        // {
                        //     id: "1", // id唯一且必须
                        //     parentId: 0,    //自定义pid的参数名，默认为"pid" 必填：false
                        //     menuName: "一级 1",
                        //     children: [
                        //         {
                        //             id: "1-1",
                        //             parentId: "1",
                        //             menuName: "二级 1-1",
                        //             // disabled: true,
                        //         },
                        //     ]
                        // },
                    ],
                toData:[],
                formrules: {
                    roleName: [{
                        required: true,
                        trigger: 'blur',
                        message: '角色名称不能为空'
                    }],
                    roleKey: [{
                        required: true,
                        trigger: 'blur',
                        message: '角色权限不能为空'
                    }]
                },
                formloading: false,
                sumbitloading: false,
                disabled:false, // 是否禁止
                roleId:'', // 角色id
                menu:[], //
                temData:[], // 临时数据(存放全部树数据)
                checkedKeys:[], //已勾选的id数组（右侧树的id数组）
                receiveData:[], //接受子组件的右侧树形数据
                orgList:[], // 机构列表
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
            // 初始化数据
            getList() {
                this.formloading = true
                treeselect().then(response => {
                    this.formloading = false
                    this.menu = response.data
                    if(this.menu && this.menu.length){
                            this.fromData = this.menu;  //
                            this.toData = []
                    }
                });

                if(this.$store.state.user.user.userId == 1){
                    let reqObj = {} ;
                    reqObj.headers = {
                      userId : 1,
                      parentId : 0
                    } ;
                    reqList(reqObj).then(res=>{
                      this.orgList = res.data
                    })
                }

            },
            getRightData(val){
                console.log(JSON.stringify(val));
                this.receiveData = val
            },
            recursive(data){
                    data.forEach(item=>{
                        this.formmodel.menuIds.push(item.id)
                        if(item.children && item.children.length){
                           this.recursive(item.children)
                        }
                })
            },
            // 保存
            formSumbit() { //
                // 提交时，需要把右边树的所有id提取出来放进一个数组内传给后端
                // this.sumbitloading = true;
                this.$refs.roleform.validate(valid => {
                    if(valid){
                        this.recursive(this.receiveData) // 得到
                        // if(this.type == 'add'){
                      this.sumbitloading = true;
                      let orgId = this.formmodel.orgIdList[this.formmodel.orgIdList.length-1] ?? ''
                      let formmodel = {
                        ...this.formmodel,
                        orgId: orgId
                      }
                      addRole(formmodel).then(res=>{
                                console.log(res);
                                this.sumbitloading = false
                                this.$message.success(res.msg)
                                this.$store.dispatch("tagsView/delView", this.$route);
                                this.$router.replace({ path: "/system/role" }); // 关闭之后要返回的页面  会自动刷新
                            }).catch(()=>{
                              this.sumbitloading = false
                            })
                        // } else {
                        //     updateRole(this.formmodel).then(res=>{
                        //         console.log(res);
                        //         this.sumbitloading = false
                        //         this.$message.success(res.msg)
                        //         this.$store.dispatch("tagsView/delView", this.$route);
                        //         this.$router.replace({ path: "/system/role" }); // 关闭之后要返回的页面  会自动刷新
                        //     })
                        // }
                    }
                })
            },

            // 取消
            cancelFn(){
              this.$confirm(`此操作会重置本页面所有填写的内容!`, "温馨提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                  .then(() => {
                    this.$refs["roleform"].resetFields();
                    this.$store.dispatch("tagsView/delView", this.$route);
                    this.$router.replace({ path: "/system/role" }); // 关闭之后要返回的页面  会自动刷新
                  })
                  .catch(() => {});
            }
        }
    }
</script>

<style lang="scss" scoped>
.tree-box{
    width: 800px;
}
</style>
