<template>
  <div class="full">
    <div class="fixed top-0 left-0 full" style="z-index: -1" ref="mounter"></div>
    <!-- <HappyLayout v-if="ready" @scene="scene = $event" @camera="camera = $event"></HappyLayout> -->
    <div>
      <ScissorArea  class=" shadow-inner">
        <div slot="dom" class="h-64 flex items-center shadow-md justify-center text-green-500 text-4xl">
          <h1>
            KindnessAPI.com
          </h1>
        </div>
        <HomeBannerLayout slot="o3d"></HomeBannerLayout>
      </ScissorArea>
      <div class=" h-64"></div>
      <ScissorArea class=" shadow-inner">
        <div slot="dom" class="p-3 text-green-500 text-4xl">
          KindnessAPI.com
        </div>
        <HomeBannerLayout slot="o3d"></HomeBannerLayout>
      </ScissorArea>
      <div class=" h-64"></div>
      <ScissorArea class=" shadow-inner">
        <div slot="dom" class="p-3 text-green-500 text-4xl">
          KindnessAPI.com
        </div>
        <HomeBannerLayout slot="o3d"></HomeBannerLayout>
      </ScissorArea>
      <div class=" h-64"></div>
    </div>
  </div>
</template>

<script>
import { PipeScissor } from '../Reusable'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
      origColor: ''
    }
  },
  mounted () {
    this.origColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#ececec'
  },
  beforeDestroy () {
    document.body.style.backgroundColor = this.origColor
  }
}
</script>

<style>

</style>
