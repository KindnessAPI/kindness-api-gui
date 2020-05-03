<template>
  <div class="">

    <div class="flex flex-col lg:flex-row">

      <div class="lg:w-1/2 relative">
        <ScissorArea class="lg:absolute top-0 left-0 right-0 bottom-0 h-min100 lg:h-auto" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <StarFlowScene slot="o3d"></StarFlowScene>
        </ScissorArea>
        <!--  -->
      </div>
      <div class="lg:w-1/2 relative">

        <!--
        <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <HowScene slot="o3d"></HowScene>
        </ScissorArea>
        -->

        <div class="px-3 max-w-xl mx-auto  py-24 lg:py-32 xl:py-64">
          <div class="px-3 mb-3 text-3xl md:text-4xl font-bold">
            Traverse the Galaxy
          </div>
          <div class="px-3 mb-3">
            This website has a cosmic theme, spaceship and futuristic look. You can decorate your own star/planet within the space. You can also add lines to connect with each other 🙂 I call it love lines. 🥰
          </div>
          <div class="px-3 mb-3">
            You an traverse the galaxy by the love lines. ❤️
          </div>
          <div class="px-3 mb-3">
            You can spread kindness and send content using your love lines and your friends can choose to spread it further or not.
          </div>
        </div>
      </div>
    </div>

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
