<template>
<div class='formStyle'>
    <el-form :model="formList" label-width="80px" :rules='rules'  ref="ruleForm">
        <el-row type="flex" class="row-bg">
            <el-col :span="6">
                <el-form-item label="项目名称" prop="projectId">
                 <el-select v-model="formList.projectId">
                        <el-option v-for='(item) in projectName' :key='item.projectId' :label='item.projectName' :value='item.projectId'></el-option>
                </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="标题" prop='workTitle'>
                <el-input v-model="formList.workTitle" placeholder="请输入" ></el-input>
                </el-form-item>
            </el-col
            >
            <el-col :span="6">
                <el-form-item label="工作类型" prop='workTypeId'>
                    <el-select v-model="formList.workTypeId">
                      <el-option v-for='(item) in workName' :key='item.dictCode' :label='item.dictLabel' :value='item.dictCode'></el-option>
                    </el-select>
                </el-form-item>
                </el-col
            >
            <el-col :span="4">
            <el-form-item label="工作时长" prop='workTime'>
                <el-input v-model="formList.workTime" placeholder="请输入"></el-input>
                </el-form-item>
                </el-col
            >
        </el-row>
        <el-row type="flex" class="row-bg">
            <el-col :span="22">
            <el-form-item label="工作内容" prop='workContent'>
                <el-input v-model="formList.workContent" type="textarea" placeholder="请输入"></el-input>
            </el-form-item></el-col
            >
        </el-row>
    </el-form>
</div>
</template>

<script>
export default {
    props:['formList','projectName','workName'],
    data(){
        return {
            rules: {
                projectId: [
                    { required: true, message: '请输入项目名称', trigger: 'change' },
                ],
                workTitle: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ],
                workTypeId: [
                    {  required: true, message: '请选择工作类型', trigger: 'change' }
                ],
                workTime: [
                    { required: true, message: '请输入工作时长', trigger: 'blur' }
                ],
                workContent: [
                    { required: true, message: '请输入工作内容', trigger: 'blur' }
                ]
                }
                }
        },
    created(){
    
    },
    methods:{
        validate() {
            let flag
            this.$refs['ruleForm'].validate(valid => {
                flag = valid
            })
            return flag
        }
    }
   
}
</script>
<style lang="scss">
.formStyle{
    .el-form-item__label{
    color: #a8b5c1 !important;
}
}

</style>