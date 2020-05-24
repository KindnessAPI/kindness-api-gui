<template>
  <div class="overlay border border-yellow-600">
    <div class="p-3 bg-yellow-400 leading-6 rounded-t-lg text-center">Notifications</div>
    <div class="content-height w-full overflow-y-scroll overflow-x-hidden scrolling-touch relative">
      <div class="p-3 text-center" v-if="!notifications">Loading....</div>
      <div class="p-3 text-center" v-if="notifications && notifications.length === 0 && overlayconfig.fromUserID">No Notification from this person.</div>
      <div class="p-3 text-center" v-if="notifications && notifications.length === 0 && !overlayconfig.fromUserID">No Notification</div>
      <table class="w-full" v-if="notifications">
        <tr class="cursor-pointer hover:bg-blue-200" @click="onClick(notif)" :class="{ 'bg-blue-100': !notif.read }" v-for="notif in notifications" :key="notif._id">
          <td class="p-3 w-20 cursor-pointer">
            <img :src="notif.fromProfile.photoImg" class="select-none w-12 h-12 object-cover object-center rounded-full" alt="">
          </td>
          <td class="p-3 text-notif cursor-pointer">
            <span>{{ notif.text }}</span>
            <div class="text-sm text-gray-500">{{ getMoment(notif.created_at) }}</div>
          </td>
          <td class="p-3 cursor-pointer">
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
    overlayconfig: {
      default () {
        return {}
      }
    },
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
      let fromUserID
      if (this.overlayconfig.fromUserID) {
        fromUserID = this.overlayconfig.fromUserID
      }
      this.notifications = await API.Notification.getMyNotifications({ pageAt: 0, perPage: 50, fromUserID })
    },
    async onClick (notif) {
      if (notif.type === 'prayer') {
        // this.$emit('prayerID', notif.value.prayerID)
        // this.$router.push(`/prayer-room?prayerID=${notif.value.prayerID}`)
        API.Notification.udpateNotificationStatus({ isRead: true, list: [notif._id] })
          .then(() => {
            // this.$emit('overlayconfig', {
            //   tab: 'received',
            //   prayerID: notif.value.prayerID
            // })
            this.$emit('notify')

            this.$emit('overlayconfig', {
              prayerID: notif.value.prayerID,
              back: 'notify'
            })
            this.$emit('overlay', 'prayer-detail')
          })
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
