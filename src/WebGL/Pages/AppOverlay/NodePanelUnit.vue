<template>
  <div class="overlay">
    <div v-if="editable" class="p-3 h-full w-full scrolling-touch relative max-w-lg mx-auto">

      <div class="flex flex-wrap justify-center mb-1">
        <div :class="{ 'bg-blue-200': tab === 'profile' }" @click="tab = 'profile'" class="shadow-sm inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 bg-white rounded-lg ">Profile</div>
        <div v-if="isMe" :class="{ 'bg-blue-200': tab === 'settings' }" @click="tab = 'settings'" class="shadow-sm inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 bg-white rounded-lg ">Settings</div>
        <!-- General -->
        <div :class="{ 'bg-blue-200': tab === 'addon' }" @click="tab = 'addon'" class="shadow-sm inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 bg-white rounded-lg ">Friends</div>
        <div :class="{ 'bg-blue-200': tab === 'edit' }" @click="tab = 'edit'" class="shadow-sm inline-block px-3 py-2 border border-gray-500 mb-2 mr-2  bg-white rounded-lg ">Relationships</div>
      </div>

      <div v-if="tab === 'profile'" :key="node._id" >
        <NEProfileArea :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
        <NENodeTraverseAction :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeTraverseAction>
      </div>
      <div v-if="tab === 'settings'" :key="node._id" >
        <NEProfileEdit :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileEdit>
      </div>
      <div v-if="tab === 'addon'">
        <NEAddFriend :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEAddFriend>
      </div>
      <div v-if="tab === 'edit'">
        <!-- <NENodeEdit v-if="!(node.type === 'user' || node.type === 'traverse')" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeEdit> -->
        <NEManageGraph :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEManageGraph>
        <NERemoveNode :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NERemoveNode>
      </div>
    </div>
    <div v-else class="h-full w-full scrolling-touch">
      <div class="p-3">
        <NEProfileArea :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
        <NENodeTraverseAction :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeTraverseAction>
      </div>
      <!-- <div v-if="node.type === 'traverse'" class="p-3">
      </div>
      <div v-if="node.type === 'user'" class="p-3">
        <NEProfileArea :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
      </div> -->
    </div>

    <!-- <div @click="$emit('close')" class="absolute top-0 right-0 pr-3 pt-3 z-20">
      <img src="../icon/close.svg" class="cursor-pointer p-2 bg-white rounded-full" alt="Close" title="close">
    </div> -->
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
      tab: 'profile',
      API
    }
  },
  computed: {
    isMe () {
      return this.node.type === 'user' && this.node.value && this.node.value.userID === API.Auth.currentProfile.user.userID
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
