<template>
  <div v-if="myNode">
    <div>
      <div class="mb-3">My Pic: </div>
      <textarea class="py-2 px-3 resize-none border border-black" rows="1" cols="30" v-model="myNode.img"></textarea>
    </div>
    <div>
      <div class="mb-3">Submit</div>
      <button class="px-3 py-2 border border-black" @click="updateMyNode()">
        <div v-if="loading">Loading...</div>
        <div v-if="!loading">Update</div>
      </button>
    </div>
  </div>
  <div v-else-if="loading">
    Loading...
  </div>
</template>

<script>
import * as API from '../../../APIs/KA.js'

export default {
  props: {
  },
  data () {
    return {
      loading: false,
      myNode: false
    }
  },
  mounted () {
    this.getMyNode()
  },
  methods: {
    async updateMyNode () {
      if (this.loading) {
        return
      }
      this.loading = true
      await API.Graph.updateMyNode({ edit: this.myNode })
      this.loading = false
    },
    async getMyNode () {
      this.loading = true
      this.myNode = await API.Graph.getMyNode()
      this.loading = false
    }
  }
}
</script>

<style>

</style>
