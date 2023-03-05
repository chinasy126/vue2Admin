<template>
  <el-dialog
    v-bind="[$attrs,$props]"
    :visible.sync="comActionDialog.visible"
    :title="comActionDialog.title"
    width="30%"
    :before-close="handleClose"
  >
    <slot></slot>
    <span v-if="comActionDialog.message !== ''" v-html="comActionDialog.message"></span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose()">取 消</el-button>
    <el-button type="primary" v-debounce="{fn:confirm}" :loading="comActionBtnLoading">
      {{ comActionDialog.buttonTitle }}
    </el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CommonAction',
  props: {
    comActionDialog: {
      type: Object,
      default: () => {
        return {}
      }
    },
    comActionCondition: {
      type: null,
      required: false
    },
    comFnName: {
      type: Function,
      default: () => {
        return () => {
        }
      }
    },
    message: {
      type: String,
      default: () => {
        return ''
      }
    },
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      comActionBtnLoading: false
    }
  },
  created() {

  },
  methods: {

    /**
     * 点击确认操作
     */
    confirm() {
      this.comActionBtnLoading = true
      this.comFnName(this.comActionCondition).then((res) => {
        if (res.code === 20000) {
          this.$message.success('操作成功')
          this.$emit('cancel') //关闭提示弹框
          this.$emit('refresh') //刷新页面
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.$message.error(res.message)
      }).finally(() => {
        this.comActionBtnLoading = false
      })
    },

    /**
     * 关闭弹框
     */
    handleClose() {
      this.$emit('refresh') //刷新页面
    }

  }
}
</script>

<style lang="less" scoped>
::v-deep .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}


</style>
