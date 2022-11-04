<template>
  <div class="app-container">
    <div class="icon">
      <div>
        <i class="el-icon-arrow-left"></i>
        <span>成员信息新增/编辑</span>
      </div>
      <div>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
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
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="formData.name"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="formData.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号/账号" prop="phone">
                <el-input
                  v-model="formData.phone"
                  placeholder="请输入手机号/账号"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workId">
                <el-input
                  v-model="formData.workId"
                  placeholder="请输入工号"
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
              <el-form-item label="区域">
                <el-select v-model="formData.region" placeholder="请选择区域">
                  <el-option
                    v-for="dict in areas"
                    :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="职位类型">
                <el-select
                  v-model="formData.region"
                  placeholder="请选择职位类型"
                >
                  <el-option
                    v-for="dict in areas"
                    :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职位名称">
                <el-select
                  v-model="formData.region"
                  placeholder="请选择职位名称"
                >
                  <el-option
                    v-for="dict in areas"
                    :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="等级">
                <el-select v-model="formData.region" placeholder="请选择等级">
                  <el-option
                    v-for="dict in areas"
                    :key="dict.dictCode"
                    :label="dict.dictLabel"
                    :value="dict.dictCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item>
                <div slot="label">
                  <i class="el-icon-lock"></i> 工作技能：
                </div>
                <skill-select />
              </el-form-item>
              <!-- <i class="el-icon-unlock"></i>
              <i class="el-icon-lock"></i>
              <span>工作技能：</span>
              <el-popover placement="right" width="400" trigger="click">
                <div>
                  <el-input v-model="input" placeholder="搜索标签"></el-input>
                  <div
                    class="skill"
                    v-for="(item, index) in skillList"
                    :key="index"
                  >
                    <div class="skillColor"></div>
                    <div class="skillName">{{ item }}</div>
                  </div>
                </div> -->
                <!-- <span slot="reference">
                  <i class="el-icon-circle-plus"></i>
                  <span>添加技能标签</span>
                </span> -->
                <!-- <el-button slot="reference" type="text">
                  <i class="el-icon-circle-plus"></i>
                  <span>添加技能标签</span>
                </el-button>
              </el-popover> -->
            </el-col>
          </el-row>
          <!-- <el-row v-if="skills">
            <el-col>
              <i class="el-icon-unlock"></i>
              <i class="el-icon-lock"></i>
              <span>工作技能：</span>
              <div class="workSkill">
                <div
                  v-for="(item, index) in skills"
                  :key="index"
                  @mouseover="isDel(index)"
                >
                  <span>{{ item }}</span
                  ><i
                    class="el-icon-close"
                    style="margin-left: 20px"
                    v-if="index == ss"
                  ></i>
                </div>
              </div>
              <el-popover placement="right" width="400" trigger="click">
                <div>
                    <el-input v-model="input" placeholder="搜索标签"></el-input>
                      <div class="skill" v-for="(item,index) in skillList" :key='index' @click='select(index)'> 
                        <div class='skillColor'></div>
                        <div class='skillName'>{{item}}</div>
                        <i class='el-icon-check'></i>
                    </div>
                </div> -->
             
                <!-- <span slot="reference">
                  <i class="el-icon-circle-plus"></i>
                  <span>添加技能标签</span>
                </span> -->
                <!-- <el-button slot="reference" type="text">
                  <i class="el-icon-circle-plus" style="font-size: 25px"></i>
                </el-button>
              </el-popover>
            </el-col>
          </el-row> -->
        </el-form>
        <div>
          <div class="titleinfo">权限信息</div>
          <el-form
            ref="elForm"
            :model="formData"
            :rules="rules"
            size="medium"
            label-width="110px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="系统角色">
                  <el-select
                    v-model="formData.region"
                    placeholder="请选择系统角色"
                  >
                    <el-option
                      v-for="dict in areas"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="所属部门">
                  <el-select v-model="formData.region" placeholder="请选择部门">
                    <el-option
                      v-for="dict in areas"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="直属领导">
                  <el-select v-model="formData.region" placeholder="请选择">
                    <el-option
                      v-for="dict in areas"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
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
import SkillSelect from '@/components/SkillSelect/index'

export default {
  components: {
    SkillSelect
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      skillData: [],
      value1: [],
      formData: {},
      areas: [],
      input: "",
      skills: ["ss", "dd"],
      skillList: ["java", "js"],
      aa: false,
      ss: -1,
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        phone: [
          { required: true, message: "请输入手机号/账号", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.positinType("region");
  },
  methods: {
    dd() {
      console.log(this.value1);
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
    //添加技能
    addSkill() {},
    isDel(index) {
      console.log(index);
      this.ss = index;
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
    margin-right:200px;
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