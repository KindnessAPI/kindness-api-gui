<template>
  <div class="overlay">
    <div @click="$emit('close')" class="absolute top-0 right-0 pr-6 pt-6">
      <img src="../icon/close.svg" class="cursor-pointer" alt="Close" title="close">
    </div>
    <div class="p-4 h-full w-full overflow-y-auto overflow-x-hidden">

      <div :class="{ 'bg-blue-200': tab === 'action' }" @click="tab = 'action'" class="inline-block px-3 py-2 border mb-2 mr-2">Node Action</div>
      <div :class="{ 'bg-blue-200': tab === 'edit' }" @click="tab = 'edit'" class="inline-block px-3 py-2 border mb-2 mr-2">Edit Node</div>

      <div v-if="tab === 'action'">
        <NENodeTraverseAction :node="currentNode" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeTraverseAction>
        <NEAddFriend :node="currentNode" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEAddFriend>
      </div>
      <div v-if="tab === 'edit'">
        <NENodeEdit :node="currentNode" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeEdit>
        <NEManageGraph :node="currentNode" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEManageGraph>
        <NERemoveNode :node="currentNode" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NERemoveNode>
      </div>

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
      tab: 'action',
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
