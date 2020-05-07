<template>
  <div>
    <div class="mb-3 text-xl">
      Memo Edit
    </div>
    <div v-if="content">
      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Title</div>
        <textarea placeholder="Title" v-model="content.title" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Content</div>
        <textarea placeholder="Content" v-model="content.content" cols="36" rows="15" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Cover Image</div>
        <div>
          <img :src="content.coverImg" class="border w-16 h-16 m-1 inline-block" alt="">
        </div>
        <textarea placeholder="Cover image link" v-model="content.coverImg" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3">
        <ReButton :color="'green'" @click="updateContent()">Save Memo <span v-if="loading">⏱</span></ReButton>
      </div>
    </div>
    <div v-else>
      Loading Memo
    </div>
  </div>
</template>

<script>
import { Content, Auth, Graph } from '../../../../APIs/KA.js'
export default {
  props: {
    node: {}
  },
  components: {
    ReButton: require('../../AppResuables/ReButton.vue').default
  },
  data () {
    return {
      loading: false,
      content: false
    }
  },
  async mounted () {
    await this.initContent()
  },
  methods: {
    async initContent () {
      try {
        console.log(this.node._id, this.node.name)
        let me = Auth.currentProfile.user
        let content = await Content.getContentByNodeID({ nodeID: this.node._id })
        if (!content) {
          content = await Content.createContent({ userID: me.userID, username: me.username, nodeID: this.node._id, title: this.node.name })
        }
        this.content = content
      } catch (e) {
        console.log(e)
      }
    },
    async updateContent () {
      try {
        this.loading = true
        await Content.updateContent({ edit: this.content })
        let node = {
          _id: this.node._id,
          name: this.content.title,
          img: this.content.coverImg || this.node.img
        }
        await Graph.updateMyNode({ edit: node })
        this.loading = false
        this.$emit('close')
        window.dispatchEvent(new Event('reload-graph'))
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
