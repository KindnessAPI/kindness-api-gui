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
    <!--  -->

    <!-- -->
    <O3D :animated="true" layout="bglayer">
      <ImageBG v-if="image && ready" :image="image"></ImageBG>
      <!-- <RadientBG></RadientBG> -->
    </O3D>

    <!-- <O3D :animated="true" :layout="'cluster'">
      <ParametricCluster :tCube="tCube" :mode="'magic'"></ParametricCluster>
    </O3D> -->

    <!--
    -->
    <!-- <O3D :animated="true" :layout="'rain'">
      <ParametricRain></ParametricRain>
    </O3D> -->

    <!-- <div class=""></div> -->

    <!-- <O3D :animated="true" :layout="'lens'">
      <LensArea :dudv="'cross-2'" :blur="0.0"></LensArea>
    </O3D> -->

    <O3D :animated="true" :layout="'lens'">
      <LensArea :blur="layouts.lens.blur" :dudv="'cross-2'"></LensArea>
    </O3D>

    <!--  -->

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
import { Scene, Color, TextureLoader } from 'three'
// import { Interaction } from 'three.interaction'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// let Cache = {}

export default {
  name: 'GospelScene',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      ready: false,
      Math,
      settings: {},
      flower1: {},
      image: false,
      scene: new Scene(),
      tCube: false,
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
    this.ready = true
    window.dispatchEvent(new Event('resize'))

    // let div = document.createElement('div')
    // Cache.painter = Cache.painter || makePaintCanvas({ pixel: 16, sdk: this.lookup('sdk'), setting: 'parametric-cluster-canvas', domElement: div, base: this.lookup('base') })
    // let painter = Cache.painter
    // Cache.painterCube = Cache.painterCube || new CubeTexture([
    //   painter.canvas,
    //   painter.canvas,
    //   painter.canvas,
    //   painter.canvas,
    //   painter.canvas,
    //   painter.canvas
    // ])
    // let cube = Cache.painterCube

    // this.lookup('base').onLoop(() => {
    //   cube.needsUpdate = true
    // })

    // // this.tCube = cube

    this.image = new TextureLoader().load(require('./img/stained-glass.jpg'))

    this.scene.background = new Color('#121212')
    // this.scene.background = new TextureLoader().load(require('./img/stained-glass.jpg'))

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 500
    // this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    // let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    // this.controls = new OrbitControls(this.camera, this.lookup('element'))
    // this.lookup('base').onLoop(() => {
    //   this.controls.update()
    // })

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
      let time = window.performance.now() * 0.001
      // let setting = this.settings[cheery]
      this.layouts = {
        'cluster': {
          rz: `${Math.PI * 0.5}`,
          pz: '-250',
          sx: '0.75',
          sy: '0.75',
          sz: '0.75'
        },
        'bglayer': {
          pz: '-500',
          rz: `${time * 0.03}`
        },
        'lens': {
          blur: 0.0, // Math.abs(Math.sin(time)),
          sx: 1.75,
          sy: 1.75,
          pz: this.camera.position.z - this.camera.position.z * 0.23333
        }
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
