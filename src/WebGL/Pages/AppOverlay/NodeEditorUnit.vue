<template>
  <div class="overlay">
    <div @click="$emit('close')" class="absolute top-0 right-0 pr-6 pt-6">
      <img src="../icon/close.svg" class="cursor-pointer" alt="Close" title="close">
    </div>
    <div class="p-4 h-full w-full overflow-y-auto overflow-x-hidden">
      <NEAddFriend :node="currentNode" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEAddFriend>
      <NERemoveNode :node="currentNode" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NERemoveNode>
      <NEManageGraph :node="currentNode" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEManageGraph>

      <!-- <ReButton :color="'green'">Add a Blog Post to this node.</ReButton> -->
    </div>
  </div>
</template>

<script>
import * as API from '../../../APIs/KA.js'

export default {
  props: {
    graph: {},
    currentNode: {},
    userID: {},
    username: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      // isMyself: this.currentNode.userID === this.userID,
      API
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
</style>
