
<template>
  <div v-if="node && node.type === 'traverse'">
    <div class="mb-3 text-3xl">
      Traverse the Galaxy
    </div>
    <div class="mb-3">
      <ReButton
        :color="'green'"
        :disabled="isMyself"
        @click="$router.push(`/profile/${node.value.username}/${node.value.userID}`); $emit('close')"
      >
        Let's visit @{{ node.value.username }}!
      </ReButton>
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
      Auth,
      show: [
        this.node.type === 'traverse'
      ].some(e => e),
      isMyself: false,
      Graph
    }
  },
  mounted () {
    if (this.node.type === 'traverse') {
      this.isMyself = this.$route.params.userID === this.node.value.userID
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
