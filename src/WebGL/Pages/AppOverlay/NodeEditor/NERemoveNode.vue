
<template>
  <div v-if="node && node.type !== 'user' || hasTwoUser">
    <div class="mb-3">
      <span class=" text-2xl">
        Remove
      </span>
      {{ node.name }}
    </div>
    <div class="mb-3">
      <ReButton :color="'red'" @click="removeNode()">Remove This & <span v-if="totalLinks">{{ totalLinks }} related</span> Link<span v-if="loading">⏱</span></ReButton>
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
      hasTwoUser: this.graph.nodes.filter(e => e.type === 'user').length >= 2,
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
      if (!window.confirm('Remove ?')) {
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
