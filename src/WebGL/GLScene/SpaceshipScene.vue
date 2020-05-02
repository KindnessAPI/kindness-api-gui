<template>
  <O3D v-if="layouts && shaderCube">
    <!--
      <O3D :animated="true" layout="ball">
        <Test @click="click"></Test>
      </O3D> -->
      <!--
    -->

    <!-- <O3D :animated="true" layout="deep" v-if="!ready">
      <ParametricCluster></ParametricCluster>
    </O3D> -->

    <!-- <O3D :animated="true" layout="cb-inst-1">
      <O3D :animated="true" layout="cb-rot">
        <O3D :animated="true" layout="cb-item">
          <CherryBlossom @ready="onReady"></CherryBlossom>
        </O3D>
      </O3D>
    </O3D> -->

    <!-- <O3D :animated="true" layout="cb-inst-2">
      <O3D :animated="true" layout="cb-rot">
        <O3D :animated="true" layout="cb-item"> -->
        <!-- </O3D>
      </O3D>
    </O3D> -->

    <!-- <O3D :animated="true" layout="bgarea"> -->
      <!-- <RadientBG></RadientBG> -->
      <!-- <MBLinesSVG></MBLinesSVG> -->
    <!-- </O3D> -->
    <!-- <O3D :animated="true" layout="cross"> -->
    <!-- <HolyCross></HolyCross>
    -->
    <!-- <Church></Church> -->

    <!-- <SpaceshipWalk :shaderCube="shaderCube"></SpaceshipWalk>
    <HolyCross :shaderCube="shaderCube"></HolyCross> -->

    <!-- <SpaceStation :shaderCube="shaderCube"></SpaceStation> -->

    <!-- </O3D> -->

    <!-- <MBLines></MBLines> -->

    <!-- <O3D :animated="true" layout="cb-inst-3">
      <O3D :animated="true" layout="cb-rot">
        <O3D :animated="true" layout="cb-item">
          <CherryBlossom @ready="onReady"></CherryBlossom>
        </O3D>
      </O3D>
    </O3D> -->

    <Spaceship></Spaceship>

    <!-- <O3D :animated="true" layout="lensarea">
      <LensArea></LensArea>
    </O3D> -->

  </O3D>
</template>

<script>
import { Tree, RayPlay, PCamera, ShaderCubeRefraction } from '../Reusable'
import { Scene, Color } from 'three'
// import { Interaction } from 'three.interaction'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  name: 'SpaceStationScene',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      shaderCube: false,
      ready: false,
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
    onReady () {
      // this.ready = true
      // setTimeout(() => {
      //   this.scene.background = new Color('#fafafa')
      // }, 1000)
    }
  },
  async mounted () {
    await this.lookupWait('ready')

    this.scene.background = new Color('#efefef')

    this.shaderCube = new ShaderCubeRefraction({ renderer: this.lookup('renderer'), loop: this.lookup('base').onLoop, res: 32 })
    // this.scene.background = this.shaderCube.out.envMap

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 600
    this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    this.controls = new OrbitControls(this.camera, this.lookup('element'))
    this.lookup('base').onLoop(() => {
      this.controls.update()
    })

    this.scene.add(this.o3d)

    this.$parent.$emit('scene', this.scene)
    this.$parent.$emit('camera', this.camera)

    // let settingsName = 'holy-cross'
    // let sdk = this.lookup('sdk')
    // sdk.onStubGroup(settingsName, (stub) => {
    //   this.settings[settingsName] = stub
    // })

    let parentScrollBox = this.lookup('scrollBox')

    let looper = () => {
      if (!parentScrollBox) { return }
      // if (!this.settings[settingsName]) { return }
      // let time = window.performance.now() * 0.001
      // let setting = this.settings[settingsName]
      // let rotation = setting['holy-cross-rotation']
      // let translate = setting['holy-cross-translate']
      // let scale = setting['holy-cross-scale']
      // let cb1or = setting['flower1-offfset-rotation']
      // let cb2or = setting['flower2-offfset-rotation']
      // let cb3or = setting['flower3-offfset-rotation']

      this.layouts = {
        bgarea: {
          sx: 1.0,
          sy: 1.0,
          sz: 1.0,
          pz: -3000
        }
      }
    }

    this.lookup('base').onLoop(looper)
  }
}
</script>

<style>

</style>
