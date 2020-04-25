<template>
  <div class="">

    <div class="flex flex-col lg:flex-row">

      <div class="lg:w-1/2 relative">
        <ScissorArea class="lg:absolute top-0 left-0 right-0 bottom-0 h-min100 lg:h-auto" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <HeroScene slot="o3d"></HeroScene>
        </ScissorArea>
        <!--  -->
      </div>
      <div class="lg:w-1/2 relative">
        <!-- <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <HowScene slot="o3d"></HowScene>
        </ScissorArea> -->

        <div class="px-3 max-w-xl mx-auto  py-12 lg:py-32 xl:py-64">
          <div class="px-3 mb-2 text-3xl md:text-4xl font-bold">
            KindnessAPI ✨
          </div>

          <div class="px-3 mb-3">
            KindnessAPI is a Digital Christian Church.
            It's a place for 💁🏼‍♂️ YOU 💁🏼‍♀️ to share your Kindness, God's Grace and Testimonals with others. 📲
          </div>
          <div class="px-3 text-lg pb-3 mb-10" v-if="$route.fullPath === '/'">
            <router-link class="font-bold underline inline-block mr-2" to="/church">Go to Church...</router-link>
          </div>

          <div class="px-3 mb-3">
            If you're a 👩🏻‍💻 developer 👨🏼‍💻 , we also have an API for you to spread Kindness and Gospel to a much wider audience.
          </div>
          <div class="px-3 text-lg pb-3 " v-if="$route.fullPath === '/'">
            <router-link class="font-bold underline inline-block mr-2" to="/developers">Developers Page...</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- -->

  </div>
</template>

<script>
export default {
  components: {
    ...require('../../webgl').default
  }
}
</script>

<style scoped>
</style>
