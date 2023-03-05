import { generateRoutes } from '@/api/user'

import { asyncRoutes, constantRoutes, noPage } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

/**
 * 生成菜单
 * @param routes
 * @returns {*[]}
 */
export function filterAsyncRoutes(routes) {
  const res = []
  const resultTree = []
  toTree(asyncRoutes, routes, resultTree)
  res.push(...resultTree)
  res.push(noPage)
  return res
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

    if (hasPermission) {
      if (item.children && item.children.length !== 0) {
        item.children.forEach((childItem, childIndex) => {
          const childPermission = routes.some(i => {
            return i.name.toLowerCase() == childItem.name.toLowerCase()
          })
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
        const { data } = res
        let roleMenu = data.data.menuList || []
        let accessedRoutes = filterAsyncRoutes(roleMenu) || []
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
