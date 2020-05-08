<template>
  <div v-if="content" class="max-w-xl mx-auto">
    <div>
      <img class="w-full h-64 object-cover object-center" :src="content.coverImg" alt="">
    </div>
    <div class="p-3">
      <div class="text-xl">{{ content.title }}</div>
      <div class="whitespace-pre-wrap">{{ content.content }}</div>
    </div>
    <!-- <div class="related">
      <div class="inline-block w-1/2 h-32 p-3 " :key="one._id" v-for="one in related">
        <div v-if="one.type === 'content'" class="bg-white w-full h-full">
          Read: {{ one.name }}
        </div>
        <div v-if="one.type === 'traverse'" class="bg-white w-full h-full">
          Traverse: {{ one.name }}
        </div>
      </div>
    </div> -->
  </div>
  <div class="max-w-xl mx-auto" v-else-if="content === null">
    Loading Content... ⏱
  </div>
  <div class="max-w-xl mx-auto" v-else-if="!content">
    Can't Load Content... ✨
  </div>
</template>

<script>
import { Content } from '../../../../APIs/KA.js'

export default {
  props: {
    node: {}
  },
  components: {
  },
  watch: {
    node () {
      this.getContent()
    }
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
      // let src = await Graph.queryEdgesSourceNode({ nodeID: this.node._id })
      // let target = await Graph.queryEdgesTargetNode({ nodeID: this.node._id })
      // let list = [
      //   ...src.map(e => e.target),
      //   ...target.map(e => e.source)
      // ]
      // this.related = await Graph.queryNodesByList({ list })
      // this.related = this.related.filter(e => e.type === 'content')
    }
  }
}
</script>

<style>

</style>
