<template>
  <O3D ref="root">
    <O3D :animated="true" layout="center">
      <TextureText :canplay="true" font="Arial" align="left" :gotClicked="say" :text="center"></TextureText>
    </O3D>
    <slot></slot>
  </O3D>
</template>

<script>
import { Tree, getID } from '@/WebGL/Reusable'
import { LamdaSocket, getWS } from '@/APIs/KA'

// import { Mesh, SphereBufferGeometry, BackSide, MeshBasicMaterial } from 'three'
export default {
  name: 'Test',
  mixins: [Tree],
  props: {
    texture: {
      default: null
    }
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      center: 'Send Msg'
    }
  },
  methods: {
    setupSocket () {
      this.socket = new LamdaSocket({
        url: getWS(),
        roomId: 'room-test',
        nickname: 'KA@' + getID()
      })

      this.socket.addEventListener('text', ({ detail }) => {
        let html = `<pre>${detail.type} - ${JSON.stringify(detail)}</pre>`
        console.log(detail, html)
        this.center = detail.text
        console.log(this.center)
        this.$forceUpdate()
      })

      this.socket.addEventListener('online', ({ detail }) => {
        let html = `<pre>me: ${this.socket.nickname} - ${JSON.stringify(detail)}</pre>`
        console.log(detail, html)
      })
    },
    say () {
      this.socket.sendText({ text: window.prompt('what u wanna say?') || '...' })
    }
  },
  mounted () {
    this.setupSocket()
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
