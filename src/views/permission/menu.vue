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
        <el-button @click="opDialogAddBtn()" v-permission="['addButton']" > 新增按钮</el-button>
        <el-button @click="handlerBatchDeletion" type="danger" v-permission="['batchDelete']" >批量删除</el-button>
        <el-button @click="batchSync" type="warning" v-permission="['batchSync']" >批量同步</el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索栏目 -->

    <!-- S 表格 -->
    <el-table-custom
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
    </el-table-custom>
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
      :opFormRules="{}"
      :opFormBtnLoading="opFormBtnLoading"
      @opCloseForm="opCloseForm"
      @onFormSubmit="onOpFormSubmit"
    >
      <template slot="-1">
        <!-- S 操作菜单  -->
        <template v-if="showMenuBtnVisible">
          <!-- S 父级菜单 -->
          <el-form-item label="父级菜单">
            <el-select v-model="opFormModelLocal.parentMenu" placeholder="请选择" clearable>
              <el-option
                v-for="item in menuItemList.parents"
                :key="item.name"
                :label="item.title"
                :value="item.title +','+ item.name"
                :disabled="opFormModelLocal.id === item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- E 父级菜单 -->
          <!-- S 二级菜单 -->
          <el-form-item label="菜单名称" prop="title"

          >
            <el-input v-model="opFormModelLocal.title" clearable/>
          </el-form-item>
          <!-- E 二级菜单 -->
          <!-- S 菜单name -->
          <el-form-item label="菜单Name" prop="name">
            <el-input v-model="opFormModelLocal.name" clearable/>
          </el-form-item>
          <!-- E 菜单name -->
          <el-form-item label="菜单排序" prop="menuOrder">
            <el-input v-model="opFormModelLocal.menuOrder" clearable/>
          </el-form-item>
        </template>
        <!-- E 操作菜单  -->

        <!-- S 操作按钮  -->
        <template v-if="!showMenuBtnVisible">
          <!-- 一级菜单 -->
          <el-form-item label="父级菜单">
            <el-select @change="getSecondsMenuByMenuId" v-model="opFormModelLocal.firMenuId" placeholder="请选择"
                       clearable
            >
              <el-option
                v-for="item in firMenuList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 二级菜单 -->
          <el-form-item label="二级菜单">
            <el-select v-model="opFormModelLocal.menuId" placeholder="请选择" clearable>
              <el-option
                v-for="item in secMenuList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 按钮名称 -->
          <el-form-item label="按钮名称" prop="name">
            <el-input v-model="opFormModelLocal.name" clearable/>
          </el-form-item>
          <!-- 按钮type -->
          <el-form-item label="按钮type" prop="name">
            <el-input v-model="opFormModelLocal.type" clearable/>
          </el-form-item>

        </template>
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
import { getArrJsonDif } from '@/utils'
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
      showMenuBtnVisible: true, // 调整显示按钮还是菜单  true 显示按钮 false 显示菜单
      firMenuList: [], // 一级菜单
      secMenuList: [], // 二级菜单
      opFormModelLocal: {
        id: '',
        parentMenu: '',
        title: '',
        name: '',
        menuOrder: ''
      },
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
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center', width:150 }
      ]
    }
  },
  beforeCreate() {

  },
  created() {

  },
  methods: {
    /**
     *  用于 校验
     */
    isLegal() {
      if (this.opFormModelLocal.name == '' || this.opFormModelLocal.title == '') {
        this.$message.error('菜单名称、菜单Name必填!')
        return true
      }
    },
    /**
     *  合并数据
     */
    mergeOperationForm(params) {
      Object.assign(params, this.opFormModelLocal)
    },

    /**
     *  修改新增的表单菜单 一级菜单变换
     */
    selectOpMenuFn(data = '') {
      let res = this.menuItemList.children.find(item => {
        return item.path !== '*' && item.meta.title === data
      })
      if (res && typeof (res) !== 'undefined') {
        this.opFormModelLocal.name = res.name
      }
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
     *  打开对话框 (包含新增修改)
     */
    async opDialog(opera, param) {
      this.showMenuBtnVisible = true // 打开显示按钮
      const {data:{ data:dbMenuList }} = await category()

      this.menuItemList.parents = dbMenuList
      let _param = JSON.parse(JSON.stringify(param))
      this.opFormDialog.visible = true
      this.$set(this.opFormModelLocal, 'id', _param.id)
      this.opFnName = saveOrUpdate

      for (let item in this.opFormModelLocal) {
        this.opFormModelLocal[item] = param == null ? '' : param[item]
      }

      if (opera === 'add') {
        this.opFormDialog.buttonTitle = '添加'
      } else if (opera === 'edit') {
        this.opFormDialog.buttonTitle = '修改'
        this.opFormModelLocal = _param
        this.$set(this.opFormModelLocal, 'parentMenu', _param.fid === 0 ? '' : _param.ftitle + ',' + _param.fname)
      }
    },

    /**
     *  显示添加按钮
     */
    async opDialogAddBtn() {
      this.showMenuBtnVisible = false
      this.opFormDialog = { title: '新增按钮', visible: true, buttonTitle: '新增按钮' }
      const { data: { data } } = await category()
      this.firMenuList = data
      this.opFormModelLocal = { firMenuId: '', menuId: '', type: '', name: '' }
      this.opFnName = indertBtn
    },

    /**
     *  通过一级菜单id获取二级菜单
     */

    async getSecondsMenuByMenuId(menuId) {
      this.secMenuList.length = 0
      if (menuId !== '') {
        const { data: { data } } = await getSecMenuList({ 'id': menuId })
        this.secMenuList = data
      }
    },

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
    }

  },
  watch: {
    // 'opFormModelLocal.parentMenu': {
    //   handler(value) {
    //     if (value !== '' && value !== 0 && typeof (value) !== 'undefined') {
    //       const routerChindren = JSON.parse(JSON.stringify(this.menuItemList.parents))
    //       const children = routerChindren.find(res => {
    //         if (res.name.toLowerCase() === value.split(',')[1].toLowerCase()) {
    //           return res.children
    //         }
    //       })
    //       this.menuItemList.children = children.children
    //     }
    //   }
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
