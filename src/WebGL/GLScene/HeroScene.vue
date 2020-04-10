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

    <O3D :animated="true" layout="cb-inst-1">
      <O3D :animated="true" layout="cb-rot">
        <O3D :animated="true" layout="cb-item">
          <CherryBlossom></CherryBlossom>
        </O3D>
      </O3D>
    </O3D>
    <O3D :animated="true" layout="cb-inst-2">
      <O3D :animated="true" layout="cb-rot">
        <O3D :animated="true" layout="cb-item">
          <CherryBlossom></CherryBlossom>
        </O3D>
      </O3D>
    </O3D>
    <O3D :animated="true" layout="cb-inst-3">
      <O3D :animated="true" layout="cb-rot">
        <O3D :animated="true" layout="cb-item">
          <CherryBlossom></CherryBlossom>
        </O3D>
      </O3D>
    </O3D>
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
    this.camera.position.z = 100
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
        'deep': {
          pz: -100
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
          px: `75`,
          py: ``,
          pz: ``,
          rx: `${(cb1or.x - 50) / 100 * Math.PI * 2}`,
          ry: `${(cb1or.y - 50) / 100 * Math.PI * 2}`,
          rz: `${(cb1or.z - 50) / 100 * Math.PI * 2}`
        },
        'cb-inst-2': {
          px: `0`,
          py: ``,
          pz: ``,
          rx: `${(cb2or.x - 50) / 100 * Math.PI * 2}`,
          ry: `${(cb2or.y - 50) / 100 * Math.PI * 2}`,
          rz: `${(cb2or.z - 50) / 100 * Math.PI * 2}`,
          sx: `${1.15}`,
          sy: `${1.15}`,
          sz: `${1.15}`
        },
        'cb-inst-3': {
          px: `-75`,
          py: ``,
          pz: ``,
          rx: `${(cb3or.x - 50) / 100 * Math.PI * 2}`,
          ry: `${(cb3or.y - 50) / 100 * Math.PI * 2}`,
          rz: `${(cb3or.z - 50) / 100 * Math.PI * 2}`
        }
      }
    }

    this.lookup('base').onLoop(looper)
  }
}
</script>

<style>

</style>
