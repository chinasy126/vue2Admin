const comActionMixin = {
  data() {
    return {
      // 对话框相关
      comActionDialog: {
        title: '操作',
        visible: false,
        buttonTitle: '删除',
        message: '是否确认删除本条内容?'
      },
      // 操作数据条件
      comActionCondition: {},
      // 对话框相关接口
      comFnName: () => {}
    }
  },
  methods: {
    /**
     *  关闭对话框刷新列表
     */
    async refreshList() {
      this.comActionDialog.visible = false
      await this.getItemList()
    }
  }
}

export default comActionMixin
