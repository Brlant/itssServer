<template>
  <div class="dict_group">
    <!-- 左侧搜索 -->
    <section class="search">
      <el-input
        v-model.trim="dictName"
        placeholder="搜索字典类型"
        prefix-icon="el-icon-search"
        clearable
        @input="search"
      />
      <div class="tab">
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="{current: index === n}"
          @click="change(index)"
        >
          {{ item.dictName }}
        </div>
      </div>
    </section>
    <!-- 右侧表格 -->
    <section class="table">
      <header>
        <div class="option">
          <div class="wrap" v-for="(item, index) in option" :key="index">
            <span :class="{active: flag === index}" @click="changeOption(index)">
              {{ item.label }}
            </span>
          </div>
        </div>
        <div class="add" @click="handleDialog(null)">
          <span class="plus">+</span>
          <span class="text">添加</span>
        </div>
      </header>
      <el-table :data="data" v-loading="loading">
        <el-table-column align="center" label="ID" width="100" prop="dictCode" />
        <el-table-column align="center" label="名称" prop="dictLabel" />
        <el-table-column align="center" label="标签颜色" v-if="dict.dictType === 'skill_type'">
          <template slot-scope="{row}">
            <span class="color" :style="{background: row.cssClass}"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" />
        <el-table-column align="center" label="创建人" prop="createBy" />
        <el-table-column align="center" label="上次修改时间" prop="updateTime" />
        <el-table-column align="center" label="上次修改人" prop="updateBy" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <span class="edit" v-if="row.status === '0'" @click="handleDialog(row)">编辑</span>
            <span class="ban" @click="operation(row)">{{ row.status === '0' ? '停用' : '启用' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 15px"
        :current-page="pageNum"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </section>
    <!-- 弹窗 -->
    <add-edit ref="dialog" @confirm="confirm" />
  </div>
</template>

<script>
import AddEdit from './AddEdit'
import { dictList, dictData, addAndEdit } from '@/api/dataGroup/dictGroup'
import debounce from '@/utils/debounce'

export default {
  components: {
    AddEdit
  },
  data() {
    return {
      dictName: '',
      list: [],
      dict: {},
      n: -1,
      option: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' }
      ],
      flag: 0,
      loading: false,
      data: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  created() {
    this.getDictList()
  },
  methods: {
    // 字典组列表
    getDictList() {
      const params = {
        dictName: this.dictName
      }
      dictList(params).then(res => {
        this.list = res.rows
        if (this.list.length) {
          if (!this.dictName) {
            this.n = 0
            this.dict = this.list[0]
            this.getTableData()
          } else {
            this.n = -1
          }
        }
      })
    },
    // 表格数据
    getTableData() {
      this.loading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        dictType: this.dict.dictType,
        status: this.option[this.flag].value
      }
      dictData(params).then(res => {
        this.data = res.rows
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 搜索
    search() {
      debounce(this.getDictList)
    },
    // 选中字典类型
    change(index) {
      if (this.n === index) return
      this.n = index
      this.dict = this.list[index]
      this.pageNum = 1
      this.getTableData()
    },
    // 分页
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.getTableData()
    },
    // 操作
    operation(row) {
      const notice = row.status === '0' ? '是否确认停用？' : '是否确认启用？'
      this.$confirm(notice, '提示', {
        type: 'warning'
      }).then(() => {
        const data = {
          dictLabel: row.dictLabel,
          dictType: row.dictType,
          dictCode: row.dictCode,
          status: row.status === '0' ? '1' : '0'
        }
        addAndEdit(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.pageNum = 1
            this.getTableData()
          }
        })
      }).catch(() => {})
    },
    // 添加与编辑
    handleDialog(row) {
      this.$refs.dialog.open(row, this.dict)
    },
    // 弹窗确认
    confirm(data, method) {
      addAndEdit(data, method).then(res => {
        this.$refs.dialog.close()
        if (res.code === 200) {
          this.$message.success(res.msg)
          if (method === 'post') {
            // post -> 添加；put -> 编辑
            this.pageNum = 1
          }
          this.getTableData()
        }
      })
    },
    changeOption(index) {
      if (this.flag === index) return
      this.flag = index
      this.pageNum = 1
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.dict_group {
  font-size: 14px;
  display: flex;
  align-items: flex-start;
  .search {
    width: 22%;
    margin-right: 8px;
  }
  .tab {
    background: #fff;
    margin-top: 8px;
    >div {
      padding: 12px;
      cursor: pointer;
    }
    .current {
      background: rgb(221,229,240);
    }
  }
  .table {
    width: 77%;
    background: #fff;
    padding: 10px 14px;
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      .option {
        display: flex;
        .wrap {
          line-height: 14px;
          padding-right: 10px;
          border-right: 1px solid #000;
          margin-right: 10px;
          &:last-child {
            border-right: 0;
            margin-right: 0;
          }
          span {
            cursor: pointer;
          }
          .active {
            color: rgb(76,150,196);
          }
        }
      }
      .add {
        display: flex;
        align-items: center;
        color: rgb(76,150,196);
        cursor: pointer;
        .plus {
          margin-right: 8px;
        }
      }
    }
    .color {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      transform: translateY(3px);
    }
    .edit {
      color: rgb(76,150,196);
      cursor: pointer;
      margin-right: 12px;
    }
    .ban {
      color: rgb(255,145,152);
      cursor: pointer;
    }
  }
}
</style>