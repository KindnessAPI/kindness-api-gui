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
    }
    // {
    //   path: '/tailwind',
    //   component: () => import(/* webpackChunkName: "landing" */ './v0-app/pages/Home.vue')
    // },
    // {
    //   path: '/',
    //   component: () => import(/* webpackChunkName: "landing" */ './v0-app/pages/Home.vue')
    // },
    // {
    //   path: '/geo',
    //   redirect: '/flower'
    // },
    // {
    //   path: '/flower',
    //   component: () => import(/* webpackChunkName: "landing" */ './v0-app/graphics/GeoShade.vue')
    // },
    // {
    //   path: '/emoji',
    //   component: () => import(/* webpackChunkName: "landing" */ './v0-app/graphics/Viewer.vue')
    // }
  ]
})
