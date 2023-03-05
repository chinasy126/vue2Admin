<template>
  <el-dialog
    :title="opFormDialog.title"
    :visible.sync="opFormDialog.visible"
    width="800px"
    :before-close="closeForm"
  >
    <!--  model	表单数据对象  -->
    <el-form ref="opFormModel" :model="opFormModel" :rules="opFormRules" :label-width="labelWidth">
      <template v-for="(item,index) in opFormItems" >
        <slot :name="index" ></slot>
        <el-form-item :label="item.label" :prop="item.prop" :key="index" >
          <template v-if="item.type === 'input'">
            <el-input v-model="opFormModel[item.prop]" clearable/>
          </template>
          <template v-if="item.type === 'textarea'">
            <el-input v-model="opFormModel[item.prop]" type="textarea" clearable/>
          </template>
          <template v-if="item.type === 'date'">
            <el-date-picker v-model="opFormModel[item.prop]" type="date" value-format="yyyy-MM-dd" clearable/>
          </template>
          <template v-if="item.type === 'number'">
            <el-input-number v-model="opFormModel[item.prop]"></el-input-number>
          </template>
          <template v-if="item.type === 'select'">
            <el-select v-model="opFormModel[item.prop]" placeholder="请选择" filterable clearable>
              <el-option v-for="slectItem in item.selectValue"
                         :key="slectItem.value"
                         :label="slectItem.label"
                         :value="slectItem.value"
                         :disabled="slectItem.disabled || false"
              >
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </template>
      <slot name="-1"></slot>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')" :loading="opFormBtnLoading">
          {{ opFormDialog.buttonTitle }}
        </el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { isNull } from '@/utils'

export default {
  name: 'OpFormPannel',
  mixins: [],
  data() {
    let opFormModel = {}
    return {
      opFormModel: opFormModel
    }
  },
  props: {
    // 弹框名称以及是否可见
    opFormDialog: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表单按钮是否加载LOADING
    opFormBtnLoading: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 绑定表单的Model
    // opFormModel: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // },
    // 父组件传递循环的Item 每一项
    opFormItems: {
      type: Array,
      default: () => {
        return [
          {
            label: '所属角色',
            prop: 'roleId',
            type: 'select',
            value: [{ id: 1, label: 1, value: 1 }],
            showValue: true
          }
        ]
      }
    },
    // 表单的文字左侧距离
    labelWidth: {
      type: String,
      default: () => {
        return '120px'
      }
    },
    // 表单验证规则
    opFormRules: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {

  },
  methods: {

    checkForm(rule, value, callback) {
      console.log(value)
      if (value == 1) {
        callback()
      } else {
        callback(new Error('用户名长度必须大于3'))
      }

    },

    /**
     * 转换 表单每一项
     */
    getFormProp() {
      let obj = {}
      this.opFormItems.forEach(item => {
        if (item.type === 'number' && isNull(item.value)) {
          obj[item.prop] = isNull(item.value)
        } else {
          if (typeof (item.showValue) !== 'undefined' && item.showValue === false) {
            obj[item.prop] = ''
          } else {
            obj[item.prop] = isNull(item.value)
          }

        }
      })
      this.opFormModel = obj
    },

    /**
     * 表单提交
     * @param formName
     */
    submitForm(formName) {
      this.$refs.opFormModel.validate(async(valid) => {
        if (valid) {
          let params = { ...this.opFormModel }
          // mixin进行数据提交
          this.$emit('onFormSubmit', params)
        }
      })
    },
    /**
     * 表单取消
     * @param formName
     */
    resetForm(formName) {
      this.$refs['opFormModel'].resetFields()
      this.closeForm()
    },
    /**
     * 关闭表单
     */
    closeForm() {
      this.$emit('opCloseForm')
    }
  },
  watch: {
    opFormItems: {
      handler() {
        this.getFormProp()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    /**
     * 初始化弹窗个项目  标题，是否可见
     * @returns {{visible: boolean, title: string}}
     */
    opFormDialogItem() {
      let result = { title: '操作', visible: false }
      if (typeof (this.opFormDialog.title) !== 'undefined' && this.opFormDialog.title !== '') {
        result.title = this.opFormDialog.title
      }
      if (typeof (this.opFormDialog.visible) !== 'undefined') {
        result.visible = this.opFormDialog.visible
      }
      return result
    }
  }
}
</script>

<style scoped>

</style>
