<template>
  <div class="app-container">
    <!-- S 搜索栏目 -->
    <SearchPanel
      ref="searchPannelRef"
      :searchBtnLoading="searchBtnLoading"
      :item-list="searchPannelList"
      @onSearch="handleEventSearch"
    >
      <template slot="operationButton">
        <el-button @click="opDialog('add','')" v-permission="['add']"> 新增</el-button>
        <FileUpload :fileUploadFnName="fileUploadFnName" @onSuccess="getItemList" uploadBtnName="文件上传" v-permission="['import']"></FileUpload>
        <el-button type="danger" @click="exportData()" icon="el-icon-s-order" v-permission="['export']"> 导出</el-button>
        <el-button type="danger" @click="opBatchDelAialog()" icon="el-icon-s-order" v-permission="['batchDeletion']">
          批量删除
        </el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索栏目 -->

    <!-- S 表格 -->
    <TablePannel
      :rowKey="(record) => record.id"
      :columns="columns"
      :dataSource="dataSource"
      @selectionChange="handleSelectionChange"
      @changeSize="changeSize"
      @changeNum="changeNum"
      :row-key="(record)=> record.id "
      :total="totalCount"
      :page-num="pageNum"
      :page-size="pageSize"
      :table-loading="searchBtnLoading"
    >
      <template slot="title" slot-scope="scope">
        <span style="color: #20a0ff">{{ scope.scope.title }}</span>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button size="mini" @click="opDialog('edit',scope.scope)" v-permission="['edit']"> 编辑</el-button>
        <el-button size="mini" @click="opDelDialog(scope.scope)" type="danger" v-permission="['delete']"> 删除</el-button>
      </template>
    </TablePannel>
    <!-- E 表格 -->

    <!--  S 分页  -->
    <Page
      @changeSize="changeSize"
      @changeNum="changeNum"
      :total="totalCount"
      :pageNum="pageNum"
      :pageSize="pageSize"
    ></Page>
    <!--  E 分页  -->

    <!-- S 弹框删除操作 -->
    <commonAction
      :comActionDialog="comActionDialog"
      :comActionCondition="comActionCondition"
      :comFnName="comFnName"
      @refresh="refreshList"
    >
    </commonAction>
    <!-- E 弹框删除操作 -->

    <!-- S 新增修改 -->
    <OpFormPannel
      :opFormDialog="opFormDialog"
      :opFormItems="opFormItems"
      :opFormRules="opFormRules"
      :opFormBtnLoading="opFormBtnLoading"
      @opCloseForm="opCloseForm"
      @onFormSubmit="onOpFormSubmit"
    >
      <template v-slot:3>
        <el-form-item label="相关图片">
          <!-- 图片上传组件 -->
          <ImageUpload ref="fileUpload"
                       upload-folder-name="news"
                       :uploadImgList="uploadImgList"
                       @uploadSuccess="uploadSuccess"
          />
        </el-form-item>
        <el-form-item label="内容">
          <QuillEditor :value="opFormModelLocal.contents" @changeQuillEditor="changeQuillEditor"  ></QuillEditor>
        </el-form-item>
      </template>
    </OpFormPannel>
    <!-- E 新增修改 -->
  </div>
</template>

<script>
import QuillEditor from '@/components/QuillEditor/index'
import Page from '@/components/Page/index'
import { batchDelete, dataListByPage, exportExcelData, importExcelData, newsDelete, saveOrUpdate } from '@/api/news'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import queryListmixin from '@/mixins/queryListMixin'
import CommonAction from '@/components/ActionDialog/CommonAction'
import { downloadFile, parseTime } from '@/utils'

import opFormMixin from '@/mixins/opFormMixin'
import comActionMixin from '@/mixins/comActionMixin'

import ImageUpload from '@/components/UploadFile/ImageUpload'
import FileUpload from '@/components/UploadFile/FileUpload'
import OpFormPannel from '@/components/DataOperationPannel/OpFormPannel'
import pinyin from 'js-pinyin'
// console.log( pinyin.getFullChars(''));

