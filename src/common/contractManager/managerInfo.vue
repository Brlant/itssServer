<template>
  <el-form ref="formData"
    :model="formData"
    :rules="formRules"
    label-width="120px">
    <!--    基本信息-->
    <div class="JiBenXinXi">
      基本信息
    </div>
    <template v-if="!btnSumbit">
      <!-- 第一行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同档案编号"
            prop="contractRecordCode">
            {{ formData.contractRecordCode }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同编号"
            prop="contractCode">
            {{ formData.contractCode }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同名称"
            prop="contractName">
            {{ formData.contractName }}
          </el-form-item>
        </el-col>
      </el-row>
      <!--  第二行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同类型"
            prop="contractType">
            {{ formData.contractType === 1 ? '采购合同' : '框架合同' }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商名称"
            prop="supplierName">
            {{ formData.supplierName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同金额"
            prop="contractAmount">
            {{ formData.contractAmount }}
          </el-form-item>
        </el-col>
      </el-row>
      <!--        第三行-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="签订日期"
            prop="signingDate">
            {{ formData.signingDate }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="到期日期"
            prop="dueDate">
            {{ formData.dueDate }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同签署人"
            prop="contractSignatory">
            {{ formData.contractSignatory }}
          </el-form-item>
        </el-col>
      </el-row>
      <!--        第四行-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注"
            prop="remark">
            {{ formData.remark }}
          </el-form-item>
        </el-col>
      </el-row>
      <!--        第五行-->
      <el-row>
        <el-col :span="24">
          <el-form-item label="文件下载">
            <el-input v-model="fileName"
              readonly>
              <template v-if="fileName"
                slot="append">
                <el-button>
                  <el-link :href="formData.scanningCopyUrl"
                    :underline="false"
                    icon="el-icon-download"></el-link>
                </el-button>
                <el-button @click="fileDelete">
                  <el-link :underline="false"
                    icon="el-icon-delete"></el-link>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <!-- 第一行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号"
            prop="contractCode">
            <el-input v-model="formData.contractCode"
              maxlength="50"
              placeholder="请输入合同编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同名称"
            prop="contractName">
            <el-input v-model="formData.contractName"
              maxlength="50"
              placeholder="请输入合同名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同类型"
            prop="contractType">
            <el-select v-model="formData.contractType"
              placeholder="请选择合同类型">
              <el-option label="采购合同"
                :value="1"></el-option>
              <el-option label="框架合同"
                :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商名称"
            prop="supplierId">
            <el-select v-model="selectSupplier"
              remote
              filterable
              value-key="val"
              :loading="loadSupplier"
              :remote-method="querySupplier"
              placeholder="请选择供应商">
              <el-option v-for="supplier in suppliers"
                :key="supplier.val"
                :value="supplier"
                :label="supplier.txt"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同金额"
            prop="contractAmount">
            <el-input v-model.number="formData.contractAmount" type="number" @input="changeAmount"
              placeholder="请输入合同金额"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签订日期"
            prop="signingDate">
            <el-date-picker v-model="formData.signingDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第三行 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="到期日期"
            prop="dueDate">
            <el-date-picker v-model="formData.dueDate"
              type="date"
              placeholder="选择日期"
              style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同签署人"
            prop="contractSignatory">
            <el-input v-model="formData.contractSignatory"
              maxlength="20"
              placeholder="请输入合同签署人"/>
          </el-form-item>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>

      <!-- 第四行 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注"
            prop="remark">
            <el-input v-model="formData.remark"
              maxlength="1000"
              type="textarea"
              placeholder="请输入备注"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 第五行 -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="文件上传">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleSuccess"
              accept=".png,.jpg,.jpeg,application/pdf"
            >
              <el-button size="small"
                type="primary"
                icon="el-icon-upload">选择文件</el-button>
              <!--              <i v-if="!formData.scanningCopyUrl" class="el-icon-plus"></i>-->
              <!--              <img v-else :src="formData.scanningCopyUrl" alt="合同扫描件"/>-->
            </el-upload>
            <el-input v-if="fileName"
              v-model="fileName"
              readonly
              style="margin-top: 20px;">
              <template v-if="fileName"
                slot="append">
                <el-button>
                  <el-link :href="formData.scanningCopyUrl"
                    :underline="false"
                    icon="el-icon-download"></el-link>
                </el-button>
                <el-button @click="fileDelete">
                  <el-link :underline="false"
                    icon="el-icon-delete"></el-link>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </template>

    <!--        提交-->
    <el-row>
      <el-col :span="24"
        style="text-align: center; margin-top: 20px;">
        <el-button type="success"
          v-if="btnAudit"
          @click="auditContract(1)">通过</el-button>
        <el-button type="danger"
          v-if="btnAudit"
          @click="auditContract(2)">不通过</el-button>
        <el-button
          type="primary"
          v-if="btnReturn"
          @click="auditContract(3)">撤回</el-button>
        <el-button
          type="primary"
          v-if="btnEnable"
          @click="editContractStatus(3)">启用</el-button>
        <el-button
          type="danger"
          v-if="btnUnable"
          @click="editContractStatus(5)">停用</el-button>
        <el-button type="primary"
          v-if="btnSumbit"
          @click="modifyContract">重新提交</el-button>
        <el-button type="danger"
          v-if="btnDelete"
          @click="removeContract">删除</el-button>
        <el-button @click="() => $emit('closeDetail')">返回</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import supplierApi from '@/api/supplier/supplier';
import { edit, deleteContractById, queryByContractId, examineContractInfo, editStatus  } from '@/api/contractFilesManagement/contractFilesManagement'
import { uploadUrl } from '@/utils/request'

export default {
  name: "managerInfo",
  props:{
    // tabName: {
    //   type:String,
    //   default:'',
    // },
    contractId: {
      type: String
    }
  },
  data() {
    return {
      suppliers: [],
      uploadUrl: uploadUrl,
      loadSupplier: false,
      formTitle: "基本信息",
      formData: {
        contractRecordCode: null,
        contractCode: null,
        contractName: null,
        contractType: null,
        supplierName: null,
        contractAmount: null,
        signingDate: null,
        dueDate: null,
        contractSignatory: null,
        remark: null,
        scanningCopyUrl: null,
        renewalFlag: null
      },
      formRules: {
        contractRecordCode: [{required: true, message: '请输入合同档案编号', trigger: 'blur'}],
        contractCode: [{required: true, message: '请输入合同编号', trigger: 'blur'}],
        contractName:[{required: true, message: '请输入合同名称', trigger: 'blur'}],
        supplierId:[{required: true, message: '请选择供应商', trigger: 'change'}],
        // contractAmount:[
        //   {required: true, message: '请输入合同金额'},
        //   {type: 'number', message: '合同金额必须是数字'}
        // ],
        signingDate:[{required: true, message: '请选择合同签订日期', trigger: 'change'}],
        dueDate:[{required: true, message: '请选择合同到期日期', trigger: 'change'}],
        contractType:[{required: true, message: '请选择合同类型', trigger: 'change'}],
        // contractSignatory:[{required: true, message: '请填写合同签署人', trigger: 'blur'}]
      },
      backData: null
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['permissions']),
    selectSupplier: {
      get() {
        return {
          val: this.formData.supplierId,
          txt: this.formData.supplierName
        };
      },
      set(supplier) {
        this.formData.supplierId = supplier.val;
        this.formData.supplierName = supplier.txt;
      }
    },
    fileName() {
      let start = this.formData.scanningCopyUrl?.lastIndexOf('/');
      if (start > -1) {
        return this.formData.scanningCopyUrl.substr(start + 1);
      }
      return null;
    },
    // 0-待审核；1-审核中；2-审核未通过；3-启用；4-已撤回；5-停用
    // 待审核、审核中、当前审核人、管理员
    btnAudit() {
      let status = this.formData.contractStatus;
      let examine = this.formData.examineButton;
      return (status === 0 || status === 1) && examine === 1;
    },
    // 待审核、审核中、提交人、管理员
    btnReturn() {
      let status = this.formData.contractStatus;
      let rbtn = this.formData.returnButton;
      return (status === 0 || status === 1) && rbtn === 1;
    },
    // 停用、权限字符串
    btnEnable() {
      let status = this.formData.contractStatus;
      return status === 5 && this.hasPermission('pms:contract:enable');
    },
    // 启用、权限字符串
    btnUnable() {
      let status = this.formData.contractStatus;
      return status === 3 && this.hasPermission('pms:contract:enable');
    },
    // 已撤回、启用、审核未通过、权限字符串
    btnSumbit() {
      let status = this.formData.contractStatus;
      return (status === 2 || status === 3 || status === 4) && this.hasPermission('pms:contract:edit');
    },
    // 已撤回、审核未通过、提交人、管理员
    btnDelete() {
      let status = this.formData.contractStatus;
      let rbtn = this.formData.returnButton;
      return (status === 2 || status === 4) && rbtn === 1;
    }
  },
  watch:{
    // tabName: {
    //   handler(newVal, oldVal) {
    //     console.log('档案信息',newVal);
    //   },
    //   immediate:true,
    //   deep: true,
    // },
    contractId(val) {
      if (val) {
        this.querySupplier();
        this.queryContract(val);
      }
    }
  },
  mounted() {
    this.querySupplier();
    this.queryContract();
  },
  methods: {
    changeAmount(value){
      const reg = /^\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        this.formData.contractAmount = value.replace(/[^\d]/g, '');
      }
    },
    hasPermission(permissionStr) {
      const all_permission = "*:*:*";
      return this.permissions?.some(permission => {
        return all_permission === permission || permissionStr === permission;
      })
    },
    querySupplier(query) {
      this.loadSupplier = true;
      supplierApi.getSupplierList({
        codeNameKey: query,
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if (res.code === 200) {
          this.suppliers = res.data.rows?.map(row => ({
            val: row.supplierId,
            txt: row.supplierName
          }));
        }
      }).finally(() => {
        this.loadSupplier = false;
      })
    },
    queryContract() {
      queryByContractId({ contractId: this.contractId}).then(res => {
        if (res.code === 200) {
          this.formData = res.data;
          this.backData = { ...res.data };
        }
      });
    },
    handleSuccess(res,file) {
      const isPNG = file.raw.type === 'image/png';
      const isJPG = file.raw.type === 'image/jpeg';
      const isPDF = file.raw.type === 'application/pdf';

      if (!isPNG && !isJPG && !isPDF) {
        this.$message.error('只能上传PNG、JPG图片或PDF文件');
        return false;
      }
      this.formData.scanningCopyUrl = res.data.url;
    },
    /*组件传递,关闭表单*/
    closeAddForm() {
      this.$emit("closeAddForm")
    },
    fileDelete() {
      this.formData.scanningCopyUrl = null;
    },
    /* 合同审核 */
    auditContract(examineType) {
      if (examineType === 2) {
        this.$prompt('请填写审批不通过原因', '审批不通过', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /.+/,
          inputErrorMessage: '审批不通过必须填写原因'
        }).then(({ value }) => {
          this.examineContract(examineType, value);
        });
      } else {
        this.examineContract(examineType);
      }
    },
    examineContract(examineType, remark) {
      examineContractInfo(Object.assign({ ...this.formData }, { examineType, remark })).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.$emit('closeDetail', true);
        }
      })
    },
    editContractStatus(contractStatus) {
      let text = contractStatus === 3 ? '启用' : '停用';
      this.$confirm(`确定${text}该合同?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editStatus(Object.assign({ ...this.formData }, { contractStatus })).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.$emit('closeDetail', true);
          } else {
            this.$message.error(res.msg);
          }
        })
      }).catch(() => {
        this.$message.info('操作已取消');
      });
    },
    modifyContract() {
      this.$refs.formData.validate(valid => {
        if (!valid) return;

        this.$confirm('确定重新提交该合同?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let changes = Object.keys(this.formData).filter(key => this.formData[key] !== this.backData[key]);
          let requireChange = changes.filter(key => this.formRules[key]?.some(item => item.required));
          // console.log(requireChange)
          edit(Object.assign(this.formData, { changeFlag: requireChange.length > 0 })).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.$emit('closeDetail', true);
            } else {
              this.$message.error(res.msg);
            }
          });
        }).catch(() => {
          this.$message.info('提交已取消');
        });
      });
    },
    removeContract() {
      this.$confirm('确定删除该合同?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteContractById({ contractId: this.contractId }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg);
            this.$emit('closeDetail', true);
          } else {
            this.$message.error(res.msg);
          }
        });
      }).catch(() => {
        this.$message.info('删除已取消');
      });
    },
    /*文件提交*/
    submitForm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          // 在这里可以进行表单提交操作，比如调用接口提交数据
          this.$message({
            message: '表单提交成功',
            type: 'success'
          });
        } else {
          this.$message.error('表单验证失败，请检查输入内容');
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>
  .jiBenXinXi {
    font-weight: bolder;
    font-size: 14px;
    width: 100%;
    border-bottom: 1px solid #F2F2F2;
    margin-bottom: 20px;
    padding-bottom: 10px;
    box-sizing: content-box;
  }

  /deep/ .el-input-group__append {
    background-color: #ffffff;
  }
</style>
