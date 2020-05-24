<template>
  <div class="overlay">
    <!--  -->

    <div class="h-full  overflow-y-scroll scrolling-touch">
      <div class="bg-yellow-400 p-3 text-bold cursor-pointer block" @click="$emit('overlay', config.back)">
        ← Back
      </div>

      <div class="p-3">
        <!-- {{ config }} -->
        <PrayerSentView></PrayerSentView>
      </div>

    </div>

  </div>
</template>

<script>
import { Auth } from '../../../APIs/KA'
export default {
  props: {
    config: {}
  },
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      prayFor: false,
      prayerID: false,
      socket: false,
      // tab: 'now',
      Auth: Auth
    }
  },
  mounted () {
  },
  methods: {
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
