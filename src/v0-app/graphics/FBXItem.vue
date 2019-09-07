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
  ...require('three/examples/jsm/loaders/FBXLoader.js')
}
window.THREE = THREE

const Zlib = require('three/examples/js/libs/inflate.min')
window.Zlib = Zlib.Zlib
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
      this.loader = new THREE.FBXLoader()

      // eslint-disable-next-line
      this.loader.load(file, (obj) => {
        let group = new THREE.Object3D()

        var light = new THREE.PointLight(0xffffff, 9, 80)
        light.position.set(0, 50, 50)
        var light2 = new THREE.PointLight(0xffffff, 9, 80)
        light2.position.set(0, 50, -50)

        group.add(light)
        group.add(light2)

        obj.rotation.y = Math.PI

        obj.traverse(mesh => {
          mesh.material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5)
          })
        })

        group.add(obj)

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

    requireAll(require.context('file-loader!./model/fbx', true, /\.FBX$/))

    // eslint-disable-next-line
    let file = require('file-loader!./model/fbx/megapack1/party-popper.FBX')

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
