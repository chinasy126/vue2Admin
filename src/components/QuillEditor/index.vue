<template>
  <div class="VueQuillEditor">
    <div>
      <el-upload
        style="display: none"
        class="quill-avatar-uploader"
        action="/"
        :show-file-list="false"
        accept="image/png, image/jpeg, image/jpg"
        :before-upload="beforeAvatarUpload"
        :http-request="uploadPic"
      >
      </el-upload>

      <quill-editor
        ref="myQuillEditor"
        :content="content"
        :options="editorOption"
        @change="onEditorChange($event)"
      >
      </quill-editor>
    </div>
  </div>


</template>
<script>

// you can also register quill modules in the component
import Quill from 'quill'
import { uploadImg } from '@/api/uploadFile'
import { addImgSrcPrefix, replaceImgSrc } from '@/utils'
// import { someModule } from '../yourModulePath/someQuillModule.js'
// Quill.register('modules/someModule', someModule)

export default {
  props: {
    value: {
      type: String | Number,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      content: '<h2>I am Example</h2>',
      editorOption: {
        placeholder: '请输入文本...',
        modules: {
          toolbar: {
            // 配置工具栏，此次引入了全部工具栏，也可自行配置
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ font: [] }],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ['link', 'image', 'video'],
              ['insertMetric'] //新添加的工具
            ],
            // 2.第二步：自定义图片按钮事件
            handlers: {
              insertMetric: function() {
                //方法体
                alert(1)
              },
              // 自定义图片上传
              image: function(value) {
                if (value) {
                  // 点击图片按触发elmentui上传的input选择图片事件.quill-avatar-uploader是上传文件组件的那个类名
                  document
                    .querySelector('.quill-avatar-uploader input')
                    .click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
        // some quill options
      }
    }
  },
  // manually control the data synchronization
  // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
  methods: {
    beforeAvatarUpload(file) {
      let isPass = false
      if (
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg'
      ) {
        isPass = true
      }
      const isLt = file.size / 1024 / 1024 < 5
      if (!isPass) {
        this.$message.error('当前仅支持上传图片JPG/jpeg/png格式!')
        return false
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false
      }
      return isPass && isLt
    },
    uploadPic(param) {
      const fileObj = param.file
      const form = new FormData()
      form.append('file', fileObj)
      form.append('type', '') // 文件类型拆分文件夹

      uploadImg(form, {
        // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
        headers: {
          // 表示上传的是文件,而不是普通的表单数据
          'Content-Type': 'multipart/form-data',
          'X-Token': window.localStorage.getItem('token')
        }
      }).then(res => {
        if (res.data.file) {
          console.log(res)

          // 获取富文本组件实例
          let quill = this.$refs['myQuillEditor'].quill
          // 获取光标所在位置
          let length = quill.getSelection().index
          // 插入图片insertEmbed()三个参数，前两个固定即可
          quill.insertEmbed(length, 'image', res.data.file)
          // 调整光标到最后
          quill.setSelection(length + 1)

        } else {
          this.$message.error('上传文件错误')
        }
      })
    },

    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      this.content = html
      const emitHtml = html
      this.$emit('changeQuillEditor', emitHtml)
    }

// onEditorChange(e) {
    //   this.$emit('update:quillContent', e.html)
    // },
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    value: {
      handler(val) {
        this.content = val
      },
      immediate: true
    }
  },
  mounted() {
    this.content = this.value
    const sourceEditorButton = document.querySelector('.ql-insertMetric')
    sourceEditorButton.innerHTML = '<i class="el-icon-plus" style="font-size: 18px;color: black"></i>'

  }
}
</script>
<style lang="less" scoped>
.ql-aaa {
  border: 1px solid #409eff;
}
</style>
