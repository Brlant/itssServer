<template>
  <div>
    <div>
      <i
        class="el-icon-arrow-left"
        style='transform: translateY(-33px)'
        @click="goBack"
      ></i>
      <div style='display: inline-block;width:90%;'>
        <el-form
        ref="form"
        :model="form"
        label-width="50px"
       
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="搜索">
              <!-- <el-select
                v-model="form.query"
                multiple
                filterable
                :reserve-keyword="true"
                ref="reqMsgRef"
                @focus="onBlur(form.query, 'reqMsgRef')"
              > -->
               <el-select
                v-model="form.query"
                multiple
                filterable
                ref="reqMsgRef"
                @change="change()"
              >
                <el-option
                  v-for="(item, index) in condition"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </div>
     
    </div>

    <el-table :data="user">
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <el-table-column label="姓名" align="center" prop="nickName" />
      <el-table-column label="职位" align="center" prop="postName" />
      <el-table-column label="部门" align="center" prop="deptName">
        <template slot-scope="scope">
          <span v-if='scope.row.dept'>{{ scope.row.dept.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" prop="phonenumber" />
      <el-table-column label="工作技能" align="center" prop="skill">
        <template slot-scope="scope">
          <span
            class="work"
            v-for="(item, index) in scope.row.userSkills"
            :key="index"
            :style="{ background: matchColor(item.cssClass) }"
            >{{ item.skillName }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="系统角色" align="center" prop="roles">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.roles" :key="index"
            ><span v-if="item"
              >{{ item.roleName
              }}<span v-if="index < scope.row.roles.length - 1">,</span></span
            ></span
          >
        </template>
      </el-table-column>
      <el-table-column label="身份ID" align="center" prop="userId" />
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="text">邀请</el-button> -->
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['system:user:query']"
            @click="detail(scope.row.userId)"
            >详情</el-button
          >
           <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
          <el-button
            size="mini"
            type="text"
            style="color: red"
            @click="stopOrUse(scope.row.userId, 1)"
            v-if="scope.row.status == 0"
            >停用</el-button
          >
           </span>
            <span style="margin-left: 10px" v-hasPermi="['system:user:add']">
          <el-button
            size="mini"
            type="text"
            @click="stopOrUse(scope.row.userId, 0)"
            v-if="scope.row.status == 1"
            >启用</el-button
          >
            </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { queryList, fuzzyQuery, stopUse } from "@/api/system/user";
import { color } from "@/components/ColorSelect/options";
export default {
  data() {
    return {
      form: {},
      user: [],
      condition: [],
      data:{}
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    change(){
      if(this.form.query!=""){
        let  data = {
              str: this.form.query.toString(),
            };
            fuzzyQuery(data).then((res) => {
              this.user = res.data;
            });
      }else{
        this.user =[]
      }
    },
    onBlur(flag, ref) {
      this.$refs[ref].$refs.input.blur = () => {
        // 这里执行失焦的代码
        const inp = this.$refs[ref].$refs.input.value;
        console.log(flag);
        // if(!inp) return
        // this[flag].push(inp)
        let data;
        if (flag.length > 0) {
          data = {
            str: flag.toString(),
          };
          this.data=data
          fuzzyQuery(data).then((res) => {
            this.user = res.data;
          });
        } else {
          //  data={
          //   str:''
          // }
          return;
        }
      };
    },
    query() {
      queryList().then((res) => {
        this.condition = res.data;
      });
    },
    // 匹配颜色
    matchColor(cssClass) {
      if (cssClass) {
        return color.find((v) => v.cssClass === cssClass).color;
      }
    },
    //停用启用
    stopOrUse(id, code) {
      stopUse({ status: code, userId: id }).then((res) => {
        if (res.code == 200) {
          this.$message.success(res.msg);
           fuzzyQuery(this.data).then((res) => {
            this.user = res.data;
          });
        }
      });
    },
    goBack(){
        const obj = {
            path: "/system/user",
        };
      this.$tab.closeOpenPage(obj);
    },
    detail(id) {
      console.log(id, "dddd");
      const obj = { path: "/system/user-auth/userInfo", query: { userId: id } };
      // getToday()
      this.$tab.closeOpenPage(obj);
    },
  },
};
</script>
<style lang="scss" scoped>
.work {
  display: inline-block;
  width: 100px;
  height: 30px;
  text-align: center;
  border-radius: 20px;
  color: #ffffff;
  line-height: 30px;
  margin-right: 15px;
}
</style>
