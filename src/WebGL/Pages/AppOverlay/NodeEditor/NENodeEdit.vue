
<template>
  <div v-if="node">
    <div class="mb-3 text-3xl">
      Edit Details
    </div>
    <div class="mb-3">
      <textarea placeholder="name" v-model="node.name" cols="36" rows="1" class="max-w-full rounded-none whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
    </div>
    <div class="mb-3">
      <img :src="node.img" class="w-16 h-16" alt="">
      <textarea placeholder="photo link" v-model="node.img" cols="36" rows="1" class="max-w-full rounded-none whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
    </div>
    <div class="mb-3">
      <ReButton :color="'green'" @click="updateNode()">Update node <span v-if="loading">⏱</span></ReButton>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import { Graph } from '../../../../APIs/KA.js'
export default {
  props: {
    node: {},
    graph: {}
  },
  components: {
    ...require('../../../webgl').default
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
  },
  methods: {
    async updateNode () {
      this.loading = true
      let edit = {
        _id: this.node._id,
        name: this.node.name,
        img: this.node.img
      }
      await Graph.updateMyNode({ edit })
      this.loading = false
      window.dispatchEvent(new Event('reload-graph'))
    }
  }
}
</script>

<style>

</style>
