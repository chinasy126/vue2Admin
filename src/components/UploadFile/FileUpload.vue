<template>
  <div style="margin:0px 10px">
    <!-- S 上传按钮 -->
    <el-upload
      v-if="!uploadImgIsUploading"
      action=""
      v-bind="[$attrs,$props]"
      :disabled="uploadImgIsUploading"
      class="avatar-uploader"
      :show-file-list="false"
      :httpRequest="httpRequest"
    >
      <el-button size="mini" type="primary">{{ uploadBtnName }}</el-button>
    </el-upload>
    <!-- E 上传按钮 -->

    <!-- S 文件列表显示区域 -->
    <el-progress v-if="uploadImgIsUploading" type="line" :percentage="uploadImgPercentage"></el-progress>
    <!-- E 文件列表显示区域 -->
  </div>
</template>
<script>

export default {
  name: 'FileUpload',
  data() {
    return {
      uploadImgIsUploading: false, // 上传功能是否显示
      uploadImgPercentage: 0 // 上传图片百分率
    }
  },
  created() {

  },
  computed: {
    /**
     *  传递TOKEN
     *
     */
    headers() {
      const jwt = window.localStorage.getItem('token')
      return { 'X-Token': jwt }
    }
  },
  props: {
    uploadBtnName: {
      default: '文件上传'
    },
    fileUploadFnName: {
      type: Function,
      default: () => {
      }
    },
    // 允许上传个数
    uploadLimit: {
      type: Number,
      default: () => {
        return 1 // -1 无限制
      }
    },
    // 文件大小
    limitSize: {
      type: Number,
      default: () => {
        return 20
      }
    },
    // 可以在使用组件的时候传入一个支持上传的图片格式的数组进来，不传默认default数组
    supportType: {
      default: () => ['application/vnd.ms-excel'],
      type: Array
    }

  },
  methods: {

    /**
     * 上传文件方法
     * @param param
     */
    httpRequest(param) {
      this.uploadImgPercentage = 0
      this.uploadImgIsUploading = false
      /* 对上传图片的大小和格式校验 */
      const isLt10M = param.file.size / 1024 / 1024 < this.limitSize
      if (this.supportType.indexOf(param.file.type) == -1) {
        let supportType = this.supportType
        let msg = ''
        supportType.map(res => {
          msg += res.substring(6) + '/'
        })
        let newMsg = msg.slice(0, (msg.length) - 1)
        this.$message.error(`请上传正确的文件格式！支持的格式有：` + newMsg)
        return
      }
      if (!isLt10M) {
        this.$message.error(`上传图片大小不能超过 ${limitSize} MB!`)
        return
      }
      const fileObj = param.file
      const form = new FormData()
      form.append('file', fileObj)
      // form.append('type', 'news') // 文件类型拆分文件夹
      let callback = (progress) => {
        this.uploadImgIsUploading = true
        this.uploadImgPercentage = parseInt(progress.loaded / progress.total * 100)
      }
      this.fileUploadFnName(form, {
        // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
        headers: {
          // 表示上传的是文件,而不是普通的表单数据
          'Content-Type': 'multipart/form-data',
          'X-Token': window.localStorage.getItem('token')
        }
      }, progress => {
        callback(progress)
      }).then(res => {
        this.uploadImgIsUploading = false
        this.uploadImgPercentage = 0
        if (res.code === 20000) {
          this.$message.success(`导入成功!`)
        } else {
          this.$message.error('上传文件错误!')
        }
        this.$emit('onSuccess', 'success')
      })
    }
  }

}
</script>
<style scoped>

</style>
