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
            Happiness Research Facility
          </div>
          <div class="px-3 mb-3">
            What it means to be happy again?
          </div>
          <div class="px-3 mb-3">
            For me it's Fostering International Friendship and Intentionally think about ways to be happier for one another. 🥰
          </div>
          <div class="px-3 mb-3">
            Make International Friends = the World Peace.
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
