<template>
  <div class="relative h-full w-full focus:outline-none">
    <div class="w-full h-full focus:outline-none" ref="mounter"></div>
    <div class="absolute top-0 left-0">
      <button @click="toggle3D2D()" class="focus:outline-none text-white bg-black w-12 h-12 border-blue-800 bg-transparent-black border rounded-full shadow-2xl mt-3 mr-3 ml-3">
        <span v-if="view3D">3D</span>
        <span v-if="!view3D">2D</span>
      </button>
      <button :key="ii" v-for="(btn, ii) in btns.filter(e => e.place !== 'tr')" @click="$emit(btn.event)" class="focus:outline-none text-white bg-black h-12 border-blue-800 bg-transparent-black border rounded-full shadow-2xl px-4 mt-3 mr-3">
        {{ btn.text }}
      </button>
    </div>
    <div class="absolute top-0 right-0">
      <button :key="ii" v-for="(btn, ii) in btns.filter(e => e.place === 'tr')" @click="$emit(btn.event)" class="focus:outline-none text-white bg-black h-12 border-blue-800 bg-transparent-black border rounded-full shadow-2xl px-4 mt-3 mr-3">
        {{ btn.text }}
      </button>
    </div>
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
import ForceGraph3D from '3d-force-graph'
import SpriteText from 'three-spritetext'
import { Mesh, CircleBufferGeometry, MeshBasicMaterial, SpriteMaterial, TextureLoader, Sprite, Raycaster, ShaderMaterial, Color } from 'three'
// import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MapControls } from './OrbitControls.js'
import { makeBase, Tree } from '../../Reusable/index'

