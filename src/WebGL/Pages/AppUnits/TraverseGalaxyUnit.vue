<template>
  <div class="relative minus-navbar-height h-full w-full focus:outline-none">
    <div class="w-full h-full focus:outline-none galaxy-bg-image" ref="mounter"></div>
    <div class="absolute top-0 left-0 pl-5 pt-5">
      <button @click="toggle3D2D()" class="focus:outline-none text-white bg-black w-12 h-12 border-blue-800 bg-transparent-black border rounded-full shadow-2xl">
        <span v-if="view3D">3D</span>
        <span v-if="!view3D">2D</span>
      </button>
    </div>
    <Spaceship v-if="ready"></Spaceship>
  </div>
</template>

<script>
import ForceGraph3D from '3d-force-graph'
import SpriteText from 'three-spritetext'
import { Mesh, CircleBufferGeometry, MeshBasicMaterial, SpriteMaterial, TextureLoader, Sprite } from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { makeBase, Tree } from '../../Reusable/index'
export default {
  mixins: [Tree],
  props: {
    // Auth: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      base: false,
      ready: false,
      view3D: false,
      here: true
    }
  },
  beforeDestroy () {
    this.here = false
    this.base.onTearDown()
  },
  mounted () {
    this.prepBase()
    this.install()
  },
  methods: {
    prepBase () {
      this.base = makeBase()
    },
    toggle3D2D () {
      this.view3D = !this.view3D
      this.$emit('snyc3D2D')
    },
    install () {
      var myGraph = ForceGraph3D({ controlType: 'fly', rendererConfig: { antialias: true, alpha: true } })

      this.loadData = () => {
        const N = 70
        const graphBase = {
          nodes: [...Array(N).keys()].map(i => ({ id: i, neighbors: [] })),
          links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
              source: id,
              target: Math.round((id * 0.5 - 1))
            }))
        }

        // cross-link node objects
        graphBase.links.forEach(link => {
          const a = graphBase.nodes.find(e => e.id === link.source)
          const b = graphBase.nodes.find(e => e.id === link.target)
          !a.neighbors && (a.neighbors = [])
          !b.neighbors && (b.neighbors = [])
          a.neighbors.push(b)
          b.neighbors.push(a)

          !a.links && (a.links = [])
          !b.links && (b.links = [])
          a.links.push(link)
          b.links.push(link)
        })

        myGraph.graphData(graphBase)
      }
      this.loadData()

      // window.onclick = () => {
      //   this.loadData()
      // }

      const highlightNodes = new Set()
      const highlightLinks = new Set()
      let hoverNode = null

      // let rect = this.$el.getBoundingClientRect()
      // myGraph.height(rect.height)
      // myGraph.width(rect.width)
      window.addEventListener('resize', () => {
        let rect = this.$el.getBoundingClientRect()
        myGraph.height(rect.height)
        myGraph.width(rect.width)
      })
      window.dispatchEvent(new Event('resize'))

      this.$on('snyc3D2D', () => {
        if (this.view3D === true) {
          myGraph.numDimensions(3)
        } else {
          myGraph.numDimensions(2)
        }
      })
      myGraph.d3Force('link').distance(link => 50)
      this.$emit('snyc3D2D')
      window.addEventListener('blur', () => {
        if (this.here) {
          this.$emit('snyc3D2D')
        }
      })
      window.addEventListener('focus', () => {
        if (this.here) {
          this.$emit('snyc3D2D')
        }
      })

      var instance = myGraph(this.$refs['mounter'])

      this.renderer = myGraph.renderer()
      this.o3d.position.z = -2500
      this.o3d.scale.x = 5
      this.o3d.scale.y = 5
      this.o3d.scale.z = 5
      myGraph.scene().add(this.o3d)

      this.base.onInit()
      this.ready = true

      let oldControl = myGraph.controls()
      oldControl.enabled = false
      oldControl.dispose()
      console.log(oldControl)

      // myGraph.scene().rotation.x = Math.PI * 0.5
      myGraph.camera().position.set(0, 0, 500)

      instance.enableNodeDrag(true)

      let controls = new MapControls(myGraph.camera(), myGraph.renderer().domElement)
      controls.panSpeed = 2
      controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.05
      controls.enableRotate = false
      controls.screenSpacePanning = true
      controls.minDistance = 1
      controls.maxDistance = 5000

      instance.onNodeDrag(() => {
        controls.enablePan = false
      })

      instance.onNodeDragEnd(() => {
        controls.enablePan = true
      })

      instance.showNavInfo(false)

      instance.backgroundColor('rgba(0,0,0,0)')

      // controls.maxPolarAngle = Math.PI / 2
      // let deeper = 20.0
      // let screen = getScreen({ camera: instance.camera(), depth: 500 + deeper * 2 })
      // var skyGeo = new PlaneBufferGeometry(screen.max, screen.max * (3648 / 4992), 2, 2)
      // skyGeo.scale(-1, 1, 1)

      // var skyTex = new TextureLoader().load(require('./hdri/sky-space-milky-way-stars-110854.jpg'))
      // skyTex.mapping = EquirectangularReflectionMapping
      // var skyMat = new MeshBasicMaterial({ map: skyTex, side: DoubleSide })
      // var sky = new Mesh(skyGeo, skyMat)
      // sky.position.z = -deeper
      // instance.scene().add(sky)
      // instance.scene().background = new Color('#1a1a1a')

      let rAF = () => {
        if (this.here) {
          window.requestAnimationFrame(rAF)
        }
        controls.update()
        // galaxySphere.position.copy(instance.camera().position)
      }
      window.requestAnimationFrame(rAF)

      let circleGeo = new CircleBufferGeometry(10, 40)
      let circleBorderGeo = new CircleBufferGeometry(11, 40)
      circleBorderGeo.translate(0, 0, -0.1)
      circleGeo.computeBoundingSphere()
      // let sphereGeo = new SphereBufferGeometry(10, 4, 4)
      let transparentMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
      let whiteMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 1, color: 0xffffff })

      // let map = new Map()

      // .nodeColor(node => highlightNodes.has(node) ? node === hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,150,050.8)' : 'rgba(0,255,255,0.6)')
      instance.linkWidth(link => highlightLinks.has(link) ? 5 : 2)
        .linkDirectionalParticles(link => highlightLinks.has(link) ? 5 : 0)
        .linkDirectionalParticleWidth(2.5)
        .linkResolution(3)
        .nodeResolution(4)
        .nodeThreeObject((node) => {
          // use a sphere as a drag handle
          const obj = new Mesh(
            circleBorderGeo,
            transparentMat
          )

          const border = new Mesh(
            circleBorderGeo,
            whiteMat
          )
          obj.add(border)

          let id = node.id

          let imgs = ['cat.jpg', 'dog.jpg', 'eagle.jpg', 'elephant.jpg', 'grasshopper.jpg', 'octopus.jpg', 'owl.jpg', 'panda.jpg', 'squirrel.jpg', 'tiger.jpg', 'whale.jpg']

          // add img sprite as child
          let imgURL = imgs[id % (imgs.length - 2)]
          const imgTexture = new TextureLoader().load(`/imgs/${imgURL}`)
          const material = new SpriteMaterial({ map: imgTexture, opacity: 1 })
          const sprite = new Sprite(material)
          // sprite.scale.set(1, 1)
          sprite.geometry = circleGeo
          obj.add(sprite)

          border.position.z = 2.99
          sprite.position.z = 3

          // extend link with text sprite
          let spriteText = new SpriteText(`${imgURL.replace('.jpg', '')}`)
          spriteText.color = 'white'
          spriteText.strokeColor = 'black'
          spriteText.strokeWidth = 1.5
          // spriteText.backgroundColor = 'white'
          spriteText.textHeight = 4
          spriteText.position.y = circleGeo.boundingSphere.radius * -1.35

          obj.add(spriteText)

          // map.set(node.id, obj)
          // sprite.frustumCulled = false
          // obj.frustumCulled = false
          // spriteText.frustumCulled = false

          return obj
        })
        .onNodeHover(node => {
          // no state change
          if ((!node && !highlightNodes.size) || (node && hoverNode === node)) return

          highlightNodes.clear()
          highlightLinks.clear()

          if (node) {
            highlightNodes.add(node)
            if (node.neighbors) {
              node.neighbors.forEach(neighbor => highlightNodes.add(neighbor))
            }
            if (node.links) {
              node.links.forEach(link => highlightLinks.add(link))
            }
          }

          hoverNode = node || null

          updateHighlight()
        })
        .onLinkHover(link => {
          highlightNodes.clear()
          highlightLinks.clear()

          if (link) {
            highlightLinks.add(link)
            highlightNodes.add(link.source)
            highlightNodes.add(link.target)
          }

          updateHighlight()
        })

      // let updateLinkDistance = (dist = 3) => {
      //   linkForce.distance(link => dist)
      //   myGraph.numDimensions(2)
      // }
      // updateLinkDistance(50)

      let updateHighlight = () => {
        // trigger update of highlighted objects in scene
        myGraph
          .nodeColor(myGraph.nodeColor())
          .linkWidth(myGraph.linkWidth())
          .linkDirectionalParticles(myGraph.linkDirectionalParticles())
      }
    }
  }
}
</script>

<style lang="postcss">
.minus-navbar-height{
  height: calc(100% - 60px);
}
.minus-navbar-height:focus, *:focus{
  outline: none;
}

.galaxy-bg-image{
  background-color: #251b69;
  background-image: url('./hdri/sky-space-milky-way-stars-110854.jpg');
  @apply bg-center bg-cover;
}
.bg-transparent-black{
  background-color: rgba(0,0,0,0.7);
}
</style>
