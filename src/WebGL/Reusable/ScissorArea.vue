<template>
  <div ref="dom">
    <slot class="full" name="dom"></slot>
    <slot name="o3d" @scene="scene = $event" @camera="camera = $event"></slot>
  </div>
</template>

<script>
import { Tree, getID } from '../Reusable'
export default {
  props: {
    render: {
      default: true
    },
    area: {
      default () {
        return getID()
      }
    }
  },
  name: 'ScissorArea',
  mixins: [Tree],
  components: {
    ...require('../webgl').default
  },
  data () {
    return {
      composer: false,
      element: false,
      scene: false,
      camera: false
    }
  },
  watch: {
    render () {
      this.tryHook()
    }
  },
  created () {
    this.$on('scene', (v) => {
      this.scene = v
      this.tryHook()
    })
    this.$on('camera', (v) => {
      this.camera = v
      this.tryHook()
    })
    this.$on('composer', (v) => {
      this.composer = v
      this.tryHook()
    })
  },
  mounted () {
    this.element = this.$refs.dom
    this.tryHook()
  },
  methods: {
    tryHook () {
      if (this.scene && this.camera && this.element) {
        let aeras = this.lookup('areas')
        aeras[this.area] = {
          render: this.render,
          element: this.element,
          scene: this.scene,
          camera: this.camera,
          composer: this.composer,
          clean: () => {
            this.scene.traverse((item) => {
              if (item.dispose) {
                item.dispose()
                console.log('item disposed')
              }
            })
          }
        }
      }
    }
  },
  beforeDestroy () {
    let areas = this.lookup('areas')
    for (let areaKN in areas) {
      let area = areas[areaKN]
      area.clean()
    }
    delete areas[this.area]
  }
}
</script>

<style>

</style>
