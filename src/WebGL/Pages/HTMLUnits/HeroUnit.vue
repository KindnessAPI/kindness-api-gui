<template>
  <div class="">

    <div class="flex flex-col lg:flex-row">

      <div class="lg:w-1/2 relative">
        <ScissorArea class="lg:absolute top-0 left-0 right-0 bottom-0 h-min100 lg:h-auto" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <HeroScene slot="o3d"></HeroScene>
        </ScissorArea>
        <!--  -->
      </div>
      <div class="lg:w-1/2 relative">
        <!-- <ScissorArea class="absolute top-0 left-0 right-0 bottom-0" style="z-index: -1;">
          <div slot="dom" class="full">
          </div>
          <HowScene slot="o3d"></HowScene>
        </ScissorArea> -->

        <div class="px-3 max-w-xl mx-auto  py-24 lg:py-32 xl:py-64">
          <div class="px-3 mb-3 text-3xl md:text-4xl font-bold">
            TogetherTime.me ✞ ✨
          </div>

          <div>
            <div class="px-3 mb-3" v-if="!Auth.currentProfile">
              Hi! I'm <a target="_blank" class="font-bold underline" href="https://www.instagram.com/wonglok831/">@wonglok831</a> ↗
            </div>

            <div class="px-3 mb-3">
              1. <router-link class="font-bold underline inline-block" to="/prayer-room-intro">Share your Prayer / Story 🙏🏻</router-link>
            </div>

            <div class="px-3 mb-3">
              2. <router-link class="font-bold underline inline-block" to="/make-friends-intro">Fostering International Friendship 👨🏼‍💻</router-link>
            </div>

            <div class="px-3 mb-3">
              3. <router-link class="font-bold underline inline-block" to="/thank-you-gospel">My testimonal and personal story</router-link> 🥰
            </div>

            <div class="px-3 mb-3">
              I made this place to praise Dear God's and Dear Jesus' Grace and Mercy.
            </div>

            <div class="px-3 mb-3" v-if="!Auth.currentProfile">
              <span class="text-xl font-bold mb-3 block">Let's Go!</span>
              <router-link class="font-bold underline inline-block mr-3" to="/register">Register</router-link>
              <router-link class="font-bold underline inline-block mr-3" to="/login">Login</router-link>
            </div>
          </div>

          <div class="px-3 mb-3 mt-5" v-if="Auth.currentProfile">
            <div class="text-xl font-bold mb-3 block">Welcome Back!! @{{ Auth.currentProfile.user.username }}</div>
            <router-link class="underline inline-block mr-3" to="/galaxy">Let's Go Home.</router-link>
          </div>

        </div>
      </div>
    </div>

    <!-- -->

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
      Auth: Auth
    }
  }
}
</script>

<style scoped>

</style>
