<template>
  <div class="h-full">
    <div class="h-full overflow-auto scroller">
      <div :key="item._id" v-for="item in items">
        <div @click="loadFBX(item.file)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      items: [],
      mounter: new THREE.Object3D()
    }
  },
  methods: {
    loadFBX (file) {
      var loader = new THREE.GLTFLoader()
      this.loader = loader

      // eslint-disable-next-line
      this.loader.load(file, (obj) => {
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

        // group.rotation.y = Math.PI

        // obj.traverse(mesh => {
        //   mesh.material = new THREE.MeshPhongMaterial({
        //     color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5)
        //   })
        // })

        // group.add(obj)

        if (this.mounter) {
          this.scene.remove(this.mounter)
        }
        this.mounter = new THREE.Object3D()
        this.mounter.add(group)
        this.scene.add(this.mounter)

        // this.setup({ obj: obj.children[0] })
      })
    }
  },
  mounted () {
    var atmosphwere = new THREE.AmbientLight(0xffffff)
    this.mounter.add(atmosphwere)

    var requireAll = (r) => {
      r.keys().forEach((item, idx) => {
        let url = r(item)
        this.items.push({
          _id: this.items.length,
          name: (item + '').replace('./', '').replace('.FBX', ''),
          file: url
        })
      })
      this.$emit('items', this.items)
    }

    requireAll(require.context('file-loader!./model/glb', true, /\.glb$/))

    // eslint-disable-next-line
    let file = require('file-loader!./model/glb/emoji3/party.glb')

    this.loadFBX(file)

    setInterval(() => {
      let time = window.performance.now() * 0.0001
      let mounter = this.mounter
      if (mounter) {
        mounter.rotation.x = Math.sin(Math.sin(time * 2.0)) * 0.15
        mounter.rotation.z = Math.sin(Math.sin(time * 2.0)) * 0.15
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
