<template>
  <div class="overlay">
    <div v-if="editable" class="p-3 h-full w-full scrolling-touch overflow-y-auto overflow-x-hidden max-w-xl mx-auto">
      <div v-if="node.type === 'traverse'" :class="{ 'bg-blue-200': tab === 'traverse' }" @click="tab = 'traverse'" class="inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 rounded-lg ">Visit a Friend</div>
      <div v-if="node.type === 'content'" :class="{ 'bg-blue-200': tab === 'content' }" @click="tab = 'content'" class="inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 rounded-lg ">Memo</div>
      <div v-if="node.type === 'user'" :class="{ 'bg-blue-200': tab === 'user' }" @click="tab = 'user'" class="inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 rounded-lg ">Profile</div>
      <!-- General -->
      <div :class="{ 'bg-blue-200': tab === 'addon' }" @click="tab = 'addon'" class="inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 rounded-lg ">Add Friends, Memos & etc..</div>
      <div :class="{ 'bg-blue-200': tab === 'edit' }" @click="tab = 'edit'" class="inline-block px-3 py-2 border border-gray-500 mb-2 mr-2  rounded-lg ">Edit Preview...</div>

      <div v-if="tab === 'user'" :key="node._id" >
        <NEProfileEdit :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileEdit>
      </div>
      <div v-if="tab === 'traverse'" :key="node._id" >
        <NEProfileArea :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
        <NENodeTraverseAction :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeTraverseAction>
      </div>
      <div v-if="tab === 'content'" :key="node._id" >
        <NEContentEdit :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEContentEdit>
      </div>
      <div v-if="tab === 'addon'">
        <NEAddFriend :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEAddFriend>
        <NEAddContent :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEAddContent>
      </div>
      <div v-if="tab === 'edit'">
        <NENodeEdit :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeEdit>
        <NEManageGraph :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEManageGraph>
        <NERemoveNode :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NERemoveNode>
      </div>
      <!-- <ReButton :color="'green'">Add a Blog Post to this node.</ReButton> -->
    </div>
    <div v-else class="h-full w-full scrolling-touch overflow-y-auto overflow-x-hidden">
      <div v-if="node.type === 'traverse'" class="p-3 max-w-xl mx-auto">
        <NEProfileArea :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
        <NENodeTraverseAction :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeTraverseAction>
      </div>
      <div v-if="node.type === 'user'" class="p-3 max-w-xl mx-auto">
        <NEProfileArea :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
      </div>
      <div v-if="node.type === 'content'">
        <NEContentArea :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEContentArea>
        <!-- <NEProfileArea :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea> -->
      </div>
    </div>

    <div @click="$emit('close')" class="absolute top-0 right-0 pr-3 pt-3 z-20">
      <img src="../icon/close.svg" class="cursor-pointer p-2 bg-white rounded-full" alt="Close" title="close">
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
      tab: 'addon',
      // isMyself: this.node.userID === this.userID,
      API
    }
  },
  mounted () {
    if (this.node.type === 'user') {
      this.tab = 'user'
    }
    if (this.node.type === 'content') {
      this.tab = 'content'
    }
    if (this.node.type === 'traverse') {
      this.tab = 'traverse'
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
