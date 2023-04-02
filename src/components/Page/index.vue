<template>
  <!-- S 封装分页 -->
  <el-card class="pagination">
    <el-pagination
      v-if="total > 0"
      background
      :current-page="pageNum"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
  <!-- E 封装分页 -->
</template>

<script>
export default {
  name: 'index',
  props:{
    // 总页数
    total: {
      type: Number,
      default: () => {
        return 0
      }
    },
    // 当前页
    pageNum: {
      type: Number,
      default: () => {
        return 0
      }
    },
    // 修改页数
    pageSizes: {
      type: Array,
      default: () => {
        return [5, 10, 15, 20]
      }
    },
    // 一共多少页
    pageSize: {
      type: Number,
      default: () => {
        return 0
      }
    },
  },
  methods:{
    handleSizeChange(val) {
      this.$emit('changeSize', val)
      console.log(`每页 ${val} 条`)
    },

    handleCurrentChange(val) {
      this.$emit('changeNum', val)
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped>

</style>
