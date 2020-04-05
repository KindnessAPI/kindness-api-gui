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

    let damperX = new Damper(0, this.lookup('base'))
    let damperY = new Damper(0, this.lookup('base'))
    let h = {
      isDown: false,
      tsX: 0,
      tsY: 0,
      tdX: 0,
      tdY: 0,
      aX: 0,
      aY: 0
    }
    let scene = this.lookup('scene')
    item.cursor = 'pointer'
    item.on('click', (ev) => {
    })
    item.on('touchstart', (ev) => {
      ev.data.originalEvent.preventDefault()
      h.isDown = true
      let touch = ev.data.originalEvent.touches[0]
      if (touch) {
        h.tsX = touch.pageX
        h.tsY = touch.pageY
      }
    })
    scene.on('touchcancel', (ev) => {
      h.isDown = false
    })
    scene.on('touchmove', (ev) => {
      let touch = ev.data.originalEvent.touches[0]
      if (touch && h.isDown) {
        ev.data.originalEvent.preventDefault()
        h.tdX = touch.pageX - h.tsX
        h.tdY = touch.pageY - h.tsY

        h.tsX = touch.pageX
        h.tsY = touch.pageY

        h.aX += h.tdX
        h.aY += h.tdY

        damperX.value = h.aX
        damperY.value = h.aY
      }
    })
    scene.on('touchend', (ev) => {
      h.isDown = false
    })

    item.on('mousedown', (ev) => {

    })
    item.on('mouseout', (ev) => {

    })
    item.on('mouseover', (ev) => {

    })
    item.on('mousemove', (ev) => {

    })
    item.on('mouseup', (ev) => {

    })
    let el = this.lookup('base').mounter
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
