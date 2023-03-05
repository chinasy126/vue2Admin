<template>
  <div>
    <el-upload class="upload-demo"
               :action="uploadImageApi"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               multiple
               :limit="limit"
               :on-exceed="handleExceed"
               :on-success="handleAvatarSuccess"
               :on-change="handleChange"
               :file-list="fileList"
               :headers="headers"
    >
      <el-button size="small" type="primary">上传图片</el-button>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal="false">
      <el-image width="100%" :src="dialogImageUrl" style="border:1px solid rgb(43 200 48); "></el-image>
      <!--      <img width="100%" :src="dialogImageUrl" alt="">-->
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'UploadImg',
  props: {
    img: {
      type: String,
      default: function() {
        return ''
      }
    }
  },
  created() {

  },
  data() {
    return {
      uploadImageApi: this.uploadImageApi,
      limit: 1,
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    /**
     * 文件上传成功时的钩子
     */
    handleAvatarSuccess(res, file) {
      this.$emit('uploadSuccess', res.returnObj.fileName)
      //    this.$emit('update:uploadSuccess', res.returnObj.fileName)
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    /**
     * 预览上传图片
     * @param file
     */
    handlePreview(file) {
      console.log(file)
      this.dialogVisible = true
      this.$nextTick(function() {
        this.dialogImageUrl = `http://localhost:8088/image/${file.response.returnObj.fileName}`
      })
    },
    /**
     * 文件超出个数限制时的钩子
     */
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },

    /**
     * 文件列表移除文件时的钩子
     * @param file
     * @returns {Promise<MessageBoxData>}
     */
    handleRemove(file) {
      this.$emit('uploadSuccess', '')
      //return this.$confirm(`确定移除 ${file.name}？`)
    }
  },
  computed: {
    /**
     * 上传图片获取TOKEN
     * @returns {{'X-Token': string}}
     */
    headers() {
      const jwt = window.localStorage.getItem('token')
      return { 'X-Token': jwt }
    }
  },
  watch: {
    img: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.fileList = [{ name: newVal, response: { returnObj: { fileName: newVal } } }]
        } else {
          this.fileList = []
        }
      },
      immediate: true
      // deep: true
    }
  }
}
</script>

<style scoped>

</style>
