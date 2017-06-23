// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'   //先安装
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick' //先安装
import VueLazyLoad from 'vue-lazyload'//先安装
import store from './store'
Vue.config.productionTip = false
// 也可以在APP.vue里引入
 import './common/css/index.css'
//项目开始在package.json里添加3个依赖
// devDependencies:
// "babel-polyfill": "^6.2.0",
// dependencies:
// "babel-runtime": "^6.0.0",
// "fastclick": "^1.0.6"

fastclick.attach(document.body)

Vue.use(VueLazyLoad,{
  loading:require('common/image/default.png')  //图片渲染前默认的图片地址
})

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
