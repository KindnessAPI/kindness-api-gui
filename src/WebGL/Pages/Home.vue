<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{ zIndex: -1 }" ref="mounter"></div>

    <div v-show="!openMenu">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>
      <HeroUnit></HeroUnit>
      <HowUnit></HowUnit>
    </div>

    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
  </div>
</template>

<script>
import { PipeScissor, makeScrollBox } from '../Reusable'
import axios from 'axios'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
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

    axios.get('https://a5ebea76.jp-tok.apigw.appdomain.cloud/api?name=lok')
      .then(r => r.data)
      .then(console.log)

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
