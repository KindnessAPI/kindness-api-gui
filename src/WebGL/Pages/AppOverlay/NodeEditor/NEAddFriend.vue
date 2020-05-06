
<template>
  <div>
    <div class="mb-3 text-3xl">
      Add Friend
    </div>
    <div class="mb-3">
      <div class="text-xl">
      Search Username <span v-if="search.loading">⏱</span>
      </div>
      <div>
        <input type="text" placeholder="Username" v-model="search.query" @input="onTrySearch" class="rounded-none px-0 py-2 mb-3 border-b border-black inline-block">
      </div>
      <table>
        <tr :key="node._id" v-for="node in search.result">
          <td class="pr-3 pb-3">
            @{{ node.username }}
          </td>
          <td class="pr-3 pb-3">
            <img class="w-16 h-16 object-cover object-center" :src="`${node.img}`" alt="">
          </td>
          <td class="pr-3 pb-3">
            <ReButton :color="'green'" @click="addFriend(node)">Add Friend <span v-if="node.loading">⏱</span></ReButton>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { Graph } from '../../../../APIs/KA.js'
export default {
  props: {
    node: {}
  },
  components: {
    ...require('../../../webgl').default
  },
  data () {
    return {
      search: {
        loading: false,
        result: false,
        query: ''
      },
      selected: false
    }
  },
  methods: {
    async addFriend (friend) {
      try {
        friend.loading = true
        this.$forceUpdate()
        let newNode = await Graph.createFriendTraverseNode({ profileUsername: friend.username, name: friend.name, profileUserID: friend.userID, photo: friend.photo })
        await Graph.linkFriendTraverseNode({ fromID: this.node._id, toID: newNode._id })
        friend.loading = false
        this.$forceUpdate()
        window.dispatchEvent(new Event('reload-graph'))
      } catch (e) {
        console.log(e)
      }
    },
    async searchData () {
      this.search.loading = true
      this.search.result = await Graph.searchNodeByName({ name: this.search.query })
      this.search.loading = false
    },
    onTrySearch: _.debounce(function () {
      this.searchData()
    }, 250)
  }
}
</script>

<style>

</style>
