<template>
    <div class="app-container">
        <div class="plateInfo applyFlex">
            <div class="containerControl" v-loading="loading">
                <el-form :model="filterForm" ref="filterForm" :rules="filterFormRules" :inline="false" label-width="170px">
                <el-row>
                    <el-col :span="24">
                    <h3 class="txtAlignC">组织/单位账户资料</h3>
                    <el-form-item label="管理账号" prop="admin.userName">
                        <el-input v-model="filterForm.admin.userName" maxlength="48" placeholder="8~48位(数字、字母)"></el-input>
                    </el-form-item>
                    <div class="flexDis flexAlignC">
                        <el-form-item label="登录密码" class="applyFlex" prop="admin.password">
                            <div class="flexDis">
                            <el-input v-model="filterForm.admin.password" auto-complete="new-password" type="password" placeholder="登录密码"></el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="" label-width="12px" class="applyFlex" prop="admin.againpassword">
                            <div class="flexDis">
                            <el-input v-model="filterForm.admin.againpassword" type="password" auto-complete="new-password" @blur="againpasswordBlurFn" placeholder="再次输入登录密码"></el-input>
                            </div>
                        </el-form-item>
                    </div>

                    <el-form-item label="管理员名" prop="admin.nickName">
                        <el-input v-model="filterForm.admin.nickName"  maxlength="50" placeholder="2~50位(数字、字母、字)"></el-input>
                    </el-form-item>


                    <div class="flexDis flexAlignC">
                        <el-form-item label="手机号码" class="applyFlex" prop="admin.phonenumber">
                            <el-input v-model="filterForm.admin.phonenumber" placeholder="手机号码" maxlength="11"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label=""  label-width="12px" class="applyFlex" prop="smsCode">
                            <el-input v-model="filterForm.smsCode" placeholder="验证码"></el-input>
                        </el-form-item>
                        <el-button type="primary" class="mt-15" :disabled="isSend" @click="sendCodeFn">{{ isSend ? `重新发送(${ secondN })` : '获取' }}</el-button> -->
                    </div>

                    <el-form-item label="常用邮箱" prop="admin.email">
                        <el-input v-model="filterForm.admin.email" placeholder="输入常用邮箱地址备份"></el-input>
                    </el-form-item>

                    <h3 class="txtAlignC">组织/单位基本资料</h3>

                    <el-form-item label="组织/单位名称" prop="unitName">
                        <el-input v-model="filterForm.unitName" placeholder="您的组织/单位名称, 一经注册不允许修改"></el-input>
                    </el-form-item>
                    <el-form-item label="组织/单位英文名称" prop="unitEnName">
                        <el-input v-model="filterForm.unitEnName" placeholder="组织/单位英文名称"></el-input>
                    </el-form-item>
                    <el-form-item label="组织/单位住所" prop="unitDomicile">
                        <el-input v-model="filterForm.unitDomicile" placeholder="营业执照住所信息"></el-input>
                    </el-form-item>
                    <el-form-item label="组织/单位性质" prop="unitNature">
                        <!-- <el-input v-model="filterForm.companyTypeName" placeholder="组织/单位性质"></el-input> -->
                        <div class="flexDis">
                            <el-select v-model="filterForm.unitNature" clearable placeholder="请选择组织/单位性质">
                            <el-option :value="v.type" :label="v.label" v-for="v in companyTypeList" :key="v.type"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <!-- <div class="flexDis"> -->
                        <el-form-item label="组织/单位行业" prop="unitIndustry">
                            <!-- <el-input v-model="filterForm.companyIndustry" placeholder="组织/单位行业"></el-input> -->
                            <el-cascader v-model="filterForm.unitIndustry" :options="selectdata.industries" ></el-cascader>
                        </el-form-item>
                    <!-- </div> -->
                    <el-form-item label="证件类型" prop="documentType">
                        <!-- <el-input v-model="filterForm.certType" placeholder="证件类型"></el-input> -->
                        <div class="flexDis">
                            <el-select v-model="filterForm.documentType" clearable placeholder="请选择证件类型">
                                <el-option :value="v.type" :label="v.label" v-for="v in certTypeList" :key="v.type"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item :label="filterForm.documentType === 3 ? '证件号' : '统一社会信用代码'" prop="uniformSocialCreditCode" :rules="[
                        {required: true, message: filterForm.documentType === 3 ? '请输入证件号' : '请输入统一社会信用代码', trigger: 'blur'},
                    ]">
                        <el-input v-model="filterForm.uniformSocialCreditCode" :placeholder="filterForm.documentType === 3 ? '证件号' : '统一社会信用代码'"></el-input>
                    </el-form-item>
                    <el-form-item label="组织/单位注册所在地域" prop="unitRegisterAreaCode">
                        <!-- <el-input v-model="filterForm.companyRegisterArea" placeholder="组织/单位注册所在地域"></el-input> -->
                        <el-cascader v-model="filterForm.unitRegisterAreaCode" :options="selectdata.areas" clearable placeholder="请选择组织/单位注册所在地域" ></el-cascader>
                    </el-form-item>

                    <el-row>
                        <el-col :span="12">
                        <el-form-item label="组织/单位营业执照" prop="companyLicense"
                        :rules="[
                            {required: true, message: '请上传组织/单位营业执照', trigger: 'blur'},
                            ]">
                            <div class="picInfo flexDis flexContentC flexAlignC">
                                <el-upload
                                class="avatar-uploader flexDis flexContentC flexAlignC applyFlex"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-change="companyLicenseSuccess"
                                :auto-upload="false"
                                >
                                <!-- :before-upload="beforeUpload" -->
                                    <img slot="trigger" v-if="filterForm.companyLicense" :src="filterForm.companyLicense" class="avatar">
                                    <i v-else slot="trigger" class="el-icon-plus avatar-uploader-icon flexDis flexContentC flexAlignC applyFlex"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        <el-form-item label="组织/单位LOGO" prop="companyLogo"
                        :rules="[
                            {required: false, message: '请上传组织/单位LOGO', trigger: 'blur'},
                            ]">
                            <div class="picInfo flexDis flexContentC flexAlignC">
                                <el-upload
                                class="avatar-uploader flexDis flexContentC flexAlignC applyFlex"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-change="companyLogoSuccess"
                                :auto-upload="false"
                                >
                                <img v-if="filterForm.companyLogo" :src="filterForm.companyLogo" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon flexDis flexContentC flexAlignC applyFlex"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        </el-col>
                        <el-col :span="24">
                        <el-form-item label="">
                            <div class="tips">请上传jpg、png、jpeg格式的国徽面照片，并保证执照内容清晰可识别，文件大小不超过10M</div>
                        </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="法人姓名" prop="legalPersonName">
                        <el-input v-model="filterForm.legalPersonName" placeholder="联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="法人证件类型" prop="legalPersonDocumentType">
                        <div class="flexDis">
                        <el-select v-model="filterForm.legalPersonDocumentType" clearable placeholder="请选择法人证件类型">
                            <el-option :value="v.type" :label="v.label" v-for="v in legalCertTypeList" :key="v.type"></el-option>
                        </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="法人证件号码" prop="legalPersonDocumentNumber">
                        <el-input v-model="filterForm.legalPersonDocumentNumber" placeholder="法人证件号码"></el-input>
                    </el-form-item>

                    <div class="flexDis">
                        <el-row>
                        <el-col :span="12">
                            <el-form-item label="法人身份证正面" class="applyFlex" prop="mainIdcardLicense"
                            :rules="[
                                {required: true, message: '请上传法人身份证正面', trigger: 'blur'},
                            ]">

                                <div class="flexDis flexDirV flexAlignC">
                                <div class="picInfo flexDis flexDirV flexContentC flexAlignC">

                                    <el-upload
                                    class="avatar-uploader flexDis flexContentC flexAlignC applyFlex"
                                    :action="uploadUrl"
                                    :show-file-list="false"
                                    :on-change="mainIdcardLicenseSuccess"
                                    :auto-upload="false"
                                    >
                                    <img v-if="filterForm.mainIdcardLicense" :src="filterForm.mainIdcardLicense" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon flexDis flexContentC flexAlignC applyFlex"></i>
                                    </el-upload>
                                </div>
                                <small class="tips tipsSmall">身份证正面</small>
                                </div>


                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                        <el-form-item label="" label-width='12px' class="applyFlex" prop="viceIdcardLicense"
                        :rules="[
                            {required: true, message: '请上传法人身份证反面', trigger: 'blur'},
                        ]">
                                <div class="flexDis flexDirV flexAlignC">
                                    <div class="picInfo flexDis flexDirV flexContentC flexAlignC">
                                    <el-upload
                                        class="avatar-uploader flexDis flexContentC flexAlignC applyFlex"
                                        :action="uploadUrl"
                                        :show-file-list="false"
                                        :on-change="viceIdcardLicenseSuccess"
                                        :auto-upload="false"
                                    >
                                        <img v-if="filterForm.viceIdcardLicense" :src="filterForm.viceIdcardLicense" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon flexDis flexContentC flexAlignC applyFlex"></i>
                                    </el-upload>

                                    </div>
                                    <small class="tips tipsSmall">身份证背面</small>
                                </div>
                        </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="" prop="">
                            <div class="tips">请上传jpg、png、jpeg格式的国徽面照片，并保证执照内容清晰可识别，文件大小不超过10M</div>
                            </el-form-item>
                        </el-col>
                        </el-row>
                    </div>

                    </el-col>
                </el-row>


                </el-form>
            </div>

            <div class="txtAlignC btnInfo">
                <el-button :loading="loading" type="primary" @click="registerFn('filterForm')">注册账号</el-button>
            </div>
            </div>
    </div>
