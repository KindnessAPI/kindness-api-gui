<template>
  <div class="relative minus-navbar-height h-full w-full focus:outline-none">
    <div class="w-full h-full focus:outline-none" ref="mounter"></div>
    <div class="absolute top-0 left-0">
      <button @click="toggle3D2D()" class="focus:outline-none text-white bg-black w-12 h-12 border-blue-800 bg-transparent-black border rounded-full shadow-2xl mt-3 mr-3 ml-3">
        <span v-if="view3D">3D</span>
        <span v-if="!view3D">2D</span>
      </button>
      <button :key="ii" v-for="(btn, ii) in btns" @click="$emit(btn.event)" class="focus:outline-none text-white bg-black h-12 border-blue-800 bg-transparent-black border rounded-full shadow-2xl px-4 mt-3 mr-3">
        {{ btn.text }}
      </button>
    </div>
    <slot v-if="ready"></slot>
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
    btns: {
      default () {
        return [
          {
            text: `Home`,
            event: 'home'
          },
          {
            text: `Profile`,
            event: 'me'
          }
        ]
      }
    },
    graph: {},
    nodeIDKey: {
      default: '_id'
    }
    // Auth: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      vm: this,
      pauseAnimation () {},
      base: false,
      ready: false,
      view3D: false,
      here: true
    }
  },
  beforeDestroy () {
    this.here = false
    this.base.onTearDown()
    this.pauseAnimation()
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

      // myGraph.linkDirectionalArrowLength(0.0001)
      // myGraph.linkDirectionalArrowRelPos(0.0001)
      // myGraph.linkCurvature(0.6)

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
      this.pauseAnimation = () => {
        engine.pauseAnimation()
        engine.scene().traverse((item) => {
          if (item.dispose) {
            item.dispose()
          }
        })
      }
      // console.log(engine.state)
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
        myGraph.nodeId(this.nodeIDKey)

        let graphBase = data
        // cross-link node objects
        graphBase.links.forEach(link => {
          const a = graphBase.nodes.find(e => e[this.nodeIDKey] === link.source)
          const b = graphBase.nodes.find(e => e[this.nodeIDKey] === link.target)
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
      this.renderer.domElement.classList.add('galaxy-bg-image')

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

      // myGraph.scene().rotation.x = Math.PI * 0.5
      myGraph.camera().position.set(0, 0, 250)

      let controls = new MapControls(myGraph.camera(), myGraph.renderer().domElement)
      controls.panSpeed = 2
      controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.05
      controls.enableRotate = false
      controls.screenSpacePanning = true
      controls.minDistance = 1
      controls.maxDistance = 4000

      engine.enableNodeDrag(true)
      let adt = {
        x: 0,
        y: 0
      }
      let dragRadius = 25
      engine.onNodeDrag((node, translate) => {
        controls.enablePan = false
        if (node.ondrag) {
          node.ondrag()
        }
        adt.x += translate.x
        adt.y += translate.y

        let { x, y } = adt
        x = x || 0
        y = y || 0
        let dt = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        if (node.onDT) {
          node.onDT(dt)
        }
        if (dt >= dragRadius) {
          node.canOpen && node.canOpen(true)
        } else {
          node.canOpen && node.canOpen(false)
        }
        // if (dt >= dragRadius) {
        // } else if (dt < dragRadius) {
        // }
      })

      engine.onNodeDragEnd((node, translate) => {
        controls.enablePan = true

        let { x, y } = translate
        x = x || 0
        y = y || 0
        let dt = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

        if (node && dt > dragRadius) {
          this.$emit('node-click', node)
          if (node.ondragend) {
            node.ondragend()
          }
        } else {
          if (node.ondragcancel) {
            node.ondragcancel()
          }
        }
        adt = {
          x: 0,
          y: 0
        }
      })

      engine.onNodeClick((node) => {
        this.$emit('node-click', node)
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
      let whiteMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0.8, color: 0xffffff })
      let blueMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0.45, color: 0xffffff })
      let limeMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0.65, color: 0x32cd32 })

      // let map = new Map()
      // user
      // loveline

      engine
        .linkWidth(link => highlightLinks.has(link) ? 3 : 2)
        .linkColor(link => highlightLinks.has(link) ? 'rgb(218, 126, 11)' : 'rgba(255,255,255,1.0)')
        .linkDirectionalParticles(link => highlightLinks.has(link) ? 3 : 1)
        .linkOpacity(1.0)
        // .linkLabel('type')
        .linkDirectionalParticleWidth(3)
        .linkDirectionalParticleResolution(3)
        .linkResolution(3)
        // .nodeResolution(3)
        .nodeThreeObject((node) => {
          const clicker = new Mesh(
            borderGeo,
            transparentMat
          )
          clicker.position.z = -3

          const border = new Mesh(
            borderGeo,
            whiteMat
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

          node.ondrag = () => {
            // border.material = whiteMat
          }
          node.onDT = (v) => {
            let r = dragRadius
            let sc = 0.5
            let sv = (v * sc + r) / (r)
            if (sv > 1.5) {
              sv = 1.5
            }
            border.scale.set(sv, sv, sv)
          }
          node.ondragend = () => {
            border.material = whiteMat
            border.scale.set(1, 1, 1)
          }
          node.ondragcancel = () => {
            border.material = whiteMat
            border.scale.set(1, 1, 1)
          }
          node.canOpen = (can) => {
            border.material = can ? limeMat : blueMat
          }

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
        // .onNodeClick((node) => {
        //   this.$emit('node-click', node)
        // })

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

.bg-transparent-black{
  background-color: rgba(0,0,0,0.7);
}
</style>
