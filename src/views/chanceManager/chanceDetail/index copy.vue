 <el-row>
              <el-col :span="6">
                <el-form-item
                  label="区域："
                  :prop="`chanceConfigList.${chanceConfigIndex}.areaId`"
                >
                   <el-select
                    v-model="chanceConfigItem.areaId"
                    placeholder="请选择区域"
                    :style="{ width: '100%' }"
                    @change="(dates) => editNext('region', dates, chanceConfigIndex)"
                  >
                    <el-option
                      v-for="(dict, index) in regionOptions"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    ></el-option>
                  </el-select> 
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="职位："
                  :prop="`chanceConfigList.${chanceConfigIndex}.postId`"
                  :rules="rules.chanceConfigItemPostId"
                >
                  <el-select
                    v-model="chanceConfigItem.postId"
                    placeholder="请选择职位"
                    :disabled="chanceConfigItem.postTypeActive"
                    :style="{ width: '100%' }"
                    @change="(dates) => editNext('postType', dates, chanceConfigIndex)"
                  >
                    <el-option
                      v-for="(dict, index) in postTypeOptions"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="等级："
                  :prop="`chanceConfigList.${chanceConfigIndex}.gradeId`"
                  :rules="rules.chanceConfigItemGradeId"
                >
                  <el-select
                    v-model="chanceConfigItem.gradeId"
                    placeholder="请选择等级"
                    :disabled="chanceConfigItem.gradeIdActive"
                    :style="{ width: '100%' }"
                    @change="(dates) => editNext('gradeId', dates, chanceConfigIndex)"
                  >
                    <el-option
                      v-for="(dict, index) in gradeIdOptions"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="DelConfigList(chanceConfigIndex)"
                  >
                    删除
                  </el-button>

                  <!-- <el-button type="info" size="mini"> 取消 </el-button> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item
                  label="技能需求："
                  :prop="`chanceConfigList.${chanceConfigIndex}.skillIdList`"
                  :rules="rules.chanceConfigItemSkillIdList"
                >
                  <el-select
                    v-model="chanceConfigItem.skillIdList"
                    multiple
                    placeholder="请选择技能需求"
                    :disabled="chanceConfigItem.nextActive"
                    :style="{ width: '100%' }"
                  >
                    <el-option
                      v-for="(dict, index) in techniqueOptions"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                      :disabled="dict.disabled"
                    >
                      <span>{{ dict.dictLabel }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item
                  label="配置安排："
                  :prop="`chanceConfigList.${chanceConfigIndex}.startEndTime`"
                  :rules="rules.chanceConfigItemStartEndTime"
                >
                  <el-date-picker
                    type="daterange"
                    v-model="chanceConfigItem.startEndTime"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :style="{ width: '100%' }"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    range-separator="至"
                    :disabled="chanceConfigItem.nextActive"
                    @change="(dates) => getTimeArea(dates, chanceConfigIndex)"
                    :picker-options="childDateArea"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="3" :offset="1" class="lineTT">
                共<span class="priority3">{{ chanceConfigItem.workTime }}</span
                >小时( <span class="priority3">{{ chanceConfigItem.workDay }}</span
                >)天
              </el-col>
              <el-col :span="3" class="lineTT">
                计划负荷：<span class="priority3">{{ chanceConfigItem.planLoad }}%</span>
              </el-col>
              <el-col :span="4" :offset="1" class="lineTT">
                预计成本：<span class="priority3">{{ chanceConfigItem.expectedCost }}</span
                >元
              </el-col>
            </el-row>
            <!-- 动态生成的内部 strat  -->
            <el-row
              v-for="(
                chanceConfigScheduleItem, chanceConfigScheduleIndex
              ) in chanceConfigItem.chanceConfigScheduleList"
            >
              <el-col :span="3" :offset="2" class="lineTT">
                {{ chanceConfigScheduleItem.startTime }} --
                {{ chanceConfigScheduleItem.endTime }}
              </el-col>
              <el-col :span="6" :offset="2" class="lineTT">
                <div class="colText">
                  每日
                  <el-input-number
                    size="mini"
                    :style="{ width: '100px' }"
                    :min="0"
                    :max="24"
                    v-model="chanceConfigScheduleItem.workTime"
                    :precision="1"
                    @change="
                      (number) => {
                        changeDayTime(
                          number,
                          chanceConfigScheduleItem.weekDay,
                          chanceConfigIndex,
                          chanceConfigScheduleIndex
                        );
                      }
                    "
                  ></el-input-number>
                  <!-- 
                    @input.native="changeInput($event)"
                  -->
                  小时
                </div>
              </el-col>
              <el-col :span="3" class="lineTT">
                期间计划负荷：<span class="priority3"
                  >{{ chanceConfigScheduleItem.planLoad }}%</span
                >
              </el-col>
            </el-row>
            <!-- 动态生成的内部 end  -->