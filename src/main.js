// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VIS from 'vis'
import axios from 'axios'

Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.use(VIS)

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App) /* components: { App } */
}).$mount('#app')
