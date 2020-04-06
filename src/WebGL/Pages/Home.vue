<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" style="z-index: -1" ref="mounter"></div>

    <div v-show="!openMenu">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>
      <HeroUnit></HeroUnit>
    </div>

    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
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
