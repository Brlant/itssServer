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
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ regionItem.dictLabel }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in region" :key="index" @click.native="onClick(index)">
              {{ item.dictLabel }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="add" @click="handleDialog(null)">
          <span class="plus">+</span>
          <span class="text">添加</span>
        </div>
      </div>
      <el-table :data="data">
        <el-table-column align="center" width="100" label="字典ID" prop="postId" />
        <el-table-column align="center" label="区域" prop="regionName" />
        <el-table-column align="center" label="职位" prop="postName" />
        <el-table-column align="center" label="等级" prop="postLevelName" />
        <el-table-column align="center" label="对内成本预设（元/天）" prop="costIn" />
        <el-table-column align="center" label="对外成本预设（元/天）" prop="costOut" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <span class="edit" @click="handleDialog(row)">编辑</span>
            <span class="del" @click="del(row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 添加/编辑 -->
    <add-edit :data="rawRegion" ref="dialog" @confirm="confirm" />
  </div>
</template>

<script>
import { dictData, queryPost, updatePost } from '@/api/dataDict'
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
      list: [],
      rawRegion: [],
      region: [],
      allRegion: [
        { dictLabel: '全部区域', dictCode: null }
      ],
      regionItem: {},
      index: -1,
      data: []
    }
  },
  created() {
    this.getPost()
    this.getRegion()
  },
  methods: {
    // 职位类型列表
    getPost() {
      const params = {
        dictType: 'post_type',
        status: '0'
      }
      dictData(params).then(res => {
        this.list = res.rows
        if (this.list.length) {
          this.n = 0
          this.getTableData()
        }
      })
    },
    // 区域列表
    getRegion() {
      const params = {
        dictType: 'region',
        status: '0'
      }
      dictData(params).then(res => {
        let { rows } = res
        this.rawRegion = rows
        this.region = [...rows, ...this.allRegion ]
        this.index = this.region.length - 1
        this.regionItem = this.region[this.index]
      })
    },
    // 表格数据
    getTableData() {
      let data = {
        postNameId: this.list[this.n].dictCode,
        regionId: this.index === -1 ? null : this.regionItem.dictCode,
        status: '0'
      }
      queryPost(data).then(res => {
        this.data = res.data
      })
    },
    // 选择类型职位
    change(index) {
      if (this.n === index) return
      this.n = index
      this.getTableData()
    },
    // 选择区域
    onClick(index) {
      if (this.index === index) return
      this.index = index
      this.regionItem = this.region[index]
      this.getTableData()
    },
    // 添加与编辑
    handleDialog(row) {
      this.$refs.dialog.open(row, this.list[this.n].dictCode)
    },
    // 弹窗确认
    confirm(data, method) {
      updatePost(data, method).then(res => {
        this.$refs.dialog.close()
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getTableData()
        }
      })
    },
    del(row) {
      this.$confirm('是否确认删除?', '提示', {
        type: 'warning'
      }).then(() => {
        const data = {
          postId: row.postId,
          delFlag: 1
        }
        updatePost(data).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.getTableData()
          }
        })
      }).catch(() => {})
    },
    // 搜索
    search() {
      debounce(this.getList)
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
.el-dropdown-menu__item {
  text-align: center;
}
</style>