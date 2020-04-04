<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import { Tree } from '../../Reusable'
import { TextureLoader, DoubleSide, Mesh, Color, RawShaderMaterial, Object3D } from 'three'
import MSDFShader from './shader/msdf.js'
import loadFont from 'load-bmfont'
import createGeometry from './lib/createGeometry.js'

export default {
  name: 'Test',
  mixins: [Tree],
  props: {
    text: {
      default: ''
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
    let load = ({
      fontURL,
      texURL,
      callback
    }) => {
      return new Promise((resolve) => {
        let loader = new TextureLoader()
        loader.load(texURL, (texture) => {
          if (typeof fontURL === 'object') {
            let params = { font: fontURL, texture }
            resolve(params)
            return
          }
          loadFont(fontURL, (err, font) => {
            if (err) {
              console.log(err)
              throw new Error(err)
            }
            let params = { font, texture }
            resolve(params)
          })
        })
      })
    }

    // https://msdf-bmfont.donmccurdy.com/
    let { texture, font } = await load({
      // eslint-disable-next-line
      fontURL: require('./bmfonts/Roboto-msdf.json'),
      texURL: require('./bmfonts/Roboto-msdf.png')
    })
    let config = {
      font: font,
      align: 'left',
      // width: 200,
      text: this.text
    }
    var geom = createGeometry(config)

    this.$on('updateText', (v) => {
      geom.update({
        ...config,
        text: (v + '') || ''
      })

      var layout = geom.layout
      mesh.position.x = -layout.width / 2
      mesh.position.y = -layout.height / 2

      this.$parent.$emit('child', {
        width: layout.width,
        height: layout.height,
        depth: 0,
        raidus: layout.width * 0.5
      })
    })
    this.$watch('text', (v) => {
      this.$emit('updateText', v)
    })

    let material = new RawShaderMaterial(MSDFShader({
      map: texture,
      transparent: true,
      color: new Color('#ffffff'),
      side: DoubleSide
    }))

    var mesh = new Mesh(geom, material)
    mesh.scale.y = -1
    mesh.frustumCulled = false
    this.$emit('updateText', this.text)

    let container = new Object3D()
    container.add(mesh)
    container.scale.multiplyScalar(0.25)
    this.$emit('enable-play', mesh)

    this.o3d.add(container)
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
