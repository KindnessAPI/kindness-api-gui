<template>
  <div>
    <div class="mb-3 text-xl">
      Profile Edit
    </div>
    <div v-if="profile">
      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Display Name</div>
        <textarea placeholder="Display name" v-model="profile.displayName" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>
      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Bio</div>
        <textarea placeholder="Bio" v-model="profile.bio" cols="36" rows="5" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Instagram</div>
        <textarea placeholder="Instagram" v-model="profile.instagramURL" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Youtube</div>
        <textarea placeholder="Youtube" v-model="profile.youtubeURL" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Twitter</div>
        <textarea placeholder="Twitter" v-model="profile.twitterURL" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Profile Image</div>
        <img :src="profile.photoImg" class="border w-16 h-16 m-1" alt="">
        <textarea placeholder="Profile image link" v-model="profile.photoImg" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Background Image</div>
        <div>
          <img :src="profile.bgImg" class="border w-16 h-16 m-1 inline-block" alt="">
        </div>
        <textarea placeholder="Background image link" v-model="profile.bgImg" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Loading Screen Image</div>
        <div>
          <img :src="profile.loadingImg" class="border w-16 h-16 m-1 inline-block" alt="">
        </div>
        <textarea placeholder="Loading screen image link" v-model="profile.loadingImg" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
      </div>
      <div class="mb-3">
        <ReButton :color="'green'" @click="updateProfile()">Save Profile <span v-if="loading">⏱</span></ReButton>
      </div>
    </div>
    <div v-else>
      Loading Profile
    </div>

    <!-- <pre v-if="profile">{{ profile }}</pre> -->
  </div>
</template>

<script>
import { Profile, Auth } from '../../../../APIs/KA.js'
export default {
  props: {
    node: {}
  },
  components: {
    ReButton: require('../../AppResuables/ReButton.vue').default
  },
  data () {
    return {
      loading: false,
      profile: false
    }
  },
  async mounted () {
    await this.initProfile()
  },
  methods: {
    async initProfile () {
      try {
        let me = Auth.currentProfile.user
        let profile = await Profile.getProfileByUserID({ userID: me.userID })
        if (!profile) {
          profile = await Profile.createProfile({ userID: me.userID, username: me.username, photo: this.node.img })
        }
        this.profile = profile
      } catch (e) {
        console.log(e)
      }
    },
    async updateProfile () {
      try {
        this.loading = true
        await Profile.updateProfile({ edit: this.profile })
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
