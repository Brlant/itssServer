<template>
    <div class="app-container" >
        <el-form  ref="roleform" v-loading="formloading"  label-width="120px" :inline="false" :model="formmodel"
        :rules="formrules" class="tree-box" disabled >
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
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import menuTree from './components/menuTree.vue'
import { updateRole,getRole } from "@/api/system/role";
import { roleMenuTreeselect,treeselect } from "@/api/system/menu"
import { reqList } from '@/api/OrgManage/OrgManage.js' ;
import recursion from '@/utils/recursion'

    export default {
        name:'roleDetail',
        components:{ menuTree },
        data(){
            return{
                formmodel: {
                    roleId: this.$route.query.roleId? this.$route.query.roleId : '',
                    roleName:'',
                    roleKey:'', // 权限校验
                    remark: '',
                    menuIds:[],  // 右侧菜单树的id集合
                    orgId:'',
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
                nodeKey: 'id',
                plateObj: {
                    label: 'label',
                    pid:'parentId',
                    id:'id',
                    children: 'children'
                },
                orgList:[], // 机构列表
            }
        },
        mounted(){
            this.init()
        },
        methods:{
            async init(){
                await this.getDetail()
                await this.getList()
            },
            getDetail(){
                getRole(this.formmodel.roleId).then(res => {
                    this.formmodel.roleName = res.data.roleName
                    this.formmodel.roleKey = res.data.roleKey
                    this.formmodel.remark = res.data.remark
                    this.formmodel.orgId = res.data.orgId
                })
            },
            dealdata(data,keymap){
                let included = [], excluded = [];
                data.forEach(node => {
                let children = node[this.plateObj.children];
                if (Array.isArray(children) && children.length) {
                    let result = this.dealdata(children, keymap);
                    result.included.length > 0 && included.push({
                    [this.nodeKey]: node[this.nodeKey],
                    [this.plateObj.label]: node[this.plateObj.label],
                    [this.plateObj.id]: node[this.plateObj.id],
                    [this.plateObj.pid]: node[this.plateObj.pid],
                    [this.plateObj.children]: result.included
                    });
                    result.excluded.length > 0 && excluded.push({
                    [this.nodeKey]: node[this.nodeKey],
                    [this.plateObj.label]: node[this.plateObj.label],
                    [this.plateObj.id]: node[this.plateObj.id],
                    [this.plateObj.pid]: node[this.plateObj.pid],
                    [this.plateObj.children]: result.excluded
                    });
                } else {
                    keymap[node[this.nodeKey]] ? included.push({
                    [this.nodeKey]: node[this.nodeKey],
                    [this.plateObj.pid]: node[this.plateObj.pid],
                    [this.plateObj.id]: node[this.plateObj.id],
                    [this.plateObj.label]: node[this.plateObj.label]
                    }) : excluded.push({
                    [this.nodeKey]: node[this.nodeKey],
                    [this.plateObj.pid]: node[this.plateObj.pid],
                    [this.plateObj.id]: node[this.plateObj.id],
                    [this.plateObj.label]: node[this.plateObj.label]
                    });
                }
                });
                return {included, excluded};
            },
            /** 查询菜单列表 */
            getList() {
                this.formloading = true
                treeselect().then(response => {
                    this.menu = response.data
                    if(this.menu && this.menu.length){
                        /**
                         * 编辑时，根据返回的右侧id过滤出左侧的数据，
                         * 要注意菜单下子菜单全部移到右侧，父菜单左侧就不再展示，子菜单一部分移到右侧，父菜单左右都要展示（难点）
                         */
                         // 全部树数据
                        // 获取到左侧树数据(根据全部树数据去掉右侧树数据) tips 注意 （子菜单全部移到右侧，若子菜单只移动一部分到右侧，父菜单左右都要展示）
                        this.temData = this.menu;
                        this.getRoleMenuTreeselect(this.formmodel.roleId)
                    }
                });

                if (this.formmodel.orgId) {
                    // 查询机构数据
                    let reqObj = {} ;
                    reqObj.headers = {
                      userId : 1,
                      parentId : 0
                    } ;
                    reqList(reqObj).then(res=>{
                      this.orgList = res.data
                      this.formmodel.orgIdList = recursion(this.orgList, this.formmodel.orgId)
                    })
                }
            },
            /** 根据角色ID查询菜单树结构 */
            getRoleMenuTreeselect(roleId) {
                roleMenuTreeselect(roleId).then(response => {
                    this.formloading = false
                    this.checkedKeys = response.checkedKeys;
                    let keymap = {};
                    response.checkedKeys.forEach(key => {
                        keymap[key] = true;
                    });
                    if(this.formmodel.roleId == 1){  // 超管(特别处理)
                        this.fromData = []
                        this.toData = this.menu
                    } else {
                        let menuData = this.dealdata(this.temData,keymap)
                        this.fromData = menuData.excluded
                        this.toData = menuData.included
                    }
                });
            },
            getRightData(val){
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
                this.sumbitloading = true;
                this.$refs.roleform.validate(valid => {
                    if(valid){
                        this.recursive(this.toData) // 得到
                        updateRole(this.formmodel).then(res=>{
                            this.sumbitloading = false
                            this.$message.success(res.msg)
                            this.$store.dispatch("tagsView/delView", this.$route);
                            this.$router.replace({ path: "/system/role" }); // 关闭之后要返回的页面  会自动刷新
                        })
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
.tree-box{
    width: 800px;
}
</style>
