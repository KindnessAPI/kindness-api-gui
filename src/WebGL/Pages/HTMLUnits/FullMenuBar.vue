<template>
  <div class="h-full w-full absolute top-0 left-0 z-10">
    <ScissorArea class="full">
      <div slot="dom">
        <div class="flex w-full justify-between items-center mx-auto max-w-6xl">
          <div class="text-4xl text-black p-3 cursor-pointer">
            KindnessAPI
          </div>
          <div class="inline-block mr-6 cursor-pointer">
            <img @click="$emit('close')" src="../icon/close.svg" alt="">
          </div>
        </div>
        <div class="mx-auto max-w-6xl">
          <div class="mb-3 px-3 text-black text-2xl" v-if="Auth.currentProfile">
            Welcome back! @{{ Auth.currentProfile.user.username }}
          </div>
          <div class="mb-3 px-3 text-black text-2xl">
            <router-link exact-active-class="underline" to="/">Home Page</router-link>
          </div>
          <div class="mb-3 px-3 text-black text-2xl" v-if="Auth.currentProfile">
            <router-link exact-active-class="underline" to="/dashboard">Dashboard</router-link>
          </div>
          <div class="mb-3 px-3 text-black text-2xl" v-if="!Auth.isLoggedIn">
            <router-link exact-active-class="underline" class="block mb-3 hover:opacity-50" to="/login">Login</router-link>
            <router-link exact-active-class="underline" class="block mb-3 hover:opacity-50" to="/register">Register</router-link>
          </div>
          <div class="mb-3 px-3 text-black text-2xl" v-if="Auth.isLoggedIn">
            <router-link exact-active-class="underline" class="block mb-3 hover:opacity-50" to="/login">Login more accounts</router-link>
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
