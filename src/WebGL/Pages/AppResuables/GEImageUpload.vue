<template>
  <div>
    <div class="hidden" ref="mounter"></div>
    <ReButton :color="'teal'" @click="upload">
      <span v-if="state === 'ready'">{{ label }}</span>
      <span v-if="state === 'uploading'">Uploading</span>
    </ReButton>
  </div>
</template>

<script>
// import loadImage from 'blueimp-load-image'
import { MyFiles } from '../../../APIs/KA'
// import smartcrop from 'smartcrop'
import imageCompression from 'browser-image-compression'
import axios from 'axios'

export default {
  props: {
    square: {
      default: false
    },
    limit: {
      default: 1.5
    },
    label: {
      default: 'Upload'
    }
  },
  components: {
    ReButton: require('./ReButton.vue').default
  },
  data () {
    return {
      state: 'ready',
      MyFiles
    }
  },
  methods: {
    // q_auto
    upload () {
      let filer = document.createElement('input')
      filer.type = 'file'
      filer.accept = 'image/*'
      this.$refs['mounter'].appendChild(filer)
      filer.onchange = async (evt) => {
        let files = evt.target.files
        let file = files[0]
        if (file) {
          this.state = 'uploading'
          try {
            const options = {
              maxSizeMB: 2, // (default: Number.POSITIVE_INFINITY)
              maxWidthOrHeight: 2048, // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
              useWebWorker: true, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
              maxIteration: 4 // optional, max number of iteration to compress the image (default: 10)
            }
            let compressedImage = await imageCompression(file, options)

            let url = MyFiles.UPLOAD_URL
            let formData = new FormData()

            formData.append('file', compressedImage)
            formData.append('upload_preset', 'kindness-api')

            var config = {
              onUploadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                console.log(percentCompleted)
                this.progress = percentCompleted
                this.$forceUpdate()
              }
            }

            let res = await axios.post(url, formData, config)
            let cloudinary = res.data
            let iurl = cloudinary.secure_url

            // https://res.cloudinary.com/ht8mcws2o/image/upload/c_scale,w_150/v1570172749/spaceboard/fbb9uqtegper8vhy68dc.png
            // http://res.cloudinary.com/ht8mcws2o/image/upload/v1570172749/spaceboard/fbb9uqtegper8vhy68dc.png

            iurl = iurl.replace(`/upload/`, `/upload/q_auto/`)

            // let base64 = await MyFiles.imageToURI(compressed.image)
            // let resCloud = await new Promise((resolve, reject) => {
            //   cloudinary.uploader.upload(base64, (error, result) => {
            //     if (error) {
            //       reject(error)
            //     } else {
            //       resolve(result)
            //     }
            //   })
            // })
            // console.log(resCloud)

            let mime = file.type
            let filename = file.name
            let ext = file.name.split('.').pop()
            // let size = file.size
            let dbData = await MyFiles.createCloudinaryFile({ filename, ext, mime, cloudinary })
            // let url = dbData.cloudinary.secure_url
            // let qAutoURL = url.replace(`/image/upload/`, `/image/upload/q_auto/`)
            this.$emit('data', dbData)
            this.$emit('url', iurl)
          } catch (e) {
            console.log(e)
          }
          this.state = 'ready'
        }
      }
      filer.click()

      console.log('123')
    }
  }
}

/*
https://res.cloudinary.com/demo/image/upload/w_600/q_auto/kindness-api/qieo9ie7neasojqwauyz.jpg
https://res.cloudinary.com/loklok-keystone/image/upload/q_auto/v1589108007/kindness-api/qieo9ie7neasojqwauyz.png?q_auto
{
  "_id": "5eb7dd25fd607c8ecbc304bc",
  "userID": "5eade068c6207b1008c9eb23",
  "username": "wonglok831",
  "filename": "95703651_527768737912486_8735652730590199808_n.jpg",
  "ext": "jpg",
  "mime": "image/jpeg",
  "tags": [],
  "cloudinary": {
    "asset_id": "238eb0b6a696bf542247a77a732a93a8",
    "public_id": "kindness-api/qieo9ie7neasojqwauyz",
    "version": 1589108007,
    "version_id": "1ccac453996ae25d81d09400796b313a",
    "signature": "2264ac954c3a2e992eceb67ab4f0699ea8f9d060",
    "width": 591,
    "height": 455,
    "format": "png",
    "resource_type": "image",
    "created_at": "2020-05-10T10:53:27Z",
    "tags": [],
    "bytes": 276260,
    "type": "upload",
    "etag": "5d8543d46320abe6037187fc22248d12",
    "placeholder": false,
    "url": "http://res.cloudinary.com/loklok-keystone/image/upload/v1589108007/kindness-api/qieo9ie7neasojqwauyz.png",
    "secure_url": "https://res.cloudinary.com/loklok-keystone/image/upload/v1589108007/kindness-api/qieo9ie7neasojqwauyz.png",
    "access_mode": "public"
  },
  "created_at": "2020-05-10T10:53:27.981Z",
  "updated_at": "2020-05-10T10:53:27.981Z",
  "__v": 0
}
 */
</script>

<style>

</style>
