<template>
  <div class="app-container">
    <!-- S 搜索栏目 -->
    <SearchPanel
      :searchBtnLoading="searchBtnLoading"
      :item-list="searchPannelList"
      @onSearch="handleEventSearch"
    >
      <template slot="operationButton">
        <el-button @click="opDialog('add','')"> 新增</el-button>
        <el-button @click="handlerBatchDeletion" type="danger">批量删除</el-button>
        <el-button @click="batchSync" type="warning">批量同步</el-button>
      </template>
    </SearchPanel>
    <!-- E 搜索栏目 -->

    <!-- S 表格 -->
    <el-table-custom
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
      <template slot="operation" slot-scope="scope">
        <el-button @click="opDialog('edit',scope.scope)"> 编辑</el-button>
        <el-button @click="deleteData(scope.scope)" type="danger"> 删除</el-button>
      </template>
    </el-table-custom>
    <!-- E 表格 -->

    <!-- S 弹框删除操作 -->
    <commonAction
      :comActionDialog="comActionDialog"
      :comActionCondition="comActionCondition"
      :comFnName="comFnName"
      @refresh="refreshList"
    >
    </commonAction>
    <!-- E 弹框删除操作 -->

    <OpFormPannel
      :op-form-dialog="opFormDialog"
      :opFormItems="opFormItems"
      :opFormRules="{}"
      :opFormBtnLoading="opFormBtnLoading"
      @opCloseForm="opCloseForm"
      @onFormSubmit="onOpFormSubmit"
    >
      <!-- S 父级菜单 -->
      <template slot="-1">
        <el-form-item label="父级菜单">
          <el-select v-model="opFormModelLocal.parentMenu" placeholder="请选择" clearable>
            <el-option
              v-for="item in menuItemList.parents"
              :key="item.name"
              :label="item.meta.title"
              :value="item.meta.title +','+ item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <!-- E 父级菜单 -->

      <!-- S 二级菜单 -->
      <!--:rules="[{ required: true, message: '请输入菜单菜单名称', trigger: 'change' }]"-->
      <template slot="-1">
        <el-form-item label="菜单名称" prop="title"

        >
          <el-select
            clearable
            v-model="opFormModelLocal.title"
            @change="selectOpMenuFn($event)"
            filterable
            allow-create
            default-first-option
            placeholder="请选择"
          >
            <el-option
              v-for="item in menuItemList.children"
              :key="item.name"
              :label="item.meta.title"
              :value="item.meta.title"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <!-- E 二级菜单 -->

      <!-- S 菜单name -->
      <!-- :rules="[{ required: true, message: '请输入菜单name', trigger: 'blur' }]" -->
      <template slot="-1">
        <el-form-item label="菜单Name" prop="name">
          <el-input v-model="opFormModelLocal.name" clearable/>
        </el-form-item>
      </template>
      <!-- E 菜单name -->
    </OpFormPannel>
  </div>
</template>
<script>

import { batchInsert, category, dataBatchDelete, dataDelete, menuList, saveOrUpdate } from '@/api/permission/menu'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import queryListmixin from '@/mixins/queryListMixin'
import CommonAction from '@/components/ActionDialog/CommonAction'

import { asyncRoutes } from '@/router'
import opFormMixin from '@/mixins/opFormMixin'
import { getArrJsonDif } from '@/utils'
import comActionMixin from '@/mixins/comActionMixin'
import OpFormPannel from '@/components/DataOperationPannel/OpFormPannel'

export default {
  name: 'SystemMenu',
  components: { OpFormPannel, CommonAction, SearchPanel },
  mixins: [queryListmixin, opFormMixin, comActionMixin],
  filters: {},
  data() {
    return {
      opFormModelLocal: {
        parentMenu: '',
        title: '',
        name: ''
      },
      // 下拉菜单
      menuItemList: { 'parents': [], 'children': [] },
      searchPannelList: [{ type: 'input', name: '菜单名称', prop: 'title' }],
      getListFnName: menuList,
      columns: [
        { label: 'ID', prop: 'id' },
        { label: '菜单名称', prop: 'title' },
        { label: '菜单name', prop: 'name' },
        { label: '操作', isSlot: true, prop: 'operation', fixed: 'right', dataIndex: '', align: 'center' }
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
      const routeLink = filterAsyncRoutes.map(item => {
        // 一级菜单
        let linker = {
          'title': item.meta.title,
          'name': item.name,
          'meta':item.meta,
          'children': this.batchSyncChild(item.children)
        }
        // 二级菜单
        return linker
      })
      batchInsert(routeLink).then(res => {
        this.$message.success(`更新成功`)
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
            'meta':item.meta,
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
      const res = await category()
      let differ = getArrJsonDif(res.data.data, this.menuItemList.parents, 'name')
      let newRouter = differ.map(res => {
        res.meta = { title: res.title }
        return res
      })
      this.menuItemList.parents.push(...newRouter)
      let _param = JSON.parse(JSON.stringify(param))
      this.opFormDialog.visible = true
      this.$set(this.opFormModelLocal, 'id', _param.id)
      this.$set(this.opFormModelLocal, 'parentMenu', '')
      this.$set(this.opFormModelLocal, 'title', '')
      this.$set(this.opFormModelLocal, 'name', '')
      this.opFnName = saveOrUpdate
      if (opera === 'add') {
        this.opFormDialog.buttonTitle = '添加'
      } else if (opera === 'edit') {
        this.opFormDialog.buttonTitle = '修改'
        this.opFormModelLocal = _param
        this.$set(this.opFormModelLocal, 'parentMenu', _param.fid === 0 ? '' : _param.ftitle + ',' + _param.fname)
      }
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
    'opFormModelLocal.parentMenu': {
      handler(value) {
        if (value !== '' && value !== 0) {
          const routerChindren = JSON.parse(JSON.stringify(this.menuItemList.parents))
          const children = routerChindren.find(res => {
            if (res.name.toLowerCase() === value.split(',')[1].toLowerCase()) {
              console.log(res.children)
              return res.children
            }
          })
          this.menuItemList.children = children.children
        }
      }
    },
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
