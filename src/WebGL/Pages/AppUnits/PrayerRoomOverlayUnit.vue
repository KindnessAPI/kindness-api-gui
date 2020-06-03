<template>
  <div class="overlay">
    <!--  -->

    <div class="h-full  overflow-y-scroll scrolling-touch">
      <div class="bg-yellow-400 p-3 text-bold cursor-pointer block" @click="$emit('overlay', 'notify')">
        ← Back
      </div>

      <div class="flex justify-around md:justify-start bg-yellow-300 py-3">
        <div :class="{ 'underline ': tab === 'now' }" @click="tab = 'now'" class="px-3 text-lg mr-4">
          Write Letter
        </div>
        <div :class="{ 'underline ': tab === 'sent' }" @click="tab = 'sent'" class="px-3 text-lg mr-4">
          Sent
        </div>
        <div :class="{ 'underline ': tab === 'received' }" @click="tab = 'received'" class="px-3 text-lg">
          Received
        </div>
      </div>

      <div v-if="socket" class="p-3">
        <div v-if="tab === 'now'">
          <PrayerComposerView :socket="socket" :prayFor="config.prayFor"></PrayerComposerView>
        </div>
        <div v-if="tab === 'received'">
          <PrayerReceivedView :prayerID="config.prayerID" :socket="socket" ></PrayerReceivedView>
        </div>
        <div v-if="tab === 'sent'">
          <PrayerSentView :socket="socket" ></PrayerSentView>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { Auth, LambdaClient, getWS, getID } from '../../../APIs/KA'
export default {
  props: {
    config: {}
    // prayerID: {},
    // prayFor: {}
    // Auth: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      prayFor: false,
      prayerID: false,
      socket: false,
      tab: 'now',
      Auth: Auth
    }
  },
  mounted () {
    // if (this.prayerID) {
    //   this.tab = 'received'
    // }
    // if (this.config.prayFor) {
    //   this.prayFor = this.config.prayFor
    // }
    // if (this.config.prayerID) {
    //   this.prayerID = this.config.prayerID
    // }
    if (this.config.tab) {
      this.tab = this.config.tab
    }
    this.makeSocket()
  },
  methods: {
    makeSocket () {
      let myBell = new LambdaClient({
        url: getWS(),
        token: Auth.currentProfile.jwt,
        roomID: Auth.currentProfile.user.userID,
        nickname: Auth.currentProfile.user.username + '@' + getID()
      })

      myBell.on('channel-update', (event) => {
        this.$root.$emit('channel-update', event.data)
      })

      myBell.on('prayer-update', (event) => {
        this.$root.$emit('prayer-update', event.data)
        console.log('prayerupdate', event)
      })

      this.$on('onReset', () => {
        myBell.close()
      })

      this.socket = myBell
    }
  }
}
</script>

<style scoped>

</style>

<style scoped>
.item-unit{
  height: calc(100% - 60px);
}
</style>
