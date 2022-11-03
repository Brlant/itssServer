<template>
  <el-dialog 
    :visible.sync="show" 
    :title="title" 
    center 
    width="30%"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="名称:" prop="dictLabel">
        <el-input v-model.trim="form.dictLabel" placeholder="请输入名称" maxlength="10" />
      </el-form-item>
      <el-form-item label="颜色:" prop="cssClass" v-if="dict.dictType === 'skill_type'">
        <color-select v-model="form.cssClass" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button type="primary" @click="onConfirm">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ColorSelect from '@/components/ColorSelect'

export default {
  components: {
    ColorSelect
  },
  data() {
    return {
      show: false,
      title: '',
      form: {
        dictLabel: '',
        cssClass: ''
      },
      rules: {
        dictLabel: [
          { required: true, trigger: 'blur', message: '请输入名称' }
        ],
        cssClass: [
          { required: true, trigger: 'blur', message: '请选择颜色' }
        ]
      },
      row: {},
      dict: {}
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
    open(row, dict) {
      this.row = row
      this.dict = dict
      if (this.row) {
        this.title = '编辑数据字典'
        this.form.dictLabel = row.dictLabel
        if (this.dict.dictType === 'skill_type') {
          this.form.cssClass = row.cssClass
        }
      } else {
        this.title = '添加数据字典'
      }
      this.show = true
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        let method = 'post'
        let data = {
          dictLabel: this.form.dictLabel,
          dictType: this.dict.dictType
        }
        if (this.dict.dictType === 'skill_type') {
          data.cssClass = this.form.cssClass
        }
        if (this.row) {
          method = 'put'
          data.dictCode = this.row.dictCode
        }
        this.$emit('confirm', data, method)
      })
    },
    close() {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>