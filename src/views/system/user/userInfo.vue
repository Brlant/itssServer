<template>
    <div class='app-container'>
        <div>成员信息</div>
        <div class='icon'>
            <div @click='goBack' style='cursor: pointer;'>
                <i class='el-icon-arrow-left'></i>
                <span>返回</span>
            </div>
            <div style='cursor: pointer;'>
                <!-- <span @click='sendInvitation' v-hasPermi="['system:user:add']">发送邀请 |</span> -->
              <span @click='onGrant' v-hasPermi="['system:user:grant']">授权管理 |</span>
                <span v-hasPermi="['system:user:add']">
                    <span @click='skillLock(1)' v-if='info.skillLock==0'> 技能锁定 |</span><span @click='skillLock(0)'  v-if='info.skillLock==1'> 技能解锁 |</span>
                </span>

                <span @click='editInfo'  v-hasPermi="['system:user:add']" > 编辑 |</span>
                <span v-hasPermi="['system:user:add']"><span @click='stop(1)' v-if='info.status==0'> 停用 |</span><span @click='stop(0)' v-if='info.status==1'> 启用 |</span></span>

                <span @click='del' v-hasPermi="['system:user:add']"> 删除</span>
            </div>
        </div>
        <div>
            <div>
                <div class='img-user'>
                    <img src="@/assets/images/profile.jpg" alt="">
                </div>
                <span class='user-name'>
                    <span>{{info.nickName}}</span>
                    <i class='el-icon-male' v-if='info.sex==0' style='color:#3d7dff;margin-left:10px;'></i>
                    <i class='el-icon-male'  v-if='info.sex==1' style='color:pink;margin-left:10px;'></i>
                </span>
            </div>
            <div>
                <div style="margin:20px;font-size:18px;">
                    <span style="color:red">*</span>
                    <span class='title'>手机号:</span>
                    <span>{{info.phonenumber}}</span>
                </div>
                 <div style="margin:20px;font-size:18px;">
                    <span style="color:red">*</span>
                    <span class='title'>账号:</span>
                    <span>{{info.userName}}</span>
                </div>
                 <div style="margin:20px;font-size:18px;">

                    <span class='title'>工号:</span>
                    <span>{{info.employeeNo}}</span>
                </div>
                 <div style="margin:20px;font-size:18px;">

                    <span class='title'>TB用户ID:</span>
                    <span>{{info.tbUserId}}</span>
                </div>
                 <div style="margin:20px;font-size:18px;">

                    <span class='title'>邮箱:</span>
                    <span>{{info.email}}</span>
                </div>
                 <div style="margin:20px;font-size:18px;">

                    <span class='title'>git账号:</span>
                    <span>{{info.gitAccount}}</span>
                </div>
                   <div style="margin:20px;font-size:18px;">

                    <span class='title'>区域:</span>
                    <span>{{info.regionName}}</span>
                </div>
                  <div style="margin:20px;font-size:18px;">

                    <span class='title'>职位类型:</span>
                    <span class="content">{{info.postType}}</span>
                    <span class='title'>职位名称:</span>
                    <span class="content">{{info.postName}}</span>
                    <span class='title'>等级:</span>
                    <span class="content">{{info.postLevel}}</span>
                </div>
                   <div style="margin:20px;font-size:18px;">

                    <span class='title'>入职时间:</span>
                    <span class="content">{{info.inTime}}</span>
                    <span class='title'>离职时间:</span>
                    <span>{{info.outTime}}</span>

                </div>
                 <div style="margin:20px;font-size:18px;">
                  <i class='el-icon-unlock' v-if='info.skillLock==0'></i>
                   <i class='el-icon-lock' v-if='info.skillLock==1'></i>
                    <span class='title'>工作技能:</span>
                    <span class='work' v-for='(item,index) in info.userSkills' :key='index' :style="{background: matchColor(item.cssClass)}">{{item.skillName}}</span>
                    <div v-if='info.skillLock==1' style='padding:10px 0px 0px 100px;font-size:12px;color:#a8b5c1;'>*改技能锁定后，该成员本人将无法修改技能</div>
                </div>
            </div>
        </div>
        <div>
             <div class="titleinfo">权限信息</div>
            <div style="font-size:18px;">
                   <div style="margin:20px;font-size:18px;">

                    <span class='title'>系统角色:</span>
                    <span v-for='(item,index) in info.roles' :key='index'>
                        <span>{{item.roleName}}</span>
                        <span v-if='index<info.roles.length-1'>,</span>
                    </span>
                </div>
                  <div style="margin:20px;font-size:18px;">

                    <span class='title'>所属部门:</span>
                    <span v-if='info.dept' class="content">{{info.dept.deptName}}</span>
                    <span class='title'>负责人:</span>
                    <span v-if='info.dept' class="content">{{info.dept.leaderName}}</span>
                </div>
            </div>
        </div>

    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="grantDialog"
      title="授权管理"
      @close="grantDialog = false"
    >
      <div class="grant-content">
        <div class="grant-left">
          <el-form ref="grantForm" :model="grantForm" :rules="grantRules">
            <el-form-item label="授权给" prop="grantTo">
              <el-select
                v-model="grantForm.grantTo"
                clearable
                filterable
                :loading="loading"
                remote
                :remote-method="getGrantUserlist"
                @click.native="getGrantUserlist('')"
              >
                <el-option
                  v-for="item in grantUserlist"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="grantLoading"
                @click="onGrantSubmit"
              >
                确定
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="grant-right">
          <!--    授权给其他人列表      -->
          <div class="grant-right-top">
            <div class="grant-title">
              授权给其他人：
            </div>
            <el-table
              v-loading="grantFromLoading"
              :data="grantFromList"
              style="min-width: 500px"
              border>
              <el-table-column label="已授权用户" prop="grantToName"/>
              <el-table-column label="授权时间" prop="createTime"/>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="cancelGrant(scope.row,'grantFrom')"
                  >
                    取消授权
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="custom-pagination"
              v-show="grantFromTotal>0"
              :total="grantFromTotal"
              :page.sync="queryGrantFromParams.pageNum"
              :limit.sync="queryGrantFromParams.pageSize"
              @pagination="getGrantFromList"
            />
          </div>

          <!--    授权给我列表      -->
          <div class="grant-right-bottom">
            <div class="grant-title">
              授权给我：
            </div>
            <el-table
              v-loading="grantToLoading"
              :data="grantToList"
              style="min-width: 500px"
              border>
              <el-table-column label="已授权用户" prop="grantToName"/>
              <el-table-column label="授权时间" prop="createTime"/>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="cancelGrant(scope.row,'grantTo')"
                  >
                    取消授权
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              class="custom-pagination"
              v-show="grantToTotal>0"
              :total="grantToTotal"
              :page.sync="queryGrantToParams.pageNum"
              :limit.sync="queryGrantToParams.pageSize"
              @pagination="getGrantToList"
            />
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>

