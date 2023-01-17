<template>
  <div class="app-container">
    <div class="type-app">
      <div class="type-left">
        <div class="type-title">资产类型列表</div>
        <div>
          <!-- 分类树 -->
          <!-- <el-tree
            :data="typeOptions"
            :props="defaultProps"
            node-key="id"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="trees"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node }"
              >{{ node.label
              }}<i class="el-icon-more" style="margin-left: 100px"></i
            ></span>
          </el-tree> -->
          <el-tree
            :data="typeOptions"
            node-key="id"
            default-expand-all
            highlight-current
             ref="trees"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ data }"
              style="
                width: 100%;
                display: flex;
                justify-content: space-between;
                height: 20px;
                line-height: 20px;
              "
            >
              <span>{{ data.typeName }}</span>
              <span v-if="data.id == n">
                <el-button type="text" size="mini" 
                @click.stop="oper(data)">
                  <i class="el-icon-more" style="transform: rotate(90deg)"></i>
                </el-button>
              </span>
              <div
                v-if="data.id == n && isshow"
                @mouseleave="leaveOne"
                style="
                  
                  position: absolute;
                  right:35px;
                  width: 100px;
                  border: 1px solid #ddd;
                  background: #ffffff;
                "
              >
                <div class="select-list" 
                @click.stop="editOrAdd('1', data)">
                  编辑分类
                </div>
                <div class="select-list" 
                @click.stop="editOrAdd('2', data)">
                  新增分类
                </div>
                <div class="select-list"
                 @click.stop="editOrAdd('3', data)">
                  新增子分类
                </div>
                <div class="select-list" 
                @click="delAsset(data)">删除分类</div>
              </div>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="type-right">
        <div class="right-header">
          <div>{{ rightTitle }}</div>
          <div>
            <el-button type="text" 
            @click="add">添加</el-button>
          </div>
        </div>

        <el-table :data="typeData">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column 
            sortable 
            label="类型ID" 
            align="center" 
            prop="id" />
          <el-table-column
            sortable
            label="序列编号"
            align="center"
            prop="typeNo"
          >
          </el-table-column>
          <el-table-column 
            label="类型名称" 
            align="center" 
            prop="typeName">
          </el-table-column>
          <el-table-column
            label="拼音缩写"
            align="center"
            prop="typePinyinAbbr"
          />
          <el-table-column 
            label="创建时间" 
            align="center" 
            prop="createTime">
          </el-table-column>
          <el-table-column 
            label="管理方式" 
            align="center" 
            prop="manageType"
            :formatter="formatter">
          </el-table-column>
          <el-table-column 
            label="备注" 
            align="center" 
            prop="remark">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
               <span 
                  style="margin-left: 10px" 
                  v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                 
                  @click="editOrAdd('1', scope.row)"
                  >编辑</el-button
                >
              </span>
               <span 
                  style="margin-left: 10px" 
                  v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                  style="color: red"
                  @click="delAsset(scope.row)"
                  >删除</el-button
                >
              </span>
              <span
                style="margin-left: 10px" 
                v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                  style="color: red"
                  @click="stopOrUse(scope.row.id, 1)"
                  v-if="scope.row.status == 0"
                  >停用</el-button
                >
              </span>
              <span 
                style="margin-left: 10px" 
                v-hasPermi="['system:user:add']">
                <el-button
                  size="mini"
                  type="text"
                  @click="stopOrUse(scope.row.id, 0)"
                  v-if="scope.row.status == 1"
                  >启用</el-button
                >
              </span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="page.pageNum"
          :limit.sync="page.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
    <!-- 新建或编辑弹窗 -->
    <el-dialog
      :title="title"
      class="dialogForm"
      width="50%"
      :visible.sync="addEdit"
    >
      <el-form
        :model="diaForm"
        ref="diaForm"
        :rules="dialogRules"
        :inline="false"
        label-width="120px"
        class="dialogFormInfo"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型名称" prop="typeName">
              <el-input
                v-model="diaForm.typeName"
                size="medium"
                clearable
                placeholder="请输入类型名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="序列编号" prop="typeNo">
              <el-input
                v-model="diaForm.typeNo"
                size="medium"
                clearable
                placeholder="请输入序列编号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拼音缩写" prop="typePinyinAbbr">
              <el-input
                v-model="diaForm.typePinyinAbbr"
                size="medium"
                clearable
                placeholder="请输入拼音缩写"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理方式" prop="manageType">
              <el-radio-group v-model="diaForm.manageType">
                <el-radio
                  v-for="item in manageSelect"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计算折旧" prop="hasDepreciation">
              <el-radio-group v-model="diaForm.hasDepreciation">
                <el-radio
                  v-for="item in depreciationSelect"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="详情模板" prop="infoTemplateId">
              <el-select
                v-model="diaForm.infoTemplateId"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
                <el-option
                  v-for="item in detailTemplates"
                  :key="item.id"
                  :label="item.templateName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="审批流程" prop="flowGroupId">
              <el-select
                v-model="diaForm.flowGroupId"
                :collapse-tags="true"
                filterable
                clearable
                size="medium"
              >
                <el-option
                  v-for="item in process"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保养管理" prop="hasMaintainExpire">
              <el-radio-group v-model="diaForm.hasMaintainExpire">
                <el-radio
                  v-for="item in closeSelect"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
            label="使用期限提醒" 
            prop="hasUserfulExpire">
              <el-radio-group v-model="diaForm.hasUserfulExpire">
                <el-radio
                  v-for="item in closeSelect"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证书管理" prop="hasCertificate">
              <el-radio-group v-model="diaForm.hasCertificate">
                <el-radio
                  v-for="item in closeSelect"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="diaForm.remark" type='textarea'>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="txtAlignC dialogBtnInfo">
        <el-button type="primary" 
        @click="sureEdit">确定</el-button>
        <el-button 
        @click="cancelFn">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTypeData,
  newAddAsset,
  editAsset,
  deleteAsset,
  disableEnable,
  querySubcategory,
  getAssetTemplate,
  flowGroup
} from "@/api/assetManagement/assetManagementSet";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "typeName",
      },
      typeOptions: undefined,
      addEdit: false,
      title: "",
      typeData: [],
      diaForm: {},
      n: -1,
      total: 0,
      page: {
        pageSize: 10,
        pageNum: 1,
      },
      detailTemplates: [],
      process: [],
      typeId: null,
      rightTitle: "",
      isEdit: true,
      isshow: false,
      parentId: null,
      curren:'',
      manageSelect: [
        { value: 1, label: "按耗材" },
        { value: 2, label: "按固定资产" },
      ],
      depreciationSelect: [
        { value: 1, label: "是" },
        { value: 0, label: "否" },
      ],
      closeSelect: [
        { value: 1, label: "开启" },
        { value: 0, label: "关闭" },
      ],
      dialogRules: {
        typeName: [
          {
            required: true,
            message: "类型名称不能为空",
            trigger: "blur",
          },
        ],
        manageType: [
          {
            required: true,
            message: "管理方式不能为空",
            trigger: "blur",
          },
        ],
        hasDepreciation: [
          {
            required: true,
            message: "计算折旧不能为空",
            trigger: "blur",
          },
        ],
        infoTemplateId: [
          {
            required: true,
            message: "详情模板不能为空",
            trigger: "blur",
          },
        ],
        flowGroupId:[
           {
            required: true,
            message: "审批流程不能为空",
            trigger: "blur",
          },
        ],
        hasMaintainExpire: [
          {
            required: true,
            message: "保养管理不能为空",
            trigger: "blur",
          },
        ],
        hasUserfulExpire: [
          {
            required: true,
            message: "使用期限提醒不能为空",
            trigger: "blur",
          },
        ],
        hasCertificate: [
          {
            required: true,
            message: "证书管理不能为空",
            trigger: "blur",
          },
        ]
      },
    };
  },
  created() {
    this.getTreeselect();
    this.getTemplate();
    this.getFlowGroup();
  },
  watch: {
    addEdit(value) {
      if (value === false) {
        this.$refs.diaForm.resetFields()
      }
    }
  },
  methods: {
     defaultData() {
      // console.log(this.$refs.tree,'this.$refs.tree')
      this.$refs.trees.setCurrentKey(this.curren)
      
      this.$nextTick(function () {
        console.log(this.curren,'gggggggggg')
        this.$refs.trees.setCurrentKey(this.curren); //data[0].id为默认选中的节点
      });
    },
    getTemplate() {
      getAssetTemplate({}).then((res) => {
        this.detailTemplates = res.rows;
      });
    },
    getFlowGroup() {
      flowGroup().then(res => {
        this.process = res.data
      })
    },
    // 管理方式匹配
    formatter(row) {
      return this.manageSelect.find(item => item.value == row.manageType).label
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.curren=data.id
      this.n = data.id;
      
      this.isshow = false;
      console.log(data, "data1111111111");
      if (data.parentId != 0) {
        console.log("ffff");
        this.typeId = data.id;
        this.rightTitle = data.typeName;
        this.getList();
      } else {
        return;
      }
    },
    getList() {
      if (!this.typeId) {
        return
      }
      querySubcategory({
        id: this.typeId,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
      }).then((res) => {
        this.typeData = res.rows;
        this.total = res.total;
        this.parentId = this.typeId;
      });
    },
    leaveOne() {
      this.isshow = false;
      console.log(this.curren,'curren')
    },
    /** 查询分类下拉树结构 */
    getTreeselect() {
      console.log(this.curren,'curren')
      getTypeData().then((response) => {
        this.typeOptions = response.data;
        console.log(this.typeOptions);
         this.defaultData()
      });
    },
    add() {
      this.addEdit = true;
      this.isEdit = false;
    },
    // 新增或者编辑分类
    editOrAdd(item, data) {
      this.addEdit = true;
      console.log(data, "sssss");
      if (item == 1) {
        //编辑分类
        this.isEdit = true;
        this.diaForm = data;
      } else if (item == 2) {
        //新增分类
        this.diaForm = {};
        this.parentId = data.parentId;
        this.isEdit = false;
      } else {
        //新增子分类
        this.diaForm = {};
        this.parentId = data.id;
        this.isEdit = false;
      }
    },
    //删除资产分类
    delAsset(data) {
      deleteAsset(data.id).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除成功");
          this.getTreeselect();
          this.getList();
        }
      });
    },
    //新增的方法
    newAdd() {
      let data = { ...this.diaForm, parentId: this.parentId };
      console.log(data, "dddddddddddddd");
      // return;
      newAddAsset(data).then((res) => {
        if (res.code == 200) {
          this.$message.success("新增成功");
          this.getTreeselect();
          this.getList();
          this.defaultData()
          console.log(this.curren,'cirren')
          this.addEdit = false;
        }
      });
    },
    //编辑的方法
    edit() {
        let data = { ...this.diaForm };
      editAsset(data).then((res) => {
        if (res.code == 200) {
          this.$message.success("编辑成功");
          this.addEdit = false;
          this.getTreeselect();
           this.getList();
          this.defaultData()
        }
      });
    },
    oper(data) {
      console.log(data, "data");
      this.curren=data.id
      this.defaultData()
      this.isshow = true;
    },
    //禁用启用
    stopOrUse(id, item) {
      let data;
      if (item == 0) {
        data = {
          id,
          status: 0,
        };
      } else {
        data = {
          id,
          status: 1,
        };
      }
      disableEnable(data).then((res) => {
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getList();
        }
      });
    },
    //弹窗确认按钮
    sureEdit() {
      // if (this.isEdit) {
      //   this.edit();
      //   console.log("bianji");
      // } else {
      //   console.log("新增");
      //   this.newAdd();
      // }
      this.$refs.diaForm.validate(valid => {
        if (!valid) {
          return
        }
        if (this.isEdit) {
          this.edit();
          console.log("bianji");
        } else {
          console.log("新增");
          this.newAdd();
        }
      })
    },
    //弹窗取消按钮
    cancelFn() {
      this.addEdit = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.type-app {
  display: flex;
  justify-content: space-between;
  .type-left {
    width: 20%;
    .type-title {
      margin-bottom: 15px;
    }
  }
  .type-right {
    width: 79%;
    .right-header {
      display: flex;
      justify-content: space-between;
    }
  }
}
.select-list {
  height: 30px;
  line-height: 30px;
  text-align: center;
}
</style>