<template>
  <div>
    <div>
      图片

      <img :src="imgSrc"
           style="width: 200px; height: 50px;" @click="bbb"
      />
      <el-image style="width: 100px; height: 100px" :src="imgSrc" ></el-image>
    </div>


    <el-button @click="getdata">获取数据</el-button>

    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
    >
      <el-table-column
        prop="id"
        label="ID"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="菜单名称"
        sortable
        width="180"
      >
      </el-table-column>
    </el-table>

    <el-table
      :data="tableData1"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
      >
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { menuList } from '@/api/permission/menu'
import axios from 'axios'

export default {
  name: 'Bbb',
  data() {
    return {
      imgSrc:'https://t7.baidu.com/it/u=1915625461,1828772823&fm=74&app=80&size=f256,256&n=0&f=JPEG&fmt=auto?sec=1672333200&t=ef080c973847f46e1515475538e5d946',



      tableData:[],

      tableData1: [
        {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }]
        }]
    }
  },
  created() {


  },
  methods: {

    bbb(){
      axios.post('/api/user/verificationcode', {
        responseType: 'blob'
      }).then(({ data }) => {

        const myBlob = new window.Blob([data], { type: 'image/jpeg' })
        const qrUrl = window.URL.createObjectURL(myBlob)
        this.imgSrc = qrUrl
      })
    },

    getdata() {
      this.menus()
    },
    menus(){
      menuList({}, 1, 10).then(r => {
        let { data } = r

        this.tableData = data.data.records
        console.log(r)
      })
    }
  }
}
</script>

<style scoped>

</style>
