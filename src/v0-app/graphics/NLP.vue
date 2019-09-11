<template>
  <div class="h-full">
    <div class="h-full overflow-auto scroller bg-white">
      <textarea class="fixed shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model="source" @input="onType">
      </textarea>

      <div class="h-32"></div>
      <!-- <button @click="cache">Download Cache</button> -->
      <button v-if="!hasEnoughCache" @click="cache">Download Cache</button>
      <button v-if="hasEnoughCache" @click="clearCache">Clear Cache</button>
      <h2 v-if="showProgress">
        {{ (accu / total * 100).toFixed(0) }}%
      </h2>
      <div >
        <div :key="item._id" v-for="item in items">
          <div @click="loadFBX(item)" class="cursor-pointer" @mouseenter="!hasEnoughCache ? () => {} : loadFBX(item)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import localforage from 'localforage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
var Sentiment = require('sentiment')
var sentiment = new Sentiment()

var store = localforage.createInstance({
  name: 'glb'
})
var THREE = {
  ...require('three'),
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
      source: 'party',
      total: 0,
      accu: 0,
      hasEnoughCache: false,
      showProgress: false,
      items: [],
      mounter: new THREE.Object3D()
    }
  },
  methods: {
    async checkCanType () {
      let howmany = await store.length()
      console.log(howmany)
      this.hasEnoughCache = (howmany) > 20
      this.$forceUpdate()
    },
    cache () {
      return new Promise((resolve) => {
        let loader = new THREE.FileLoader()
        this.total = this.items.length
        this.accu = 0
        this.showProgress = true
        loader.setResponseType('arraybuffer')
        this.items.forEach((item) => {
          loader.load(item.file, async (data) => {
            this.accu++
            if (this.accu === this.total) {
              resolve()
              this.checkCanType()
            }
            await store.setItem(item.file, data)
          })
        })
      })
    },
    getArrayBuffer (item) {
      return new Promise(async (resolve) => {
        let download = () => {
          let loader = new THREE.FileLoader()
          loader.setResponseType('arraybuffer')
          loader.load(item.file, async (data) => {
            resolve(data)
            await store.setItem(item.file, data)
          })
        }
        try {
          let data = await store.getItem(item.file)
          if (!data) {
            download()
          } else {
            resolve(data)
          }
        } catch (e) {
          download()
        }
      })
    },
    onType () {
      var result = sentiment.analyze(this.source)
      console.log(result)
      let loadTarget = []
      result.tokens.forEach((word) => {
        let item = this.items.slice().reverse().sort(() => {
          return Math.random() * 10 - 5
        }).filter(each => each.name.toLowerCase().indexOf(word.toLowerCase()) !== -1).filter((item, idx) => {
          if (this.hasEnoughCache) {
            return idx < 10
          } else {
            return idx < 2
          }
        })
        if (item) {
          loadTarget.push(...item)
        }
      })

      if (loadTarget) {
        if (this.mounter) {
          this.scene.remove(this.mounter)
          this.mounter = new THREE.Object3D()
          this.scene.add(this.mounter)
        }
        let num = loadTarget.length

        this.engine.camera.position.z = num * 50

        var light = new THREE.PointLight(0xffffff, 1.8, 900 * num)
        light.position.set(0, 10, 90 * num)
        var light2 = new THREE.PointLight(0xffffff, 1.8, 900 * num)
        light2.position.set(0, 10, -90 * num)

        this.mounter.add(light)
        this.mounter.add(light2)

        loadTarget.forEach((item, idx) => {
          item.position.x = idx * 40 - ((loadTarget.length - 1) * 0.5 * 40)
          item.position.y = (((Math.random() - 0.5) * loadTarget.length - 1) * 10.5)
          this.justload(item, this.mounter)
        })
      }
      // list.some(li => item.name.toLowerCase().indexOf(li.toLowerCase()) !== -1)
    },
    async justload (item, mounter) {
      var loader = new THREE.GLTFLoader()
      this.loader = loader
      NProgress.start()

      let arraybuffer = await this.getArrayBuffer(item)
      // console.log(arraybuffer)
      // eslint-disable-next-line
      this.loader.parse(arraybuffer, '/', (obj) => {
        NProgress.done()
        let group = new THREE.Object3D()
        // console.log(obj)
        group.add(obj.scene)
        obj.scene.scale.multiplyScalar(40)

        group.rotation.x = item.rotation.x
        group.rotation.y = item.rotation.y
        group.rotation.z = item.rotation.z

        group.position.x = item.position.x
        group.position.y = item.position.y
        group.position.z = item.position.z

        mounter.add(group)
      })
    },
    async loadFBX (item) {
      this.engine.camera.position.z = 50
      var loader = new THREE.GLTFLoader()
      this.loader = loader
      NProgress.start()

      let arraybuffer = await this.getArrayBuffer(item)
      // console.log(arraybuffer)
      // eslint-disable-next-line
      this.loader.parse(arraybuffer, '/', (obj) => {
        // // eslint-disable-next-line
        // this.loader.load(item.file, (obj) => {
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

        // args.position = new THREE.Vector3()

        // group.position.x = item.position.x
        // group.position.y = item.position.y
        // group.position.z = item.position.z

        if (this.mounter) {
          this.scene.remove(this.mounter)
          this.mounter = new THREE.Object3D()
          this.mounter.add(group)
          this.scene.add(this.mounter)
        }

        // this.setup({ obj: obj.children[0] })
      })
    },
    loadFBXDev: _.debounce(function (args) {
      // if (process.env.NODE_ENV === 'development') {
      this.loadFBX(args)
      // }
    }, 150),
    async clearCache () {
      await localforage.clear()
      await store.clear()
      await this.checkCanType()
    }
  },
  async mounted () {
    this.checkCanType()

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
      'envelope with heart',
      'fearful'
    ]
    var requireAll = (r, folder, rotation) => {
      r.keys().forEach((item, idx) => {
        let name = folder + ' - ' + (item + '').replace('./', '').replace('.glb', '').replace(' 3DS', '').replace(' FBX', '').replace('/', '__')
        let url = r(item)
        let newItem = {
          _id: this.items.length,
          rotation: rotation,
          position: new THREE.Vector3(),
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
    // let file = require('file-loader!./model/glb/emoji3/party.glb')
    // this.loadFBX({ file, rotation: new THREE.Vector3(0, 0, 0), position: new THREE.Vector3() })

    this.onType()

    setInterval(() => {
      let time = window.performance.now() * 0.0001
      let mounter = this.mounter

      if (mounter) {
        mounter.children.forEach((each, idx) => {
          each.rotation.x = Math.sin(idx + time * 2.0) * 0.15
          each.rotation.z = Math.sin(idx + time * 2.0) * 0.15
        })
      }
    }, 15)
  },
  beforeDestroy () {
    this.scene.remove(this.mounter)
  }
}
</script>

<style lang="postcss">
.btn {
  @apply font-bold py-2 px-4 rounded;
}
.btn-blue {
  @apply bg-blue-500 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>
