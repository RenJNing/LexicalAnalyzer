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
      path: '/index',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      redirect: '/index/lexical-analysis',
      children: [
        {
          path: '/index/main-interface',
          component: resolve => require(['../components/page/mainInterface.vue'], resolve),
        },
        {
          path: '/index/lexical-analysis',
          component: resolve => require(['../components/page/lexicalAnalysis1.vue'], resolve),
        },
        {
          path: '/index/lexical-analysis1',
          component: resolve => require(['../components/page/Test.vue'], resolve),
        },
      ]
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
