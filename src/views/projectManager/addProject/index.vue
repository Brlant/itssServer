<template>
  <div class="app-container">
    <div class="routerBar">
      <router-link :to="'/projectManager/proManager'"> < 新建项目</router-link>
      <span> （仅项目负责人可对此项目下列对内进行编辑）</span>
      <div class="rightBox">
        <el-button size="mini" @click="submitForm" type="primary"
          >保存</el-button
        >
        <el-button size="mini" @click="resetForm" type="default"
          >取消</el-button
        >
      </div>
    </div>
    <div class="titleBar">项目基础信息</div>

    <div class="whiteBox">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-row>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目编号：" prop="projectCode">
              <el-input
                v-model="formData.projectCode"
                placeholder="请输入项目编号："
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目名称：" prop="projectName">
              <el-input
                v-model="formData.projectName"
                placeholder="请输入项目名称："
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目阶段：" prop="projectStage">
              <el-input
                v-model="formData.projectStage"
                placeholder="请输入项目阶段："
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目类型：" prop="projectType">
              <el-select
                v-model="formData.projectType"
                placeholder="请选择项目类型："
                filterable
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in projectTypeOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="优先级：" prop="priority">
              <el-radio-group v-model="formData.priority" size="medium">
                <el-radio
                  v-for="(item, index) in priorityOptions"
                  :key="index"
                  :label="item.value"
                  :disabled="item.disabled"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item
              label="项目负责人"
              prop="projectUserId"
              style="position: relative"
            >
              <el-select
                v-model="formData.projectUserId"
                placeholder="请选择项目负责人"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in projectUserIdOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
              <span class="myTag"
                >(负责关联此项目的工时的最终审批；可对关联此项目的工单进行编辑和人员指派)</span
              >
            </el-form-item>
          </el-col>
          <el-col :span="14" :offset="1">
            <el-form-item label="服务对象" prop="projectService">
              <el-select
                v-model="formData.projectService"
                placeholder="请选择服务对象"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in projectServiceOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="项目有效期" prop="projectTimeArea">
              <el-date-picker
                type="daterange"
                v-model="formData.projectTimeArea"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :style="{ width: '100%' }"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                range-separator="至"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item label="关联机会" prop="projectChance">
              <el-select
                v-model="formData.projectChance"
                placeholder="请选择关联机会"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in projectChanceOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="titleBar">
      项目成员安排
      <div class="rightBox">
        <el-button size="mini" @click="addUserListHandel" type="primary"
          >添加成员</el-button
        >
      </div>
    </div>
    <div  class="whiteBox UserListBox">
      <el-form ref="elForm2" :model="formData" :rules="rules2" size="medium" label-width="10px">
      <div class="UserLine"  v-for="(addUserList,addUserListindex) in formData.projectUserList">
          <el-row   :gutter="24">
            <el-col :offset="1" :span="3">
              <el-form-item  prop="field101">
                <el-select
                  v-model="addUserList.userId"
                  placeholder="请选择下拉选择"
                  clearable
                  :style="{ width: '100%' }"
                >
                  <el-option
                    v-for="user in userOptions"
                    :key="user.userId"
                    :label="user.userName"
                    :value="user.userId"
                  ></el-option>
                </el-select> </el-form-item
            ></el-col>
            <el-col   :span="4">
              <el-form-item label="" prop="startEndTime">
                <el-date-picker type="daterange" v-model="addUserList.startEndTime" format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" start-placeholder="开始日期"
                  end-placeholder="结束日期" range-separator="至" @change="(dates)=>getTimeArea(dates,addUserListindex)" clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="colText">共 {{addUserList.workTime}}</span>  小时（ <span>{{addUserList.workDay}}</span> 天）</div></el-col>
            <el-col :span="5"><div class="colText">计划负荷：<span>{{addUserList.planLoad}}</span> %</div></el-col>
            <el-col :span="4"><div class="colText">预计成本：<span>{{addUserList.expectedCost}}</span> 元</div></el-col>
            <el-col :span="3"><div class="colText2">
              <el-button size="mini" @click="DelUserList(addUserListindex)" type="error">删除</el-button>
              </div>
            </el-col>
          </el-row>
            <!----------------------内部-start------------------------------>
                <el-row  :gutter="24" v-for="UserScheduleList in addUserList.projectUserScheduleList">
                        <el-col :offset="4" :span="4"> 
                          <div class="colText">{{UserScheduleList.startTime+'-'+UserScheduleList.endTime}}</div></el-col>
                        <el-col :span="4">
                          <div class="colText">每日 <el-input v-model="UserScheduleList.workTime" placeholder="请输入每日工时"  :style="{width: '40px'}"></el-input> 小时
                          </div>
                        </el-col>
                        <el-col :span="5"><div class="colText">期间计划负荷：<span>{{UserScheduleList.planLoad}}</span> %</div></el-col>
                        <el-col :span="3"><div class="colText2">
                          
                          </div>
                        </el-col>
                </el-row>
          <!----------------------内部-end------------------------------>
      </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { queryUserlist } from "@/api/system/user";
import { getTimeProcess } from "@/api/proManager/proManager";

