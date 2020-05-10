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
        <textarea placeholder="Profile image link" v-model="profile.photoImg" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
        <div class="">
          <img :src="profile.photoImg" class="border w-16 h-16 m-1 inline-block object-center object-cover" alt="">
          <!-- <GEProfileUpload @url="profile.photoImg = $event; updateProfile({ close: false })"></GEProfileUpload> -->
          <GEImageUpload class="inline-block" @thumb="profile.photoImg = $event; updateProfile({ close: false })" :label="loading ? 'Saving' : 'Upload Image'"></GEImageUpload>
          <ReButton @click="pickMyImage({ getter: (v) => v.thumb, setter: (v) => { profile.photoImg = v } })">Pick Image</ReButton>
        </div>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3 mb-2">Background Image</div>
        <!-- <div class="mb-2">Example Images...</div>
        <div>
          <img @click="profile.bgImg = img.img" class="border w-16 h-16 m-1 inline-block object-center object-cover" :key="img.key" v-for="img in imgs" :src="img.img" :alt="img.key">
        </div> -->
        <textarea placeholder="Background image link" v-model="profile.bgImg" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
        <div>
          <img :src="profile.bgImg" class="border w-16 h-16 m-1 inline-block object-center object-cover" alt="">
          <GEImageUpload class="inline-block" @url="profile.bgImg = $event; updateProfile({ close: false })" :label="loading ? 'Saving' : 'Upload Image'"></GEImageUpload>
          <ReButton @click="pickMyImage({ getter: (v) => v.img, setter: (v) => { profile.bgImg = v } })">Pick Image</ReButton>
        </div>
      </div>

      <div class="mb-3 border-l border-black hover:border-green-400 pl-3">
        <div class="text-lg mt-3">Loading Screen Image</div>
        <!-- <div class="mb-2">Example Images...</div>
        <div>
          <img @click="profile.loadingImg = img.img" class="border w-16 h-16 m-1 inline-block object-center object-cover" :key="img.key" v-for="img in imgs" :src="img.img" :alt="img.key">
        </div> -->
        <textarea placeholder="Loading screen image link" v-model="profile.loadingImg" cols="36" rows="1" class="max-w-full rounded-none bg-transparent whitespace-pre-line resize-none px-0 py-2 mb-3 border-b border-black inline-block"></textarea>
        <div>
          <img :src="profile.loadingImg" class="border w-16 h-16 m-1 inline-block object-center object-cover" alt="">
          <GEImageUpload class="inline-block" @url="profile.loadingImg = $event; updateProfile({ close: false })" :label="loading ? 'Saving' : 'Upload Image'"></GEImageUpload>
          <ReButton @click="pickMyImage({ getter: (v) => v.img, setter: (v) => { profile.loadingImg = v } })">Pick Image</ReButton>
        </div>
      </div>

      <div class="mb-3">
        <ReButton :color="'green'" @click="updateProfile({ close: true })">Save All Settings & Close <span v-if="loading">⏱</span></ReButton>
      </div>
    </div>
    <div v-else>
      Loading Profile
    </div>

    <div class="absolute top-0 left-0 right-0 bottom-0 translucent" v-if="accessor">
      <GEImageManager :close="true" @close="accessor = false" :pick="true" @pick="onPick"></GEImageManager>
    </div>

    <!-- <pre v-if="profile">{{ profile }}</pre> -->
  </div>
</template>

<script>
import { Profile, Auth, Graph } from '../../../../APIs/KA.js'
export default {
  props: {
    node: {}
  },
  components: {
    // GEProfileUpload: require('../../AppResuables/GEProfileUpload.vue').default,
    GEImageManager: require('../../AppResuables/GEImageManager.vue').default,
    GEImageUpload: require('../../AppResuables/GEImageUpload.vue').default,
    ReButton: require('../../AppResuables/ReButton.vue').default
  },
  data () {
    return {
      accessor: false,
      imgs: require('../../../imgs').default,
      loading: false,
      profile: false
    }
  },
  async mounted () {
    await this.initProfile()
  },
  methods: {
    pickMyImage (v) {
      this.accessor = v
    },
    async onPick (arg) {
      if (this.accessor) {
        let v = this.accessor.getter(arg)
        this.accessor.setter(v)
        this.accessor = false
        await this.updateProfile({ close: false })
      }
    },
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
    async updateProfile ({ close }) {
      try {
        this.loading = true
        await Profile.updateProfile({ edit: this.profile })
        let myNode = {
          _id: this.node._id,
          name: this.profile.displayName,
          img: this.profile.photoImg
        }
        await Graph.updateMyNode({ edit: myNode })
        if (close) {
          this.$emit('close')
        }
        window.dispatchEvent(new Event('reload-graph'))
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.translucent{
  background-color: rgba(255,255,255,0.95);
}
</style>
