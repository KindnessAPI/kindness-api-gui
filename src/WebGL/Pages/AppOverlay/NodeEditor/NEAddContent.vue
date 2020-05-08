
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
import { Graph, Content, Auth } from '../../../../APIs/KA.js'
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
        title: 'New Memo'
      }
    }
  },
  methods: {
    async createContentNode () {
      this.loading = true
      let newNode = await Graph.createContentNode({ name: this.content.title })
      await Graph.linkContentNode({ fromID: this.node._id, toID: newNode._id })
      let me = Auth.currentProfile.user
      await Content.createContent({ userID: me.userID, username: me.username, nodeID: newNode._id, title: newNode.name })
      this.loading = false
      window.dispatchEvent(new Event('reload-graph'))
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
