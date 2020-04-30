<template>
  <div>
    <O3D :animated="true" layout="church" @o3d="setup">
    </O3D>

    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { MeshMatcapMaterial, DoubleSide, Object3D, TextureLoader } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'

let texLoader = new TextureLoader()
let fbxLoader = new FBXLoader()

let Matcap = {}

export default {
  name: 'HolyCross',
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
    O3D: require('../../Reusable/O3D').default,
    ...require('../../webgl')
  },
  data () {
    return {
      stub: {},
      grouper: new Object3D()
    }
  },
  methods: {
    setup (mounter3D) {
      let load = (loader, url) => {
        return new Promise((resolve) => {
          loader.load(url, (group) => {
            resolve(group)
          })
        })
      }
      // let shaderCube = new ShaderCube({ renderer: this.lookup('renderer'), loop: this.lookup('base').onLoop })

      // Matcap.silver = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/silver.png')) })
      Matcap.floor = new MeshMatcapMaterial({ color: 0xe1c68f, side: DoubleSide, matcap: texLoader.load(require('./matcap/white.png')) })
      Matcap.celing = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/bright-yellow.png')) })
      // Matcap.pedals = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/pink.jpg')) })

      let kn = 'holy-church'
      let sdk = this.lookup('sdk')
      sdk.onStubGroup(kn, (stub) => {
        this.stub[kn] = stub
      })

      this.lookup('base').onLoop(() => {
        let setting = this.stub[kn]
        let rotation = setting['holy-church-rotation']
        let translate = setting['holy-church-translate']
        let scale = setting['holy-church-scale']
        // let time = window.performance.now() * 0.001
        this.layouts = {
          church: {
            rx: `${rotation.x - 50.0} / 100.0 * 2 * ${Math.PI}`,
            ry: `${rotation.y - 50.0} / 100.0 * 2 * ${Math.PI}`,
            rz: `${rotation.z - 50.0} / 100.0 * 2 * ${Math.PI}`,

            px: `${translate.x - 50.0} / 100.0 * 2000.0`,
            py: `${translate.y - 50.0} / 100.0 * 2000.0`,
            pz: `${translate.z - 50.0} / 100.0 * 2000.0`,

            sx: `${scale} / 10`,
            sy: `${scale} / 10`,
            sz: `${scale} / 10`
          }
        }
      })

      this.$on('init', async () => {
        // eslint-disable-next-line
        let root1 = await load(fbxLoader, require('file-loader!./fbx/church.fbx').default)
        // console.log(root1)
        root1.traverse((item) => {
          if (item.isMesh) {
            // console.log(item.name)
            if (item.name.indexOf('Cube') !== -1) {
              item.material = Matcap.celing
            }
            // if (item.name.indexOf('Sphere') !== -1) {
            //   item.material = Matcap.silver
            // }
            // if (item.name.indexOf('BezierCurve') !== -1) {
            //   item.material = Matcap.floor
            // }
            if (item.name.indexOf('Plane') !== -1) {
              item.material = Matcap.celing
            }
          }
        })

        this.grouper.add(root1)
        this.grouper.scale.x = 0.1
        this.grouper.scale.y = 0.1
        this.grouper.scale.z = 0.1

        setTimeout(() => {
          mounter3D.add(this.grouper)
          this.$emit('ready')
        }, 500)
      })

      this.$emit('init')
    }
  },
  async mounted () {

  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
