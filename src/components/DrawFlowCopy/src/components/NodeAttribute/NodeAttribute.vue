
<template>
    <div class="attri-container">
      <!-- 人物节点 -->
      <div v-if="type == 'userTask'">
        <el-form  ref="form"  :model="form" label-position="right"  :rules="formRules">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="节点名称：" label-width="100px" prop="title">
                 <el-input v-model="form.title"></el-input>
              </el-form-item>
              <el-form-item label="人员类型：" label-width="100px" prop="userType">
                 <template>
                  <el-radio-group v-model="form.userType" @change="changeType">
                    <el-radio  label="1">指定人员</el-radio>
                    <el-radio  label="2">角色</el-radio>
                    <el-radio  label="3">分组</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
              <el-form-item label="人员选择：" label-width="100px" prop="userId">
                <el-select  v-model="form.userId"  multiple    placeholder="请选择" @change="changeValue">
                    <el-option
                      v-for="( item, index ) in userList"
                      :key="index"
                      :label="item.name"
                      :value="item.key"
                      >
                      <span style="float: left">{{ item.name }}</span>
                    </el-option>
                  </el-select>                                   
              </el-form-item>
               <el-form-item  v-if="form.type == 2" label="审核方式：" label-width="100px" prop="completionCondition">
                 <el-radio-group v-model="form.completionCondition">
                  <el-radio :label="1">或签（一名审批人同意或拒绝即可）</el-radio>
                  <el-radio :label="2">会签（须所有审批人同意）</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.type == 2" label="回退：" label-width="100px" prop="backId">
                <el-select v-model="form.backId" placeholder="请选择">
                  <el-option
                    v-for="( item, index ) in backNodeList"
                    :key="index"
                    :label="item.title"
                    :value="item.id">
                    <span style="float: left">{{ item.title }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.type ==  2" label="类监听：" label-width="100px" prop="className">
                <el-input v-model="form.className"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
         <div class="footer">
            <el-button class="cancel-btn" @click="cancelForm">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </div>
        <!-- 条件节点属性 -->
      <div v-if="type == 'exclusiveGateway'">
        <el-form ref="conform"  :model="conform" label-position="right"  :rules="conformRules">
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="条件名称：" label-width="100px" prop="conTitle">
                  <el-input v-model="conform.conTitle" placeholder="请输入条件名称"></el-input>
                </el-form-item>
              <el-form-item label="添加条件：" label-width="100px" prop="condition">
                <el-input v-model="conform.condition" placeholder="请输入条件"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="footer">
            <el-button class="cancel-btn" @click="cancelForm">取消</el-button>
            <el-button type="primary" @click="submitConForm('conform')">确定</el-button>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      type:'', // 传入的类型
      userList: [], // 人员列表选择
      backNodeList: [], // 可回退的节点
      form: {
        title: "", // 名称
        userType:'1',
        userId: "", // 用户选择
        userName:"",
        completionCondition:'', // 审核类型
        backId:'',
        type:'',
        className:'' // 监听类目
      },
      conform: {
          conTitle:'',
          condition:'',
      },
      formRules: {
        title: [ {required: true, message: "请输入节点名称", trigger: "blur"}],
        userType: [ {required: true, message: "请选择人员类型", trigger: "blur"}],
        userId: [ {required: true, message: "请选择人员", trigger: "blur"}],
        backId: [ {required: true, message: "请选择回退节点", trigger: "blur"}],
        completionCondition: [ {required: true, message: "请选择审核方式", trigger: "blur"}],
        
      },
      conformRules: {
        conTitle: [ {required: true, message: "请输入条件名称", trigger: "blur"}],
        condition: [ {required: true, message: "请输入条件", trigger: "blur"}]
      }
    };
  },
  props: {
    nodeData: {
      type: Object,
      default: null
    },
    nodeList: {
      type: Array,
      default: null 
    }
  },
  watch: {
    nodeData: {
      handler() {
        this.initData();
      },
      deep: true
    },
    nodeList: {
      handler() {
        this.initData();
      },
      deep: true
    }
  },
  created() {
    this.initData();
  },
  methods: {
    initData(){
      this.type = this.nodeData.nodeType;
      if(this.nodeData.nodeType == 'userTask'){
        this.getBackNodeList();
        let backId = '';
        if(this.nodeData.rejectKey == ''){
          backId = 'a78x4anxe'
        }else {
          backId = this.nodeData.rejectKey
        }
        this.form.userType = this.nodeData.userType || '1';
        this.form.userId = this.nodeData.processMultiInstanceUsers;
        this.form.userName = this.nodeData.nodeName;
        this.form.title = this.nodeData.title;
        this.form.backId = backId; // 这个是id
        this.form.type = this.nodeData.type;
        this.form.completionCondition = this.nodeData.completionCondition == '${nrOfCompletedInstances >= 1}' ? 1:2;
        this.form.className = this.nodeData.taskListeners ? this.nodeData.taskListeners[0].implementation : ''
        this.conform.conTitle = '';
        this.conform.condition = '';
        this.getUserList();
      }else {
        this.form.userId = '';
        this.form.userName = '';
        this.conform.conTitle = this.nodeData.title == '条件分支' ? '' : this.nodeData.title;
        this.conform.condition = this.nodeData.conditionExpression == '请设置' ? '' : this.nodeData.conditionExpression;
      }
    },
    // 获取人员列表
    getUserList(){
      // 需要根据人员类型来定下拉框的数据是什么
      axios.get(`/flowable/definition/infoList?type=${this.form.userType}`)
      .then(res => {
          if(res && res.data && res.data.code == 200){
            this.userList = res.data.data
            return false;
          }
      })
      .then(err => {
          console.log(err)
      })
    },
    changeType(){
      this.form.userName = ''
      this.form.userId = ''
      this.userList = []
      this.getUserList();
    },
    // 修改值
    changeValue(value){
        let nodeName = ""
        for(let i = 0; i< value.length; i++){
          this.userList.filter(( item )=> {
            if(item.key == value[i] ){
              nodeName = nodeName + item.name + ';'
            }
          })
        }
        this.form.userName = nodeName
    },
    // 修改
    change(value){
      let that = this;
      that.userList.filter(( item )=> {
        if(item.id == value ){
          that.form.userName = item.name
          that.form.userId = item.id
        }
      })
    },
    // 获取可以回退的节点
    getBackNodeList(){
      this.backNodeList = [];
      this.loopBackNode(this.nodeData)
    },
    // 保持数组的唯一性
    setBackNodeList(item){
      let arr = this.backNodeList
      let flag = false
      for(var i=0;i<arr.length;i++){
          if(item.id == arr[i].id){
            flag= true
          }
      }
      if(item.id == this.nodeData.id){
        flag= true
      } 
      if(!flag){ 
        this.backNodeList.push(item) 
      }
      this.form.backId = this.backNodeList.length ? this.backNodeList[0].id : ''
    },
    // 循环
    loopBackNode(node){
      let that = this;
      // 数据结构有点复杂
      // 如果是userTask节点的话，直接通过当前节点的groupId跟上个节点的id相同
      // 如果是条件节点的话，直接通过groupPid 跟当前id是否相同，如果是相同的就需要拿这个条件groupId来做比较了
      if(node.nodeType == "userTask"){
        this.nodeList.forEach((item)=> {
          if(item.nodeType == "userTask") {
             if(node.groupId == item.id){
              if(item.nodeName && (item.type == 2 || item.type == 1)){
                this.setBackNodeList(item)
              }
              this.loopBackNode(item)
             }
          }else {
            if(item.id == node.groupId){
              this.loopBackNode(item)
            } 
            if(item.groupId == node.groupId){
               this.loopBackNode(item)
            }
          }
        })
      }
      if(node.nodeType == "exclusiveGateway"){
        this.nodeList.forEach((item)=> {
          if(item.nodeType == "userTask") {
              if(node.groupPid == item.id ){
                if(item.nodeName && (item.type == 2 || item.type == 1)){
                  that.setBackNodeList(item)
                }
                this.loopBackNode(item)
              }
              if(node.id == item.groupId){
                // 这个就是找到条件节点的下一级了
                if(item.nodeName && (item.type == 2 || item.type == 1)){
                  that.setBackNodeList(item)
                }
              }
          }else {
              if(item.groupPid == node.groupId){
                this.loopBackNode(item)
              } 
          }
        })
      }
    },
    // 找条件节点下级的人物节点
    searchConfidentNode(node){
      if(node.nodeType == "userTask"){
          this.nodeList.forEach((item)=> {
            if(item.nodeType == "userTask"){
              if(node.id == item.groupId){
                this.setBackNodeList(item)
                this.searchConfidentNode(item)
              }
            }else {
              if(node.id == item.groupPid){
                this.searchConfidentNode(item)
              }
            }
          })
      } else { // 如果是条件节点的话
          this.nodeList.forEach((item)=> {
            if(item.nodeType == "userTask"){
              if(node.id == item.groupId){
                this.setBackNodeList(item)
                this.searchConfidentNode(item)
              }
              if(node.groupId == item.groupId){
                this.setBackNodeList(item)
                // this.searchConfidentNode(item)
              }
            }else {
              if(node.id == item.groupPid){
                this.searchConfidentNode(item)
              }
              
            }
          })

      }
      
    },
    // 人物节点提交
    submitForm() {
      let rejectKey = ''
      if(this.form.backId = 'a78x4anxe'){
          rejectKey = ''
      }else {
          rejectKey == that.form.backId || ""
      }
      let that =  this;
      this.$refs['form'].validate(valid => {
        if(!valid){  return false }
        let params = {
          title: that.form.title,
          type: that.nodeData.nodeType,
          userType: that.form.userType,
          processMultiInstanceUsers: that.form.userId,
          nodeName: that.form.userName,
          rejectKey: rejectKey, // 当前节点看看是否需要回退的部分
          completionCondition: that.form.completionCondition == 1 ? '${nrOfCompletedInstances == 1}' : '${nrOfCompletedInstances/nrOfInstances == 1}', // 当前节点的审批类型
          sequential: false,
          className: that.form.className ? [{ implementation: that.form.className }] : ''
        }

        this.$emit("nodeChange", params);
      })
    },
    // 条件节点提交
    submitConForm(){
      let that =  this;
      this.$refs['conform'].validate(valid => {
        if(!valid){  return false }
        let params = {
          type: that.nodeData.nodeType,
          nodeName: that.nodeData.nodeName,
          title: that.conform.conTitle,
          conditionExpression: that.conform.condition,
        }
        this.$emit("nodeChange", params);
      })
    },
    // 取消cancel
    cancelForm(){
      this.$emit("cancel");
    }
  }
}
</script>
<style>
.attri-container .el-checkbox {
    display: block;
} 
.attri-container .el-form-item__content {
  text-align: left;
}
.attri-container .el-select {
  width: 100%;
}
</style>
<style scoped>
.footer{
  margin-top: 30px;
}

.cancel-btn {
  margin-right: 20px;
}
/* .demo-drawer__footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
} */
.attri-container .el-radio {
  line-height: 40px;
}
</style>