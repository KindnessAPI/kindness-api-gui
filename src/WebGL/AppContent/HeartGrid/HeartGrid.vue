<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree, getScreen } from '../../Reusable'
import { Mesh, Object3D, MeshMatcapMaterial, TextureLoader, Vector2, Raycaster, Color, IcosahedronBufferGeometry } from 'three'

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

    let starGeo = await new Promise((resolve) => {
      let loader = new FBXLoader()
      // eslint-disable-next-line
      loader.load(require('file-loader!./fbx/star.fbx').default, (obj) => {
        let geo = obj.children[2].geometry
        geo.rotateX(Math.PI * 0.5)
        resolve(geo)
      })
    })
    let heartGeo = await new Promise((resolve) => {
      let loader = new FBXLoader()
      // eslint-disable-next-line
      loader.load(require('file-loader!./fbx/heart.fbx').default, (obj) => {
        let geo = obj.children[0].geometry
        // geo.rotateX(-Math.PI)
        resolve(geo)
      })
    })

    let cursorMatcap = await new Promise((resolve) => {
      let loader = new TextureLoader()
      // eslint-disable-next-line
      loader.load(require('./matcap/silver.png'), (obj) => {
        let matcap = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
        resolve(matcap)
      })
    })

    let colors = {
      red: new Color('#ff0000'),
      yellow: new Color('#ffff00'),
      white: new Color('#ffffff'),
      gray: new Color('#bababa')
    }

    let cursorMesh = new Mesh(
      new IcosahedronBufferGeometry(0.6, 0),
      cursorMatcap
    )
    cursorMesh.visible = false

    cursorMesh.scale.x = 3
    cursorMesh.scale.y = 3
    cursorMesh.scale.z = 3

    this.o3d.add(cursorMesh)

    document.documentElement.style.cursor = 'none'
    this.lookup('element').addEventListener('mouseover', () => {
      document.documentElement.style.cursor = 'none'
    })
    this.lookup('element').addEventListener('mouseleave', () => {
      document.documentElement.style.cursor = ''
    })

    let camera = this.lookup('camera')
    this.lookup('base').onLoop(async () => {
      let screen = getScreen({ camera, depth: camera.position.z * 0.9 })
      cursorMesh.position.x = mouse.x * screen.width * 0.5
      cursorMesh.position.y = mouse.y * screen.height * 0.5
      cursorMesh.position.z = camera.position.z * 0.9
      cursorMesh.rotation.x += 0.01
      cursorMesh.rotation.y += 0.01
      cursorMesh.rotation.z += 0.01
    })

    let matcaps = {}
    setTimeout(async () => {
      let loader = new TextureLoader()
      loader.load(require('./matcap/red-2.jpg'), (obj) => {
        matcaps.red = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
      })
      loader.load(require('./matcap/pink.jpg'), (obj) => {
        matcaps.pink1 = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
      })
      loader.load(require('./matcap/pink-2.jpg'), (obj) => {
        matcaps.pink2 = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
      })
      loader.load(require('./matcap/yellow.jpg'), (obj) => {
        matcaps.yellow = new MeshMatcapMaterial({ transparent: true, opacity: 1.0, color: 0xffffff, matcap: obj })
      })
    })
    let cx = 10
    let cy = 15 * this.screen.width / this.screen.height
    let total = cx * cy

    let geo = starGeo

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
    // group.rotation.y = Math.PI
    group.rotation.x = Math.PI * -0.35
    group.rotation.z = Math.PI * 0.5
    group.position.y = -150
    group.position.z = -350

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
      cursorMesh.visible = true
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
        this.$emit('hit', { index: nv, length: total })
      }
    })

    this.lookup('base').onLoop(() => {
      let time = window.performance.now() * 0.001

      raycaster.setFromCamera(mouse, this.lookup('camera'))
      let intersection = raycaster.intersectObjects(raycasterList)
      // document.documentElement.style.cursor = 'none'
      cursorMesh.material.color = colors.gray
      if (intersection[0]) {
        cursorMesh.material.color = colors.white
        // document.documentElement.style.cursor = 'pointer'
        hoverID = intersection[0].object.uuid
        if (mouseDown) {
          rayhitID = intersection[0].object.uuid
        }
      } else {
        hoverID = false
      }

      let PI = Math.PI
      // let sin = Math.sin
      // let cos = Math.cos
      // let tan = Math.tan
      let idx = 0
      for (let y = 0; y < cy; y++) {
        for (let x = 0; x < cx; x++) {
          let { mesh, color } = mapper.get(idx)

          mesh.position.x = offsetX - x
          mesh.position.y = offsetY - y

          let ee = idx / total

          // let radius = 350 * (ee) * 3.0
          // let deep = -600
          // let twist = 2.0 + Math.sin(time * 0.01)
          let wavy = Math.sin(time + ee * PI * 0.5)

          // let e = ee * PI * 2.0 * twist + Math.sin(time * PI * 0.01)

          // var xx = (0.5 - Math.sin(e) * Math.sin(e)) * radius
          // var yy = (Math.sin(e) * Math.cos(e)) * radius
          // var zz = (0.5 - ee) * deep

          // mesh.position.x = xx
          // mesh.position.y = yy
          // mesh.position.z = zz

          mesh.position.x = offsetX - x
          mesh.position.y = offsetY - y

          mesh.position.x *= -80
          mesh.position.y *= 80
          // mesh.position.z = 40// * wavy
          mesh.position.z = Math.sin(mesh.position.y * 0.003 + mesh.position.x * 0.003 + time) * 40

          // mesh.position.x *= -50
          // mesh.position.y *= 50
          // mesh.position.z = 40// * wavy

          // lowers platform
          mesh.geometry = starGeo
          if (rayhitID === mesh.uuid) {
            mesh.scale.x = 35
            mesh.scale.y = 35
            mesh.scale.z = 35
            if (matcaps.pink1) {
              mesh.material = matcaps.pink1
            }
            mesh.geometry = heartGeo
            this.hit = idx
          } else if (hoverID === mesh.uuid) {
            if (matcaps.pink2) {
              mesh.material = matcaps.pink2
            }
          } else {
            mesh.scale.x = 20
            mesh.scale.y = 20
            mesh.scale.z = 20
            if (matcaps.yellow) {
              mesh.material = matcaps.yellow
              // color.setHSL(offsetX - x + Math.sin(x * 3.14 * 2.0 + time * 0.5), 0.65, 0.65)
              mesh.material.color = color
            }
          }
          if (mesh.geometry === starGeo) {
            mesh.rotation.x = time + Math.sin(mesh.position.z * 0.001) * Math.PI * 2.0
            mesh.rotation.y = time
            mesh.rotation.z = time + wavy
          } else {
            mesh.rotation.x = 0
            mesh.rotation.y = 0
            mesh.rotation.z = time * 2.0 + wavy
          }
          // mesh.rotation.x = Math.PI * 0.5
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
