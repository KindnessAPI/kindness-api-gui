
<template>
  <div v-if="node && show">
    <div class="mb-3 text-3xl">
      Actions
    </div>
    <div class="mb-3">
      <ReButton v-if="node.type === 'traverse'" :color="'green'" :disabled="isMyself" @click="$router.push(`/profile/${node.value.username}/${node.value.userID}`); $emit('close')">Visit Profile <span v-if="loading">⏱</span></ReButton>
      <div>
        <span v-if="isMyself">(You're already inside your own profile.)</span>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import { Graph, Auth } from '../../../../APIs/KA.js'
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
      show: [
        this.node.type === 'traverse'
      ].some(e => e),
      isMyself: false,
      Graph,
      loading: false
    }
  },
  mounted () {
    if (this.node.type === 'traverse') {
      this.isMyself = Auth.currentProfile.user.userID === this.node.value.userID
    }
  },
  methods: {
    // async updateNode () {
    //   this.loading = true
    //   let edit = {
    //     _id: this.node._id,
    //     name: this.node.name,
    //     img: this.node.img
    //   }
    //   await Graph.updateMyNode({ edit })
    //   this.loading = false
    //   window.dispatchEvent(new Event('reload-graph'))
    // }
  }
}
</script>

<style>

</style>
