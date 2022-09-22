<template>
    <div class="app-container">
        <div class="plateInfo mb20">
            <el-form :model="filterForm" ref="filterForm" :inline="false" label-width="160px">
                <el-row>
                <el-col :span="12">
                    <h3 class="txtAlignC">组织/单位账户资料备份</h3>
                    <el-form-item label="组织/单位名称" prop="unitName">
                        <el-input v-model="filterForm.unitName" :disabled="true" placeholder="组织/单位名称"></el-input>
                    </el-form-item>
                    <el-form-item label="组织/单位英文名称" prop="unitEnName">
                        <el-input v-model="filterForm.unitEnName" :disabled="true" placeholder="组织/单位英文名称"></el-input>
                    </el-form-item>
                    <el-form-item label="组织/单位住所" prop="unitDomicile">
                        <el-input v-model="filterForm.unitDomicile" :disabled="true" placeholder="组织/单位住所"></el-input>
                    </el-form-item>
                    <el-form-item label="组织/单位性质" prop="unitNature">
                        <!-- <el-input v-model="filterForm.companyTypeName" :disabled="true" placeholder="组织/单位性质"></el-input> -->
                        <el-select v-model="filterForm.unitNature" :disabled="true" clearable placeholder="请选择组织/单位性质">
                            <el-option :value="v.type" :label="v.label" v-for="v in companyTypeList" :key="v.type"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="组织/单位行业" prop="unitIndustry">
                        <!-- <el-input v-model="filterForm.companyIndustry" :disabled="true" placeholder="组织/单位行业"></el-input> -->
                        <el-cascader v-model="filterForm.unitIndustry" :disabled="true" :options="selectdata.industries"></el-cascader>
                    </el-form-item>
                    <el-form-item label="证件类型" prop="documentType">
                        <!-- <el-input v-model="filterForm.certType" :disabled="true" placeholder="证件类型"></el-input> -->
                        <el-select v-model="filterForm.documentType"  :disabled="true" clearable placeholder="请选择证件类型">
                            <el-option :value="v.type" :label="v.label" v-for="v in certTypeList" :key="v.type"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="filterForm.documentType === 3 ? '证件号' : '统一社会信用代码'" prop="uniformSocialCreditCode">
                        <el-input v-model="filterForm.uniformSocialCreditCode" :disabled="true" :placeholder="filterForm.documentType === 3 ? '证件号' : '统一社会信用代码'"></el-input>
                    </el-form-item>
                    <el-form-item label="组织/单位注册所在地域" prop="unitRegisterAreaCode">
                        <!-- <el-input v-model="filterForm.companyRegisterArea" :disabled="true" placeholder="组织/单位注册所在地域"></el-input> -->
                        <el-cascader v-model="filterForm.unitRegisterAreaCode" :disabled="true" :options="selectdata.areas" clearable placeholder="请选择组织/单位注册所在地域"></el-cascader>
                    </el-form-item>
                    <el-form-item label="联系人" prop="admin.nickName">
                        <el-input v-model="filterForm.admin.nickName" :disabled="true" placeholder="联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人电话" prop="admin.phonenumber">
                        <el-input v-model="filterForm.admin.phonenumber" :disabled="true" placeholder="联系人电话"></el-input>
                    </el-form-item>
                    <el-form-item label="常用邮箱" prop="admin.email">
                        <el-input v-model="filterForm.admin.email" :disabled="true" placeholder="常用邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="法人姓名" prop="legalPersonName">
                        <el-input v-model="filterForm.legalPersonName" :disabled="true" placeholder="法人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="法人证件类型" prop="legalPersonDocumentType">
                        <!-- <el-input v-model="filterForm.legalCertTypeName" :disabled="true" placeholder="法人证件类型"></el-input> -->
                        <el-select v-model="filterForm.legalPersonDocumentType"  :disabled="true"  clearable placeholder="请选择法人证件类型">
                            <el-option :value="v.type" :label="v.label" v-for="v in legalCertTypeList" :key="v.type"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="法人证件号码" prop="legalPersonDocumentNumber">
                        <el-input v-model="filterForm.legalPersonDocumentNumber" :disabled="true" placeholder="法人证件号码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <h3></h3>
                    <el-form-item label="组织/单位营业执照" class="padFormItem" prop="companyName" label-width="170px">
                        <div class="picInfo flexDis flexContentC flexAlignC">
                            <img :src="filterForm.businessLicense" v-if="filterForm.businessLicense" />
                            <img src="@/assets/images/com_pic3.png" v-else />
                        </div>
                    </el-form-item>
                    <el-form-item label="组织/单位LOGO" class="padFormItem" prop="companyName" label-width="170px">
                        <div class="picInfo flexDis flexDirV flexContentC flexAlignC">
                            <img :src="filterForm.unitLogo" v-if="filterForm.unitLogo" />
                            <img src="@/assets/images/com_pic4.png" style="width:auto; height:auto;" v-else />
                        </div>
                    </el-form-item>
                    <el-form-item label="法人身份证正反面" class="padFormItem" prop="companyName" label-width="170px">
                        <div class="flexDis">
                            <div class="picInfo flexDis flexDirV flexContentC flexAlignC">
                                <img :src="filterForm.legalPersonIdcardFront" v-if="filterForm.legalPersonIdcardFront" />
                                <img src="@/assets/images/com_pic2.png" v-else />
                            </div>
                            <div class="picInfo flexDis flexDirV flexContentC flexAlignC">
                                <img :src="filterForm.legalPersonIdcardBack" v-if="filterForm.legalPersonIdcardBack" />
                                <img src="@/assets/images/com_pic1.png" v-else />
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
                </el-row>
            </el-form>
            <div class="txtAlignC btnInfo">
                <el-button type="primary" @click="closeFn">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {getUnit } from "@/api/system/unit";
    import selectdata from '@/utils/selectdata'
    export default {
        name:'unitDetail',
        data(){
            return{
                selectdata,
                filterForm : {
                    unitName : '',
                    unitStatus : '',
                },
                companyTypeList : [ // 组织单位性质
                    { label : '政府机关', type : '1' },
                    { label : '研究机构', type : '2' },
                    { label : '社会团体', type : '3' },
                    { label : '企业事业单位', type : '4'},
                ],

                certTypeList : [ // 证件类型
                    { label : '统一社会信用代码', type : '1' },
                    { label : '其他', type : '3' },
                ],

                legalCertTypeList : [ // 法人证件类型
                    { label : '中国居民身份证', type : '1' },
                    { label : '港澳居民往来内地通行证', type : '2' },
                    { label : '台湾居民往来大陆通行证', type : '3' },
                    { label : '外国人永久居留身份证', type :'4' },
                    { label : '港澳台居民居住证', type : '5' },
                    { label : '护照', type : '6' },
                ],
                unitId : '' // 单位 id 
            }
        },
        mounted(){
            this.initFn();
        },
        methods: {
            initFn(){
                let { query } = this.$route ;
                if( query ){
                    this.unitId = query.unitId
                    this.detailFn()  // 请求 单位详情
                }
            },
            detailFn(){
                getUnit(this.unitId).then(res=>{
                    let { code,msg,data} = res
                    this.filterForm = { ...data } ;
                    this.filterForm.unitIndustry = this.filterForm.unitIndustry.split(',')
                    this.filterForm.unitRegisterAreaCode = this.filterForm.unitRegisterAreaCode.split(',')
                    // this.$message.success(msg)
                }) 
            },
            closeFn(){ 
                this.$store.dispatch("tagsView/delView", this.$route);
                this.$router.replace({ path: "/system/unit" }); // 关闭之后要返回的页面
            },
        }
    }
</script>

<style lang="scss" scoped>
    .flexDis{ display:flex; }
    .flexContentC{ justify-content:center; }
    .flexAlignC{ align-items:center; }

    .plateInfo{
        border-bottom: none;
        .el-form-item{ padding:8px 0; }
        .btnInfo{ margin:40px 0; }
        .el-cascader{ display:block; }
    }

    h3{ font-size:16px; color:rgba(61, 73, 102, 1); padding:40px 0; font-weight: 600;}
    .picInfo{ margin-right:90px; width:200px; height:142px; border:dotted 1px rgba(184, 196, 209, 1); border-radius:4px; background:rgba(245, 249, 250, 1); 
        &:last-of-type{ margin:0; }
        img{ width:123px; height:70px; }
    }

    .padFormItem{margin:20px 0 40px; }
</style>