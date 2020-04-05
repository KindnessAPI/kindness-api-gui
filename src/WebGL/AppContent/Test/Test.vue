<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree, Damper } from '../../Reusable'
import { LineSegments, BoxBufferGeometry, MeshBasicMaterial } from 'three'
export default {
  name: 'Test',
  mixins: [Tree],
  components: {
    ...require('../../webgl')
  },
  data () {
    return {
    }
  },
  mounted () {
    let geo = new BoxBufferGeometry(50, 50, 50, 15, 15, 15)
    let mat = new MeshBasicMaterial({ color: 0xff0000 })
    let item = new LineSegments(geo, mat)
    this.o3d.add(item)

    let el = this.lookup('element')
    let damperX = new Damper(0, this.lookup('base'))
    let damperY = new Damper(0, this.lookup('base'))
    let vm = this
    let h = {
      _isDown: false,
      set isDown (v) {
        h._isDown = v
        vm.lookup('scrollerConfig').canRun = !v
      },
      get isDown () {
        return h._isDown
      },
      tsX: 0,
      tsY: 0,
      tdX: 0,
      tdY: 0,
      aX: 0,
      aY: 0
    }
    let scene = this.lookup('scene')
    item.cursor = 'pointer'
    let moved = 0
    item.on('click', (ev) => {
      if (moved > 5) { return }
      console.log('you clicked!!!')
    })
    item.on('pointerdown', () => {
      moved = 0
    })
    item.on('pointermove', () => {
      moved++
    })
    item.on('touchstart', (ev) => {
      try {
        ev.data.originalEvent.preventDefault()
        h.isDown = true
        let ptr = ev.data.originalEvent.touches[0]
        if (ptr) {
          h.tsX = ptr.pageX
          h.tsY = ptr.pageY
        }
      } catch (e) {
      }
    })
    scene.on('touchcancel', (ev) => {
      h.isDown = false
    })
    scene.on('touchmove', (ev) => {
      try {
        let ptr = ev.data.originalEvent.touches[0]
        if (ptr && h.isDown) {
          ev.data.originalEvent.preventDefault()
          h.tdX = ptr.pageX - h.tsX
          h.tdY = ptr.pageY - h.tsY

          h.tsX = ptr.pageX
          h.tsY = ptr.pageY

          h.aX += h.tdX
          h.aY += h.tdY

          damperX.value = h.aX
          damperY.value = h.aY
        }
      } catch (e) {
      }
    })
    scene.on('touchend', (ev) => {
      h.isDown = false
    })

    let hit = false
    item.on('mousedown', (ev) => {
      hit = ev.target
      h.isDown = true
      // let originalEvent = ev.data.originalEvent
      // console.log(originalEvent)
    })
    // item.on('mouseover', () => {
    //   console.log('over')
    //   mat.color = new Color('#0000ff')
    // })
    // item.on('mouseout', () => {
    //   console.log('out')
    //   mat.color = new Color('#ff0000')
    // })

    window.addEventListener('mousemove', (ev) => {
      if (hit && h.isDown) {
        h.tdX = ev.movementX
        h.tdY = ev.movementY

        h.aX += h.tdX
        h.aY += h.tdY

        damperX.value = h.aX
        damperY.value = h.aY
      }
    }, { passive: true })
    window.addEventListener('mouseup', (ev) => {
      hit = false
      h.isDown = false
    }, { passive: true })

    let rect = el.getBoundingClientRect()
    this.lookup('base').onResize(() => {
      rect = el.getBoundingClientRect()
    })

    this.lookup('base').onLoop(() => {
      if (rect) {
        item.position.x = damperX.value / rect.width * this.screen.width
        item.position.y = -damperY.value / rect.height * this.screen.height
      }
    })
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
