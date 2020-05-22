<template>
  <div class="">
    <div class="taller"></div>
    <div class="fixedbanner p-4 flex justify-center border-gray-400 border-t">
      <div class="flex justify-between items-center w-full" v-if="!me">
        <div class="w-1/5">
        </div>
        <div class="w-3/5 flex justify-center">
          <router-link to="/login" class="inline-block rounded-full px-5 py-2 m-2 bg-blue-300">Login</router-link>
          <router-link to="/register" class="inline-block rounded-full px-5 py-2 m-2 bg-blue-600 text-white">Register</router-link>
        </div>
        <div class="w-1/5 flex justify-end">
          <img src="./icon/close.svg" @click="close" class="cursor-pointer" alt="">
        </div>
      </div>
      <div class="flex justify-between items-center w-full" v-else-if="me">
        <div class="w-1/5">
        </div>
        <div class="w-3/5 flex justify-center">
          <router-link to="/galaxy" class="inline-block rounded-full px-5 py-2 m-2 bg-blue-600 text-white text-center">Welcome Back! @{{ me.username }}</router-link>
        </div>
        <div class="w-1/5 flex justify-end">
          <img src="./icon/close.svg" @click="close" class="cursor-pointer" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from '../../../APIs/KA'

export default {
  data () {
    return {
      me: Auth.currentProfile && Auth.currentProfile.user
    }
  },
  methods: {
    close () {
      this.$el.style.display = 'none'
    }
  }
}
</script>

<style scoped lang="postcss">
.fixedbanner{
  position: fixed;
  bottom: 0px;
  left: 0px;
  height: 89px;
  width: 100%;
  background-color: rgba(255,255,255,0.95);
}
.taller{
  height: 89px;
}
</style>
