<template>
    <div class="app-container">
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
            <el-row>
                <el-col :span="24">
                    <el-form-item label="菜单" prop="menuIds">
                        <tree-transfer 
                            :title="title"  
                            :placeholder ='placeholder'             
                            :from_data='fromData'         
                            :to_data='toData'             
                            :defaultProps="{label:'label',children: 'children'}" 
                            pid='parentId'
                            @addBtn='add'                 
                            @removeBtn='remove'            
                            :mode='mode'                 
                            height='480px'           
                            filter              
                            openAll>              
                        </tree-transfer>
                        <!-- 标题 类型：Array 必填：false 默认：["源列表", "目标列表"]
                        搜索提示语
                        源数据 类型：Array 必填：true 补充：数据格式同element-ui tree组件，但必须有id和pid
                        目标数据 类型：Array 必填：true 补充：数据格式同element-ui tree组件，但必须有id和pid
                        配置项-同el-tree中props 必填： false 补充：用法和el-tree的props一样
                        点击添加按钮时触发的事件 回调参数：function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
                        点击移除按钮时触发的事件 回调参数：function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
                        设置模式，字段可选值为transfer|addressList 类型：String 必填：false 补充：mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人
                        高度 类型：String 必填：false 默认：100%
                        高度 类型：String 必填：false 默认：320px
                        是否开启筛选功能 类型：Boolean 必填：false
                        *****自定义搜索方法******
                        是否默认展开全部 类型：Boolean 必填：false -->
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
import treeTransfer from 'el-tree-transfer' 
import {  addRole, updateRole,getRole } from "@/api/system/role";
import { listMenu,roleMenuTreeselect,treeselect } from "@/api/system/menu";
    export default {
        name:'roleEdit',
        components:{ treeTransfer },
        props: {
            // el-tree node-key 必须唯一
            node_key: {
                type: String,
                default: "id"
            },
            // 自定义 pid参数名，因为后端给的参数名为parentId
            pid: {
                type: String,
                default: "parentId"
            },
        },
        data(){
            return{
                type:'add', // 'add'新增，不需要过滤数据 'edit'/ 编辑 需要过滤数据 （左侧需要过滤掉右侧的数据） 'detail'过滤数据并禁止表单
                formmodel: {
                    roleId: this.$route.query.roleId? this.$route.query.roleId : '',
                    roleName:'',
                    roleKey:'', // 权限校验
                    remark: '',
                    menuIds:[],  // 右侧菜单树的id集合
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
                title: ["待选菜单","已选菜单"],    //标题 类型：Array 必填：false 默认：["源列表", "目标列表"] 已隐藏
                placeholder:'请输入关键字',
                mode: "transfer", //设置模式，字段可选值为transfer|addressList 类型：String 必填：false 补充：mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人
                formloading: false,
                sumbitloading: false,
                disabled:false, // 是否禁止
                roleId:'', // 角色id
                menu:[], //
                temData:[], // 临时数据(存放全部树数据)
                checkedKeys:[], //已勾选的id数组（右侧树的id数组）
                props: {
                    label: 'label',
                    pid:'parentId',
                    id:'id',
                    children: 'children'
                },
                nodeKey: 'id',
                arrlist:[],
                isAdd:this.$route.query.isAdd
            }
        },
        async mounted(){
            this.init()
        },
        methods:{
            async init(){
                this.formloading = true
                if(this.isAdd  == 'add'){
                    this.type = 'add'
                    this.disabled = false
                    await this.getList()
                }else {
                    if(this.isAdd  == 'edit'){
                        this.type = 'edit'
                        this.disabled = false
                    }else{
                        this.type = 'detail'
                        this.disabled = true
                    }
                    await this.getDetail()
                    await this.getList()
                    await this.getRoleMenuTreeselect(this.formmodel.roleId)  
                    let keymap = {};
                    this.checkedKeys.forEach(key => {
                        keymap[key] = true;
                    });
                    if(this.type = 'detail' && this.formmodel.roleId == 1){
                        this.fromData = []
                        this.toData = this.menu    
                    } else {
                        let menuData = this.dealdata(this.temData,keymap)
                        this.fromData = menuData.excluded
                        this.toData = menuData.included 
                    }
                }
                this.formloading = false
            },
            getDetail(){
                getRole(this.formmodel.roleId).then(res => {
                    this.formmodel.roleName = res.data.roleName
                    this.formmodel.roleKey = res.data.roleKey
                    this.formmodel.remark = res.data.remark
                })
            },
            dealdata(data,keymap){
                let included = [], excluded = [];
                data.forEach(node => {
                let children = node[this.props.children];
                if (Array.isArray(children) && children.length) {
                    let result = this.dealdata(children, keymap);
                    result.included.length > 0 && included.push({
                    [this.nodeKey]: node[this.nodeKey],
                    [this.props.label]: node[this.props.label],
                    [this.props.id]: node[this.props.id],
                    [this.props.pid]: node[this.props.pid],
                    [this.props.children]: result.included
                    });
                    result.excluded.length > 0 && excluded.push({
                    [this.nodeKey]: node[this.nodeKey],
                    [this.props.label]: node[this.props.label],
                    [this.props.id]: node[this.props.id],
                    [this.props.pid]: node[this.props.pid],
                    [this.props.children]: result.excluded
                    });
                } else {
                    keymap[node[this.nodeKey]] ? included.push({
                    [this.nodeKey]: node[this.nodeKey],
                    [this.props.pid]: node[this.props.pid],
                    [this.props.id]: node[this.props.id],
                    [this.props.label]: node[this.props.label]
                    }) : excluded.push({
                    [this.nodeKey]: node[this.nodeKey],
                    [this.props.pid]: node[this.props.pid],
                    [this.props.id]: node[this.props.id],
                    [this.props.label]: node[this.props.label]
                    });
                }
                });
                return {included, excluded};
            },
            // 监听穿梭框组件添加
            add(fromData,toData,obj){
                // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
                // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
                console.log("fromData:", fromData);
                console.log("toData:", toData);
                console.log("obj:", obj);
            },
            // 监听穿梭框组件移除
            remove(fromData,toData,obj){
                // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
                // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
                console.log("fromData:", fromData);
                console.log("toData:", toData);
                console.log("obj:", obj);
            },
            // 右侧目标数据勾选事件
            rightCheck(nodeObj, treeObj, checkAll){
                console.log(nodeObj,'nodeObj');
                console.log(treeObj,'treeObj');
                console.log(checkAll,'checkAll');
            },
            // resetFormFn(){
            //     this.formmodel = {
            //         roleId: '',
            //         roleName: '',
            //         remark: '',
            //         menuIds: [],
            //     } ;
            // },
            /** 查询菜单列表 */
            async getList() {
                treeselect().then(response => {
                    this.menu = response.data
                    if(this.menu && this.menu.length){
                        if(this.type == 'add'){ // 新增时左侧展示全部菜单树，右侧菜单为空
                            this.fromData = this.menu;  // 
                            this.toData = []
                        } else {
                            /**
                             * 编辑时，根据返回的右侧id过滤出左侧的数据，
                             * 要注意菜单下子菜单全部移到右侧，父菜单左侧就不再展示，子菜单一部分移到右侧，父菜单左右都要展示（难点）
                             */
                            // 全部树数据
                            // 获取到左侧树数据(根据全部树数据去掉右侧树数据) tips 注意 （子菜单全部移到右侧，若子菜单只移动一部分到右侧，父菜单左右都要展示）

                                this.temData = this.menu;
                                this.fromData = [],
                                this.toData = []    
                        } 
                    }
                });
            },
            /** 根据角色ID查询菜单树结构 */
            getRoleMenuTreeselect(roleId) {
                return roleMenuTreeselect(roleId).then(response => {
                    this.checkedKeys = response.checkedKeys;
                });
            },
              // 根据已选择页面的权限 递归处理数据
            //data 所有的树形数据  selData 已选择的树形数据
                // dealTree (data, selData) {
                // for (let i = data.length - 1; i >= 0; i--) {
                //     for (let j = selData.length - 1; j >= 0; j--) {
                //     if (data[i] && (data[i].id === selData[j].id)) {
                //         // 当id相等可以删除的情况 即：没有子级可以删除；
                //         if (!data[i].children && !selData[j].children) {
                //         data.splice(i, 1)
                //         } else {
                //         this.dealTree(data[i].children, selData[j].children)
                //         }
                //     }
                //     }
                // }
                // },
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
                        if(this.type == 'add'){
                            addRole(this.formmodel).then(res=>{
                                console.log(res);
                                this.sumbitloading = false
                                this.$message.success(res.msg)
                                this.$store.dispatch("tagsView/delView", this.$route);
                                this.$router.replace({ path: "/system/role" }); // 关闭之后要返回的页面  会自动刷新
                            }) 
                        } else {
                            updateRole(this.formmodel).then(res=>{
                                console.log(res);
                                this.sumbitloading = false
                                this.$message.success(res.msg)
                                this.$store.dispatch("tagsView/delView", this.$route);
                                this.$router.replace({ path: "/system/role" }); // 关闭之后要返回的页面  会自动刷新
                            })
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
.tree-box .wl-transfer .transfer-title{
    display: none;
}
.tree-box .wl-transfer .transfer-main {
    height: 100%;
}
.tree-box{
    width: 800px;
}
</style>