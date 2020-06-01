<template>
  <aside class="relative bg-sidebar h-dashminus-toobar w-64 hidden sm:block shadow-xl relative">
    <ScissorArea class="absolute top-0 left-0 right-0 bottom-0 h-full w-full" style="z-index: -1;">
      <div slot="dom" class="full">
      </div>
      <!-- <StarFlowScene slot="o3d"></StarFlowScene> -->
      <RiverFieldScene slot="o3d"></RiverFieldScene>
      <!-- <DashboardScene slot="o3d"></DashboardScene> -->
    </ScissorArea>

    <div class="p-6">
      <router-link to="/galaxy" class="text-white text-2xl hover:text-gray-300 w-full inline-block text-center border-white border p-3 rounded-full hover:bg-gray-800">My Home</router-link>
      <!-- <router-link exact-active-class="active" to="/dashboard">
        <button class="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
          Kindness Central
        </button>
      </router-link> -->

      <router-link exact-active-class="active" to="/dashboard/quote-cards">
        <button class="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
          Quote Cards
        </button>
      </router-link>

      <!-- <router-link exact-active-class="active" to="/dashboard/poster-video">
        <button class="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
          Poster Video
        </button>
      </router-link>

      <router-link exact-active-class="active" to="/dashboard/poster-images">
        <button class="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
          Poster Images
        </button>
      </router-link>

      <router-link exact-active-class="active" to="/dashboard/video-messages">
        <button class="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 flex items-center justify-center">
          Video Messages
        </button>
      </router-link> -->
    </div>

  </aside>
</template>

<script>
export default {
  components: {
    ...require('../../../webgl').default
  }
}
</script>

<style>
.h-dashminus-toobar{
  height: calc(100%);
}
</style>
