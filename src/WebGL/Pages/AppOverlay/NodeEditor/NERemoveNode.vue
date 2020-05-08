
<template>
  <div v-if="node && node.type !== 'user'">
    <div class="mb-3 text-xl">
      Remove
    </div>
    <div class="mb-3">
      <ReButton :color="'red'" @click="removeNode()">Remove Node & Link<span v-if="loading">⏱</span></ReButton>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import { Graph, Content } from '../../../../APIs/KA.js'
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

      if (node.type === 'content') {
        try {
          let content = await Content.getContentByNodeID({ nodeID: node._id })
          await Content.removeContentByID({ contentID: content._id })
        } catch (e) {
          console.log(e)
        }
      }

      this.loading = false
      this.$emit('close')
      window.dispatchEvent(new Event('reload-graph'))
    }
  }
}
</script>

<style>

</style>
