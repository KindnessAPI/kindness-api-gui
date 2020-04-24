<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { PlaneBufferGeometry, TextureLoader, Vector2 } from 'three'
import { Refractor } from 'three/examples/jsm/objects/Refractor'
import { FastBlurShader } from './FastBlurShader'
import { LensBlurShader } from './LensBlurShader'

let loader = new TextureLoader()

export default {
  name: 'LensArea',
  mixins: [Tree],
  props: {
    blur: {
      default: 0.0
    },
    dudv: {
      default: 'cross-2'
    },
    color: {
      default: 0x999999
    }
  },
  components: {
    ...require('../../webgl')
  },
  data () {
    return {
      FastBlurShader,
      LensBlurShader
    }
  },
  mounted () {
    // let RES_SIZE = 1024

    this.$on('init', async () => {
      let dpi = window.devicePixelRatio || 1.0 // ((/(iPad|iPhone|iPod|Apple)/g).test(navigator.userAgent)) && window.innerWidth > 767 ? 1 : 2
      let element = this.lookup('element') || this.lookup('renderer').domElement
      let box = element.getBoundingClientRect()
      // let camera = this.lookup('camera')
      let screen = await this.getScreen()
      let geo = new PlaneBufferGeometry(screen.width, screen.height, 4, 4)
      let item = new Refractor(geo, {
        color: this.color,
        textureWidth: box.width * dpi,
        textureHeight: box.height * dpi, // * camera.aspect,
        shader: FastBlurShader
      })

      if (this.dudv === 'diamond') {
        item.material.uniforms['tDudv'].value = loader.load(require('./tex/diamond.jpg'))
      } else if (this.dudv === 'water') {
        item.material.uniforms['tDudv'].value = loader.load(require('./tex/waterdudv.jpg'))
      } else if (this.dudv === 'cube') {
        item.material.uniforms['tDudv'].value = loader.load(require('./tex/cube.jpg'))
      } else if (this.dudv === 'cross') {
        item.material.uniforms['tDudv'].value = loader.load(require('./tex/cross.jpg'))
      } else if (this.dudv === 'cross-2') {
        item.material.uniforms['tDudv'].value = loader.load(require('./tex/cross-2.jpg'))
      } else if (this.dudv === 'flower') {
        item.material.uniforms['tDudv'].value = loader.load(require('./tex/flower.jpg'))
      } else if (this.dudv === 'cube-2') {
        item.material.uniforms['tDudv'].value = loader.load(require('./tex/cube-2.png'))
      } else {
        item.material.uniforms['tDudv'].value = loader.load(require('./tex/waterdudv.jpg'))
      }

      item.material.uniforms['resolution'].value = new Vector2(box.width, box.height)

      this.o3d.children.forEach((v) => {
        this.o3d.remove(v)
      })
      this.o3d.add(item)

      this.lookup('base').onLoop(() => {
        // item.rotation.x += 0.01
        // item.rotation.y += 0.01
        // item.rotation.z += 0.01

        if (item.material.uniforms['blur']) {
          item.material.uniforms['blur'].value = this.blur
        }
        item.material.uniforms['time'].value = window.performance.now() * 0.001
      })
    })
    this.lookup('base').onResize(() => {
      this.$emit('init')
    })
    this.$nextTick(() => {
      this.$emit('init')
    })
  },
  beforeDestroy () {
    this.o3d.children.forEach((v) => {
      this.o3d.remove(v)
    })
  }
}
</script>

<style>
</style>
