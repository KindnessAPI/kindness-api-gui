<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{ zIndex: -1 }" ref="mounter"></div>

    <div v-show="!openMenu">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>
      <div class=" max-w-6xl mx-auto pt-12">
        <div v-if="Auth.profiles.length === 0">
          <div class="px-3 text-center">
            All profiles are logged out.
          </div>
          <div class="px-3 text-center">
            Go to
            <router-link class="underline cursor-pointer" to="/register">register</router-link> /
            <router-link class="underline cursor-pointer" to="/login">login</router-link> /
            <router-link class="underline cursor-pointer" to="/">home</router-link>.
          </div>
        </div>

        <div class="px-3 text-center" v-if="Auth.profiles.length > 0">
          <div class="px-3 text-center text-2xl" v-if="Auth.profiles.length === 1">
            You're logged in as:
          </div>
          <div class="px-3 text-center text-2xl" v-if="Auth.profiles.length > 1">
            Here are the profiles you logged in:
          </div>
          <ul>
            <li :key="profile.user.userID" v-for="profile in Auth.profiles" class=" mb-2">
              @{{ profile.user.username }}
              <button class="px-3 py-2 bg-blue-300 border-blue-400 text-white shadow-lg rounded-lg hover:opacity-50" @click="Auth.removeProfileByUserID(profile.user.userID)">Logout</button>
            </li>
          </ul>
        </div>
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
  }
}
</script>

<style scoped>
</style>
