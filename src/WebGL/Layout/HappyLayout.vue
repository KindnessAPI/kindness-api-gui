<template>
  <O3D v-if="layouts">
    <!-- <O3D :animated="true" layout="ball">
      <ParametricBall v-if="paintCubeTex" :tCube="paintCubeTex"></ParametricBall>
    </O3D> -->

    <O3D :animated="true" layout="cluster">
      <ParametricCluster v-if="paintCubeTex" :tCube="paintCubeTex"></ParametricCluster>
    </O3D>
    <O3D :animated="true" layout="dome">
      <SkyDome v-if="paint2DTex" :texture="paint2DTex"></SkyDome>
    </O3D>
    <O3D :animated="true" layout="cross">
      <RefactorArea dudv="cross-2" :blur="blur"></RefactorArea>
      <O3D :animated="true" layout="gospel">
        <TextureText :canplay="true" font="Arial" align="left" :gotClicked="goMini" :text="gospel"></TextureText>
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
      ctaButton: `Let's Go!`,
      gospel: `Love is patient and kind;
love does not envy or boast;
It is not arrogant or rude.
It does not insist on its own way;
It is not irritable or resentful;
It does not rejoice at wrongdoing,
but rejoices with the truth.
Love bears all things,
believes all things,
hopes all things,
endures all things.
Love never ends.

1 Corinthians 13:4–8a`,
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
    this.scene.add(this.o3d)
    this.$emit('scene', this.scene)
    this.scene.background = this.paintCubeTex

    this.limit = {
      direction: 'vertical',
      canRun: true,
      y: 1
    }
    this.scroller = makeScroller({ base: this.lookup('base'), mounter: this.lookup('mounter'), limit: this.limit, onMove: () => { this.$emit('onMove') } })
    this.fader = new Damper(0, this.lookup('base'))

    let looper = () => {
      this.lookup('renderer').domElement.style.opacity = this.fader.value

      this.blur = 1.0 - this.scroller.value

      // let time = window.performance.now() * 0.001
      // this.paint2DTex.needsUpdate = true
      this.paintCubeTex.needsUpdate = true

      this.layouts = {
        cross: {
          // visible: this.blur > 0.1,
          pz: 20,
          py: -(1.0 - this.scroller.value) * (this.screen.height)
        },
        ball: {
          py: this.scroller.value * (this.screen.height * 0.5)
        },
        cluster: {
          pz: -200,
          rx: this.scroller.value * (Math.PI)
        },
        gospel: {
          pz: 1
        },
        ctaButton: {
          pz: 1,
          py: `${this.screen.height * -0.5} + child.height * 2.5`
        }
      }
    }
    this.lookup('base').onLoop(looper)
    this.scroller.value = 1
    this.fader.value = 1
  }
}
</script>

<style>

</style>
