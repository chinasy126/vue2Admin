<template>
  <div class="app-container">
    <!-- S 搜索栏目 -->
    <SearchPanel
      :searchBtnLoading="searchBtnLoading"
      :item-list="searchPannelList"
      @onSearch="handleEventSearch"
    >
      <template slot="operationButton">
        <el-button @click="opearDialog('add','')" v-permission="['add']"> 新增</el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索栏目 -->

    <!-- S 表格 -->
    <TablePannel
      :rowKey="(record) => record.id"
      :columns="columns"
      :data-source="dataSource"
      @selection-change="handleSelectionChange"
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
        <el-button @click="comDelDialog(scope.scope)" type="danger" v-permission="['delete']"> 删除</el-button>
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
    <common-action
      :comActionDialog="comActionDialog"
      :comActionCondition="comActionCondition"
      :comFnName="comFnName"
      @refresh="refreshList"
    >
    </common-action>
    <!-- E 弹框删除操作 -->

    <!-- S 数据操作新增修改 -->
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
          <ImageUpload ref="fileUpload"
                       upload-folder-name="product"
                       :uploadImgList="uploadImgList"
                       @uploadSuccess="uploadSuccess"
          />

        </el-form-item>
        <el-form-item label="内容">
          <QuillEditor :value="opFormModelLocal.contents" @changeQuillEditor="changeQuillEditor"  ></QuillEditor>
        </el-form-item>
      </template>
    </OpFormPannel>
    <!-- E 数据操作新增修改 -->

  </div>
</template>

<script>

import { dataDelete, dataListByPage, saveOrUpdate , detail } from '@/api/product/product'
import { category } from '@/api/product/productClass'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import queryListmixin from '@/mixins/queryListMixin'
import CommonAction from '@/components/ActionDialog/CommonAction'
import ImageUpload from '@/components/UploadFile/ImageUpload'
import OpFormPannel from '@/components/DataOperationPannel/OpFormPannel'
import comActionMixin from '@/mixins/comActionMixin'
import opFormMixin from '@/mixins/opFormMixin'
import { parseTime, transformClassPower } from '@/utils'

import QuillEditor from '@/components/QuillEditor/index'
import Page from '@/components/Page/index'
export default {
  name: 'produtIndex',
  components: {Page, OpFormPannel, ImageUpload, CommonAction, SearchPanel,QuillEditor},
  mixins: [queryListmixin, comActionMixin, opFormMixin],
  filters: { },
  data() {
    return {
      // 插槽新增数据
      opFormModelLocal: { 'pic': '' ,'contents':''},
      // 图片上传组件 显示图片列表
      uploadImgList: [],
      categoryList: [],
      opFormRules: {
        pid: [
          { required: true, trigger: 'change', message: '请选择所属分类' }
        ],
        name: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ]
      },
      opFormItems: [
        { prop: 'id', value: '' },
        { label: '所属分类', prop: 'pid', type: 'select', selectValue: [] },
        { label: '产品名称', prop: 'name', type: 'input' },
        { label: '推荐值', prop: 'top', type: 'number' },
        { label: '日期', prop: 'update', type: 'date' },
        { label: '访问量', prop: 'num', type: 'number' }
      ],
      getListFnName: dataListByPage, // 主页面查询
      searchPannelList: [
        { type: 'input', name: '产品名称', prop: 'name' }
      ],
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '分类名称', prop: 'classname' },
        { label: '名称', prop: 'name' },
        { label: '图片', prop: 'pic' },
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
      ]
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {

    changeQuillEditor(val){
      this.opFormModelLocal.contents = val
    },

    /**
     *  合并数据项目
     */
    mergeOperationForm(params) {
      Object.assign(params, this.opFormModelLocal)
    },
    /**
     *  获取产品分类信息
     */
    async getCategoryList() {
      const result = await category()
      this.categoryList = result.data.data.map(item => {
        let obj = {}
        obj.value = item.classid
        obj.label = transformClassPower(item.classpower) + item.classname
        return obj
      })
      this.opFormItems[1].selectValue = this.categoryList
    },
    /**
     * 图片上传获取结果
     * @param params
     * @param type
     */
    uploadSuccess(params, type) {
      if (type === 'upload') {
        this.$message.success(`图片上传成功!`)
      }
      this.opFormModelLocal.pic = params.length > 0 ? params[0].url : ''
    },
    /**
     *  打开对话框
     */
    async opearDialog(opera, param) {
      this.opFnName = saveOrUpdate
      this.uploadImgList = []

      this.opFormItems = this.opFormItems.map(item => {
        item.value = typeof (param[item.prop]) !== 'undefined' || item.type === 'date' ?
          (opera === 'add' ? parseTime(new Date(), '{y}-{m}-{d}') : param[item.prop]) : ''
        return item
      })
      this.opFormModelLocal.contents = ''
      if (opera === 'add') {
        this.opFormDialog.title = '新增'
        this.opFormDialog.buttonTitle = '新增'
      } else if (opera === 'edit') {
        const result =  await detail({id:param.id})
        param = result.data.data
        this.opFormDialog.title = '修改'
        this.opFormDialog.buttonTitle = '修改'
        // 图片
        this.opFormModelLocal.contents = param.contents
        this.opFormModelLocal.pic = param.pic
        if (param.pic !== '' && typeof (param.pic) !== 'object') {
          this.uploadImgList = [{ 'url': param.pic }]
        }
      }
      this.opFormDialog.visible = true
    },

    /**
     * 弹出删除数据对话框
     * @param param
     */
    comDelDialog(param) {
      this.comFnName = dataDelete
      this.comActionCondition = { id: param.id }
      this.comActionDialog.visible = true
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