export default {
  mixins: [Tree],
  props: {
    run: {
      default: true
    },
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
      cuber: false,
      vm: this,
      pauseAnimation () {},
      base: false,
      ready: false,
      view3D: true,
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
    async install () {
      let raylist = []
      var myGraph = ForceGraph3D({ controlType: 'fly', rendererConfig: { antialias: true, alpha: true } })
      myGraph.d3Force('link').distance(45)
      myGraph.warmupTicks(60 * 0.5)
      myGraph.d3AlphaDecay(0.01)
      myGraph.nodeLabel('__' + Math.random())
      myGraph.linkLabel('__' + Math.random())

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
      // engine.pauseAnimation()
      this.pauseAnimation = () => {
        engine.pauseAnimation()
        engine.scene().traverse((item) => {
          if (item.dispose) {
            item.dispose()
          }
        })
      }
      this.$watch('run', () => {
        if (this.run) {
          engine.resumeAnimation()
        } else {
          engine.pauseAnimation()
        }
      })
      // engine.pauseAnimation()
      // this.base.onLoop(() => {
      //   engine.onEngineTick()
      // })

      // this.$parent.$emit('scene', engine.scene())
      // this.$parent.$emit('camera', engine.camera())
      let makePhantom = ({ color = `#32cd32`, opacity = 1 }) => new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          color: { value: new Color(color) },
          time: { value: 0 },
          opacity: { value: opacity }
        },
        vertexShader: `
          varying vec2 vUv;
          void main (void) {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision highp float;

          // uniform lowp vec2 sceneRect;
          uniform float time;
          uniform vec3 color;
          uniform float opacity;
          varying vec2 vUv;

          const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

          float noise( in vec2 p ) {
            return sin(p.x)*sin(p.y);
          }

          float fbm4( vec2 p )
          {
              float f = 0.0;
              f += 0.5000 * noise( p ); p = m * p * 2.02;
              f += 0.2500 * noise( p ); p = m * p * 2.03;
              f += 0.1250 * noise( p ); p = m * p * 2.01;
              f += 0.0625 * noise( p );
              return f / 0.9375;
          }

          float fbm6( vec2 p )
          {
              float f = 0.0;
              f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
              f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
              f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
              f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
              f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
              f += 0.015625*(0.5+0.5*noise( p ));
              return f/0.96875;
          }

          float pattern (vec2 p) {
            float vout = fbm4( p + time + fbm6( p + fbm4( p + time )) );
            return abs(vout);
          }

          void main (void) {
            vec3 outColor = vec3(0.0);
            vec2 pt = vUv.xy;
            // pt.y = pt.y * (sceneRect.y / sceneRect.x);
            pt.xy = pt.xy * 2.0;

            outColor.r = 1.0 - 0.55 * pattern(pt.xy + -0.4015 * cos(time));
            outColor.g = 1.0 - 0.55 * pattern(pt.xy + 0.0);
            outColor.b = 1.0 - 0.55 * pattern(pt.xy + 0.4015 * cos(time));

            gl_FragColor = vec4(clamp(color * outColor.rgb, 0.0, 1.0), opacity);
          }
        `
      })
      let phantomMatLime = makePhantom({ color: 'rgb(20, 156, 255)', opacity: 1 })
      let phantomMatWhite = makePhantom({ color: '#ffffff', opacity: 1 })
      this.base.onLoop(() => {
        phantomMatLime.uniforms.time.value = window.performance.now() * 0.001
        phantomMatWhite.uniforms.time.value = window.performance.now() * 0.001
      })

      // this.cuber = new ShaderCube({ renderer: engine.renderer(), loop: this.base.onLoop, res: 32 })
      // this.cuber.out.material.transparent = true
      // this.cuber.out.material.opacity = 0.8
      // engine.linkMaterial(this.cuber.out.material)

      // console.log(engine.state)

      let simulateData = () => {
        const N = 30
        const idMap = new Map()
        const graphBase = {
          nodes: [...Array(N).keys()].map(i => ({ id: i, neighbors: [], links: [] })),
          links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
              source: id,
              target: Math.round((id * 0.5 - 1))
            }))
        }

        graphBase.nodes.forEach((node) => {
          idMap.set(node.id, node)
          let id = node.id
          let imgs = ['cat.jpg', 'dog.jpg', 'eagle.jpg', 'elephant.jpg', 'grasshopper.jpg', 'octopus.jpg', 'owl.jpg', 'panda.jpg', 'squirrel.jpg', 'tiger.jpg', 'whale.jpg']
          let name = imgs[id % (imgs.length - 2)]
          node.img = `/imgs/${name}`
          node.name = name.replace('.jpg', '')

          node.badge = (Math.random() * 50).toFixed(0)
        })

        // cross-link node objects
        graphBase.links.forEach(link => {
          // const a = graphBase.nodes.find(e => e.id === link.source)
          // const b = graphBase.nodes.find(e => e.id === link.target)
          const a = idMap.get(link.source)
          const b = idMap.get(link.target)

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
      simulateData()

      // window.simulateData = simulateData
      // setTimeout(() => {
      // }, 5000)

      // let loadData = async (data) => {
      //   raylist = []

      //   myGraph.nodeId(this.nodeIDKey)

      //   let graphBase = data
      //   // cross-link node objects
      //   graphBase.links.forEach(link => {
      //     const a = graphBase.nodes.find(e => e[this.nodeIDKey] === link.source)
      //     const b = graphBase.nodes.find(e => e[this.nodeIDKey] === link.target)
      //     // const a = idMap.get(link.source)
      //     // const b = idMap.get(link.target)

      //     if (!a || !b) {
      //       return
      //     }

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
      // // loadData()

      // this.$watch('graph', (v) => {
      //   // simulateData()

      //   if (v) {
      //     loadData(v)
      //     // controls.object.position.x = 0
      //     // controls.object.position.y = 0
      //   }
      // })

      const highlightNodes = new Set()
      const highlightLinks = new Set()
      let hoverNode = null

      window.addEventListener('resize', () => {
        let rect = this.$el.getBoundingClientRect()
        let height = rect.height
        // if (height > 700) {
        //   height = 700
        // }
        myGraph.height(height)
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
      myGraph.camera().position.set(0, 0, 450)

      let controls = new MapControls(myGraph.camera(), myGraph.renderer().domElement)
      controls.panSpeed = 2
      controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
      controls.dampingFactor = 0.05
      controls.enableRotate = false
      controls.screenSpacePanning = true
      controls.minDistance = 1
      controls.maxDistance = 4000
      let start = 0
      let end = 0
      let raycaster = new Raycaster()
      let { Vector2 } = require('three/src/math/Vector2')

      var mouse = new Vector2()
      let mouseRect = this.$el.getBoundingClientRect()
      window.addEventListener('resize', () => {
        mouseRect = this.$el.getBoundingClientRect()
      })
      let hm = {
        tx: 0,
        ty: 0,
        dx: 0,
        dy: 0,
        ax: 0,
        ay: 0
      }
      let leftbar = 0
      let toolbar = 0
      function onTouchStart (event) {
        let tchs = event.touches[0]
        if (tchs) {
          // console.log(tchs)
          mouse.x = ((tchs.pageX - leftbar) / mouseRect.width) * 2 - 1
          mouse.y = -((tchs.pageY - toolbar) / mouseRect.height) * 2 + 1
          hm.tx = tchs.pageX
          hm.ty = tchs.pageX
        }
      }
      function onTouchMove (event) {
        let tchs = event.touches[0]
        if (tchs) {
          // console.log(tchs)
          mouse.x = ((tchs.pageX - leftbar) / mouseRect.width) * 2 - 1
          mouse.y = -((tchs.pageY - toolbar) / mouseRect.height) * 2 + 1
          hm.dx = tchs.pageX - hm.tx
          hm.dy = tchs.pageX - hm.ty

          hm.ax += hm.dx
          hm.ay += hm.dy

          hm.tx = tchs.pageX
          hm.ty = tchs.pageX
        }
      }
      let onTouchEnd = (evt) => {
        end = new Date().getTime()
        let delta = end - start
        let dist = Math.sqrt(Math.pow(hm.ax, 2) + Math.pow(hm.ay, 2))
        if (delta < 250 && dist < 30) {
          raycaster.setFromCamera(mouse, myGraph.camera())
          let hits = raycaster.intersectObjects(raylist)
          let hit = hits[0]
          if (hit) {
            let node = hit.object.userData.node
            this.$emit('node-click', node)
          }
        }
        hm = {
          tx: 0,
          ty: 0,
          dx: 0,
          dy: 0,
          ax: 0,
          ay: 0
        }
      }
      controls.domElement.addEventListener('touchstart', onTouchStart)
      controls.domElement.addEventListener('touchmove', onTouchMove)
      controls.domElement.addEventListener('touchend', onTouchEnd)
      controls.addEventListener('start', (evt) => {
        start = new Date().getTime()
      })

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
          node.onCanOpen && node.onCanOpen(true)
        } else {
          node.onCanOpen && node.onCanOpen(false)
        }
        if (dt >= dragRadius) {
        } else if (dt < dragRadius) {
        }
      })

      engine.onNodeDragEnd((node, translate) => {
        controls.enablePan = true

        let { x, y } = translate
        x = x || 0
        y = y || 0
        let dt = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

        if (node && dt > dragRadius) {
          this.$emit('node-drag', node)
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

      // -------

      // var Params = {
      //   exposure: 1,
      //   bloomStrength: 0.6,
      //   bloomThreshold: 0.9,
      //   bloomRadius: 0.7
      // }
      // let { EffectComposer } = require('three/examples/jsm/postprocessing/EffectComposer.js')
      // let { RenderPass } = require('three/examples/jsm/postprocessing/RenderPass.js')
      // let { UnrealBloomPass } = require('three/examples/jsm/postprocessing/UnrealBloomPass.js')
      // let { Vector2 } = require('three')
      // let renderer = engine.renderer()
      // let element = engine.renderer().domElement
      // let rect = element.getBoundingClientRect()
      // let depth = 70000

      // let screen = getScreen({ camera: engine.camera(), depth })
      // let image = await new Promise((resolve) => {
      //   let img = new Image()
      //   img.onload = () => {
      //     resolve(img)
      //   }
      //   img.src = require('../AppUnits/hdri/sky-space-dark-galaxy-2150.jpg')
      // })
      // let bgtex = new TextureLoader().load(require('../AppUnits/hdri/sky-space-dark-galaxy-2150.jpg'))
      // let bgmat = new MeshBasicMaterial({ map: bgtex })
      // let ww = screen.max * 1.2
      // let hh = screen.max * 1.2
      // ww = screen.max * image.width / image.height

      // let { PlaneBufferGeometry } = require('three')
      // let bgplane = new PlaneBufferGeometry(ww, hh)
      // let bgmesh = new Mesh(bgplane, bgmat)
      // bgmesh.position.z = -depth
      // engine.scene().add(bgmesh)

      // var renderScene = new RenderPass(engine.scene(), engine.camera())
      // var bloomPass = new UnrealBloomPass(new Vector2(rect.width * 2, rect.height * 2), 1.5, 0.4, 0.85)
      // bloomPass.threshold = Params.bloomThreshold
      // bloomPass.strength = Params.bloomStrength
      // bloomPass.radius = Params.bloomRadius

      // this.composer = new EffectComposer(renderer)
      // this.composer.addPass(renderScene)
      // this.composer.addPass(bloomPass)
      // this.base.onResize(() => {
      //   let rect = element.getBoundingClientRect()
      //   let dpi = window.devicePixelRatio || 1
      //   bloomPass.setSize(rect.width * dpi, rect.height * dpi)
      //   this.composer.setSize(rect.width * dpi, rect.height * dpi)
      // })
      // myGraph.postProcessingComposer(this.composer)

      // -------

      let iconGeo = false
      let borderGeo = false

      let iconGeoTriangle = new CircleBufferGeometry(10, 3)
      let borderGeoTriangle = new CircleBufferGeometry(11, 3)
      iconGeoTriangle.computeBoundingSphere()
      borderGeoTriangle.computeBoundingSphere()
      borderGeoTriangle.translate(0, 0, -0.1)
      iconGeoTriangle.rotateZ(Math.PI * -0.5)
      borderGeoTriangle.rotateZ(Math.PI * -0.5)

      let iconGeoSquare = new CircleBufferGeometry(10, 4)
      let borderGeoSquare = new CircleBufferGeometry(11, 4)
      iconGeoSquare.computeBoundingSphere()
      borderGeoSquare.computeBoundingSphere()
      borderGeoSquare.translate(0, 0, -0.1)
      // borderGeoSquare.rotateZ(Math.PI * 0.25)
      // iconGeoSquare.rotateZ(Math.PI * 0.25)

      let iconGeoOcta = new CircleBufferGeometry(15, 8)
      let borderGeoOcta = new CircleBufferGeometry(16, 8)
      iconGeoOcta.computeBoundingSphere()
      borderGeoOcta.computeBoundingSphere()
      borderGeoOcta.translate(0, 0, -0.1)

      // borderGeoOcta.rotateZ(Math.PI * 0.5)
      // iconGeoOcta.rotateZ(Math.PI * 0.5)

      let iconGeoCircle = new CircleBufferGeometry(14, 40)
      let borderGeoCircle = new CircleBufferGeometry(15, 40)
      iconGeoCircle.computeBoundingSphere()
      borderGeoCircle.computeBoundingSphere()
      borderGeoCircle.translate(0, 0, -0.1)

      let iconGeoSmallCircle = new CircleBufferGeometry(10, 40)
      let borderGeoSmallCircle = new CircleBufferGeometry(11, 40)
      iconGeoSmallCircle.computeBoundingSphere()
      borderGeoSmallCircle.computeBoundingSphere()
      borderGeoSmallCircle.translate(0, 0, -0.1)

      let iconGeoBadge = new CircleBufferGeometry(3, 40)
      let borderGeoBadge = new CircleBufferGeometry(4, 40)
      iconGeoBadge.computeBoundingSphere()
      borderGeoBadge.computeBoundingSphere()
      borderGeoBadge.translate(0, 0, -0.1)

      let transparentMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
      // // let whiteMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 1.0, color: 0xffffff, envMap: this.cuber.out.envMap })
      // let blueMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0.85, color: 0xffffff, envMap: this.cuber.out.envMap })
      // let limeMat = new MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0.85, color: 0x32cd32, envMap: this.cuber.out.envMap })
      let whiteMat = phantomMatWhite
      let limeMat = phantomMatLime
      let blueMat = phantomMatWhite

      engine.linkWidth(2)

      // let map = new Map()
      // user
      // loveline
      engine
        // .linkLabel('name')
        .linkResolution(3)
        .linkWidth(link => highlightLinks.has(link) ? 3 : 2)
        .linkColor(link => highlightLinks.has(link) ? 'rgb(20, 156, 255)' : 'rgba(255,255,255,1.0)')
        .linkOpacity(0.6)
        .linkDirectionalParticles(link => highlightLinks.has(link) ? 3 : 1)
        .linkDirectionalParticleWidth(link => highlightLinks.has(link) ? 4 : 3)
        .linkDirectionalParticleResolution(5)
        // .nodeResolution(3)
        .nodeThreeObject((node) => {
          if (node.type === 'traverse') {
            iconGeo = iconGeoSmallCircle
            borderGeo = borderGeoSmallCircle
          } else if (node.type === 'user') {
            iconGeo = iconGeoOcta
            borderGeo = borderGeoOcta
          } else {
            iconGeo = iconGeoSmallCircle
            borderGeo = borderGeoSmallCircle
          }
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

          let badgeMat = new SpriteMaterial({ color: 'red', transparent: true, opacity: 0.79 })
          const badge = new Sprite(badgeMat)
          badge.geometry = iconGeoBadge
          sprite.add(badge)

          let badgeText = new SpriteText(``)
          badgeText.color = 'white'
          // badgeText.strokeColor = 'black'
          // badgeText.strokeWidth = 1.5
          badgeText.textHeight = 2.5
          badge.add(badgeText)
          badge.position.x = iconGeo.boundingSphere.radius * 0.86
          badge.position.y = iconGeo.boundingSphere.radius * 0.86
          let onBadgeChange = (evtNode) => {
            if (node._id === evtNode._id) {
              if (evtNode.badge) {
                let badgeValue = Number(evtNode.badge)
                if (badgeValue > 99) {
                  badgeValue = '99+'
                }
                badgeText.text = badgeValue + ''
                badge.visible = true
              } else {
                badgeText.text = ''
                badge.visible = false
              }
            }
          }
          onBadgeChange(node)
          this.$on('badge', onBadgeChange)

          border.position.z = 2.99
          sprite.position.z = 3

          let spriteText = new SpriteText(`${node.name}`)
          spriteText.color = 'white'
          spriteText.strokeColor = 'black'
          spriteText.strokeWidth = 1
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
          node.onCanOpen = (can) => {
            border.material = can ? limeMat : blueMat
          }

          // node.onCanClick = (hNode) => {
          //   if (hNode && hNode._id === node._id) {
          //     border.material = limeMat
          //     border.scale.set(1.1, 1.1, 1.1)
          //   } else {
          //     border.material = whiteMat
          //     border.scale.set(1, 1, 1)
          //   }
          // }
          // this.$on('node-hover', node.onCanClick)

          // setTimeout(() => {
          //   clicker.frustumCulled = true
          // })
          clicker.userData.node = node
          raylist.push(clicker)
          return clicker
        })
        .onNodeHover(node => {
          // this.$emit('node-hover', node)

          if (node) {
            // node.onCanClick && node.onCanClick(true)
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
