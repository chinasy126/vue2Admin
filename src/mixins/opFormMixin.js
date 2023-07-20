const opFormMixin = {
  data() {
    return {
      // opFormModelLocal:{}, // 父组件内部的一些表单内容
      opFormDialogVisible: false, // 操作表单框
      opFormDialog: { title: '', visible: false, buttonTitle: '添加' },
      // opFormModel: {}, // 表单绑定的Model
      opFormItems: [], // 绑定表单的元素
      opFnName: () => {}, // 操作数据的修改或者新增
      opFormBtnLoading: false,
      opFormRules: []
    }
  },
  methods: {
    isLegal() {
    }, // 用于其他判断 通常不会使用
    /**
     * 数据合并
     * @param params
     */
    mergeOperationForm(params) {
     // Object.assign(result, params)
    },
    /**
     * 表单提交数据
     * @param params
     */
    async onOpFormSubmit(params) {
      await this.mergeOperationForm(params)
      if (this.isLegal() === true) {
        return true
      }
      // 清空没有内容字段
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
         // delete result[key]
        }
      })
      const operationForm = { ...params }
      await this.saveForm(operationForm)
    },
    /**
     * 提交表单
     */
    async saveForm(params) {
      this.opFormBtnLoading = true
      try {
        const result = await this.opFnName(params)
        if (result.code === 20000) {
          this.$message.success(`操作成功`)
          await this.getItemList()
        } else {
          this.$message.error(result.message)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.opFormBtnLoading = false
        this.opFormDialog.visible = false
      }
    },

    opCloseForm() {
      this.opFormDialog.visible = false
    }
  }
}

export default opFormMixin
