<template>
  <el-dialog 
    :visible.sync="show" 
    :title="title" 
    width="30%"
    center
    destroy-on-close
   >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="区域:" prop="regionId">
        <el-select v-model="form.regionId" placeholder="请选择区域">
          <el-option 
            v-for="(item, index) in data"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职位名称:" prop="postNameId">
        <el-select v-model="form.postNameId" placeholder="请选择职位名称" filterable>
          <el-option 
            v-for="(item, index) in post"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="等级:" prop="postLevelId">
        <el-select v-model="form.postLevelId" placeholder="请选择等级">
          <el-option 
            v-for="(item, index) in level"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成本预设（内）:" prop="costIn">
        <el-input v-model.trim="form.costIn" placeholder="请输入成本预设（内）" />
      </el-form-item>
      <el-form-item label="成本预设（外）:" prop="costOut">
        <el-input v-model.trim="form.costOut" placeholder="请输入成本预设（外）" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dictData } from '@/api/dataDict'

export default {
  props: ['data'],
  data() {
    const check = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        if (String(Number(value)) === 'NaN') {
          callback(new Error('输入内容不合规'))
        } else {
          if (value < 0) {
            callback(new Error('输入内容不合规'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      show: false,
      title: '',
      row: {},
      post: [],
      level: [],
      postTypeId: '',
      form: {
        regionId: null,
        postNameId: null,
        postLevelId: null,
        costIn: null,
        costOut: null
      },
      rules: {
        regionId: [
          { required: true, trigger: 'blur', message: '请选择区域' }
        ],
        postNameId: [
          { required: true, trigger: 'blur', message: '请选择职位名称' }
        ],
        postLevelId: [
          { required: true, trigger: 'blur', message: '请选择等级' }
        ],
        costIn: [
          { validator: check, trigger: 'blur' }
        ],
        costOut: [
          { validator: check, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show(value) {
      if (!value) {
        this.$refs.form.resetFields()
      }
    }
  },
  created() {
    this.getPost()
    this.getLevel()
  },
  methods: {
    // 获取职位
    getPost() {
      const params = {
        dictType: 'post_name',
        status: '0',
        pageNum: 1,
        pageSize: 500
      }
      dictData(params).then(res => {
        this.post = res.rows
      })
    },
    // 获取等级
    getLevel() {
      const params = {
        dictType: 'post_level',
        status: '0'
      }
      dictData(params).then(res => {
        this.level = res.rows
      })
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        let method = 'post'
        let data = {
          regionId: this.form.regionId,
          postNameId: this.form.postNameId,
          postLevelId: this.form.postLevelId,
          costIn: this.form.costIn - 0,
          costOut: this.form.costOut - 0,
          postTypeId: this.postTypeId,
          status: '0'
        }
        if (this.row) {
          data.postId = this.row.postId
          method = 'put'
        }
        this.$emit('confirm', data, method)
      })
    },
    open(row, postTypeId) {
      this.show = true
      this.$nextTick(() => {
        this.row = row
        this.postTypeId = postTypeId
        if (this.row) {
          this.title = '编辑'
          this.matchFormData()
        } else {
          this.title = '添加'
        }
      })
    },
    matchFormData() {
      this.form.regionId = this.row.regionId
      this.form.postNameId = this.row.postNameId
      this.form.postLevelId = this.row.postLevelId
      this.form.costIn = this.row.costIn
      this.form.costOut = this.row.costOut
    },
    close() {
      this.show = false
    }
  },
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>