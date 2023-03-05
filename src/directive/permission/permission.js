import Vue from 'vue'

/**
 * 检验按钮权限
 * @param el
 * @param binding
 * @param vnode
 */
function checkPermission(el, binding, vnode) {
  const { value } = binding
  const roles = vnode.context.$route.meta.btnPermissions || []
  if (value && value instanceof Array && value.length !== 0) {
    const hasPermission = roles.some(role => {
      return value.includes(role.type)
    })
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

export default {
  inserted(el, binding, vnode) {
    checkPermission(el, binding, vnode)
  },
  updated(el, binding, vnode) {
    checkPermission(el, binding, vnode)
  }
}
