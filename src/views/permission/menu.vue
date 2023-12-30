<template>
  <div class="app-container">
    <!-- S 搜索栏目 -->
    <SearchPanel
      :searchBtnLoading="searchBtnLoading"
      :item-list="searchPannelList"
      @onSearch="handleEventSearch"
    >
      <template slot="operationButton">
        <el-button @click="opDialog('add','')" v-permission="['addMenu']"> 新增菜单</el-button>
        <el-button @click="opDialogAddBtn()" v-permission="['addButton']"> 新增按钮</el-button>
        <el-button @click="handlerBatchDeletion" type="danger" v-permission="['batchDelete']">批量删除</el-button>

        <el-tooltip class="item" effect="dark" content="批量同步路由中的菜单" placement="top">
          <el-button @click="batchSync" type="warning" v-permission="['batchSync']">批量同步</el-button>
        </el-tooltip>

      </template>
    </SearchPanel>
    <!-- E 搜索栏目 -->

    <!-- S 表格 -->
    <TablePannel
      v-if="tableVisible"
      :drag-abled="true"
      class="my-navigation"
      :rowKey="(record) => record.id"
      :columns="columns"
      :data-source="dataSource"
      @selectionChange="handleSelectionChange"
      @changeSize="changeSize"
      @changeNum="changeNum"
      :row-key="(record)=> record.id "
      :total="totalCount"
      :page-num="pageNum"
      :page-size="pageSize"
      :table-loading="searchBtnLoading"
      @moveIndex="moveSortFn"
    >
      <template slot="title" slot-scope="scope">
        <span style="color: #20a0ff">{{ scope.scope.title }}</span>
      </template>

      <template slot="menubuttonList" slot-scope="{scope:{menubuttonList}}">
        <template v-for="(item,index) in menubuttonList">
          <menuButton :key="index" :btnType="item.type" :btnId="item.id" :name="item.name" @close="deleteBtnFn"
          ></menuButton>
        </template>

      </template>

      <template slot="operation" slot-scope="{ scope }">
        <el-button @click="opDialog('edit',scope)"> 编辑</el-button>
        <el-button @click="deleteData(scope)" type="danger"> 删除</el-button>
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
    <!-- S 新增或者修改表单 -->
    <OpFormPannel
      :op-form-dialog="opFormDialog"
      :opFormItems="opFormItems"
      :opFormRules="opFormRules"
      :opFormBtnLoading="opFormBtnLoading"
      @onChangeSelect="onChangeMenuSelect"
      @opCloseForm="opCloseForm"
      @onFormSubmit="onOpFormSubmit"
    >
      <template slot="-1">
        <!-- S 操作按钮  -->
        <!-- E 操作按钮  -->
      </template>
      <!-- 显示按钮 -->
    </OpFormPannel>
    <!-- E 新增或者修改表单 -->

  </div>
</template>
<script>
import Page from '@/components/Page/index'
import {
  indertBtn,
  batchInsert,
  category,
  dataBatchDelete,
  dataDelete,
  deleteBtn, getSecMenuList,
  menuList,
  saveOrUpdate
} from '@/api/permission/menu'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import queryListmixin from '@/mixins/queryListMixin'
import CommonAction from '@/components/ActionDialog/CommonAction'

import { asyncRoutes } from '@/router'
import opFormMixin from '@/mixins/opFormMixin'
import { getArrJsonDif, parseTime } from '@/utils'
import comActionMixin from '@/mixins/comActionMixin'
import OpFormPannel from '@/components/DataOperationPannel/OpFormPannel'

import Sortable from 'sortablejs'
import menuButton from '@/views/permission/menu/menuButton'

