
<template>
  <div>
    <div class="mb-3">
      <div class="text-lg">
        Follow a Friend <span v-if="search.loading">⏱</span>
      </div>
      <div>
        <input type="text" placeholder="Username" v-model="search.query" @input="onTrySearch" class="rounded-none bg-transparent px-0 py-2 mb-3 border-b border-black inline-block">
      </div>
      <table>
        <tr :key="profile._id" v-for="profile in search.result">
          <td class="pr-3 pb-3">
            <div>
              @{{ profile.username }}
            </div>
            <div class=" text-sm text-gray-600">
              <span v-if="profile.userID === myUserID">Myself</span>
              <span v-if="profile.userID !== myUserID">
                <span v-if="alreadyAdded(profile)">Already a Friend</span>
                <span v-if="!alreadyAdded(profile)">Can Add</span>
              </span>
            </div>
          </td>
          <td class="pr-3 pb-3">
            <img class="w-16 h-16 object-cover object-center rounded-full" :src="`${profile.photoImg}`" alt="">
          </td>
          <td class="pr-3 pb-3">
            <ReButton v-if="profile.userID !== myUserID && !alreadyAdded(profile)" :color="'green'" @click="addFriend(profile)">Add Friend <span v-if="profile.loading">⏱</span></ReButton>
            <ReButton :disabled="true" v-if="!(profile.userID !== myUserID && !alreadyAdded(profile))" :color="'gray'">Added</ReButton>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { Graph, Auth, Profile } from '../../../../APIs/KA.js'

function removeDuplicates (arr, prop) {
  let obj = {}
  return Object.keys(arr.reduce((prev, next) => {
    if (!obj[next[prop]]) {
      obj[next[prop]] = next
    }
    return obj
  }, obj)).map((i) => obj[i])
}

export default {
  props: {
    node: {},
    graph: {}
  },
  components: {
    ...require('../../../webgl').default
  },
  data () {
    return {
      removeDuplicates,
      search: {
        loading: false,
        result: false,
        query: ''
      },
      myUserID: Auth.currentProfile.user.userID,
      selected: false
    }
  },
  methods: {
    alreadyAdded (compareNode) {
      return this.graph.nodes.filter(n => n.value && n.value.userID).some(n => n.value.userID === compareNode.userID)
    },
    async addFriend (friend) {
      try {
        friend.loading = true
        this.$forceUpdate()
        let newNode = await Graph.createFriendTraverseNode({ profileUsername: friend.username, name: friend.name, profileUserID: friend.userID, photo: friend.photo })
        let toPerson = {
          userID: friend.userID,
          username: friend.username
        }
        let fromPerson = {
          userID: Auth.currentProfile.userID,
          username: Auth.currentProfile.username
        }

        await Graph.linkFriendTraverseNode({ fromID: this.node._id, toID: newNode._id, fromPerson, toPerson })
        friend.loading = false
        this.$forceUpdate()
        window.dispatchEvent(new Event('reload-graph'))
        this.$emit('close')
      } catch (e) {
        console.log(e)
      }
    },
    async searchData () {
      this.search.loading = true
      this.search.result = await Profile.searchProfileByDisplayName({ displayName: this.search.query || '_____' })
      this.search.result = removeDuplicates(this.search.result, 'userID')
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
