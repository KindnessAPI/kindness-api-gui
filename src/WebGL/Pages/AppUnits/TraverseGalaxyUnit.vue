<template>
  <div class="relative minus-navbar-height h-full w-full focus:outline-none">
    <div class="w-full h-full focus:outline-none galaxy-bg-image" ref="mounter"></div>
    <div class="absolute top-0 left-0 pl-5 pt-5">
      <button @click="toggle3D2D()" class="focus:outline-none text-white bg-black w-12 h-12 border-blue-800 bg-transparent-black border rounded-full shadow-2xl m-3">
        <span v-if="view3D">3D</span>
        <span v-if="!view3D">2D</span>
      </button>
      <!-- <button @click="$emit('debug')" class="focus:outline-none text-white bg-black w-12 h-12 border-blue-800 bg-transparent-black border rounded-full shadow-2xl m-3">
        Debug
      </button> -->
    </div>
    <!-- <div class="absolute top-0 left-0 w-full h-full">
      <slot></slot>
    </div> -->

    <slot></slot>
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
    graph: {}
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
      // myGraph.d3Force('link').distance(35)
      myGraph.warmupTicks(60 * 0.5)
      myGraph.d3AlphaDecay(0.01)

      myGraph.linkDirectionalArrowLength(0.1)
      myGraph.linkDirectionalArrowRelPos(5)
      myGraph.linkCurvature(0.6)

      // myGraph.d3VelocityDecay(0.4)
      // myGraph.dagMode('rl')
      // myGraph.cooldownTime(Infinity)

      this.$on('snyc3D2D', () => {
        if (this.view3D === true) {
          myGraph.numDimensions(3)
        } else {
          myGraph.numDimensions(2)
        }
      })
      var engine = myGraph(this.$refs['mounter'])

      // let simulateData = () => {
      //   const N = 60
      //   const idMap = new Map()
      //   const graphBase = {
      //     nodes: [...Array(N).keys()].map(i => ({ id: i, neighbors: [], links: [] })),
      //     links: [...Array(N).keys()]
      //       .filter(id => id)
      //       .map(id => ({
      //         source: id,
      //         target: Math.round((id * 0.5 - 1))
      //       }))
      //   }

      //   graphBase.nodes.forEach((node) => {
      //     idMap.set(node.id, node)
      //     let id = node.id
      //     let imgs = ['cat.jpg', 'dog.jpg', 'eagle.jpg', 'elephant.jpg', 'grasshopper.jpg', 'octopus.jpg', 'owl.jpg', 'panda.jpg', 'squirrel.jpg', 'tiger.jpg', 'whale.jpg']
      //     node.imgURL = imgs[id % (imgs.length - 2)]
      //     node.name = node.imgURL.replace('.jpg', '')
      //   })

      //   // cross-link node objects
      //   graphBase.links.forEach(link => {
      //     // const a = graphBase.nodes.find(e => e.id === link.source)
      //     // const b = graphBase.nodes.find(e => e.id === link.target)
      //     const a = idMap.get(link.source)
      //     const b = idMap.get(link.target)

      //     !a.neighbors && (a.neighbors = [])
      //     !b.neighbors && (b.neighbors = [])
      //     a.neighbors.push(b)
      //     b.neighbors.push(a)

      //     !a.links && (a.links = [])
      //     !b.links && (b.links = [])
      //     a.links.push(link)
      //     b.links.push(link)
      //   })

      //   myGraph.graphData(graphBase)
      // }
      // simulateData()

      let loadData = async (data) => {
        myGraph.nodeId('userID')

        let graphBase = data
        // cross-link node objects
        graphBase.links.forEach(link => {
          const a = graphBase.nodes.find(e => e.userID === link.source)
          const b = graphBase.nodes.find(e => e.userID === link.target)
          // const a = idMap.get(link.source)
          // const b = idMap.get(link.target)

          if (!a || !b) {
            return
          }

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
      // loadData()

      this.$watch('graph', (v) => {
        if (v) {
          loadData(v)
        }
      })

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

      this.$emit('snyc3D2D')
      // window.addEventListener('blur', () => {
      //   if (this.here) {
      //     this.$emit('snyc3D2D')
      //   }
      // })
      window.addEventListener('focus', () => {
        if (this.here) {
          this.$emit('snyc3D2D')
        }
      })

      this.renderer = myGraph.renderer()
      this.o3d.position.z = -2500
      this.o3d.scale.x = 5
      this.o3d.scale.y = 5
      this.o3d.scale.z = 5
      engine.scene().add(this.o3d)

      this.base.onInit()
      this.ready = true

      let oldControl = myGraph.controls()
      oldControl.enabled = false
      oldControl.dispose()
      console.log(oldControl)

      // myGraph.scene().rotation.x = Math.PI * 0.5
      myGraph.camera().position.set(0, 0, 300)

      engine.enableNodeDrag(true)

      let controls = new MapControls(myGraph.camera(), myGraph.renderer().domElement)
      controls.panSpeed = 2
      controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.05
      controls.enableRotate = false
      controls.screenSpacePanning = true
      controls.minDistance = 1
      controls.maxDistance = 5000

      engine.onNodeDrag(() => {
        controls.enablePan = false
      })

      engine.onNodeDragEnd(() => {
        controls.enablePan = true
      })

      engine.showNavInfo(false)
      engine.backgroundColor('rgba(0,0,0,0)')

      myGraph.onEngineTick(() => {
        controls.update()
      })

      let iconGeo = new CircleBufferGeometry(10, 40)
      let borderGeo = new CircleBufferGeometry(11, 40)
      borderGeo.translate(0, 0, -0.1)
      iconGeo.computeBoundingSphere()

      let transparentMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
      let whiteMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 1, color: 0xffffff })
      let blueMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 1, color: 0x0000ff })

      // let map = new Map()
      // user
      // loveline

      engine
        .linkWidth(link => highlightLinks.has(link) ? 4 : 2)
        .linkColor(link => highlightLinks.has(link) ? 'rgb(218, 126, 11)' : 'rgba(255,255,255,1.0)')
        .linkDirectionalParticles(link => highlightLinks.has(link) ? 3.5 : 2)
        .linkOpacity(1.0)
        .linkLabel('type')
        .linkDirectionalParticleWidth(5)
        .linkDirectionalParticleResolution(5)
        .linkResolution(2)
        .nodeResolution(1)
        .nodeThreeObject((node) => {
          const clicker = new Mesh(
            borderGeo,
            transparentMat
          )
          clicker.position.z = -3

          const border = new Mesh(
            borderGeo,
            node.isMyself ? blueMat : whiteMat
          )
          clicker.add(border)

          const imgTexture = new TextureLoader().load(`${node.img}`)
          const material = new SpriteMaterial({ map: imgTexture, opacity: 1 })
          const sprite = new Sprite(material)
          sprite.geometry = iconGeo
          clicker.add(sprite)

          border.position.z = 2.99
          sprite.position.z = 3

          let spriteText = new SpriteText(`${node.name}`)
          spriteText.color = 'white'
          spriteText.strokeColor = 'black'
          spriteText.strokeWidth = 1.5
          spriteText.textHeight = 4
          spriteText.position.y = iconGeo.boundingSphere.radius * -1.35

          clicker.add(spriteText)

          return clicker
        })
        .onNodeHover(node => {
          if (node) {
            this.$refs.mounter.style.cursor = 'pointer'
          } else {
            this.$refs.mounter.style.cursor = ''
          }

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
        .onNodeClick((node) => {
          this.$emit('node-click', node)
        })

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
