import Vue from 'vue'
import router from '../router'
import $ from 'jquery'
const hash = location.hash.slice(1)
const routerlist = router.options.routes
Vue.directive('permission', {
  bind: function (el, binding) {
    let permissionKey = binding.value
    let resultRouter = routerlist.filter(item => {
      if (item.path === '/' || item.path === '/*') {
        return false
      }
      return new RegExp(item.path).test(hash)
    })
    let children = resultRouter[0].children
    children.map(item => {
      if (item.path === hash && item.meta.roles && isSet(item.meta.roles, permissionKey)) {
        if (!item.meta.roles[permissionKey]) {
          el.remove()
        }
      }
    })
  }
})

Vue.directive('dragWidth', {
  inserted (el, binding, vnode, oldVnode) {
    let dialogHeaderEl = el
    let dragDom = $('.' + binding.value.el)
    let disX = 0
    // 获取到的值带px 正则匹配替换
    let styL = 0
    dialogHeaderEl.style.cursor = 'w-resize'

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      disX = e.clientX
      styL = parseFloat(dragDom.width())
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let l = e.clientX - disX
        // 移动当前元素
        dragDom.width(l + styL)
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }  
  }
})

function isSet (obj, key) {
  for (let i in obj) {
    if (i === key) {
      return true
    }
  }
  return false
}
