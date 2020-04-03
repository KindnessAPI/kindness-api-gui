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
      <RefactorArea dudv="cross-2" :blur="blur"></RefactorArea>
      <O3D :animated="true" layout="gospel">
        <TextureText :canplay="true" font="Arial" align="left" :gotClicked="runDemo" :text="gospel"></TextureText>
      </O3D>
    </O3D>
  </O3D>
</template>

<script>
import { Tree, makePaintCanvas, makeScroller } from '../Reusable'
import { Scene, CubeTexture } from 'three'
export default {
  name: 'HappyLayout',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      gospel: `Love is....`,
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
    runDemo (v) {
      // if ()
      console.log(this.$route.path, 'run demo', v)
      if (this.$route.path === '/') {
        this.$router.push('/2')
      } else if (this.$route.path === '/2') {
        this.$router.push('/')
      }
    }
  },
  async mounted () {
    this.scene.add(this.o3d)
    this.$emit('scene', this.scene)
    this.scene.background = this.paintCubeTex

    this.limit = {
      canRun: true,
      y: 1
    }
    this.scroller = makeScroller({ base: this.lookup('base'), mounter: this.lookup('mounter'), limit: this.limit, onMove: () => { this.$emit('onMove') } })

    this.lookup('base').onLoop(() => {
      this.blur = 1.0 - this.scroller.value

      // let time = window.performance.now() * 0.001
      // this.paint2DTex.needsUpdate = true
      this.paintCubeTex.needsUpdate = true

      this.layouts = {
        cross: {
          visible: this.blur > 0.1,
          pz: 20,
          py: this.scroller.value * (this.screen.height)
        },
        ball: {
          pz: -100,
          py: this.scroller.value * (this.screen.height * 0.5)
        },
        cluster: {
          pz: -200,
          rz: this.scroller.value * (Math.PI * 2)
        },
        gospel: {
          pz: 1
        }
      }
    })
  }
}
</script>

<style>

</style>