</template>

<script>
import selectdata from '@/utils/selectdata'
import { addUnit } from "@/api/system/unit";

let checkAccountFn = (rule, value, callback) => {
    if( value.length < 8 || value.length > 48 ){
        callback(new Error('管理账号8~48位!'))
    } else if ( !/^[0-9a-z]+$/i.test( value ) ) {
        callback(new Error('只能是数字、字母'))
    } else {
        callback()
    }
}
let checkManagerNameFn  = (rule, value, callback) => {
    if( value.length < 2 || value.length > 50 ){
        callback(new Error('管理员名2 ~ 50位!'))
    } else if ( !/^[0-9a-z\u4e00-\u9fa5]+$/i.test( value ) ) {
        callback(new Error('只能是数字、字母、字'))
    } else {
        callback() ;
    }
}
    export default {
        name:'unitAdd',
        data(){
            return{
                selectdata,
                loading:false,
                uploadUrl:'#',
                filterForm : {
                    admin:{
                        userName:'',
                        password:'',
                        againpassword:'',
                        nickName:'',
                        phonenumber:'',
                        email:'',
                    },
                    unitName:'',
                    unitEnName:'',
                    unitDomicile:'',
                    unitNature:'',
                    unitIndustry:'',
                    documentType:'',
                    uniformSocialCreditCode:'',
                    unitRegisterAreaCode:'',
                    legalPersonName:'',
                    legalPersonDocumentType:'',
                    legalPersonDocumentNumber:'',
                    companyLicense:'',
                    companyLogo:'',
                    mainIdcardLicense : '',
                    viceIdcardLicense : '',
                    // account : '',
                    // password : '',
                    // againpassword : '',
                    // managerName : '',
                    // teleNo : '',
                    // smsCode : '',
                    // mail : '',
                    // companyName : '',
                    // companyForeignName : '',
                    // companyAddress : '',
                    // companyType : '',
                    // companyIndustry : '',
                    // certType : '',
                    // certNo : '',
                    // companyRegisterArea : '',
                    // companyLicense : '',
                    // companyLogo : '',
                    // legalName : '',
                    // legalCertType : '',
                    // legalCertNo : '',
                    // mainIdcardLicense : '',
                    // viceIdcardLicense : '',
                },
                businessLicenseFile:'',
                logoFile:'',
                legalPersonIdcardFrontFile:'',
                legalPersonIdcardBackFile:'',
                filterFormRules : {
                    'admin.userName' : [
                        {required : true,trigger: 'blur',min: 8,max: 48,message: '请输入管理账号8~48位!'},
                        {validator: checkAccountFn, trigger: 'blur'}
                    ],
                    'admin.password' : [
                        {required: true, message: '请输入登录密码', trigger: 'blur'},
                    ],
                    'admin.againpassword' : [
                        {required: true, message: '请再次输入登录密码', trigger: 'blur'},
                    ],
                    'admin.nickName' : [
                        {required : true,trigger: 'blur',min: 2,max: 50,message: '请输入管理员名2~50位!'},
                        {validator: checkManagerNameFn, trigger: 'blur'}
                    ],
                    'admin.phonenumber': [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                    ],
                    // smsCode : [
                    //     {required: true, message: '请输入验证码', trigger: 'blur'},
                    // ],
                    'admin.email': [
                        {required: true, message: '请输入常用邮箱地址', trigger: 'blur'},
                        {validator: this.checkEmailFn, trigger: 'blur'}
                    ],
                    unitName : [
                        {required: true, message: '请输入组织/单位名称', trigger: 'blur'},
                    ],
                    unitEnName : [
                        {required: true, message: '请输入组织/单位英文名称', trigger: 'blur'},
                    ],
                    unitDomicile : [
                        {required: true, message: '请输入组织/单位住所', trigger: 'blur'},
                    ],
                    unitNature : [
                        {required: true, message: '请选择组织/单位性质', trigger: 'blur'},
                    ],
                    unitIndustry : [
                        {required: true, message: '请选择组织/单位行业', trigger: 'blur'},
                    ],
                    documentType : [
                        {required: true, message: '请选择证件类型', trigger: 'blur'},
                    ],
                    // uniformSocialCreditCode : [
                    //     {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
                    // ],
                    unitRegisterAreaCode : [
                        {required: true, message: '请选择组织/单位注册所在地域', trigger: 'blur'},
                    ],
                    // companyLicense : [
                    //     {required: true, message: '请上传组织/单位营业执照', trigger: 'blur'},
                    // ],
                    // companyLogo : [
                    //     {required: false, message: '请上传组织/单位LOGO', trigger: 'blur'},
                    // ],
                    legalPersonName : [
                        {required: true, message: '请输入法人姓名', trigger: 'blur'},
                    ],
                    legalPersonDocumentType : [
                        {required: true, message: '请选择法人证件类型', trigger: 'blur'},
                    ],
                    legalPersonDocumentNumber : [
                        {required: true, message: '请输入法人证件号码', trigger: 'blur'},
                    ],
                    // mainIdcardLicense : [
                    //     {required: true, message: '请上传法人身份证正面', trigger: 'blur'},
                    // ],
                    // viceIdcardLicense : [
                    //     {required: true, message: '请上传法人身份证背面', trigger: 'blur'},
                    // ],
                },
                companyTypeList : [ // 组织单位性质
                    { label : '政府机关', type : 1 },
                    { label : '研究机构', type : 2 },
                    { label : '社会团体', type : 3 },
                    { label : '企业事业单位', type : 4 },
                ],

                certTypeList : [ // 证件类型
                    { label : '统一社会信用代码', type : 1 },
                    { label : '其他', type : 3 },
                ],

                legalCertTypeList : [ // 法人证件类型
                    { label : '中国居民身份证', type : 1 },
                    { label : '港澳居民往来内地通行证', type : 2 },
                    { label : '台湾居民往来大陆通行证', type : 3 },
                    { label : '外国人永久居留身份证', type : 4 },
                    { label : '港澳台居民居住证', type : 5 },
                    { label : '护照', type : 6 },
                ],

                secondN : 61, // 验证码秒数
                isSend : false, // 是否发送短信验  return ;
                codeTimer : null, // 验证码定时索引
            }
        },
        mounted(){
        },
        methods:{
          // handleCascader(val){
          //   console.log(val[0],val[1],val[2])
          // },
            againpasswordBlurFn(){
                if( this.filterForm.admin.againpassword !== this.filterForm.admin.password ){
                    this.$message({
                        message : '请与输入的新密码保持一致!',
                        type : 'warning'
                    }) ;
                    this.filterForm.againpassword = ''
                }
            },
            checkEmailFn(rule, value, callback){
                if( !/^\w+@\w+(\.(cn|com|org|net|tw|hk|pk|nz|sg|sy|ae|om|za)){1,2}$/i.test( value ) ){
                    this.filterForm.mail = '' ;
                    callback(new Error('请输入正确邮箱!'));
                } else {
                    callback();
                }
            },
            sendCodeFn(){
                if( this.filterForm.teleNo.trim() === '' ){
                    this.$message({
                        message : '请先输入手机号',
                        type : 'warning'
                    })
                    return
                }
                if( !/^1[34578]\d{9}$/.test( this.filterForm.teleNo ) ){
                    this.$message({
                        message : '请输入正确的手机号',
                        type : 'warning'
                    }) ;
                    return
                }
                if( this.isSend ){
                    this.$message({
                        message : '验证码正在发送, 请稍候...',
                        type : 'warning'
                    })
                    return
                }
                let _timeFn = () => {
                if( this.secondN <= 1 ){ this.isSend = false ; this.secondN = 61; clearTimeout( this.codeTimer ); this.codeTimer = null ; return ;}
                    this.secondN--
                    clearTimeout( this.codeTimer )
                    this.codeTimer = setTimeout( _timeFn, 1000 )
                }
                _timeFn()
                this.sendMsgCodeFn()  // 请求 发送短信验证码
            },
            sendMsgCodeFn(){
                let params = { teleno : this.filterForm.teleNo }
                this.isSend = true
                sendMsgCode({ params })
                .then( d => {
                    let { code, data, message, total } = d
                    this.$message({
                        message,
                        type : +code === 10000 ? 'success' : 'warning'
                    })
                } )
                .catch()
            },
            companyLicenseSuccess(res) {
                let file = res.raw
                const isTYPE = /^image\/(jpe?g|png)$/.test( file.type );
                const isLt10M = file.size / 1024 / 1024 < 10
                if ( file.name.slice(0, file.name.indexOf('.') ).length < 3 ) {
                    this.$message({
                        message : '文件名称最少3位',
                        type : 'error'
                    })
                    return false
                }
                if ( !isTYPE ) {
                    this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!')
                    return false
                }
                if (!isLt10M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!')
                    return false
                }
                this.businessLicenseFile = file
                let _this = this
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let base = e.target.result
                    _this.filterForm.companyLicense = base
                };
            },
            // beforeUpload(file) {
            //     const isTYPE = /^image\/(jpe?g|png)$/.test( file.type );
            //     const isLt10M = file.size / 1024 / 1024 < 10
            //     // console.error( file, file.type, file.name.slice(0,file.name.indexOf('.')).length, 88 )
            //     if ( file.name.slice(0, file.name.indexOf('.') ).length < 3 ) {
            //         this.$message({
            //             message : '文件名称最少3位',
            //             type : 'error'
            //         })
            //         return false
            //     }
            //     if ( !isTYPE ) {
            //         this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!')
            //     }
            //     if (!isLt10M) {
            //         this.$message.error('上传头像图片大小不能超过 10MB!')
            //     }
            //     return isTYPE && isLt10M;
            // },
            companyLogoSuccess(res) {
                let file = res.raw
                const isTYPE = /^image\/(jpe?g|png)$/.test( file.type );
                const isLt10M = file.size / 1024 / 1024 < 10
                if ( file.name.slice(0, file.name.indexOf('.') ).length < 3 ) {
                    this.$message({
                        message : '文件名称最少3位',
                        type : 'error'
                    })
                    return false
                }
                if ( !isTYPE ) {
                    this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!')
                    return false
                }
                if (!isLt10M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!')
                    return false
                }
                this.logoFile = file
                let _this = this
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let base = e.target.result
                    _this.filterForm.companyLogo = base
                };
            },
            mainIdcardLicenseSuccess(res) {
                let file = res.raw
                const isTYPE = /^image\/(jpe?g|png)$/.test( file.type );
                const isLt10M = file.size / 1024 / 1024 < 10
                if ( file.name.slice(0, file.name.indexOf('.') ).length < 3 ) {
                    this.$message({
                        message : '文件名称最少3位',
                        type : 'error'
                    })
                    return false
                }
                if ( !isTYPE ) {
                    this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!')
                    return false
                }
                if (!isLt10M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!')
                    return false
                }
                this.legalPersonIdcardFrontFile = file
                let _this = this
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let base = e.target.result
                    _this.filterForm.mainIdcardLicense = base
                };
            },
            viceIdcardLicenseSuccess(res) {
                let file = res.raw
                const isTYPE = /^image\/(jpe?g|png)$/.test( file.type );
                const isLt10M = file.size / 1024 / 1024 < 10
                if ( file.name.slice(0, file.name.indexOf('.') ).length < 3 ) {
                    this.$message({
                        message : '文件名称最少3位',
                        type : 'error'
                    })
                    return false
                }
                if ( !isTYPE ) {
                    this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!')
                    return false
                }
                if (!isLt10M) {
                    this.$message.error('上传头像图片大小不能超过 10MB!')
                    return false
                }
                this.legalPersonIdcardBackFile = file
                let _this = this
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    let base = e.target.result
                    _this.filterForm.viceIdcardLicense = base
                };
            },
            registerFn( formName ){
                this.$refs[ formName ].validate((valid) => {
                    if (valid) {
                        this.createFn() // 请求 新增企业
                    } else {
                        return false
                    }
                }) 
            },
            createFn(){
                let json = {
                    admin:this.filterForm.admin,
                    unitName:this.filterForm.unitName,
                    unitEnName:this.filterForm.unitEnName,
                    unitDomicile:this.filterForm.unitDomicile,
                    unitNature:this.filterForm.unitNature,
                    unitIndustry:this.filterForm.unitIndustry.join(','),
                    documentType:this.filterForm.documentType,
                    uniformSocialCreditCode:this.filterForm.uniformSocialCreditCode,
                    unitRegisterAreaCode:this.filterForm.unitRegisterAreaCode.join(','),
                    legalPersonName:this.filterForm.legalPersonName,
                    legalPersonDocumentType:this.filterForm.legalPersonDocumentType,
                    legalPersonDocumentNumber:this.filterForm.legalPersonDocumentNumber,
                }
                let unitData = JSON.stringify(json)
                const blob = new Blob([unitData], {type: 'application/json',});
                let  Data = new FormData();
                Data.append('unitData', blob);
                Data.append('businessLicenseFile', this.businessLicenseFile);
                Data.append('logoFile', this.logoFile);
                Data.append('legalPersonIdcardFrontFile', this.legalPersonIdcardFrontFile);
                Data.append('legalPersonIdcardBackFile', this.legalPersonIdcardBackFile);          
                this.loading = true
                addUnit(Data).then(res=>{
                    this.loading = false
                    console.log(res,'res');
                    this.$message.success(res.msg)
                    this.$store.dispatch("tagsView/delView", this.$route);
                    this.$router.replace({ path: "/system/unit" }); // 关闭之后要返回的页面  会自动刷新
                })
                .catch(()=>{
                    this.loading = false
                })
            },
            getPhoneFn(){
                // console.error( 'getPhoneFn...' )
            },
            certTypeChangeFn(){
                this.filterForm.documentType = ''
                this.$refs['filterForm'].clearValidate( 'documentType' ) // 移除表单项 prop 为 certNo 的校验结果
            },
        }
    }
