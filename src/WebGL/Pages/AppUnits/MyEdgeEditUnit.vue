<template>
  <div v-if="myEdges && myFriends">
    <!-- <pre>{{ myFriends }}</pre> -->
    <div>
      <div class="mb-3 text-3xl">Friends</div>
      <!-- <div>{{ myFriends }}</div> -->
      <div>
        <div :key="edge._id" v-for="edge in myEdges">
          <div class="inline-block mr-3">
            {{ getUsernameByID(edge.target) }}
          </div>
          <div class="inline-block cursor-pointer" @click="removeEdge({ edge })">Remove Friends Line</div>
        </div>
      </div>
    </div>

    <div>
      <!-- <div class="mb-3">Submit</div> -->
      <!-- <button class="px-3 py-2 border border-black" @click="updateMyNode()">
        <div v-if="loading">Loading...</div>
        <div v-if="!loading">Update</div>
      </button> -->
    </div>
  </div>
  <div v-else-if="loading">
    Loading My Friends...
  </div>
</template>

<script>
import * as API from '../../../APIs/KA.js'

export default {
  props: {
  },
  data () {
    return {
      myFriends: false,
      friendsIDList: false,
      loading: false,
      myEdges: false
    }
  },
  mounted () {
    this.getMyEdges()
  },
  methods: {
    getFriendInfoByID (id) {
      if (!this.myFriends) {
        return false
      }
      return this.myFriends.find(f => f._id === id)
    },
    getUsernameByID (id) {
      let fd = this.getFriendInfoByID(id)
      if (fd) {
        return fd.username
      } else {
        return ''
      }
    },
    async removeEdge ({ edge }) {
      if (!window.confirm('delete?')) {
        return
      }
      await API.Graph.removeMyEdge({ edge })
      this.$emit('reload')
      this.getMyEdges()
    },
    async getMyEdges () {
      this.loading = true
      this.myEdges = await API.Graph.getMyEdges()
      this.friendsIDList = this.myEdges.map(e => e.target)
      this.myFriends = await API.Graph.getUserByIDList({ idList: this.friendsIDList })
      console.log(this.myFriends)
      this.loading = false
    }
  }
}
</script>

<style>

</style>
