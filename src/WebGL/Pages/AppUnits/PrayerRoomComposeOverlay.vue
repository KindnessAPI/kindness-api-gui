<template>
  <div class="overlay">
    <!--  -->

    <div class="h-full  overflow-y-scroll scrolling-touch">
      <div class="bg-yellow-400 p-3 text-bold cursor-pointer block" @click="onBack">
        ← Back
      </div>

      <div v-if="bell" class="p-3">
        <!-- {{ config }} -->
        <PrayerComposerView :locksender="true" :socket="bell" :config="config" :prayFor="config.prayFor"></PrayerComposerView>
      </div>

    </div>
  </div>
</template>

<script>
import { Auth } from '../../../APIs/KA'

export default {
  props: {
    bell: {},
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
      Auth: Auth
    }
  },
  methods: {
    onBack () {
      if (this.config.backData) {
        this.$emit('conifg', {
          ...this.config.backData
        })
      }
      this.$emit('overlay', this.config.back)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
.item-unit{
  height: calc(100% - 60px);
}
</style>
