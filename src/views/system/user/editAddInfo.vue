<template>
  <div class="app-container">
    <div class="icon">
      <div @click="backuser">
        <i class="el-icon-arrow-left"></i>
        <span>成员信息新增/编辑</span>
      </div>
      <div>
        <el-button type="primary" @click="saveDialog">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </div>
    </div>
    <div class="input-info">
      <div class="img-user">
        <img src="@/assets/images/profile.jpg" alt="" />
      </div>
      <div>
        <el-form
          ref="elForm"
          :model="formData"
          :rules="rules"
          size="medium"
          label-width="110px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="nickName">
                <el-input
                  v-model="formData.nickName"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="formData.sex">
                  <el-radio label="0">男</el-radio>
                  <el-radio label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phonenumber">
                <el-input
                  v-model="formData.phonenumber"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号" prop="userName">
                <el-input
                  v-model="formData.userName"
                  placeholder="请输入账号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="employeeNo">
                <el-input
                  v-model="formData.employeeNo"
                  placeholder="请输入工号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row>
            <el-col :span='12'>
               <el-form-item label="TB用户ID" prop="tbUserId">
                <el-input
                  v-model="formData.tbUserId"
                  placeholder="请输入TB用户ID"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
             <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="formData.email"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="git账号" prop="email">
                <el-input
                  v-model="formData.gitAccount"
                  placeholder="请输入git账号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="区域" prop='regionId'>
                <el-select
                  v-model="formData.regionId"
                  placeholder="请选择区域"

                  @change="changePosition('area')"
                  @blur="changePosition('area')"
                >
                  <el-option
                    v-for="(dict, index) in areas"
                    :key="index"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="职位类型" prop='postTypeId'>
                <el-select
                  v-model="formData.postTypeId"
                  placeholder="请选择职位类型"

                  @change="changePosition('postType')"
                  @blur="changePosition('postType')"
                >
                  <el-option
                    v-for="(dict, index) in typeList"
                    :key="index"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职位名称" prop='postNameId'>
                <el-select

                  v-model="formData.postNameId"
                  placeholder="请选择职位名称"
                  @change="changePosition('postName')"
                  @blur="changePosition('postName')"
                  :disabled="!formData.postTypeId || !formData.regionId"
                >
                  <el-option
                    v-for="(dict, index) in positions"
                    :key="index"
                    :label="dict.postName"
                    :value="dict.postNameId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="等级" prop='postLevelId'>
                <el-select
                  v-model="formData.postLevelId"
                  placeholder="请选择等级"

                  :disabled="!formData.postNameId"
                  @change='dd'
                >
                  <el-option
                    v-for="(dict, index) in levelList"
                    :key="index"
                    :label="dict.postLevelName"
                    :value="dict.postLevelId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="入职时间" prop="inTime">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="formData.inTime"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="离职时间" prop="outTime">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="formData.outTime"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item>
                <div slot="label"><i class="el-icon-lock"></i> 工作技能：</div>
                <skill-select v-model="formData.skillIds" />
              </el-form-item>
            </el-col>
          </el-row>

        <div>
          <div class="titleinfo">权限信息</div>

            <el-row>
              <el-col :span="12">
                <el-form-item label="系统角色">
                  <el-select
                    v-model="formData.roleIds"
                    multiple
                    placeholder="请选择角色"
                  >
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.roleId"
                      :label="item.roleName"
                      :value="item.roleId"
                      :disabled="item.status == 1"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="所属部门" prop="deptId">
                  <treeselect
                    v-model="formData.deptId"
                    :options="deptOptions"
                    :normalizer="normalizer"
                    :show-count="true"
                    placeholder="请选择归属部门"
                  />
                </el-form-item>
              </el-col>
            </el-row>

        </div>
         </el-form>
      </div>
    </div>
       <el-dialog
      width="20%"
      :visible.sync="saveShow"
    >
      <span style='font-size:18px;display:inline-block;padding-bottom:20px'>职位、等级信息不完整，会影响部门项目统计数值</span>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" @click="save">确定</el-button>
        <el-button @click="cancelFn">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import {
  listPost,
  getPost,
  delPost,
  addPost,
  updatePost,
  areatypePost,
} from "@/api/system/post";
import {
  getUser,
  addUser,
  positionName,
  levelList,
  updateUser,
  userDetail,
} from "@/api/system/user";
import SkillSelect from "@/components/SkillSelect/index";
import { treeselect, queryChildDepts } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import moment from "moment";
import "moment/locale/zh-cn";
export default {
  components: {
    SkillSelect,
    Treeselect,
  },
  data() {
    return {
      skillData: [],
      postId:'',
      saveShow:false,
      title:'',
      formData: {
        nickName:'',
        sex:'',
        phonenumber:'',
        userName:'',
        employeeNo:'',
        regionId:'',
        email:'',
        postTypeId:'',
        postNameId:'',
        postLevelId:'',
        tbUserId:'',
        inTime:'',
        outTime:'',
        roleIds:[],
        deptId:null,
        skillIds: [],
      },
      areas: [],
      typeList: [],
      deptOptions: [],
      input: "",
      skills: ["ss", "dd"],
      skillList: ["java", "js"],
      aa: false,
      roleOptions: [],
      skillId: [],
      positions: [],
      levelList: [],
      userId: "",
      ss: -1,
      cancelShow:false,
      rules: {
        nickName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        phonenumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        inTime: [
          { required: true, message: "请选择入职时间", trigger: "blur" },
        ],
        deptId:[{ required: true, message: "请选择所属部门", trigger: "blur" }]
      },
      isEdit: ''
    };
  },
  created() {
    this.isEdit = this.$route.query.isEdit

    if (this.$route.query.isEdit == 1) {

      let id=window.localStorage.getItem("userId")
      this.userId = id;
      this.detailInfo();
      this.position();
      this.level()
    }

    this.positinType("region");
    this.positinType("post_type");
    this.getTreeselect();
    this.role();
  },
  mounted() {
    // 表单数据回显
    const formData = sessionStorage.getItem('editAddInfo')
    if (formData) {
      this.formData = JSON.parse(formData)
    }
  },
  beforeDestroy() {
    // 没有isEdit的时候，该页面为新增
    if (!this.isEdit) {
      sessionStorage.setItem('editAddInfo', JSON.stringify(this.formData))
    }
  },
  methods: {
    cancelFn(){
      this.saveShow=false
    },

    saveDialog(){
        this.$refs["elForm"].validate((valid) => {
          if(valid){
             if(!this.formData.postNameId || !this.formData. postLevelId){
        this.saveShow=true
      }else{
        this.save()
      }
          }
        })

    },
    // 详情
    detailInfo() {
      userDetail(this.userId).then((res) => {
        console.log(res.data,'res.data')
        this.formData = res.data;
        this.formData.skillIds = res.data.userSkills.map((v) => v.skillId);
        console.log(this.formData.skillIds,'this.formData.skillIds')
        if (this.formData.regionId && this.formData.postTypeId) {
         this.positions =[res.data]
         if(this.formData.postNameId){
         this.levelList =  this.positions;
         this.levelList.forEach(i=>{
          i.postLevelName=i.postLevel
         })
         }
        }
        // if (this.formData.postNameId) {
        //   this.level();
        // }
      });
      // );
    },
    workSkill(data) {
      this.skillId = [];
      data.forEach((i) => {
        this.formData.skillId.push(i.dictCode);
      });

      console.log(this.skillId, "data");
    },
    position() {
      if (this.formData.regionId) {
        let data = {
          regionId: this.formData.regionId,
          postTypeId: this.formData.postTypeId,
        };
        positionName(data).then((res) => {
          this.positions = res.data;
        });
      }
    },
    level() {
      if (this.formData.regionId && this.formData.postTypeId) {
        let data = {
          regionId: this.formData.regionId,
          postTypeId: this.formData.postTypeId,
          postNameId: this.formData.postNameId,
        };
        levelList(data).then((res) => {
          this.levelList = res.data;
        });
      }
    },
    changePosition(index){
      if(index == 'area'){
        this.position()
         this.formData.postNameId=''
          this.formData.postLevelId=''
          this.formData.postLevelName=''
          this.formData.postName=''
         console.log(this.formData.postLevelId,'this.formData.postLevelId')
      }else if(index == 'postType'){
        this.position()
       this.formData.postNameId=''
        this.formData.postLevelId=''
           this.formData.postLevelName=''
       this.formData.postName=''
      }else if(index == 'postName'){
        this.level()
         this.formData.postLevelId=''
      }

    },
    dd(){
      if(this.levelList){
        console.log('aaaa',this.formData.postLevelId)
        this.levelList.forEach(item=>{
          if(item.postLevelId==this.formData.postLevelId){
            console.log(item.postId)
            this.postId=item.postId
          }
        })
      }
    },
    //保存
    save() {
      if (this.$route.query.isEdit == 1) {

        this.$refs["elForm"].validate((valid) => {
          // console.log(this.formData.skillIds,'this.formData.skillIds')
          if (valid) {
            this.formData.inTime = moment(this.formData.inTime).format(
              "YYYY-MM-DD"
            );
            // this.formData.userId = this.userId
             this.formData.outTime = this.formData.outTime ? moment(this.formData.outTime).format("YYYY-MM-DD") : ''
           this.formData.postId = this.postId ? this.postId : ''
           // this.formData.postId=
            // this.formData.outTime = moment(this.formData.outTime).format(
            //   "YYYY-MM-DD"
            // );
           let data = {
              ...this.formData,
            };

            console.log(data, "ssssssssss");

            updateUser(data).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                //  this.detailInfo();
                this.$router.go(-1)
              }
            });
          }
        });
      } else {
        this.$refs.elForm.validate((valid) => {
          console.log(valid)
          if (valid) {
            this.formData.inTime = moment(this.formData.inTime).format(
              "YYYY-MM-DD"
            );
            this.formData.outTime = this.formData.outTime ? moment(this.formData.outTime).format("YYYY-MM-DD") : ''
             this.formData.postId = this.postId ? this.postId : ''
            let data = {
              ...this.formData,
            };
            console.log(data, "ssssssssss");
            addUser(data).then((res) => {
              if (res.code == 200) {
                this.$message.success(res.msg);

                this.$refs.elForm.resetFields()

                const obj = {
                  path: "/system/user",
                };
                // getToday()
                this.$tab.closeOpenPage(obj);
              }
            });
          }
        });
      }
    },
    //取消
    cancle() {
    //  this.cancelShow=true
     if(this.$route.query.isEdit == 1){

       this.$confirm(`当前页面修改内容尚未保存，是否确认退出？`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.$refs["elForm"].resetFields();
             this.$router.go(-1)
        })
        .catch(() => {});

     }else{
       this.$confirm(`此操作会重置本页面所有填写的内容!`, "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs["elForm"].resetFields();
          this.$router.go(-1)
        })
        .catch(() => {});
     }


    },

    cancelForm(){
      this.cancelShow=false
    },
    /*查询字典的接口*/
    positinType(val) {
      areatypePost(val).then((res) => {
        if (val == "region") {
          this.areas = res.data;
        } else if (val == "post_type") {
          this.typeList = res.data;
        }
      });
    },
    role() {
      getUser().then((response) => {
        // if(response)
        // response.posts.map((item,i)=>{
        //   item.postName =  item.regionName+'-'+item.postName+'-'+item.postLevel
        // })

        this.roleOptions = response.roles;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      /*treeselect().then((response) => {
        this.deptOptions = response.data;
      });*/
      let params = {
        deptId:  this.$store.state.user.user.deptId
      }
      queryChildDepts(params).then(res => {
        this.deptOptions = res.data
      })
    },

    normalizer(node) {
      //当子节点也就是children=[]时候去掉子节点
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      };
    },

    //添加技能
    addSkill() {},
    isDel(index) {
      console.log(index);
      this.ss = index;
    },
    //返回
    backuser() {
      // const obj = {
      //   path: "/system/user",
      // };
      // // getToday()
      // this.$tab.closeOpenPage(obj);
      this.$router.go(-1)
    },
  },
};
</script>
<style lang="scss" scoped>
.icon {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  color: #3d7dff;
}
.img-user {
  display: inline-block;
  img {
    width: 80px;
    height: 80px;
    border-radius: 40px;
  }
}
.skill {
  height: 40px;
  line-height: 40px;
  .skillColor {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background: red;
    margin: 0 10px;
  }
  .skillName {
    display: inline-block;
    margin-right: 200px;
  }
}
.workSkill {
  display: inline-block;
  div {
    display: inline-block;
    min-width: 100px;
    border-radius: 20px;
    background: red;
    text-align: center;
    padding: 5px 10px;
    margin-right: 20px;
    color: #ffffff;
  }
}
.input-info {
  display: flex;
}
.titleinfo {
  height: 50px;
  width: 100%;
  display: block;
  text-indent: 20px;
  line-height: 50px;
  font-size: 18px;
  position: relative;
}
.titleinfo::before {
  content: "|";
  width: 1px;
  height: 30px;
  background-color: #333;
  border: none;
  font-size: 16px;
  margin-right: 10px;
}
</style>
