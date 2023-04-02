<template>
  <div>
    <!--  S 封装TABLE -->
    <el-table
      v-loading="tableLoading"
      ref="table"
      v-bind="[$attrs, $props]"
      style="width: 100%;"
      :class="{ 'no-data': !dataSource || !dataSource.length }"
      :data="dataSource"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background:'#eee'}"
      border
      fit
      stripe
      highlight-current-row
    >
      <!-- 是否有多选 -->
      <el-table-column
        v-if="isSelection"
        :selectable="selectable"
        type="selection"
        :width="50"
        align="center"
      />
      <!-- 是否需要序号 -->
      <el-table-column v-if="isShowIndex" type="index" label="序号" width="55" align="center"/>
      <!-- 插槽 -->
      <template v-for="item in columns">
        <!-- 表格的列展示 特殊情况处理 比如要输入框 显示图片 插槽 -->
        <el-table-column v-if="item.isSlot" :key="item.prop" v-bind="item">
          <template slot-scope="scope">
            <slot :name="item.prop" :scope="scope.row"></slot>
          </template>
        </el-table-column>
        <!-- 大部分适用 -->
        <el-table-column
          v-if="!item.isSlot"
          :key="item.prop"
          v-bind="item"
          align="center"
          show-overflow-tooltip
        />
      </template>

    </el-table>
    <!-- E 封装TABLE -->
  </div>
</template>

<script>

export default {

  // 接收父组件传递过来的值
  props: {
    tableLoading: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否显示序列号
    isShowIndex: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    // 是否多选
    isSelection: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    // 有多少列
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    //  表格数据和表格部分属性的对象
    // eslint-disable-next-line vue/require-default-prop
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  watch: {
    'columns': { // 监听表格列变化
      deep: true,
      handler() {
        // 解决表格列变动的抖动问题
        this.$nextTick(this.$refs.table.doLayout)
      }
    }
  },
  methods: {
    /**
     *  多选行
     */
    handleSelectionChange(val) {
      this.$emit('selectionChange', val)
    },
    /**
     * 哪一行不可选
     * @param row
     * @param index
     * @returns {boolean}
     */
    selectable(row, index) {
      return true
      if (index == 1) {
        return false
      } else {
        return true
      }
    },
    handleAdd(name) {
      console.log(name)
      this.$emit('toolMsg', name)
    },
    handleRow(index, row, lable) {
      console.log(index, row, lable)
    },

  },
  computed: {}
}
</script>
<style lang="scss" scoped>
.page {
  margin-top: 20px;
}

.btn {
  display: flex;
  justify-content: center;
}

.btn div {
  margin-left: 5px;
}

.reference-img {
  width: 40px;
  height: 40px;
  background-size: 100% 100%;
  border-radius: 4px;
}

.image-popover {
  width: 200px;
  height: 200px;
  background-size: 100% 100%;
}

.icon {
  width: 25px;
  font-size: 20px;
  font-weight: bold;
}

.pagination {
  margin-top: 25px;
}
</style>
