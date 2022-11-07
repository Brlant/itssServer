


<template>
  <div>
      <div
          class="UserLine"
          v-for="(addUserList, addUserListindex) in formData.projectUserList"
          :key="addUserListindex"
        >
          <el-row>
            <el-col :span="3">
              <el-form-item
                :prop="`projectUserList.${addUserListindex}.userId`"
                :rules="rules.projectUserListAllUserId"
                label-width="30px"
              >
                <el-select
                  v-model="addUserList.userId"
                  placeholder="请选择项目成员"
                  clearable filterable
                  @change="
                    (userId) => {
                      getUserCost(userId, addUserListindex);
                    }
                  "
                  @clear="releaseUser(addUserListindex)"
                  :style="{ width: '100%' }"
                >
                  <el-option
                    v-for="user in userOptions"
                    :key="user.userId"
                    :label="user.userNameAndPost"
                    :value="user.userId"
                    :disabled="user.disabled"
                  ></el-option>
                </el-select> </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label=""
                :prop="`projectUserList.${addUserListindex}.startEndTime`"
                :rules="rules.projectUserListAllStartEndTime"
                label-width="50px"
              >
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
                <span>{{ addUserList.workDay }}</span> 人日）
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
                <el-button size="mini" @click="DelUserList(addUserListindex)" type="error"
                  >删除</el-button>
              </div>
            </el-col>
          </el-row>
          <!----------------------内部-start------------------------------>
          <el-row
            v-for="(
              UserScheduleList, UserScheduleListIndex
            ) in addUserList.projectUserScheduleList"
            :key="UserScheduleListIndex"
          >
            <el-col :offset="5" :span="4">
              <div class="colText" style="text-indent: 30px">
                {{ UserScheduleList.startTime + "-" + UserScheduleList.endTime }}
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
                  @input.native="changeInput($event)"
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
</template>
<script>
filterUserList
export default {
  
}
</script>