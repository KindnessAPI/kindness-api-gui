<template>
  <div class="overlay">
    <!--  -->

    <div class="h-full  overflow-y-scroll scrolling-touch">
      <div class="bg-yellow-400 p-3 text-bold cursor-pointer block" @click="$emit('overlay', config.back)">
        ← Back
      </div>

      <div v-if="bell" class="p-3">
        <PrayerComposerView :locksender="true" :socket="bell" :prayFor="config.prayFor"></PrayerComposerView>
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
  mounted () {
  }
}
</script>

<style scoped>
.item-unit{
  height: calc(100% - 60px);
}
</style>
