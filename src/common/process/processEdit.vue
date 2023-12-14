<template>
    <el-dialog :visible="dialogEditProcessDialog" :title="editTitle" width="60%" @close="handleClose">
      <template v-slot:title>
        <div style="font-weight: bold;font-size: 15px">{{ editTitle }}</div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <!-- 序号列 -->
        <el-table-column label="序号" type="index" />

        <!-- 节点名称列，使用 el-input -->
        <el-table-column label="节点名称">
          <template slot-scope="scope">
            <el-input
              v-if="!scope.row.isStart && !scope.row.isEnd"
              v-model="scope.row.modelNode"
              placeholder="请输入节点名称"
            ></el-input>
            <span v-else>{{ scope.row.modelNode }}</span>
          </template>
        </el-table-column>

        <!-- 审批人类型列，使用 el-select -->
        <el-table-column label="审批人类型">
          <template slot-scope="scope">
            <el-select
              v-if="!scope.row.isStart && !scope.row.isEnd"
              v-model="scope.row.reviewedType"
              placeholder="请选择审批人类型"
              @focus="focusReviewedType"
            >
              <el-option
                v-for="(item,index) in approverTypes"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <!-- 审批人列，使用 el-input，并添加点击事件 -->
        <el-table-column label="审批人">
          <template slot-scope="scope" >
<!--            上级领导-->
            <div v-if="scope.row.reviewedType === '上级领导'">
              <el-select
                filterable
                v-if="!scope.row.isStart && !scope.row.isEnd"
                v-model="scope.row.reviewedId"
                placeholder="请选择审批人类型"
              >
                <el-option
                  v-for="(item,index) in nickNameArray"
                  :key="index"
                  :label="item.nickName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </div>


<!--            指定人员-->
            <div  v-if="scope.row.reviewedType === '指定人员'">
              <el-input
                v-if="!scope.row.isStart && !scope.row.isEnd"
                readonly
                v-model="scope.row.reviewedId"
                placeholder="点击选择审批人"
                @click.native="handleApproverClick(scope.$index)"
              ></el-input>
              <span v-else>/</span>
            </div>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.isStart"
              type="text"
              icon="el-icon-plus"
              @click="addRow(scope.$index)"
            ></el-button>
            <template v-else-if="!scope.row.isEnd">
              <el-button
                type="text"
                icon="el-icon-plus"
                @click="addRow(scope.$index)"
              ></el-button>
              <el-button
                type="text"
                icon="el-icon-minus"
                @click="removeRow(scope.$index)"
              ></el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button type="primary"@click="saveProcessEdit">保存</el-button>
        <el-button >返回</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { getDetailList,getParentByIdList,getEditActiveModelList} from '@/api/auditCenter/process/process'

export default {
  name: 'processEdit',
  props: ['dialogEditProcessDialog','activeModelId'],
  watch: {
    activeModelId: {
      handler(newVal, oldVal) {
        if(newVal){
          this.getEditList(newVal)
        }
      },
      immediate: true,
      deep: true,
    }
  },
  data() {
    return {
      //编辑审核中心的详情
      dialogInputProcessDialog: false,
      editTitle: '供应商档案审核流程',
      tableData: [],
      approverTypes: [
        { label: '上级领导' },
        { label: '指定人员' }
      ],
      nickNameArray:[],
      userInfo:'',
      userId:''
    }
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("user"))
    this.userId = this.userInfo.userId
  },
  mounted() {
    this.remoteSearch();
  },
  methods: {
    /* 获取详情信息*/
    getEditList(newVal){
      let params = {
        activeModelId:newVal
      }
      getDetailList(params).then((res)=>{
        this.tableData = res.data
      })
    },
    /*增加行数*/
    addRow(index) {
      const newRow = {
        serialNumber:index+2,
        modelNode: '',
        reviewedType: '',
        // reviewedName: '',
        reviewedId:'',
        isStart: false,
        isEnd: false
      }
      this.tableData.splice(index + 1, 0, newRow)
    },
    /*减少行数*/
    removeRow(index) {
      if (!this.tableData[index].isStart && !this.tableData[index].isEnd) {
        this.tableData.splice(index, 1)
      }
    },
    saveProcessEdit() {
      for(let i in this.tableData){
        this.tableData[i].serialNumber = Number(i) + 1;
      }
      let params = {
        activeModelId:this.activeModelId,
        nodeDetails:this.tableData
      }
      getEditActiveModelList(params).then(res=>{
        console.log(res)
      })
      console.log(this.tableData)

    },
    handleClose(){
      this.$emit('handleClose')
    },
    handleApproverClick(index) {
      console.log(index)
      this.$emit('handleApproverClick')
    },
    remoteSearch(){
      let params = {
        userId:this.userId
      }
      getParentByIdList(params).then((res)=>{
        this.nickNameArray = res.data
      })
    },
    focusReviewedType(){

    }
  }
}
</script>

<style scoped>

</style>
