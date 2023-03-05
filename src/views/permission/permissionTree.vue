<template>
  <div>
    <el-button type="primary" @click="refreshMenu"> 刷新菜单</el-button>
    <el-button type="info" @click="insert"> 添加数据</el-button>
    {{ menusValue }}
    <!-- 一级循环 {{ allMenus }} -->
    <div v-for="(item,index) in allMenus" style="width: 100%;margin: auto;">
      <el-card>
        <el-checkbox-group v-model="menusValue" @change="menuChange">
          <!-- S 一级菜单 -->
          <div style="display: flex">
            <div style="font-size: 14px;margin-right: 10px;"
                 @click=" allMenus[index].visible = ! allMenus[index].visible"
            >
              <i class="el-icon-circle-plus-outline" v-show="!item.visible"></i>
              <i class="el-icon-remove-outline" v-show="item.visible"></i>
            </div>
            <el-checkbox :key="item.id" :value="item.name" :label="item.id+'_'+item.title">
              {{ item.title }}
            </el-checkbox>
          </div>
          <!-- E 一级菜单 -->

          <!-- 二级循环 -->
          <div v-for="(subItem,subIndex) in item.children" v-show="item.visible" style="border: 1px solid #99a9bf ; margin: 5px; padding: 5px;">
            <el-checkbox
              :key="subItem.id"
              :value="subItem.name"
              :label="item.id+'_'+item.title+'_'+subItem.id+'_'+subItem.title"
            >{{ subItem.title }}
            </el-checkbox>
            <!-- {{ subItem.title }} -->
            <!-- 按钮循环 -->
            <div style="display: flex;">
              <el-card v-for="(btnItem,btnIndex) in subItem.menubuttonList">
                <el-checkbox
                  :key="btnItem.id"
                  :value="btnItem.name"
                  :label="item.id+'_'+item.title+'_'+subItem.id+'_'+subItem.title+'_'+btnItem.name+'_'+btnItem.type"
                >
                  {{ btnItem.name }}
                </el-checkbox>
                <!-- {{ btnItem.name }} / {{ btnItem.type }} -->
              </el-card>
            </div>
          </div>
        </el-checkbox-group>
      </el-card>
    </div>
  </div>
</template>

<script>
import { allMultilevelClassification } from '@/api/permission/menu'

export default {
  name: 'permissionTree',
  data() {
    return {
      menusValue: [],
      allMenus: [],
    }
  },
  created() {
    this.refreshMenu()
  },
  methods: {
    insert() {
      const roleMenus = []
      this.menusValue.forEach(item => {
        const data = item.split('_')
        if (data.length === 2) { // 1级分类
          roleMenus.push({ menuId: data[0], menuTitle: data[1] })
        }
        if (data.length === 4) { // 2级分类
          roleMenus.push({
            menuId: data[2],
            menuTitle: data[3],
            rolebuttonsList: this.getButtonList(item) // 获取按钮列表
          })
        }
      })
      console.log(roleMenus)
      return roleMenus;
    },
    /**
     *  获取按钮列表
     * @param data
     * @returns {{buttonName: *, buttonType: *}[]|*[]}
     */
    getButtonList(data) {
      const res = this.menusValue.filter((element, index) => {
        return element.split('_').length === 6 && element.indexOf(data) > -1
      })
      if (res.length !== 0) {
        return res.map(item => {
          const buttonArray = item.split('_')
          return {
            buttonName: buttonArray[4],
            buttonType: buttonArray[5]
          }
        })
      }
      return []
    },
    /**
     * 是否选择上一级下一级全选
     * @param value  选择的数据
     *  menusValue  绑定选择数据   allMenus  所有数据
     */
    menuChange(value) {
      this.$emit('selectData',this.insert());
      // const menusValue = JSON.parse(JSON.stringify(this.menusValue))
      // this.menusValue = []
      // const valueSort = value.sort()
      // const subSelects = []
      // valueSort.forEach(item => {
      //   const arr = item.split('_')
      //   if (arr.length === 2) {
      //     const s = this.selectMainMenu(arr)
      //     subSelects.push(s)
      //   }
      // })
      // console.log(subSelects.flat())
      // const selectAll = [...subSelects.flat()]
      // const set = new Set(selectAll)
      // this.menusValue = Array.from(set)
    },

    /**
     * 选择主菜单
     * @param data
     */
    selectMainMenu(data) {
      const result = this.allMenus.find(item => {
        return item.title === data[1]
      })
      const arr = []
      if (result && result.children.length !== 0) {
        result.children.forEach(item => {
          // 选中增加二级菜单
          const subMainMenu = result.id + '_' + result.title + '_' + item.id + '_' + item.title
          arr.push(subMainMenu)
          if (item.menubuttonList && item.menubuttonList.length !== 0) {
            // 选中增加按钮
            item.menubuttonList.forEach(i => {
              arr.push(subMainMenu + '_' + i.name + '_' + i.type)
            })
          }
        })
      }
      return arr
    },

    async refreshMenu() {
      const { data } = await allMultilevelClassification()
      this.allMenus = data.data.map(item => {
        item.visible = false
        return item
      })
    }
  }
}
</script>

<style scoped>

</style>
