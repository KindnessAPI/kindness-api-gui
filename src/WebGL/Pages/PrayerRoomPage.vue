<template>
  <div class="full">
    <div class="fixed top-0 left-0 full pointer-events-none" :style="{ zIndex: -1 }" ref="mounter"></div>

    <div v-show="!openMenu" class="full">
      <TopNavBar @menu="openMenu = !openMenu"></TopNavBar>
      <PrayerRoomUnit :prayerID="prayerID" :prayFor="prayFor">
      </PrayerRoomUnit>
    </div>
    <FullMenuBar v-show="openMenu" @close="openMenu = false"></FullMenuBar>
  </div>
</template>

<script>
import { PipeScissor, makeScrollBox } from '../Reusable'
import { Auth } from '../../APIs/KA'

// import axios from 'axios'
export default {
  name: 'Home',
  mixins: [PipeScissor],
  data () {
    return {
      Auth,
      mode: 'list',
      openMenu: false,
      origColor: '',
      bgColor: '#fafafa'
    }
  },
  computed: {
    prayFor () {
      return this.$route.query.prayFor
    },
    prayerID () {
      return this.$route.query.prayerID
    }
  },
  mounted () {
    this.$watch('openMenu', () => {
      window.dispatchEvent(new Event('resize'))
    })

    this.scrollBox = makeScrollBox({ dom: window, base: this.base })
    if (this.prayFor) {
      this.mode = 'pray'
    }

    // let axios = require('axios').default
    // axios.post('http://localhost:3333/login', {
    //   username: 'lok',
    //   email: 'lok@lok.com',
    //   password: 'loklok-test'
    // })
    //   .then(r => r.data)
    //   .then(console.log)

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
