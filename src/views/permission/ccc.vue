<template>
  <el-form >
    <el-form-item label="年龄" prop="age" :rules="rulesa" >
      <el-input  v-model="numberValidateForm.age" ></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    function checkAge(rule, value, callback) {
      console.log(value)
    }
    return {
      numberValidateForm: {age: '' },
      rulesa: [{ max_age: 18, validator: checkAge, trigger: 'blur' }]
    }
  },
  methods: {}
}
</script>
