<template>
  <div>
    <textarea placeholder="Pray for..." :disabled="locksender" class="w-full rounded-none resize-none border-black border-l hover:border-green-500 p-3 text-xl bg-transparent focus:outline-none" cols="50" rows="1" @input="onSearch" v-model="prayer.query"></textarea>
    <table v-show="profiles">
      <tr v-for="profile in profiles" :key="profile._id" @click="chooseProfile(profile)">
        <td class="pb-4 cursor-pointer">
          <img class="w-16 h-16 object-cover rounded-full object-center" :src="profile.photoImg" alt="">
        </td>
        <td class="pb-4 pl-3 cursor-pointer">
          <div class="text-lg">{{ profile.displayName }}</div>
          <div class="text-sm text-gray-500">@{{ profile.username }}</div>
        </td>
      </tr>
    </table>
    <textarea placeholder="Type your prayer here..." class="w-full rounded-none resize-none border-black border-l hover:border-green-500 p-3 text-xl bg-transparent focus:outline-none" cols="50" rows="10" @input="onSaveTemp" v-model="prayer.text"></textarea>
    <div class="border-l rounded-none border-black hover:border-green-500 p-3">
      <button @click="sendPrayer" class="p-3 text-xl bg-gray-400 rounded-full bg-transparent focus:outline-none cursor-pointer hover:bg-gray-300">
        <span v-if="state === 'ready'">Send Prayer</span>
        <span v-if="state === 'ok'">Prayer Sent Successfully</span>
      </button>
    </div>
  </div>
</template>

<script>
import { Profile, Auth } from '../../../APIs/KA'
export default {
  props: {
    locksender: {},
    socket: {},
    prayFor: {
      default: ''
    }
  },
  data () {
    return {
      state: 'ready',
      profiles: false,
      NS: 'prayer-now' + this.prayFor,
      prayer: this.templatePrayer()
    }
  },
  async mounted () {
    let getLastPrayer = () => {
      let returnResult = false
      let needsToResetStorage = false
      let str = sessionStorage.getItem(this.NS) || false
      if (!str) {
        needsToResetStorage = true
      }
      try {
        returnResult = JSON.parse(str)
      } catch (e) {
        needsToResetStorage = true
      }

      if (needsToResetStorage) {
        sessionStorage.removeItem(this.NS)
        return false
      } else {
        return returnResult
      }
    }
    let restored = getLastPrayer()
    if (restored) {
      this.prayer = restored
    }

    if (this.prayFor) {
      this.prayer.toProfile = await Profile.getProfileByUserID({ userID: this.prayFor })
      this.prayer.toUserID = this.prayer.toProfile.userID
      this.prayer.query = this.prayer.toProfile.displayName
    }
  },
  methods: {
    templatePrayer () {
      return {
        query: '',
        text: '',
        toProfile: false,
        toUserID: this.prayFor
      }
    },
    async sendPrayer () {
      if (!this.prayer.text) {
        return
      }
      if (!this.prayer.toUserID) {
        return
      }
      this.socket.$emit('ws-prayer-msg', {
        prayer: {
          userID: Auth.currentProfile.user.userID,
          username: Auth.currentProfile.user.username,
          type: 'personal',
          toProfile: this.prayer.toProfile,
          toUserID: this.prayer.toUserID,
          text: this.prayer.text,
          value: {},
          tags: [{ text: 'prayer' }]
        }
      })
      this.state = 'ok'
      this.prayer.text = ''
      // sessionStorage.removeItem(this.NS)
      if (this.prayFor) {
        this.prayer.toProfile = await Profile.getProfileByUserID({ userID: this.prayFor })
        this.prayer.query = this.prayer.toProfile.displayName
        this.prayer.toUserID = this.prayer.toProfile.userID
      }
      this.onSaveTemp()
      setTimeout(() => {
        this.state = 'ready'
      }, 2500)
    },
    async chooseProfile (profile) {
      this.prayer.toUserID = profile.userID
      this.prayer.toProfile = profile
      this.prayer.query = this.prayer.toProfile.displayName
      this.profiles = false
    },
    async onSearch () {
      this.onSaveTemp()
      this.profiles = await Profile.getProfilesByQuery({ query: this.prayer.query || '_____' })
    },
    onSaveTemp () {
      sessionStorage.setItem(this.NS, JSON.stringify(this.prayer))
    }
  }
}
</script>

<style>

</style>
