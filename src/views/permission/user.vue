<template>
  <div class="app-container">
    <!-- S 搜索栏目 -->
    <SearchPanel
      :searchBtnLoading="searchBtnLoading"
      :item-list="searchPannelList"
      @onSearch="handleEventSearch"

    >
      <template slot="operationButton">
        <el-button @click="opearDialog('add','')"> 新增</el-button>
        <el-button @click="batchDelete" type="danger"> 批量删除</el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索栏目 -->

    <!-- S 表格 -->
    <el-table-custom
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
      <template slot="operation" slot-scope="{ scope }">
        <el-button @click="opearDialog('edit',scope)"> 编辑</el-button>
        <el-button @click="deleteData(scope)" type="danger"> 删除</el-button>
      </template>
    </el-table-custom>
    <!-- E 表格 -->

    <OpFormPannel
      :op-form-dialog="opFormDialog"
      :opFormItems="opFormItems"
      :opFormRules="opFormRules"
      @opCloseForm="closeForm"

      :opFormBtnLoading="opFormBtnLoading"
      @onFormSubmit="onOpFormSubmit"
    >
    </OpFormPannel>

    <!-- S 弹框删除操作 -->
    <common-action
      :comActionDialog="comActionDialog"
      :comActionCondition="comActionCondition"
      :comFnName="comFnName"
      @refresh="refreshList"
    >
    </common-action>
    <!-- E 弹框删除操作 -->

  </div>
</template>

<script>

import { dataListByPage, dataInsert, dataModify, dataDelete, batchDelete } from '@/api/permission/user'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import queryListmixin from '@/mixins/queryListMixin'
import CommonAction from '@/components/ActionDialog/CommonAction'
import { parseTime } from '@/utils'
import UploadImg from '@/components/UploadFile/uploadImg'
import OpFormPannel from '@/components/DataOperationPannel/OpFormPannel'
import _ from 'lodash'
import { roleList } from '@/api/permission/role'
import opFormMixins from '@/mixins/opFormMixin'
import comActionMixin from '@/mixins/comActionMixin'

import ccc from './ccc'

export default {
  name: 'user',
  components: { OpFormPannel, CommonAction, SearchPanel, ccc },
  mixins: [queryListmixin, opFormMixins, comActionMixin],
  filters: {},
  data() {
    return {
      opFormMdifyData: {},// 修改数据
      opRoleList: [], // 角色列表
      // 表单验证
      opFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      },
      opFormItems: [],
      getListFnName: dataListByPage, // 主页面查询
      searchPannelList: [
        { type: 'input', name: '用户名', prop: 'username' },
        { type: 'date', name: '创建时间', prop: 'createTime' }
      ],
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '用户名', prop: 'username' },
        { label: '出生年月', prop: 'birthday' },
        { label: '用户角色', prop: 'roleName' },
        { label: '添加时间', prop: 'createTime' },
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
      ]
    }
  },
  created() {
    this.onInit()
  },
  methods: {
    async onInit() {
      await this.getRoleList()
      this.opFormItems = [
        { label: '所属角色', prop: 'roleId', type: 'select', selectValue: this.opRoleList },
        { label: '用户名', prop: 'username', type: 'input' },
        { label: '用户密码', prop: 'password', type: 'input', showValue: false },
        { label: '出生年月', prop: 'birthday', type: 'date', value: parseTime(new Date(), '{y}-{m}-{d}') }
      ]
    },
    /**
     *  下拉框角色列表，弹框中使用
     */
    async getRoleList() {
      const reslut = await roleList()
      this.opRoleList = reslut.data.data.map(res => {
        return {
          id: res.id,
          label: res.roleName,
          value: res.id
        }
      })
    },

    /**
     *  关闭对话框
     */
    closeForm() {
      this.opFormDialog.visible = false
      this.getItemList()
    },

    mergeOperationForm(params) {
      Object.assign(params, this.opFormMdifyData)
    },
    /**
     *  打开对话框
     */
    opearDialog(opera, param) {
      this.opFormDialog.visible = true
      const opFormItems = JSON.parse(JSON.stringify(this.opFormItems))
      if (opera === 'add') {
        this.opFormItems = opFormItems.map(item => {
          item.value = ''
          return item
        })
        this.opFormDialog.title = '新增'
        this.opFormDialog.buttonTitle = '新增'
        this.opFnName = dataInsert
      } else if (opera === 'edit') {

        this.opFormItems = opFormItems.map(item => {
          item.value = param[item.prop]
          return item
        })
        this.opFormMdifyData.id = param.id
        this.opFnName = dataModify
        this.opFormDialog.title = '修改'
        this.opFormDialog.buttonTitle = '修改'
      }
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
      this.comActionCondition = { id: param.id }
      this.comActionDialog.visible = true
    },

    /**
     * 批量删除
     */
    batchDelete() {
      this.comFnName = batchDelete
      this.comActionCondition = this.selectItemList.map(item => {
        return item.id
      })
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
