<template>
  <div>
    <O3D :animated="true" layout="cross" @o3d="setup">
    </O3D>
    <slot></slot>
  </div>
</template>

<script>
import { Tree, ShaderCube } from '../../Reusable'
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
      // let cubeLoader = new CubeTextureLoader()

      let load = (loader, url) => {
        return new Promise((resolve) => {
          loader.load(url, (group) => {
            resolve(group)
          })
        })
      }
      let shaderCube = new ShaderCube({ renderer: this.lookup('renderer'), loop: this.lookup('base').onLoop })

      Matcap.brown = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/white.png')) })
      Matcap.silver = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/silver.png')) })
      // Matcap.pedals = new MeshMatcapMaterial({ color: 0xffffff, side: DoubleSide, matcap: texLoader.load(require('./matcap/pink.jpg')) })

      let kn = 'holy-cross'
      let sdk = this.lookup('sdk')
      sdk.onStubGroup(kn, (stub) => {
        this.stub[kn] = stub
      })

      this.lookup('base').onLoop(() => {
        let setting = this.stub[kn]
        let rotation = setting['holy-cross-rotation']
        let translate = setting['holy-cross-translate']
        let scale = setting['holy-cross-scale']
        // let time = window.performance.now() * 0.001
        this.layouts = {
          cross: {
            rx: `${rotation.x - 50.0} / 100.0 * ${Math.PI}`,
            ry: `${rotation.y - 50.0} / 100.0 * ${Math.PI}`,
            rz: `${rotation.z - 50.0} / 100.0 * ${Math.PI}`,

            px: `${translate.x - 50.0} / 100.0 * screen.min`,
            py: `${translate.y - 50.0} / 100.0 * screen.min`,
            pz: `${translate.z - 50.0} / 100.0 * screen.min`,

            sx: `${scale} / 10`,
            sy: `${scale} / 10`,
            sz: `${scale} / 10`
          }
        }
      })

      this.$on('init', async () => {
        // eslint-disable-next-line
        Matcap.cherryBlossom = await load(fbxLoader, require('file-loader!./fbx/holy-cross.fbx').default)
        let root1 = Matcap.cherryBlossom
        // console.log(root1)
        root1.traverse((item) => {
          if (item.isMesh) {
            // console.log(item.name)
            if (item.name.indexOf('Cube') !== -1) {
              item.material = Matcap.silver
              item.material = shaderCube.out.material
              // item.visible = false
              // let itemnew = new Refractor(item.geometry, {
              //   color: 0xffff99,
              //   textureWidth: 512,
              //   textureHeight: 512, // * camera.aspect,
              //   shader: FastBlurShader
              // })
              // itemnew.position.copy(item.position)
              // itemnew.scale.copy(item.scale)
              // itemnew.rotation.copy(item.rotation)
              // itemnew.material.uniforms['tDudv'].value = new TextureLoader().load(require('./tex/waterdudv.jpg'))
              // item.parent.add(itemnew)
              // this.lookup('base').onLoop(() => {
              //   itemnew.material.uniforms['time'].value = window.performance.now() * 0.001
              // })
            }
            // if (item.name.indexOf('Sphere') !== -1) {
            //   item.material = Matcap.silver
            // }
            if (item.name.indexOf('BezierCurve') !== -1) {
              item.material = shaderCube.out.material
            }
          }
        })

        this.grouper.add(root1)
        this.grouper.scale.x = 0.2
        this.grouper.scale.y = 0.2
        this.grouper.scale.z = 0.2

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
