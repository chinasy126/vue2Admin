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
        <el-button @click="opearDialog('add','')" v-permission="['add']"> 新增</el-button>

        <el-upload :action="importExcelUrl" :on-success="onSuccess" :show-file-list="false"
                   v-permission="['import']"
                   :headers="headers"
        >
          <el-button size="small" type="primary" style="margin-left: 10px; margin-right: 10px;">导入</el-button>
        </el-upload>

        <el-button type="danger" @click="exportData()"
                   v-permission="['export']"
                   icon="el-icon-s-order"
        > 导出
        </el-button>

        <el-button type="danger" @click="batchDeletion()"
                   v-permission="['batchDeletion']"
                   icon="el-icon-s-order"
        > 批量删除
        </el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索栏目 -->

    <!-- S 表格 -->
    <el-table-custom
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
        <el-button @click="opearDialog('edit',scope.scope)" v-permission="['edit']"> 编辑</el-button>
        <el-button @click="deleteData(scope.scope)" type="danger" v-permission="['delete']"> 删除</el-button>
      </template>
    </el-table-custom>
    <!-- E 表格 -->

    <!-- S 弹框删除操作 -->
    <common-action
      :visible="commonActionVisible"
      title="编辑"
      :message="message"
      :condition="conditionData"
      :apiUrl="apiUrl"
      @refresh="refreshList"
    >
    </common-action>
    <!-- E 弹框删除操作 -->

    <FormData
      :dialogVisible="formDialogVisible"
      :form="opeartionForm"
      :rules="rules"
      :otherFormData="operationFormData"
      :operation-fn-name="operationFnName"
      @closeForm="closeForm"
    >

      <template v-slot:3>
        <el-form-item label="相关图片">
          <upload-img :img="operationFormData.pic" @uploadSuccess="uploadSuccess"></upload-img>
        </el-form-item>
      </template>


    </FormData>

  </div>
</template>

<script>

import {
  dataListByPage,
  newsInsert,
  newsDelete,
  getDetail,
  newsModify,
  exportExcelData,
  importExcelData
} from '@/api/news'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import CommonAction from '@/components/ActionDialog/CommonAction'
import { downloadFile, parseTime } from '@/utils'
import UploadImg from '@/components/UploadFile/uploadImg'
import FormData from '@/components/DataOperationPannel/OpFormPannel'
import queryListMixin from '@/mixins/queryListMixin'

const opeartionForm = [
  { label: '标题', prop: 'title', type: 'input' },
  { label: '副标题', prop: 'fTitle', type: 'input' },
  { label: '日期', prop: 'update', type: 'date', value: parseTime(new Date(), '{y}-{m}-{d}') },
  { label: '推荐值', prop: 'top', type: 'number' },
  { label: '访问量', prop: 'num', type: 'number' }
]

export default {
  components: { FormData, UploadImg, CommonAction, SearchPanel },
  mixins: [queryListMixin],
  filters: {},
  data() {
    return {
      operationFormData: {},
      formDialogVisible: false,
      importExcelUrl: `${process.env.VUE_APP_BASE_API}/news/import`,
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        update: [
          { required: true, message: '请输入日期', trigger: 'blur' }
        ]
      },

      opeartionForm: opeartionForm,
      message: '是否确认删除本条内容?',
      conditionData: {}, // 删除弹框操作
      apiUrl: newsDelete,
      operationFnName: () => {
      },
      commonActionVisible: false,
      getListFnName: dataListByPage, // 主页面查询
      searchPannelList: [
        { type: 'input', name: '标题', prop: 'title' },
        { type: 'date', name: '时间', prop: 'update' }
      ],
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '标题', prop: 'title', isSlot: true },
        { label: '图片', prop: 'pic' },
        { label: '推荐', prop: 'top' },
        { label: '时间', prop: 'update' },
        { label: '副标题', prop: 'fTitle' },
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
      ]
    }
  },
  created() {

  },
  methods: {
    /**
     *  表格导入
     */
    importData() {
      importExcelData().then(res => {

      })
    },
    /**
     *  导出数据
     */
    exportData() {
      const param = this.$refs.searchPannelRef.searchForm
      exportExcelData(param).then(({ data }) => {
        downloadFile(data, '新闻')
      })
    },
    closeForm() {
      this.formDialogVisible = false
      this.getItemList()
    },
    uploadSuccess(params) {
      this.$set(this.operationFormData, 'pic', params)
      console.log(params)
    },
    /**
     *  打开对话框
     */
    opearDialog(opera, param) {
      this.opeartionForm = JSON.parse(JSON.stringify(opeartionForm))
      if (opera === 'add') {
        this.operationFnName = newsInsert
        this.formDialogVisible = true
      } else if (opera === 'edit') {
        this.operationFormData.pic = param.pic
        this.operationFnName = newsModify
        const opForm = this.opeartionForm
        opForm.push({ prop: 'id', value: param.id })
        this.opeartionForm = opForm.map(item => {
          item.value = param[item.prop]
          return item
        })

        this.formDialogVisible = true
      }

    },

    /**
     *  操作后刷新列表
     */
    refreshList() {
      this.commonActionVisible = false
      this.getItemList()
    },

    /**
     * 删除数据
     * @param param
     */
    deleteData(param) {
      this.conditionData = param.id
      this.commonActionVisible = true
    },

    /**
     *  上传从成功
     */
    onSuccess(response, file, fileList) {
      if (response.code === 20000) {
        this.getItemList()
      }
    },

    /**
     *  批量删除
     */
    batchDeletion() {
      console.log(this.selectItemList)
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
