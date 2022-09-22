<template>
    <div class="app-container">
        <div class="plateInfo">
            <el-form :model="filterForm" ref="filterForm" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="规则名称" prop="controlRuleName">
                            <el-input v-model="filterForm.controlRuleName"  placeholder="请输入规则名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态" prop="ruleState">
                            <el-select v-model="filterForm.ruleState"  placeholder="请选择状态">
                                <el-option v-for="(item,index) of stateList" :key="index" :value="item.value" :label="item.label">{{item.label}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item class="orgItem">
                            <!-- <el-button v-if="buttonIcon('查询')" type="primary" @click="listQuery()">查询</el-button> -->
                            <el-button type="primary" v-hasPermi="['control:rule:list']" @click="searchFn">查询</el-button>
                            <el-button  plain @click="resetFeildFn">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <div class="headerBtn">
                <el-button type="primary" v-hasPermi="['control:rule:add']"  @click="addFn">新增</el-button>
            </div>
           <el-table v-loading="tableLoading" :data="tableData" @selection-change="selectionChange" border>
                <el-table-column type="selection" width="50"/>
                <el-table-column prop="controlRuleCode" label="规则编码">
                    <template slot-scope="{ row }">
                        {{ row.controlRuleCode }}
                    </template>
                </el-table-column>
                <el-table-column label="规则名称" prop="controlRuleName">
                    <template slot-scope="{ row }">
                        {{ row.controlRuleName }}
                    </template>
                </el-table-column>
                <el-table-column label="最后更新时间" prop="lastUpdateTime">
                    <template slot-scope="{ row }">
                        {{ row.lastUpdateTime }}
                    </template>
                </el-table-column>
                <el-table-column label="最后更新人" prop="lastUpdateBy">
                    <template slot-scope="{ row }">
                        {{ row.lastUpdateBy }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="ruleState">
                    <template slot-scope="scope">
                        <span class='enabledStatus' :class="scope.row.ruleState == 0? 'error': scope.row.ruleState == 2?'warn':''">{{ scope.row.ruleState == 0 ? '停用' : scope.row.ruleState == 2?'待审核':'启用' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.ruleState == 2">
                            <span class="text-primary cursor"  v-hasPermi="['control:rule:query']" style="margin-right:20px" @click="checkDetail( scope.row )" >查看详情</span>
                            <span class="text-warning cursor" v-hasPermi="['control:rule:audit']"  @click="audit(scope.row)" >审核</span>
                        </div>
                        <div v-if="scope.row.ruleState == 1">
                            <span class="text-primary cursor" v-hasPermi="['control:rule:query']"  style="margin-right:20px" @click="checkDetail( scope.row )" >查看详情</span>
                            <span class="text-danger cursor" v-hasPermi="['control:rule:disable']"  @click="disable(scope.row)" >禁用</span>
                        </div>
                        <div v-if="scope.row.ruleState == 0">
                            <span class="text-primary cursor" v-hasPermi="['control:rule:query']"  style="margin-right:20px" @click="checkDetail( scope.row )" >查看详情</span>
                            <span class="text-danger cursor" v-hasPermi="['control:rule:edit']"  @click="edit(scope.row)" >编辑</span>
                        </div>
                        
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
        <el-dialog title="规则设置"  :close-on-click-modal="false" :visible.sync="isShowEdit" width="800px" @closed="handleClosed">
            <div class="diaItem">
                <el-form :model="ruleForm" ref="ruleForm" :rules="ruleRules" label-width="110px" label-position="right">
                    <el-form-item label="规则名称" prop="controlRuleName" >
                        <el-input v-model="ruleForm.controlRuleName"  placeholder="请输入规则名称" maxlength="30" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="承运商名称" prop="carrierId" >
                        <!-- <el-input v-model="ruleForm.carrierId"  placeholder="请输入承运商名称"></el-input> -->
                        <!-- <el-select v-model="ruleForm.carrierId" placeholder="请选择">
                            <el-option v-for="item in carrierList" :key="item.carrierId" :label="item.carrierName" :value="item.carrierId">
                            </el-option>
                        </el-select> -->
                        <!-- <el-form-item label="承运商名称" prop="carrierId" label-width="150px" v-if="modelForm.carryType === 0"> -->
                            <el-select v-model="ruleForm.carrierId"
                                        :clearable="true"
                                        :remote-method="queryCarrierList"
                                        filterable
                                        :loading="loading"
                                        placeholder="请输入名称搜承运商名称"
                                        remote>
                                <el-option v-for="org in carrierList" :key="org.carrierId" :label="org.carrierName" :value="org.carrierId"></el-option>
                            </el-select>
                        <!-- </el-form-item> -->
                    </el-form-item>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="优先级" prop="priority" >
                                <el-input-number v-model="ruleForm.priority"  :min="1" :max="20" label="描述文字"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <div style="color:#EC5D5D">*数字越小，优先级越高，系统将根据优先级判断调度规则，每单仅适用一种规则</div>
                        </el-col>
                    </el-row>
                    <el-form-item label="规则生效时间" prop="timeLimit">
                        <!-- <el-input v-model="ruleForm.name"  placeholder="请输入规则生效时间"></el-input> -->
                        <el-date-picker v-model="ruleForm.timeLimit" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"  range-separator="~" start-placeholder="" end-placeholder=""></el-date-picker>
                    </el-form-item>
                    <el-form-item label="限定收货省份" prop="limitProvince">
                        <!-- <el-input v-model="ruleForm.province"  placeholder="请输入规则生效时间"></el-input> -->
                        <el-select v-model="ruleForm.limitProvince" multiple placeholder="请选择">
                            <el-option
                                v-for="item in provinceList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="限定收货城市" prop="limitCity">
                        <!-- <el-input v-model="ruleForm.city"  placeholder="请输入规则生效时间"></el-input> -->
                        <el-select v-model="ruleForm.limitCity" multiple placeholder="请选择">
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="限定收货地区" prop="limitRegion">
                        <!-- <el-input v-model="ruleForm.area"  placeholder="请输入规则生效时间"></el-input> -->
                        <el-select v-model="ruleForm.limitRegion" multiple placeholder="请选择">
                            <el-option
                                v-for="item in areaList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="限定货品类型" prop="limitGoodsType">
                        <el-select v-model="ruleForm.limitGoodsType" multiple placeholder="请选择">
                            <el-option
                                v-for="dict in dict.type.order_goods_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="限定货品名称" prop="limitGoodsName">
                        <el-input v-model="ruleForm.limitGoodsName"  placeholder="请输入限定货品名称" maxlength="50" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item class="txtAlignC" label-width="0">
                        <el-button type="primary" plain  @click="append('ruleForm')">确定</el-button>
                        <el-button  plain   @click="appendCancle">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!-- 详情/审核 -->
        <el-dialog title="规则设置"  :close-on-click-modal="false" :visible.sync="isShowDetail" width="800px" @closed="handleClosed">
            <el-form :model="detailData"  disabled  label-width="110px" label-position="right">
                <el-form-item label="*规则名称" >
                    <div>{{detailData.controlRuleName}}</div>
                </el-form-item>
                <el-form-item label="*承运商名称"  >
                    <div>{{detailData.carrierName}}</div>
                </el-form-item>
                <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="*优先级"  >
                                <!-- <el-input-number v-model="ruleForm.level"  :min="1" :max="10" label="描述文字"></el-input-number> -->
                                <div>{{detailData.priority}}</div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <div style="color:#EC5D5D">*数字越小，优先级越高，系统将根据优先级判断调度规则，每单仅适用一种规则</div>
                        </el-col>
                    </el-row>
                 <el-form-item label="*规则生效时间" >
                        <!-- <el-input v-model="ruleForm.name"  placeholder="请输入规则生效时间"></el-input> -->
                        <el-date-picker disabled v-model="detailData.timeLimit" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="~"></el-date-picker>
                    </el-form-item>
                <el-form-item label="限定收货省份" >
                        <!-- <el-input v-model="ruleForm.city"  placeholder="请输入规则生效时间"></el-input> -->
                        <el-select v-model="detailData.limitProvince" multiple placeholder="">
                            <el-option
                                v-for="item in provinceList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item label="限定收货城市" >
                    <el-select v-model="detailData.limitCity" multiple placeholder="">
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="限定收货地区" >
                    <el-select v-model="detailData.limitRegion" multiple placeholder="">
                            <el-option
                                v-for="item in areaList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="限定货品类型" >
                        <el-select v-model="detailData.limitGoodsType" multiple placeholder="">
                            <el-option
                                v-for="dict in dict.type.order_goods_type"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                <el-form-item label="限定货品名称" >
                    <!-- <div>{{detailData.limitGoodsName}}</div> -->
                    <el-input v-model="detailData.limitGoodsName"  ></el-input>
                </el-form-item>
            </el-form>
            <div class="txtAlignC">
                <el-button v-if="isDetail != 'detail'" type="primary" plain  @click="pass">通过</el-button>
                <el-button v-if="isDetail != 'detail'" plain   @click="rejected">驳回</el-button>
                <el-button v-if="isDetail == 'detail'"  plain   @click="back">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import selectdata from '@/utils/selectdata'
import { getCarriers } from "@/api/system/carrier"
import {listRule,addRule,getRule,putRule} from '@/api/schedule/dispatch'
    export default {
        name:'dispatch',
        dicts:['order_goods_type'],
        data(){
            return{
                selectdata,
                total:-1,
                pageSize:10,
                currentPage:1,
                filterForm:{
                    controlRuleName:'',
                    ruleState:'',
                },
                stateList:[
                    {label:'启用',value:1,},
                    {label:'待审核',value:2,},
                    {label:'停用',value:0,},
                ],
                tableData:[],
                tableLoading:false,
                selectList:[],  // 勾选的数据
                isShowEdit:false,
                loading:false,
                ruleForm:{
                    controlRuleName:'',
                    carrierId:'',
                    priority:1,
                    timeLimit:[],
                    ruleUpTime:'',
                    ruleDownTime:'',
                    limitProvince:[],
                    limitCity:[],
                    limitRegion:[],
                    limitGoodsType:[],
                    limitGoodsName:'',
                },
                ruleRules:{
                    controlRuleName:[{ required: true, message: '请输入规则名称', trigger: 'blur' },],
                    carrierId:[{ required: true, message: '请输入承运商名称', trigger: 'blur' },],
                    priority:[{ required: true, message: '请输入优先级', trigger: 'blur' },],
                    timeLimit:[{ required: true, message: '请选择规则生效时间', trigger: 'change' },],
                },
                cityList:[],
                areaList:[],
                carrierList:[],
                // 临时数组
                temArr:[],
                isShowDetail:false,
                isAdd:'add', // add 或者 edit 新增或者编辑
                isDetail:'detail', // detail 或者 audit 详情或者审核
                detailData:{},  // 详情数据
                temControlRuleId:'',//临时的规则id
            }
        },
        watch: {
            // isShowEdit(val){
            //     if(val){
                    
            //         this.$nextTick(function(){
            //             this.ruleForm= {
            //                 controlRuleName:'',
            //                 carrierId:'',
            //                 priority:1,
            //                 timeLimit:[],
            //                 ruleUpTime:'',
            //                 ruleDownTime:'',
            //                 limitProvince:[],
            //                 limitCity:[],
            //                 limitRegion:[],
            //                 limitGoodsType:[],
            //                 limitGoodsName:'',
            //             }
            //             this.$refs.ruleForm.resetFeild()
            //         })
            //     }
            // },
           'ruleForm.limitProvince'(val) {
                if(val){
                    let arr = [] // 市
                    let areaArr = [] // 区
                    for(let i=0; i<val.length;i++){
                      selectdata.areas.map(item=>{
                        if(val[i] == item.value){
                            for(let j=0;j<item.children.length;j++){
                                arr.push({
                                    label:item.children[j].label,
                                    value:item.children[j].value,
                                })
                                item.children[j].children.map(item=>{
                                    areaArr.push({
                                        label:item.label,
                                        value:item.value
                                    })
                                })
                            }
                        }
                      })  
                    }
                    this.cityList = arr
                    this.areaList = areaArr
                    let temCity = this.ruleForm.limitCity.filter(item=>{
                        let flag = false
                        for(let z=0;z< this.cityList.length;z++){
                            flag = this.cityList[z].value == item
                            if(flag){
                                break
                            }
                        }
                        return flag 
                    })
                    this.ruleForm.limitCity = temCity
                    let temArea = this.ruleForm.limitRegion.filter(item=>{
                        let flag = false
                        for(let s=0;s< this.areaList.length;s++){
                            flag = this.areaList[s].value == item
                            if(flag){
                                break
                            }
                        } 
                        return flag 
                    })
                    this.ruleForm.limitRegion = temArea 
                }else{
                    this.ruleForm.limitCity = []
                    this.ruleForm.limitRegion = []
                    this.temArr = []
                    this.cityList = []
                    this.areaList = []
                }
            }
        },
        computed:{
            provinceList(){
                let arr = []
                selectdata.areas.map(item => { 
                    arr.push({
                        label:item.label,
                        value:item.value
                    })
                })
                return arr
            }
        },
        mounted(){
            this.searchFn()
        },
        methods:{
            // 列表接口
            queryPageFn(){
                this.tableLoading = true
                listRule(this.filterForm).then(res=>{
                    let {code , msg, rows, total} = res
                    this.tableData = rows
                    this.total = total
                    this.tableLoading = false
                })
            },
            // 搜索
            searchFn(){
                this.currentPage = 1
                this.queryPageFn()
            },
            // 重置
            resetFeildFn(){
                this.filterForm={
                    controlRuleName:'',
                    ruleState:'',
                }
            },
            addFn(){
                this.isAdd = 'add',
                this.isShowEdit = true
                this.$nextTick(()=>{
                    // this.ruleForm.timeLimit = []
                    this.ruleForm= {
                        controlRuleName:'',
                        carrierId:'',
                        priority:1,
                        timeLimit:[], 
                        ruleUpTime:'',
                        ruleDownTime:'',
                        limitProvince:[],
                        limitCity:[],
                        limitRegion:[],
                        limitGoodsType:[],
                        limitGoodsName:'',
                    }
                    this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
                    // this.$refs.ruleForm.resetFeild()
                })
                
            },
            // 详情
            checkDetail(row){
                this.isDetail = 'detail'
                this.isShowDetail = true
                this.temControlRuleId = row.controlRuleId
                getRule(row.controlRuleId).then(res=>{
                    let {code,data,msg} = res
                    if(+code == 200){
                        this.$nextTick(()=>{
                            this.dealData(data)
                        })
                    }else{
                        this.$message.warning(msg)
                    }
                })
            },
            dealData(data){
                this.detailData.limitProvince = data.limitProvince?data.limitProvince.split(','):''
                            let arr = [] // 市
                            let areaArr = [] // 区
                            // 重新获取市区，用新增数据会有问题
                            if(data.limitProvince && data.limitProvince !=''){
                                for(let i=0; i<this.detailData.limitProvince.length;i++){
                                    selectdata.areas.map(item=>{
                                        if(this.detailData.limitProvince[i] == item.value){
                                            for(let j=0;j<item.children.length;j++){
                                                arr.push({
                                                    label:item.children[j].label,
                                                    value:item.children[j].value,
                                                })
                                                item.children[j].children.map(item=>{
                                                    areaArr.push({
                                                        label:item.label,
                                                        value:item.value
                                                    })
                                                })
                                            }
                                        }
                                    })  
                                }
                            }
                            this.cityList = arr
                            this.areaList = areaArr
                            this.detailData.controlRuleCode = data.controlRuleCode
                            this.detailData.controlRuleName = data.controlRuleName
                            this.detailData.carrierId = data.carrierId
                            this.detailData.carrierName = data.carrierName
                            this.detailData.priority = data.priority
                            this.detailData.timeLimit = [data.ruleUpTime,data.ruleDownTime]
                            this.detailData.limitCity = data.limitCity?data.limitCity.split(','):''
                            this.detailData.limitRegion = data.limitRegion?data.limitRegion.split(','):''
                            this.detailData.limitGoodsType = data.limitGoodsType?data.limitGoodsType.split(','):''
                            this.detailData.limitGoodsName = data.limitGoodsName
            },
            // 审核
            audit(row){
                this.isShowDetail = true
                this.isDetail = 'audit'
                this.temControlRuleId = row.controlRuleId
                getRule(row.controlRuleId).then(res=>{
                    let {code,data,msg} = res
                    if(+code == 200){
                        this.$nextTick(()=>{
                            this.dealData(data)
                        })
                    }else{
                        this.$message.warning(msg)
                    }
                })
            },
            // 编辑
            edit(row){
                this.isAdd = 'edit',
                this.isShowEdit = true 
                this.temControlRuleId = row.controlRuleId
                this.$nextTick(()=>{
                    // this.$refs.ruleForm.resetFeild()
                    this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields();
                    getRule(row.controlRuleId).then(res=>{
                        let {code,data,msg} = res
                        if(+code == 200){
                                this.ruleForm.controlRuleName = data.controlRuleName
                                this.ruleForm.carrierId = data.carrierId
                                this.ruleForm.priority = data.priority
                                this.ruleForm.timeLimit = [data.ruleUpTime,data.ruleDownTime]
                                this.ruleForm.limitProvince = data.limitProvince?data.limitProvince.split(','):''
                                this.ruleForm.limitCity = data.limitCity?data.limitCity.split(','):''
                                this.ruleForm.limitRegion = data.limitRegion?data.limitRegion.split(','):''
                                this.ruleForm.limitGoodsType = data.limitGoodsType?data.limitGoodsType.split(','):''
                                this.ruleForm.limitGoodsName = data.limitGoodsName
                        } else {
                            this.$message.warning(msg)
                        }
                    })
                })
                
            },
            // 禁用
            disable(row){
                this.$confirm('确定要禁用吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(res=>{
                    let params = {
                        controlRuleId:row.controlRuleId,
                        ruleState:0
                    }
                    putRule(params).then(res=>{
                        let {code,msg} = res
                        if(+code==200){
                            this.$message.success(msg)
                            this.searchFn()
                        }else{
                            this.$message.warning(msg)
                        }
                    })
                })
            },
            // 通过
            pass(){
                let params = {
                    controlRuleId:this.temControlRuleId,
                    ruleState:1
                }
                putRule(params).then(res=>{
                    let {code,msg} = res
                    if(+code==200){
                        this.$message.success(msg)
                        this.searchFn()
                    }else{
                        this.$message.warning(msg)
                    }
                    this.handleClosed()
                })
            },
            // 驳回
            rejected(){
                let params = {
                    controlRuleId:this.temControlRuleId,
                    ruleState:0
                }
                putRule(params).then(res=>{
                    let {code,msg} = res
                    if(+code==200){
                        this.$message.success(msg)
                        this.searchFn()
                    }else{
                        this.$message.warning(msg)
                    }
                    this.handleClosed()
                })
            },
            // 返回
            back(){
              this.handleClosed()     
            },
            // 新增确定
            append(formName){
                 this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let params = {
                            controlRuleName:this.ruleForm.controlRuleName,
                            carrierId:Number(this.ruleForm.carrierId),
                            priority:this.ruleForm.priority,
                            ruleUpTime:this.ruleForm.timeLimit[0],
                            ruleDownTime:this.ruleForm.timeLimit[0],
                            limitProvince:this.ruleForm.limitProvince.toString(),
                            limitCity:this.ruleForm.limitCity.toString(),
                            limitRegion:this.ruleForm.limitRegion.toString(),
                            limitGoodsType:this.ruleForm.limitGoodsType.toString(),
                            limitGoodsName:this.ruleForm.limitGoodsName,
                            ruleState: 2
                        }
                        if(this.isAdd == 'edit'){
                            params.controlRuleId = this.temControlRuleId
                            params.ruleState = 2
                            putRule(params).then(res=>{
                                let {code,msg}=res
                                this.isShowEdit = false
                                if(+code==200){
                                    this.$message.success(msg)
                                    this.searchFn()
                                }else{
                                    this.$message.warning(msg)
                                }
                            })
                        }else{
                            addRule(params).then(res=>{
                                let {code,msg}=res
                                this.isShowEdit = false
                                if(+code==200){
                                    this.$message.success(msg)
                                    this.searchFn()
                                }else{
                                    this.$message.warning(msg)
                                }
                            })
                        }    
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                 })
                
            },
            appendCancle(){
                // this.isShowEdit = false
                this.handleClosed()
            },
            handleClosed(){
                this.isShowEdit = false
                this.isShowDetail = false
            },
            // 搜索承运商
            queryCarrierList(query){
                if (query !== '') {
                this.loading = true;
                getCarriers(query).then(res=>{
                    this.carrierList = res
                    this.loading = false;
                })
                } else {
                this.carrierList = [];
                }
            },
            selectionChange(selection){
                this.selectList = selection
            },
        }
    }
</script>

<style lang="scss" scoped>
.el-date-editor--datetimerange.el-input__inner{
    width: 100%;
}
</style>