<template>
  <div class="h-full w-full">
    <div class="msg-header text-lg py-3 text-center bg-yellow-500 flex justify-between">
      <div class="w-1/3 text-left pl-4">
        <img src="./icon/left.svg" class="inline-block" @click="$emit('view', 'list-channel')" alt="">
      </div>
      <div class="w-1/3">Add Channel</div>
      <div class="w-1/3 text-right pr-4">
        <img class="inline-block" src="./icon/check.svg" v-if="selectedItems && selectedItems.length > 0" @click="$emit('add-chat')" alt="">
      </div>
    </div>
    <div class="msg-body-list remain-height bg-white  overflow-x-hidden overflow-y-auto">
      <div class="flex justify-center bg-gray-200">
        <input type="search" placeholder="Username or Display Name" v-model="query" class="py-3 px-4 shadow-none appearance-none border-yellow-700 border w-11/12 h-full my-3 rounded-full" @input="tryLoad()" />
      </div>
      <div class="border-t border-gray-500">
        <ContactListUnit ref="contact" :checkbox="true" v-if="items" :items="items" @item="onPersonSelect"></ContactListUnit>
      </div>
    </div>
  </div>
</template>

<script>
import { Profile, Channel, Auth } from '../../../APIs/KA'
import _ from 'lodash'
export default {
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      selectedItems: false,
      items: false,
      query: ''
    }
  },
  mounted () {
    this.$on('add-chat', async () => {
      // console.log(this.selectedItems)
      let participants = this.selectedItems.map(e => {
        return {
          username: e.username,
          userID: e.userID,
          isAdmin: false
        }
      })
      let andMore = ''
      if (participants.length >= 2) {
        andMore = ' and ...'
      }
      let newChannel = await Channel.createChannel({
        userID: Auth.currentProfile.user.userID,
        username: Auth.currentProfile.user.username,
        participants,
        img: this.selectedItems[0].image,
        title: '@' + participants[0].username + andMore
      })

      this.$emit('channel', newChannel)
      this.$emit('view', 'chat')
      this.$emit('reload-channels')
    })
  },
  methods: {
    onPersonSelect () {
      this.selectedItems = this.items.filter(e => e.selected)
    },
    async load () {
      let data = await Profile.getProfilesByQuery({ query: this.query || '_____' })
      this.items = data.map(e => {
        return {
          username: e.username,
          userID: e.userID,
          image: e.photoImg,
          title: e.displayName,
          subtitle: e.username,
          selected: false
        }
      }).filter(e => e.userID !== Auth.currentProfile.user.userID)
    },
    tryLoad: _.debounce(function () {
      this.load()
    }, 250)
  }
}
</script>

<style lang="postcss">

</style>
