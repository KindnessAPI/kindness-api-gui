<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import TextTexture from '@seregpie/three.text-texture'

import { Tree } from '../Reusable'
import { Mesh, PlaneBufferGeometry, MeshBasicMaterial } from 'three'
export default {
  props: {
    text: {},
    scale: {
      default: 1
    },
    font: {
      default: 'LoveLo'
    },
    envMap: {},
    align: {
      default: 'center'
    }
  },
  name: 'TexureText',
  mixins: [Tree],
  components: {
    ...require('../webgl')
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$on('exec', async () => {
      console.log('exec-texture-text', this.text)
      this.o3d.position.z = 1

      // async function loadSeaside () {
      //   const font = new FontFace('SeasideResortNF', `url('/fonts/seaside/SeasideResortNF.eot?#iefix') format('embedded-opentype'),  url('/fonts/seaside/SeasideResortNF.woff') format('woff'), url('/fonts/seaside/SeasideResortNF.ttf')  format('truetype'), url('/fonts/seaside/SeasideResortNF.svg#SeasideResortNF') format('svg')`, {
      //     family: 'SeasideResortNF',
      //     style: 'normal',
      //     weight: `normal`
      //     // `font-weight: normal; font-style: normal;`
      //   })

      //   await font.load()
      //   document.fonts.add(font)
      // }

      async function loadLovelo () {
        let link = 'https://res.cloudinary.com/loklok-keystone/raw/upload/v1590476294/loklok/Lovelo/Lovelo-LineLight.ttf'
        const font = new FontFace('LoveLo', `url('${link}')  format('truetype')`, {
          family: 'LoveLo',
          style: 'normal',
          weight: `normal`
          // `font-weight: normal; font-style: normal;`
        })

        await font.load()
        document.fonts.add(font)
      }
      if (this.font === 'LoveLo') {
        await loadLovelo()
      }

      let texture = new TextTexture({
        align: this.align || 'center',
        fillStyle: 'white',
        fontFamily: `${this.font || 'Arial'}, sans-serif`,
        fontSize: 140,
        fontStyle: 'normal',
        fontVariant: 'normal',
        fontWeight: 'normal',
        lineGap: 0.15,
        padding: 0.15,
        // mini text shadow
        strokeStyle: '#bababa',
        strokeWidth: 0.025,
        text: this.text
      })
      texture.redraw()
      // let defaultSize = texture.image.width * 0.075
      let minAxis = this.screen.width < this.screen.height ? this.screen.width : this.screen.height
      let defaultSize = minAxis * 0.1 * this.scale

      let width = defaultSize
      let height = defaultSize * (texture.image.height) / (texture.image.width)
      let geo = new PlaneBufferGeometry(width, height, 2, 2)

      this.$emit('width', width)
      this.$emit('height', height)

      geo.computeBoundingSphere()
      geo.computeBoundingBox()

      let sizing = {
        radius: width * 0.5,
        width: width,
        height: height,
        depth: 0
      }

      // console.log(this.text, 'sizing', sizing)
      this.$emit('child', sizing)
      this.$parent.$emit('child', sizing)

      let mat = new MeshBasicMaterial({ color: 0xffffff, opacity: 1, map: texture, depthWrite: false, transparent: true, envMap: this.envMap })
      let item = new Mesh(geo, mat)
      this.o3d.children.forEach((v) => {
        this.$emit('disable-play', v)
        this.o3d.remove(v)
      })
      this.o3d.add(item)
      this.$emit('enable-play', item)
    })
    var tout = 0
    this.$on('try-init', () => {
      clearTimeout(tout)
      tout = setTimeout(() => {
        this.$emit('exec')
      }, 100)
    })
    this.$emit('try-init')
    this.$watch('text', () => {
      this.$emit('exec')
    })
    this.$watch('font', () => {
      this.$emit('try-init')
    })
    this.$watch('scale', () => {
      this.$emit('try-init')
    })
    this.$watch('align', () => {
      this.$emit('try-init')
    })
    this.lookup('base').onResize(() => {
      this.$emit('try-init')
    })
    // this.$watch('screen', () => {
    //   this.$emit('try-init')
    // })
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
