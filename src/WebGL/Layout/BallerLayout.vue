<template>
  <O3D v-if="layouts">
    <!-- <O3D :animated="true" layout="ball">
      <ParametricBall v-if="paintCubeTex" :tCube="paintCubeTex"></ParametricBall>
    </O3D> -->

    <O3D :animated="true" layout="cluster">
      <ParametricBall v-if="paintCubeTex" :tCube="paintCubeTex"></ParametricBall>
    </O3D>
    <O3D :animated="true" layout="dome">
      <SkyDome v-if="paint2DTex" :texture="paint2DTex"></SkyDome>
    </O3D>
    <O3D :animated="true" layout="cross">
      <RefactorArea dudv="cube-2" :blur="0.998"></RefactorArea>
      <O3D :animated="true" layout="mainMessage">
        <TextureText :canplay="true" font="Arial" align="left" :gotClicked="goMini" :text="mainMessage"></TextureText>
      </O3D>
      <O3D :animated="true" layout="ctaButton">
        <TextureText :canplay="true" font="Arial" align="left" :gotClicked="nextPage" :text="ctaButton"></TextureText>
      </O3D>
    </O3D>
  </O3D>
</template>

<script>
import { Tree, makePaintCanvas, makeScroller, Damper } from '../Reusable'
import { Scene, CubeTexture } from 'three'
export default {
  name: 'HappyLayout',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      mainMessage: `Orb of Fun Fun Parametric Equation....`,
      ctaButton: `Let's Go!`,
      scene: new Scene(),
      paint2DTex: false,
      paintCubeTex: false,
      layouts: false,
      blur: 0
    }
  },
  created () {
    let paintCanvas = makePaintCanvas({ pixel: 64, sdk: this.lookup('sdk'), setting: 'paint-canvas', domElement: this.lookup('touchDom'), base: this.lookup('base') })
    this.paintCubeTex = new CubeTexture([
      paintCanvas.canvas,
      paintCanvas.canvas,
      paintCanvas.canvas,
      paintCanvas.canvas,
      paintCanvas.canvas,
      paintCanvas.canvas
    ])
  },
  methods: {
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
    this.scene.add(this.o3d)
    this.$emit('scene', this.scene)
    this.scene.background = this.paintCubeTex

    this.limit = {
      direction: 'vertical',
      canRun: true,
      y: 1
    }
    this.fader = new Damper(0, this.lookup('base'))

    this.scroller = makeScroller({ base: this.lookup('base'), mounter: this.lookup('mounter'), limit: this.limit, onMove: () => { this.$emit('onMove') } })
    let looper = () => {
      this.lookup('renderer').domElement.style.opacity = this.fader.value

      // this.blur = 1.0 - this.scroller.value

      // let time = window.performance.now() * 0.001
      // this.paint2DTex.needsUpdate = true

      this.paintCubeTex.needsUpdate = true

      this.layouts = {
        cross: {
          // visible: this.blur > 0.1,
          pz: 20,
          py: (-this.scroller.value + 1.0) * -(this.screen.height)
        },
        // ball: {
        //   pz: -100,
        //   px: this.scroller.value * (this.screen.height * 0.5)
        // },
        cluster: {
          pz: -200,
          rz: this.scroller.value * (Math.PI * 2)
        },
        mainMessage: {
          pz: 1
        },
        ctaButton: {
          pz: 0.1,
          py: `${this.screen.height * -0.5} + child.height * 2.5`
        }
      }
    }
    looper()
    this.lookup('base').onLoop(looper)
    this.scroller.value = 1
    this.fader.value = 1
  }
}
</script>

<style>

</style>
