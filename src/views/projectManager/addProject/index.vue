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

    <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <div class="whiteBox">
            <el-row>
              <el-col :span="10" :offset="1">
                <el-form-item label="项目编号：" prop="projectCode">
                  <el-input
                    v-model="formData.projectCode"
                    placeholder="请输入项目编号"
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
                    placeholder="请输入项目名称"
                    clearable
                    :style="{ width: '100%' }"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="1">
                <el-form-item label="项目阶段：" prop="projectStage">
                  <el-select
                    v-model="formData.projectStage"
                    placeholder="请选择项目阶段"
                    filterable
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <el-option
                      v-for="(dict, index) in projectStageOptions"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="1">
                <el-form-item label="项目类型：" prop="projectType">
                  <el-select
                    v-model="formData.projectType"
                    placeholder="请选择项目类型"
                    filterable
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <el-option
                      v-for="(dict, index) in projectTypeOptions"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
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
                      >                     
                        <b :class="['priority'+item.value]">
                          {{ item.label }}
                        </b>
                    
                      </el-radio
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
                      v-for="(user, index) in projectUserIdOptions"
                      :key="user.userId"
                      :label="user.userName"
                      :value="user.userId"
                      :disabled="user.disabled"
                    ></el-option>
                  </el-select>
                  <span class="myTag"
                    >(负责关联此项目的工时的最终审批；可对关联此项目的工单进行编辑和人员指派)</span
                  >
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" :offset="1">
                <el-form-item label="服务对象" prop="projectService">
                  <el-select
                    v-model="formData.projectService"
                    placeholder="请选择服务对象"
                    clearable
                    :style="{ width: '100%' }"
                  >
                    <el-option
                      v-for="(dict, index) in projectServiceOptions"
                      :key="index"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <el-col :span="10" :offset="1">
                  
                <el-form-item label="GitLab地址" prop="projectGitUrl">
                      <el-input
                    v-model="formData.projectGitUrl"
                    placeholder="请输入GitLab地址"
                    show-word-limit
                    clearable
                    :style="{ width: '100%' }"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
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
                    @change="getProjectTimeArea"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="10" :offset="1">
                <!-- <el-form-item label="关联机会" prop="projectChance">
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
                </el-form-item> -->
              </el-col>
            </el-row>
          
        </div>
        <div class="titleBar">
          项目成员安排
          <div class="rightBox">
            <el-button size="mini" @click="addUserListHandel" type="primary"
              >添加成员</el-button
            >
          </div>
        </div>
        <div class="whiteBox UserListBox">
        
            <div
              class="UserLine"
              v-for="(addUserList, addUserListindex) in formData.projectUserList"
            >
              <el-row >
                <el-col   :span="4">
                  <el-form-item :prop="`projectUserList.${addUserListindex}.userId`" :rules="rules.projectUserListAllUserId">
                    <el-select
                      v-model="addUserList.userId"
                      placeholder="请选择项目成员"
                      clearable @change="(userId)=>{getUserCost(userId,addUserListindex)}"
                      :style="{ width: '100%' }"
                    >
                      <el-option
                        v-for="user in userOptions"
                        :key="user.userId"
                        :label="user.userNameAndPost"
                        :value="user.userId"
                      ></el-option>
                    </el-select> </el-form-item
                ></el-col>
                <el-col :span="5">
                  <el-form-item label="" :prop="`projectUserList.${addUserListindex}.startEndTime`" :rules="rules.projectUserListAllStartEndTime">
                    <el-date-picker
                      type="daterange"
                      v-model="addUserList.startEndTime"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :style="{ width: '100%' }"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      range-separator="至"  
                      :picker-options="childDateArea"                    
                      @change="(dates) => getTimeArea(dates, addUserListindex)"
                      clearable
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <div class="colText">
                    共 <span>{{ addUserList.workTime }}</span> 小时（
                    <span>{{ addUserList.workDay }}</span> 天）
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="colText">
                    计划负荷：<span>{{ addUserList.planLoad }}</span> %
                  </div></el-col
                >
                <el-col :span="4"
                  ><div class="colText">
                    预计成本：<span>{{ addUserList.expectedCost }}</span> 元
                  </div></el-col
                >
                <el-col :span="3"
                  ><div class="colText2">
                    <el-button
                      size="mini"
                      @click="DelUserList(addUserListindex)"
                      type="error"
                      >删除</el-button
                    >
                  </div>
                </el-col>
              </el-row>
              <!----------------------内部-start------------------------------>
              <el-row
              
                v-for="(
                  UserScheduleList, UserScheduleListIndex
                ) in addUserList.projectUserScheduleList"
              >
                <el-col :offset="5" :span="4">
                  <div class="colText" style="text-indent:30px">
                    {{
                      UserScheduleList.startTime + "-" + UserScheduleList.endTime
                    }}
                  </div></el-col
                >
                <el-col :span="3">
                  <div class="colText">
                    每日
                    <el-input-number
                      size="mini"
                      :style="{ width: '100px' }"
                      v-model="UserScheduleList.workTime"
                      :min="0"
                      :max="24"
                      @change="
                        (number) => {
                          changeDayTime(
                            number,
                            UserScheduleList.day,
                            addUserListindex,
                            UserScheduleListIndex
                          );
                        }
                      "
                    ></el-input-number>
                    小时
                  </div>
                </el-col>
                <el-col :span="5"
                  ><div class="colText">
                    期间计划负荷：<span>{{ UserScheduleList.planLoad }}</span> %
                  </div></el-col
                >
                <el-col :span="3"><div class="colText2"></div> </el-col>
              </el-row>
              <!----------------------内部-end------------------------------>
            </div>
        </div>
    </el-form>
  </div>
