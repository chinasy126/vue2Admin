import permission from '@/directive/permission/permission'
import Vue from 'vue'

const install = function(Vue) {
  Vue.directive('permission', permission)
}

if (window.Vue) {
  window['permission'] = permission
  Vue.use(install)
}

permission.install = install
export default permission
