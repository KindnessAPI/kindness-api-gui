<template>
  <div class="overlay border border-yellow-600">
    <div class="p-3 bg-yellow-400 leading-6 rounded-t-lg text-center">Notifications</div>
    <div class="content-height w-full overflow-y-scroll overflow-x-hidden scrolling-touch relative">
      <table class="w-full">
        <tr class="cursor-pointer" @click="onClick(notif)" :class="{ 'bg-blue-100': !notif.read }" v-for="notif in notifications" :key="notif._id">
          <td class="p-3 w-20">
            <img :src="notif.toProfile.photoImg" class="select-none w-12 h-12 object-cover object-center rounded-full" alt="">
          </td>
          <td class="p-3 text-notif">
            <span>{{ notif.text }}</span>
            <div class="text-sm text-gray-500">{{ getMoment(notif.created_at) }}</div>
          </td>
          <td class="p-3">
            <div class="w-4 h-4 rounded-full bg-blue-400" v-if="!notif.read"></div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import * as API from '../../../APIs/KA.js'
import moment from 'moment'
export default {
  props: {
    me: {},
    graph: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      notifications: false,
      API
    }
  },
  computed: {
  },
  mounted () {
    this.getNotifications()
  },
  methods: {
    getMoment (date) {
      return moment(date).fromNow()
    },
    async getNotifications () {
      this.notifications = await API.Notification.getMyNotifications({ pageAt: 0, perPage: 50 })
    },
    async onClick (notif) {
      if (notif.type === 'prayer') {
        this.$router.push(`/prayer-room?prayerID=${notif.value.prayerID}`)
        await API.Notification.udpateNotificationStatus({ isRead: true, list: [notif._id] })
      }
    }
  }
}
</script>

<style lang="postcss">
.content-height{
  height: calc(100% - 3rem);
}
.text-notif{
  width: calc(100% - 65px);
}
</style>
