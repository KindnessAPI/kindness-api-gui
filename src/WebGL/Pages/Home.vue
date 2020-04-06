<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" style="z-index: -1" ref="mounter"></div>

    <div v-show="!openMenu">
      <!-- TopNav -->
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>
      <!-- Hero Unit -->
      <HeroUnit></HeroUnit>
    </div>

    <div v-show="openMenu" class="h-full md:h-min60 w-full absolute top-0 left-0 z-10">
      <ScissorArea class="full">
        <div slot="dom">
          <FullMenuBar @close="openMenu = false"></FullMenuBar>
          <div class="px-3 text-white">
            GoGoGo
          </div>
        </div>
        <PhantomScene slot="o3d"></PhantomScene>
      </ScissorArea>
    </div>

    <!--  -->
    <!-- <MenuBG v-show="openMenu" class="fixed top-0 left-0 full"></MenuBG> -->
    <!--  -->

    <!-- <div class="fixed top-0 left-0 full overflow-y-scroll" style="z-index: -1" ref="mounter"> -->
      <!-- <TopNavBar :innerHeight="innerHeight"></TopNavBar> -->
      <!-- <TopNavBar :innerHeight="innerHeight"></TopNavBar> -->
    <!-- </div> -->

    <!--  -->
    <!-- -->

    <!-- <ScissorArea class="w-full h-full md:h-auto">
      <div slot="dom" class="h-full w-full select-none pointer-events-none flex items-center justify-center md:block">
        <div class="text-white p-3 text-4xl">
          KindnessAPI.com
        </div>
      </div>
      <WelcomeBannerScene slot="o3d"></WelcomeBannerScene>
    </ScissorArea> -->

    <!-- <ScissorArea class="w-full h-full md:h-min50">
      <div slot="dom" class="h-full w-full select-none pointer-events-none flex items-center justify-center md:block">
        <div class="text-white p-3 text-4xl">
          KindnessAPI.com
        </div>
      </div>
      <WelcomeBannerScene slot="o3d"></WelcomeBannerScene>
    </ScissorArea> -->

    <!-- <ScissorArea class="w-full h-screen">
      <div slot="dom" class="h-full w-full select-none pointer-events-none flex items-center justify-center text-white text-4xl">
        KindnessAPI.com
      </div>
      <WelcomeBannerScene slot="o3d"></WelcomeBannerScene>
    </ScissorArea> -->

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
</template>

<script>
import { PipeScissor } from '../Reusable'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
      openMenu: false,
      // isMD: false,
      innerHeight: window.innerHeight,
      scrollHeight: 0,
      scroller: false,
      origColor: '',
      bgColor: '#fafafa'
    }
  },
  mounted () {
    this.$watch('openMenu', () => {
      window.dispatchEvent(new Event('resize'))
    })

    // this.$nextTick(() => {
    //   window.scrollTo(0, 0)
    // })

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
      // this.scrollHeight = -(window.innerHeight - this.$refs['scroll-content'].clientHeight)
      this.$nextTick(() => {
        this.innerHeight = window.innerHeight
        // this.scrollHeight = -(window.innerHeight - this.$refs['scroll-content'].clientHeight)
      })
    })

    // this.scroller = makeScroller({ base: this.base, mounter: document.body, limit: this.scrollerConfig, onMove: () => { this.$emit('onMove') } })

    this.origColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = this.bgColor
  },
  beforeDestroy () {
    document.body.style.backgroundColor = this.origColor
  }
}
</script>

<style scoped>
</style>
