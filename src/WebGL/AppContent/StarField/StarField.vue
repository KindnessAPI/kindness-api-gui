<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
// import { Points, Color, Scene, Camera, Vector2, ClampToEdgeWrapping, LinearFilter, RGBAFormat, WebGLRenderTarget, BufferAttribute, BufferGeometry, PlaneBufferGeometry, MeshBasicMaterial, Mesh, Vector3, ShaderMaterial } from 'three'
import { MeshBasicMaterial, PlaneBufferGeometry, Mesh, RGBAFormat, WebGLRenderTarget, LinearFilter, ClampToEdgeWrapping, ShaderMaterial, Color, Scene, Camera, Points, BufferGeometry, BufferAttribute, Vector2 } from 'three'
import { GPUComputationRenderer } from './GPGPU'

// import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
/* eslint-disable import/no-webpack-loader-syntax */

// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'
export default {
  name: 'StarField',
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
    this.$on('init', async () => {
      let screen = await this.getScreen()

      let SIM_X = 512
      let SIM_Y = 512

      let renderer = this.lookup('renderer')
      // let scene = this.lookup('scene')
      // scene.background = new Color('#fafafa')

      let gpuCompute = new GPUComputationRenderer(SIM_X, SIM_Y, renderer)
      var error = gpuCompute.init()
      if (error !== null) {
        console.error(error)
      }
      let i = 0
      let onLoop = this.lookup('base').onLoop
      let resizer = this.lookup('base').onResize
      let fns = {}
      onLoop(() => {
        for (var kn in fns) {
          fns[kn]()
        }
      })
      let loop = (v) => {
        fns[Math.random() + ''] = v
      }

      let computeUniforms = {
        time: { value: 0 },
        lastValue: { value: null },
        u_speed_factor: { value: 35.0 },
        u_drop_rate: { value: 38.25 / 500.0 },
        u_drop_rate_bump: { value: 36.18 / 500.0 },
        u_tail_amount: { value: 25.21 / 100.0 }
      }

      loop(() => {
        computeUniforms.time.value = window.performance.now() * 0.001
      })

      let comptueCode = require('raw-loader!./glsl-field/compute-shader.frag').default
      var computeMaterial = gpuCompute.createShaderMaterial(comptueCode, computeUniforms)

      var rttA = gpuCompute.createRenderTarget()
      var rttB = gpuCompute.createRenderTarget()
      var rtts = [rttA, rttB]

      loop(() => {
        computeMaterial.uniforms.time.value = window.performance.now() * 0.0001

        if (i % 2 === 0) {
          computeMaterial.uniforms.lastValue.value = rtts[1].texture
          gpuCompute.doRenderTarget(computeMaterial, rtts[0])
        } else {
          computeMaterial.uniforms.lastValue.value = rtts[0].texture
          gpuCompute.doRenderTarget(computeMaterial, rtts[1])
        }
      })

      let makeDisplayMaterial = () => {
        let vertexShader = require('raw-loader!./glsl-field/display-vertex.vert').default
        let fragmentShader = require('raw-loader!./glsl-field/display-fragment.frag').default
        let material = new ShaderMaterial({
          uniforms: {
            resolution: {
              value: new Vector2(1024, 1024)
            },
            tex: {
              value: null
            },
            time: {
              value: 0
            },
            color: {
              value: new Color('hsl(130, 50%, 50%)')
            }
          },
          transparent: true,
          depthTest: true,
          vertexShader,
          fragmentShader
        })
        loop(() => {
          material.uniforms.time.value = window.performance.now() * 0.001
        })
        resizer(async () => {
          let element = this.lookup('element')
          let rect = element.getBoundingClientRect()
          material.uniforms.resolution.value.x = rect.width
          material.uniforms.resolution.value.y = rect.height
        })
        return material
      }
      let makeGeo = () => {
        let getUVandPosition = () => {
          let newArr = []
          var na = 0
          var idx = 0

          for (var j = 0; j < SIM_Y; j++) {
            for (var i = 0; i < SIM_X; i++) {
              newArr[na + 0] = i / SIM_X
              newArr[na + 1] = j / SIM_Y
              newArr[na + 2] = 0
              na += 3
              idx++
            }
          }
          console.log('total points', idx)
          return new Float32Array(newArr)
        }
        var geometry = new BufferGeometry()
        geometry.setAttribute('position', new BufferAttribute(getUVandPosition(), 3))
        return geometry
      }

      let pts = new Points(makeGeo(), undefined)
      pts.material = makeDisplayMaterial()

      loop(() => {
        if (i % 2 === 0) {
          pts.material.uniforms.tex.value = rtts[0].texture
        } else {
          pts.material.uniforms.tex.value = rtts[1].texture
        }
      })

      // this.o3d.add(pts)

      var craeteScreenRenderTarget = (sizeX, sizeY) => {
        var wrapS = ClampToEdgeWrapping
        var wrapT = ClampToEdgeWrapping

        var minFilter = LinearFilter
        var magFilter = LinearFilter

        var renderTarget = new WebGLRenderTarget(sizeX, sizeY, {
          wrapS: wrapS,
          wrapT: wrapT,
          minFilter: minFilter,
          magFilter: magFilter,
          format: RGBAFormat,
          // type: FloatType,
          stencilBuffer: false,
          depthBuffer: false
        })
        return renderTarget
      }

      // let el = this.lookup('element')
      // let rect = el.getBoundingClientRect()
      let aspect = 1

      resizer(() => {
        aspect = screen.width / screen.height
        if (screen.height > screen.width) {
          aspect = screen.height / screen.width
        }
      })

      let size1D = 768
      var tScreenA = craeteScreenRenderTarget(size1D, size1D)
      var tScreenB = craeteScreenRenderTarget(size1D, size1D)

      let ppScene = new Scene()
      // ppScene.background = new Color('#000000')
      ppScene.add(pts)
      let ppCamera = new Camera()
      let pingpongCode = require('raw-loader!./glsl-field/ping-pong.frag').default

      let pingPongMaterial = gpuCompute.createShaderMaterial(pingpongCode, {
        time: { value: 0.0 },
        u_opacity: { value: 90.49 / 100.0 },
        res: { value: new Vector2(size1D, size1D * aspect) },
        tScreen: { value: null }
      })
      var plane = new Mesh(
        new PlaneBufferGeometry(screen.width, screen.height, 2, 2),
        new MeshBasicMaterial({
          // transparent: true
        })
      )
      this.o3d.add(plane)

      // let THREE = {
      //   ...require('three/examples/jsm/postprocessing/EffectComposer.js'),
      //   ...require('three/examples/jsm/postprocessing/RenderPass.js'),
      //   ...require('three/examples/jsm/postprocessing/ShaderPass.js'),
      //   ...require('three/examples/jsm/postprocessing/UnrealBloomPass.js')
      // }

      resizer(async () => {
        // let el = this.lookup('element')
        // let rect = el.getBoundingClientRect()
        // tScreenA = craeteScreenRenderTarget(size1D, size1D * aspect)
        // tScreenB = craeteScreenRenderTarget(size1D, size1D * aspect)
        pingPongMaterial.uniforms.res.value.x = size1D
        pingPongMaterial.uniforms.res.value.y = size1D
        this.screen = await this.getScreen()
        plane.geometry = new PlaneBufferGeometry(this.screen.width, this.screen.height, 2, 2)
      })

      loop(() => {
        // renderer.setScissorTest(false)
        let orig = renderer.getRenderTarget()
        // renderer.scissorTest = false
        renderer.autoClear = false
        if (i % 2 === 0.0) {
          renderer.setRenderTarget(tScreenA)
          renderer.render(ppScene, ppCamera)
        } else {
          renderer.setRenderTarget(tScreenB)
          renderer.render(ppScene, ppCamera)
        }
        renderer.setRenderTarget(orig)
        renderer.autoClear = true
        // renderer.setScissorTest(true)
        // renderer.scissorTest = true
      })

      loop(() => {
        pingPongMaterial.uniforms.time.value += 60 / 1000
        pingPongMaterial.uniforms.time.value %= 10.0
        if (i % 2 === 0) {
          // console.log(tScreenA.texture)
          pingPongMaterial.uniforms.tScreen.value = tScreenA.texture
          gpuCompute.doRenderTarget(pingPongMaterial, tScreenB)
        } else {
          pingPongMaterial.uniforms.tScreen.value = tScreenB.texture
          gpuCompute.doRenderTarget(pingPongMaterial, tScreenA)
        }
      })

      loop(() => {
        if (i % 2 === 0) {
          plane.material.map = tScreenA.texture
        } else {
          plane.material.map = tScreenB.texture
        }
        plane.material.needsUpdate = true
      })

      // test preview
      // let screen = await this.getScreen()
      // let previewPlane = new PlaneBufferGeometry(screen.width, screen.height, 2, 2)
      // let previewMaterial = new MeshBasicMaterial({ color: 0xffffff })
      // let previewMesh = new Mesh(previewPlane, previewMaterial)
      // this.o3d.add(previewMesh)

      // loop(() => {
      //   if (i % 2 === 0) {
      //     previewMaterial.map = rtts[1].texture
      //   } else {
      //     previewMaterial.map = rtts[0].texture
      //   }
      //   previewMaterial.needsUpdate = true
      // })

      loop(() => {
        i++
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
