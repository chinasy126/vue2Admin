import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
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
    meta: { title: '系统管理', icon: 'el-icon-s-tools', 'menuOrder': 1 },
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
          title: '角色管理', icon: 'el-icon-message-solid', 'menuOrder': 0,
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
          title: '用户管理', icon: 'el-icon-user-solid',
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
    meta: { title: '新闻', icon: 'el-icon-s-order', 'menuOrder': 0 },
    children: [
      {
        path: 'newsindex',
        name: 'newsindex',
        component: () => import('@/views/news/newsIndex'),
        meta: {
          title: '新闻组件', icon: 'el-icon-s-operation', 'menuOrder': 0,
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
    meta: { title: '产品', icon: 'el-icon-s-grid', 'menuOrder': 0 },
    children: [
      {
        path: 'class',
        name: 'productclass',
        component: () => import('@/views/product/productClass'),
        meta: {
          title: '产品分类', icon: 'el-icon-menu', 'menuOrder': 0,
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
          title: '产品管理', icon: 'form', 'menuOrder': 0,
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
