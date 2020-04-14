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

    <!--  -->
    <!-- <O3D :animated="true" layout="bglayer">
      <RadientBG></RadientBG>
    </O3D> -->

    <O3D layout="bg" :animated="true">
      <!-- <RadientBG></RadientBG> -->
      <MBLines></MBLines>
    </O3D>
    <!-- <O3D layout="core" :animated="true">
      <ParametricRain></ParametricRain>
    </O3D> -->

    <!--
    -->
    <!-- <O3D :animated="true" :layout="'rain'">
      <ParametricRain></ParametricRain>
    </O3D> -->

    <!-- <div class=""></div> -->

    <!-- <O3D :animated="true" layout="lens">
      <LensArea dudv="cube-2" :blur="0.0"></LensArea>
    </O3D> -->

    <!-- <O3D :animated="true" :layout="'lensArea'">
      <LensArea></LensArea>
    </O3D> -->

    <!-- <StarField></StarField> -->
    <!-- <O3D :animated="true" :layout="'bglayer'">
    </O3D> -->

    <!--  -->

    <!-- <O3D :animated="true" :layout="'rain'">
      <ParametricRain></ParametricRain>
    </O3D> -->
  </O3D>
</template>

<script>
import { Tree, PCamera } from '../Reusable'
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

    this.scene.background = new Color('#333')
    // this.scene.background = new TextureLoader().load(require('./img/stained-glass.jpg'))

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 300
    // this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    this.controls = new OrbitControls(this.camera, this.lookup('element'))
    this.lookup('base').onLoop(() => {
      this.controls.update()
    })

    this.scene.add(this.o3d)

    this.$parent.$emit('scene', this.scene)
    this.$parent.$emit('camera', this.camera)

    // let cheery = 'cherry-blossom'
    // let sdk = this.lookup('sdk')
    // sdk.onStubGroup(cheery, (stub) => {
    //   this.settings[cheery] = stub
    // })

    // let parentScrollBox = this.lookup('scrollBox')

    let looper = () => {
      // if (!parentScrollBox) { return }
      // if (!this.settings[cheery]) { return }
      // let time = window.performance.now() * 0.001
      // let setting = this.settings[cheery]
      this.layouts = {
        core: {
          sx: 0.3,
          sy: 0.3,
          sz: 0.3
        },
        bg: {
          sx: '5',
          sy: '5',
          pz: '-1000'
        }
        // 'lens': {
        //   pz: '100'
        // }
        // 'rain': {
        //   pz: `-1000`
        // }
        // 'rain': {
        //   rz: `${Math.PI * 2} * ${parentScrollBox.page}`
        // }
      }
    }

    this.lookup('base').onLoop(looper)
  }
}
</script>

<style>

</style>
