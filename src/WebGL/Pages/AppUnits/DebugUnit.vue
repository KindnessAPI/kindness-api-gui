<template>
  <div class="overlay">
    <div @click="$emit('close')" class="absolute top-0 right-0 pr-6 pt-6">
      <img src="./icon/close.svg" class="cursor-pointer" alt="Close" title="close">
    </div>
    <div class="content px-3 pt-3">
      <div class="text-3xl">User Profile</div>
      @{{ username }}
      <button @click="addFriend()">
        Add Friend
      </button>
      <div>
        Debug
      </div>
      <div class="">
        <button @click="addNode()">addNode</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as API from '../../../APIs/KA.js'
export default {
  props: {
    userID: {},
    username: {}
  },
  data () {
    return {
      API
    }
  },
  methods: {
    async addNode () {
      let username = API.Auth.currentProfile.user.username
      await API.Graph.addUserNode({ name: username })
      this.$emit('reload')
      this.$emit('close')
    },
    async removeNode () {
      let username = API.Auth.currentProfile.user.username
      await API.Graph.addUserNode({ name: username })
      this.$emit('reload')
      this.$emit('close')
    },
    async addFriend () {
      let myUserID = API.Auth.currentProfile.user.userID
      let otherUserID = this.userID

      console.log(myUserID, otherUserID)
      if (myUserID === otherUserID) {
        window.alert('same user!')
        return
      }

      await API.Graph.addFriendEdge({ fromID: myUserID, toID: otherUserID })
      this.$emit('reload')
      this.$emit('close')
    }
  }
}
</script>

<style>
</style>
