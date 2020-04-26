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
    mode: {}
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

      let SIM_X = 256
      let SIM_Y = 256

      let settings = {
        u_mode: { value: 0 },
        u_opacity: { value: 95.0 / 100.0 },
        u_speed_factor: { value: 80.0 },
        u_drop_rate: { value: 38.25 / 500.0 },
        u_drop_rate_bump: { value: 36.18 / 500.0 },
        u_tail_amount: { value: 100.0 / 100.0 },
        color: { value: new Color('hsl(230, 50%, 70%)') }
      }

      let renderer = this.lookup('renderer')

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
        ...settings
      }

      let modes = {
        'galaxy': 0.0,
        'dotted': 1.0,
        'boxes': 2.0,
        'flow': 3.0,
        'magic': 4.0
      }

      computeUniforms.u_mode.value = modes[this.mode]
      this.$watch('mode', () => {
        computeUniforms.u_mode.value = modes[this.mode] || 0
      })

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
            tex2: {
              value: null
            },
            time: {
              value: 0
            },
            color: settings['color']
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
          pts.material.uniforms.tex2.value = rtts[1].texture
        } else {
          pts.material.uniforms.tex.value = rtts[1].texture
          pts.material.uniforms.tex2.value = rtts[0].texture
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
      var tScreenA = false
      var tScreenB = false

      // let scene = this.lookup('scene')
      // scene.background = new Color('#fafafa')

      let ppScene = new Scene()
      // ppScene.background = new Color('#000')
      // if (scene.background && scene.background.clone) {
      //   ppScene.background = scene.background.clone()
      // }
      ppScene.add(pts)
      let ppCamera = new Camera()
      let pingpongCode = require('raw-loader!./glsl-field/ping-pong.frag').default

      let pingPongMaterial = gpuCompute.createShaderMaterial(pingpongCode, {
        time: { value: 0.0 },
        u_opacity: settings.u_opacity,
        res: { value: new Vector2(1, 1) },
        tScreen: { value: null }
      })
      var plane = new Mesh(
        new PlaneBufferGeometry(screen.width, screen.height, 2, 2),
        new MeshBasicMaterial({
          transparent: true
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
        let dpi = window.devicePixelRatio < 2 ? 2 : window.devicePixelRatio
        let el = this.lookup('element')
        let rect = el.getBoundingClientRect()

        if (tScreenA) {
          tScreenA.dispose()
        }

        if (tScreenB) {
          tScreenB.dispose()
        }

        let resolutionX = dpi * rect.width
        let resolutionY = dpi * rect.height// * rect.height / rect.width

        // resolutionX = resolutionX > 1280 * 2 ? 1280 * 2 : resolutionX
        // resolutionY = resolutionY > 1280 * 2 ? 1280 * 2 : resolutionY

        tScreenA = craeteScreenRenderTarget(resolutionX, resolutionY)
        tScreenB = craeteScreenRenderTarget(resolutionX, resolutionY)
        pingPongMaterial.uniforms.res.value.x = resolutionX // dpi * rect.width
        pingPongMaterial.uniforms.res.value.y = resolutionY /// dpi * rect.height

        let screen = await this.getScreen()
        plane.geometry = new PlaneBufferGeometry(screen.width, screen.height, 2, 2)

        // let dpi = 2
        // let el = this.lookup('element')
        // let rect = el.getBoundingClientRect()
        // if (tScreenA) {
        //   tScreenA.dispose()
        // }
        // if (tScreenB) {
        //   tScreenB.dispose()
        // }
        // tScreenA = craeteScreenRenderTarget(dpi * rect.width, dpi * rect.height)
        // tScreenB = craeteScreenRenderTarget(dpi * rect.width, dpi * rect.height)
        // pingPongMaterial.uniforms.res.value.x = dpi * rect.width
        // pingPongMaterial.uniforms.res.value.y = dpi * rect.height
        // let screen = await this.getScreen()
        // plane.geometry = new PlaneBufferGeometry(screen.width, screen.height, 2, 2)
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

      // // test preview
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
