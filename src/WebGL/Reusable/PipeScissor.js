import { makeSDK } from '../../human'
import { Renderer, makeBase, Stats, Tree } from '../Reusable'

export const PipeScissor = {
  name: 'PipeScissor',
  mixins: [Tree],
  components: {
    ...require('../webgl').default
  },
  data () {
    return {
      areas: {},
      ready: false,
      scene: false,
      camera: false,
      base: makeBase()
    }
  },
  activated () {
    this.base.isActiveRender = true
  },
  deactivated () {
    this.base.isActiveRender = false
  },
  async mounted () {
    this.base.isActiveRender = true
    this.sdk = await makeSDK()
    this.mounter = this.$refs.mounter
    this.base.mounter = this.$refs.mounter

    this.renderer = new Renderer({ base: this.base, makeGIF: false })
    this.mounter.appendChild(this.renderer.domElement)
    this.touchDom = this.renderer.domElement

    // prepare render loop
    let renderFnc = () => {
      this.renderer.setClearColor(0xffffff, 0.1)
      this.renderer.setScissorTest(false)
      this.renderer.clear()
      this.renderer.setScissorTest(true)
      for (let areaKN in this.areas) {
        let config = this.areas[areaKN]

        let element = config.element
        var camera = config.camera
        var scene = config.scene

        var rect = element.getBoundingClientRect()
        if (rect.height === 0 && rect.width === 0) {
          // console.log(123)
          continue
        }
        if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
            rect.right < 0 || rect.left > this.renderer.domElement.clientWidth) {
          continue
        }

        // set the viewport
        var width = rect.right - rect.left
        var height = rect.bottom - rect.top
        var left = rect.left
        var bottom = this.renderer.domElement.clientHeight - rect.bottom

        this.renderer.setViewport(left, bottom, width, height)
        this.renderer.setScissor(left, bottom, width, height)

        this.renderer.render(scene, camera)
      }
      // if (this.scene) {
      //   this.renderer.render(this.scene, this.camera)
      // }
    }
    this.base.onLoop(renderFnc)
    this.base.onResizeNow(renderFnc)

    // statistics
    if (process.env.NODE_ENV === 'development') {
      this.base.stats = new Stats({ mounter: this.$refs.stats })
    }

    this.base.onInit()
    this.ready = true
  },
  methods: {
    // getScrollProgress () {
    //   return window.scrollY / (document.body.scrollHeight - document.body.offsetHeight)
    // },
    // getMaxScrollHeight () {
    //   return (document.body.scrollHeight - document.body.offsetHeight)
    // }
  },
  beforeDestroy () {
    this.base.isActiveRender = false
    this.base.onClean()
  }
}
