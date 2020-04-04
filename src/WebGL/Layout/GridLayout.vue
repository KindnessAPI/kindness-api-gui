<template>
  <O3D layout="scrollLayer" :animated="true" v-if="layouts">
    <BMText :text="allText" :clicked="say"></BMText>
    <!-- <TextureText font="Arial" align="left" :clicked="say" :text="sendMsgBtn" :visible="lamda && lamda.ready"></TextureText> -->
    <!-- <O3D :key="msg._id" :animated="true"  v-for="msg in msgs" :layout="msg._id">
      <TextureText :canplay="true" font="Arial" align="left" :clicked="say" :text="msg.text"></TextureText>
    </O3D> -->
  </O3D>
</template>

<script>
import { Tree, makeScroller, getID } from '../Reusable'
// import { Scene } from 'three'
import { LamdaClient, getWS } from '../../APIs/KA'

export default {
  name: 'HappyLayout',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      lamda: false,
      msgs: [],
      allText: 'click me to add text',
      sendMsgBtn: 'Send Msg',

      // scene: new Scene(),
      paint2DTex: false,
      paintCubeTex: false,
      layouts: false,
      blur: 0
    }
  },
  created () {
    // let paintCanvas = makePaintCanvas({ pixel: 64, sdk: this.lookup('sdk'), setting: 'paint-canvas', domElement: this.lookup('touchDom'), base: this.lookup('base') })
    // this.paintCubeTex = new CubeTexture([
    //   paintCanvas.canvas,
    //   paintCanvas.canvas,
    //   paintCanvas.canvas,
    //   paintCanvas.canvas,
    //   paintCanvas.canvas,
    //   paintCanvas.canvas
    // ])
  },
  methods: {
    setup () {
      this.lamda = new LamdaClient({
        url: getWS(),
        roomId: 'chat-box-inst',
        nickname: 'KA@' + getID()
      })

      this.layouts = {
        currentLayer: {
          py: -30
        }
      }

      let onMsg = ({ text }) => {
        let id = getID()
        this.msgs.push({
          _id: id,
          text: text + ''
        })
        this.allText += `\n${text}`

        this.layouts[id] = {
          py: this.msgs.length * 20
        }

        let amount = Math.abs(this.msgs.length * -20)
        if (amount > (this.limit.y * this.screen.height)) {
          this.limit.y = amount / this.screen.height
        }
      }

      // let i = 0
      // setInterval(() => {
      //   if (i >= 300) {
      //     return
      //   }
      //   onMsg({ text: i++ })
      // }, 0)

      this.lamda.on('text', (detail) => {
        let html = `<pre>${detail.type} - ${JSON.stringify(detail)}</pre>`
        console.log(detail, html)
        onMsg({ text: detail.text })
        this.$forceUpdate()
      })

      this.lamda.on('online', (detail) => {
        let html = `<pre>me: ${this.lamda.nickname} - ${JSON.stringify(detail)}</pre>`
        console.log(detail, html)
      })
    },
    say () {
      this.lamda.sendText({ text: window.prompt('what u wanna say?') || '...' })
    },
    nextPage () {
      this.fader.value = 0
      this.scroller.value = 0
      this.waitDoOnce({
        getter: () => {
          // console.log(this.fader.value)
          return this.fader.value <= 0.04
        },
        fnc: () => {
          this.$router.push('/')
        }
      })
    },
    goMini (v) {
      this.scroller.value = 0
    }
  },
  async mounted () {
    this.setup()
    // this.scene.add(this.o3d)
    this.$emit('scene', this.scene)
    // this.scene.background = new Color('#bababa')

    this.limit = {
      direction: 'vertical',
      canRun: true,
      y: 1
    }

    this.scroller = makeScroller({ base: this.lookup('base'), mounter: this.lookup('mounter'), limit: this.limit, onMove: () => { this.$emit('onMove') } })
    let looper = () => {
      // this.blur = 1.0 - this.scroller.value

      // let time = window.performance.now() * 0.001
      // this.paint2DTex.needsUpdate = true

      // this.paintCubeTex.needsUpdate = true

      this.layouts = {
        ...this.layouts,
        scrollLayer: {
          // py: (this.scroller.value * -this.screen.height)
        }
      }
    }
    looper()
    this.lookup('base').onLoop(looper)
  }
}
</script>

<style>

</style>
