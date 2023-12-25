<template>
  <el-dialog :visible="dialogEditProcessDialog" :title="detailsTitle" width="60%" @close="handleClose">
    <template v-slot:title>
      <div style="font-weight: bold;font-size: 15px">{{ detailsTitle }}</div>
    </template>
    <el-table :data="tableData" style="width: 100%">
      <!-- 序号列 -->
      <el-table-column label="序号" type="index"/>

      <!-- 节点名称列，使用 el-input -->
      <el-table-column label="节点名称">
        <template slot-scope="scope">
          <el-input
            v-if="!scope.row.isStart && !scope.row.isEnd"
            v-model="scope.row.modelNode"
            @input="nodeEvent(scope.$index)"
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
            @change="focusReviewedType(scope.$index)"
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


            <div v-if="scope.row.reviewedName === null">
              /
            </div>
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
          <div v-if="scope.row.reviewedType === '指定人员'">
            <el-input
              v-if="!scope.row.isStart && !scope.row.isEnd"
              readonly
              v-model="scope.row.reviewedName"
              placeholder="点击选择审批人"
              @click.native="handleApproverClick(scope.row,scope.$index)"
            ></el-input>
          </div>

          <div v-if="scope.row.reviewedName === '超级管理员'">/</div>
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
      <el-button type="primary" @click="saveProcessEdit">保存</el-button>
      <el-button @click="returnProcess">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getDetailList, getParentByIdList, getEditActiveModelList} from '@/api/auditCenter/process/process'

export default {
  name: 'processEdit',
  props: ['dialogEditProcessDialog', 'activeModelId', 'processObj','detailsTitle'],
  watch: {
    activeModelId(newVal) {
      if (newVal) {
        this.getEditList(newVal)
      }
    },
    processObj(newVal) {
      // debugger
      // 考虑到空对象的情况，所以还需要判断userId是否存在，如果存在，再赋值
      if (newVal && newVal.userId) {
        this.tableData[this.activeIndex].reviewedName = newVal.nickName
        this.tableData[this.activeIndex].reviewedId = newVal.userId
      }
    }
  },
  data() {
    return {
      //编辑审核中心的详情
      dialogInputProcessDialog: false,
      // detailsTitle: '供应商档案审核流程',
      tableData: [],
      approverTypes: [
        {label: '上级领导'},
        {label: '指定人员'}
      ],
      nickNameArray: [],
      userInfo: '',
      userId: '',
      activeIndex: 0,
      selectedName: '', // 保存选择的行的姓名
      processRow: {},
      // selectedUserId: '' // 保存选择的行的ID
    }
  },
  created() {
    this.userInfo = JSON.parse(window.localStorage.getItem("user"))
    this.userId = this.userInfo.userId
    this.remoteSearch();
  },
  mounted() {

  },
  methods: {
    /* 获取详情信息*/
    getEditList(newVal) {
      let params = {
        activeModelId: newVal
      }
      getDetailList(params).then((res) => {
        this.tableData = res.data
      })
    },
    /*增加行数*/
    addRow(index) {
      const newRow = {
        serialNumber: index + 2,
        modelNode: '',
        reviewedType: '',
        reviewedName: '',
        reviewedId: '',
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
    nodeEvent(index){
      if(this.tableData[index].modelNode === '开始' || this.tableData[index].modelNode === '结束'){
        this.tableData[index].modelNode = '';
        return this.$notify.error({
          duration: 2000,
          name: '失败',
          message: '节点名称不允许输入开始或者结束'
        })
      }
    },
    saveProcessEdit() {
      for(let x in this.tableData){
        if(this.tableData[x].modelNode === ''){
          return this.$notify.error({
            duration: 2000,
            name: '失败',
            message: '节点名称不能为空'
          })
        }
      }

      for(let y in this.tableData){
        if(this.tableData[y].reviewedType === ''){
          return this.$notify.error({
            duration: 2000,
            name: '失败',
            message: '审批人类型不能为空'
          })
        }
      }

      for(let z in this.tableData){
        if(this.tableData[z].reviewedId === ''){
          return this.$notify.error({
            duration: 2000,
            name: '失败',
            message: '审批人不能为空'
          })
        }
      }


      for (let i in this.tableData) {
        this.tableData[i].serialNumber = Number(i) + 1;
      }
      let params = {
        activeModelId: this.activeModelId,
        nodeDetails: this.tableData
      }
      getEditActiveModelList(params).then(res => {
        this.$notify.success({
          duration: 2000,
          name: '成功',
          message: res.msg
        })
      })
      this.handleClose();
    },
    /* 返回 */
    returnProcess(){
      this.handleClose();
    },
    handleClose() {
      this.$emit('handleClose')
    },
    handleApproverClick(row, index) {
      this.processRow = row
      this.activeIndex = index;
      this.selectedName = row.nickName; // 将表格中已选的姓名赋值给 selectedName
      // this.selectedUserId = row.id; // 将表格中已选的ID赋值给 selectedId
      this.$emit('handleApproverClick')
    },
    remoteSearch() {
      let params = {
        userId: this.userId
      }
      this.nickNameArray = [];
      getParentByIdList(params).then((res) => {
        // console.log(res.data)
        // this.nickNameArray = res.data.map(item => {
        //   return {
        //     nickName: item.nickName,
        //     userId: item.userId
        //   }
        // });
        let {nickName, userId} = res.data;
        this.nickNameArray.push({
          nickName, userId
        })
      })
    },
    focusReviewedType(index) {
      this.tableData[index].reviewedId = ''
      // console.log(this.tableData[index])
    }
  }
}
</script>

<style scoped>

</style>
