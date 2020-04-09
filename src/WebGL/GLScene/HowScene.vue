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
    <O3D :animated="true" :layout="'rain'">
      <ParametricRain :tCube="tCube"></ParametricRain>
    </O3D>
  </O3D>
</template>

<script>
import { Tree, RayPlay, PCamera, makePaintCanvas } from '../Reusable'
import { Scene, Color, CubeTexture } from 'three'
// import { Interaction } from 'three.interaction'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const Cache = {}

export default {
  name: 'HeroScene',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
      tCube: null,
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

    let div = document.createElement('div')
    Cache.painter = Cache.painter || makePaintCanvas({ pixel: 64, sdk: this.lookup('sdk'), setting: 'paint-rain', domElement: div, base: this.lookup('base') })
    let painter = Cache.painter
    Cache.painterCube = Cache.painterCube || new CubeTexture([
      painter.canvas,
      painter.canvas,
      painter.canvas,
      painter.canvas,
      painter.canvas,
      painter.canvas
    ])
    let cube = Cache.painterCube

    this.lookup('base').onLoop(() => {
      cube.needsUpdate = true
    })

    this.tCube = Cache.painterCube

    this.scene.background = new Color('#fafafa')

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 800
    this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    // let OrbitControls = require('three/examples/jsm/controls/OrbitControls').OrbitControls
    // this.controls = new OrbitControls(this.camera, this.lookup('element'))
    // this.lookup('base').onLoop(() => {
    //   this.controls.update()
    // })

    this.scene.add(this.o3d)

    this.$parent.$emit('scene', this.scene)
    this.$parent.$emit('camera', this.camera)

    let cherrySettingName = 'cherry-blossom'
    let sdk = this.lookup('sdk')
    sdk.onStubGroup(cherrySettingName, (stub) => {
      this.settings[cherrySettingName] = stub
    })

    let parentScrollBox = this.lookup('scrollBox')

    let looper = () => {
      if (!parentScrollBox) { return }
      if (!this.settings[cherrySettingName]) { return }
      // let time = window.performance.now() * 0.001
      // let setting = this.settings[cherrySettingName]
      this.layouts = {
        'rain': {
          rx: `${Math.PI * 8.5} * ${parentScrollBox.page}`
        }
      }
    }

    this.lookup('base').onLoop(looper)
  }
}
</script>

<style>

</style>
