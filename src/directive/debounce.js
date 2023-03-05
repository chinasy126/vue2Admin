const debounce = {}
debounce.install = Vue => {

  // const timeoutDelay = delay || 50000
  // var timer = null
  // return function() {
  //   if (timer) {
  //     clearTimeout(timer)
  //   }
  //   timer = setTimeout(() => {
  //     timer = null
  //     fn()
  //   }, timeoutDelay)
  // }

  Vue.directive('debounce', {
    inserted(el, binding, vnode) {
      let timer
      el.addEventListener('click', () => {
        if (timer) {
          clearTimeout(timer)
        }
        el.classList.add('is-disabled')
        timer = setTimeout(() => {
          el.classList.remove('is-disabled')
          timer = null
          binding.value.fn()
        }, binding.value.time || 500)
      })
    }
    // unbind(el) {
    //   el.removeEventListener('click')
    // }
  })
}

export default debounce
