<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree, ShaderCube } from '../../Reusable'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { MeshMatcapMaterial, TextureLoader, DoubleSide } from 'three'

let loaderFBX = new FBXLoader()
let loaderTex = new TextureLoader()
export default {
  name: 'Spacewalk',
  mixins: [Tree],
  props: {
    shaderCube: {
      default: false
    },
    mode: {}
  },
  components: {
    ...require('../../webgl')
  },
  methods: {
    configFBX ({ fbx, mats }) {
      console.log(fbx)
      this.o3d.add(fbx)
      fbx.traverse((item) => {
        if (item.isMesh) {
          // console.log(item)
          item.material = mats.shaderCubeMat
          // 20 , 15, 10
          // foot walker
          if (item.name === 'Mesh020') {
            item.material = mats.shaderCubeMat
          }
          if (item.name === 'Mesh015') {
            item.material = mats.shaderCubeMat
          }
          if (item.name === 'Mesh010') {
            item.material = mats.shaderCubeMat
          }

          // pipes
          if (item.name === 'Mesh019') {
            item.material = mats.shaderCubeMat
          }
          if (item.name === 'Mesh016') {
            item.material = mats.shaderCubeMat
          }
          if (item.name === 'Mesh003') {
            item.material = mats.shaderCubeMat
          }

          // walls
          if (item.name === 'Mesh018') {
            item.material = mats.silver
          }
          if (item.name === 'Mesh017') {
            item.material = mats.silver
          }
          if (item.name === 'Mesh013') {
            item.material = mats.silver
          }
          item.material.side = DoubleSide
        }
      })
    },
    async loadStuff () {
      let shaderCube = this.shaderCube || new ShaderCube({ renderer: this.lookup('renderer'), loop: this.lookup('base').onLoop })

      let all = await Promise.all([
        new Promise((resolve) => {
          // eslint-disable-next-line
          loaderFBX.load(require('file-loader!./fbx/spaceship-walk.fbx').default, (v) => {
            resolve(v)
          })
        }),
        new Promise((resolve) => {
          // eslint-disable-next-line
          loaderTex.load(require('./matcap/red-2.jpg'), (obj) => {
            let result = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
            resolve(result)
          })
        }),
        new Promise((resolve) => {
          // eslint-disable-next-line
          loaderTex.load(require('./matcap/pink-2.jpg'), (obj) => {
            let result = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
            resolve(result)
          })
        }),
        new Promise((resolve) => {
          // eslint-disable-next-line
          loaderTex.load(require('./matcap/silver.png'), (obj) => {
            let result = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
            resolve(result)
          })
        }),
        new Promise((resolve) => {
          // eslint-disable-next-line
          loaderTex.load(require('./matcap/yellow.jpg'), (obj) => {
            let result = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
            resolve(result)
          })
        }),
        new Promise((resolve) => {
          // eslint-disable-next-line
          loaderTex.load(require('./matcap/silver.png'), (obj) => {
            let result = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xf4d146, matcap: obj })
            resolve(result)
          })
        })
      ])

      this.configFBX({
        fbx: all[0],
        mats: {
          shaderCubeMat: shaderCube.out.material,
          red2: all[1],
          pink2: all[2],
          silver: all[3],
          yellow: all[4],
          yellow2: all[5]
        }
      })
    }
  },
  mounted () {
    this.loadStuff()
  }
}
</script>

<style>

</style>
