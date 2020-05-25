<template>
  <div class="overlay">
    <div class="h-full  overflow-y-scroll scrolling-touch">
      <div class="bg-yellow-400 p-3 text-bold cursor-pointer block" @click="onBack">
        ← Back
      </div>
      <!-- {{ config }} -->
      <PrayerDetailView @config="$emit('config', $event)" :config="config" @overlay="$emit('overlay', $event)" :prayerID="config.prayerID"></PrayerDetailView>
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
      Auth: Auth
    }
  },
  mounted () {
  },
  methods: {
    onBack () {
      this.$emit('overlay', this.config.back)
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
