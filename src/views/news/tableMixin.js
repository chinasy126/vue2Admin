

export default {
  data() {
    return {
      columns: [
        { label: 'ID', prop: 'id' },
        {
          label: '标题', prop: 'title',
          isSlot: true
        },
        { label: '副标题', prop: 'fTitle' },
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
      ],
      // 表格配置
      dataSource: [],
      selected: []
    }
  },
  created() {
    this.getItemList()
  },
  methods: {

    // 搜索层事件
    filterMsg(msg) {
      this.msg = msg
      if (Object.keys(msg).length > 0) {
        this.getList(msg)
      } else {
        this.getList()
      }
    },
    // 子组件通信
    childMsg(msg) {

    },


    // 表格操作列回调
    handleRow(index, row, lable) {
      if (lable === '删除') {
        this.$confirm('确认删除该版本?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delVersion({ versionId: row.id }).then(res => {
            if (res.succeed) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        }).catch(() => {
        })
      }
    }
  }
}
