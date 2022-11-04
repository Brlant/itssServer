<template>
  <el-dialog 
    :visible.sync="show" 
    :title="title" 
    width="30%"
    center
    destroy-on-close
   >
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="区域:" prop="area">
        <el-select v-model="form.area" placeholder="请选择区域">

        </el-select>
      </el-form-item>
      <el-form-item label="职位名称:" prop="position">
        <el-input v-model.trim="form.position" placeholder="请输入职位名称" />
      </el-form-item>
      <el-form-item label="等级:" prop="level">
        <el-input v-model.trim="form.level" placeholder="请输入等级" />
      </el-form-item>
      <el-form-item label="成本预设（内）:" prop="inner">
        <el-input v-model.trim="form.inner" placeholder="请输入成本预设（内）" />
      </el-form-item>
      <el-form-item label="成本预设（外）:" prop="outer">
        <el-input v-model.trim="form.outer" placeholder="请输入成本预设（外）" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
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
      form: {
        area: '',
        position: '',
        level: '',
        inner: '',
        outer: ''
      },
      rules: {
        area: [
          { required: true, trigger: 'blur', message: '请选择区域' }
        ],
        position: [
          { required: true, trigger: 'blur', message: '请输入职位名称' }
        ],
        inner: [
          { validator: check, trigger: 'blur' }
        ],
        outer: [
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
  methods: {
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
      })
    },
    open(row) {
      this.show = true
      this.$nextTick(() => {
        this.row = row
        if (this.row) {
          this.title = '编辑'
        } else {
          this.title = '添加'
        }
      })
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