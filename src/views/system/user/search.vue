<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
        <el-row>
            <el-col>
               <el-form-item label="搜索">
                    <el-select v-model="form.query" multiple filterable :reserve-keyword="true">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row> 
    </el-form>
    <el-table :data="user">
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <el-table-column label="姓名" align="center" prop="nickName" />
      <el-table-column label="职位" align="center" prop="postName" />
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="手机号码" align="center" prop="phonenumber" />
      <el-table-column label="工作技能" align="center" prop="skill">
        <template slot-scope="scope"> </template>
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
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['system:user:query']"
            @click="detail(scope.row.userId)"
            >详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            style="color: red"
            @click="stopOrUse(scope.row.userId, 1)"
            v-if="scope.row.status == 0"
            >停用</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="stopOrUse(scope.row.userId, 0)"
            v-if="scope.row.status == 1"
            >启用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default{
   data(){
    return {
        form:{},
        user:[]
    }
   }
}
</script>
