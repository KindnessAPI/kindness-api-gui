<template>
  <div class="overlay">
    <!--  -->

    <div class="h-full  overflow-y-scroll scrolling-touch">
      <div class="bg-yellow-400 p-3 text-bold cursor-pointer block" @click="$emit('overlay', overlayconfig.back)">
        ← Back
      </div>

      <div v-if="socket" class="p-3">
        <PrayerComposerView :locksender="true" :socket="socket" :prayFor="overlayconfig.prayFor"></PrayerComposerView>
      </div>

    </div>

  </div>
</template>

<script>
import { Auth, LambdaClient, getWS, getID } from '../../../APIs/KA'
export default {
  props: {
    overlayconfig: {}
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
    // if (this.overlayconfig.prayFor) {
    //   this.prayFor = this.overlayconfig.prayFor
    // }
    // if (this.overlayconfig.prayerID) {
    //   this.prayerID = this.overlayconfig.prayerID
    // }
    if (this.overlayconfig.tab) {
      this.tab = this.overlayconfig.tab
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
