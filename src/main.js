import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import VueI8n from 'vue-i18n'

// 引入echarts
import echarts from 'echarts'
Vue.use(echarts)

import 'babel-polyfill'

import './assets/styles/element-variables.scss'

import './assets/styles/index.scss'

import './bpa/assets/styles/index.scss'

import '../public/css/theme/red/index.css'
import '../public/css/theme/orange/index.css'
import '../public/css/theme/purple/index.css'

import './assets/styles/theme/red.scss'
import './assets/styles/theme/orange.scss'
import './assets/styles/theme/purple.scss'
// 导入阿里矢量图标
import './assets/font1/iconfont.css'
import 'font-awesome/css/font-awesome.css'
import LoadingMixin from './mixins/loading_mixin'
import filter from './filters'
import BasComponent from 'bas-component'
import 'bas-component/lib/BasComponent.css'
// wn 国际化加入elementui组件
import enLocale from 'element-ui/lib/locale/lang/en' // 英语
import zhLocale from 'element-ui/lib/locale/lang/zh-CN' // 简体中文
import twLocale from 'element-ui/lib/locale/lang/zh-TW' // 繁体中文
import deLocale from 'element-ui/lib/locale/lang/de' // 德语
import jaLocale from 'element-ui/lib/locale/lang/ja' // 日语
import itLocale from 'element-ui/lib/locale/lang/it' // 意大利语
import './utils/utils'
import { fetch } from './bpm/utils/fetch'
import Vue2OrgTree from 'vue-tree-color'

// 注册vue-print-nb
import Print from 'vue-print-nb'
Vue.use(Print);

Vue.use(Vue2OrgTree)
Vue.prototype.$http = fetch
Vue.prototype.$host =
  process.env.VUE_APP_BPA_HOST_URL + process.env.VUE_APP_BPA_BASE_URL
Vue.prototype.$VUE_APP_BPA_URL = process.env.VUE_APP_BPA_URL
// Vue.use(Element, { size: 'mini', zIndex: 3000 })
// 修改 el-dialog 默认点击遮照为不关闭
Element.Dialog.props.closeOnClickModal.default = false
Vue.use(BasComponent)
// if (process.env.NODE_ENV === 'development') {
//   const BasComponentDev = require('../node_modules/bas-component-dev/lib/BasComponent.umd.min.js').default
//   Vue.use(BasComponentDev)
// }

Vue.mixin(LoadingMixin)

Object.keys(filter).forEach(k => Vue.filter(k, filter[k]))
Vue.config.productionTip = false
// if (process.env.NODE_ENV === 'development') {
//   const BasComponentDev = require('../node_modules/bas-component-dev/lib/BasComponent.umd.min.js').default
//   Vue.use(BasComponentDev)
// }
// bpa部分
import localComponents from './bpa/components'
import filters from './bpa/filters'
Vue.use(localComponents)
Vue.use(filters)
Vue.use(VueI8n)

// bam
import SortButton from './bpm/components/sortbutton/SortButton'
import bpmfilter from './bpm/filters'
import draggable from 'vuedraggable'
Vue.component('SortButton', SortButton)
Vue.component('draggable', draggable)
Object.keys(bpmfilter).forEach(k => Vue.filter(k, bpmfilter[k]))

// 国际化
window.Vue = Vue
const language = localStorage.getItem('language')
const i18n = new VueI8n({
  locale: language || 'cn',
  messages: {
    cn: Object.assign(require('@/assets/i18n-locales/cn.js'), zhLocale),
    en: Object.assign(require('@/assets/i18n-locales/en.js'), enLocale),
    de: Object.assign(require('@/assets/i18n-locales/de.js'), deLocale),
    ja: Object.assign(require('@/assets/i18n-locales/ja.js'), jaLocale),
    tw: Object.assign(require('@/assets/i18n-locales/tw.js'), twLocale),
    it: Object.assign(require('@/assets/i18n-locales/it.js'), itLocale)
  }
})
// wn 注册i18n
Vue.use(Element, {
  size: 'mini',
  zIndex: 3000,
  i18n: (key, value) => i18n.t(key, value)
})

/* eslint-disable no-new */
export default new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
