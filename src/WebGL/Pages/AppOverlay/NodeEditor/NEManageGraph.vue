
<template>
  <div v-if="node">
    <div class="mb- text-2xl">
      Relationship
    </div>
    <div>
      <table>
        <!-- <tr>
          <th>
            Nodes
          </th>
          <th>
            Action
          </th>
        </tr> -->
        <tr :key="enode._id" v-for="enode in graph.nodes">
          <td class="pr-3 pb-3">
            <div>
              {{ enode.name }}
            </div>
            <div class="text-gray-500 text-sm">
              {{ getType(enode.type) }}
            </div>
          </td>
          <td class="pr-3 pb-3">
            <img class="w-16 h-16 object-cover object-center" :src="`${enode.img}`" alt="">
          </td>
          <td class="pr-3 pb-3">
            <div :key="enode._id" v-if="enode._id !== node._id">
              <ReButton :key="'y' + enode._id + node._id" color="red" class="inline-block" @click="removeLink(node, enode)" v-if="(hasLink(node, enode) || hasLink(enode, node))">Unlink <span v-if="enode.loading">⏱</span></ReButton>
              <ReButton :key="'n' + enode._id + node._id" color="green" class="inline-block" @click="addLink(node, enode)" v-if="!(hasLink(node, enode) || hasLink(enode, node))">Link <span v-if="enode.loading">⏱</span></ReButton>
            </div>
          </td>
        </tr>
      </table>

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
      Graph,
      loading: false
    }
  },
  mounted () {
  },
  methods: {
    getType (node) {
      if (node === 'traverse') {
        return `Friend's Profile`
      } else if (node === 'user') {
        return 'Your Profile'
      }
    },
    hasLink (fromNode, toNode) {
      return this.graph.links.find(e => e.source._id === fromNode._id && e.target._id === toNode._id)
    },
    async addLink (fromNode, toNode) {
      toNode.loading = true
      this.$forceUpdate()
      await Graph.linkFriendTraverseNode({ fromID: fromNode._id, toID: toNode._id })
      toNode.loading = false
      this.$forceUpdate()
      window.dispatchEvent(new Event('reload-graph'))
    },
    async removeLink (fromNode, toNode) {
      toNode.loading = true
      this.$forceUpdate()
      let link = this.hasLink(fromNode, toNode) || this.hasLink(toNode, fromNode)
      await Graph.removeEdgeByID({ edgeID: link._id })
      toNode.loading = false
      this.$forceUpdate()
      window.dispatchEvent(new Event('reload-graph'))
    }
  }
}
</script>

<style>

</style>
