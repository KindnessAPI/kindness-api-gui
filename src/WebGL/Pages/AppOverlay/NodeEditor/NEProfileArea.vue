<template>
  <div v-if="profile" class="pt-3">
    <div class="w-full mb-3 flex justify-center">
      <div class="w-24 h-24">
        <img :src="profile.photoImg" class="w-24 h-24 object-center object-cover rounded-full border-gray-700" alt="">
      </div>
    </div>
    <div class="w-full mb-3 flex justify-center items-center">
      {{ profile.displayName }} <img v-if="profile.verified" class="w-5 h-5 ml-1" src="../img/verified.svg">
    </div>

    <div class="w-full mb-3 flex justify-center">
      <a target="_blank" :href="profile.facebookURL"><img class="m-1" v-if="profile.facebookURL" src="../img/fb.svg" alt="Facebook"></a>
      <a target="_blank" :href="profile.instagramURL"><img class="m-1" v-if="profile.instagramURL" src="../img/ig.svg" alt="Instagram"></a>
      <a target="_blank" :href="profile.twitterURL"><img class="m-1" v-if="profile.twitterURL" src="../img/twitter.svg" alt="Twitter"></a>
      <a target="_blank" :href="profile.youtubeURL"><img class="m-1" v-if="profile.youtubeURL" src="../img/youtube.svg" alt="Yotuube"></a>
    </div>

    <div class="w-full mb-3 flex justify-center">
      {{ profile.bio }}
    </div>

    <!-- <pre>{{ profile }}</pre> -->
  </div>
  <div v-else-if="profile === null" class="max-w-xl mx-auto text-center pt-3">
    Loading Profile...
  </div>
  <div v-else-if="!profile" class="max-w-xl mx-auto text-center pt-3">
    Can't Load Profile
  </div>
</template>

<script>
import { Profile } from '../../../../APIs/KA.js'

export default {
  props: {
    node: {}
  },
  data () {
    return {
      profile: null
    }
  },
  mounted () {
    this.getProfile()
  },
  methods: {
    async getProfile () {
      let userID = this.node.value.userID
      let profile = await Profile.getProfileByUserID({ userID })
      this.profile = profile
    }
  }
}
</script>

<style scoped>
.min-height-profile{
  min-height: 240px;
}
</style>
