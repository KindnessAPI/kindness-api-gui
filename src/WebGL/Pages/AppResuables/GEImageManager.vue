<template>
  <div class="p-3 max-w-4xl h-full overflow-auto max-w-full">
    <div class="">
      <!-- <button v-if="close" class="block font-bold underline" @click="">Close</button> -->
      <button v-if="close" class="inline-block mx-2 py-2 px-3 bg-orange-500 hover:bg-orange-400 rounded-lg text-white" @click="$emit('close')">Back</button>
      <GEImageUpload class="inline-block mx-2" :multiple="true" @data="files.unshift($event)"></GEImageUpload>
      <button v-if="files && files.some(e => e.selected)" class="inline-block mx-2 py-2 px-3 bg-red-500 hover:bg-red-400 rounded-lg text-white" @click="deleteSelected()">Remove Selected</button>
      <button v-if="loading" class="inline-block mx-2 py-2 px-3 bg-blue-500 rounded-lg text-white">Loading...</button>
    </div>
    <table>
      <tr>
        <th class="p-2 text-center"><button class="m-2 ml-0 py-2 px-3 bg-teal-500 hover:bg-teal-400 rounded-lg text-white" @click="selAll(files)">Select All</button></th>
        <th v-if="pick">Pick</th>
        <th class="p-2 text-center">Preview</th>
        <th class="p-2 text-center" v-if="view === 'full'">Small</th>
        <th class="p-2 text-center" v-if="view === 'full'">Optimised Img</th>
        <th class="p-2 text-center" v-if="view === 'full'">Ext</th>
        <th class="p-2 text-center" v-if="view === 'full'">Mime</th>
      </tr>
      <tr>
        <td v-if="loading" :colspan="pick ? 7 : 6" class="text-center">Loading</td>
      </tr>
      <tr :key="file._id" v-for="file in files">
        <td class="m-1 ml-0 flex justify-center py-2">
          <input type="checkbox" class="inline-block" v-model="file.selected" @change="$forceUpdate()">
        </td>
        <td class="p-2 text-center" v-if="pick">
          <button class="m-2 py-2 px-3 bg-teal-500 hover:bg-teal-400 rounded-lg text-white" @click="$emit('pick', { file, ...MyFiles.getURLfromCloudinary({ cloudinary: file.cloudinary }) })">Pick</button>
        </td>
        <td class="m-1">
          <a :href="file.cloudinary.secure_url" target="_blank">
            <img class="w-12 h-12 m-1 object-cover object-center rounded-full" :src="file.cloudinary.secure_url.replace('/upload/', '/upload/w_256,h_256,c_fill,g_auto:0,q_auto/')" alt="">
          </a>
        </td>
        <td v-if="view === 'full'" class="m-1"><textarea @click="$event.target.select()" :value="file.cloudinary.secure_url.replace('/upload/', '/upload/q_auto/h_200/')" rows="1" cols="10" class="p-2 border-gray-800 border m-1 resize-none"></textarea></td>
        <td v-if="view === 'full'" class="m-1"><textarea @click="$event.target.select()" :value="file.cloudinary.secure_url.replace('/upload/', '/upload/q_auto/')" rows="1" cols="10" class="p-2 border-gray-800 border m-1 resize-none"></textarea></td>
        <td v-if="view === 'full'" class="m-1">{{file.ext}}</td>
        <td v-if="view === 'full'" class="m-1">{{file.mime}}</td>
      </tr>
    </table>
    <!-- <pre>{{ files }}</pre> -->
  </div>
</template>

<script>
import { MyFiles, Auth } from '../../../APIs/KA'

export default {
  props: {
    close: {
      default: false
    },
    pick: {
      default: false
    }
  },
  components: {
    GEImageUpload: require('./GEImageUpload.vue').default
  },
  data () {
    return {
      view: 'mini',
      MyFiles,
      pageAt: 0,
      perPage: 150,
      loading: false,
      confirmBeforeDelete: true,
      files: false
    }
  },
  mounted () {
    this.getFiles()
  },
  methods: {
    selAll (files) {
      if (files) {
        if (!files.some(e => e.selected)) {
          files.forEach(e => {
            e.selected = true
          })
        } else {
          files.forEach(e => {
            e.selected = false
          })
        }
        this.$forceUpdate()
      }
    },
    async getFiles () {
      this.loading = true
      let userID = Auth.currentProfile.user.userID
      this.files = await MyFiles.getMyFiles({ userID, pageAt: this.pageAt, perPage: this.perPage })
      this.loading = false
    },
    async deleteSelected () {
      if (!this.confirmBeforeDelete || window.confirm(`Remove Selected?`)) {
        try {
          this.loading = true
          let objs = this.files.filter(e => e.selected)
          await MyFiles.deleteCloudinaryFileByList({ objs })
          this.files = this.files.filter(e => !e.selected)
          this.files.forEach(e => {
            e.selected = false
          })
          await this.getFiles()
          this.loading = false
        } catch (e) {
          console.log(e)
          await this.getFiles()
        }
      }
    }
  }
}
</script>

<style>

</style>
