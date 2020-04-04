<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { Mesh, SphereBufferGeometry, BackSide, MeshBasicMaterial, Color } from 'three'
var load = require('./load.js')
var createGeometry = require('three-bmfont-text')
var loadFont = require('load-bmfont')
var MSDFShader = require('./shader/msdf.js').default

export default {
  name: 'Test',
  mixins: [Tree],
  props: {
    texture: {
      default: null
    }
  },
  components: {
    ...require('../../webgl')
  },
  data () {
    return {
    }
  },
  async mounted () {
    var { font, texture } = load({
      // eslint-disable-next-line
      font: require('raw-loader!./bmfonts/Roboto-msdf.json'),
      // eslint-disable-next-line
      image: require('raw-loader!./bmfonts/Roboto-msdf.png')
    })
    var geom = createGeometry({
      text: '',
      font: font,
      align: 'left',
      flipY: texture.flipY
    })

    geom.update('Lorem ipsum\nDolor sit amet.')

    var material = new RawShaderMaterial(MSDFShader({
      map: texture,
      transparent: true,
      color: new Color('#fafa00')
    }))

    var layout = geom.layout
    var text = new Mesh(geom, material)
    text.position.set(-layout.width / 2, -layout.descender + layout.height, 0)
    // text.scale.multiplyScalar(Math.random() * 0.5 + 0.5)

    var textAnchor = new Object3D()
    textAnchor.add(text)

    // let mat = new MeshBasicMaterial({ map: this.texture, side: BackSide })
    // let item = new Mesh(undefined, mat)
    // let base = this.lookup('base')

    // base.onResize(() => {
    //   let geo = new SphereBufferGeometry(this.screen.max * 200, 8, 8)
    //   item.geometry = geo
    //   item.needsUpdate = true
    // })
    // this.o3d.add(item)
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
