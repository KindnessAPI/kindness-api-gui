<template>
  <ScissorArea>
    <div slot="dom">
      <div class="flex w-full justify-between items-center px-3">
        <div class="block lg:w-1/3">
          <div class="text-2xl text-black py-3">
            <router-link to="/" class="cursor-pointer">
              TogetherTime.me ✞
            </router-link>
          </div>
        </div>
        <div class="lg:w-1/3 hidden lg:flex justify-center text-2xl">

        </div>
        <div class="lg:w-1/3 flex justify-end">
          <div class="hidden md:inline-flex">
            <!-- <div class="text-2xl text-black p-3" @click="$router.push('/dash')">
              Love Work in Progress
            </div> -->
            <router-link v-if="!Auth.isLoggedIn" exact-active-class="underline" class="cursor-pointer text-xl text-black my-2 mr-3" to="/login">Login</router-link>
            <router-link v-if="!Auth.isLoggedIn" exact-active-class="cursor-pointer underline" class="cursor-pointer text-xl text-black my-2 mr-3" to="/register">Register</router-link>
            <!-- <router-link v-if="Auth.isLoggedIn" class="cursor-pointer text-xl text-black my-2 mr-3" :to="`/profile/${Auth.currentProfile.user.username}/${Auth.currentProfile.user.userID}`">@{{ Auth.currentProfile.user.username }}</router-link> -->
          </div>
          <div class="inline-block mr-3"><slot name="bell"></slot></div>

          <router-link to="/galaxy" class="inline-flex md:hidden ml-3 mr-3" v-if="$route.path.indexOf('/profile') === -1">
            <span class="inline-block md:hidden py-2 text-2xl">😎</span>
          </router-link>

          <img @click="$emit('menu')" style="min-width:24px;" class="mr-3 cursor-pointer" src="../icon/menu.svg" alt="">
        </div>
      </div>
      <!-- <TopNavBar @open="openMenu = true" @close="openMenu = false" @menu="openMenu = !openMenu"></TopNavBar> -->
    </div>
    <PhantomScene v-if="!nogl" slot="o3d"></PhantomScene>
  </ScissorArea>
</template>

<script>
import { Auth } from '../../../APIs/KA'

export default {
  props: {
    nogl: {
      default: false
    }
  },
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
