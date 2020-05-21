
<template>
  <div class="inline-block" v-if="node && node.type === 'traverse' && !isMyself">
      <!-- <ReButton
        :color="'teal'"
        :disabled="isMyself"
        :class="{ 'opacity-50': isMyself }"
        @click="onGo"
      >
        <span>Visit Star Map ✨ </span>
        <span>@{{ node.value.username }}</span>
      </ReButton> -->
    <NEIcon :color="'yellow'" @click="onGo" :img="require('../img/star-yellow.svg')" label="Visit StarMap"></NEIcon>
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
    onGo () {
      if (this.isMyself) {
        return
      }
      this.$router.push(`/profile/${this.node.value.username}/${this.node.value.userID}`)
      this.$emit('close')
    }
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
