<template>
  <div class="w-full h-minus-navbar-height">

    <div class="w-full h-full flex flex-col lg:flex-row">

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

        <div class="px-3 max-w-xl mx-auto  py-24 lg:py-32 xl:py-64">
          <div class="px-3 mb-3 text-3xl md:text-4xl font-bold">
            TogetherTime.me ✞ ✨
          </div>

          <div class="px-3 mb-3">
            Hi! I'm <a target="_blank" href="https://www.instagram.com/wonglok831/">@wonglok831 ↗</a>.
          </div>

          <div class="px-3 mb-3">
            1. <router-link class="font-bold underline inline-block" to="/prayer-room-intro">Share your Prayer / Story</router-link>
          </div>

          <div class="px-3 mb-3">
            2. <router-link class="font-bold underline inline-block" to="/make-friends-intro">Fostering International Friendship</router-link>
          </div>

          <div class="px-3 mb-3">
            3. <router-link class="font-bold underline inline-block" to="/thank-you-gospel">My testimonal and personal story</router-link> 🥰
          </div>

          <div class="px-3 mb-3">
            I made this place to praise Dear God's and Dear Jesus' Grace and Mercy.
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

.h-minus-navbar-height{
  min-height: calc(100% - 60px);
}

</style>
