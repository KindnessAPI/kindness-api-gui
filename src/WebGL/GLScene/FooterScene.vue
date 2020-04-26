<template>
  <O3D v-if="layouts">
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

    <O3D :animated="true" layout="mblines">
      <!-- <RadientBG></RadientBG> -->
      <MBLinesSVG></MBLinesSVG>
    </O3D>

    <O3D :animated="true" layout="cb-inst-2">
      <O3D :animated="true" layout="cb-rot">
        <O3D :animated="true" layout="cb-item">
          <!-- <ParametricBall></ParametricBall> -->
        </O3D>
      </O3D>
    </O3D>

    <!-- <MBLines></MBLines> -->

    <!-- <O3D :animated="true" layout="cb-inst-3">
      <O3D :animated="true" layout="cb-rot">
        <O3D :animated="true" layout="cb-item">
          <CherryBlossom @ready="onReady"></CherryBlossom>
        </O3D>
      </O3D>
    </O3D> -->

    <!-- <O3D :animated="true" layout="lensarea">
      <LensArea></LensArea>
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

    this.scene.background = new Color('#2a2a2a')

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 60
    this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

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
      let time = window.performance.now() * 0.001
      let setting = this.settings[cherrySettingName]
      let cb1r = setting['flower1-rotation']
      let cb1or = setting['flower1-offfset-rotation']
      let cb2or = setting['flower2-offfset-rotation']
      let cb3or = setting['flower3-offfset-rotation']

      this.layouts = {
        lensarea: {
          pz: 100
        },
        'deep': {
          pz: -500
        },
        'cb-rot': {
          rx: `${cb1r.x / 100 * Math.PI * 2}`,
          ry: `${cb1r.y / 100 * Math.PI * 2}`,
          rz: `${cb1r.z / 100 * Math.PI * 2}`
        },
        'cb-item': {
          rx: `${time}`,
          ry: ``,
          rz: ``
        },
        'cb-inst-1': {
          px: `50`,
          py: ``,
          pz: ``,
          sx: 0.63,
          sy: 0.63,
          sz: 0.63,
          rx: `${(cb1or.x - 50) / 100 * Math.PI * 2}`,
          ry: `${(cb1or.y - 50) / 100 * Math.PI * 2}`,
          rz: `${(cb1or.z - 50) / 100 * Math.PI * 2}`
        },
        'cb-inst-2': {
          px: `0`,
          py: ``,
          pz: ``,
          sx: 0.63 * 1.15,
          sy: 0.63 * 1.15,
          sz: 0.63 * 1.15,
          rx: `${(cb2or.x - 50) / 100 * Math.PI * 2}`,
          ry: `${(cb2or.y - 50) / 100 * Math.PI * 2}`,
          rz: `${(cb2or.z - 50) / 100 * Math.PI * 2}`
        },
        'cb-inst-3': {
          px: `-50`,
          py: ``,
          pz: ``,
          sx: 0.63,
          sy: 0.63,
          sz: 0.63,
          rx: `${(cb3or.x - 50) / 100 * Math.PI * 2}`,
          ry: `${(cb3or.y - 50) / 100 * Math.PI * 2}`,
          rz: `${(cb3or.z - 50) / 100 * Math.PI * 2}`
        },
        mblines: {
          sx: 1.0,
          sy: 1.0,
          sz: 1.0,
          pz: -2000
        }
      }
    }

    this.lookup('base').onLoop(looper)
  }
}
</script>

<style>

</style>
