<template>
  <div>
    <table>
      <tr v-if="prayers && prayers.length > 0">
        <th class="p-2">
          Receiver
        </th>
        <th class="p-2">
          Prayer
        </th>
      </tr>
      <tr v-for="prayer in prayers" :key="prayer._id">
        <td class="p-2 text-sm text-gray-500 text-right">
          <div>
            @{{ prayer.toProfile.username }}
          </div>
          <div>
            {{ getMoment(prayer.created_at) }}
          </div>
        </td>
        <td class="p-2">
          {{ prayer.text }}
        </td>
      </tr>
    </table>
    <div>
      <button class="inline-block p-3 px-4 mx-1 border rounded-full" @click="back()">Back</button>
      <div class="inline-block p-3 px-2 mx-1">{{ pageAt + 1 }}</div>
      <button class="inline-block p-3 px-4 mx-1 border rounded-full" @click="next()">Next</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Prayer } from '../../../APIs/KA'
export default {
  data () {
    return {
      pageAt: 0,
      prayers: false
    }
  },
  async mounted () {
    this.getPrayers()
  },
  methods: {
    next () {
      this.pageAt++
      this.getPrayers()
    },
    back () {
      this.pageAt--
      if (this.pageAt < 0) {
        this.pageAt = 0
      }
      this.getPrayers()
    },
    async getPrayers () {
      this.prayers = await Prayer.getMySentPrayer({ pageAt: this.pageAt })
    },
    getMoment (date) {
      return moment(date).calendar()
    }
  }
}
</script>

<style>

</style>
