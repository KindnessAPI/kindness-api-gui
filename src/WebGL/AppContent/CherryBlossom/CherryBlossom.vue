<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree, makePaintCanvas } from '../../Reusable'
import { MeshBasicMaterial, CubeTexture, DoubleSide, Object3D } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'

let Cache = {}

export default {
  name: 'CherryBlossom',
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
    let fbxLoader = new FBXLoader()
    // let cubeLoader = new CubeTextureLoader()
    let load = (loader, url) => {
      return new Promise((resolve) => {
        loader.load(url, (group) => {
          resolve(group)
        })
      })
    }

    Cache.painter = Cache.painter || makePaintCanvas({ pixel: 64, sdk: this.lookup('sdk'), setting: 'flower-pedals', domElement: this.lookup('element'), base: this.lookup('base') })
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
    let brown = new MeshBasicMaterial({ color: '#4c2a06', side: DoubleSide })
    let yellow = new MeshBasicMaterial({ color: '#ffd743', side: DoubleSide })
    let pedals = new MeshBasicMaterial({ color: 0xffffff, opacity: 1, transparent: true, side: DoubleSide, envMap: cube })
    this.$on('init', async () => {
      // eslint-disable-next-line
      let root1 = await load(fbxLoader, require('file-loader!./fbx/flower1.fbx').default)
      // console.log(root1)
      root1.traverse((item) => {
        if (item.isMesh) {
          console.log(item.name)
          if (item.name.indexOf('Plane') !== -1) {
            item.material = pedals
          }
          if (item.name.indexOf('Sphere') !== -1) {
            item.material = yellow
          }
          if (item.name.indexOf('Circle') !== -1) {
            item.material = brown
          }
        }
      })

      this.flower1.add(root1)
      this.flower1.scale.x = 0.2
      this.flower1.scale.y = 0.2
      this.flower1.scale.z = 0.2
      this.o3d.add(this.flower1)
    })

    this.$emit('init')
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
