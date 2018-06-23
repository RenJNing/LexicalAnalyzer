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
          component: resolve => require(['../components/page/lexicalAnalysis.vue'], resolve),
        },
        {
          path: '/index/lexical-analysis1',
          component: resolve => require(['../components/page/lexicalAnalysis_beta.vue'], resolve),
        }
      ]
    }
  ]
})
