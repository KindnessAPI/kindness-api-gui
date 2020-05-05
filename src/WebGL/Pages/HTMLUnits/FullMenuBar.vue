<template>
  <div class="h-full w-full absolute top-0 left-0 z-10">
    <ScissorArea class="full">
      <div slot="dom">
        <div class="flex w-full justify-between items-center px-3">
          <div class="text-2xl text-black py-3 cursor-pointer">
            TogetherTime.me
          </div>
          <div class="inline-block mr-3 cursor-pointer">
            <img @click="$emit('close')" src="../icon/close.svg" alt="">
          </div>
        </div>
        <div class="mx-auto px-3 mt-3">
          <div class="mb-3 px-3 text-black text-xl" v-if="Auth.currentProfile">
            Welcome back, @{{ Auth.currentProfile.user.username }}!
          </div>
          <div class="mb-3 px-3 text-black text-xl">
            <router-link exact-active-class="underline" to="/">Home Page</router-link>
          </div>
          <div class="mb-3 px-3 text-black text-xl" v-if="Auth.currentProfile">
            <router-link exact-active-class="underline" to="/galaxy">Traverse the Galaxy</router-link>
          </div>
          <div class="mb-3 px-3 text-black text-xl" v-if="Auth.currentProfile">
            <router-link exact-active-class="underline" to="/dashboard">Dashboard</router-link>
          </div>
          <div class="mb-3 px-3 text-black text-xl" v-if="!Auth.isLoggedIn">
            <router-link exact-active-class="underline" class="block mb-3 hover:opacity-50" to="/login">Login</router-link>
            <router-link exact-active-class="underline" class="block mb-3 hover:opacity-50" to="/register">Register</router-link>
          </div>
          <div class="mb-3 px-3 text-black text-xl" v-if="Auth.isLoggedIn">
            <router-link exact-active-class="underline" class="block mb-3 hover:opacity-50" to="/login">Login More Accounts</router-link>
            <router-link exact-active-class="underline" class="block mb-3 hover:opacity-50" to="/switch-profiles">Switch Accounts</router-link>
            <router-link exact-active-class="underline" class="block mb-3 hover:opacity-50" to="/logout">Logout</router-link>
          </div>
        </div>
      </div>
      <PhantomScene slot="o3d"></PhantomScene>
    </ScissorArea>
  </div>
</template>

<script>
import { Auth } from '../../../APIs/KA.js'
export default {
  props: {
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      Auth
    }
  },
  methods: {
    auth () {

    }
  }
}
</script>

<style>

</style>
