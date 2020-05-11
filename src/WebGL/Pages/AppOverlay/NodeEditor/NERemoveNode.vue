
<template>
  <div v-if="node && node.type !== 'user' || isDev">
    <div class="mb-3 text-xl">
      Remove
    </div>
    <div class="mb-3">
      <ReButton :color="'red'" @click="removeNode()">Remove Node & <span v-if="totalLinks">{{ totalLinks }}</span> Link<span v-if="loading">⏱</span></ReButton>
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
      isDev: process.env.NODE_ENV === 'development',
      totalLinks: 0,
      loading: false
    }
  },
  async mounted () {
    let src = await Graph.queryEdgesSourceNode({ nodeID: this.node._id })
    let target = await Graph.queryEdgesTargetNode({ nodeID: this.node._id })
    this.totalLinks = src.length + target.length
  },
  methods: {
    async removeNode () {
      if (!window.confirm('remove ?')) {
        return
      }
      let node = this.node
      this.loading = true
      let src = await Graph.queryEdgesSourceNode({ nodeID: node._id })
      let target = await Graph.queryEdgesTargetNode({ nodeID: node._id })
      await Graph.removeEdgeByList({ list: [...src, ...target] })
      await Graph.removeNodeByID({ nodeID: node._id })

      this.loading = false
      this.$emit('close')
      window.dispatchEvent(new Event('reload-graph'))
    }
  }
}
</script>

<style>

</style>
