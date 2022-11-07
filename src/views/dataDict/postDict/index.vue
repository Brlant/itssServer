<template>
  <div class="post">
    <!-- 左侧搜索 -->
    <section class="search">
      <el-input
        v-model.trim="dictType"
        placeholder="搜索职位类型"
        suffix-icon="el-icon-search"
        clearable
        @input="search"
      />
      <div class="tab">
        <div
          v-for="(item, index) in list"
          :key="index"
          :class="{current: index === n}"
          @click.self="change(index)"
        >
          {{ item.dictLabel }}
        </div>
      </div>
    </section>
    <!-- 右侧表格 -->
    <section class="table">
      <div class="heading">
        <el-dropdown>
          <span class="el-dropdown-link">
            全部区域<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>111</el-dropdown-item>
            <el-dropdown-item>222</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="add" @click="handleDialog(null)">
          <span class="plus">+</span>
          <span class="text">添加</span>
        </div>
      </div>
      <el-table :data="data">
        <el-table-column align="center" width="80" label="字典ID" />
        <el-table-column align="center" label="区域" />
        <el-table-column align="center" label="职位" />
        <el-table-column align="center" label="等级" />
        <el-table-column align="center" label="对内成本预设（元/天）" />
        <el-table-column align="center" label="对外成本预设（元/天）" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <span class="edit" @click="handleDialog(row)">编辑</span>
            <span class="del">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 添加/编辑 -->
    <add-edit ref="dialog" />
  </div>
</template>

<script>
import { dictData } from '@/api/dataDict'
import debounce from '@/utils/debounce'
import AddEdit from './AddEdit'

export default {
  components: {
    AddEdit
  },
  data() {
    return {
      dictType: '',
      n: -1,
      n2: -1,
      list: [],
      data: [{}]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 左侧列表
    getList() {
      const params = {
        dictType: 'post_type',
        status: '0'
      }
      dictData(params).then(res => {
        this.list = res.rows
        if (this.list.length) {
          if (!this.dictType) {
            this.n = 0
          } else {
            this.n = -1
          }
        }
      })
    },
    // 添加与编辑
    handleDialog(row) {
      this.$refs.dialog.open(row)
    },
    // 搜索
    search() {
      debounce(this.getList)
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
      })
    },
    update() {
      this.$refs.dialog.open()
    },
    add() {
      this.show = true
    },
    close() {
      this.show = false
    },
    change(index) {
      if (this.n === index) return
      this.n = index
    },
  }
}
</script>

<style lang="scss" scoped>
.post {
  display: flex;
  font-size: 14px;
  align-items: flex-start;
  .search {
    width: 22%;
    margin-right: 8px;
    .tab {
      background: #fff;
      margin-top: 8px;
      >div {
        padding: 12px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .current {
        background: rgb(221,229,240);
      }
    }
  }
  .table {
    width: 77%;
    background: #fff;
    padding: 8px 14px;
    .heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      .el-dropdown-link {
        cursor: pointer;
        color: rgb(76,150,196);
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
    .edit {
      color: rgb(76,150,196);
      cursor: pointer;
      margin-right: 12px;
    }
    .del {
      color: rgb(255,145,152);
      cursor: pointer;
    }
  }
}
</style>