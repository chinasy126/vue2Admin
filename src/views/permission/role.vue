<template>
  <div class="app-container">
    <!-- S 搜索栏目 -->
    <SearchPanel
      :searchBtnLoading="searchBtnLoading"
      :item-list="searchPannelList"
      @onSearch="handleEventSearch"
    >
      <template slot="operationButton">
        <el-button @click="opearDialog('add','')" v-permission="['add']" > 新增</el-button>
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
      <template slot="roleMenus" slot-scope="{scope}">
        <role-permission :permission="scope.roleMenus"></role-permission>

      </template>

      <template slot="operation" slot-scope="{scope}">
        <el-button @click="opearDialog('edit',scope)" v-permission="['edit']" > 编辑</el-button>
        <el-button @click="deleteData(scope)" type="danger" v-permission="['delete']" > 删除</el-button>
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

    <!-- S 新增修改 -->
    <el-dialog
      title="角色管理"
      :visible.sync="formDialogVisible"
      width="70%"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :data="menuDataList"
            show-checkbox
            :default-checked-keys="defaultCheckedKeys"
            node-key="id"
            :render-after-expand="false"
            :props="defaultProps"
            @check-change="handleCheckChange"
          >
          </el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="cancelOpFormDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- E 新增修改 -->

  </div>
</template>

<script>
import Page from '@/components/Page/index'
import { allMultilevelClassification } from '@/api/permission/menu'
import { dataDelete, dataListByPage, insertRole, modifyRole } from '@/api/permission/role'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import queryListmixin from '@/mixins/queryListMixin'
import CommonAction from '@/components/ActionDialog/CommonAction'
import FormData from '@/components/DataOperationPannel/OpFormPannel'

import RolePermission from '@/views/permission/role/rolePermission'
import opFormMixins from '@/mixins/opFormMixin'
import comActionMixin from '@/mixins/comActionMixin'

export default {
  name: 'role',
  components: { Page,RolePermission, FormData, CommonAction, SearchPanel },
  mixins: [queryListmixin, opFormMixins, comActionMixin],
  filters: {},
  data() {

    return {
      // 展开
      defaultExpandedKeys: [],
      selectMenus: [],
      allMenus: [],
      defaultCheckedKeys: [],
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请选输入角色名称', trigger: 'change' }
        ],
        roleDesc: [
          { required: true, message: '请选输入角色描述', trigger: 'change' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      menuDataList: [], // 树级显示的数据
      formDialogVisible: false,
      getListFnName: dataListByPage, // 主页面查询
      searchPannelList: [
        { type: 'input', name: '角色名称', prop: 'roleName' }
      ],
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '角色名称', prop: 'roleName' },
        { label: '角色说明', prop: 'roleDesc' },
        { label: '角色权限', prop: 'roleMenus', isSlot: true },
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
      ]
    }
  },
  created() {

  },
  methods: {
    cancelOpFormDialog() {
      this.formDialogVisible = false
    },
    /**
     *  提交表单
     */
    onSubmit() {
      let _this = this
      this.$refs['form'].validate(async(valid) => {
        if (valid) {
          // 菜单选择IDS
          const parentIds = this.$refs.tree.getHalfCheckedKeys()
          const childsIds = this.$refs.tree.getCheckedKeys()
          let selectAllIds = [...parentIds, ...childsIds]

          const selectMenus = selectAllIds.filter(item => {
            return item.split(',').length === 2
          }).map((item) => {
            const data = item.split(',')
            return { menuId: data[0], menuTitle: data[1], rolebuttonsList: this.insertBunList(item, selectAllIds) }
          })
          this.$set(this.form, 'roleMenus', selectMenus)

          if (typeof (this.form) !== 'undefined' && this.form.id) {
            await modifyRole(this.form)
          } else {
            await insertRole(this.form)
          }
          this.formDialogVisible = false
          await this.getItemList()
        }

      })
    },

    /**
     *  获取当前菜单下边的按钮
     */
    insertBunList(data, menuList) {
      let res = menuList.filter(item => {
        return item.indexOf(data) > -1 && item !== data
      }).map(item => {
        let arr = item.split(',')
        return {
          'buttonName': arr[3],
          'buttonType': arr[2]
        }
      })
      return res
    },

    /**
     *  树级选择
     */
    handleCheckChange(data, checked) {
    },

    /**
     *  编辑修改对话框
     */
    async opearDialog(opera, param) {
      this.defaultCheckedKeys = []
      await this.getAllMenus()
      let arrayDefaultCheck = [] // 选中
      this.defaultExpandedKeys = [] // 展开

      if (opera === 'add') {
        const formItem = JSON.parse(JSON.stringify(this.form))
        Reflect.ownKeys(formItem).forEach(item => formItem[item] = '')
        this.form = formItem
      } else if (opera === 'edit') {
        this.form = param
        param.roleMenus.forEach(item => {
          arrayDefaultCheck = [...arrayDefaultCheck, ...this.getBtnListFromMenu(item)]
          // if (item.menuFid !== 0) {
          //   arrayDefaultCheck.push(item.menuId + ',' + item.menuTitle)
          // }
        })
      }
      this.defaultCheckedKeys = arrayDefaultCheck
      this.defaultExpandedKeys = arrayDefaultCheck
      this.formDialogVisible = true
    },

    getBtnListFromMenu(data) {
      const btnList = []
      if (data.rolebuttonsList && data.rolebuttonsList.length !== 0) {
        data.rolebuttonsList.forEach(item => {
          // 229,新闻组件,add,添加
          btnList.push(`${data.menuId},${data.menuTitle},${item.buttonType},${item.buttonName}`)
        })
        return btnList
      }
      return btnList
    },

    /**
     * 获取所有菜单
     * @returns {Promise<void>}
     */
    async getAllMenus() {
      const { data } = await allMultilevelClassification()
      this.menuDataList = data.data.map(item => {
        let res = {}
        res.id = item.id + ',' + item.title
        res.label = item.title
        res.children = []
        item.children.forEach(it => {
          let title = it.id + ',' + it.title
          res.children.push({
            id: title,
            label: it.title,
            children: this.getBtnList(title, it)
          })
        })
        return res
      })
    },

    /**
     *  获取按钮列表
     */
    getBtnList(title, data) {
      if (data.menubuttonList && data.menubuttonList.length !== 0) {
        return data.menubuttonList.map(item => {
          return {
            id: title + ',' + item.type + ',' + item.name,
            label: item.name
          }
        })
      }
      return []
    },

    /**
     *  操作后刷新列表
     */
    refreshList() {
      this.comActionDialog.visible = false
      this.getItemList()
    },
    /**
     *  选择行
     */
    handleSelectionChange(rows) {
      console.log(rows)
    },
    /**
     * 删除数据
     * @param param
     */
    deleteData(param) {
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
