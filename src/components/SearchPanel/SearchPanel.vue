<template>
  <div class="searchPannel">
    <el-card class="box-card">
      <el-row>
        <el-form
          class="searchForm"
          ref="searchForm"
          :model="searchForm"
          :inline="true"
        >
          <slot></slot>
          <template v-for="(item,index) in searchItemList">
            <el-col :span="spanNum" :key="index">
              <slot :name="index"></slot>
              <el-form-item :label="item.name" :key="index" :prop="item.prop" class="searchLabel">
                <!-- 输入框 -->
                <template v-if="item.type === 'input'">
                  <el-input
                    v-model="searchForm[item.prop]"
                    :disabled="item.disabled"
                    class="searchValue"
                    :clearable="item.clearable || true"
                  ></el-input>
                </template>

                <template v-if="item.type === 'date'">
                  <el-date-picker
                    v-model="searchForm[item.prop]"
                    :disabled="item.disabled"
                    :clearable="item.clearable || true"
                    type="date"
                    value-format="yyyy-MM-dd"
                  />
                </template>

              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </el-row>
      <!--v-debounce="{fn:handlerEventSearch,time:1000}"  @click="handlerEventSearch"-->
      <div class="searchBtnList">
        <el-button
          type="primary"
          v-debounce="{fn:handlerEventSearch,time:1000}"
          class="btnSearch"
          :loading="searchBtnLoading"
        >查询
        </el-button>
        <el-button v-if="isShowReset" type="primary" @click="handlerReset">重置</el-button>
        <slot name="operationButton"></slot>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'SearchPanel',
  props: {
    searchBtnLoading: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isShowReset: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    isShowExport: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    itemList: {
      type: Array,
      default: () => {
        return [
          {
            type: 'input',
            name: '名称',
            prop: 'name',
            labelCol: 6,
            wrapperCol: 14,
            disabled: false, // 用于控制是否可以输入 默认flase
            value: ''
          }
        ]
      }
    }
  },
  data() {
    let searchForm = {}
    return {
      spanNum: 6,
      searchForm: searchForm
    }
  },
  methods: {

    handlerReset() {
      this.$refs.searchForm.resetFields()
      this.$emit('reset') //清除slot内嵌的form元素数据
    },
    /**
     * 点击搜索
     */
    handlerEventSearch() {
      const params = {}
      this.itemList.forEach(item => {
        switch (item.type) {
          case 'input':
            params[item.prop] = this.searchForm[item.prop]
            break
          case 'date':
            params[item.prop] = this.searchForm[item.prop]
        }
      })
      this.$emit('onSearch', params)
    }
  },
  computed: {
    searchItemList() {
      return this.itemList
    }
  }
}
</script>


<style lang="less" scoped>

///deep/ .el-form-item__label {
//  color: #606266;
//}

.searchPannel {
  margin-bottom: 25px;
}

.searchLabel {
  //width: 25%;
  //margin-right: 0px;
}

.searchBtnList {
  display: flex;
  justify-content: flex-end;
}

.ant-form-inline {
  .is-collapse {
    height: 80px;
    overflow: hidden;
  }

  .ant-form-item {
    width: 100%;
  }
}

.ant-form-item-children {
  display: flex;

  .ant-calendar-picker {
    div {
      width: 110px;
    }
  }

  .text {
    margin: 0 5px;
  }
}
</style>
