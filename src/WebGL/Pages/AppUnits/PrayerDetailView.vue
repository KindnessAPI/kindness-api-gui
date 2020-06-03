<template>
  <div v-if="prayer" class="p-3">
    <div class="">
      <span>
        From: @{{ prayer.username }}
      </span>
      <span class="text-xs text-blue-500 cursor-pointer" @click="prayBack">
        Write Back
      </span>
    </div>
    <div class="w-full" ref="text-area">
      To: @{{ prayer.toProfile.username }}
    </div>
    <div class="text-sm text-gray-600 mb-3">{{ getMoment(prayer.created_at) }}</div>
    <div>
      <button @click="mode = 'poster'" class="px-3 focus:outline-none mr-2 mb-2 rounded-full bg-yellow-300 py-2 text-sm">Fancy Display</button>
      <button @click="mode = 'text'" class="px-3 focus:outline-none mr-2 mb-2 rounded-full bg-yellow-300 py-2 text-sm">Plain Text</button>
    </div>
    <div v-if="mode === 'text'" class="whitespace-pre">{{ prayer.text }}</div>
    <ScissorArea v-if="mode === 'poster'" :style="{ width: `100%`, height: size.width.toFixed(0) + 'px', minHeight: '300px' }">
      <div slot="dom" class="full">
      </div>
      <PrayerScene slot="o3d" :text="prayer.text">
      </PrayerScene>
    </ScissorArea>
  </div>
  <div class="p-3 text-center" v-else-if="!prayer">Loading....</div>
</template>

<script>
import moment from 'moment'
import { Prayer } from '../../../APIs/KA'
import { Tree } from '../../Reusable/index'

export default {
  mixins: [Tree],
  components: {
    ...require('../../webgl').default
  },
  props: {
    config: {},
    prayerID: {}
  },
  data () {
    return {
      mode: 'poster',
      size: {
        width: 300,
        height: 300
      },
      prayer: false,
      prayers: false
    }
  },
  async mounted () {
    this.getPrayers()
    this.getSize()
    window.addEventListener('resize', () => {
      this.getSize()
    }, false)
  },
  methods: {
    getSize () {
      let box = this.$refs['text-area']
      if (box) {
        let rect = box.getBoundingClientRect()
        if (rect) {
          let { width, height } = rect
          this.size = {
            width,
            height
          }
        }
      }
    },
    prayBack () {
      // console.log(this.prayer.userID)
      this.$emit('config', {
        prayFor: this.prayer.fromProfile.userID,
        back: 'notify'
      })
      this.$emit('overlay', 'pray-now')
    },
    async getPrayers () {
      this.prayers = await Prayer.getMyReceivedPrayer({ prayerID: this.prayerID })
      if (this.prayers[0]) {
        this.prayer = this.prayers[0]
        this.getSize()
        this.$nextTick(() => {
          this.getSize()
        })
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
