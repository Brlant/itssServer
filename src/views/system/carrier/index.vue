<template>
    <div class="app-container">
        <div class="plateInfo">
            <el-form :model="filterForm" ref="filterForm" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-form-item label="承运商名称" prop="carrierName">
                            <el-input v-model="filterForm.carrierName" clearable placeholder="请输入承运商名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="承运条件" prop="transportType">
                            <el-select v-model="filterForm.transportType"  placeholder="请输入承运条件">
                                <el-option v-for="item in dict.type.transportation_condition" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="filterForm.status"  placeholder="请输入承运条件">
                                <el-option v-for="item in stateList" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item class="orgItem">
                        <!-- <el-button v-if="buttonIcon('查询')" type="primary" @click="listQuery()">查询</el-button> -->
                        <el-button type="primary" v-hasPermi="['carrier:carrier:list']" @click="searchFn">查询</el-button>
                        <el-button  plain @click="resetFeildFn">重置</el-button>
                    </el-form-item>
                </el-col>
                </el-row>
            </el-form>
        </div>
        <div>
            <div class="headerBtn">
                <el-button type="primary" v-hasPermi="['carrier:carrier:list']"  @click="addFn">新增</el-button>
            </div>
           <el-table v-loading="tableLoading" :data="tableData" @selection-change="selectionChange" border>
                <el-table-column type="selection" width="50"/>
                <el-table-column prop="carrierCode" label="承运商编码">
                    <template slot-scope="{ row }">
                        {{ row.carrierCode }}
                    </template>
                </el-table-column>
                <el-table-column label="承运商名称" prop="carrierName">
                    <template slot-scope="{ row }">
                        {{ row.carrierName }}
                    </template>
                </el-table-column>
                <el-table-column label="联系人" prop="contactor">
                    <template slot-scope="{ row }">
                        {{ row.contactor }}
                    </template>
                </el-table-column>
                <el-table-column label="联系电话" prop="contactPhone">
                    <template slot-scope="{ row }">
                        {{ row.contactPhone }}
                    </template>
                </el-table-column>
                <el-table-column label="详细地址" prop="detailAddr">
                    <template slot-scope="{ row }">
                        {{ row.detailAddr }}
                    </template>
                </el-table-column>
                <el-table-column label="最后更新时间" prop="updateTime">
                    <template slot-scope="{ row }">
                        {{ row.updateTime }}
                    </template>
                </el-table-column>
                <el-table-column label="最后更新人" prop="updateBy">
                    <template slot-scope="{ row }">
                        {{ row.updateBy }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="{ row }">
                        <span class='enabledStatus' :class="row.status == 0? 'warn': row.status == 2?'error':''">{{ row.status == 0 ? '待审核' : row.status == 2?'停用':'启用' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 0">
                            <span class="text-primary cursor" v-hasPermi="['carrier:carrier:query']"  style="margin-right:20px" @click="checkDetail( scope.row )" >查看详情</span>
                            <span class="text-warning cursor" v-hasPermi="['carrier:carrier:audit']"  @click="check(scope.row)" >审核</span>
                        </div>
                        <div v-if="scope.row.status == 1">
                            <span class="text-primary cursor" v-hasPermi="['carrier:carrier:query']"  style="margin-right:20px" @click="checkDetail( scope.row )" >查看详情</span>
                            <span class="text-danger cursor" v-hasPermi="['carrier:carrier:disable']"  @click="forbidden(scope.row)" >停用</span> 
                        </div>
                        <div v-if="scope.row.status == 2">
                            <span class="text-primary cursor"  v-hasPermi="['carrier:carrier:query']" style="margin-right:20px" @click="checkDetail( scope.row )" >查看详情</span>
                            <span class="text-warning cursor"  v-hasPermi="['carrier:carrier:edit']"  @click="editFn(scope.row)" >编辑</span>
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
          <!-- 新增编辑 -->
        <el-dialog :title="isAdd =='add'?'新增':'编辑'"  :close-on-click-modal="false" :visible.sync="isShowEdit" width="1200px" @closed="handleClosed">
            <div class="diaItem">
                <div class="title mb20">基本信息</div>
                <el-form :model="carrierForm" ref="carrierForm" :rules="carrierRules" label-width="100px" label-position="right">
                    <el-row :gutter="50">
                        <el-col :span="10" :offset="2">
                            <el-form-item label="承运商编码" prop="code">
                                <el-input v-model="carrierForm.code" disabled  clearable placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="承运商名称" prop="carrierName">
                                <el-input v-model="carrierForm.carrierName" clearable placeholder="请输入承运商名称" maxlength="50" show-word-limit></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="10" :offset="2">
                            <el-form-item label="运输条件" prop="transportType">
                                <!-- <el-input v-model="carrierForm.transportation" clearable placeholder="请输入承运商编码"></el-input> -->
                                <el-select v-model="carrierForm.transportType" placeholder="请选择">
                                    <el-option
                                        v-for="dict in dict.type.transportation_condition"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="10">
                            <el-form-item label="承运商名称" prop="name">
                                <el-input v-model="filterForm.name" clearable placeholder="请输入承运商名称"></el-input>
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="10" :offset="2">
                            <el-form-item label="联系人" prop="contactor">
                                <el-input v-model="carrierForm.contactor" clearable placeholder="请输入联系人" maxlength="20" show-word-limit></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="联系电话" prop="contactPhone">
                                <el-input v-model="carrierForm.contactPhone" clearable placeholder="请输入联系电话" maxlength="11"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="20" :offset="2">
                            <el-form-item label="详细地址" prop="detailAddr">
                                <el-input v-model="carrierForm.detailAddr" clearable placeholder="请输入详细地址" maxlength="50" show-word-limit></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="20" :offset="2">
                            <el-form-item label="备注" prop="note">
                                <el-input v-model="carrierForm.note" clearable placeholder="备注" maxlength="100" show-word-limit></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="4" :offset="10">
                            <el-button type="primary" plain  @click="append('carrierForm')">确定</el-button>
                            <el-button  plain   @click="appendCancle">取消</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-dialog>
        <!--详情 -->
        <el-dialog :title="isDetail != 'detail'?'审核详情':'查看详情'"  :close-on-click-modal="false" :visible.sync="isShowDetail" width="1200px" @closed="handleClosed">
             <div class="diaItem">
                <div class="title mb20">基本信息</div>
                <!-- <el-row :gutter="50"> -->
                    <div style="width:100%;box-sizing:border-box;padding:0 20px;">
                    <el-descriptions  :column="2" :size="size" labelStyle="justify-content:flex-end;min-width:100px;">
                        <el-descriptions-item label="承运商编码">{{detailData.carrierCode}}</el-descriptions-item>
                        <el-descriptions-item label="承运商名称">{{detailData.carrierName}}</el-descriptions-item>
                        <el-descriptions-item label="运输条件" span="2">
                            <dict-tag :options="dict.type.transportation_condition" :value="detailData.transportType"/>
                        </el-descriptions-item>
                        <el-descriptions-item label="联系人">{{detailData.contactor}}</el-descriptions-item>
                        <el-descriptions-item label="联系电话">{{detailData.contactPhone}}</el-descriptions-item>
                        <el-descriptions-item label="详细地址" span="2">{{detailData.detailAddr}}</el-descriptions-item>
                        <el-descriptions-item label="备注" span="2">{{detailData.note}}</el-descriptions-item>
                    </el-descriptions>
                    </div>
                    <div class="txtAlignC">
                        <el-button v-if="this.isDetail != 'detail'"  type="primary" @click="adjust">通过</el-button>
                        <el-button v-if="this.isDetail != 'detail'"  plain @click="reject">驳回</el-button>
                        <el-button v-if="this.isDetail == 'detail'" plain @click="back">关闭</el-button>
                    </div>
                <!-- </el-row> -->
             </div>
        </el-dialog>
    </div>
</template>

<script>
import { addCarrier, listCarrier, updateCarrier, editCarrier,getCarrier} from "@/api/system/carrier";
    export default {
        name:'carrier',
        dicts: ['transportation_condition'],
        data(){
            return{
                total:-1,
                pageSize:10,
                currentPage:1,
                filterForm:{
                    carrierName:'',
                    transportType:'',
                    status:'',
                },
                stateList:[
                    {label:'启用',value:1,},
                    {label:'待审核',value:0,},
                    {label:'停用',value:2,},
                ],
                tableData:[],
                tableLoading:false,
                selectList:[],  // 勾选的数据
                isAdd:'add',  //新增或编辑 'edit'
                // titleEdit:'新增', // 新增编辑标题
                isShowEdit:false,
                temData:{}, //临时数据
                carrierForm:{ //新增
                    carrierCode:'',
                    carrierName:'',
                    transportType:'',
                    contactor:'',
                    contactPhone:'',
                    detailAddr:'',
                    note:'', 
                }, 
                carrierRules:{
                    carrierName:[{ required: true, message: '请输入活动名称', trigger: 'blur' },],
                    transportType:[{ required: true, message: '请输入活动名称', trigger: 'change' },],
                    contactor:[{ required: true, message: '请输入联系人', trigger: 'blur' },],
                    contactPhone:[{ required: true, message: '请输入联系电话', trigger: 'blur' },],
                    detailAddr:[{ required: true, message: '请输入详细地址', trigger: 'blur' },],
                }, 
                isShowDetail:false,
                isDetail:'detail', //判断审核还是详情
                size:'medium',
                detailData:{},  // 详情数据
            }
        },
        mounted(){
            this.currentPage = 1
            this.queryPageFn()
        },
        methods:{
            // 列表接口
            queryPageFn(){
                let parame = {
                    ...this.filterForm,
                    pageNum:this.currentPage,
                    pageSize:this.pageSize
                }
                this.tableLoading = true
                listCarrier(parame).then(res=>{
                    let {rows,total} = res
                    this.tableLoading = false
                    this.tableData = rows
                    this.total = total
                }).catch(()=>this.tableLoading=false)
            },
            // 搜索
            searchFn(){
                this.currentPage = 1
                this.queryPageFn()
            },
            // 重置
            resetFeildFn(){
                this.filterForm={
                    carrierName:'',
                    transportType:'',
                    status:'',
                }
            },
            // 新增
            addFn(){
                this.isAdd = 'add'
                this.isShowEdit = true
                this.$nextTick(()=>{
                    this.$refs.carrierForm.resetFields()
                })
            },
            // 编辑
            editFn(row){
                this.isAdd = 'edit'
                this.temData = row
                this.isShowEdit = true
                this.$nextTick(() => {
                    this.$refs.carrierForm.resetFields()
                    getCarrier(row.carrierId).then(res=>{
                        let {code,data} = res
                        if(+code == 200){
                            this.carrierForm.carrierCode = data.carrierCode
                            this.carrierForm.carrierName = data.carrierName
                            this.carrierForm.transportType = data.transportType
                            this.carrierForm.contactor = data.contactor
                            this.carrierForm.contactPhone = data.contactPhone
                            this.carrierForm.detailAddr = data.detailAddr
                            this.carrierForm.note = data.note
                        }
                    })
                })
            },
            // 审核弹窗
            check(row){
                this.isShowDetail = true,
                this.isDetail='check' //判断审核还是详情
                this.temData = row
                getCarrier(row.carrierId).then(res=>{
                    let {code,data} = res
                        if(+code == 200){
                            this.detailData = data
                        }
                })
            },
            // 禁用
            forbidden(row){
                this.$confirm('确定要停用吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let data = {
                        carrierId:row.carrierId,
                        status:2
                    }
                    updateCarrier(data).then(res=>{
                        let {msg} = res
                        this.$message.success(msg)
                        this.searchFn()
                    }) 
                })
            },
            // 查看详情
            checkDetail(row){
                this.temData = row
                this.isShowDetail = true
                this.isDetail='detail'
                getCarrier(row.carrierId).then(res=>{
                    let {code,data} = res
                        if(+code == 200){
                            this.detailData = data
                        }
                })
            },
            append(carrierForm){
                this.$refs[carrierForm].validate((valid) => {
                    if (valid) {
                        if(this.isAdd == 'add'){
                            this.add(this.carrierForm)
                        }else{
                            let parame = {
                                ...this.carrierForm,
                                carrierId:this.temData.carrierId,
                                status:0
                            }
                            this.edit(parame)
                        }
                        
                    }
                })
            },
            add(data){
              addCarrier(data).then(res=>{
                let {code,msg} = res
                this.isShowEdit = false
                if(+code ==200){
                    this.$message.success(msg)
                    this.searchFn()
                }
              })  
            },
            edit(data){
                editCarrier(data).then(res=>{
                    this.isShowEdit = false
                    let {code,msg} = res
                    if(+code ==200){
                        this.$message.success(msg)
                        this.searchFn()
                    }
                })
            },
            // 审核
            adjust(){
                let data = {
                    carrierId:this.temData.carrierId,
                    status:1
                }
                updateCarrier(data).then(res=>{
                    let {msg} = res
                    this.$message.success(msg)
                    this.isShowDetail = false
                    this.searchFn()
                }) 
            },
            // 驳回
            reject(){
                let data = {
                    carrierId:this.temData.carrierId,
                    status:2
                }
                updateCarrier(data).then(res=>{
                    let {msg} = res
                    this.isShowDetail = false
                    this.$message.success(msg)
                    this.searchFn()
                })
            },
            // 关闭
            back(){
                this.handleClosed()
            },
            appendCancle(){
                this.handleClosed()
            },
            handleClosed(){
                this.isShowEdit = false
                this.isShowDetail = false
            },
            selectionChange(selection){
                this.selectList = selection
            },
        },
    }
</script>

<style lang="scss" scoped>
.diaItem{
    width: 100%;
    .title{
        width: 100%;
        box-sizing: border-box;
        padding-left: 10px;
        border-left: 3px solid #3D7DFF;
        font-size: 16px;
        font-weight: 600;
    }
}
.el-descriptions{
    font-size: 15px;
}
</style>