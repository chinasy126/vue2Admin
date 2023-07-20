<template>
  <div class="imageUpload">
    <!-- S 上传按钮 -->
    <el-upload
      v-bind="[$attrs,$props]"
      :action="uploadImageApi"
      :disabled="uploadImgIsUploading"
      class="avatar-uploader"
      :show-file-list="false"
      :http-request="httpRequest"
    >
      <el-button size="mini" type="primary">{{buttonName}}</el-button>
      <!--        <div cis-successlass="div-plus"><i class="el-icon-plus avatar-uploader-icon"> </i></div>-->
    </el-upload>
    <!-- E 上传按钮 -->

    <!-- S 文件列表显示区域 -->
    <div v-if="uploadDisplayType === 'file'">
      <el-progress v-if="uploadImgIsUploading" type="circle" :percentage="uploadImgPercentage"></el-progress>
      <ul class="el-upload-list el-upload-list--text" v-if="uploadImgUrl" v-for="(item,index) in uploadImgUrl"
          :key="index"
      >
        <li class="el-upload-list__item is-success">
          <a class="el-upload-list__item-name" @click="showImgDialog(item)">
            <i class="el-icon-document"></i>
            {{ item.url }}
          </a>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-circle-check"></i>
          </label>
          <i class="el-icon-close" @click="deleteImg(item)"></i>
          <i class="el-icon-close-tip"></i></li>
      </ul>
    </div>
    <!-- E 文件列表显示区域 -->

    <!-- S 图片列表显示区域 -->
    <div v-if="uploadDisplayType === 'picture'">
      <ul class="el-upload-list el-upload-list--picture-card" v-if="uploadImgUrl">
        <li class="el-upload-list__item is-ready" v-for="(item,index) in uploadImgUrl" :key="index">
          <div>
            <el-image
              :src="item.url" name="uploadImgUrl" @error="imgLoadError"
              class="el-upload-list__item-thumbnail"
            ></el-image>
            <span class="el-upload-list__item-actions">
              <!-- 放大 -->
                <span class="el-upload-list__item-preview" @click="showImgDialog(item)">
                  <i class="el-icon-zoom-in"></i>
                </span>
              <!-- 删除 -->
                <span class="el-upload-list__item-delete" @click="deleteImg(item)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
          </div>
        </li>
      </ul>
      <el-progress style="margin: 5px;" v-else-if="uploadImgIsUploading" type="circle"
                   :percentage="uploadImgPercentage"
      ></el-progress>
    </div>
    <!-- E 图片列表显示区域 -->

    <!-- S 放大图片显示区域 -->
    <el-dialog title="查看图片" :visible.sync="uploadDialog.visible" :modal="false">
      <el-image width="100%" :src="dialogImg"
      ></el-image>
    </el-dialog>
    <!-- E 放大图片显示区域 -->
  </div>
</template>
<script>
import { uploadImg } from '@/api/uploadFile'

export default {
  name: 'ImageUpload',
  data() {
    return {
      dialogImg: '',
      // 是否打开图片弹框
      uploadDialog: {
        visible: false
      },
      uploadImageApi: this.uploadImageApi, // 上传文件家口地址
      uploadImgUrl: [], // 上传后的图片地址
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
    buttonName: {
      type: String,
      default: '上传图片'
    },
    uploadFolderName: {
      type: String,
      default: 'images'
    },
    // 允许上传个数
    uploadLimit: {
      type: Number,
      default: () => {
        return 1 // -1 无限制
      }
    },
    uploadImgList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 上传之后显示的类型
    uploadDisplayType: {
      type: String,
      default: () => {
        return 'file' // picture
      }
    },
    // 文件大小
    limitSize: {
      type: Number,
      default: () => {
        return 4
      }
    },
    // 可以在使用组件的时候传入一个支持上传的图片格式的数组进来，不传默认default数组
    supportType: {
      default: () => ['image/jpeg', 'image/jpg', 'image/png'],
      type: Array
    }

  },
  methods: {
    /**
     *  删除图片
     */
    deleteImg(item) {
      this.uploadImgUrl = this.uploadImgUrl.filter(i => {
        return i.url !== item.url
      })
      this.$emit('uploadSuccess', this.uploadImgUrl, 'delete')
    },
    /**
     *  打开图片对话框
     */
    showImgDialog(item) {
      this.dialogImg = item.url
      this.uploadDialog.visible = true
    },

    /**
     * 上传文件方法
     * @param param
     */
    httpRequest(param) {
      let _this = this
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
      form.append('type', this.uploadFolderName) // 文件类型拆分文件夹
      let callback = (progress) => {
        this.uploadImgIsUploading = true
        this.uploadImgPercentage = parseInt(progress.loaded / progress.total * 100)
      }

      uploadImg(form, {
        // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
        headers: {
          // 表示上传的是文件,而不是普通的表单数据
          'Content-Type': 'multipart/form-data',
          'X-Token': window.localStorage.getItem('token')
        }
        // ,onUploadProgress: progressEvent => {
        //   // callback(progressEvent)
        //   this.uploadImgIsUploading = true
        //   this.uploadImgPercentage = parseInt(progressEvent.loaded / progressEvent.total * 100)
        // }
      }, progress => {
        callback(progress)
      }).then(res => {
        this.uploadImgIsUploading = false
        this.uploadImgPercentage = 0
        if (res.data.file) {
          // 显示图片上传
          if (this.uploadLimit > 1) {
            _this.uploadImgUrl.push({ 'url': res.data.file })
          } else {
            _this.uploadImgUrl = [{ 'url': res.data.file }]
          }
          this.$emit('uploadSuccess', _this.uploadImgUrl, 'upload')
        } else {
          this.$message.error('上传文件错误')
          // this.$Message('error', res.message)
        }
      })
    },
    /**
     * 当图片显示失败的时候，我会重复10次赋值图片，成功显示就退出，还是失败就会显示失败
     * @param error
     */
    imgLoadError(error) {
      let isExist = false
    }

  },
  watch: {
    /**
     * 父组件传递的参数
     */
    uploadImgList: {
      handler(value) {
        this.uploadImgUrl = value
      },
      immediate: true
    }
  }
}
</script>
<style scoped>
.div-plus {
  width: 174px;
  height: 174px;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-upload {


}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.imageUpload{
  margin: 0px 20px 0px 20px !important;
}

</style>
