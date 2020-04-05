<template>
  <O3D v-if="layouts">
    <O3D :animated="true" layout="ball">
      <Test></Test>
    </O3D>
  </O3D>
</template>

<script>
import { Tree, makeScroller, RayPlay, PCamera } from '../Reusable'
import { Scene } from 'three'
export default {
  name: 'HappyLayout',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      scene: new Scene(),
      paint2DTex: false,
      paintCubeTex: false,
      layouts: false,
      blur: 0,
      socket: false
    }
  },
  methods: {
    nextPage () {
      this.fader.value = 0
      this.scroller.value = 0
      this.waitDoOnce({
        getter: () => {
          return this.fader.value <= 0.05
        },
        fnc: () => {
          this.$router.push('/2')
        }
      })
    },
    goMini (v) {
      this.scroller.value = 0
    }
  },
  async mounted () {
    await this.lookupWait('ready')
    // let paintCanvas = makePaintCanvas({ pixel: 64, sdk: this.lookup('sdk'), setting: 'paint-canvas', domElement: this.lookup('touchDom'), base: this.lookup('base') })
    // this.paintCubeTex = new CubeTexture([
    //   paintCanvas.canvas,
    //   paintCanvas.canvas,
    //   paintCanvas.canvas,
    //   paintCanvas.canvas,
    //   paintCanvas.canvas,
    //   paintCanvas.canvas
    // ])
    // this.scene.background = this.paintCubeTex

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 100
    this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    this.scene.add(this.o3d)

    this.$parent.$emit('scene', this.scene)
    this.$parent.$emit('camera', this.camera)

    this.limit = {
      direction: 'vertical',
      canRun: true,
      y: 1
    }

    console.log(this.lookup('element'))

    this.scroller = makeScroller({ base: this.lookup('base'), mounter: this.lookup('element'), limit: this.limit, onMove: () => { this.$emit('onMove') } })

    let looper = () => {
      if (!this.screen) {
        return
      }

      this.blur = 1.0 - this.scroller.value

      // let time = window.performance.now() * 0.001
      // this.paint2DTex.needsUpdate = true
      // this.paintCubeTex.needsUpdate = true

      this.layouts = {
        ball: {
          px: (this.scroller.value - 0.5) * (this.screen.width)
        }
      }
    }

    this.lookup('base').onLoop(looper)
    this.scroller.value = 1
  }
}
</script>

<style>

</style>
