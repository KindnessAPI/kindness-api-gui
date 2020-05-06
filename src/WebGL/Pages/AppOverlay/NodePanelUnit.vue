<template>
  <div class="overlay">
    <div @click="$emit('close')" class="absolute top-0 right-0 pr-6 pt-6">
      <img src="../icon/close.svg" class="cursor-pointer" alt="Close" title="close">
    </div>
    <div v-if="editable" class="p-4 h-full w-full overflow-y-auto overflow-x-hidden">
      <div class="mb-3 text-3xl">
        <span v-if="node.type === 'user'">Your Headquarter: </span>
        <span v-if="node.type === 'traverse'">Space Travel to: </span>
        {{ node.name }}
      </div>

      <div :class="{ 'bg-blue-200': tab === 'action' }" @click="tab = 'action'" class="inline-block px-3 py-2 border mb-2 mr-2">Node Action</div>
      <div :class="{ 'bg-blue-200': tab === 'edit' }" @click="tab = 'edit'" class="inline-block px-3 py-2 border mb-2 mr-2">Edit Node</div>

      <div v-if="tab === 'action'">
        <NENodeTraverseAction :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeTraverseAction>
        <NEAddFriend :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEAddFriend>
      </div>
      <div v-if="tab === 'edit'">
        <NENodeEdit :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeEdit>
        <NEManageGraph :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEManageGraph>
        <NERemoveNode :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NERemoveNode>
      </div>
      <!-- <ReButton :color="'green'">Add a Blog Post to this node.</ReButton> -->
    </div>
    <div v-else class="p-4 h-full w-full overflow-y-auto overflow-x-hidden">
      <div v-if="node.type === 'user'">
        <NEProfileArea :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from '../../../APIs/KA.js'

export default {
  props: {
    editable: {},
    graph: {},
    node: {},
    userID: {},
    username: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      tab: 'action',
      // isMyself: this.node.userID === this.userID,
      API
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
