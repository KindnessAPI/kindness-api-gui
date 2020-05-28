<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{ zIndex: -1 }" ref="mounter"></div>

    <div v-show="!openMenu" class="w-full relative">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>
      <HeroUnit v-if="Auth" :Auth="Auth"></HeroUnit>
      <BannerUnit></BannerUnit>
      <RegisterBanner></RegisterBanner>
    </div>
    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
  </div>
</template>

<script>
import { PipeScissor, makeScrollBox } from '../Reusable'
// import axios from 'axios'
import { Auth } from '../../APIs/KA'

export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
      Auth,
      Store: Auth.Store,
      openMenu: false,
      origColor: '',
      bgColor: '#fafafa'
    }
  },
  mounted () {
    this.$watch('openMenu', () => {
      window.dispatchEvent(new Event('resize'))
    })

    this.scrollBox = makeScrollBox({ dom: window, base: this.base })

    this.origColor = document.body.style.backgroundColor
    document.body.style.backgroundColor = this.bgColor
  },
  beforeDestroy () {
    document.body.style.backgroundColor = this.origColor
  },
  methods: {

  }
}
</script>

<style scoped>
</style>