export default {
  name: 'SystemMenu',
  components: { Page, OpFormPannel, CommonAction, SearchPanel, menuButton },
  mixins: [queryListmixin, opFormMixin, comActionMixin],
  filters: {},
  data() {
    return {
      opFormRules: {},
      tableVisible: true,
      // 下拉菜单
      menuItemList: { 'parents': [], 'children': [] },
      searchPannelList: [{ type: 'input', name: '菜单名称', prop: 'title' }],
      getListFnName: menuList,
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '菜单名称', prop: 'title' },
        { label: '菜单name', prop: 'name' },
        { label: '按钮', prop: 'menubuttonList', isSlot: true },
        { label: '菜单排序', prop: 'menuOrder' },
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center', width: 150 }
      ]
    }
  },
  beforeCreate() {

  },
  created() {

  },
  methods: {
    /**
     *  合并数据
     */
    async mergeOperationForm(params) {
      const list = await this.getAllCategory()
      const parentMenuStr = list.filter(item => item.id === params.parentMenu).map(item => `${item.title},${item.name}`).join('')
      params.parentMenu = params.parentMenu != '' ? parentMenuStr : ''

    },

    /**
     *  批量同步菜单
     */
    batchSync() {
      let filterAsyncRoutes = asyncRoutes.filter(item => {
        return item.path !== '*'
      })
      // 是否有重复项目有重复项则提示终止操作
      let routerNameArr = []

      function getNameList() {
        filterAsyncRoutes.forEach(item => {
          routerNameArr.push(item.name)
          if (item.children.length !== 0) {
            item.children.forEach(i => {
              routerNameArr.push(i.name)
            })
          }
        })
      }

      getNameList()

      function findDuplicates(arr) {
        return arr.filter((item, index) => arr.indexOf(item) !== index)
      }

      const duplicates = findDuplicates(routerNameArr)
      if (duplicates.length !== 0) {
        return this.$message.error(`抱歉！路由存在name:${duplicates.toString()}`)
      }

      const routeLink = filterAsyncRoutes.map(item => {
        // 一级菜单
        let linker = {
          'title': item.meta.title,
          'name': item.name,
          'meta': item.meta,
          'children': this.batchSyncChild(item.children)
        }
        // 二级菜单\
        return linker
      })
      batchInsert(routeLink).then(res => {
        this.$message.success(`更新成功`)
        this.getItemList()
      })
    },

    /**
     * 批量调整二级菜单结构
     */
    batchSyncChild(data = []) {
      let childLink = []
      if (data.length !== 0) {
        childLink = data.map(item => {
          return {
            'title': item.meta.title,
            'name': item.name,
            'meta': item.meta,
            'button': item.meta.btnPermissions || []
          }
        })
      }
      return childLink
    },

    /**
     *  获取所有分类
     */
    async getAllCategory() {
      const { data: { data: dbMenuList } } = await category()
      return dbMenuList
    },
    /**
     *
     * 下拉框可以使用的内容
     *
     */
    async getSelectValue() {
      const list = await this.getAllCategory()
      const selectValue = list.map(item => {
        return {
          value: item.id,
          label: item.title
        }
      })
      return selectValue
    },

    /**
     *  打开对话框 (包含新增修改)
     */
    async opDialog(opera, param) {
      const selectValue = await this.getSelectValue()
      this.opFormItems = [
        { label: '', prop: 'id'},
        { label: '父级菜单', prop: 'parentMenu', type: 'select', selectValue: selectValue },
        { label: '菜单名称', prop: 'title', type: 'input' },
        { label: '菜单Name', prop: 'name', type: 'input' },
        { label: '菜单排序', prop: 'menuOrder', type: 'number', value: 0 }
      ]


      typeof (param.id) !== 'undefined' ? this.opFormItems.push({ prop: 'id', value: param.id }) : ''
      console.log(this.opFormItems)

      this.opFormRules = {}
      this.opFormRules = {
        title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入菜单name', trigger: 'blur' }]
      }

      this.opFormDialog = { title: '新增菜单', visible: true, buttonTitle: '新增菜单' }
      let _param = JSON.parse(JSON.stringify(param))
      this.opFormDialog.visible = true

      this.opFnName = saveOrUpdate

      if (opera === 'add') {
        this.opFormDialog.buttonTitle = '添加'
      } else if (opera === 'edit') {

        param['parentMenu'] = param['fid']
        this.opFormItems = this.opFormItems.map(res => {
          res.value = param[res.prop]
          return res
        })

        this.opFormDialog.buttonTitle = '修改'

      }
    },

    /**
     *  显示添加按钮
     */
    async opDialogAddBtn() {

      this.opFormRules = {}
      this.opFormRules = {
        firMenuId: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
        name: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入按钮类别', trigger: 'blur' }]
      }

      const selectValue = await this.getSelectValue()
      this.opFormItems = [
        { label: '父级菜单', prop: 'firMenuId', type: 'select', selectValue: selectValue, value: '' },
        { label: '二级菜单', prop: 'menuId', type: 'select', selectValue: [], value: '' },
        { label: '按钮名称', prop: 'name', type: 'input', value: '' },
        { label: '按钮类别', prop: 'type', type: 'input', value: '' }
      ]
      this.opFormDialog = { title: '新增按钮', visible: true, buttonTitle: '新增按钮' }
      this.opFnName = indertBtn
    },

    /**
     *  通过一级菜单id获取二级菜单
     */

    /**
     *  删除按钮
     */
    deleteBtnFn(params) {
      this.comActionDialog = {
        visible: true,
        title: '按钮删除',
        message: '是否确认删除改按钮?',
        buttonTitle: '删除'
      }
      this.comActionCondition = { id: params }
      this.comFnName = deleteBtn
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
     *   批量删除
     */
    handlerBatchDeletion() {
      if (this.selectItemList.length === 0) {
        this.$message.error('请选择要删除的数据!')
        return true
      }
      this.comActionDialog = {
        title: '批量删除',
        visible: true,
        buttonTitle: '批量删除',
        message: '是否确认批量删除这些内容?'
      }
      this.comActionCondition = {}
      this.comActionCondition.ids = this.selectItemList.map(i => i.id)
      this.comFnName = dataBatchDelete
      console.log(this.comActionCondition.ids)
    },

    /**
     *  table 移动
     */
    moveSortFn(param) {
      this.tableVisible = false
      let { newIndex, oldIndex } = param

      let _this = this
      /**
       * 展开数组
       * @returns {*[]}
       */
      let tableData = function() {
        let tData = []
        _this.dataSource.map((item) => {
          tData.push(...expandArray(item))
        })

        function expandArray(param) {
          let subArray = []
          subArray.push(param)
          if (param.children.length !== 0) {
            param.children.map((item) => {
              subArray.push(item)
            })
          }
          return subArray
        }

        return tData
      }

      // 自下而上 oldIndex 原有数据   newIndex 新排位置的数据
      let postData = tableData()[oldIndex]
      if (tableData()[oldIndex]['fid'] !== tableData()[newIndex]['fid']) {
        postData['fid'] = tableData()[newIndex]['fid']
      }

      if (oldIndex > newIndex) {
        // 先查看 fid  如果原有fid是0 目标fid0 则修改menuOrder ，  原有fid不是 0   目标是0  则修改fid menuOrder ,  原有fid 与目标 fid 不一样
        postData['menuOrder'] = tableData()[newIndex]['menuOrder'] + 1
      } else if (oldIndex < newIndex) { // 自上而下
        if (tableData()[newIndex]['menuOrder'] > 0) {
          postData['menuOrder'] = tableData()[newIndex]['menuOrder'] - 1
        } else {
          postData['menuOrder'] = 0
        }
      }
      saveOrUpdate(postData).finally(() => {
        this.getItemList()
        // _this.$router.go(0)
        // _this.reload()
      }).finally(() => {
        this.tableVisible = true
        // location.reload()
      })
    },

    /**
     *
     * 通过一级菜单下拉框
     * 二级菜单获取内容
     *`
     */
    async onChangeMenuSelect(value, type, opForm) {
      if (type.prop === 'firMenuId') {
        this.opFormItems[1].selectValue = []
        this.opFormItems[1].value = ''
        opForm.menuId = ''

        if (value === '' || value === 0) {
          this.opFormItems.forEach((item, index) => {
            this.opFormItems[index].value = ''
          })
          return
        }

        const { data: { data } } = await getSecMenuList({ 'id': value })
        const menuList = data.map((item) => {
          return {
            value: item.id,
            label: item.title
          }
        })
        this.opFormItems[1].selectValue = menuList
        this.opFormItems.forEach((item, index) => {
          this.opFormItems[index].value = opForm[item.prop]
        })

      }
    }

  },
  watch: {
    // 'opFormModelLocal.parentMenu': {
    // },
    asyncMenuList: {
      handler(val) {
      }
    }
  },
  computed: {
    /**
     * 获取菜单下拉列表
     */
    asyncMenuList() {
      let router = asyncRoutes.filter(res => {
        return res.path !== '*'
      })
      this.menuItemList.parents = router
      this.menuItemList.children = router
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
