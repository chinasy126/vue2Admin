<template>
  <el-form :model="userModifyForm" :rules="rules"
           ref="updatePasForm" label-width="90px"
  >
    <el-form-item label="用户名" prop="name">
      <el-input v-model="userInfo.name" disabled></el-input>
    </el-form-item>

    <el-form-item label="旧密码" prop="oldPassword">
      <el-input placeholder="请输入密码" v-model="userModifyForm.oldPassword" clearable show-password></el-input>
    </el-form-item>

    <el-form-item label="新密码" prop="newPassword">
      <el-input placeholder="请输入密码" v-model="userModifyForm.newPassword" clearable show-password></el-input>
    </el-form-item>
    <el-form-item label="重复密码" prop="confirmPassword">
      <el-input placeholder="请输入密码" v-model="userModifyForm.confirmPassword" clearable show-password></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import store from '@/store'
import { comPassSame, updatePassword } from '@/api/user'
import router from '@/router'

export default {
  inject: ['logout'],
  name: 'updatePassword',
  data() {
    return {
      userInfo: { name: store.getters.name },
      userModifyForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, validator: this.validPassword, trigger: 'blur' },
          { min: 5, message: '密码最小长度为5位数', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 5, message: '密码最小长度为5位数', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: this.newPasswordFn, trigger: 'blur' },
          { min: 5, message: '密码最小长度为5位数', trigger: 'blur' }
        ]
      }

    }
  },
  methods: {
    async validPassword(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        if (value.length < 5) {
          callback(new Error('密码最小长度为5位数'))
        } else {
          const result = await comPassSame({ 'password': value })
        }

      }

    },

    newPasswordFn(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      }
      if (value !== '' && this.userModifyForm.newPassword !== '') {
        if (value === this.userModifyForm.newPassword) {
          callback()
        } else {
          callback(new Error('两次密码输入不一致'))
        }
      }
    },

    submitForm() {
      this.$refs['updatePasForm'].validate((valid) => {
        if (valid) {
          updatePassword({ 'password': this.userModifyForm.confirmPassword }).then(() => {
            this.$message.success(`密码修改成功`)
            setTimeout(() => {
              this.logout()
            })

          })
        }
      })
    }

  },
  mounted() {

  }
}
</script>

<style scoped>
.el-form {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
