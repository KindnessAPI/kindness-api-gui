<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { MeshMatcapMaterial, DoubleSide, Object3D, TextureLoader, IcosahedronBufferGeometry, Mesh } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'

let texLoader = new TextureLoader()
let fbxLoader = new FBXLoader()

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
  async mounted () {
    // let cubeLoader = new CubeTextureLoader()
    let load = (loader, url) => {
      return new Promise((resolve) => {
        loader.load(url, (group) => {
          resolve(group)
        })
      })
    }
    Cache.brown = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/brown.png')) })
    Cache.yellow = new MeshMatcapMaterial({ color: 0xffd743, side: DoubleSide, matcap: texLoader.load(require('./matcap/bright-yellow.png')) })
    Cache.pedals = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/pink.jpg')) })

    let loadingMesh = new Mesh(
      new IcosahedronBufferGeometry(25, 0),
      Cache.pedals
    )
    this.o3d.add(loadingMesh)

    this.$on('init', async () => {
      // eslint-disable-next-line
      Cache.cherryBlossom = await load(fbxLoader, require('file-loader!./fbx/flower1.fbx').default)
      let root1 = Cache.cherryBlossom
      // console.log(root1)
      root1.traverse((item) => {
        if (item.isMesh) {
          // console.log(item.name)
          if (item.name.indexOf('Plane') !== -1) {
            item.material = Cache.pedals
          }
          if (item.name.indexOf('Sphere') !== -1) {
            item.material = Cache.yellow
          }
          if (item.name.indexOf('Circle') !== -1) {
            item.material = Cache.brown
          }
        }
      })

      this.flower1.add(root1)
      this.flower1.scale.x = 0.234
      this.flower1.scale.y = 0.234
      this.flower1.scale.z = 0.234

      setTimeout(() => {
        this.o3d.add(this.flower1)
        this.o3d.remove(loadingMesh)
        this.$emit('ready')
      }, 500)
    })

    this.$emit('init')
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
