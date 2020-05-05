<template>
  <div class="overlay">
    <div @click="$emit('close')" class="absolute top-0 right-0 pr-6 pt-6">
      <img src="../icon/close.svg" class="cursor-pointer" alt="Close" title="close">
    </div>
    <div>
      Write Post
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
    return {
      API
    }
  },
  mounted () {
  },
  methods: {
    async addFriend ({ otherUserID }) {
      let myUserID = API.Auth.currentProfile.user.userID

      if (myUserID === otherUserID) {
        window.alert('same user!')
        return
      }

      await API.Graph.addFriendEdge({ fromID: myUserID, toID: otherUserID })
      window.dispatchEvent(new Event('reload-graph'))
      this.$emit('close')
    }
  }
}
</script>

<style>
</style>
