<template>
  <div v-if="profile" class="rounded-lg p-2 border border-gray-400" :style="{
  }" style="background-color: rgba(255,255,255,0.5)">

    <div :style="{
      backgroundImage: `url(${profile.bgImg})`
    }" class="m-2 mt-0 p-2 rounded-lg bg-gray-300 bg-cover bg-center max-w-md mx-auto py-12">
      <div class="w-full mb-3 flex justify-center">
        <div class="w-24 h-24">
          <img :src="profile.photoImg" class="w-24 h-24 object-center object-cover rounded-full border-2 shadow-xl border-white" alt="">
        </div>
      </div>
    </div>

    <div v-if="profile.displayName" class="w-full flex text-lg justify-center items-center">
      {{ profile.displayName }}  <span class="mx-1 text-2xl text-white bg-blue-500 w-8 h-8 inline-flex justify-center items-center text-center rounded-full" v-if="profile.christian">✞</span> <img v-if="profile.verified" class="w-5 h-5 ml-1" src="../img/verified.svg">
    </div>
    <div v-if="profile.displayName" class="w-full text-sm text-gray-600 mb-3 flex justify-center items-center">
      <span>@{{ node.value.username }} </span>
    </div>

    <div class="w-full flex justify-center">
      <a class="mb-3 inline-block" target="_blank" :href="profile.facebookURL" v-if="profile.facebookURL" ><img class="mx-1" src="../img/fb.svg" alt="Facebook"></a>
      <a class="mb-3 inline-block" target="_blank" :href="profile.instagramURL" v-if="profile.instagramURL" ><img class="mx-1" src="../img/ig.svg" alt="Instagram"></a>
      <a class="mb-3 inline-block" target="_blank" :href="profile.twitterURL" v-if="profile.twitterURL" ><img class="mx-1" src="../img/twitter.svg" alt="Twitter"></a>
      <a class="mb-3 inline-block" target="_blank" :href="profile.youtubeURL"  v-if="profile.youtubeURL"><img class="mx-1" src="../img/youtube.svg" alt="Yotuube"></a>
    </div>

    <div v-if="profile.bio" class="w-full mb-3 flex justify-center">
      {{ profile.bio }}
    </div>

    <!-- <pre>{{ profile }}</pre> -->
  </div>
  <div v-else-if="profile === null" style="background-color: rgba(255,255,255,0.5)" class="border border-gray-400 max-w-xl mx-auto text-center rounded-lg p-2">
    <div :style="{}" class="m-2 mt-0 p-2 rounded-lg bg-cover bg-center max-w-md mx-auto py-12 bg-gray-300">
      <div class="w-full mb-3 flex justify-center">
        <div class="w-24 h-24">
          <div class="w-24 h-24 object-center object-cover rounded-full bg-gray-400"></div>
        </div>
      </div>
    </div>
    <div class="w-full flex flex-col justify-center items-center  mb-3">
      <div class="w-24 h-6 bg-gray-300 rounded-full"></div>
    </div>
    <div class="w-full flex flex-col justify-center items-center  mb-3">
      <div class="w-32 h-6 bg-gray-300 rounded-full"></div>
    </div>
  </div>
  <div v-else-if="!profile" class="max-w-xl mx-auto text-center pt-3">
    Can't Load Profile
  </div>
</template>

<script>
import { Profile } from '../../../../APIs/KA.js'

export default {
  props: {
    isMe: {},
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