</template>
<script>
import {
  getTimeProcess,
  queryUserlist,
  queryDict,
  addProjectList,searchProjectList
} from "@/api/proManager/proManager";

export default {
  data() {
    return {
      childDateArea:{
      // 项目成员安排的 可选时间区间
        disabledDate:(time)=> {
            if(this.formData.projectTimeArea&&this.formData.projectTimeArea.length>1){
              // 设置可以选择的区间 时间为项目的 起始日期和结束日期
            return time.getTime()>new Date(this.formData.projectTimeArea[1]).getTime()||time.getTime()<new Date(this.formData.projectTimeArea[0]).getTime()-8.64e7
            }           
          }
        },
      // 人员 列表
      userOptions: [],
      formData: {        
        priority: 3,/**优先级（1.最高，2.高，3.普通，4.较低）*/        
        projectChance: "",/**关联机会*/        
        projectCode: "",/**项目编号*/        
        projectEndTime: "",/**项目结束时间*/        
        projectName: "",/**项目名称*/        
        projectService: "",/**服务对象*/        
        projectStage: "",/**项目阶段*/        
        projectStartTime: "",/**项目开始时间*/        
        projectType: "",/**项目类型*/        
        projectUserId: "",/**项目负责人*/        
        projectUserList: [],/**项目成员列表*/
        projectGitUrl:"",// 项目git 地址
        // "priority": 3,  快速调试
        // "projectChance": "",
        // "projectCode": "123",
        // "projectEndTime": "2022-11-30",
        // "projectName": "123",
        // "projectService": 1,
        // "projectStage": 128,
        // "projectStartTime": "2022-10-01",
        // "projectType": 123,
        // "projectUserId": 107,
        // "projectUserList": [],
        // "projectGitUrl": "123",
        // "projectTimeArea": [
        // "2022-10-01",
        // "2022-11-30"
        // ]
      },
      rules: {
         "projectUserListAllUserId": [
          {
            required: true,
            message: "请选择项目成员",
            trigger: "change",
          },
        ],
           "projectGitUrl": [
          {
            required: true,
            message: "请输入GitLab地址",
            trigger: "blur",
          },
        ],
        "projectUserListAllStartEndTime": [
          {
            required: true,
            message: "请选择参与时间",
            trigger: "change",
          },
        ],
          
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
            trigger: "change",
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
        // projectChance: [
        //   {
        //     required: true,
        //     message: "请选择关联机会",
        //     trigger: "change",
        //   },
        // ],
      },
      // 单独的 用户列表
      projectUserList: {        
        endTime: "",/**结束时间*/        
        expectedCost: "",/**预计成本*/        
        planLoad: "",/**计划负荷*/        
        startTime: "",/**开始时间*/        
        userId: "",/**用户id*/        
        workDay: "",/**总天数*/        
        workTime: "",/**总工时*/        
        projectUserScheduleList: [],/**项目成员排期*/
      },
      projectUserScheduleList: {
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
      projectStageOptions: [],
      projectTypeOptions: [],
      priorityOptions: [   {
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
        },],
      projectUserIdOptions: [],
      projectServiceOptions: [
           {
          label: "对内",
          value: 1,
        },
        {
          label: "对外",
          value: 2,
        }
      ],
      projectChanceOptions: [{
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
    this.getUserList();
    this.getDictList("project_phase"); // 项目阶段 project_phase
    this.getDictList("project_type"); // 项目类型 project_type
    // this.getDictList("serivce_obj_type"); // 服务对象 serivce_obj_type
    // this.getDictList("project_priority"); // 项目优先级

    
    // 页面默认点击一下  添加成员
    // this.addUserListHandel()
    
  },
  methods: {
    // 添加人员之后  根据 对内 还是对外  设置 选择人员的成本 
    // 存储到 单行的 新建字段 costNum 内 用于下一步存储  计算
    getUserCost(userId,index){
      //  此处 故意调用一次 用户的请求，用于规避 回显用户列表的bug
        let data = {
          userId:userId
        }
      queryUserlist(data).then((res) => {
         res.data.map((item) => {
          item.userNameAndPost = item.userName + "（" + item.postName + "）";
        });
        // formData.projectUserList[index].costNum  
        // costNum 是我自己设置第一个值 用于存储 成本的单位
        //  对外
        // this.userOptions = res.data;
        // 服务对象(1.对内，2.对外)
        if(this.formData.projectService==2){ //对外
          this.formData.projectUserList[index].costNum = res.data[0].costOut
        }else{  // 对内
          this.formData.projectUserList[index].costNum = res.data[0].costIn
          }
        // this.projectUserIdOptions = res.data;
        if(this.formData.projectUserList[index].userId!=""){// 添加成员之后，未选择用户的情况下 不筛选
           let userIdsTemp = []
           this.formData.projectUserList.map(item=>{
            // 拿到已经存在的用户id
            userIdsTemp.push(item.userId)
           })
           this.userOptions.map((user,u)=>{
            userIdsTemp.map((userId,i)=>{
              if(user.userId==userId){
                // 双层循环 去掉已经选择的用户
                this.userOptions.splice(u,1)
              }
            })
           })

        }
      });
      
    },
    /*修改每日工时*/
    changeDayTime(number, day, fatherIndex, myIndex) {
      // 期间计划负荷 = 当前行的总天数day*number  /  当前行的总天数day * 8
      this.formData.projectUserList[fatherIndex].projectUserScheduleList[
        myIndex
      ].planLoad = (((day * number) / (day * 8)) * 100 || 0).toFixed(2);
      // 循环 取出每周的工作时长
      let totalTime = 0,
        totalDay = 0;
      this.formData.projectUserList[fatherIndex].projectUserScheduleList.map(
        (item, i) => {
          if (myIndex == i) {
            // 当前周的工时 转换为天数  计算一下
            // 当前周的天数* 实际工作时长 除以8
            // 等于 实际工作天数

            totalDay += parseFloat(item.day * number);
          } else {
            // 其他的没有修改的 直接 拿天数累加
            totalDay += parseFloat(item.day * item.workTime);
          }
          totalTime += parseFloat(item.workTime) * parseFloat(item.day);
          item.weekDay = item.day
          item.week = item.weekOfYear
        }
      );

      // 暂存一下 实际的天数
      const tempWorkDay =
        this.formData.projectUserList[fatherIndex].workDayTemp;
      console.log(tempWorkDay);
      // 顶部的 共计多少小时  多少天
      this.formData.projectUserList[fatherIndex].workDay = totalDay / 8;
      this.formData.projectUserList[fatherIndex].workTime = totalTime;
      // 顶部的 计划负荷 预计成本
      console.log( totalDay);
      console.log( tempWorkDay)
      this.formData.projectUserList[fatherIndex].planLoad = (
        (totalDay / (tempWorkDay * 8)) *
        100
      ).toFixed(2);
      this.formData.projectUserList[fatherIndex].expectedCost = (this.formData.projectUserList[fatherIndex].workDay*this.formData.projectUserList[fatherIndex].costNum).toFixed(2) ;
    },
    /*选择项目有效期*/
    getProjectTimeArea(dates) {
      this.formData.projectStartTime = dates[0];
      this.formData.projectEndTime = dates[1];      
    },
   
    /*根据起始和结束 生成下面表格*/
    getTimeArea(dates, index) {
          let params = {
            startDate: dates[0],
            endDate: dates[1],
          };
          getTimeProcess(params).then((res) => {
            this.formData.projectUserList[index].workDay = res.data.day;
            this.formData.projectUserList[index].workDayTemp = res.data.day;
            this.formData.projectUserList[index].workTime = res.data.day * 8;
            this.formData.projectUserList[index].startTime = dates[0];
            this.formData.projectUserList[index].endTime = dates[1];
            this.formData.projectUserList[index].expectedCost = (res.data.day*this.formData.projectUserList[index].costNum).toFixed(2) ;
            res.data.list.map((item) => {
              item.startTime = item.startDate;
              item.endTime = item.endDate;
              item.workTime = "8";
              item.planLoad = (((item.day * 8) / (item.day * 8)) * 100 || 0).toFixed(2);
            });
            this.formData.projectUserList[index].projectUserScheduleList =
              res.data.list; // 此人的 每周安排
            this.formData.projectUserList[index].planLoad = 
              (((8 * res.data.day) / (res.data.day * 8)) * 100).toFixed(2); // 计划负荷
          });
    },
    /*查询字典的接口*/
    getDictList(dictCode) {
      queryDict(dictCode).then((res) => {
        if (dictCode == "project_phase") {
          this.projectStageOptions = res.data;
        }
        if (dictCode == "project_type") {
          this.projectTypeOptions = res.data;
        }
        // if (dictCode == "serivce_obj_type") {
        //   this.projectServiceOptions = res.data;
        // }
        // if(dictCode=="project_priority"){
        //   this.priorityOptions= res.data
        // }
      });
    },
    /* 查询用户列表 */
    getUserList() {
      let data = {}
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.userName + "（" + item.postName + "）";
        });
        this.projectUserIdOptions = res.data;// 初始化填充给 项目负责人的 永远是所有用户
        this.userOptions = res.data; // 需要根据已经选择的人 来过滤
      });
      
    },
    // 点击 新增用户的
    addUserListHandel() {
      //  if(this.formData.projectService==""){
      //         this.$message.error("请您先完整填写项目基础信息！");
      //   }
         this.$refs["elForm"].validate((valid) => {
           if (!valid) return;
        // TODO 上面基础信息填写好 再填写下面，因为需要用到上面的 服务对象和项目有效期
        if (valid) {
             
            let oneUser = this.deepClone(this.projectUserList);
            this.formData.projectUserList.push(oneUser);
             let data = {}
            queryUserlist(data).then((res) => {
              res.data.map((item) => {
                item.userNameAndPost = item.userName + "（" + item.postName + "）";
              });
                this.formData.projectUserList.map((item,i)=>{
                  res.data.map((user,u)=>{
                    if(item.userId!=""&&item.userId==user.userId){
                     res.data.splice(u,1)
                    }

                  })
                })
                this.userOptions = res.data; // 需要根据已经选择的人 来过滤
            });
        }
      });

    },
    // 删除单行用户的
    DelUserList(index) {
      // 点击删除之后，重新获取userOptions 做一次剔除
        let data = {}
      queryUserlist(data).then((res) => {
        res.data.map((item) => {
          item.userNameAndPost = item.userName + "（" + item.postName + "）";
        });
        this.userOptions = res.data; // 需要根据已经选择的人 来过滤
      });
      this.formData.projectUserList.map((item,i)=>{
        this.userOptions.map((user,u)=>{
          if(item.userId==user.userId){
            this.userOptions.splice(u,1)
          }

        })
      })
      this.formData.projectUserList.splice(index, 1);
    },
    // 保存 addProjectList 新增用户信息的
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
        if (valid) {
          this.formData.projectUserList.map((item,i)=>{
            // 存储的字段被架构师修改掉 导致 提交的时候 需要修改一下
            item.projectUserScheduleList.map((jtem)=>{
                jtem.week = jtem.weekOfYear
                jtem.weekDay = jtem.day
            })
          })
            let parame = {
              ...this.formData,
              // carrierId:this.temData.carrierId,
              // status:0
            };
            addProjectList(parame).then((res) => {
              let { code,msg } = res;
              this.$message.success(msg);
              if(+code==200){
                this.$router.push("/projectManager/proManager")
              }
            });
           
        }
      });
    },
    // 取消重置表单的
    resetForm() {
        this.$confirm(`此操作会重置本页面所有填写的内容!`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {

          this.$refs["elForm"].resetFields();
        }).catch(()=>{

        })
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
.UserLine{
      border-bottom: 1px #efefef solid;
    padding-bottom: 10px;
    margin-bottom: 10px;
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
  top: 40px;
  /* border: 1px solid red; */
  width: initial;
  display: inline-block;
  right: 8px;
  height: 14px;
  line-height: 14px;
}
.colText {
  height: inherit;
  line-height: 150%;
  // background-color: beige;
  // border: 1px red solid;
  margin-top: 8.5px;
  font-size: 12px;
  color: #999;
  text-align: center;
  span {
    color: #557db3;
  }
}
  .priority4 {
      color: #909399;
    }
    .priority3 {
      color: #409eff;
    }
    .priority2 {
      color: #e6a23c;
    }
    .priority1 {
      color: #f56c6c;
    }
</style>
<style>
.UserLine /deep/.el-form-item {
  margin-bottom: 2px;
}
</style>
