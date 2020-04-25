import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/lok',
      component: () => import('./WebGL/Pages/Lok.vue')
    },
    {
      path: '/',
      component: () => import('./WebGL/Pages/Home.vue')
    },
    {
      path: '/kindness-river',
      component: () => import('./WebGL/Pages/KindnessRiver.vue')
    },
    {
      path: '/thank-you-gospel',
      component: () => import('./WebGL/Pages/StoryOfLok.vue')
    },
    {
      path: '/work-in-progress',
      component: () => import('./WebGL/Pages/PlaceHolder.vue')
    },
    {
      path: '/church',
      component: () => import('./WebGL/Pages/Church.vue')
    },
    {
      path: '/developers',
      component: () => import('./WebGL/Pages/PlaceHolder.vue')
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
      path: '/switch-profiles',
      component: () => import('./WebGL/Pages/SwitchProfiles.vue')
    },
    {
      path: '/dashboard',
      component: () => import('./WebGL/Pages/Dashboard.vue')
    }
    // {
    //   path: '/*',
    //   redirect: '/'
    // }
  ]
})
