
<template>
  <div v-if="node && node.type !== 'user'">
    <div class="mb-3 text-3xl">
      Remove
    </div>
    <div class="mb-3">
      <!-- <img class="w-16 h-16 object-cover object-center" :src="`${node.img}`" alt=""> -->
      <ReButton :color="'red'" @click="removeNode()">Remove Node & Link<span v-if="loading">⏱</span></ReButton>
    </div>
    <!-- <div class="mb-3">
      <table>
        <tr :key="item._id" v-for="item in links.result">
          <td class="pr-3 pb-3">
            @{{ item.username }}
          </td>
          <td class="pr-3 pb-3">
            <ReButton :color="'green'" @click="removeEdge(item)">Unlink <span v-if="item.loading">⏱</span></ReButton>
          </td>
        </tr>
      </table>
    </div> -->
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
    async removeNode () {
      if (!window.confirm('remove ?')) {
        return
      }
      let node = this.node
      this.loading = true
      await Graph.removeEdgesSourceNode({ nodeID: node._id })
      await Graph.removeEdgesTargetNode({ nodeID: node._id })
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
