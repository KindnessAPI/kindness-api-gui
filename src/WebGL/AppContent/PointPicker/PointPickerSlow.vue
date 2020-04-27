<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { WebGLRenderTarget, Vector2, Points, ShaderMaterial, BufferGeometry, Float32BufferAttribute, Color, DoubleSide } from 'three'

// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'

export default {
  name: 'StarKindnessWords',
  mixins: [Tree],
  props: {
  },
  components: {
    ...require('../../webgl')
  },
  data () {
    return {
      hit: false,
      open: false
    }
  },
  async mounted () {
    var cx = 40
    var cy = 40
    let offsetX = (cx - 1) / 2
    let offsetY = (cy - 1) / 2
    var total = cx * cy
    let uniforms = {
      time: { value: 0 }
    }
    this.lookup('base').onLoop(() => {
      uniforms.time.value = window.performance.now() * 0.001
    })
    // var pickingData = []
    // var pickingScene = new Scene()
    var scene = this.lookup('scene')
    var camera = this.lookup('camera')
    var renderer = this.lookup('renderer')
    var mouse = new Vector2(0, 0)
    let vertexShared = `
      varying vec3 vColor;
      attribute vec3 color;
      uniform float time;
      void main (void) {
        vColor = color;
        vec3 nPos = position;
        nPos *= 14.0;
        nPos.z += sin(nPos.x * 0.01 + time) * 20.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
        gl_PointSize = 50.0;
      }
    `
    let fsPick = `
      varying vec3 vColor;
      void main (void) {
        if (length(gl_PointCoord.xy - 0.5) < 0.5) {
          gl_FragColor = vec4(vColor, 1.0);
        }
      }
    `
    let fsDisplay = `
      varying vec3 vColor;
      void main (void) {
        if (length(gl_PointCoord.xy - 0.5) < 0.5) {
          gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), vColor.z * 0.0 + 1.0);
        }
      }
    `
    var pickingMaterial = new ShaderMaterial({
      uniforms,
      transparent: false,
      side: DoubleSide,
      vertexShader: vertexShared,
      fragmentShader: fsPick
    })
    var displayMaterial = new ShaderMaterial({
      uniforms,
      transparent: false,
      side: DoubleSide,
      vertexShader: vertexShared,
      fragmentShader: fsDisplay
    })

    var geo = new BufferGeometry()
    var positions = []
    var colors = []

    let mapper = new Map()
    let prepGeo = () => {
      let idx = 0
      for (let y = 0; y < cy; y++) {
        for (let x = 0; x < cx; x++) {
          positions.push(offsetX - x, offsetY - y, 0)
          mapper.set(idx + '', {
            x,
            y,
            cx,
            cy,
            px: offsetX - x,
            py: offsetY - y
          })
          idx++
        }
      }
      geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
      var color = new Color()
      for (var i = 0; i < total; i++) {
        color.setHex(i)
        colors.push(color.r, color.g, color.b)
      }
      geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
    }

    prepGeo()

    this.$on('hitID', (v) => {
      console.log(v)
      this.$emit('hit', { length: total, idx: v })
    })

    var pickPTs = new Points(geo, pickingMaterial)
    this.o3d.add(pickPTs)

    let displayPTs = new Points(geo, displayMaterial)
    this.o3d.add(displayPTs)

    let mouseDown = false
    // let rayhitID = false
    // let hoverID = false

    let onUpdateMouse = (pt) => {
      let rect = this.lookup('element').getBoundingClientRect()

      mouse.x = (pt.pageX - rect.left)// * 2 - 1
      mouse.y = (pt.pageY - rect.top)// * 2 + 1
    }

    this.lookup('element').addEventListener('mousemove', (evt) => {
      evt.preventDefault()
      onUpdateMouse(evt)
    }, { passive: false })

    this.lookup('element').addEventListener('touchmove', (evt) => {
      evt.preventDefault()
      if (evt.touches[0]) {
        onUpdateMouse(evt.touches[0])
      }
    }, { passive: false })

    this.lookup('element').addEventListener('touchend', (evt) => {
      mouseDown = false
    }, { passive: false })
    this.lookup('element').addEventListener('mouseup', (evt) => {
      mouseDown = false
    }, { passive: false })

    this.lookup('element').addEventListener('touchstart', (evt) => {
      mouseDown = true
      evt.preventDefault()
      if (evt.touches[0]) {
        onUpdateMouse(evt.touches[0])
      }
    }, { passive: false })
    this.lookup('element').addEventListener('mousedown', (evt) => {
      mouseDown = true
      evt.preventDefault()
      onUpdateMouse(evt)
    }, { passive: false })
    console.log(mouseDown)

    let element = this.lookup('element')
    let rect = element.getBoundingClientRect()
    let dpi = renderer.getPixelRatio()
    let renderTarget = new WebGLRenderTarget(rect.width * dpi, rect.height * dpi, {})
    let hitID = false
    var pick = () => {
      dpi = renderer.getPixelRatio()

      // set the viewport
      // var left = rect.left
      // var width = rect.right - rect.left
      // var height = rect.bottom - rect.top
      // var bottom = renderer.domElement.clientHeight - rect.bottom
      var offX = mouse.x * dpi
      var offY = mouse.y * dpi

      pickPTs.visible = true
      displayPTs.visible = false
      renderer.setRenderTarget(renderTarget)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      pickPTs.visible = false
      displayPTs.visible = true

      var pixelBuffer = new Uint8Array(4)
      renderer.readRenderTargetPixels(renderTarget, rect.width * dpi - offX, rect.height * dpi - offY, 1, 1, pixelBuffer)
      // console.log(pixelBuffer[0], pixelBuffer[1], pixelBuffer[2])
      var id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2])
      if (mapper.has(id + '')) {
        if (hitID !== id) {
          this.$emit('hitID', id)
        }
        hitID = id
      } else {
        this.$emit('hitID', false)
      }
    }

    this.lookup('base').onLoop(() => {
      pick()
    })
    this.$emit('hit', { length: total, idx: false })
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
