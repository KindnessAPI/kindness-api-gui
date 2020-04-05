<template>
  <div class="full">
    <div class="fixed top-0 left-0 full" style="z-index: -1" ref="mounter"></div>
    <!-- <HappyLayout v-if="ready" @scene="scene = $event" @camera="camera = $event"></HappyLayout> -->
    <div class="fixed top-0 left-0 full">
      <div ref="scroll-content" class="full" :style="{ transform: `translateY(${-scroller.value * innerHeight}px)` }">

        <ScissorArea class="w-full h-full">
          <div slot="dom" class="h-full w-full select-none pointer-events-none flex items-center justify-center text-white text-4xl">
            KindnessAPI.com
          </div>
          <WelcomeBannerScene slot="o3d"></WelcomeBannerScene>
        </ScissorArea>

        <!-- <ScissorArea class="h-full w-full">
          <div slot="dom" class="h-full w-full select-none pointer-events-none flex items-center justify-center text-white text-4xl">
            KindnessAPI.com
          </div>
          <WelcomeBannerScene slot="o3d"></WelcomeBannerScene>
        </ScissorArea> -->

        <!-- <ScissorArea class="w-min70  h-min70">
          <div slot="dom" class="select-none flex items-center justify-center text-green-500 text-4xl">
          </div>
          <HomeBannerLayout slot="o3d"></HomeBannerLayout>
        </ScissorArea>

        <ScissorArea class="w-min70  h-min70">
          <div slot="dom" class="select-none flex items-center justify-center text-green-500 text-4xl">
          </div>
          <HomeBannerLayout slot="o3d"></HomeBannerLayout>
        </ScissorArea> -->
      </div>
    </div>
  </div>
</template>

<script>
import { PipeScissor, makeScroller } from '../Reusable'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
      innerHeight: window.innerHeight,
      scrollHeight: 0,
      scroller: false,
      origColor: '',
      bgColor: '#bababa'
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.scrollTo(0, 0)
    })

    let vm = this
    this.scrollerConfig = {
      direction: 'vertical',
      canRun: true,
      get y () {
        return vm.scrollHeight / window.innerHeight
      }
    }

    //
    this.base.onResize(() => {
      this.innerHeight = window.innerHeight
      this.scrollHeight = -(window.innerHeight - this.$refs['scroll-content'].clientHeight)
      this.$nextTick(() => {
        this.innerHeight = window.innerHeight
        this.scrollHeight = -(window.innerHeight - this.$refs['scroll-content'].clientHeight)
      })
    })

    this.scroller = makeScroller({ base: this.base, mounter: document.body, limit: this.scrollerConfig, onMove: () => { this.$emit('onMove') } })

    this.origColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = this.bgColor
  },
  beforeDestroy () {
    document.body.style.backgroundColor = this.origColor
  }
}
</script>

<style>
</style>
