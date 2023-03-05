<template>
  <div class="app-container">

    <SearchPanel
      :searchBtnLoading="searchBtnLoading"
      :item-list="searchPannelList"
      @onSearch="onSearch"
    ></SearchPanel>

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
    >

      <template slot="title" slot-scope="scope">
        <span style="color: #20a0ff">{{ scope.scope.title }}</span>
      </template>

      <template slot="operation" slot-scope="scope">
        <el-button> 编辑</el-button>
        <el-button @click="editData(scope.scope)" type="danger"> 删除</el-button>
      </template>

    </el-table-custom>


    <el-card class="box-card margin">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="searchPannel.title" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="6">
          <el-form label-width="80px">
            <el-form-item label="时间">
              <el-date-picker v-model="searchPannel.update" type="date"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="text-align: right">
        <el-button type="primary" icon="el-icon-search" @click="handlerShowEdit(null,'add')">新增</el-button>
        <el-button type="primary" icon="el-icon-search" @click="handlerSearch">搜索</el-button>
      </el-row>
    </el-card>

    <el-card class="box-card margin">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        stripe
        highlight-current-row
        :header-cell-style="{ background:'#eee'}"
        @selection-change="handleSelectionChange"
      >

        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>

        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <el-table-column label="标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column label="副标题">
          <template slot-scope="scope">
            {{ scope.row.fTitle }}
          </template>
        </el-table-column>

        <el-table-column label="图片">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.update }}
          </template>
        </el-table-column>

        <el-table-column label="浏览量">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column label="推荐">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column label="推荐">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column label="作者" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.author }}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handlerShowDialog(scope.row.id,'edit')" style="margin-right: 10px;">编辑
            </el-button>
            <el-popconfirm title="确定删除吗？" @confirm="handlerDelete(scope.row.id)"
                           @onConfirm="handlerDelete(scope.row.id)"
            >
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <el-card class="box-card">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handlerClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"/>
        </el-form-item>

        <el-form-item label="副标题" prop="fTitle">
          <el-input v-model="form.fTitle"/>
        </el-form-item>

        <el-form-item label="相关图片">
          <upload-img :img="form.pic" @uploadSuccess="uploadSuccess"></upload-img>
        </el-form-item>

        <el-form-item label="主要内容">

          <quill-editor ref="text"
                        v-model="form.contents" class="editor"
                        :options="editorOption"
          />

        </el-form-item>

        <el-form-item label="更新时间">
          <el-date-picker v-model="form.update" type="date"/>
        </el-form-item>

        <el-form-item label="浏览量">
          <el-input v-model="form.num"/>
        </el-form-item>

        <el-form-item label="推荐值">
          <el-input v-model="form.top"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">添加</el-button>
          <el-button @click="resetForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <common-action
      :visible="commonActionVisible"
      title="编辑"
      :message="message"
      :condition="conditionData"
      :apiUrl="apiUrl"
      @refresh="refreshList"
    >
      <template slot="title">
        <span slot="title">aaaaaaaaaaaaaaa</span>
      </template>
    </common-action>

  </div>
</template>

<script>
import { findRow, selectTablePage } from '@/api/table'
import DialogForm from '@/components/DialogForm/DialogForm'
import { parseTime } from '@/utils'
import UploadImg from '@/components/UploadFile/uploadImg'
import SearchPanel from '@/components/SearchPanel/SearchPanel'
import queryListmixin from '@/mixins/queryListMixin'

import { adaptCol } from '@/utils/adapter'
import tableMixin from '@/views/news/tableMixin'
import CommonAction from '@/components/ActionDialog/CommonAction'

export default {
  components: { CommonAction, SearchPanel, UploadImg, DialogForm },
  mixins: [queryListmixin, tableMixin],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {

    return {
      conditionData: {},
      apiUrl: newsDelete,
      commonActionVisible: false,
      getListFnName: dataListByPage, // 主页面查询
      searchPannelList: [
        { type: 'input', name: '标题', prop: 'title' },
        { type: 'date', name: '时间', prop: 'update' }
      ],

      editorOption: {},
      rules: {},
      dialogImageUrl: '',

      form: {
        title: '',
        fTitle: '',
        pic: '',
        contents: '',
        update: '',
        num: '',
        top: ''
      },
      options: [{
        value: 'success',
        label: 'success'
      }, {
        value: 'gray',
        label: 'gray'
      }, {
        value: 'danger',
        label: 'danger'
      }],

      searchPannel: {
        title: '',
        update: ''
      },

      total: 0,
      dialogVisible: false,
      list: [],
      listLoading: true,
      formData: {
        title: '',
        author: '',
        pageviews: '',
        status: '',
        display_time: ''
      },
      currentPage: 1,
      pageSize: 5

    }
  },
  created() {
    console.log(this.columns)
    this.fetchData()
  },
  methods: {

    refreshList() {
      this.commonActionVisible = false
      this.getList()
    },

    editData(data) {
      // 编辑数据
      this.conditionData = data.id
      this.message = '删除数据'
      this.commonActionVisible = true
    },

    handleSelectionChange(rows) {
      console.log(rows)
    },
    onSearch(params) {
      this.handleEventSearch(params)
    },
    uploadSuccess(data) {
      this.form.pic = data
      console.log(data)
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.$refs['form'].clearValidate()
      this.dialogVisible = false
      console.log(this.form)
    },

    /**
     *  编辑
     */
    async handlerShowDialog(id, operation) {
      const newsDetail = await getDetail({ 'id': id })
      this.form = newsDetail.data.data
      this.dialogVisible = true
    },

    /**
     * 插入数据
     *  */
    onSubmit() {
      let postData = { ...this.form }
      postData.update = parseTime(postData.update, '{y}-{m}-{d}')
      if (typeof (postData.id) == 'undefined') {
        newsInsert(postData)
      } else {
        updateDetail(postData.id, postData)
      }
      setTimeout(() => {
        this.dialogVisible = false
        this.$refs.form.resetFields()
        this.fetchData()
      })
    },

    /**
     * 点击搜索
     */
    handlerSearch() {
      // let postData = JSON.parse(JSON.stringify(this.searchPannel))
      // postData.update = parseTime(postData.update,'{y}-{m}-{d}')
      // debugger
      this.fetchData(this.searchPannel)
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },

    async handlerShowEdit(id = null, opera = 'add') {
      if (opera === 'add') {
        this.formData = {}
      } else {
        const postData = { 'id': id }
        const result = await findRow(postData)
        this.formData = result.data?.data
      }
      this.dialogVisible = true
    },

    handlerClose() {
      this.dialogVisible = false
      this.fetchData()
    },

    /**
     * 删除数据
     * @param id
     * @returns {Promise<void>}
     */
    async handlerDelete(id) {
      const result = await newsDelete(id)
      this.$message.success(`数据删除成功`)
      setTimeout(() => {
        this.fetchData()
      }, 500)

    },

    fetchData(searchPannel = null) {
      this.listLoading = true
      this.list.length = 0

      // typeof searchPannel.display_time !== 'undefined' ? searchPannel.display_time = searchPannel.display_time.split('T') : ''
      if (searchPannel && searchPannel.update) {
        searchPannel.update = parseTime(searchPannel.update, '{y}-{m}-{d}')
      }
      const postData = {
        ...searchPannel
      }
      dataListByPage(postData, this.currentPage, this.pageSize).then(response => {
        this.list = response.data.data.records
        this.total = response.data.data.total
        this.listLoading = false
      }).then(res => {
        console.log(res)
      })
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
