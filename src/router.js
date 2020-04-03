import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('./WebGL/Pages/Home.vue')
    },
    {
      path: '/2',
      component: () => import('./WebGL/Pages/Lok.vue')
    }
  ]
})
