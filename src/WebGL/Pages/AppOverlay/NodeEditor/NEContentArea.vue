<template>
  <div v-if="content" class="max-w-xl mx-auto">
    <div>
      <img class="w-full h-64 object-cover object-center" :src="content.coverImg" alt="">
    </div>
    <div class="text-xl">{{ content.title }}</div>
    <div class="whitespace-pre-wrap">{{ content.content }}</div>
    <div class="related">
      <pre>{{ related }}</pre>
    </div>
  </div>
  <div class="max-w-xl mx-auto" v-else-if="content === null">
    Loading Content... ⏱
  </div>
  <div class="max-w-xl mx-auto" v-else-if="!content">
    Can't Load Content... ✨
  </div>
</template>

<script>
import { Content, Graph } from '../../../../APIs/KA.js'

export default {
  props: {
    node: {}
  },
  components: {
  },
  mounted () {
    this.getContent()
  },
  data () {
    return {
      related: false,
      content: null
    }
  },
  methods: {
    async getContent () {
      this.content = await Content.getContentByNodeID({ nodeID: this.node._id })
      let src = await Graph.queryEdgesSourceNode({ nodeID: this.node._id })
      let target = await Graph.queryEdgesTargetNode({ nodeID: this.node._id })
      let list = [
        ...src.map(e => e.target),
        ...target.map(e => e.source)
      ]
      this.related = await Graph.queryNodesByList({ list })
    }
  }
}
</script>

<style>

</style>
