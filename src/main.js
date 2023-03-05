import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import './element-variables.scss'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios'

Vue.use(VueQuillEditor)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 开启后与 axios onUploadProgress 冲突
// 开发时候 TODO development    发布时候 production
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development' ) {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  size: 'mini' // set element-ui default size
})

import elTableCustom from '@/components/TablePannel/elTableCustom'

Vue.component('el-table-custom', elTableCustom)

Vue.config.productionTip = false

Vue.prototype.uploadImageApi = '/api' + '/uploadimg'
const token = localStorage.getItem('token')
Vue.prototype.uploadheaders = {
  'X-Token': token
}

import debounce from '@/directive/debounce'
import permission from '@/directive/permission/index'

Vue.use(debounce)
Vue.use(permission)

// 引入图标
// 仅引入用到的图标以减小打包体积
// import 'vue-awesome/icons/flag'
// // 或者在不关心打包体积时一次引入全部图标
// // import 'vue-awesome/icons'
// import 'vue-awesome/beer'
// /* 任选一种注册组件的方式 */
// import Icon from 'vue-awesome/components/Icon'
// // 全局注册（在 `main .js` 文件中）
// Vue.component('v-icon', Icon)


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