export default {
  components: { Page, OpFormPannel, FileUpload, ImageUpload, CommonAction, SearchPanel , QuillEditor},
  mixins: [queryListmixin, opFormMixin, comActionMixin],
  filters: {},
  data() {
    /**
     * 验证函数
     * @param rule
     * @param value
     * @param callback
     */
    const titleFn = (rule, value, callback) => {
      if (value !== '') {
        callback()
      } else {
        callback(new Error('请输入标题'))
      }
    }

    return {
      // 搜索查询接口
      getListFnName: dataListByPage,
      // 搜索每一项
      searchPannelList: [
        { type: 'input', name: '标题', prop: 'title' },
        { type: 'date', name: '时间', prop: 'update' }
      ],
      // 表格列表每一项内容
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '标题', prop: 'title', isSlot: true },
        { label: '图片', prop: 'pic' },
        { label: '推荐', prop: 'top' },
        { label: '时间', prop: 'update' },
        { label: '副标题', prop: 'fTitle' },
        { label: '操作', width: 150, isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
      ],
      // 新增修改功能每一项
      opFormItems: [
        { prop: 'id', value: '' },
        { label: '标题', prop: 'title', type: 'input' },
        { label: '副标题', prop: 'fTitle', type: 'input' },
        { label: '日期', prop: 'update', type: 'date', value: parseTime(new Date(), '{y}-{m}-{d}') },
        { label: '推荐值', prop: 'top', type: 'number' },
        { label: '访问量', prop: 'num', type: 'number' }
      ],
      // 新增校验每一项
      opFormRules: {
        title: [
          { required: true, trigger: 'blur', validator: titleFn },
          { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        update: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ]
      },
      // 图片上传组件 显示图片列表
      uploadImgList: [],
      // 插槽新增数据
      opFormModelLocal: { 'pic': '' },
      // 文件导入组件方法
      fileUploadFnName: importExcelData
    }
  },
  created() {
  },
  methods: {
    /**
     *
     * 富文本编辑器
     *
     */
    changeQuillEditor(val){
      this.opFormModelLocal.contents = val
    },

    /**
     *  导出数据
     */
    exportData() {
      const params = {
        id: (() => {
          return this.selectItemList.map(i => i.id)
        })()
      }
      Object.assign(params, this.searchForm)
      exportExcelData(params).then(({ data }) => {
        downloadFile(data, '新闻')
      })

    },
    /**
     *  打开对话框
     */
    opDialog(opera, param) {
      this.opFnName = saveOrUpdate
      this.uploadImgList = []
      this.opFormItems = this.opFormItems.map(item => {
        item.value = typeof (param[item.prop]) !== 'undefined' || item.type === 'date' ?
          (opera === 'add' ? parseTime(new Date(), '{y}-{m}-{d}') : param[item.prop]) : ''
        return item
      })
      if (opera === 'add') {
        this.opFormModelLocal.pic = ''
        this.opFormDialog.title = '新增'
        this.opFormDialog.buttonTitle = '新增'
      } else if (opera === 'edit') {
        this.opFormDialog.title = '修改'
        this.opFormDialog.buttonTitle = '修改'
        // 图片
        this.opFormModelLocal.pic = param.pic
        if (param.pic !== '' && typeof (param.pic) !== 'object') {
          this.uploadImgList = [{ 'url': param.pic }]
        }
      }
      this.opFormDialog.visible = true
    },
    /**
     *  上传图片获取图片地址
     */
    uploadSuccess(params, type) {
      if (type === 'upload') {
        this.$message.success(`图片上传成功!`)
      }
      this.opFormModelLocal.pic = params.length > 0 ? params[0].url : ''
    },
    /**
     *  合并数据项目
     */
    mergeOperationForm(params) {
      Object.assign(params, this.opFormModelLocal)
    },
    /**
     *  删除对话框
     */
    opDelDialog(param) {
      this.comFnName = newsDelete
      this.comActionCondition = { id: param.id }
      this.comActionDialog.visible = true
    },
    /**
     *  批量删除
     */
    opBatchDelAialog() {
      if (this.selectItemList.length === 0) {
        this.$message.error('请选择要删除的数据')
        return true
      }
      this.comActionDialog = {
        title: '批量删除',
        visible: true,
        buttonTitle: '批量删除',
        message: '是否确认批量删除这些内容?'
      }
      const ids = this.selectItemList.map(i => i.id)
      this.comActionCondition = { id: ids }
      this.comFnName = batchDelete
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
  }

}
</script>

<style lang="less" scoped>

::v-deep .ql-editor {
  min-height: 150px;
}

.margin {
  margin-bottom: 20px;
}
</style>
