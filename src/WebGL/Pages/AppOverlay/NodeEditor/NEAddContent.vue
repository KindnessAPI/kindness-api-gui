
<template>
  <div>
    <!-- <pre>{{ node }}</pre> -->
    <div class="mb-3 text-xl">
      Add a memo to this node.
    </div>
    <div class="mb-3">
      <ReButton :color="'green'" @click="createContentNode()">Add a Memo <span v-if="loading">⏱</span></ReButton>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import { Graph } from '../../../../APIs/KA.js'
export default {
  props: {
    node: {}
  },
  components: {
    ...require('../../../webgl').default
  },
  data () {
    return {
      loading: false,
      content: {
        title: 'New Piece of Content'
      }
    }
  },
  methods: {
    async createContentNode () {
      this.loading = true
      let newNode = await Graph.createContentNode({ name: this.content.title })
      await Graph.linkContentNode({ fromID: this.node._id, toID: newNode._id })
      this.loading = false
      window.dispatchEvent(new Event('reload-graph'))
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