import {
  userDetail,
  stopUse,
  skillLocking,
  delUser,
  addSysGrant,
  grantToList,
  grantFromList,
  deleteGrant,
  queryGrantUserlist
} from "@/api/system/user";
import { dictDataAll } from '@/api/dataDict'
import { color } from '@/components/ColorSelect/options'
export default {
  data(){
    return{
        userId:this.$route.query.userId,
        info:{},
        // deptId:this.$route.query.deptId,
        // deptTitle:this.$route.query.deptTitle

      grantDialog: false,

      // 授权管理表单入参
      grantForm: {
        grantTo: ''
      },
      grantRules: {
        grantTo: [
          {
            required: true,
            message: "请选择被授权人",
            trigger: "change"
          }
        ],
      },
      grantLoading: false,
      // 可授权人员列表
      grantUserlist: [],
      loading: false,

      /** 我授权人 */
      grantFromLoading: false,
      // 查询我授权人参数
      queryGrantFromParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 我授权给人条数
      grantFromTotal: 0,
      // 我授权给人的列表
      grantFromList: [],

      /** 授权给我 */
      grantToLoading: false,
      // 查询授权给我参数
      queryGrantToParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 授权给我条数
      grantToTotal: 0,
      // 授权给我的列表
      grantToList: []
    }
  },

  created(){
    this.detailInfo()
      this.getSkills()
    // window.localStorage.setItem('depttId',this.$route.query.deptId)
    // window.localStorage.setItem('deptTitle',this.$route.query.deptTitle)
  },

  methods:{
     getSkills() {
      const params = {
        dictType: 'skill_type',
        status: '0'
      }
      dictDataAll(params).then(res => {
        let { rows } = res
        rows.forEach(v => v.tick = false)
        sessionStorage.setItem('skills', JSON.stringify(rows))
      })
    },

    // 详情
    detailInfo(){
        userDetail(this.userId).then(res=>{
            this.info=res.data

        })
    },

    //返回
    goBack(){
    //     const obj = {
    //         path: "/system/user",
    //         query:{deptId:this.deptId,deptTitle:this.deptTitle}
    //     };
    //   this.$tab.closeOpenPage(obj);
    this.$router.go(-1)
    },

    //编辑
    editInfo(){
         window.localStorage.setItem("userId",this.info.userId)
        const obj = { path:'/system/user-auth/editAddInfo',query:{userInfo:this.info,isEdit:1}};
            // getToday()
        this.$tab.closeOpenPage(obj);
    },

    //发送邀请
    sendInvitation(){

    },

    // 授权管理
    onGrant()
    {
      // this.$refs["grantForm"].resetFields();
      this.grantDialog = true
      this.getGrantUserlist();
      this.getGrantFromList();
      this.getGrantToList();
    },

    // 保存授权给
    onGrantSubmit()
    {
      this.$refs['grantForm'].validate(valid =>
      {
        if (!valid)
        {
          return
        }
        let grantToName = this.grantUserlist.find(item => item.userId == this.grantForm.grantTo).nickName
        let params = {
          grantFrom: this.info.userId,
          grantFromName: this.info.nickName,
          grantTo: this.grantForm.grantTo,
          grantToName: grantToName,
          // readable: '',
          // writable: '',
        };
        // console.log("params===", params);
        this.grantLoading = true
        addSysGrant(params)
          .then((res) =>
          {
            let {
              code,
              msg
            } = res;
            this.$message.success(msg);
            this.$refs.grantForm.resetFields();
            this.grantLoading = false
            this.getGrantFromList();
          })
          .catch(() =>
          {
            this.grantLoading = false
          });
      })
    },

    // 查询授权给其他人列表
    getGrantFromList()
    {
      this.grantFromLoading = true
      grantFromList(this.queryGrantFromParams)
        .then(res =>
        {
          this.grantFromList = res.rows
          this.grantFromTotal = res.total
          this.grantFromLoading = false
        })
        .catch(() =>
        {
          this.grantFromLoading = false
        })
    },

    // 查询授权给我列表
    getGrantToList()
    {
      this.grantToLoading = true
      grantToList(this.queryGrantToParams)
        .then(res =>
        {
          this.grantToList = res.rows
          this.grantToTotal = res.total
          this.grantToLoading = false
        })
        .catch(() =>
        {
          this.grantToLoading = false
        })
    },

    // 查询可授权人员列表
    getGrantUserlist(query)
    {
      this.loading = true;
      queryGrantUserlist({nickName: query})
        .then(res =>
        {
          this.loading = false;
          this.grantUserlist = res.data
        })
        .catch(() =>
        {
          this.loading = false;
          this.grantUserlist = [];
        })
    },

    // 取消授权
    cancelGrant(row, source)
    {
      this.$confirm('确认取消授权吗？', '提示', {
        type: 'warning'
      })
          .then(() =>
          {
            deleteGrant(row.id)
              .then(res =>
              {
                this.$message({
                  type: 'success',
                  message: '取消授权成功'
                });
                if (source == 'grantFrom')
                {
                  this.getGrantFromList()
                }
                if (source == 'grantTo')
                {
                  this.getGrantToList()
                }
              })
          })
          .catch(() =>
          {
          })
    },

    //技能锁定
    skillLock(code){
        skillLocking({skillLock:code,userId:this.userId}).then(res=>{
            if(res.code==200){
                this.$message.success(res.msg)
                this.detailInfo()
            }
        })
    },

    //停用
    stop(code){
         stopUse({status:code,userId:this.userId}).then(res=>{
        if(res.code==200){
          this.$message.success(res.msg)
          this.detailInfo()
        }

      })
    },

    //删除
    del(){
        delUser(this.userId).then(res=>{
            if(res.code==200){
                this.$message.success(res.msg)
                // this.detailInfo()
                 this.$router.go(-1)
            }

        })
    },
     // 匹配颜色
    matchColor(cssClass) {
      if (cssClass) {
        return color.find(v => v.cssClass === cssClass).color
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.icon{
    margin:10px 0;
    display: flex;
    justify-content: space-between;
    background:#E8E8F4;
    height:30px;
    line-height:30px;
    color: #3d7dff;
    padding:0px 10px;
}
.img-user{
    display: inline-block;
    img{
    width:80px;
    height:80px;
    border-radius: 40px;
    }


}
  .user-name{
         display: inline-block;
         height:80px;
        vertical-align: top;
        line-height: 80px;
        margin-left:20px;
        font-size:18px;
    }
.title{
    display: inline-block;
    min-width:60px;
    padding:0 20px;
    text-align:right;
    margin-right:10px;
    color:#a8b5c1;
}
.content{
    margin-right:15px;
}
.work{
    display: inline-block;
    min-width:100px;
    padding:0 10px;
    height:30px;
    text-align: center;
    border-radius: 20px;
    background:red;
    color:#ffffff;
    line-height:30px;
    margin-right:15px;
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

.grant-content {
  display: flex;
  justify-content: space-between;

  .grant-title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .custom-pagination {
    margin-top: 5px;
  }

  .grant-right-top, {
    padding-bottom: 30px;
    box-sizing: border-box;
  }
}
</style>
