import router, { asyncRoutes, constantRoutes } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

// const r = require.context('./views/', true, /\page.js/)
// r.keys().forEach(async(key) => {
//   let path = key.replace(/.\//, './views/')
//   let res = await Promise.resolve(require(`${path}`).default)
//   let routerPath = path.replace(/.\/views\//, '')
// })

// const r = require.context('./views', true, /.vue/)
// let routeArr = []
// r.keys().forEach((key) => {
//   console.log(key) // 这里的匹配结果就是 ./login/index.vue  ./product/index.vue
//   const keyArr = key.split('.')
//   if (key.indexOf('index') > -1) {
//     // 约定式路由构成方案，views文件夹下的index.vue文件都会自动化生成路由
//     // 但是我不想在路由中出现index，我只想要login，product，于是对path进行改造。
//     // 这部其实是有很多优化空间的。大家可以自己试着用正则去提取
//     const pathArr = keyArr[1].split('/')
//     routeArr.push({
//       name: pathArr[1],
//       path: '/' + pathArr[1],
//       component: r(key).default // 这是组件
//     })
//   }
// })
// console.log(routeArr)

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  // 检测是否有token / 没有token 跳转登录携带者当前URl
  if (hasToken) {
    if (to.path === '/login') {
      // 如果存在token 是登录页页面直接跳转首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 登录页后获取不到用户名重新获取用户信息
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息，获取菜单信息
          await store.dispatch('user/getInfo')
          await store.dispatch('permission/generateRoutes')
          // 获取后端返回所有菜单
          const permission_routes = store.getters.permission_routes
          const asyncRouter = filterMenu(permission_routes)
          router.addRoutes(asyncRouter)
          //   next()
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

/**
 * 过滤重复的路由菜单
 * @param permission_routes
 * @returns {*}
 */
const filterMenu = (permission_routes) => {
  let router = constantRoutes // 静态路由菜单
  return permission_routes.filter(item => {
    let res = router.find(i => i.path === item.path)
    if (!res) {
      return true
    }
  })
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
