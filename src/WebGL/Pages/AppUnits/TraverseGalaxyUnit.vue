<template>
  <div class="relative minus-navbar-height h-full w-full focus:outline-none">
    <div class="w-full h-full focus:outline-none galaxy-bg-image" ref="mounter"></div>
    <div class="absolute top-0 left-0 pl-5 pt-5">
      <button @click="toggle3D2D()" class="text-black bg-white w-12 h-12 border-black border rounded-full">
        <span v-if="view3D">3D</span>
        <span v-if="!view3D">2D</span>
      </button>
    </div>
  </div>
</template>

<script>
import ForceGraph3D from '3d-force-graph'
import SpriteText from 'three-spritetext'
import { Mesh, CircleBufferGeometry, MeshBasicMaterial, SpriteMaterial, TextureLoader, Sprite, SphereBufferGeometry } from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { getScreen } from '../../Reusable/index'
export default {
  props: {
    // Auth: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      view3D: true,
      here: true
    }
  },
  beforeDestroy () {
    this.here = false
  },
  mounted () {
    this.install()
  },
  methods: {
    toggle3D2D () {
      this.view3D = !this.view3D
      this.$emit('toggle3D2D')
    },
    install () {
      const N = 50
      const graphData = {
        nodes: [...Array(N).keys()].map(i => ({ id: i, neighbors: [] })),
        links: [...Array(N).keys()]
          .filter(id => id)
          .map(id => ({
            source: id,
            target: Math.round(Math.random() * (id - 1))
          }))
      }

      // cross-link node objects
      graphData.links.forEach(link => {
        const a = graphData.nodes[link.source]
        const b = graphData.nodes[link.target]
        !a.neighbors && (a.neighbors = [])
        !b.neighbors && (b.neighbors = [])
        a.neighbors.push(b)
        b.neighbors.push(a)

        !a.links && (a.links = [])
        !b.links && (b.links = [])
        a.links.push(link)
        b.links.push(link)
      })

      const highlightNodes = new Set()
      const highlightLinks = new Set()
      let hoverNode = null

      var myGraph = ForceGraph3D({ controlType: 'fly', rendererConfig: { antialias: true, alpha: true } })
      myGraph.height(this.$el.getBoundingClientRect().height)
      myGraph.width(this.$el.getBoundingClientRect().width)
      window.addEventListener('resize', () => {
        myGraph.height(this.$el.getBoundingClientRect().height)
        myGraph.width(this.$el.getBoundingClientRect().width)
      })

      myGraph.numDimensions(3)
      this.$on('toggle3D2D', () => {
        if (this.view3D === true) {
          myGraph.numDimensions(3)
        } else {
          myGraph.numDimensions(2)
        }
      })
      myGraph.d3Force('link').distance(link => 50)

      var instance = myGraph(this.$refs['mounter'])

      let oldControl = myGraph.controls()
      oldControl.enabled = false
      oldControl.dispose()
      console.log(oldControl)

      // myGraph.scene().rotation.x = Math.PI * 0.5
      myGraph.camera().position.set(0, 0, 750)
      myGraph.scene().position.z = 250
      instance.enableNodeDrag(true)

      let controls = new MapControls(myGraph.camera(), myGraph.renderer().domElement)
      controls.panSpeed = 2
      controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.05
      controls.enableRotate = false
      controls.screenSpacePanning = true
      controls.minDistance = 100
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

      let circleGeo = new CircleBufferGeometry(10, 36)
      circleGeo.computeBoundingSphere()
      let sphereGeo = new SphereBufferGeometry(10, 4, 4)
      let transparentMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })

      // let map = new Map()
      instance.graphData(graphData)

        // .nodeColor(node => highlightNodes.has(node) ? node === hoverNode ? 'rgb(255,0,0,1)' : 'rgba(255,150,050.8)' : 'rgba(0,255,255,0.6)')
        .linkWidth(link => highlightLinks.has(link) ? 5 : 2)
        .linkDirectionalParticles(link => highlightLinks.has(link) ? 5 : 0)
        .linkDirectionalParticleWidth(2.5)
        .linkResolution(3)
        .nodeResolution(4)

        .nodeThreeObject((node) => {
          // use a sphere as a drag handle
          const obj = new Mesh(
            sphereGeo,
            transparentMat
          )

          let id = node.id

          let imgs = ['cat.jpg', 'dog.jpg', 'eagle.jpg', 'elephant.jpg', 'grasshopper.jpg', 'octopus.jpg', 'owl.jpg', 'panda.jpg', 'squirrel.jpg', 'tiger.jpg', 'whale.jpg']
          // add img sprite as child
          let imgURL = imgs[id % (imgs.length - 2)]
          const imgTexture = new TextureLoader().load(`/imgs/${imgURL}`)
          const material = new SpriteMaterial({ map: imgTexture, opacity: 1 })
          const sprite = new Sprite(material)
          // sprite.scale.set(1, 1)
          sprite.geometry = circleGeo
          sprite.position.z = 5
          obj.add(sprite)

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
            node.neighbors.forEach(neighbor => highlightNodes.add(neighbor))
            node.links.forEach(link => highlightLinks.add(link))
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
</style>
