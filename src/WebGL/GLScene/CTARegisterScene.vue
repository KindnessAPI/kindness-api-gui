<template>
  <O3D v-if="layouts">
    <!--
      <O3D :animated="true" layout="ball">
        <Test @click="click"></Test>
      </O3D> -->
      <!-- <O3D :animated="true" layout="deep">
        <GradientBG></GradientBG>
      </O3D>
    -->

    <O3D :animated="true" :layout="'bglayer'">
      <StarField></StarField>
    </O3D>

    <!-- <StarField></StarField> -->
    <!-- <O3D :animated="true" :layout="'bglayer'">
    </O3D> -->

    <!-- <O3D :animated="true" :layout="'lensArea'">
      <LensArea></LensArea>
    </O3D> -->

    <!-- <O3D :animated="true" :layout="'rain'">
      <ParametricRain></ParametricRain>
    </O3D> -->
  </O3D>
</template>

<script>
import { Tree, RayPlay, PCamera } from '../Reusable'
import { Scene, Color } from 'three'
// import { Interaction } from 'three.interaction'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'HeroScene',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      settings: {},
      flower1: {},

      scene: new Scene(),
      paint2DTex: false,
      paintCubeTex: false,
      layouts: false,
      blur: 0,
      socket: false
    }
  },
  methods: {
    click () {
      console.log('123')
    }
  },
  async mounted () {
    await this.lookupWait('ready')

    this.scene.background = new Color('#fafafa')

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 260
    this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    // let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    // this.controls = new OrbitControls(this.camera, this.lookup('element'))
    // this.lookup('base').onLoop(() => {
    //   this.controls.update()
    // })

    this.scene.add(this.o3d)

    this.$parent.$emit('scene', this.scene)
    this.$parent.$emit('camera', this.camera)

    let cheery = 'cherry-blossom'
    let sdk = this.lookup('sdk')
    sdk.onStubGroup(cheery, (stub) => {
      this.settings[cheery] = stub
    })

    let parentScrollBox = this.lookup('scrollBox')

    let looper = () => {
      if (!parentScrollBox) { return }
      if (!this.settings[cheery]) { return }
      // let time = window.performance.now() * 0.001
      // let setting = this.settings[cheery]
      this.layouts = {
        'lensArea': {
          pz: '-200'
        },
        'bglayer': {
          pz: '-1000'
        },
        'rain': {
          rz: `${Math.PI * 2} * ${parentScrollBox.page}`
        }
      }
    }

    this.lookup('base').onLoop(looper)
  }
}
</script>

<style>

</style>
