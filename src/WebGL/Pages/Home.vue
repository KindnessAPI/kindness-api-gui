<template>
  <div class="full">
    <div class="fixed top-0 left-0 full" style="z-index: -1" ref="mounter"></div>
    <!-- <HappyLayout v-if="ready" @scene="scene = $event" @camera="camera = $event"></HappyLayout> -->
    <div class="w-full">
      <ScissorArea>
        <div slot="dom" class="p-3 text-green-500 text-4xl">
          KindnessAPI.com
        </div>
        <HomeBannerLayout slot="o3d"></HomeBannerLayout>
      </ScissorArea>
      <div class=" h-64"></div>
      <ScissorArea>
        <div slot="dom" class="p-3 text-green-500 text-4xl">
          KindnessAPI.com
        </div>
        <HomeBannerLayout slot="o3d"></HomeBannerLayout>
      </ScissorArea>
      <div class=" h-64"></div>
      <ScissorArea>
        <div slot="dom" class="p-3 text-green-500 text-4xl">
          KindnessAPI.com
        </div>
        <HomeBannerLayout slot="o3d"></HomeBannerLayout>
      </ScissorArea>
    </div>
  </div>
</template>

<script>
import { PipeScissor } from '../Reusable'
export default {
  name: 'Home',
  mixins: [PipeScissor]
}
</script>

<style>

</style>
