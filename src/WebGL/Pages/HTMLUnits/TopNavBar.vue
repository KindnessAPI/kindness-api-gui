<template>
  <ScissorArea>
    <div slot="dom">
      <div class="flex w-full justify-between items-center mx-auto max-w-6xl">
        <router-link to="/">
          <div class="text-4xl text-black p-3 cursor-pointer">
            KindnessAPI
          </div>
        </router-link>
        <div class="mr-6 flex cursor-pointer">
          <div class="hidden md:inline-flex">
            <!-- <div class="text-2xl text-black p-3" @click="$router.push('/dash')">
              Love Work in Progress
            </div> -->
            <router-link v-if="!Auth.isLoggedIn" exact-active-class="underline" class="text-xl text-black py-2 pr-3" to="/login">Login</router-link>
            <router-link v-if="!Auth.isLoggedIn" exact-active-class="underline" class="text-xl text-black py-2 pr-3" to="/register">Register</router-link>
            <router-link v-if="Auth.isLoggedIn" exact-active-class="underline" class="text-xl text-black py-2 pr-3" to="/dashboard">Dashboard</router-link>
          </div>
          <img @click="$emit('menu')" src="../icon/menu.svg" alt="">
        </div>
      </div>
      <!-- <TopNavBar @open="openMenu = true" @close="openMenu = false" @menu="openMenu = !openMenu"></TopNavBar> -->
    </div>
    <PhantomScene slot="o3d"></PhantomScene>
  </ScissorArea>
</template>

<script>
import { Auth } from '../../../APIs/KA'
export default {
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      Auth,
      Store: Auth.Store
    }
  }
}
</script>

<style>

</style>
