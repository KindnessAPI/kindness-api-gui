import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'

Vue.use(Router)

let loginGate = async (to, from, next) => {
  let KA = await import('./APIs/KA')
  let Auth = KA.Auth
  if (Auth.isLoggedIn) {
    next()
  } else {
    next('/login?redirect=' + encodeURIComponent(to.path))
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('./WebGL/Pages/HomePage.vue')
    },
    {
      path: '/kindness-river',
      component: () => import('./WebGL/Pages/KindnessRiver.vue')
    },
    {
      path: '/heart',
      component: () => import('./WebGL/Pages/HeartGridPage.vue')
    },
    {
      path: '/galaxy',
      beforeEnter: loginGate,
      component: () => import('./WebGL/Pages/TraverseGalaxyPage.vue')
    },
    {
      path: '/prayer-room',
      beforeEnter: loginGate,
      component: () => import('./WebGL/Pages/PrayerRoomPage.vue')
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
      component: () => import('./WebGL/Pages/ChurchPage.vue')
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
      beforeEnter: loginGate,
      component: () => import('./WebGL/Pages/Dashboard.vue')
    }
    // {
    //   path: '/*',
    //   redirect: '/'
    // }
  ]
})
