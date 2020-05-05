<template>
  <div class="overlay">
    <div @click="$emit('close')" class="absolute top-0 right-0 pr-6 pt-6">
      <img src="./icon/close.svg" class="cursor-pointer" alt="Close" title="close">
    </div>
    <div class="content px-3 pt-3">
      <div class="text-3xl">Profile Page</div>
      <span>@{{ username }} </span><span v-if="isMyself">(me)</span>

      <button v-if="!(isMyself || hasFriendship)" @click="addFriend()">
        Add Friend
      </button>

      <button v-if="hasFriendship">Friend line Added</button>

      <div v-if="isMyself">
        <MyNodeEditUnit @reload="$emit('reload')"></MyNodeEditUnit>
        <MyEdgeEditUnit @reload="$emit('reload')"></MyEdgeEditUnit>
      </div>

    </div>
  </div>
</template>

<script>
import * as API from '../../../APIs/KA.js'

export default {
  props: {
    graph: {},
    userID: {},
    username: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    let myUserID = API.Auth.currentProfile.user.userID
    let otherUserID = this.userID
    let isMyself = myUserID === otherUserID
    let hasFriendship = this.graph.links.some(e => {
      return e.source.userID === myUserID && e.target.userID === otherUserID
    })
    return {
      hasFriendship,
      myUserID,
      isMyself,
      API
    }
  },
  mounted () {
  },
  methods: {
    async addFriend () {
      let myUserID = API.Auth.currentProfile.user.userID
      let otherUserID = this.userID

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
