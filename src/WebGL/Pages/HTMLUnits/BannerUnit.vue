<template>
  <div class="" style="margin-top: -1px;">

    <ScissorArea class="h-min100 lg:h-min60" style="z-index: -1;">
      <div slot="dom" class="full">
      </div>
      <BannerScene slot="o3d"></BannerScene>
    </ScissorArea>

  </div>
</template>

<script>
import { Auth } from '../../../APIs/KA'
export default {
  components: {
    ...require('../../webgl').default
  },
  data () {
    return {
      Auth
    }
  }
}
</script>

<style scoped>

</style>
