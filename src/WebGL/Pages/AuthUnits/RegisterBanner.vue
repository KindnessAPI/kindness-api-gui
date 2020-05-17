<template>
  <div class="stickybanner p-4 flex justify-center border-gray-400 border-t">
    <div class="flex justify-between items-center w-full">
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
  </div>
</template>

<script>
export default {
  methods: {
    close () {
      this.$el.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.stickybanner{
  position: sticky;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background-color: rgba(255,255,255,0.95);
  -webkit-backdrop-filter: blur(20px);
}
</style>
