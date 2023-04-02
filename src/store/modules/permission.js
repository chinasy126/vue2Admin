import { generateRoutes } from '@/api/user'

import { asyncRoutes, constantRoutes, adminRoutes, noPage } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // state.routes = constantRoutes.concat(routes)
    state.routes = [...adminRoutes, ...routes]
  }
}

/**
 * 生成菜单
 * @param routes
 * @returns {*[]}
 * 后端返回菜单
 * 1。根据返回顺序拼凑一级菜单二级菜单
 * 2。按钮权限与二级菜单拼接
 * 3。静态菜单与动态菜单拼接
 *
 */
export function filterAsyncRoutes(routes) {
  let res = changeMenu(routes, asyncRoutes)
  res.push(noPage)
  return res
}

/**
 *
 * @param dynamicMenu 接口返回动态菜单
 * @param staticMenu  路由文件定义静态菜单
 */
const changeMenu = (dynamicMenu, staticMenu) => {
  let menuList = []
  // 1。 先循环动态菜单匹配出来一级菜单，二级菜单
  dynamicMenu.forEach(dyItem => {
    // 一级菜单
    if (dyItem.fid == 0) {
      let menu = getParentMenu(dyItem, dynamicMenu, staticMenu)
      if (menu.length !== 0) {
        menuList = [...menuList, ...menu]
      }
    }
  })
  return menuList
}
/**
 * 获取一级菜单
 * @param dyItem
 * @param dynamicMenu
 * @param staticMenu
 * @returns {*[]}
 */
const getParentMenu = (dyItem, dynamicMenu, staticMenu) => {
  let menu = []
  staticMenu.forEach(item => {
    if (item.name === dyItem.name) {
      item.children = getChildrenMenu(dynamicMenu, item.children)
      item.meta.title = dyItem.title
      menu.push(item)
    }
  })
  return menu
}
/**
 * 获取二级菜单
 * @param dynamicMenu 所有动态菜单
 * @param staticMenu 当前静态菜单
 * @returns {*[]}
 */
const getChildrenMenu = (dynamicMenu, staticMenu) => {
  let subMenus = []
  dynamicMenu.forEach(item => {
    let res = staticMenu.find(i => {
      if (i.name === item.name) {
        i.meta.title = item.title
        return i
      }
    })
    if (res) {
      res.meta.btnPermissions = getRoleMenuBtn(item.menubuttonList, res.meta.btnPermissions)
      subMenus.push(res)
    }
  })
  return subMenus
}

/**
 * 获取权限的按钮
 * @param dynamicButton 当前动态菜单里的动态按钮
 * @param staticButton 静态菜单的静态按钮
 * @returns {*[]}
 */
const getRoleMenuBtn = (dynamicButton, staticButton) => {
  let btnList = []
  dynamicButton.forEach(item => {
    let btnItem = staticButton.find(i => i.type === item.type)
    if (btnItem) {
      btnList.push(btnItem)
    }
  })
  return btnList
}

/**
 * 菜单转换
 * @param asyncRoutes 前端菜单
 * @param routes 后端菜单
 * @param resultTree 返回结果
 */
const toTree = (asyncRoutes, routes, resultTree) => {
  asyncRoutes.forEach((item, index) => {
    const hasPermission = routes.some(i => {
      return i.name.toLowerCase() == item.name.toLowerCase()
    })

    // 匹配到了一级菜单
    if (hasPermission) {
      // 查看是否拥有二级菜单权限
      if (item.children && item.children.length !== 0) {
        // 循环二级菜单
        item.children.forEach((childItem, childIndex) => {
          const childPermission = routes.some(i => {
            return i.name.toLowerCase() == childItem.name.toLowerCase()
          })
          // 如果存在二级菜单/ 查看二级菜单内的按钮
          if (childPermission) {
            if (childItem.meta && childItem.meta.btnPermissions) {
              let rout = routes.find(routerItem => routerItem.name === childItem.name)
              const menuBtnList = childItem.meta.btnPermissions
              if (rout && rout.menubuttonList) {
                let btnList = []
                // 静态的按钮
                btnList = menuBtnList.filter(i => {
                  return rout.menubuttonList.find(routerBtn => routerBtn.type === i.type)
                }).map(btnItem => btnItem)
                childItem.meta.btnPermissions = btnList
              }
            }

          }
          // item.children.meta = getCurrentButton(item.children.meta);

          if (!childPermission) {
            delete item.children[childIndex]
          }
        })
      }
      resultTree.push(item)
    }

  })
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      generateRoutes().then(res => {
        const { data: { data: { menusList } } } = res
        //  let roleMenu = data.data.menuList || [] // 接口获取的菜单内容，数据平铺形式
        let accessedRoutes = filterAsyncRoutes(menusList) || []
        //  accessedRoutes = data.data.menuList || [] // asyncRoutes
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
