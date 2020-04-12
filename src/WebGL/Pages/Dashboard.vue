<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{ zIndex: -1 }" ref="mounter"></div>

    <div v-show="!openMenu">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>
      <div class="" v-if="Auth.isLoggedIn">
        <div class="">
          @{{ Auth.currentProfile.user.username }}
        </div>
        <li :key="profile.user.userID" v-for="profile in Auth.profiles" class=" list-none mb-2">
          @{{ profile.user.username }}
          <button class="px-3 py-2 bg-blue-300 border-blue-400 text-white shadow-lg rounded-lg hover:opacity-50" @click="setActiveUID(profile.user.userID)">Use this account</button>
        </li>
      </div>

    </div>
    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
  </div>
</template>

<script>
import { PipeScissor, makeScrollBox } from '../Reusable'
// import axios from 'axios'
import { Auth } from '../../APIs/KA'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
      Auth,
      Store: Auth.Store,
      openMenu: false,
      origColor: '',
      bgColor: '#fafafa'
    }
  },
  mounted () {
    this.$watch('openMenu', () => {
      window.dispatchEvent(new Event('resize'))
    })
    this.scrollBox = makeScrollBox({ dom: window, base: this.base })

    // let axios = require('axios').default
    // axios.post('http://localhost:3333/login', {
    //   username: 'lok',
    //   email: 'lok@lok.com',
    //   password: 'loklok-test'
    // })
    //   .then(r => r.data)
    //   .then(console.log)

    this.origColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = this.bgColor
  },
  beforeDestroy () {
    document.body.style.backgroundColor = this.origColor
  },
  methods: {
    setActiveUID (uid) {
      Auth.setActiveProfileByUserID(uid)
      window.location.reload()
    }
  }
}
</script>

<style scoped>
</style>
