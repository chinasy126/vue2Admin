<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.title"/>
      </el-form-item>

      <el-form-item label="作者">
        <el-input v-model="form.author"/>
      </el-form-item>

      <el-form-item label="详情">
        <el-input v-model="form.pageviews" type="textarea"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-input v-model="form.status" type="number"/>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker v-model="form.display_time" type="date"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { insert, updateRow } from '@/api/table'

export default {
  name: 'DialogForm',
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        title: '',
        author: '',
        pageviews: '',
        status: '',
        display_time: ''
      }
    }
  },
  created() {

    if (typeof (this.formData.id) !== 'undefined') {
      this.form = JSON.parse(JSON.stringify(this.formData))
    }
  },
  watch: {
    formData(newData, oldData) {
      this.form = newData
    }
  },
  methods: {
    async onSubmit() {
      let form = JSON.parse(JSON.stringify(this.form))
      if (form.display_time !== null) {
        form.display_time = form.display_time.split('T')[0]
      }
      let result
      if (this.formData.id) {
        result = await updateRow(form, this.formData.id)
      } else {
        result = await insert(form)
      }

      let { code, message } = result
      if (code === 20000) {
        this.$message.success(message)
      }
      this.$emit('handlerCloseDialog')
    },
    onCancel() {
      this.$emit('handlerCloseDialog')
    }
  }
}
</script>

<style lang="less" scoped>
///deep/ .el-form-item__label {
//  color: #606266;
//}
//.el-form-item__label {
//  color: #606266;
//}
</style>
