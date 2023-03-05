<template>
  <div>
    <div v-for="(item,index) in permissionList" :key="item.id">
      <el-tag type="success">{{ item.menuTitle }}</el-tag>

      <div v-for="(subItem,subIndex) in item.secondaryMenu" class="secondaryMenu">
        <el-tag type="info">{{ subItem.menuTitle }}</el-tag>
        <el-tag type="warning" v-for="(btnItem,btnIndex) in subItem.rolebuttonsList">{{ btnItem.buttonName }}</el-tag>
      </div>

    </div>


  </div>
</template>

<script>
export default {
  name: 'rolePermission',
  props: {
    permission: {
      type: Array,
      default() {
        return []
      }
    }
  },
  date() {

  },
  watch: {
    // permission: {
    //   handler(value) {
    //     console.log(value)
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  computed: {
    permissionList() {
      // 一级菜单
      let primaryMenu = this.permission.filter(item => {
        return item.menuFid === 0
      })

      primaryMenu.forEach((item, index) => {
        let secondaryMenu = this.permission.filter(i => {
          return item.menuId === i.menuFid
        })
        primaryMenu[index]['secondaryMenu'] = secondaryMenu
      })
      return primaryMenu
    }

  },
  created() {

  },
  methods: {}
}
</script>

<style scoped>

.el-tag{
  margin-right: 5px;
  margin-bottom: 5px;
}

.secondaryMenu{
  margin-left: 20px;
}

</style>
