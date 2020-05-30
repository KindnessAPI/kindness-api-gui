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
      beforeEnter: async (to, from, next) => {
        let KA = await import('./APIs/KA')
        let Auth = KA.Auth
        if (Auth.isLoggedIn) {
          let { username, userID } = Auth.currentProfile.user
          next(`/profile/${username}/${userID}`)
        } else {
          next('/login?redirect=' + encodeURIComponent(to.path))
        }
      }
    },
    {
      path: '/profile/:username/:userID',
      beforeEnter: loginGate,
      component: () => import('./WebGL/Pages/ProfilePage.vue')
    },
    {
      path: '/dashboard',
      beforeEnter: loginGate,
      children: [
        {
          path: '',
          redirect: '/dashboard/quote-cards'
        },
        {
          path: 'quote-cards',
          component: () => import('./WebGL/Pages/AppUnits/Content/CTQuoteCards.vue')
        },
        {
          path: 'poster-video',
          component: () => import('./WebGL/Pages/AppUnits/Content/CTPosterVideo.vue')
        },
        {
          path: 'poster-images',
          component: () => import('./WebGL/Pages/AppUnits/Content/CTPosterImages.vue')
        },
        {
          path: 'video-messages',
          component: () => import('./WebGL/Pages/AppUnits/Content/CTVideoMessages.vue')
        }
      ],
      component: () => import('./WebGL/Pages/AppUnits/Content/CTLayoutUnit.vue')
    },
    {
      path: '/my-photos',
      beforeEnter: loginGate,
      component: () => import('./WebGL/Pages/AppResuables/GEImageManager.vue')
    },
    {
      path: '/prayer-room',
      beforeEnter: loginGate,
      component: () => import('./WebGL/Pages/PrayerRoomPage.vue')
    },
    {
      path: '/chat-room',
      beforeEnter: loginGate,
      component: () => import('./WebGL/Pages/ChatRoomPage.vue')
    },
    {
      path: '/thank-you-gospel',
      component: () => import('./WebGL/Pages/StoryOfLok.vue')
    },
    {
      path: '/prayer-room-intro',
      component: () => import('./WebGL/Pages/PrayerRoomIntro.vue')
    },
    {
      path: '/make-friends-intro',
      component: () => import('./WebGL/Pages/MakeFriendsIntroPage.vue')
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