</script>

<style lang="scss" scoped>
    .flexDis{ display:flex; }
    .flexDis{ display:flex; }
    .flexDirV{ flex-direction:column; }
    .flexDirH{ flex-direction:row; }
    .flexContentS{ justify-content:flex-start; }
    .flexContentC{ justify-content:center; }
    .flexContentE{ justify-content:flex-end; }
    .flexContentA{ justify-content:space-around; }
    .flexContentB{ justify-content:space-between; }
    .flexContentV{ justify-content:space-evenly; }
    .flexAlignS{ align-items:flex-start; }
    .flexAlignC{ align-items:center; }
    .flexAlignE{ align-items:flex-end; }
    .flexAlignT{ align-items:stretch; }
    .flexWrap{ flex-wrap:wrap; }
    .flexNoWrap{ flex-wrap:nowrap; }
    .applyFlex{ flex-grow:1; }
    .flexWStatic{ flex-shrink:0; }
    .flexWAuto{ flex-shrink:1; }
    .mt-15{margin-top: -15px;}

    .plateInfo{
        border: none;
        .el-form-item{ padding:12px 0; }
        .btnInfo{ margin:40px 0; }
        .tips{ font-size:14px; color:rgba(153, 153, 153, 1);}
        .tipsSmall{ font-size:12px; }
        .avatar-uploader{ width:100%; height:100%; position:relative;}
        .avatar-uploader-icon{ left:0; top:0; position:absolute; width:100%; height:100%; color:rgba(198, 211, 226, 1); }

        .containerControl{ width:756px; margin:0 auto; }
        ::v-deep .el-cascader{ display:block; }
    }

    h3{ font-size:16px; color:rgba(61, 73, 102, 1); padding:40px 0; font-weight: 600;}
    .picInfo{
        margin-right:90px; width:200px; height:142px; border:dotted 1px rgba(184, 196, 209, 1); border-radius:4px; background:rgba(245, 249, 250, 1);
        &:last-of-type{ margin:0; }
        img{ width:123px; height:70px; }
    }

    ::v-deep .el-form-item__content{ font-size:24px; }

    .padFormItem{margin:20px 0 40px; }
</style>
