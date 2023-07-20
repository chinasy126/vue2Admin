<template>
  <div class="app-container">
    <!-- S 搜索栏目 -->
    <SearchPanel
      :searchBtnLoading="searchBtnLoading"
      :item-list="searchPannelList"
      @onSearch="handleEventSearch"
    >
      <template slot="operationButton">
        <el-button @click="opDialog('add','')" v-permission="['add']"> 新增</el-button>
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
      <template slot="classname" slot-scope="{scope}">
        <span style="color: #20a0ff">{{ transformClassPower(scope.classpower) }}{{ scope.classname }}</span>
      </template>
      <template slot="operation" slot-scope="scope">
        <el-button @click="opDialog('edit',scope.scope)"> 编辑</el-button>
        <el-button @click="deleteData(scope.scope)" type="danger"> 删除</el-button>
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

    <!-- S 新增修改对话框 -->
    <FormData
      :opFormDialog="opFormDialog"
      :opFormItems="opFormItems"
      :opFormRules="opFormRules"
      :opFormBtnLoading="opFormBtnLoading"
      @opCloseForm="opCloseForm"
      @onFormSubmit="onOpFormSubmit"
    >
      <template v-slot:-1>
        <el-form-item label="相关图片">
          <ImageUpload ref="fileUpload"
                       upload-folder-name="productclass"
                       :uploadImgList="uploadImgList"
                       @uploadSuccess="uploadSuccess"
          />
        </el-form-item>
      </template>
    </FormData>
    <!-- E 新增修改对话框 -->

  </div>
</template>

<script>
import Page from '@/components/Page/index'
import { dataListByPage, dataInsert, dataDelete, category, dataModify } from '@/api/product/productClass'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import queryListmixin from '@/mixins/queryListMixin'
import CommonAction from '@/components/ActionDialog/CommonAction'
import { parseTime, transformClassPower } from '@/utils'

import FormData from '@/components/DataOperationPannel/OpFormPannel'
import _ from 'lodash'
import comActionMixin from '@/mixins/comActionMixin'
import opFormMixin from '@/mixins/opFormMixin'
import ImageUpload from '@/components/UploadFile/ImageUpload'

export default {
  name: 'ProdutClass',
  components: { Page, ImageUpload, FormData, CommonAction, SearchPanel },
  mixins: [queryListmixin, comActionMixin, opFormMixin],
  filters: {},
  data() {

    return {
      transformClassPower: transformClassPower,
      uploadImgList: [], // 显示图片列表
      opFormModelLocal: { 'classpic': '' },
      categoryList: [],
      opFormRules: {
        classname: [
          { required: true, trigger: 'blur', message: '产品名称必填' }
        ]
      },
      opFormItems: [
        { prop: 'classid', value: '' },
        { label: '所属分类', prop: 'rootid', type: 'select', selectValue: [] },
        { label: '分类名称', prop: 'classname', type: 'input' },
        { label: '分类内容', prop: 'classcontents', type: 'textarea' }
      ],

      getListFnName: dataListByPage, // 主页面查询
      searchPannelList: [
        { type: 'input', name: '分类名称', prop: 'classname' },
        { type: 'input', name: '分类内容', prop: 'classcontents' }
      ],
      columns: [
        { label: 'ID', prop: 'classid' },
        { label: '分类名称', prop: 'classname', isSlot: true },
        { label: '图片', prop: 'classpic' },
        { label: '内容', prop: 'classcontents' },
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
      ]
    }
  },
  created() {
    //  this.getCategoryList()
  },
  methods: {

    async getCategoryList(disableValue) {
      const result = await category()
      this.categoryList = result.data.data.map(item => {
        let obj = {}
        obj.value = item.classid
        obj.label = transformClassPower(item.classpower) + item.classname
        obj.disabled = item.classpower.indexOf(disableValue.classpower) === 0 ? true : false
        return obj
      })
    },
    /**
     *  合并数据项目
     */
    mergeOperationForm(params) {
      Object.assign(params, this.opFormModelLocal)
    },
    opCloseForm() {
      this.opFormDialog.visible = false
      this.getItemList()
    },

    uploadSuccess(params, type) {
      if (type === 'upload') {
        this.$message.success(`图片上传成功!`)
      }
      this.opFormModelLocal.classpic = params.length > 0 ? params[0].url : ''
    },
    /**
     *  打开对话框
     */
    async opDialog(opera, param) {
      await this.getCategoryList(param)
      this.opFormItems[1].selectValue = this.categoryList
      this.uploadImgList = []
      this.opFormItems = this.opFormItems.map(item => {
        item.value = typeof (param[item.prop]) !== 'undefined' ?
          param[item.prop] : ''
        return item
      })

      if (opera === 'add') {
        this.opFormDialog.title = '新增'
        this.opFormDialog.buttonTitle = '新增'
        this.opFnName = dataInsert
      } else if (opera === 'edit') {
        this.opFormDialog.title = '修改'
        this.opFormDialog.buttonTitle = '修改'
        this.opFnName = dataModify
        // 图片
        this.opFormModelLocal.pic = param.pic
        if (param.classpic !== '' && typeof (param.classpic) !== 'object') {
          this.uploadImgList = [{ 'url': param.classpic }]
        }
      }

      this.opFormDialog.visible = true
    },

    /**
     *  操作后刷新列表
     */
    refreshList() {
      this.comActionDialog.visible = false
      this.getItemList()
    },

    /**
     * 删除数据
     * @param param
     */
    deleteData(param) {
      this.comFnName = dataDelete
      this.comActionCondition = { 'classid': param.classid }
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
