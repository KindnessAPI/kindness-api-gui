<template>
  <O3D v-if="layouts">
    <!-- <O3D :animated="true" layout="ball">
      <Test @click="click"></Test>
    </O3D> -->
    <!-- <GradientBG></GradientBG> -->
  </O3D>
</template>

<script>
import { Tree, RayPlay, PCamera } from '../Reusable'
import { Scene, Color } from 'three'
import { Interaction } from 'three.interaction'

export default {
  name: 'HappyLayout',
  components: {
    ...require('../webgl').default
  },
  mixins: [Tree],
  data () {
    return {
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

    this.scene.background = new Color('#baeaba')

    // prepare camera
    this.camera = new PCamera({ base: this.lookup('base'), element: this.lookup('element') })
    this.camera.position.z = 100
    this.rayplay = new RayPlay({ mounter: this.lookup('element'), base: this.lookup('base'), camera: this.camera })

    this.scene.add(this.o3d)

    this.interaction = new Interaction(this.lookup('renderer'), this.scene, this.camera, {
      autoAttach: true,
      autoPreventDefault: false,
      interactionFrequency: 1
    })
    this.interaction.setTargetElement(this.lookup('element'))

    this.$parent.$emit('scene', this.scene)
    this.$parent.$emit('camera', this.camera)

    this.limit = {
      direction: 'horizontal',
      canRun: true,
      y: 1
    }

    // this.scroller = makeScroller({ base: this.lookup('base'), mounter: this.lookup('element'), limit: this.limit, onMove: () => { this.$emit('onMove') } })

    let looper = () => {
      this.layouts = {
        ball: {
        }
      }
    }

    this.lookup('base').onLoop(looper)
  }
}
</script>

<style>

</style>
