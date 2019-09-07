<template>
  <div class="h-full">
    <div class="h-full overflow-auto scroller">
      <div :key="item._id" v-for="item in items">
        <div @click="loadFBX(item)" class="cursor-pointer" @mouseenter="loadFBXDev(item)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import localforage from 'localforage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
var store = localforage.createInstance({
  name: 'glb'
})
var THREE = {
  ...require('three'),
  // ...require('three/examples/jsm/loaders/OBJLoader.js'),
  ...require('three/examples/jsm/loaders/GLTFLoader.js')
}

window.THREE = THREE

// window.Zlib = Zlib.Zlib
// const FBXLoader = require('three/examples/js/loaders/FBXLoader')
// window.FBXLoader = FBXLoader

export default {
  props: {
    scene: {},
    engine: {}
  },
  data () {
    return {
      total: 0,
      accu: 0,
      showProgress: false,
      goCache: false,
      items: [],
      mounter: new THREE.Object3D()
    }
  },
  methods: {
    async loadFBX (item) {
      var loader = new THREE.GLTFLoader()
      this.loader = loader
      NProgress.start()
      // eslint-disable-next-line
      this.loader.load(item.file, (obj) => {
        NProgress.done()
        let group = new THREE.Object3D()
        console.log(obj)
        group.add(obj.scene)
        obj.scene.scale.multiplyScalar(40)

        var light = new THREE.PointLight(0xffffff, 13, 156)
        light.position.set(0, 60, 125)
        var light2 = new THREE.PointLight(0xffffff, 13, 156)
        light2.position.set(0, 60, -125)

        group.add(light)
        group.add(light2)

        group.rotation.x = item.rotation.x
        group.rotation.y = item.rotation.y
        group.rotation.z = item.rotation.z

        if (this.mounter) {
          this.scene.remove(this.mounter)
        }
        this.mounter = new THREE.Object3D()
        this.mounter.add(group)
        this.scene.add(this.mounter)

        // this.setup({ obj: obj.children[0] })
      })
    },
    loadFBXDev (args) {
      if (process.env.NODE_ENV === 'development') {
        this.loadFBX(args)
      }
    },
    clearCache () {
      store.clear()
    }
  },
  mounted () {
    var atmosphwere = new THREE.AmbientLight(0xffffff)
    this.mounter.add(atmosphwere)

    var fixRotation = (list, item, v3) => {
      if (list.some(li => item.name.toLowerCase().indexOf(li.toLowerCase()) !== -1)) {
        item.rotation = v3
      }
    }

    let rPIList = [
      'alien',
      'ape',
      'ear',
      'eyes',
      'panda',
      'rabit',
      'robot',
      'dog',
      'snowman',
      'lips',
      'money',
      'party_popper',
      'pink bow'
    ]
    let zList = [
      'baby',
      'confused',
      'monkey',
      'rolling eyes',
      'smiling hearts',
      'pleading',
      'envelope_with_heart',
      'fearful'
    ]
    var requireAll = (r, folder, offset) => {
      r.keys().forEach((item, idx) => {
        let name = folder + ' - ' + (item + '').replace('./', '').replace('.glb', '').replace(' 3DS', '').replace(' FBX', '').replace('/', '__')
        let url = r(item)
        let newItem = {
          _id: this.items.length,
          rotation: offset,
          name,
          file: url
        }

        this.items.push(newItem)
        fixRotation(rPIList, newItem, new THREE.Vector3(0, Math.PI, 0))
        fixRotation(zList, newItem, new THREE.Vector3(0, 0, 0))
      })
    }

    requireAll(require.context('file-loader!./model/glb/emoji1', true, /\.glb$/), 'emoji1', new THREE.Vector3(0, Math.PI, 0))
    requireAll(require.context('file-loader!./model/glb/emoji2', true, /\.glb$/), 'emoji2', new THREE.Vector3(0, 0, 0))
    requireAll(require.context('file-loader!./model/glb/emoji3', true, /\.glb$/), 'emoji3', new THREE.Vector3(0, 0, 0))
    requireAll(require.context('file-loader!./model/glb/hands', true, /\.glb$/), 'hands', new THREE.Vector3(0, 0, 0))
    requireAll(require.context('file-loader!./model/glb/icons1', true, /\.glb$/), 'icons1', new THREE.Vector3(0, 0, 0))
    requireAll(require.context('file-loader!./model/glb/icons2', true, /\.glb$/), 'icons2', new THREE.Vector3(0, 0, 0))

    // eslint-disable-next-line
    let file = require('file-loader!./model/glb/emoji3/party.glb')
    this.loadFBX({ file, rotation: new THREE.Vector3(0, 0, 0) })

    setInterval(() => {
      let time = window.performance.now() * 0.0001
      let mounter = this.mounter
      if (mounter) {
        mounter.rotation.x = Math.sin(time * 2.0) * 0.15
        mounter.rotation.z = Math.sin(time * 2.0) * 0.15
      }
    }, 15)
  },
  beforeDestroy () {
    this.scene.remove(this.mounter)
  }
}
</script>

<style>

</style>
