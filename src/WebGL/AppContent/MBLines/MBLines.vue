<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { DoubleSide, Object3D, ShaderMaterial, Color, Vector2 } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

let fbx = new FBXLoader()

export default {
  name: 'MBLines',
  mixins: [Tree],
  props: {
    depth: {
      default: 20
    },
    blur: {},
    dudv: {},
    color: {
      default: 0x999999
    }
  },
  components: {
    ...require('../../webgl')
  },
  data () {
    return {
      settings: {},
      flower1: new Object3D()
    }
  },
  mounted () {
    let load = (loader, url) => {
      return new Promise((resolve) => {
        loader.load(url, (group) => {
          resolve(group)
        })
      })
    }

    this.$on('init', async () => {
      // eslint-disable-next-line
      let data = await load(fbx, require('file-loader!./media/mb-lines.fbx').default)
      data.traverse((item) => {
        if (item.isMesh) {
          let uniforms = {
            time: {
              value: 0
            },
            radius: {
              value: 0
            },
            resolution: {
              value: new Vector2(1024, 1024)
            },
            myColor: {
              value: new Color(Math.random() * 0xffffff)
            }
          }
          this.lookup('base').onLoop(() => {
            uniforms.time.value = window.performance.now() * 0.001
          })
          this.lookup('base').onResize(() => {
            let rect = this.lookup('element').getBoundingClientRect()
            uniforms.resolution.value = new Vector2(rect.width, rect.height)
          })
          let coolShade = new ShaderMaterial({
            side: DoubleSide,
            uniforms,
            transparent: true,
            // eslint-disable-next-line
            vertexShader: require('raw-loader!./glsl/mb-lines-v.glsl').default,
            // eslint-disable-next-line
            fragmentShader: require('raw-loader!./glsl/mb-lines-f.glsl').default
          })

          item.geometry.computeBoundingSphere()
          uniforms.radius.value = item.geometry.boundingSphere.radius * 100.0
          item.material = coolShade
          item.material.needsUpdate = true
          item.needsUpdate = true
        }
        item.rotation.x = Math.PI
        item.scale.x = 65
        item.scale.y = 65
        item.scale.z = 1
      })
      this.o3d.add(data)
    })

    this.$emit('init')
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
