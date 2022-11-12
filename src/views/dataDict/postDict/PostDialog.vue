<template>
  <el-dialog 
    :visible.sync="show" 
    :title="title"
    width="30%"
    center
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="名称:" prop="dictLabel">
        <el-input v-model.trim="form.dictLabel" placeholder="请输入名称" maxlength="10" />
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
    return {
      show: false,
      title: '',
      form: {
        dictLabel: ''
      },
      rules: {
        dictLabel: [
          { required: true, trigger: 'blur', message: '请输入名称' }
        ]
      },
      item: null,
      index: undefined
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
        let method = 'post'
        let data = {
          dictLabel: this.form.dictLabel,
          dictType: 'post_type'
        }
        if (this.item) {
          method = 'put'
          data.dictCode = this.item.dictCode
        }
        this.$emit('action', data, method, this.index)
      })
    },
    open(item, index) {
      this.show = true
      this.$nextTick(() => {
        this.item = item
        this.index = index
        if (this.item) {
          this.title = '编辑职位类型'
          this.form.dictLabel = item.dictLabel
        } else {
          this.title = '添加职位类型'
        }
      })
    },
    close() {
      this.show = false
    }
  }
}
</script>