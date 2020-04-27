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
      <!-- <RadientBG></RadientBG> -->
      <RiverField :mode="'magic'"></RiverField>
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
      <LensArea dudv="cross"></LensArea>
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

// import { Vector2 } from 'three'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
// import { Interaction } from 'three.interaction'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'StarFlowScene',
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

    this.scene.background = new Color('#1a1a1a')
    // this.scene.background = new TextureLoader().load(require('./img/stained-glass.jpg'))

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 300
    // this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    // let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    // this.controls = new OrbitControls(this.camera, this.lookup('element'))
    // this.lookup('base').onLoop(() => {
    //   this.controls.update()
    // })

    this.scene.add(this.o3d)

    this.$parent.$emit('scene', this.scene)
    this.$parent.$emit('camera', this.camera)

    // var Params = {
    //   exposure: 1,
    //   bloomStrength: 1.5,
    //   bloomThreshold: 0.45,
    //   bloomRadius: 0
    // }
    // let renderer = this.lookup('renderer')
    // let element = this.lookup('element')
    // let rect = element.getBoundingClientRect()
    // var renderScene = new RenderPass(this.scene, this.camera)

    // var bloomPass = new UnrealBloomPass(new Vector2(rect.width * 2, rect.height * 2), 1.5, 0.4, 0.85)
    // bloomPass.threshold = Params.bloomThreshold
    // bloomPass.strength = Params.bloomStrength
    // bloomPass.radius = Params.bloomRadius

    // this.composer = new EffectComposer(renderer)
    // this.composer.addPass(renderScene)
    // this.composer.addPass(bloomPass)
    // this.lookup('base').onResize(() => {
    //   let rect = element.getBoundingClientRect()
    //   let dpi = window.devicePixelRatio || 1
    //   bloomPass.setSize(rect.width * dpi, rect.height * dpi)
    //   this.composer.setSize(rect.width * dpi, rect.height * dpi)
    // })

    // this.$parent.$emit('composer', this.composer)

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
        'lens': {
          pz: '200'
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
