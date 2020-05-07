<template>
  <div v-if="content" class="max-w-xl mx-auto">
    <div>
      <img class="w-full h-64 object-cover object-center" :src="content.coverImg" alt="">
    </div>
    <div class="text-xl">{{ content.title }}</div>
    <div class="whitespace-pre-wrap">{{ content.content }}</div>
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
  mounted () {
    this.getContent()
  },
  data () {
    return {
      content: null
    }
  },
  methods: {
    async getContent () {
      this.content = await Content.getContentByNodeID({ nodeID: this.node._id })
    }
  }
}
</script>

<style>

</style>
