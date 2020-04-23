<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { Mesh, Object3D, MeshMatcapMaterial, TextureLoader, Vector2, Raycaster, Color, CircleGeometry, MeshBasicMaterial } from 'three'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

// import { Refractor } from 'three/examples/jsm/objects/Refractor'
// import { FastBlurShader } from './FastBlurShader'

// eslint-disable-next-line
let Cache = {}

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
    var raycaster = new Raycaster()
    var mouse = new Vector2(1, 1)

    let heartGeo = await new Promise((resolve) => {
      let loader = new FBXLoader()
      // eslint-disable-next-line
      loader.load(require('file-loader!./fbx/heart.fbx').default, (obj) => {
        resolve(obj.children[0].geometry)
      })
    })

    let colors = {
      red: new Color(0xff0000),
      yellow: new Color(0xffff00)
    }

    let cursorMesh = new Mesh(
      new CircleGeometry(15, 32),
      new MeshBasicMaterial({ color: 0xbababa })
    )
    this.o3d.add(cursorMesh)

    document.documentElement.style.cursor = 'none'
    this.lookup('element').addEventListener('mouseover', () => {
      document.documentElement.style.cursor = ''
    })
    this.lookup('element').addEventListener('mouseleave', () => {
      document.documentElement.style.cursor = ''
    })

    this.lookup('base').onLoop(async () => {
      let screen = await this.getScreen()
      cursorMesh.position.x = mouse.x * screen.width * 0.5
      cursorMesh.position.y = mouse.y * screen.height * 0.5
    })

    let matcaps = {}
    setTimeout(async () => {
      let loader = new TextureLoader()
      loader.load(require('./matcap/red-2.jpg'), (obj) => {
        matcaps.red = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
      })
      loader.load(require('./matcap/pink-2.jpg'), (obj) => {
        matcaps.pink = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
      })
      loader.load(require('./matcap/yellow.jpg'), (obj) => {
        matcaps.yellow = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
      })
    })

    let cx = 25
    let cy = 20
    let total = cx * cy

    let geo = heartGeo
    geo.rotateX(Math.PI * -0.5)

    let idx = 0
    let mapper = new Map()
    let offsetX = (cx - 1) / 2
    let offsetY = (cy - 1) / 2
    let raycasterList = []
    let group = new Object3D()
    this.o3d.add(group)
    for (let y = 0; y < cy; y++) {
      for (let x = 0; x < cx; x++) {
        let mesh = new Mesh(
          geo,
          undefined
        )
        // mesh.instanceMatrix.setUsage(DynamicDrawUsage)
        group.add(mesh)
        let color = new Color('#ffffff')
        raycasterList.push(mesh)
        mapper.set(idx, {
          offsetX,
          offsetY,
          x,
          y,
          cx,
          cy,
          idx,
          total,
          mesh,
          color
        })
        console.log(x, y)
        idx++
      }
    }

    group.rotation.x = Math.PI * 0.5 * -0.85
    let mouseDown = false
    let rayhitID = false
    let hoverID = false

    let onUpdateMouse = (pt) => {
      let rect = this.lookup('element').getBoundingClientRect()

      mouse.x = ((pt.pageX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((pt.pageY - rect.top) / rect.height) * 2 + 1
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

    this.$watch('hit', (nv, ov) => {
      if (nv !== ov) {
        this.$emit('hit', nv)
      }
    })
    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.001

      raycaster.setFromCamera(mouse, this.lookup('camera'))
      let intersection = raycaster.intersectObjects(raycasterList)
      // document.documentElement.style.cursor = 'none'
      cursorMesh.material.color = colors.yellow
      if (intersection[0]) {
        cursorMesh.material.color = colors.red
        // document.documentElement.style.cursor = 'pointer'
        hoverID = intersection[0].object.uuid
        if (mouseDown) {
          rayhitID = intersection[0].object.uuid
        }
      } else {
        hoverID = false
      }

      let idx = 0
      for (let y = 0; y < cy; y++) {
        for (let x = 0; x < cx; x++) {
          let { mesh, color } = mapper.get(idx)

          mesh.position.x = offsetX - x
          mesh.position.y = offsetY - y

          let wavy = Math.sin(time + x * 0.13 + y * 0.13)
          mesh.position.x *= 35
          mesh.position.y *= 35
          mesh.position.z = 40 * wavy

          if (rayhitID === mesh.uuid) {
            mesh.scale.x = 20
            mesh.scale.y = 20
            mesh.scale.z = 20
            if (matcaps.yellow) {
              mesh.material = matcaps.yellow
            }
            this.hit = idx
          } else if (hoverID === mesh.uuid) {
            mesh.scale.x = 4.0 + 10 * Math.abs(wavy)
            mesh.scale.y = 4.0 + 10 * Math.abs(wavy)
            mesh.scale.z = 4.0 + 10 * Math.abs(wavy)
            if (matcaps.pink) {
              mesh.material = matcaps.pink
            }
          } else {
            mesh.scale.x = 2.5 + 10 * Math.abs(wavy)
            mesh.scale.y = 2.5 + 10 * Math.abs(wavy)
            mesh.scale.z = 2.5 + 10 * Math.abs(wavy)
            if (matcaps.red) {
              mesh.material = matcaps.red
              // color.setHSL(offsetX - x + Math.sin(x * 3.14 * 2.0 + time * 0.5), 0.65, 0.65)
              mesh.material.color = color
            }
          }

          mesh.rotation.y = time + wavy // + 0.1 * time * x / cx * y / cy
          mesh.rotation.x = Math.PI * 0.5
          idx++
        }
      }
    })
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
