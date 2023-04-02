import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 *
 * 静态常用路由
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

export const adminRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

/**
 * 动态路由
 */

export const configRoutes = [
  {
    path: '/permission',
    component: Layout,
    name: 'permissions',
    alwaysShow: true, // 当有一个子菜单显示
    meta: { title: '系统管理', icon: 'el-icon-s-help', 'menuOrder': 0 },
    children: [
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/permission/menu'),
        meta: {
          title: '菜单管理', icon: 'form', 'menuOrder': 0,
          btnPermissions: [
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' },
            { title: '新增菜单', type: 'addMenu' },
            { title: '新增按钮', type: 'addButton' },
            { title: '批量删除', type: 'batchDelete' },
            { title: '批量同步', type: 'batchSync' }

          ]
        }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/permission/role'),
        meta: {
          title: '角色管理', icon: 'form', 'menuOrder': 0,
          btnPermissions: [
            { title: '新增', type: 'add' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' }
          ]
        }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/permission/user'),
        meta: {
          title: '用户管理', icon: 'form',
          'menuOrder': 0,
          btnPermissions: [
            { title: '新增', type: 'add' },
            { title: '批量删除', type: 'batchDelete' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' }
          ]
        }
      }
    ]
  },
  {
    path: '/news',
    component: Layout,
    name: 'news',
    alwaysShow: true, // 当有一个子菜单显示
    meta: { title: '新闻', icon: 'el-icon-s-help', 'menuOrder': 1 },
    children: [
      {
        path: 'newsindex',
        name: 'newsindex',
        component: () => import('@/views/news/newsIndex'),
        meta: {
          title: '新闻组件', icon: 'form', 'menuOrder': 1,
          btnPermissions: [
            { title: '添加', type: 'add' },
            { title: '导入', type: 'import' },
            { title: '导出', type: 'export' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' },
            { title: '批量删除', type: 'batchDeletion' }
          ]
        }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    name: 'product',
    alwaysShow: true, // 当有一个子菜单显示
    meta: { title: '产品', icon: 'el-icon-s-help', 'menuOrder': 1 },
    children: [
      {
        path: 'class',
        name: 'productclass',
        component: () => import('@/views/product/productClass'),
        meta: {
          title: '产品分类', icon: 'form', 'menuOrder': 1,
          btnPermissions: [
            { title: '添加', type: 'add' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' }
          ]
        }
      },
      {
        path: 'index',
        name: 'productindex',
        component: () => import('@/views/product/produtIndex'),
        meta: {
          title: '产品管理', icon: 'form', 'menuOrder': 3,
          btnPermissions: [
            { title: '添加', type: 'add' },
            { title: '编辑', type: 'edit' },
            { title: '删除', type: 'delete' }
          ]
        }
      }
    ]
  }
]

export const asyncRoutes = [
  ...configRoutes
]

/**
 *   需要最后404页面
 * @type
 */
// 404 page must be placed at the end !!!
export const noPage = { path: '*', redirect: '/404', hidden: true }

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
