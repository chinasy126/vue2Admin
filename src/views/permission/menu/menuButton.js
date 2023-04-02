export default {
  name: 'menuButton',
  // functional: true,
  props: {
    name: {
      type: String,
      default: ''
    },
    btnType: {
      type: String,
      default: () => {
        return ''
      }
    },
    btnId: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose(e) {
      console.log(e)
    }
  },
  render(h, context) {

    let tagType = 'success' //  success / info / warning / danger
    switch (this.btnType) {
      case 'delete':
        tagType = 'danger'
        break
      case 'edit':
        tagType = 'warning'
        break
      case 'export':
        tagType = 'info'
        break
      case 'import':
        tagType = 'info'
        break
      case 'add':
        tagType = 'success'
        break
      case 'batchDeletion':
        tagType = 'danger'
        break
      default:
        tagType = 'success'
    }

    return h('el-tag', {
      style: { marginRight: '10px' },
      props: {
        type: tagType,
        closable: true
      },
      on: {
        close: () => {
          this.$emit('close', this.btnId)
        }
      }
    }, this.name)
  }
}
