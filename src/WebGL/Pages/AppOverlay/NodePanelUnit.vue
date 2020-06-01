<template>
  <div class="overlay border-yellow-400 border" style="background-color: rgba(255,255,255,0.95)">
    <!-- <ScissorArea class=" h-full w-full" v-if="ready"> -->
      <!-- <div slot="dom" class="h-full overflow-y-scroll overflow-x-hidden scrolling-touch "> -->

        <div v-if="editable" class="h-full w-full">
          <div class="flex flex-wrap justify-start px-3 pt-3 bg-yellow-400">
            <div :class="{ 'border-yellow-700 bg-yellow-200 text-yellow-800': tab === 'profile' }" @click="tab = 'profile'" class="shadow-sm inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 bg-white rounded-lg ">Profile</div>
            <!-- <div v-if="tab === 'settings'" :class="{ 'border-yellow-700 bg-yellow-200 text-yellow-800': tab === 'settings' }" @click="tab = 'profile'" class="shadow-sm inline-block px-3 py-2 border border-gray-500 mb-2 mr-2 bg-white rounded-lg ">Settings</div> -->
            <div :class="{ 'border-yellow-700 bg-yellow-200 text-yellow-800': tab === 'friendship' }" @click="tab = 'friendship'" class="shadow-sm inline-block px-3 py-2 border border-gray-500 mb-2 mr-2  bg-white rounded-lg ">Friendship</div>
          </div>
          <div class="p-3 content-height  relative overflow-y-scroll overflow-x-hidden scrolling-touch">
            <div v-if="tab === 'profile'" :key="node._id" >
              <NEProfileArea :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
              <!-- <div class=" text-center">
                <ReButton v-if="isMe" :color="'blue'" @click="tab = 'settings'">Edit My Profile</ReButton>
              </div> -->
              <div class="mt-3 flex justify-start items-center flex-wrap">
                <NEIcon v-if="isMe" :color="'teal'" :img="require('./img/profile-teal.svg')" @click="tab = 'settings'" label="Edit My Profile"></NEIcon>
                <NENodeTraverseAction :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeTraverseAction>
                <NEPrayerRoom @config="$emit('config', $event)" @notify="$emit('notify', $event)" @prayerID="$emit('prayerID', $event)" @prayFor="$emit('prayFor', $event)" @overlay="$emit('overlay', $event)" :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEPrayerRoom>
                <NENotificationButton @config="$emit('config', $event)" @notify="$emit('notify', $event)" @prayerID="$emit('prayerID', $event)" @overlay="$emit('overlay', $event)" :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENotificationButton>
                <NEPrayerOutBoxButton v-if="isMe" @config="$emit('config', $event)" @notify="$emit('notify', $event)" @prayerID="$emit('prayerID', $event)" @overlay="$emit('overlay', $event)" :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEPrayerOutBoxButton>
                <NEMiniSiteButton @config="$emit('config', $event)" @notify="$emit('notify', $event)" @prayerID="$emit('prayerID', $event)" @overlay="$emit('overlay', $event)" :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEMiniSiteButton>
                <NESiteDashboardButton v-if="isMe" @config="$emit('config', $event)" @notify="$emit('notify', $event)" @prayerID="$emit('prayerID', $event)" @overlay="$emit('overlay', $event)" :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NESiteDashboardButton>
              </div>
            </div>
            <div v-if="tab === 'settings'" :key="node._id" >
              <NEProfileEdit :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileEdit>
            </div>
            <div v-if="tab === 'friendship'">
              <!-- <NENodeEdit v-if="!(node.type === 'user' || node.type === 'traverse')" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeEdit> -->
              <NEAddFriend :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEAddFriend>
              <NEManageGraph :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEManageGraph>
              <NERemoveNode :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NERemoveNode>
            </div>
          </div>
        </div>
        <div v-else class="h-full w-full relative">
          <div class="p-3">
            <NEProfileArea :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEProfileArea>
            <div class="mt-3 flex justify-start items-center flex-wrap">
              <NENodeTraverseAction :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENodeTraverseAction>
              <NEPrayerRoom @config="$emit('config', $event)" @notify="$emit('notify', $event)" @prayerID="$emit('prayerID', $event)" @prayFor="$emit('prayFor', $event)" @overlay="$emit('overlay', $event)" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEPrayerRoom>
              <NENotificationButton @config="$emit('config', $event)" @notify="$emit('notify', $event)" @prayerID="$emit('prayerID', $event)" @overlay="$emit('overlay', $event)" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NENotificationButton>
              <NEMiniSiteButton @config="$emit('config', $event)" @notify="$emit('notify', $event)" @prayerID="$emit('prayerID', $event)" @overlay="$emit('overlay', $event)" :isMe="isMe" :node="node" :graph="graph" @close="$emit('close')" @reload="$emit('reload')"></NEMiniSiteButton>
            </div>
          </div>
        </div>

      <!-- DOM -->
      <!-- </div>
      <StarFlowScene slot="o3d"></StarFlowScene>
    </ScissorArea> -->

    <!--  -->

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
      ready: false,
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
    setTimeout(() => {
      this.ready = true
    }, 100)
  },
  methods: {
  }
}
</script>

<style>
.content-height{
  height: calc(100% - 62px);
}
</style>
