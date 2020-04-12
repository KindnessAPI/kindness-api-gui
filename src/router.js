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
      path: '/login',
      component: () => import('./WebGL/Pages/Login.vue')
    },
    {
      path: '/register',
      component: () => import('./WebGL/Pages/Register.vue')
    },
    {
      path: '/logout',
      component: () => import('./WebGL/Pages/Logout.vue')
    },
    {
      path: '/dashboard',
      component: () => import('./WebGL/Pages/Dashboard.vue')
    },
    {
      path: '/*',
      redirect: '/'
    }
  ]
})
