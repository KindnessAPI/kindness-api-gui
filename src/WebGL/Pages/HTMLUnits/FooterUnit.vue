<template>
  <div class="">

    <div class="flex flex-col lg:flex-row">

      <div class="lg:w-1/2 relative lg:order-2">
        <ScissorArea class="lg:absolute top-0 left-0 right-0 bottom-0 h-min100 lg:h-auto" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <FooterScene slot="o3d"></FooterScene>
        </ScissorArea>
        <!--  -->
      </div>
      <div class="lg:w-1/2 relative">
        <!-- <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <HowScene slot="o3d"></HowScene>
        </ScissorArea> -->

        <div class="px-3 max-w-xl mx-auto  py-12 lg:py-32 xl:py-min30">
          <div class="px-3 mb-3 text-3xl md:text-4xl font-bold">
            Kindness API ✨
          </div>

          <div class="px-3 mb-3">
            1. Distribute Kindness Content with APIs
          </div>

          <div class="px-3 mb-3">
            2. Fostering International Friendship
          </div>

          <div class="px-3 mb-3">
            Made with love by
            <router-link class="font-bold underline inline-block" to="/thank-you-gospel">@wonglok831</router-link> 🥰
          </div>
          <div class="px-3 mb-3">
            Honouring Dear God's and Dear Jesus' Grace and Mercy.
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
