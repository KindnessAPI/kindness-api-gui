<template>
  <div v-if="prayer" class="p-3">
    <div class="">
      <span>
        From: @{{ prayer.username }}
      </span>
      <span class="text-xs text-blue-500 cursor-pointer" @click="prayBack">
        Pray Back
      </span>
    </div>
    <div class="">
      To: @{{ prayer.toProfile.username }}
    </div>
    <div class="text-sm text-gray-600 mb-3">{{ getMoment(prayer.created_at) }}</div>
    <div class="whitespace-pre">{{ prayer.text }}</div>
    <!-- <pre>{{ prayer }}</pre> -->
  </div>
  <div class="p-3 text-center" v-else-if="!prayer">Loading....</div>
</template>

<script>
import moment from 'moment'
import { Prayer } from '../../../APIs/KA'
export default {
  props: {
    config: {},
    prayerID: {}
  },
  data () {
    return {
      prayer: false,
      prayers: false
    }
  },
  async mounted () {
    this.getPrayers()
  },
  methods: {
    prayBack () {
      // console.log(this.prayer.userID)
      this.$emit('config', {
        prayFor: this.prayer.fromProfile.userID,
        back: 'prayer-detail',
        backData: {
          prayerID: this.prayerID
        }
      })
      this.$emit('overlay', 'pray-now')
    },
    async getPrayers () {
      this.prayers = await Prayer.getMyReceivedPrayer({ prayerID: this.prayerID })
      if (this.prayers[0]) {
        this.prayer = this.prayers[0]
      }
    },
    getMoment (date) {
      return moment(date).calendar()
    }
  }
}
</script>

<style>

</style>
