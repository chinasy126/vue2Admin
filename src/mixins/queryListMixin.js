export default {
  data() {
    return {
      getListFnName: () => {
      }, // 查询接口API
      selectItemList: [],// 多选择的结果集
      searchForm: {},
      searchBtnLoading: false,
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      totalPage: 0, // 总页数
      totalCount: 0, // 总条数
      dataSource: [],
      tableLoading: false
    }
  },
  methods: {

    /**
     * 搜索
     * @param params
     * @returns {Promise<void>}
     */
    async handleEventSearch(params) {
      this.searchForm = { ...params }
      await this.getItemList()
    },
    /**
     * 从接口获取返回数据列表
     * @returns {Promise<void>}
     */
    async getItemList() {
      this.searchBtnLoading = true
      this.tableLoading = true
      const params = { ...this.searchForm }
      try {
        const res = await this.getListFnName(params, this.pageNum, this.pageSize)
        if (res.code === 20000) {
          const result = res.data.data
          const { total, current, size, records } = result
          this.totalCount = res.data.data.total
          this.pageNum = res.data.data.current
          this.pageSize = res.data.data.size
          this.dataSource = res.data.data.records
        } else {
          this.$message.error(res.message)
          this.dataSource = []
        }
      } catch (e) {
        // console.log(e)
      } finally {
        this.searchBtnLoading = false
        this.tableLoading = false
      }
    },

    /**
     * 改变每页数量
     * @param size
     */
    async changeSize(size) {
      this.pageSize = size
      await this.getItemList()
    },
    /**
     * 改变页码
     * @param pageNum
     */
    async changeNum(pageNum) {
      this.pageNum = pageNum
      await this.getItemList()
    },

    /**
     *  选择行
     */
    handleSelectionChange(rows) {
      this.selectItemList = rows
    }

  },
  created() {
    this.getItemList()
  },
  watch: {}
}
