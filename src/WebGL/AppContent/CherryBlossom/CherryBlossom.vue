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
    // let div = document.createElement('div')
    // Cache.painter = Cache.painter || makePaintCanvas({ pixel: 16, sdk: this.lookup('sdk'), setting: 'flower-pedals', domElement: div, base: this.lookup('base') })

    // let painter = Cache.painter

    // Cache.painterCube = Cache.painterCube || new CubeTexture([
    //   painter.canvas,
    //   painter.canvas,
    //   painter.canvas,
    //   painter.canvas,
    //   painter.canvas,
    //   painter.canvas
    // ])

    // let cube = Cache.painterCube

    // this.lookup('base').onLoop(() => {
    //   cube.needsUpdate = true
    // })
    Cache.brown = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/brown.png')) })
    Cache.yellow = new MeshMatcapMaterial({ color: 0xffd743, side: DoubleSide, matcap: texLoader.load(require('./matcap/bright-yellow.png')) })
    // Cache.pedals = new MeshBasicMaterial({ color: 0xffffff, opacity: 1, transparent: true, side: DoubleSide, envMap: cube })
    Cache.pedals = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/pink.jpg')) })
    // Cache.silver = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/silver.png')) })

    // let uniforms = {
    //   matcap: { value: texLoader.load(require('./matcap/brown.png')) },
    //   time: { value: 0 },
    //   sceneRect: { value: new Vector2() }
    // }
    // let rainbowCloudMaterial = new RawShaderMaterial({
    //   // eslint-disable-next-line
    //   vertexShader: require('raw-loader!./glsl/matcap-fbm.vs.glsl').default,
    //   // eslint-disable-next-line
    //   fragmentShader: require('raw-loader!./glsl/matcap-fbm.fs.glsl').default,
    //   uniforms,
    //   transparent: true
    // })
    // this.lookup('base').onLoop(() => {
    //   uniforms.time.value = window.performance.now() * 0.001
    // })
    // this.lookup('base').onResize(async () => {
    //   let element = this.lookup('element')
    //   let elRect = element.getBoundingClientRect()
    //   uniforms.sceneRect.value = new Vector2(elRect.width, elRect.height)
    //   // let screen = await this.getScreen()
    //   // let geo = new PlaneBufferGeometry(screen.width, screen.height, 20, 20)
    //   // mesh.geometry = geo
    // })

    // let cursorMatcap = await new Promise((resolve) => {
    //   let loader = new TextureLoader()
    //   // eslint-disable-next-line
    //   loader.load(require('./matcap/silver.png'), (obj) => {
    //     let matcap = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
    //     resolve(matcap)
    //   })
    // })

    let cursorMesh = new Mesh(
      new IcosahedronBufferGeometry(25, 0),
      Cache.yellow
    )
    this.o3d.add(cursorMesh)

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
      this.o3d.add(this.flower1)
      this.o3d.remove(cursorMesh)
      this.$emit('ready')
    })

    this.$emit('init')
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
