<template>
  <div class="">

    <div class="h-full w-full flex flex-col lg:flex-row">

      <div class="lg:w-1/2 relative bg-space">
        <!-- <ScissorArea class="lg:absolute top-0 left-0 right-0 bottom-0 h-min100 lg:h-auto" style="z-index: -1;">
          <div slot="dom" class="full bg-space">
          </div>
          <TraverseScene slot="o3d"></TraverseScene>
        </ScissorArea> -->

        <div class="lg:absolute top-0 left-0 right-0 bottom-0 h-min100 lg:h-auto">
          <TraverseDemoUnit :btns="[]">
            <Spaceship></Spaceship>
          </TraverseDemoUnit>
        </div>

        <div class="block lg:hidden absolute top-0 left-0 right-0 bottom-0"></div>
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
          <div class="px-3 mb-3 text-2xl md:text-3xl font-bold">
            Fostering International Friendship
          </div>
          <div class="px-3 mb-3">
            You can explore people with Star Map.
          </div>
          <div class="px-3 mb-3">
            People are meant to be with each other, not inside a newsfeed.
          </div>
          <div class="px-3 mb-3">

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

<style lang="postcss">
.bg-space{
  background-image: url('../../../WebGL/Pages/AppUnits/hdri/sky-space-milky-way-stars-110854.jpg');
  background-size: cover;
}
.h-minus-toolbar-full{
  min-height: calc(100% - 60px);
}
</style>
