<template>
  <div class="h-full w-full">
    <div class="msg-header text-lg py-3 text-center bg-yellow-500 flex justify-between">
      <div class="w-1/6 text-left pl-4"></div>
      <div class="w-4/6">
        <span v-if="!loading">Chats</span>
        <span v-if="loading">Loading ⏱</span>
      </div>
      <div class="w-1/6 text-right pr-4">
        <img v-if="!loading" class="inline-block" src="./icon/add.svg" @click="$emit('view', 'add-channel')" alt="">
      </div>
    </div>
    <div v-if="items" class="msg-body-list remain-height overflow-x-hidden overflow-y-auto">
      <RoomListUnit :checkbox="false" :items="items" @item="item = $event; onItem($event)" :mode="'full'"></RoomListUnit>
    </div>
  </div>
</template>

<script>
import { Channel, Auth } from '../../../APIs/KA'
import moment from 'moment'
export default {
  props: {
    mode: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      loading: false,
      channels: false,
      item: false
    }
  },
  mounted () {
    this.getChannels()
    this.$on('reload', () => {
      this.getChannels()
    })
    this.$on('channel-change', (event) => {
      // console.log(event)
      if (!this.channels) {
        return
      }
      let idx = this.channels.findIndex(e => e._id === event._id)
      this.channels[idx] = JSON.parse(JSON.stringify(event))

      this.$forceUpdate()
    })
    this.$root.$on('channel-update', (event) => {
      let updatedChannel = event
      if (!this.channels) {
        this.getChannels()
        return
      }
      let idx = this.channels.findIndex(e => e._id === updatedChannel._id)
      if (idx !== -1) {
        this.channels[idx] = JSON.parse(JSON.stringify(updatedChannel))
      } else {
        this.getChannels()
      }
      this.channels = [
        ...this.channels
      ]

      this.$forceUpdate()
    })
  },
  // env.isActiveRender
  computed: {
    items () {
      if (this.channels) {
        return this.channels.map(e => {
          return {
            _id: e._id,
            title: e.title,
            ts: (new Date(e.lastMessageDate)).getTime(),
            subtitle: e.lastMessageSent,
            subtitle2: moment(Date.parse(e.lastMessageDate)).fromNow(),
            image: e.img
          }
        }).sort((a, b) => {
          if (a.ts > b.ts) {
            return -1
          } else if (a.ts < b.ts) {
            return 1
          } else {
            return 0
          }
        })
      } else {
        return false
      }
    }
  },
  methods: {
    onItem (item) {
      this.$emit('channel', this.channels.find(e => e._id === item._id))
      this.$emit('view', 'chat')
    },
    async getChannels () {
      this.loading = true
      let data = await Channel.getMyChannels({ userID: Auth.currentProfile.user.userID })
      this.channels = data
      this.loading = false
    }
  }
}
</script>

<style>

</style>
