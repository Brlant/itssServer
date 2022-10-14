<template>
  <div>
     <!-- 绝绝子代码 之 取余 显示label -->
          <!-- <el-table-column
            v-for="(item,i) in  projectTable.projectUserList[0].projectUserScheduleList"
            :label="i%2===1?'计划负荷':'实际负荷'"
            width="120"
        >
          <span v-if="i%2===1"> {{ item.planLoad   }}</span>
          <span v-else> {{ item.realLoad  }}</span>                            
        </el-table-column>   -->
           <!-- 比较完整的一版本0 -->

        <!-- <el-table-column
          v-for="(item, i) in labelArr"
          :label="item.label"
          :key="i"
          width="100"
        >
          <template slot-scope="scope">{{ scope.row.projectUserScheduleList[i] | toObject('plan') }}</template>
        </el-table-column> -->
          <!-- 比较完整的一版本1 -->
         <!-- <el-table-column
            prop="projectUserScheduleList"
            sortable
            label="实际投入"
            width="50"
        >
          <template slot-scope="scope">
              <div v-for="(item,i) in scope.row.projectUserScheduleList">
                {{ item.realLoad}}
              </div>
          </template>
        </el-table-column> -->

          <!-- 比较完整的一版本2  可以看出部分问题的一段   动态生成 遇到了 无法解析label的个数 因为每个人安排的周数不一致，有的多有的少-->

        <!-- <template v-for="(ScheduleList,i) in projectTable.projectUserList[0].projectUserScheduleList"> 
                     <el-table-column
                      prop="ScheduleList[i].planLoad"
                      label="计划负荷"
                      width="120"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="ScheduleList[i].realLoad"
                      label="实际负荷"
                      width="120"
                    >
                    </el-table-column>
              
            
           </template>   -->
          <!-- 比较完整的一版本3 -->
  </div>
</template>