import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree,handleTree2 } from "@/utils/ruoyi";

import { deepClone,clearNullParam,isJurisdiction ,moneyFormat,isProjectByUser,date2Number,addClass,addClassName,autoFixed,formatAmount,class2color} from "@/utils/index";

// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'

// 文件导入组件 
import BaseUpload from '@/components/BaseUpload'

import '@/assets/css/component.css'
import Moment from 'moment'



import sinopharm from 'sinopharm';
import 'sinopharm/dist/index.scss' ;
Vue.use( sinopharm ) ;


// 全局方法挂载
Vue.prototype.autoFixed = autoFixed
Vue.prototype.addClassName = addClassName
Vue.prototype.addClass = addClass
Vue.prototype.date2Number = date2Number
Vue.prototype.isJurisdiction = isJurisdiction
Vue.prototype.moneyFormat=moneyFormat
Vue.prototype.formatAmount=formatAmount
Vue.prototype.isProjectByUser = isProjectByUser
Vue.prototype.clearNullParam = clearNullParam
Vue.prototype.deepClone = deepClone
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.handleTree2 = handleTree2 
Vue.prototype.class2color = class2color 
Vue.prototype.monent = Moment

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)
Vue.component('BaseUpload', BaseUpload)


Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

import  filters from './utils/filters.js'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
	// Object.keys(filters)得到的就是filters.js里面的函数名组成的数组 ['currency'] 因为这里filters.js里面就一个函数所以数组里就只有一个值
	//filterName 就是通过遍历['currency'] 得到的就是filters.js中的每一个函数名(过滤器名字)
	//filters[filterName])出发./filter/filters中的某个函数
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false
// 路由守卫 
// var flag; // 首先定义一个开关
// router.beforeEach((to, from, next) => {
  
//     if (to.path == '/projectManager/proDetails/') { // 当进入这个页面进行记录  || to.path == 'projectManager/projectTeam'
//         flag = true; // 改变信号
//         next();
//     } else {
//         if (flag) { // 如果路由发生变化判断信号
//             Vue.prototype.$confirm('离开当前页面，您修改的数据将丢失?', '提示', {
//                 confirmButtonText: '确定离开？',
//                 cancelButtonText: '取消',
//                 type: 'warning'
//             }).then(() => {
//               // 此处 触发当前页面的 提交审批的方法
//               // this.goAuditHandel()
//               Vue.prototype.$message.success("goAuditHandel")
//                 next()
//                 flag = false;
//             }).catch(()=>{
//               Vue.prototype.$message.success("cancel")
//             })
//         } else {
//             next()
//         }
//     }
// });
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

