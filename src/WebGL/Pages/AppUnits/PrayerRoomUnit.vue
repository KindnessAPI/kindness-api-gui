<template>
  <div class=" item-unit">

    <div class="flex flex-col lg:flex-row h-full">

      <div class="lg:w-1/2 relative lg:order-2 ">
        <ScissorArea class="lg:absolute top-0 left-0 right-0 bottom-0 h-min100 lg:h-auto" style="z-index: -1;">
          <div slot="dom" class="full"></div>
          <SpaceWalkScene slot="o3d"></SpaceWalkScene>
        </ScissorArea>
      </div>
      <div class="lg:w-1/2 relative">
        <!--  -->

        <div class="p-6 md:p-12">
          <div class="text-bold text-2xl mb-3 cursor-pointer inline-block" @click="$router.go(-1)">
            ← Back
          </div>

          <div class="flex justify-around md:justify-start ">
            <div :class="{ 'border-b text-teal-500 ': tab === 'now' }" @click="tab = 'now'" class="px-3 mb-3 text-lg md:text-xl font-bold border-teal-500 mr-4">
              Write Letter
            </div>
            <div :class="{ 'border-b text-teal-500 ': tab === 'sent' }" @click="tab = 'sent'" class="px-3 mb-3 text-lg md:text-xl font-bold border-teal-500 mr-4">
              Sent
            </div>
            <div :class="{ 'border-b text-teal-500 ': tab === 'received' }" @click="tab = 'received'" class="px-3 mb-3 text-lg md:text-xl font-bold border-teal-500">
              Received
            </div>
          </div>

          <div v-if="socket">
            <div v-if="tab === 'now'">
              <PrayerComposerView :socket="socket" :prayFor="prayFor"></PrayerComposerView>
            </div>
            <div v-if="tab === 'received'">
              <PrayerReceivedView :prayerID="prayerID" :socket="socket" ></PrayerReceivedView>
            </div>
            <div v-if="tab === 'sent'">
              <PrayerSentView :socket="socket" ></PrayerSentView>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- -->

  </div>
</template>

<script>
import { Auth, LambdaClient, getWS, getID } from '../../../APIs/KA'
export default {
  props: {
    prayerID: {},
    prayFor: {}
    // Auth: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      socket: false,
      tab: 'now',
      Auth: Auth
    }
  },
  mounted () {
    if (this.prayerID) {
      this.tab = 'received'
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
