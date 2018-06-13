import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index/lexicalanalysis',
      component: resolve => require(['../components/page/LexicalAnalysis.vue'], resolve)
    },
    {
      path: '/index/aaa',
      component: resolve => require(['../components/page/AAA.vue'], resolve)
    },
    {
      path: '/index/Token',
      component: resolve => require(['../components/page/Token.vue'], resolve)
    }
  ]
})
