<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { PlaneBufferGeometry, Vector2, Mesh, RawShaderMaterial } from 'three'
// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'
export default {
  name: 'GradientBG',
  mixins: [Tree],
  props: {
  },
  components: {
    ...require('../../webgl')
  },
  data () {
    return {
    }
  },
  mounted () {
    // let RES_SIZE = 1024

    this.$on('init', async () => {
      // let camera = this.lookup('camera')
      let screen = await this.getScreen()
      let geo = new PlaneBufferGeometry(screen.width, screen.height, 20, 20)
      let uniforms = {
        time: { value: 0 },
        sceneRect: { value: new Vector2() }
      }
      let mat = new RawShaderMaterial({
        // eslint-disable-next-line
        vertexShader: require('raw-loader!./glsl/fbm.vs.glsl').default,
        // eslint-disable-next-line
        fragmentShader: require('raw-loader!./glsl/fbm.fs.glsl').default,
        uniforms,
        transparent: true
      })

      let mesh = new Mesh(geo, mat)

      this.lookup('base').onResize(async () => {
        let element = this.lookup('element')
        let elRect = element.getBoundingClientRect()
        uniforms.sceneRect.value = new Vector2(elRect.width, elRect.height)
        let screen = await this.getScreen()
        let geo = new PlaneBufferGeometry(screen.width, screen.height, 20, 20)
        mesh.geometry = geo
      })

      this.o3d.children.forEach((v) => {
        this.o3d.remove(v)
      })
      this.o3d.add(mesh)

      this.lookup('base').onLoop(() => {
        mesh.material.uniforms.time.value = window.performance.now() * 0.001
      })
    })
    this.$emit('init')
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
