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

    <O3D :animated="true" :layout="'bglayer'">
      <MBLinesBloom></MBLinesBloom>
      <!-- <BloomBG></BloomBG> -->
      <!-- <RiverField :mode="'magic'"></RiverField> -->
    </O3D>

    <O3D :animated="true" :layout="'frontlayer'">
      <!-- <HeartGrid @hit="$emit('hit', $event)"></HeartGrid> -->
    </O3D>

    <!--
    -->
    <!-- <O3D :animated="true" :layout="'rain'">
      <ParametricRain></ParametricRain>
    </O3D> -->

    <!-- <div class=""></div> -->

    <!-- <O3D :animated="true" layout="lens">
      <LensArea dudv="cube-2" :blur="0.0"></LensArea>
    </O3D> -->

    <!-- <O3D :animated="true" :layout="'lens'">
      <LensArea dudv="water"></LensArea>
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
import { Scene, Color, Vector2 } from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

// import { Interaction } from 'three.interaction'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'RiverScene',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      composer: false,
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

    this.scene.background = new Color('#000000')
    // this.scene.background = new TextureLoader().load(require('./img/stained-glass.jpg'))

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 600
    // this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    // let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    // this.lookup('element').style.outline = 'none'
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
    var Params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0.1,
      bloomRadius: 1.5
    }
    let renderer = this.lookup('renderer')
    let element = this.lookup('element')
    let rect = element.getBoundingClientRect()
    var renderScene = new RenderPass(this.scene, this.camera)
    let dpi = 1
    var bloomPass = new UnrealBloomPass(new Vector2(rect.width * dpi, rect.height * dpi), 1.5, 0.4, 0.85)
    bloomPass.threshold = Params.bloomThreshold
    bloomPass.strength = Params.bloomStrength
    bloomPass.radius = Params.bloomRadius

    this.composer = new EffectComposer(renderer)
    this.composer.addPass(renderScene)
    this.composer.addPass(bloomPass)
    this.lookup('base').onResize(() => {
      let dpi = 1
      bloomPass.setSize(rect.width * dpi, rect.height * dpi)
      this.composer.setSize(rect.width * dpi, rect.height * dpi)
    })

    this.$parent.$emit('composer', this.composer)

    let looper = () => {
      // if (!parentScrollBox) { return }
      // if (!this.settings[cheery]) { return }
      // let time = window.performance.now() * 0.001
      // let setting = this.settings[cheery]
      this.layouts = {
        'bglayer': {
          pz: '-1600'
        }
        // 'frontlayer': {
        //   pz: (this.camera.position.z - this.camera.position.z * 0.1),
        //   sx: 100,
        //   sy: 100,
        //   sz: 100
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
