<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse"/>
    <el-input v-model="menuKey" v-show="!isCollapse" clearable placeholder="菜单搜索" style="margin: 20px;width: auto"></el-input>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div style="background: white">{{ permission_routes }}</div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in menuList" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data() {
    return {
      menuKey: '',
      menuList: JSON.parse(JSON.stringify(this.$store.getters.permission_routes))
    }
  },
  watch: {
    menuKey: {
      handler(val) {
        const menuArr = JSON.parse(JSON.stringify(this.$store.getters.permission_routes))
        if (val === '') {
          this.menuList = menuArr
        } else {
          this.menuList = menuArr.filter(item => {
            if (item.meta) {
              if (item.meta.title.search(val.trim()) !== -1) {
                return item
              }
              const findSubTitle = item.children.filter(i => {
                return i.meta.title.search(val.trim()) !== -1
              })
              if (findSubTitle.length !== 0) {
                item.children = findSubTitle
                return item
              }
            }
          })
        }

      }
    }
  },
  created() {

  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
