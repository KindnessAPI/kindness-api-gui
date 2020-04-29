<template>
  <ScissorArea>
    <div slot="dom">
      <div class="flex w-full justify-between items-center px-3">
        <router-link class="block lg:w-1/3" to="/">
          <div class="text-2xl text-black p-3 cursor-pointer">
            ✞ My Christian Church
          </div>
        </router-link>
        <div class="lg:w-1/3 hidden lg:flex justify-center text-2xl">

        </div>
        <div class="lg:w-1/3 flex justify-end cursor-pointer">
          <div class="hidden md:inline-flex">
            <!-- <div class="text-2xl text-black p-3" @click="$router.push('/dash')">
              Love Work in Progress
            </div> -->
            <router-link v-if="!Auth.isLoggedIn" exact-active-class="underline" class="text-xl text-black py-2 pr-3" to="/login">Login</router-link>
            <router-link v-if="!Auth.isLoggedIn" exact-active-class="underline" class="text-xl text-black py-2 pr-3" to="/register">Register</router-link>
            <router-link v-if="Auth.isLoggedIn" exact-active-class="underline" class="text-xl text-black py-2 pr-3" to="/dashboard">Dashboard</router-link>
          </div>

          <img @click="$emit('menu')" style="min-width:24px;" class="mr-6" src="../icon/menu.svg" alt="">
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
