import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/index',
      component:resolve=>require(['../components/Home.vue'],resolve)
    },
    {
      path: '/',
      redirect: '/index/lexicalanalysis'
    },
    {
      path: '/index/lexicalanalysis',
      component: resolve => require(['../components/page/LexicalAnalysis.vue'], resolve)
    },
    {
      path: '/index/nnn',
      component: resolve => require(['../components/page/Test.vue'], resolve)
    },
    {
      path: '/index/nfatoken',
      component: resolve => require(['../components/page/NFAToken.vue'], resolve)
    }
  ]
})
