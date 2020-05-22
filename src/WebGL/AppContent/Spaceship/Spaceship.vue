<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree, ShaderCubeRefraction } from '../../Reusable'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Object3D } from 'three'
let loaderGLB = new GLTFLoader()
var dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/threejslib/draco/')
loaderGLB.setDRACOLoader(dracoLoader)
// let loaderTex = new TextureLoader()

export default {
  name: 'SpaceStation',
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
    configFBX ({ obj, mats }) {
      // let DirectionalLight = require('three/src/lights/DirectionalLight.js')
      // let HemisphereLight = require('three/src/lights/HemisphereLight.js')
      // this.o3d.add(new DirectionalLight(0xbababa, 0.7))
      // this.o3d.add(new HemisphereLight(0xffffff, 0xbababa, 0.5))

      let group = new Object3D()

      group.add(obj.scene)

      group.scale.multiplyScalar(12)

      group.position.x += 145
      group.rotation.y = Math.PI * 0.5 * 0.5
      group.rotation.x = Math.PI * 0.5 * 0.25

      this.o3d.add(group)
      this.lookup('base').onLoop(() => {
        obj.scene.rotation.x += 0.0023
      })
      obj.scene.traverse((item) => {
        if (item.isMesh) {
          item.material = mats.shaderCubeMat
          // 20 , 15, 10
          // foot walker
          if (item.name.indexOf('engine') !== -1) {
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
        }
      })
    },
    async loadStuff () {
      let shaderCube = this.shaderCube || new ShaderCubeRefraction({ renderer: this.lookup('renderer'), loop: this.lookup('base').onLoop })

      let all = await Promise.all([
        new Promise((resolve) => {
          // eslint-disable-next-line
          loaderGLB.load(require('file-loader!./glb/the-ship.glb').default, (v) => {
            resolve(v)
          })
        })
        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/silver4.jpg'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        //     resolve(result)
        //   })
        // })
        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/red-2.jpg'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        //     resolve(result)
        //   })
        // }),
        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/pink-2.jpg'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        //     resolve(result)
        //   })
        // }),
        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/silver.png'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        //     resolve(result)
        //   })
        // }),
        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/yellow.jpg'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        //     resolve(result)
        //   })
        // }),
        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/silver.png'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xf4d146, matcap: obj })
        //     resolve(result)
        //   })
        // }),
        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/silver2.jpg'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        //     resolve(result)
        //   })
        // }),
        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/silver3.jpg'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        //     resolve(result)
        //   })
        // }),

        // new Promise((resolve) => {
        //   // eslint-disable-next-line
        //   loaderTex.load(require('./matcap/silver5.jpg'), (obj) => {
        //     let result = new MeshMatcapMaterial({ side: DoubleSide, transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        //     resolve(result)
        //   })
        // })
      ])

      this.configFBX({
        obj: all[0],
        mats: {
          shaderCubeMat: shaderCube.out.material
          // white: new MeshPhongMaterial({ side: DoubleSide, color: 0xffffff })
          // silver4: all[1]
          // pink2: all[2],
          // silver: all[3],
          // yellow: all[4],
          // yellow2: all[5],
          // silver2: all[6],
          // silver3: all[7],
          // silver4: all[8],
          // silver5: all[9]
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
