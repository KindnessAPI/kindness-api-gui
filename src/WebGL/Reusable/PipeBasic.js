import { makeSDK } from '../../human'
import { Renderer, PCamera, makeBase, Stats, Tree, RayPlay } from '../Reusable'

export const PipeBasic = {
  name: 'PipeBasic',
  mixins: [Tree],
  components: {
    ...require('../webgl').default
  },
  data () {
    return {
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

    // prepare camera
    this.camera = new PCamera({ base: this.base })
    this.camera.position.z = 200

    this.rayplay = new RayPlay({ mounter: this.mounter, base: this.base, camera: this.camera })

    // prepare render loop
    this.base.onLoop(() => {
      if (this.scene) {
        this.renderer.render(this.scene, this.camera)
      }
    })

    // statistics
    if (process.env.NODE_ENV === 'development') {
      this.base.stats = new Stats({ mounter: this.$refs.stats })
    }

    this.base.onInit()
    this.ready = true
  },
  methods: {
  },
  beforeDestroy () {
    this.base.isActiveRender = false
    this.base.onClean()
  }
}