export default {
  data() {
    return {
       // 人员 列表
      userOptions:[],
      formData: {
        /**
         * 优先级（1.最高，2.高，3.普通，4.较低）
         */
        priority: "",
        /**
         * 关联机会
         */
        projectChance: "",
        /**
         * 项目编号
         */
        projectCode: "",
        /**
         * 项目结束时间
         */
        projectEndTime: "",
        /**
         * 项目名称
         */
        projectName: "",
        /**
         * 服务对象
         */
        projectService: "",
        /**
         * 项目阶段
         */
        projectStage: "",
        /**
         * 项目开始时间
         */
        projectStartTime: "",
        /**
         * 项目类型
         */
        projectType: "",
        /**
         * 项目负责人
         */
        projectUserId: "",
        /**
         * 项目成员列表
         */
       projectUserList:[]
      },
      rules: {
        projectCode: [
          {
            required: true,
            message: "请输入项目编号：",
            trigger: "blur",
          },
        ],
        projectName: [
          {
            required: true,
            message: "请输入项目名称：",
            trigger: "blur",
          },
        ],
        projectStage: [
          {
            required: true,
            message: "请输入项目阶段：",
            trigger: "blur",
          },
        ],
        projectType: [
          {
            required: true,
            message: "请选择项目类型：",
            trigger: "change",
          },
        ],
        priority: [
          {
            required: true,
            message: "优先级：不能为空",
            trigger: "change",
          },
        ],
        projectUserId: [
          {
            required: true,
            message: "请选择项目负责人",
            trigger: "change",
          },
        ],
        projectService: [
          {
            required: true,
            message: "请选择服务对象",
            trigger: "change",
          },
        ],
        projectTimeArea: [
          {
            required: true,
            message: "项目有效期不能为空",
            trigger: "change",
          },
        ],
        projectChance: [
          {
            required: true,
            message: "请选择关联机会",
            trigger: "change",
          },
        ],
      },
      rules2:{

      },
      // 单独的 用户列表
      projectUserList:
          {
            /**
             * 结束时间
             */
            endTime: "",
            /**
             * 预计成本
             */
            expectedCost: "",
            /**
             * 计划负荷
             */
            planLoad: "",
            /**
             * 开始时间
             */
            stratTime: "",
            /**
             * 用户id
             */
            userId:"" ,
            /**
             * 总天数
             */
            workDay: "",
            /**
             * 总工时
             */
            workTime: "",
            /**
             * 项目成员排期
             */
            projectUserScheduleList: [],
          },
        projectUserScheduleList:  
              {
                /**
                 * 周期
                 */
                startTime: "",
                endTime: "",
                /**
                 * 计划负荷
                 */
                planLoad: "",
                /**
                 * 工时
                 */
                workTime: "",
              },
      projectTypeOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
      priorityOptions: [
        {
          label: "最高",
          value: 1,
        },
        {
          label: "高",
          value: 2,
        },
        {
          label: "普通",
          value: 3,
        },
        {
          label: "较低",
          value: 4,
        },
      ],
      projectUserIdOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
      projectServiceOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
      projectChanceOptions: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    };
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    /*拿到用户ID*/
    // getCheckUser(dates,index){
    //       this.formData.projectUserList[index].endTime =dates[1]

    // },
    /*根据起始和结束 生成下面表格*/
    getTimeArea(dates,index){
      console.log(dates,index);
      let parems ={
        startDate:dates[0],
        endDate:dates[1],
      }
         getTimeProcess(parems).then(res=>{
          console.log(res.data);
          this.formData.projectUserList[index].workDay = res.data.day
          this.formData.projectUserList[index].workTime = res.data.day*8
          this.formData.projectUserList[index].stratTime = dates[0]
          this.formData.projectUserList[index].endTime =dates[1]
          this.formData.projectUserList[index].expectedCost = "未知"
          this.formData.projectUserList[index].planLoad = "未知"
          res.data.list.map(item=>{
            item.startTime = item.startDate
            item.endTime = item.endDate
            item.workTime = "8"
            item.planLoad = "未知"
          })
          this.formData.projectUserList[index].projectUserScheduleList=res.data.list
          
        

      })
    },
     /* 查询用户列表 */
    getUserList(){
      queryUserlist().then(res=>{
        console.log(res.data);
        res.data.map(item=>{
          item.userName = item.userName+"（"+item.postName+"）"
        })
        this.userOptions = res.data
      })
    },
    addUserListHandel(){
      let oneUser =this.deepClone(this.projectUserList)
      console.log(oneUser);
      this.formData.projectUserList.push(oneUser)
    },
    DelUserList(index){
      this.formData.projectUserList.splice(index,1)
    },
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
  },

  beforeCreate() {
    document
      .querySelector("body,html")
      .setAttribute("style", "background-color:#E8E8F4;");
  },

  beforeDestroy() {
    document.querySelector("body,html").removeAttribute("style");
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  padding: 0;
}

.routerBar {
  a {
    color: #557db3;
  }
  span {
    font-size: 12px;
    color: #999;
  }
}
.myTag {
  color: rgb(204, 204, 204);
  font-size: 12px;
  position: absolute;
  top: 38px;
  /* border: 1px solid red; */
  width: initial;
  display: inline-block;
  left: 0px;
  height: 14px;
  line-height: 14px;
}
.colText{
  height: inherit;
  line-height: 150%;
  // background-color: beige;
  // border: 1px red solid;
  margin-top: 8.5px;
  font-size: 12px;
  color: #999;
  text-align: center;
  span{
    color: #557db3;
  }
}
</style>
<style>
  .UserLine /deep/.el-form-item{
  margin-bottom: 2px;
}
</style>
